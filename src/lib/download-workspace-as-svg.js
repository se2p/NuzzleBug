import ScratchBlocks from 'scratch-blocks';

// Proof of Concept for exporting the workspace as an SVG file. The current approach is destructive,
// as changes are made to the workspace element directly. A better way might be to clone the workspace
// node and work on that.

/**
 * Explicitly assign computed styles recursively, as elements on
 * the workspace partially get their style from the assigned CSS classes.
 *
 * @param element the DOM-tree element to work on
 */
const applyComputedStylesRecursively = element => {
    const computedStyles = window.getComputedStyle(element);

    for (let i = 0; i < computedStyles.length; i++) {
        const styleName = computedStyles[i];
        const styleValue = computedStyles.getPropertyValue(styleName);

        element.style.setProperty(styleName, styleValue);
    }

    for (const child of element.children) {
        applyComputedStylesRecursively(child);
    }
};

/**
 * Images, such as the icons on blocks, are not embedded but linked via
 * the xlink:href attribute. To ensure the resulting SVG is independent,
 * these images need to be embedded instead of referenced.
 *
 * @param svgElement the svg element to work on
 * @returns {Promise<void>} returns after all images are embedded
 */
const embedXlinkImages = async svgElement => {
    const images = svgElement.querySelectorAll('image');

    for (const imgElement of images) {
        const xlinkHref = imgElement.getAttribute('xlink:href');

        if (xlinkHref) {
            try {
                const response = await fetch(xlinkHref);

                if (response.ok) {
                    const blob = await response.blob();
                    const reader = new FileReader();

                    reader.onloadend = () => {
                        const base64Image = reader.result;
                        imgElement.setAttribute('xlink:href', base64Image);
                        // imgElement.setAttribute('href', base64Image);
                    };

                    reader.readAsDataURL(blob);
                } else {
                    console.error(`Failed to fetch image at ${xlinkHref}`);
                }
            } catch (error) {
                console.error('Error fetching the image:', error);
            }
        }
    }
};

const downloadSVG = svgElement => {
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], {type: 'image/svg+xml'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modified-image.svg';
    link.click();
};

/**
 * Downloads the current workspace as an SVG file. Destructive, as changes
 * are made to the workspace element directly.
 *
 * @returns {Promise<void>} returns after the download was initiated
 */
export const downloadWorkspace = async () => {
    const svgElement = ScratchBlocks.getMainWorkspace()
        .getParentSvg();

    await embedXlinkImages(svgElement);
    applyComputedStylesRecursively(svgElement);
    downloadSVG(svgElement);
};

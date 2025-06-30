import React from 'react';

import styles from '../../styles/tutorial-code-quality.css';
import ScratchBlocks from 'scratchblocks-react';
import scratchblocks from 'scratchblocks';
import de from 'scratchblocks/locales/de.json';

scratchblocks.loadLanguages({de});

const translate = (scratchBlocksText: string, locale: string): string => {
    const block = scratchblocks.parse(scratchBlocksText, {
        languages: ['en', 'de']
    });
    if (locale === 'de') {
        block.translate(scratchblocks.allLanguages.de);
    }
    return block.stringify();
};

interface ScratchBlocksImageProps {
    scratchBlocksText: string;
    locale: string;
}

const ScratchBlocksImage = (props: ScratchBlocksImageProps) => (
    <div className={styles.scratchImage}>
        <ScratchBlocks
            blockStyle="scratch3"
            languages={['en', 'de']}
        >
            {translate(props.scratchBlocksText, props.locale)}
        </ScratchBlocks>
    </div>
);

export default ScratchBlocksImage;

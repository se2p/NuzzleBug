import styles from '../../styles/tutorial-cards.css';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Component for downloading files required for the tutorial.
 *
 * @param downloadContent content to be downloaded.
 * @param onDownload action performed for downloading files.
 * @param downloadButtonTitle name of the button, that performs onClick the onDownload function
 * @constructor
 */

const Download = ({downloadContent, onDownload, downloadButtonTitle}) => (
    <div className={styles.introDownloadContainer}>
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >
            <p className={styles.introDownloadText}> {downloadContent.title}</p>
            <img
                className={styles.introImage}
                draggable={false}
                src={downloadContent.content}
                alt={'picture of the download'}
            />
            <div
                className={styles.introDownloadButton}
                /* eslint-disable-next-line react/jsx-no-bind */
                onClick={() => onDownload(downloadContent.title, downloadContent.content)}
            >
                <span className={styles.stepTestingButtonTitle}> {downloadButtonTitle} </span>
            </div>
        </div>
    </div>
);
Download.propTypes = {
    downloadContent: PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.node.isRequired
    }),
    downloadButtonTitle: PropTypes.string.isRequired,
    onDownload: PropTypes.func.isRequired
};

/**
 * Component that introduces the selected tutorial and provides functionality to download required files.
 *
 * @param content content of the file to download
 * @param onDownload action performed for downloading files.
 * @param downloadButtonTitle name of the button, that performs onClick the onDownload function
 * @constructor
 */

const Intro = ({content, onDownload, downloadButtonTitle}) => (
    <div className={styles.tutorialStep}>
        <h4 className={styles.stepTitle}> {content.title} </h4>
        <p className={styles.stepInstructions}> {content.message} </p>
        {Array(content.download.length).fill(0)
            .map((_, i) => (
                <Download
                    key={i}
                    downloadContent={content.download[i]}
                    onDownload={onDownload}
                    downloadButtonTitle={downloadButtonTitle}
                />
            ))}
    </div>
);
Intro.propTypes = {
    content: PropTypes.shape({
        title: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        download: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isRequired,
                content: PropTypes.node.isRequired
            })
        )
    }),
    downloadButtonTitle: PropTypes.string.isRequired,
    onDownload: PropTypes.func.isRequired
};

export default Intro;

import styles from './tutorial-cards.css';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import React from 'react';

const Download = ({downloadContent, onDownload, downloadButtonTitle}) => (
    <div className={styles.introDownloadContainer}>
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
);
Download.propTypes = {
    downloadContent: PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.node.isRequired
    }),
    downloadButtonTitle: PropTypes.string.isRequired,
    onDownload: PropTypes.func.isRequired
};

const TutorialIntro = ({content, onDownload, downloadButtonTitle}) => (
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
TutorialIntro.propTypes = {
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

export default injectIntl(TutorialIntro);

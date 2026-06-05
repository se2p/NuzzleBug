import React from 'react';
import PropTypes from 'prop-types';
import styles from '../tutorial/styles/tutorial-cards.css';
import TutorialOutputText from '../tutorial/tutorial-output-text.jsx';

/**
 * Download sub-component used inside Intro.
 * Moved into tutorial_creation (was previously in tutorial-card-step, removed in develop
 * as unused in the main tutorial flow — kept here for Tutorial Creation preview).
 */
export const Download = ({downloadContent, onDownload, downloadButtonTitle, fullWidth}) => (
    <div
        className={styles.introDownloadContainer}
        style={fullWidth ? {width: '100%'} : {}}
    >
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
    onDownload: PropTypes.func.isRequired,
    fullWidth: PropTypes.bool
};

/**
 * Intro preview component for Tutorial Creation.
 */
export const Intro = ({content, onDownload, downloadButtonTitle}) => (
    <div className={styles.tutorialStep}>
        <h4 className={styles.stepTitle}> {content.title} </h4>
        <img
            className={styles.stepImage}
            draggable={false}
            src={content.img}
            alt={'Image of the current step.'}
        />
        <TutorialOutputText
            content={content.message}
        />
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
        img: PropTypes.node.isRequired,
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

/**
 * Success/EndCard preview component for Tutorial Creation.
 */
export const Success = ({content, homeButtonTitle, onHome, hideButton}) => (
    <div className={styles.tutorialStep}>
        <h4 className={styles.stepTitle}> {content.title} </h4>
        <img
            style={{
                height: '200px',
                marginTop: '15px'
            }}
            draggable={false}
            src={content.img}
            alt={'Cat cheering and celebrating.'}
        />
        <TutorialOutputText
            content={content.message}
        />
        {hideButton ? null : (
            <div
                className={styles.successHomeButton}
                onClick={onHome}
            >
                <span className={styles.stepTestingButtonTitle}>{homeButtonTitle}</span>
            </div>
        )}
    </div>
);
Success.propTypes = {
    content: PropTypes.shape({
        title: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        img: PropTypes.node.isRequired
    }),
    onHome: PropTypes.func.isRequired,
    homeButtonTitle: PropTypes.string.isRequired,
    hideButton: PropTypes.bool
};

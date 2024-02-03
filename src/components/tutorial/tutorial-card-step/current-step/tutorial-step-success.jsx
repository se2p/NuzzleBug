import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import styles from '../../styles/tutorial-cards.css';

const TutorialStepSuccess = ({content, homeButtonTitle, onHome}) => (
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
        <p className={styles.stepInstructions}> {content.message} </p>
        <div
            className={styles.successHomeButton}
            onClick={onHome}
        >
            <span className={styles.stepTestingButtonTitle}>{homeButtonTitle}</span>
        </div>
    </div>
);
TutorialStepSuccess.propTypes = {
    content: PropTypes.shape({
        title: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        img: PropTypes.node.isRequired
    }),
    onHome: PropTypes.func.isRequired,
    homeButtonTitle: PropTypes.func.isRequired
};

export default injectIntl(TutorialStepSuccess);

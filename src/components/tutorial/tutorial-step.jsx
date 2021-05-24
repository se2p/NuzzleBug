import React from 'react';
import PropTypes from 'prop-types';
import styles from './tutorial-cards.css';
import checkmark from './icon--checkmark.png';
import crossMark from './icon--cross-mark.png';

const TutorialStep = ({step, tested, onTest, success, testButtonVisible}) => (
    <div className={styles.tutorialStep}>
        <h4 className={styles.stepTitle}>{step.title} </h4>
        <p className={styles.stepInstructions}> {step.message1} </p>
        <img
            className={styles.stepImage}
            draggable={false}
            src={step.img}
        />
        <p className={styles.stepInstructions}> {step.message2} </p>
        <div
            className={styles.stepTesting}
            onClick={onTest}
        >
            { testButtonVisible ? <div className={styles.stepTestingButton} >
                <span className={styles.stepTestingButtonTitle}>Test</span>
            </div> : null}
            {tested ?
                (success ?
                    <p className={styles.stepTestingSuccess}>
                        <img
                            style={{height: '20px', verticalAlign: 'middle'}}
                            src={checkmark}
                            /* eslint-disable-next-line react/jsx-no-literals */
                        /> Congratulations. Your Solution was correct.
                    </p> :
                    <p className={styles.stepTestingFail}>
                        <img
                            style={{height: '20px', verticalAlign: 'middle'}}
                            src={crossMark}
                            /* eslint-disable-next-line react/jsx-no-literals */
                        /> I am sorry. You have failed.
                    </p>
                ) : null}
        </div>
        {tested && !success ?
            <p className={styles.stepTestingFail}>Test ... failed. please check the Output and try it again</p> : null}
    </div>
);
TutorialStep.propTypes = {
    step: PropTypes.shape({
        title: PropTypes.string.isRequired,
        message1: PropTypes.string.isRequired,
        img: PropTypes.node.isRequired,
        message2: PropTypes.string.isRequired
    }),
    tested: PropTypes.bool.isRequired,
    onTest: PropTypes.func.isRequired,
    success: PropTypes.bool.isRequired,
    testButtonVisible: PropTypes.bool.isRequired
};

export default TutorialStep;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './tutorial-cards.css';

import checkmark from './icon--checkmark.png';
import crossMark from './icon--cross-mark.png';
import arrow from './icon--arrow.svg';
import solutionIMG from './solution_example.png';

const TutorialStep = ({step, tested, onTest, success, testButtonVisible, failureMessage, solution, solutionVisible, solutionExpanded, onSolution}) => (
    <div className={styles.tutorialStep}>
        <h4 className={styles.stepTitle}>{step.title} </h4>
        <p className={styles.stepInstructions}> {step.message1} </p>
        <img
            className={styles.stepImage}
            draggable={false}
            src={step.img}
        />
        <p className={styles.stepInstructions}> {step.message2} </p>
        <div style={{'margin-bottom': '20px'}}>
            {solutionVisible ? <>
                <div
                    className={styles.stepSolutionHeader}
                    onClick={onSolution}
                >
                    <p className={styles.stepSolutionHeaderTitle}> Solution </p>
                    <img
                        className={solutionExpanded ? styles.stepSolutionHeaderArrowDown : styles.stepSolutionHeaderArrowUp}
                        src={arrow}
                    />
                </div>
                {solutionExpanded ?
                    <div className={styles.stepSolutionContainer}>
                        <img
                            className={styles.stepSolutionImage}
                            src={solutionIMG}
                            draggable={false}
                        />
                        <p className={styles.stepSolutionText}> Hallo this is some Text. It contains nothing special but the fact on the left are random blocks shown. Thank you for your time. </p>
                    </div> : null}
            </> : null}
            <div
                className={styles.stepTesting}
            >
                { testButtonVisible ? <div className={styles.stepTestingButton} onClick={onTest}>
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
                <p className={styles.stepTestingFail}>{failureMessage}</p> : null}
        </div>
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
    testButtonVisible: PropTypes.bool.isRequired,
    failureMessage: PropTypes.string.isRequired,
    solution: PropTypes.shape({
        img: PropTypes.node.isRequired,
        message: PropTypes.string.isRequired
    }),
    solutionVisible: PropTypes.bool.isRequired,
    solutionExpanded: PropTypes.bool.isRequired,
    onSolution: PropTypes.func.isRequired
};

export default TutorialStep;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './tutorial-cards.css';

import checkmark from './icon--checkmark.png';
import crossMark from './icon--cross-mark.png';
import arrow from './icon--arrow.svg';

const Solution = ({title, content, onSolution, solutionExpanded}) => (
    <>
        <div
            className={styles.stepSolutionHeader}
            onClick={onSolution}
        >
            <p className={styles.stepSolutionHeaderTitle}> {title} </p>
            <img
                className={solutionExpanded ?
                    styles.stepSolutionHeaderArrowDown : styles.stepSolutionHeaderArrowUp}
                src={arrow}
                draggable={false}
                alt={'Arrow'}
            />
        </div>
        {solutionExpanded ?
            <div className={styles.stepSolutionContainer}>
                <img
                    className={styles.stepSolutionImage}
                    src={content.img}
                    draggable={false}
                    alt={'Image of a possible solution for this step.'}
                />
                <p className={styles.stepSolutionText}> {content.message} </p>
            </div> : null}
    </>
);
Solution.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.shape({
        message: PropTypes.string.isRequired,
        img: PropTypes.node.isRequired
    }),
    onSolution: PropTypes.func.isRequired,
    solutionExpanded: PropTypes.bool.isRequired
};

const TestingComponent = ({testButtonTitle, successMsg, failMsg, onTest, testButtonVisible, tested, success}) => (
    <div className={styles.stepTesting}>
        { testButtonVisible ?
            <div
                className={styles.stepTestingButton}
                onClick={onTest}
            >
                <span className={styles.stepTestingButtonTitle}>{testButtonTitle}</span>
            </div> : null}
        {tested ?
            (success ?
                <p className={styles.stepTestingSuccess}>
                    <img
                        style={{height: '20px', verticalAlign: 'middle'}}
                        src={checkmark}
                        draggable={false}
                        alt={'Checkmark'}
                    />
                    {successMsg}
                </p> :
                <p className={styles.stepTestingFail}>
                    <img
                        style={{height: '20px', verticalAlign: 'middle'}}
                        src={crossMark}
                        draggable={false}
                        alt={'Cross mark'}
                    />
                    {failMsg}
                </p>
            ) : null}
    </div>
);
TestingComponent.propTypes = {
    testButtonTitle: PropTypes.string.isRequired,
    successMsg: PropTypes.string.isRequired,
    failMsg: PropTypes.string.isRequired,
    onTest: PropTypes.func.isRequired,
    testButtonVisible: PropTypes.bool.isRequired,
    tested: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired
};

const TutorialStep = props => {
    const {
        content,
        guiMessages,
        tested,
        onTest,
        success,
        testButtonVisible,
        testButtonTitle,
        failureMessage,
        solutionVisible,
        solutionExpanded,
        onSolution
    } = props;

    return (
        <div className={styles.tutorialStep}>
            <h4 className={styles.stepTitle}>{content.title} </h4>
            <p className={styles.stepInstructions}> {content.message1} </p>
            <img
                className={styles.stepImage}
                draggable={false}
                src={content.img}
                alt={'Image of the current step.'}
            />
            <p className={styles.stepInstructions}> {content.message2} </p>
            <div style={{marginBottom: '20px'}}>
                {solutionVisible ?
                    <Solution
                        title={guiMessages.solutionHeader}
                        content={content.solution}
                        onSolution={onSolution}
                        solutionExpanded={solutionExpanded}
                    /> : null}
                {tested && !success ?
                    <p className={styles.stepTestingFail}>{failureMessage}</p> : null}
                <TestingComponent
                    testButtonTitle={testButtonTitle}
                    successMsg={guiMessages.successMessage}
                    failMsg={guiMessages.failMessage}
                    onTest={onTest}
                    testButtonVisible={testButtonVisible}
                    tested={tested}
                    success={success}
                />
            </div>
        </div>
    );
};
TutorialStep.propTypes = {
    content: PropTypes.shape({
        title: PropTypes.string.isRequired,
        message1: PropTypes.string.isRequired,
        img: PropTypes.node.isRequired,
        message2: PropTypes.string.isRequired,
        solution: PropTypes.shape({
            message: PropTypes.string.isRequired,
            img: PropTypes.node.isRequired
        })
    }),
    guiMessages: PropTypes.objectOf(PropTypes.string),
    tested: PropTypes.bool.isRequired,
    onTest: PropTypes.func.isRequired,
    success: PropTypes.bool.isRequired,
    testButtonVisible: PropTypes.bool.isRequired,
    testButtonTitle: PropTypes.string.isRequired,
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

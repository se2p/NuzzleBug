import React from 'react';
import PropTypes from 'prop-types';
import styles from './tutorial-cards.css';

import checkmark from './icon--checkmark.png';
import crossMark from './icon--cross-mark.png';
import loading from './icon--loading.svg';
import arrow from './icon--arrow.svg';
import HintContent from './hints.jsx';

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

// TODO an der Stelle CodeQualityComponent erstellen

const TestingComponent = props => {
    const {
        testButtonTitle,
        codeQualityButtonTitle,
        successMsg,
        failMsg,
        loadingMsg,
        onTest,
        onCodeQualityHintGeneration,
        testButtonVisible,
        tested,
        success,
        currentlyTesting
    } = props;

    return (
        <div className={styles.stepTesting}>
            { testButtonVisible ?
                <div
                    className={styles.stepTestingButton}
                    onClick={onTest}
                    style={{
                        pointerEvents: currentlyTesting ? 'none' : 'auto',
                        opacity: currentlyTesting ? 0.5 : 1
                    }}
                >
                    <span className={styles.stepTestingButtonTitle}>{testButtonTitle}</span>
                </div> : null}
            <div
                className={styles.stepCodeQualityHintGeneration}
                onClick={onCodeQualityHintGeneration}
            >
                <span className={styles.stepTestingButtonTitle}>{codeQualityButtonTitle}</span>
            </div>
            {tested ?
                (currentlyTesting ?
                    <p className={styles.stepTestingLoading}>
                        <img
                            style={{
                                height: '20px',
                                verticalAlign: 'middle',
                                marginRight: 10,
                                marginBottom: 4.5
                            }}
                            src={loading}
                            draggable={false}
                            alt={'loading arrows'}
                        />
                        {loadingMsg}
                    </p> :
                    (success ?
                        <p className={styles.stepTestingSuccess}>
                            <img
                                style={{
                                    height: '20px',
                                    verticalAlign: 'middle',
                                    marginRight: 10,
                                    marginBottom: 4.5
                                }}
                                src={checkmark}
                                draggable={false}
                                alt={'Checkmark'}
                            />
                            {successMsg}
                        </p> :
                        <p className={styles.stepTestingFailShort}>
                            <img
                                style={{
                                    height: '20px',
                                    verticalAlign: 'middle',
                                    marginRight: 10,
                                    marginBottom: 4.5
                                }}
                                src={crossMark}
                                draggable={false}
                                alt={'Cross mark'}
                            />
                            {failMsg}
                        </p>
                    )) : null}
        </div>
    );
};
TestingComponent.propTypes = {
    testButtonTitle: PropTypes.string.isRequired,
    successMsg: PropTypes.string.isRequired,
    failMsg: PropTypes.string.isRequired,
    loadingMsg: PropTypes.string.isRequired,
    onTest: PropTypes.func.isRequired,
    onCodeQualityHintGeneration: PropTypes.func.isRequired,
    codeQualityButtonTitle: PropTypes.string,
    testButtonVisible: PropTypes.bool.isRequired,
    tested: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    currentlyTesting: PropTypes.bool.isRequired
};

const TutorialStep = props => {
    const {
        content,
        guiMessages,
        tested,
        onTest,
        onCodeQualityHintGeneration,
        success,
        testButtonVisible,
        testButtonTitle,
        codeQualityButtonTitle,
        failureMessage,
        solutionVisible,
        solutionExpanded,
        currentlyTesting,
        onSolution,
        generatedHints
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
                    codeQualityButtonTitle={codeQualityButtonTitle}
                    successMsg={guiMessages.successMessage}
                    failMsg={guiMessages.failMessage}
                    loadingMsg={guiMessages.loadingMessage}
                    onTest={onTest}
                    onCodeQualityHintGeneration={onCodeQualityHintGeneration}
                    testButtonVisible={testButtonVisible}
                    tested={tested}
                    success={success}
                    currentlyTesting={currentlyTesting}
                />
                <HintContent
                    text={generatedHints}
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
    onCodeQualityHintGeneration: PropTypes.func.isRequired,
    success: PropTypes.bool.isRequired,
    testButtonVisible: PropTypes.bool.isRequired,
    testButtonTitle: PropTypes.string.isRequired,
    codeQualityButtonTitle: PropTypes.string.isRequired,
    failureMessage: PropTypes.string.isRequired,
    solution: PropTypes.shape({
        img: PropTypes.node.isRequired,
        message: PropTypes.string.isRequired
    }),
    solutionVisible: PropTypes.bool.isRequired,
    solutionExpanded: PropTypes.bool.isRequired,
    currentlyTesting: PropTypes.bool.isRequired,
    onSolution: PropTypes.func.isRequired,
    generatedHints: PropTypes.string
};

export default TutorialStep;

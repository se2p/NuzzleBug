import styles from '../styles/tutorial-cards.css';
import Intro from './description/tutorial-intro.jsx';
import Instructions from './current-step/tutorial-step-instructions.jsx';
import Success from './current-step/tutorial-step-success.jsx';
import Solution from './testing/tutorial-step-solution.jsx';
import Testing from './testing/tutorial-step-testing.jsx';
import React, {useState} from 'react';
import CodeQualityHints from './code-quality/tutorial-step-code-quality.jsx';
import PropTypes from 'prop-types';

const Step = props => {
    const {
        description,
        currentStep,
        testing,
        codeQuality
    } = props;

    // Constants used for the different states. State represents the currently visible page.
    const DESCRIPTION = 'DESCRIPTION';
    const TEST = 'TEST';
    const CODE_QUALITY = 'CODE_QUALITY';
    const CURRENT_STEP = 'CURRENT_STEP';

    const [selectedType, setSelectedType] = useState(DESCRIPTION);

    const selectNavBarButton = type => {
        setSelectedType(type);
    };

    const navBar = (
        <div
            style={{
                backgroundColor: '#4c7397',
                position: 'fixed',
                height: '90%'
            }}
        >
            <div className={styles.navBar}>
                <div
                    onClick={() => selectNavBarButton(DESCRIPTION)}
                    className={`${styles.navBarButton} ${selectedType === DESCRIPTION ? styles.selectedNavBarButton : ''}`}
                >
                    <span>Beschreibung</span>
                </div>
                <div
                    onClick={() => selectNavBarButton(CURRENT_STEP)}
                    className={`${styles.navBarButton} ${selectedType === CURRENT_STEP ? styles.selectedNavBarButton : ''}`}
                >
                    <span>Aktueller Schritt</span>
                </div>
                <div
                    onClick={() => selectNavBarButton(TEST)}
                    className={`${styles.navBarButton} ${selectedType === TEST ? styles.selectedNavBarButton : ''}`}
                >
                    <span>Test</span>
                </div>
                <div
                    onClick={() => selectNavBarButton(CODE_QUALITY)}
                    className={`${styles.navBarButton} ${selectedType === CODE_QUALITY ? styles.selectedNavBarButton : ''}`}
                >
                    <span>Qualität</span>
                </div>
            </div>
        </div>
    );

    switch (selectedType) {
    case DESCRIPTION: {
        return (
            <div className={styles.flexContainer}>
                {navBar}
                <div className={styles.page}>
                    <Intro
                        content={description.intro.content}
                        onDownload={description.intro.onDownload}
                        downloadButtonTitle={description.intro.downloadButtonTitle}
                    />
                </div>
            </div>
        );
    }
    case CURRENT_STEP: {
        return (
            <div className={styles.flexContainer}>
                {navBar}
                <div className={styles.page}>
                    <Instructions
                        title={currentStep.instruction.title}
                        message1={currentStep.instruction.message1}
                        img={currentStep.instruction.img}
                        message2={currentStep.instruction.message2}
                    />
                    {currentStep.isSuccessVisible &&
                        <Success
                            content={{
                                title: currentStep.success.content.title,
                                message: currentStep.success.content.message,
                                img: currentStep.success.content.img
                            }}
                            onHome={currentStep.success.onHome}
                            homeButtonTitle={currentStep.success.homeButtonTitle}
                        />
                    }
                </div>
            </div>
        );
    }
    case TEST: {
        return (
            <div className={styles.flexContainer}>
                {navBar}
                <div className={styles.page}>
                    {testing.isFailureMessageVisible ?
                        <p className={styles.stepTestingFail}>{testing.failureMessage}</p> : null
                    }
                    <Testing
                        tested={testing.testing.tested}
                        currentlyTesting={testing.testing.currentlyTesting}
                        success={testing.testing.success}
                        testButtonVisible={testing.testing.testButtonVisible}
                        testButtonTitle={testing.testing.testButtonTitle}
                        onTest={testing.testing.onTest}
                        successMsg={testing.testing.successMsg}
                        failMsg={testing.testing.failMsg}
                        loadingMsg={testing.testing.loadingMsg}
                    />
                    {testing.isSolutionVisible && testing.solution ?
                        <Solution
                            title={testing.solution.title}
                            content={testing.solution.content}
                            onSolution={testing.solution.onSolution}
                            solutionExpanded={testing.solution.solutionExpanded}
                        /> : null
                    }
                </div>
            </div>
        );
    }
    case CODE_QUALITY: {
        return (
            <div className={styles.flexContainer}>
                {navBar}
                <div className={styles.page}>
                    <CodeQualityHints
                        hints={codeQuality.codeQuality.hints}
                        onCodeQualityHintGeneration={codeQuality.codeQuality.onCodeQualityHintGeneration}
                        codeQualityButtonTitle={codeQuality.codeQuality.codeQualityButtonTitle}
                    />
                </div>
            </div>
        );
    }
    }
};

Step.propTypes = {
    // props for description page
    description: PropTypes.shape({
        // props for Intro component
        intro: PropTypes.shape({
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
        }).isRequired
    }),
    // props for current_step page
    currentStep: PropTypes.shape({
        // props for Instruction component
        instruction: PropTypes.shape({
            title: PropTypes.string.isRequired,
            message1: PropTypes.string.isRequired,
            img: PropTypes.node.isRequired,
            message2: PropTypes.string.isRequired
        }),
        // specifies whether Success component visible
        isSuccessVisible: PropTypes.bool.isRequired,
        // props for Success component
        success: PropTypes.shape({
            content: PropTypes.shape({
                title: PropTypes.string.isRequired,
                message: PropTypes.string.isRequired,
                img: PropTypes.node.isRequired
            }),
            onHome: PropTypes.func.isRequired,
            homeButtonTitle: PropTypes.string.isRequired
        })
    }),
    // props for testing page
    testing: PropTypes.shape({
        // specifies whether Solution component visible
        isSolutionVisible: PropTypes.bool.isRequired,
        // props for solution component
        solution: PropTypes.shape({
            title: PropTypes.string,
            content: PropTypes.shape({
                message: PropTypes.string,
                img: PropTypes.node
            }),
            onSolution: PropTypes.func,
            solutionExpanded: PropTypes.bool
        }),
        // specifies whether failure message is visible
        isFailureMessageVisible: PropTypes.bool.isRequired,
        failureMessage: PropTypes.string,
        // for testing component
        testing: PropTypes.shape({
            testButtonTitle: PropTypes.string.isRequired,
            successMsg: PropTypes.string.isRequired,
            failMsg: PropTypes.string.isRequired,
            loadingMsg: PropTypes.string.isRequired,
            onTest: PropTypes.func.isRequired,
            testButtonVisible: PropTypes.bool.isRequired,
            tested: PropTypes.bool.isRequired,
            success: PropTypes.bool.isRequired,
            currentlyTesting: PropTypes.bool.isRequired
        })
    }),
    // props for code quality page
    codeQuality: PropTypes.shape({
        codeQuality: PropTypes.shape({
            hints: PropTypes.arrayOf(PropTypes.shape({
                title: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                sprite: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                codeSnippet: PropTypes.string
            })),
            onCodeQualityHintGeneration: PropTypes.func.isRequired,
            codeQualityButtonTitle: PropTypes.string.isRequired
        })
    })
};

export default Step;

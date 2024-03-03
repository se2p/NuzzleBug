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

    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleDescription = index => {
        setExpandedIndex(index === expandedIndex ? null : index);
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
                    {currentStep.instruction ?
                        <Instructions
                            title={currentStep.instruction.title}
                            message1={currentStep.instruction.message1}
                            img={currentStep.instruction.img}
                            message2={currentStep.instruction.message2}
                        /> : null
                    }
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
                    {testing.visible ?
                        <div>
                            {testing.isFailureMessageVisible && testing.failureMessage !== '' ?
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
                            {testing.isStepPassed ?
                                <div className={styles.testPassedMessage}>
                                    {'Super! Du hast den Schritt bestanden.\n ' +
                                        'Prüfe und verbessere die Codequalität deiner Lösung, ' +
                                        'bevor du mit dem nächsten Schritt fortfährst.'}
                                </div> : null
                            }
                            {testing.isSolutionVisible && testing.solution ?
                                <Solution
                                    title={testing.solution.title}
                                    content={testing.solution.content}
                                    onSolution={testing.solution.onSolution}
                                    solutionExpanded={testing.solution.solutionExpanded}
                                /> : null
                            }
                            {testing.isFailureMessageVisible && testing.details && testing.failureMessage !== '' ?
                                <table className={styles.testTable}>
                                    <thead>
                                        <tr>
                                            <th>{''}</th>
                                            <th>{'Test Name'}</th>
                                            <th style={{textAlign: 'center'}}>{'Ergebnis'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {testing.details.map((detail, index) => (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <td style={{textAlign: 'center'}}>
                                                        <button
                                                            className={styles.testDescriptionButton}
                                                            onClick={() => toggleDescription(index)}
                                                        >
                                                            {expandedIndex === index ? '-' : '+'}
                                                        </button>
                                                    </td>
                                                    <td>{detail.test}</td>
                                                    <td
                                                        className={`${detail.result === 'pass' ? styles.passed : styles.failed}`}
                                                        style={{textAlign: 'center'}}
                                                    >
                                                        {`${detail.result === 'pass' ? '✓' : `${detail.result === 'fail' ? '✗' : '⚠'}`}`}
                                                    </td>
                                                </tr>
                                                {expandedIndex === index && (
                                                    <tr>
                                                        <td colSpan="3" style={{textAlign: 'center', background: 'white'}}>{detail.description}</td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table> : null
                            }
                        </div> : <p className={styles.stepTestingFinished}>{testing.finishedMessage}</p>
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
            visible: PropTypes.bool.isRequired, // false when user already finished the tutorial
            finishedMessage: PropTypes.string.isRequired, // msg gets  displayed when tutorial is already finished
            testButtonTitle: PropTypes.string.isRequired,
            successMsg: PropTypes.string.isRequired,
            failMsg: PropTypes.string.isRequired,
            loadingMsg: PropTypes.string.isRequired,
            onTest: PropTypes.func.isRequired,
            testButtonVisible: PropTypes.bool.isRequired,
            tested: PropTypes.bool.isRequired,
            success: PropTypes.bool.isRequired,
            currentlyTesting: PropTypes.bool.isRequired
        }),
        // details table
        details: PropTypes.arrayOf(PropTypes.shape({
            test: PropTypes.string.isRequired,
            result: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired
        })),
        // determines whether hint to check out code quality gets displayed
        isStepPassed: PropTypes.bool.isRequired
    }),
    // props for code quality page
    codeQuality: PropTypes.shape({
        codeQuality: PropTypes.shape({
            hints: PropTypes.arrayOf(PropTypes.shape({
                title: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                sprite: PropTypes.string.isRequired,
                costume: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                codeSnippet: PropTypes.string
            })),
            onCodeQualityHintGeneration: PropTypes.func.isRequired,
            codeQualityButtonTitle: PropTypes.string.isRequired
        })
    })
};

export default Step;

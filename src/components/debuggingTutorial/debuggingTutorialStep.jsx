import PropTypes from "prop-types";
import React, {useRef} from "react";
import css from "./debuggingTutorialStep.css"
import owl from "./images/owl-b.svg"
import accept from "./images/icon--passed.png"
import failed from "./images/icon--failed.png"
import failed_debugging from "./images/icon--failed-debugging.png"
import failed_test from "./images/icon--failed-test.png"
import {FormattedMessage} from "react-intl";

const DebuggingTutorialStep = props => {
    const {
        onOpenHelp,
        tutorialMessages,
        step,
        onStartTests,
        onErrorClicked,
        isErrorInfoVisible,
        testResults,
        onTestDetails,
        showTestDetail,
        nextStep,
        onResetProject,
        setLoading,
        isLoading,
        reachedLastStep,
        projectLoadingState,
        ...posProps
    } = props;

    const overviewStep = "overviewStep".concat((step + 1).toString());
    const getFeedbackText = function () {
        let userMadeError = false;
        if (testResults.details === undefined) return false;
        testResults.details.map(e => {
            if (e.result !== "passed" && e.testDescription !== "DEBUGGING_ERROR") { userMadeError = true; }
        });
        return userMadeError;
    }

    const parseDetails = () => {
        return testResults.details
            .sort((a, b) => b.testId.localeCompare(a.testId))
            .map(e => {
                const isCurrentStep = e.testId.charAt(4) === (step + 1).toString();
                const isPass = e.result === "pass";
                const isDebuggingError = e.testDescription === "DEBUGGING_ERROR";

                const resultIcon = isCurrentStep ? (isPass ? accept : (isDebuggingError ? failed_debugging : failed_test)) : failed_test;
                const resultContent = (
                    <div className={css.resultItem}>
                        <span style={{ marginLeft: "10px" }}>{e.test}</span>
                        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                            <img alt="resultIcon" src={resultIcon} style={{ width: "20px", height: "auto", marginRight: "7px" }} />
                            <div style={{ position: "absolute", left: "20px", width: "7px", height: "8px", backgroundColor: "#4D97FFFF", top: "27%" }} />
                            <img alt="resultIcon" src={failed} style={{ width: "20px", height: "auto", marginRight: "10px" }} />
                        </div>
                    </div>
                );

                if (isCurrentStep) {
                    return isPass ? (
                        <div className={css.resultItem}>
                            <span style={{ marginLeft: "10px" }}>{e.test}</span>
                            <img alt="resultIcon" src={accept} style={{ width: "20px", height: "auto", marginRight: "10px" }} />
                        </div>
                    ) : resultContent;
                } else if (!isPass) {
                    return resultContent;
                }
            });
    };

    const progressBarRef = useRef(null);
    const timeoutIdRef = useRef(null);

    const handleMouseDown = () => {
        setLoading(true);
        progressBarRef.current.style.width = '80%';
        progressBarRef.current.style.transition = 'width 1s linear';

        timeoutIdRef.current = setTimeout(() => {
            onResetProject();
            progressBarRef.current.style.transition = 'none';
            progressBarRef.current.style.width = '0';
        }, 1100);
    };

    const handleMouseUp = () => {
        setLoading(false);
        clearTimeout(timeoutIdRef.current);
        progressBarRef.current.style.transition = 'none';
        progressBarRef.current.style.width = '0';
    };

    const renderStep = () => {
        return (
            <div className={css.container}>
                <div style={{textAlign: "left"}}>
                    <span className={css.descriptionHeader}>{"Schritt " + (step + 1)}</span>
                </div>

                <p className={css.description}>
                    {tutorialMessages[overviewStep]["description"]}
                </p>

                <div className={css.errorBar}>
                    <span className={css.errorText}>Anzahl an Fehlern: </span>
                    <span className={css.errorNumber}>
                    {tutorialMessages[overviewStep]["errorAmount"]}
                </span>
                    <button className={css.detailsButton} onClick={onErrorClicked}>Details
                        <span className={css.tooltipText}>Falls du den Fehler nicht findest: </span>
                    </button>
                </div>


                {isErrorInfoVisible && <div className={css.error} onClick={onErrorClicked}>
                    {tutorialMessages[overviewStep]["errorDescription"]}
                </div>}


                <div className={css.buttonBar}>


                    <div className={css.resetContainer}>

                        {projectLoadingState !== null ?
                            <button className={projectLoadingState === "RESET" ? css.resetButtonLoading : css.buttonElementDisabled} disabled={true}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}>
                                {projectLoadingState === "RESET" ? "Lädt..." : "Warten"}
                            </button>

                            : <button
                                className={isLoading ? css.resetButtonPressed : css.resetButton}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                Zurücksetzen
                                <div className={css.progressBar} ref={progressBarRef}></div>
                            </button>}
                    </div>

                    <button className={css.buttonElement} onClick={onOpenHelp}>
                        <FormattedMessage //TODO TRANSLATE
                            defaultMessage="Frage Euli"
                            description="Title for button to shrink question category"
                            id="gui.cards.shrinkk"
                        />
                    </button>

                    {projectLoadingState !== null ?
                        <button className={css.buttonElementDisabled} disabled={true}>
                            {projectLoadingState === "TEST" ? "Lädt..." : "Warten"}
                        </button>
                        : <button className={(testResults !== null && testResults.passed) ? css.nextButton : css.buttonElement}
                            onClick={(testResults !== null && testResults.passed) ? nextStep : onStartTests}>
                        {(testResults !== null && testResults.passed) ? "Weiter gehts!" : "Testen"}
                    </button>}
                </div>

                {testResults!== null && <div className={css.testContainer}>
                    <div className={css.testBox}>
                        <div className={css.testResContainer}>
                        <span className={css.testNumber} style={{marginBottom: "10px", marginTop: "10px"}}>
                            {testResults.passed ? "Glückwunsch!" : "Schade!"}
                        </span>
                            {!testResults.passed && <button className={css.testResultButton} onClick={onTestDetails}>Details</button>}
                        </div>

                        {showTestDetail && !testResults.passed ?
                            <div style={{display:"flex", flexDirection:"column", alignItems:"flex"}}>
                                {parseDetails()}
                            </div> : <span style={{marginBottom: "5px", marginLeft: "10px", textAlign: "left"}}>
                            {getResultText()}
                        </span>}

                    </div>
                    <img style={{width: "100px", height: "auto"}} alt={"owl-picture explaining the result"} src={owl}/>
                </div>}
            </div>
        )
    }

    const getResultText = () => {
        if (getFeedbackText()) return "Sieht aus, als hättest du aus Versehen weitere Fehler eingebaut. " +
            "Falls du willst, kannst du das Projekt jederzeit zurücksetzen."
        return testResults.passed ? "Du hast alle Fehler gefunden." : "Du hast leider nicht alle Fehler gefunden."
    }

    const renderFinalStep = () => {
        return (<div className={css.container}>

            <div style={{textAlign: "center", width:"100%"}}>
                <span className={css.descriptionHeader}>Glückwunsch!</span>
            </div>
            <img className={css.titleImage} src={tutorialMessages.levelFinishedImg} alt={"Picture of the tutorial"}/>
            <div className={css.descriptionFinish}>
                <p>{tutorialMessages.levelFinishedText}</p>
            </div>


            <div className={css.detailsBar}>
                <div className={css.detailsBarElement}>
                    <span className={css.detailsTitle}>Mögliche Ergänzungen: </span>
                    <span className={css.detailsText}>{tutorialMessages.levelFinishedSuggestions}</span>
                </div>
            </div>
        </div>);
    }

    return reachedLastStep ? renderFinalStep() : renderStep();
}

DebuggingTutorialStep.props = {
    onOpenHelp: PropTypes.func.isRequired,
    step: PropTypes.string,
    onStartTests: PropTypes.func,
    onReset: PropTypes.func,
}


export default DebuggingTutorialStep;

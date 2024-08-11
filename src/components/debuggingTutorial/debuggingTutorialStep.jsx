import PropTypes from "prop-types";
import React, {useRef} from "react";
import css from "./debuggingTutorialStep.css"
import owl from "./images/owl-b.svg"
import accept from "./images/icon--passed.png"
import failed from "./images/icon--failed.png"
import acceptReset from "./images/icon--accept.png"
import declineReset from "./images/icon--decline.png"

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
        ...posProps
    } = props;

    const overviewStep = "overviewStep".concat((step + 1).toString());

    const parseDetails = function () {
        return testResults.details.map(e =>
            <div className={css.resultItem}>
                <span style={{marginLeft: "10px"}}>{e.test}</span>
                <img alt={"resultIcon"} src={e.result === "pass" ? accept : failed} style={{width: "20px", height: "auto", marginRight: "10px"}}/>
            </div>
        );
    }

    const progressBarRef = useRef(null);
    const timeoutIdRef = useRef(null);
    //const startTimeRef = useRef(null);

    const handleMouseDown = () => {
        //startTimeRef.current = Date.now();
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
                        <button
                            className={isLoading ? css.resetButtonPressed : css.resetButton}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            Zurücksetzen
                            <div className={css.progressBar} ref={progressBarRef}></div>
                        </button>
                    </div>

                    <button className={css.buttonElement} onClick={onOpenHelp}>Hilfe</button>

                    <button className={(testResults !== null && testResults.passed) ? css.nextButton : css.buttonElement}
                            onClick={(testResults !== null && testResults.passed) ? nextStep : onStartTests}>
                        {(testResults !== null && testResults.passed) ? "Nächster Schritt" : "Testen"}
                    </button>
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
                            {testResults.passed ? "Du hast alle Fehler gefunden." : "Du hast leider nicht alle Fehler gefunden."}
                        </span>}

                    </div>
                    <img style={{width: "100px", height: "auto"}} alt={"owl-picture explaining the result"} src={owl}/>
                </div>}
            </div>
        )
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
                </div>levelFinishedText
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

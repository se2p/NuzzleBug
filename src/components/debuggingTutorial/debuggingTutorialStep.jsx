import PropTypes from "prop-types";
import React from "react";
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
        showReset,
        onReset,
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
                    <button className={`${css.resetButton} ${showReset ? css.moveRight : ''}`} style={{backgroundColor:"#4D97FFFF"}} onClick={onResetProject}>
                        {showReset ? "Aktuellen Schritt zurücksetzen?" : "Zurücksetzen"}
                    </button>
                    <button className={css.resetOptionAccept} onClick={onReset}>
                        <img alt={"yes"} src={acceptReset} style={{height:"auto", width:"13px"}}/>
                    </button>
                    <button className={css.resetOptionExit} onClick={onResetProject}>
                        <img alt={"no"} src={declineReset} style={{height:"auto", width:"10px"}}/>
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

DebuggingTutorialStep.props = {
    onOpenHelp: PropTypes.func.isRequired,
    step: PropTypes.string,
    onStartTests: PropTypes.func,
    onReset: PropTypes.func,
}


export default DebuggingTutorialStep;

import PropTypes from "prop-types";
import React from "react";
import css from "./debuggingTutorialStep1.css"
import owl from "./images/owl-b.svg"
import accept from "./images/icon--passed.png"
import failed from "./images/icon--failed.png"

const DebuggingTutorialStep1 = props => {
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
                <button className={css.buttonElement} onClick={onResetProject}>Rücks</button>
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

DebuggingTutorialStep1.props = {
    onOpenHelp: PropTypes.func.isRequired,
    step: PropTypes.string,
    onStartTests: PropTypes.func,
}


export default DebuggingTutorialStep1;

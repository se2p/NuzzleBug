import PropTypes from "prop-types";
import React from "react";
import css from "./debuggingTutorialStep1.css"

const DebuggingTutorialStep1 = props => {
    const {
        onOpenHelp,
        tutorialMessages,
        step,
        onStartTests,
        onErrorClicked,
        isErrorInfoVisible,
        ...posProps
    } = props;
    return (

        <div className={css.container}>

            <div style={{textAlign: "left"}}>
                <span className={css.descriptionHeader}>Schritt 1 </span>
            </div>


            <p className={css.description}>
                {tutorialMessages[step]["description"]}
            </p>

            <div className={css.errorBar}>
                <span className={css.errorText}>Anzahl an Fehlern: </span>
                <span className={css.errorNumber}>1</span>
                <button className={css.detailsButton} onClick={onErrorClicked}>Details
                    <span className={css.tooltipText}>Falls du den Fehler nicht findest: </span>
                </button>
            </div>


            {isErrorInfoVisible && <div className={css.error} onClick={onErrorClicked}>
                {tutorialMessages[step]["errorDescription"]}
            </div>}


            <div className={css.buttonBar}>
                <button className={css.buttonElement} style={{backgroundColor: "#e74c3c"}}>Rücks</button>
                <button className={css.buttonElement} onClick={onOpenHelp} style={{backgroundColor: "#4D97FFFF"}}>Hilfe</button>
                <button className={css.buttonElement} onClick={onStartTests} style={{backgroundColor: "#56b23d"}}>Testen</button>
            </div>
        </div>
    )
}

DebuggingTutorialStep1.props = {
    onOpenHelp: PropTypes.func.isRequired,
    step: PropTypes.string,
    onStartTests: PropTypes.func,
}


export default DebuggingTutorialStep1;

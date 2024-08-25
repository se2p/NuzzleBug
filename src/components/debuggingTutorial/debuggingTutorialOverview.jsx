import css from "./debuggingTutorialOverview.css";
import PropTypes from "prop-types";
import React from "react";

const DebuggingTutorialOverview = props => {
    const {
        header,
        tutorialPicture,
        onStart,
        tutorialMessages,
        stepCount,
        isNewTutorialSelected,
        lastTutorialTitle,
        isLoading,
        toggleAutosave,
        autoSave,
        ...posProps
    } = props;

    return (
        <div className={css.container}>
            <header>
                <h1 className={css.heading}>{header}</h1>
                <img className={css.titleImage} src={tutorialPicture} alt={"Picture of the tutorial"}/>
            </header>
            <section className={css.description}>
                <p>{tutorialMessages.description}</p>
            </section>
            <section className={css.detailsBar}>
                <div className={css.detailsBarElement}>
                    <span className={css.detailsTitle}>Anzahl an Schritten:</span>
                    <span className={css.detailsText}>{stepCount}</span>
                </div>
                <div className={css.detailsBarElement}>
                    <span className={css.detailsTitle}>Voraussetzungen:</span>
                    <span className={css.detailsText}>{tutorialMessages.requirements}</span>
                </div>
                <div className={css.detailsBarElement}>
                    <span className={css.detailsTitle}>Schwierigkeit:</span>
                    <span className={css.detailsText}>{tutorialMessages.difficulty}</span>
                </div>
            </section>

            {isLoading ? <button className={css.loadingButton} disabled={true} onClick={onStart} >Lädt...</button>
                : <button className={css.startButton} onClick={onStart} >{isNewTutorialSelected ? "Start" : "Tutorial fortsetzen"}</button>}
            {(lastTutorialTitle || isNewTutorialSelected) && (
                <div>
                    <span>
                        {`(ACHTUNG: Willst du ${lastTutorialTitle ? "deinen Fortschritt in " + lastTutorialTitle : "dein aktuelles Projekt"} speichern:`}
                    </span>
                    <button
                        className={css.autoSaveButton}
                        style={{ backgroundColor: autoSave ? "#70a45f" : "#ff8b4d" }}
                        onClick={toggleAutosave}
                    >
                        {autoSave ? "Ja" : "Nein"}
                    </button>
                    <span>{")"}</span>
                </div>
            )}
        </div>
    )
}

DebuggingTutorialOverview.props = {
    onStartTutorial: PropTypes.func.isRequired,
}

export default DebuggingTutorialOverview;

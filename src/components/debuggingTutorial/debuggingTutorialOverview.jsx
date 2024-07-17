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
        ...posProps
    } = props;

    return (
        <div className={css.container}>

            <div style={{textAlign: "center", width:"100%"}}>
                <span className={css.descriptionHeader}>Übersicht</span>
            </div>
            <h1 className={css.heading}>{header}</h1>
            <img className={css.titleImage} src={tutorialPicture} alt={"Picture of the tutorial"}/>
            <div className={css.description}>
                <p>{tutorialMessages.description}</p>
            </div>


            <div className={css.detailsBar}>
                <div className={css.detailsBarElement}>
                    <span className={css.detailsTitle}>Anzahl an Schritten: </span>
                    <span className={css.detailsText}>{stepCount} </span>
                </div>
                <div className={css.detailsBarElement}>
                    <span className={css.detailsTitle}>Voraussetzungen: </span>
                    <span className={css.detailsText}>{tutorialMessages.requirements}</span>
                </div>
                <div className={css.detailsBarElement}>
                    <span className={css.detailsTitle}>Schwierigkeit: </span>
                    <span className={css.detailsText}>{tutorialMessages.difficulty}</span>
                </div>
            </div>


            <button className={css.startButton} onClick={onStart} >Start</button>
        </div>
    )
}





DebuggingTutorialOverview.props = {
    onStartTutorial: PropTypes.func.isRequired,
}


export default DebuggingTutorialOverview;

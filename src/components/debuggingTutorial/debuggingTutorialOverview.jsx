import css from "./debuggingTutorialOverview.css";
import PropTypes from "prop-types";
import React from "react";
import bubbleIndicatorGray from "./images/bubbleDecalGrey2.png";
import bubbleIndicatorBlue from "./images/bubbleIDecalBlue2.png";
import owl from "./images/OwlBranchRight.png";
import arrowNext from "./images/icon_arrowNext.png"
import backButton from "./images/nextButton3.png"
import saveTrueIcon from "./images/saveTrueIcon.png"
import saveTrueIconWhite from "./images/autoSaveOnWhite.png"
import saveFalseIconWhite from "./images/autoSaveOffWhite.png"
import saveFalseIcon from "./images/saveFalseIcon.png"
import difficulty1 from "./images/difficultyIconEasy.png"
import difficulty2 from "./images/difficultyIconMedium.png"
import difficulty3 from "./images/difficultyIconHard.png"

import {CONTENT_START_TUTORIAL, CONTENT_DESCRIPTION} from "./tutorial-constants.jsx";

const difficultyImages = {
    1: difficulty1,
    2: difficulty2,
    3: difficulty3
};




const DebuggingTutorialOverview = props => {
    const {
        tutorialPicture,
        onStart,
        tutorialMessages,
        stepCount,
        isLoading,
        setAutoSave,
        autoSave,
        setContentType1,
        contentType1,
        tutorialIndexData,
        openAutoSaveSelection,
        isProjectEmpty,
        ...posProps
    } = props;

    const renderDescription = () => {
        return (
            <div className={css.bubbleContainer}>
                <div className={css.bubble} style={{borderColor:contentType1 === CONTENT_START_TUTORIAL ? "#4D97FFFF" : "#575E75FF"}}>
                    <img className={css.bubbleIndicator}
                         alt={"Bubble-Decal"}
                         src={bubbleIndicatorGray}
                         style={{top: "20%"}}
                    />

                    <div className={css.detailsContainer}>
                        <div className={css.imageArea}>
                            <img src={tutorialPicture} draggable={false} className={css.overviewImage} alt={"StepImage"}/>
                            <div className={css.detailsArea}>
                                <div style={{display: "flex"}}>
                                    <span>Schritte:</span>
                                    <div className={css.stepNumber}>{tutorialIndexData.totalSteps}</div>
                                </div>
                                <div style={{display: "flex"}}>
                                    <span>Schwierigkeit:</span>
                                    <img className={css.difficultyIcon} src={difficultyImages[tutorialIndexData.difficulty]} alt={"difficultyIcon"}/>
                                </div>
                            </div>
                        </div>
                        <div className={css.verticalLineContainer}>
                            <div className={css.verticalLine}></div>
                        </div>
                        <div className={css.textArea}>
                            <div>
                                {parseColoredText(tutorialMessages.description)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={css.imageContainer}>
                    <img src={owl} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
                </div>
            </div>
        );
    }

    const renderAutosaveSelection = () => {
        return (
            <div className={css.bubbleContainer}>
                <div className={css.selectionContainer}>
                    <div className={css.startBubble}>
                        <img className={css.bubbleIndicator} alt={"Bubble-Decal"} src={bubbleIndicatorBlue}/>
                        {getSelectionBubbleMessage()}
                    </div>
                    <div className={`${css.selectionBubble} ${(autoSave === "" || autoSave === "NO") ? '' : css.selected}`} onClick={() => setAutoSave("YES")}>
                        <div className={css.selectionBubbleIndicator} />
                        <img src={(autoSave === "" || autoSave === "NO") ? saveTrueIcon : saveTrueIconWhite} className={css.selectionIcon} alt={"Icon"}/>
                        Ja, ich brauche meinen Code noch
                    </div>
                    <div className={`${css.selectionBubble} ${(autoSave === "" || autoSave === "YES") ? '' : css.selected}`} onClick={() => setAutoSave("NO")}>
                        <div className={css.selectionBubbleIndicator} />
                        <img src={(autoSave === "" || autoSave === "YES") ? saveFalseIcon : saveFalseIconWhite} className={css.selectionIcon} alt={"Icon"}/>
                        Nein, du kannst meinen Code löschen
                    </div>
                </div>
                <div className={css.imageContainer}>
                    <img src={owl} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
                </div>
            </div>
        );
    }

    const renderButtonBar = () => {
        if (contentType1 === CONTENT_DESCRIPTION) {
            return (
                <div className={css.buttonContainer}>
                    <a href="#" className={`${css.effect} ${css["effect-1"]}`}
                       onClick={() => { if (isProjectEmpty) {onStart()} else {openAutoSaveSelection()}}}
                    >
                        Los gehts!
                        <img src={arrowNext} alt="Icon" className={css.buttonIcon}/>
                    </a>
                </div>
            );
        } else {
            let autoSaveOptionSelected = autoSave !== "";

            return (
                <div className={css.buttonContainer}>
                    <div className={css.left}>
                        <div className={css.backButtonContainer}>
                            <div className={css.arrowFill}/>
                            <img className={css.backButton}
                                 onClick={() => setContentType1(CONTENT_DESCRIPTION)}
                                 src={backButton}
                                 alt={"Back"}
                            />
                        </div>
                    </div>

                    <div className={css.center}>
                        {autoSaveOptionSelected && <a href="#" className={`${css.effect} ${css["effect-1"]}`}
                           onClick={onStart}
                        >
                            Starte das Tutorial
                            <img src={arrowNext} alt="Icon" className={css.buttonIcon}/>
                        </a>}
                    </div>

                    <div className={css.right}/>
                </div>
            );
        }
    }

    const  parseColoredText = (input) => {
        const result = [];
        const lines = input.split("\n");

        lines.forEach((line, lineIndex) => {
            const parts = [];
            const regex = /<color=(#[0-9a-fA-F]{6})>(.*?)<\/color>|<img\s+([^>]+)>/g;

            let lastIndex = 0;
            let match;

            while ((match = regex.exec(line)) !== null) {
                const [fullMatch, color, colorText, imgSrc] = match;
                const start = match.index;

                // Text vor dem Match
                if (start > lastIndex) {
                    parts.push(line.substring(lastIndex, start));
                }

                if (color && colorText) {
                    // Gefärbter & fetter Text
                    parts.push(
                        React.createElement(
                            "span",
                            {
                                key: `color-${lineIndex}-${start}`,
                                style: { color, fontWeight: "bold" },
                            },
                            colorText
                        )
                    );
                } else if (imgSrc) {
                    // Bild einfügen
                    parts.push(
                        <img src={tutorialIndexData[imgSrc.trim()]} draggable={false} className={css.textImage} alt={""}/>
                    );
                }

                lastIndex = start + fullMatch.length;
            }

            // Restlicher Text nach dem letzten Match
            if (lastIndex < line.length) {
                parts.push(line.substring(lastIndex));
            }

            result.push(...parts);

            // Zeilenumbruch
            if (lineIndex < lines.length - 1) {
                result.push(React.createElement("br", { key: `br-${lineIndex}` }));
            }
        });

        return result;
    }


    /**
     * Get Eulis response based on the selected autoSafe method.
     * @returns {JSX.Element}
     */
    const getSelectionBubbleMessage = () => {
        if (autoSave === "") {
            return <span>Um das Tutorial zu starten, muss ich deinen aktuellen Code überschreiben. Soll ich deinen aktuellen Codes speichern?</span>
        } else if (autoSave === "YES") {
            return <span>Alles Klar, ich werde deinen Code für dich speichern!<br/>Klicke unten auf den blauen Knopf um zu starten.</span>
        } else {
            return <span>Gut, ich werde deinen Code überschreiben!<br/>Klicke unten auf den blauen Knopf um zu starten.</span>
        }
    }

    return (
        <div className={css.container}>

            <h1 className={css.heading}
                style={{color:contentType1 === CONTENT_START_TUTORIAL ? "#575E75FF" : "#4D97FFFF"}}
            >
                {tutorialMessages.title}
            </h1>
            <div className={css.whiteBox}>
                {contentType1 === CONTENT_DESCRIPTION ? renderDescription() : renderAutosaveSelection()}
            </div>
            {renderButtonBar()}
        </div>
    );
}

DebuggingTutorialOverview.props = {
    onStartTutorial: PropTypes.func.isRequired,
}

export default DebuggingTutorialOverview;

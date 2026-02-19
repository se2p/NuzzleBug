import React, {useState} from "react";
import PropTypes from 'prop-types';
import css from "./tutorial-selection.css"
import TutorialItem from "./tutorial-item.jsx";
import bubbleIndicator from "../../images/bubbleDecalGreyHelp.png";
import euliLeft from "../../images/OwlBranchRight.png";
import arrow from "../../images/arrow-next.png"
import iconDescription from "../../images/icon--Description.png";
import iconDebugging from "../../images/debuggingIcon.png";
import { tutorialConfig } from "../../config.js";

const TutorialSelection = ({tutorials, onSelectTutorial, guiMessages}) => {
    const [explanationState, setExplanationState] = useState(EXPLANATION_STATE.NONE);

    // Zeige die Reiter "Klassisch" und "Debugging" nur, wenn jeweils mindestens ein Tutorial der Kategorie aktiv ist.
    const showClassicTab = tutorials.filter(tutorial => tutorial.isDebuggingTutorial === false).length > 0;
    const showDebuggingTab = tutorials.filter(tutorial => tutorial.isDebuggingTutorial === true).length > 0;

    const [showClassicTutorials, setShowClassicTutorials] = useState(showClassicTab);

    const renderContent = () => {
        if (explanationState !== EXPLANATION_STATE.NONE) {
            // Es wird aktuell die Erklärung angezeigt. Rendere also diese.
            return (
                <div className={css.bubbleContainer}>
                    <div className={css.bubbleBoxContainer}>
                        <div className={css.bubble}>
                            <img className={css.bubbleIndicator} draggable={false} alt={"Bubble-Decal"} src={bubbleIndicator}/>
                            {getExplanationContent()}
                        </div>
                    </div>
                    <img src={euliLeft} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
                </div>
            );
        } else {
            // Ansonsten zeige die passenden (Debug vs. Classic) Tutorials an.
            const filteredTutorials = tutorials
                .filter(tutorial =>
                    showClassicTutorials
                        ? tutorial.isDebuggingTutorial !== true
                        : tutorial.isDebuggingTutorial === true
                );

            return (
                filteredTutorials.map((tutorial, index) => {
                    return (
                        <TutorialItem
                            key={tutorial.id + index}
                            isDebuggingTutorial={tutorial.isDebuggingTutorial}
                            content={tutorial}
                            onSelect={onSelectTutorial}
                            guiMessages={guiMessages}
                        />
                    );
                })
            );
        }
    }

    const getExplanationContent = () => {
        if (explanationState === EXPLANATION_STATE.INTRO) {
            return (
                <span>
                    {guiMessages.selection.explanation_intro}
                    <div className={css.closeHelpButton} onClick={() => setExplanationState(EXPLANATION_STATE.EXPLANATION)}>
                            {guiMessages.selection.interesting}
                        <img src={arrow} className={css.arrowIcon} alt={"->"}/>
                    </div>
                </span>);
        }

        if (explanationState === EXPLANATION_STATE.EXPLANATION) {
            return (
                <span>
                    {guiMessages.selection.explanation_1}
                    <span style={{color: "#67a5ff", fontWeight: "bold"}}>{guiMessages.selection.explanation_blueTutorial}</span>.<br/><br/>
                    {guiMessages.selection.explanation_2}
                    <span style={{color: "#87b772", fontWeight: "bold"}}>{guiMessages.selection.explanation_greenTutorial}</span>.
                    <div className={css.closeHelpButton} onClick={() => setExplanationState(EXPLANATION_STATE.NONE)}>
                        {guiMessages.selection.start}
                        <img src={arrow} className={css.arrowIcon} alt={"->"}/>
                    </div>
                </span>
            );
        }

        return null;
    }




    return (
        <div className={css.container}>
            <h1 className={css.header}>
                {tutorialConfig.selection.enableTutorialSelectionHelp && explanationState === EXPLANATION_STATE.NONE &&
                    <div className={css.help} onClick={() => setExplanationState(EXPLANATION_STATE.INTRO)}>
                        <span>?</span>
                        <span style={{fontSize: "0.6rem"}}>{guiMessages.selection.explanation}</span>
                    </div>}
            </h1>

            <div className={css.tabContainer}>
                {explanationState === EXPLANATION_STATE.NONE && showClassicTab &&
                    <button className={css.tabButton}
                            id="classicTab"
                            style={{backgroundColor: showClassicTutorials ? "#4c97ff" : "#575e75"}}
                            onClick={() => setShowClassicTutorials(true)}
                    >
                        <div style={{display: "flex", alignItems: "center"}}>
                            <img className={css.icon} src={iconDescription} alt={"errorIcon"}/>
                            {guiMessages.selection.coding}
                        </div>
                    </button>
                }

                {explanationState === EXPLANATION_STATE.NONE && showDebuggingTab &&
                    <button className={css.tabButton}
                            id="debuggingTab"
                            style={{backgroundColor: showClassicTutorials ? "#575E75FF" : "#70a45b"}}
                            onClick={() => setShowClassicTutorials(false)}
                    >
                        <div style={{display: "flex", alignItems: "center"}}>
                            <img className={css.icon} src={iconDebugging} alt={"errorIcon"}/>
                            {guiMessages.selection.debugging}
                        </div>
                    </button>
                }
            </div>

            <div className={css.tutorialCardContainer} style={{
                ...(explanationState !== EXPLANATION_STATE.NONE && {
                    display: "flex",
                    paddingRight: "0",
                    paddingLeft: "0",
                }), borderColor: explanationState !== EXPLANATION_STATE.NONE ? "#575E75FF" : showClassicTutorials ? "#4c97ff" : "#70a45b"
            }}>
                {renderContent()}
            </div>
        </div>
    );
};

const EXPLANATION_STATE = {
    NONE: "NONE",
    INTRO: "INTRO",
    EXPLANATION: "EXPLANATION"
};

TutorialSelection.propTypes = {
    tutorials: PropTypes.array.isRequired,
    onSelectTutorial: PropTypes.func.isRequired,
    guiMessages: PropTypes.object.isRequired
};

export default TutorialSelection;

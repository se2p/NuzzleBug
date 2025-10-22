import React, {useRef, useState} from "react";
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import css from "./tutorial-selection.css"
import TutorialItem from "./tutorial-item.jsx";
import bubbleIndicator from "../images/bubbleDecalGreyHelp.png";
import euliLeft from "../images/OwlBranchRight.png";
import arrow from "../images/arrow-next.png"
import iconDescription from "../images/icon--Description.png";
import iconDebugging from "../images/debuggingIcon.png";
import {ENABLE_TUTORIAL_SELECTION_HELP} from "../config.ts";

const TutorialSelection = ({tutorials, onSelectTutorial, guiMessages}) => {
    const [showingHelp, setShowingHelp] = useState("");

    const setHelp = (nextState) => {
        setShowingHelp(nextState);
    };

    const showClassicTab = tutorials.filter(tutorial => tutorial.isDebuggingTutorial === false).length > 0;
    const showDebuggingTab = tutorials.filter(tutorial => tutorial.isDebuggingTutorial === true).length > 0;

    const [showDebuggingTutorials, setShowDebuggingTutorials] = useState(!showClassicTab);

    const showDebuggingTutorial = (val) => {
        setShowDebuggingTutorials(val);
    };

    return (<div className={css.container}>
        <h1 className={css.header}>
            {ENABLE_TUTORIAL_SELECTION_HELP && showingHelp === "" && <div className={css.help} onClick={() => setHelp("1")}>
                <span>?</span>
                <span style={{fontSize: "0.6rem"}}>{guiMessages.selection.explanation}</span>
            </div>}
        </h1>

        <div className={css.tabContainer}>
            {showingHelp === "" && showClassicTab && <button className={css.tabButton}
                                           id="classicTab"
                                           style={{backgroundColor:showDebuggingTutorials ? "#575e75" : "#4c97ff"}}
                                           onClick={() => showDebuggingTutorial(false)}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <img className={css.icon} src={iconDescription} alt={"errorIcon"}/>
                    {guiMessages.selection.coding}
                </div>
            </button>}
            {showingHelp === "" && showDebuggingTab && <button className={css.tabButton}
                                           id="debuggingTab"
                                           style={{backgroundColor:showDebuggingTutorials ? "#70a45b" : "#575E75FF"}}
                                           onClick={() => showDebuggingTutorial(true)}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <img className={css.icon} src={iconDebugging} alt={"errorIcon"}/>
                    {guiMessages.selection.debugging}
                </div>
            </button>} {
                }
        </div>

        <div className={css.tutorialCardContainer} style={{
            ...(showingHelp && {
                display: "flex",
                paddingRight: "0",
                paddingLeft: "0",
            }), borderColor: showingHelp ? "#575E75FF" : showDebuggingTutorials ? "#70a45b" : "#4c97ff"
        }}>

            {renderTutorialCards(tutorials, onSelectTutorial, showingHelp, setHelp, showDebuggingTutorials, guiMessages)}
        </div>
    </div>);
};






const getText = (setHelp, showingHelp, guiMessages) => {
    if (showingHelp === "1") return (<span>{guiMessages.selection.bubble_text1}<div className={css.closeHelpButton} onClick={() => setHelp("2")}>{guiMessages.selection.interesting}<img src={arrow} className={css.arrowIcon} alt={"->"}/></div></span>);
    if (showingHelp === "2") return (<span>Möchtest du Schritt für Schritt ein eigenes Spiel erstellen? Dann wähle ein <span style={{color: "#67a5ff", fontWeight: "bold"}}>blaues Tutorial</span>.<br/><br/>
                            Oder willst du lieber herausfinden und üben, wie man Fehler findet und behebt? Dann klicke
                            auf ein <span style={{color: "#87b772", fontWeight: "bold"}}>grünes Tutorial</span>. <div className={css.closeHelpButton} onClick={() => setHelp("")}>Los gehts!<img src={arrow} className={css.arrowIcon} alt={"->"}/></div> </span>);
}

const renderTutorialCards = (tutorials, onSelectTutorial, showingHelp, setHelp, showDebuggingTutorials, guiMessages) => {
    if (showingHelp) {
        return (
            <div className={css.bubbleContainer}>
                <div className={css.bubbleBoxContainer}>
                    <div className={css.bubble}>
                        <img className={css.bubbleIndicator} alt={"Bubble-Decal"} src={bubbleIndicator}/>
                        {getText(setHelp, showingHelp, guiMessages)}
                    </div>
                </div>
                <img src={euliLeft} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
            </div>
        );
    } else {
        const filteredTutorials = tutorials
            .filter(tutorial =>
                showDebuggingTutorials
                    ? tutorial.isDebuggingTutorial === true
                    : tutorial.isDebuggingTutorial !== true
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

TutorialSelection.propTypes = {
    tutorials: PropTypes.any,
    onSelectTutorial: PropTypes.func.isRequired,
};

export default injectIntl(TutorialSelection);

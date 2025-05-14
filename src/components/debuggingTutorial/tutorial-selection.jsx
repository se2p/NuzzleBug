import React, {useState} from "react";
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import css from "./tutorial-selection.css"
import TutorialItem from "./tutorial-item.jsx";
import bubbleIndicator from "./images/bubbleDecalGreyHelp.png";
import euliLeft from "./images/OwlBranchRight.png";
import arrow from "./images/arrow-next.png"
import iconDescription from "./images/icon--Description.png";
import iconDebugging from "./images/debuggingIcon.png";

const TutorialSelection = ({tutorials, onSelectTutorial}) => {
    const [showingHelp, setShowingHelp] = useState("");

    const setHelp = (nextState) => {
        setShowingHelp(nextState);
    };

    const [showDebuggingTutorials, setShowDebuggingTutorials] = useState(false);

    const showDebuggingTutorial = (val) => {
        setShowDebuggingTutorials(val);
    };


    return (<div className={css.container}>
        <h1 className={css.header}>
            {showingHelp === "" && <div className={css.help} onClick={() => setHelp("1")}>
                <span>?</span>
                <span style={{fontSize: "0.6rem"}}>Erklärung</span>
            </div>}
        </h1>

        <div className={css.tabContainer}>
            {showingHelp === "" && <button className={css.tabButton}
                    id="classicTab"
                    style={{backgroundColor:showDebuggingTutorials ? "#575e75" : "#4c97ff"}}
                    onClick={() => showDebuggingTutorial(false)}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <img className={css.icon} src={iconDescription} alt={"errorIcon"}/>
                    Programmieren
                </div>
            </button>}
            {showingHelp === "" && <button className={css.tabButton}
                    id="debuggingTab"
                    style={{backgroundColor:showDebuggingTutorials ? "#70a45b" : "#575E75FF"}}
                    onClick={() => showDebuggingTutorial(true)}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <img className={css.icon} src={iconDebugging} alt={"errorIcon"}/>
                    Fehlerfinden
                </div>
            </button>}
        </div>

        <div className={css.tutorialCardContainer} style={{
            ...(showingHelp && {
                display: "flex",
                paddingRight: "0",
                paddingLeft: "0",
            }),
        }}>

            {renderTutorialCards(tutorials, onSelectTutorial, showingHelp, setHelp, showDebuggingTutorials)}
        </div>
    </div>);
};






const getText = (setHelp, showingHelp) => {
    if (showingHelp === "1") return (<span>Hier unterstütze ich dich dabei, noch besser im Programmieren zu werden!<br/>Dafür habe ich dir hier einige Tutorials vorbereitet.<div className={css.closeHelpButton} onClick={() => setHelp("2")}>Interessant<img src={arrow} className={css.arrowIcon} alt={"->"}/></div></span>);
    if (showingHelp === "2") return (<span>Möchtest du Schritt für Schritt ein eigenes Spiel erstellen? Dann wähle ein <span style={{color: "#67a5ff", fontWeight: "bold"}}>blaues Tutorial</span>.<br/><br/>
                            Oder willst du lieber herausfinden und üben, wie man Fehler findet und behebt? Dann klicke
                            auf ein <span style={{color: "#87b772", fontWeight: "bold"}}>grünes Tutorial</span>. <div className={css.closeHelpButton} onClick={() => setHelp("")}>Los gehts!<img src={arrow} className={css.arrowIcon} alt={"->"}/></div> </span>);
}

const renderTutorialCards = (tutorials, onSelectTutorial, showingHelp, setHelp, showDebuggingTutorials) => {
    if (showingHelp) {
        return (
            <div className={css.bubbleContainer}>
                <div className={css.bubbleBoxContainer}>
                    <div className={css.bubble}>
                        <img className={css.bubbleIndicator} alt={"Bubble-Decal"} src={bubbleIndicator}/>
                        {getText(setHelp, showingHelp)}
                    </div>
                </div>
                <img src={euliLeft} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
            </div>
        );
    } else {
        return tutorials.filter(tutorial => {
            if (showDebuggingTutorials) {
                return tutorial.isDebuggingTutorial === true;
            } else {
                return tutorial.isDebuggingTutorial !== true;
            }
        }).map((tutorial) => (
            <TutorialItem
                isDebuggingTutorial={tutorial.isDebuggingTutorial}
                key={tutorial.id}
                content={tutorial}
                onSelect={onSelectTutorial}
            />
        ));
    }
}

TutorialSelection.propTypes = {
    tutorials: PropTypes.any,
    onSelectTutorial: PropTypes.func.isRequired,
};

export default injectIntl(TutorialSelection);




import React, {useState} from "react";
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import css from "./tutorial-selection.css"
import TutorialItem from "./tutorial-item.jsx";
import bubbleIndicator from "./images/bubbleDecalGreyHelp.png";
import euliLeft from "./images/owlTransparent.png";
import arrow from "./images/arrow-next.png"

const TutorialSelection = ({tutorials, onSelectTutorial}) => {
    const [showingHelp, setShowingHelp] = useState("");

    const setHelp = (nextState) => {
        setShowingHelp(nextState);
    };


    return (<div className={css.container}>
        <h1 className={css.header}>
            {showingHelp ? <div className={css.bubbleContainer}>
                <div className={css.bubbleBoxContainer}>
                    <div className={css.bubble}>
                        <img className={css.bubbleIndicator} alt={"Bubble-Decal"} src={bubbleIndicator}/>
                        {getText(setHelp, showingHelp)}
                    </div>
                </div>
                <img src={euliLeft} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
            </div>
            :
            <span>Tutorials</span>}

            {showingHelp === "" && <div className={css.help} onClick={() => setHelp("1")}>
                <span>?</span>
                <span style={{fontSize: "0.6rem"}}>Erklärung</span>
            </div>}
        </h1>
        <div className={css.tutorialCardContainer}>
            {renderTutorialCards(tutorials, onSelectTutorial)}
        </div>
    </div>);
};

const getText = (setHelp, showingHelp) => {
    if (showingHelp === "1") return (<span>Hier unterstütze ich dich dabei, noch besser im Programmieren zu werden!<br/>Dafür habe ich dir hier einige Tutorials vorbereitet.<div className={css.closeHelpButton} onClick={() => setHelp("2")}>Interessant<img src={arrow} className={css.arrowIcon} alt={"->"}/></div></span>);
    if (showingHelp === "2") return (<span>Möchtest du Schritt für Schritt ein eigenes Spiel erstellen? Dann wähle ein <span style={{color: "#67a5ff", fontWeight: "bold"}}>blaues Tutorial</span>.<br/><br/>
                            Oder willst du lieber herausfinden und üben, wie man Fehler findet und behebt? Dann klicke
                            auf ein <span style={{color: "#87b772", fontWeight: "bold"}}>grünes Tutorial</span>. <div className={css.closeHelpButton} onClick={() => setHelp("")}>Los gehts!<img src={arrow} className={css.arrowIcon} alt={"->"}/></div> </span>);
}

const renderTutorialCards = (tutorials, onSelectTutorial) => {
    return Array(tutorials.length).fill(0)
        .map((_, i) => (
            /*<Tutorial
                isDebuggingTutorial={tutorials[i].isDebuggingTutorial}
                key={tutorials[i].id}
                content={tutorials[i]}
                onSelect={onSelectTutorial}
            />*/

            <TutorialItem
                isDebuggingTutorial={tutorials[i].isDebuggingTutorial}
                key={tutorials[i].id}
                content={tutorials[i]}
                onSelect={onSelectTutorial}
            />
        ));
}

TutorialSelection.propTypes = {
    tutorials: PropTypes.any,
    onSelectTutorial: PropTypes.func.isRequired,
};

export default injectIntl(TutorialSelection);




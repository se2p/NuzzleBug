import styles from "../cards/card.css";
import Draggable from "react-draggable";
import css from "./debuggingTutorialWindow.css";
import PropTypes from "prop-types";
import React from "react";
import headerImage from "./images/testIMG.png"
import dropdownIcon from "./images/icon--dropdown-selector.png"

const DebuggingTutorialStep = props => {
    const {
        onDrag,
        onStartDrag,
        onEndDrag,
        isRtl,
        tutorial,
        step,
        onEnterAnswer,
        onHelp,
        onCheckAnswer,
        isHelpVisible,
        selectedAnswer,
        selectedAnswers,
        onStepBack,
        onEnterMultiAnswer,
        onChangeTextInput1,
        textAnswer1,
        onChangeTextInput2,
        textAnswer2,
        onChangeTextEndAnswer,
        textEndAnswer,
        isTextAnswerCorrect,
        ...posProps
    } = props;

    const getTextEndAnswerButtonText = function () {
        if (textEndAnswer === "") {
            return "wähle aus";
        } else {
            if (textEndAnswer === "true") {
                return "ja";
            } else {
                return "nö";
            }
        }
    }

    const getTextEndAnswerButtonColor = function () {
        if (textEndAnswer === "") {
            return "#4D97FFFF";
        } else {
            if (textEndAnswer === "true") {
                return "#70a45f";
            } else {
                return "#ff8b4d";
            }
        }
    }

    const parseQuestion = function (){

        switch (tutorial[step]["questionType"]) {
            case "SINGLE":
                return Object.keys(tutorial[step]).filter((key) => (key.startsWith("option"))).map((key) => (
                    <div key={key} className="option">
                        <img alt={"testPicture"} className={"smallImage"} src={"imgTemplates/" + tutorial[step][key].img + ".png"}/>
                        <div className="image"> {tutorial[step][key].label} </div>
                        <input
                            type="radio"
                            id={key}
                            name="singleChoice"
                            checked={selectedAnswer === key}
                            onChange={(e) => onEnterAnswer(key)}
                        />
                    </div>
                ));
            case "MULTIPLE":
                return Object.keys(tutorial[step]).filter((key) => (key.startsWith("option"))).map((key) => (
                    <div key={key} className="option">
                        <div className="image" > {tutorial[step][key].label} </div>



                        <button key={key} onClick={() => onEnterMultiAnswer(key)} className=
                            {selectedAnswers[key.at(6) - 1] ? css.multiButton_active : css.multiButton}>
                        </button>
                    </div>
                ));
            case "TEXT":
                return <div className="option">
                    <div className={css.textAnswerContainer}>
                        <span className={css.textAnswerLine} style={{marginRight: "10px"}}>Die Schleife wurde</span>
                        <div className={css.dropdown}>
                            <input className={css.dropdownBody} placeholder={"Anzahl eingeben"} type="text" value={textAnswer1} onChange={(e) => onChangeTextInput1(e.target.value)}/>

                            <div className={css.dropdownTest}>
                                <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"}/>
                                <div className={css.dropdownContent}>
                                    <span className={css.dropdownElement} onClick={() => onChangeTextInput1("0")}>0</span>
                                    <span className={css.dropdownElement} onClick={() => onChangeTextInput1("unendlich")}>unendlich</span>
                                </div>
                            </div>
                        </div>
                        <span className={css.textAnswerLine} style={{marginLeft: "10px"}}>mal durchlaufen.</span>
                    </div>

                    <div className={css.textAnswerContainer}>
                        <span className={css.textAnswerLine} style={{marginRight: "10px"}}>Die Schleife sollte</span>
                        <div className={css.dropdown}>
                            <input className={css.dropdownBody} placeholder={"Anzahl eingeben"} type="text" value={textAnswer2} onChange={(e) => onChangeTextInput2(e.target.value)}/>

                            <div className={css.dropdownTest}>
                                <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"}/>
                                <div className={css.dropdownContent}>
                                    <span className={css.dropdownElement} onClick={() => onChangeTextInput2("0")}>0</span>
                                    <span className={css.dropdownElement} onClick={() => onChangeTextInput2("unendlich")}>unendlich</span>
                                </div>
                            </div>
                        </div>
                        <span className={css.textAnswerLine} style={{marginLeft: "10px"}}>mal durchlaufen werden.</span>
                    </div>

                    {isTextAnswerCorrect && <div>
                        <span className={css.textAnswerLine} style={{marginTop: "30px", fontWeight:"bold", textDecoration:"underline"}}>Hat deine Vermutung gestimmt, dass die Schleife zu selten ausgeführt wurde?</span>

                        <div className={css.textAnswerBar}>
                            <button className={css.textAnswerButton} style={{backgroundColor:getTextEndAnswerButtonColor()}} onClick={onChangeTextEndAnswer}>
                                {getTextEndAnswerButtonText()}
                            </button>
                            <span className={css.textAnswerText}>deswegen schaue ich nun, woran dies liegt.</span>
                        </div>
                    </div>}
                </div>
        }


    }
    const a = (answer) => {
        onEnterAnswer(answer)
    }

    return (


        <div className={css.cardContainer}>

            <div className={css.header}>
                step: {step}
                <img src={headerImage} alt="Diagramm of the debugging process." className={css.headerImage} />
            </div>


            <div className={css.questionSection}>
                <div className={css.questionHeader}>
                    <span>{tutorial[step]["text"]}</span>
                    {tutorial[step]["help"] !== null && <button className={css.helpButton} onClick={props.onHelp}>i</button>}
                </div>

                {isHelpVisible && <div className={css.helpSection}>
                    <span>{tutorial[step]["help"]}</span>
                </div>}

                <div className={css.options}>


                    {parseQuestion()}


                </div>
            </div>


            <div className={css.footer}>
                <button className={css.footerButton} onClick={onStepBack}>Zurück</button>
                <button className={css.footerButton} onClick={onCheckAnswer}>Weiter</button>
            </div>


        </div>


    );
};





DebuggingTutorialStep.props = {
    onHelp: PropTypes.func,
    tutorial: PropTypes.object.isRequired, //TODO
    step: PropTypes.string,
    onEnterAnswer: PropTypes.func,
    isHelpVisible: PropTypes.bool,
}


export default DebuggingTutorialStep;

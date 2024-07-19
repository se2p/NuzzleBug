import css from "./debuggingTutorialHelp.css";
import PropTypes from "prop-types";
import React from "react";
import dropdownIcon from "./images/icon--dropdown-selector.png";
import infoIcon from "./images/icon--info.png"

const DebuggingTutorialHelp = props => {
    const {
        onDrag,
        onStartDrag,
        onEndDrag,
        isRtl,
        tutorial,
        tutorialIndexData,
        step,
        onHelp,
        onCheckAnswer,
        isHelpVisible,
        selectedAnswers,
        onStepBack,
        onEnterMultiAnswer,
        isGapTextSolved,
        answers,
        setAnswer,
        onGapTextButton,
        ...posProps
    } = props;

    const gapTextButtonState = function () {
        if (answers[2] === "") {
            return ["wähle aus", "", "#4D97FFFF"];
        } else {
            if (answers[2] === "true") {
                return ["ja", tutorial[step].endQuestionTrue, "#70a45f"];
            } else {
                return ["nein", tutorial[step].endQuestionFalse, "#ff8b4d"];
            }
        }
    }

    const renderSingleChoice = () => {
        return Object.keys(tutorial[step]).filter((key) => (key.startsWith("option"))).map((key) => (
            <div key={key} className={css.option}>
                <img alt={"option picture"} className={css.smallImage}
                     style={{width: tutorial[step][key]["width"]}}
                     src={tutorialIndexData[tutorial[step][key]["img"]]}/>

                <input
                    type="radio"
                    id={key}
                    name="singleChoice"
                    checked={answers[0] === key}
                    onChange={(e) => setAnswer(0, key)}
                />
            </div>
        ));
    }

    const renderMultipleChoice = () => {
        return Object.keys(tutorial[step]).filter((key) => (key.startsWith("option"))).map((key) => (
            <div key={key} className={css.option}>
                <img alt={"option picture"} className={css.smallImage}
                     style={{width: tutorial[step][key]["width"]}}
                     src={tutorialIndexData[tutorial[step][key]["img"]]}/>
                <div style={{display: "flex", justifyContent: "center"}}>

                    <button key={key} onClick={() => onEnterMultiAnswer(key)} className=
                        {selectedAnswers[key.at(6) - 1] ? css.multiButton_active : css.multiButton}>
                    </button>
                </div>
            </div>
        ));
    }

    const renderMessage = () => {
        return <div style={{display:"flex", flexDirection:"column", alignItems:"center", marginTop:"20px", marginBottom:"20px"}}>
            <span className={css.messageText}>{tutorial[step]["message"]}</span>
            {tutorial[step].img !== null &&
                <img src={tutorialIndexData[tutorial[step].img]} style={{height:"auto", width:tutorial[step].width}} alt={"messageContent"}/>}
        </div>
    }

    const renderGapText = () => {
        return <div style={{width:"80%"}}>
            <div className={css.textAnswerContainer}>
                <span className={css.textAnswerLine} style={{marginRight: "10px"}}>{tutorial[step].question1.questionStart}</span>
                <div className={isGapTextSolved ? css.dropdownDisabled : css.dropdown}>
                    <input className={css.dropdownBody} readOnly={isGapTextSolved} placeholder={"Anzahl eingeben"} type="text" value={answers[0]} onChange={(e) => setAnswer(0, e.target.value)}/>

                    <div className={isGapTextSolved ? css.dropdownTestDisabled : css.dropdownTest}>
                        <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"}/>
                        <div className={css.dropdownContent}>
                            <span className={css.dropdownElement} onClick={() => setAnswer(0, "0")}>0</span>
                            <span className={css.dropdownElement} onClick={() => setAnswer(0, "unendlich")}>unendlich</span>
                        </div>
                    </div>
                </div>
                <span className={css.textAnswerLine} style={{marginLeft: "10px"}}>{tutorial[step].question1.questionEnd}</span>
            </div>

            <div className={css.textAnswerContainer}>
                <span className={css.textAnswerLine} style={{marginRight: "10px"}}>{tutorial[step].question2.questionStart}</span>
                <div className={isGapTextSolved ? css.dropdownDisabled : css.dropdown}>
                    <input className={css.dropdownBody} readOnly={isGapTextSolved} placeholder={"Anzahl eingeben"} type="text" value={answers[1]} onChange={(e) => setAnswer(1, e.target.value)}/>
                    <div className={isGapTextSolved ? css.dropdownTestDisabled : css.dropdownTest}>
                        <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"}/>
                        <div className={css.dropdownContent}>
                            <span className={css.dropdownElement} onClick={() => setAnswer(1, "0")}>0</span>
                            <span className={css.dropdownElement} onClick={() => setAnswer(1, "unendlich")}>unendlich</span>
                        </div>
                    </div>
                </div>
                <span className={css.textAnswerLine} style={{marginLeft: "10px"}}>{tutorial[step].question2.questionEnd}</span>
            </div>
            {isGapTextSolved && <div>
                        <span className={css.textAnswerLine} style={{marginTop: "30px", fontWeight:"bold", textDecoration:"underline"}}>
                            {tutorial[step].endQuestion}
                        </span>
                <div className={css.textAnswerBar}>
                    <button className={css.textAnswerButton} style={{backgroundColor:gapTextButtonState()[2]}} onClick={onGapTextButton}>
                        {gapTextButtonState()[0]}
                    </button>
                    <span className={css.textAnswerText}>{gapTextButtonState()[1]}</span>
                </div>
            </div>}
        </div>
    }

    const renderDropdown = () => {
        return (
            <div className={css.textAnswerContainer}>
                <span className={css.textAnswerLine} style={{marginRight: "10px"}}>{tutorial[step]["questionText1_0"]}</span>
                <div className={css.dropdown}>
                    <input className={css.dropdownBody} readOnly={true} placeholder={"Wähle aus"} type="text" value={answers[0]}/>
                    <div className={css.dropdownTest}>
                        <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"}/>
                        <div className={css.dropdownContent}>
                            {Object.keys(tutorial[step]).filter((key) => (key.startsWith("option"))).map((key) =>

                                <span className={css.dropdownElement} onClick={() => setAnswer(0, tutorial[step][key]["label"])}>
                                        {tutorial[step][key]["label"]}
                                    </span>)
                            }
                        </div>
                    </div>
                </div>
                <span className={css.textAnswerLine} style={{marginLeft: "10px"}}>{tutorial[step]["questionText1_1"]}</span>
            </div>
        );
    }

    const parseQuestion = function (){
        switch (tutorial[step]["questionType"]) {
            case "SINGLE_CHOICE":
                return renderSingleChoice();
            case "DROPDOWN":
                return renderDropdown();
            case "MULTIPLE_CHOICE":
                return renderMultipleChoice();
            case "GAP_TEXT":
                return renderGapText();
            case "MESSAGE":
                return renderMessage();
            default:
                console.log("Unknown questionType found: " + tutorial[step]["questionType"]);
        }


    }

    return (


        <div className={css.cardContainer}>

            <div className={css.header}>
                <img src={tutorialIndexData["diagramm" + tutorial[step]["diagrammStep"]]} alt="Diagramm of the debugging process." className={css.headerImage} />
            </div>

            <div className={css.questionSection}>
                <div className={css.questionHeader}>
                    <span style={{marginTop:"5px", marginBottom:"5px"}}>{tutorial[step]["text"]}</span>
                    {tutorial[step]["help"] !== null && <div className={isHelpVisible ? css.infoButtonBackground : css.infoButtonBackgroundInvisible} onClick={props.onHelp}>
                        <img className={css.helpButton} style={{width:"15px", height:"auto", paddingTop:"6px"}} src={infoIcon} alt={"infoButton"}/>
                    </div>}
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
                <button className={css.footerButton} onClick={() => onCheckAnswer(tutorial)}>Weiter</button>
            </div>
        </div>
    );
};

DebuggingTutorialHelp.props = {
    onHelp: PropTypes.func,
    tutorial: PropTypes.object.isRequired, //TODO
    step: PropTypes.string,
    onEnterAnswer: PropTypes.func,
    isHelpVisible: PropTypes.bool,
}


export default DebuggingTutorialHelp;

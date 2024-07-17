import css from "./debuggingTutorialWindow.css";
import PropTypes from "prop-types";
import React from "react";
import dropdownIcon from "./images/icon--dropdown-selector.png";

const DebuggingTutorialStep = props => {
    const {
        onDrag,
        onStartDrag,
        onEndDrag,
        isRtl,
        tutorial,
        tutorialIndexData,
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
                return "nein";
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

    const getTextEndAnswerText = function () {
        if (textEndAnswer === "") {
            return "";
        } else {
            if (textEndAnswer === "true") {
                return tutorial[step].endQuestionTrue;
            } else {
                return tutorial[step].endQuestionFalse;
            }
        }
    }



    const parseQuestion = function (){
        switch (tutorial[step]["questionType"]) {
            case "SINGLE":
                return Object.keys(tutorial[step]).filter((key) => (key.startsWith("option"))).map((key) => (
                    <div key={key} className={css.option}>
                        <img alt={"option picture"} className={css.smallImage}
                             style={{width: tutorial[step][key]["width"]}}
                             src={tutorialIndexData[tutorial[step][key]["img"]]}/>

                        <input
                            type="radio"
                            id={key}
                            name="singleChoice"
                            checked={selectedAnswer === key}
                            onChange={(e) => onEnterAnswer(key)}
                        />
                    </div>
                ));
            case "SINGLE_DROPDOWN":
                return (
                    <div className={css.textAnswerContainer}>
                        <span className={css.textAnswerLine} style={{marginRight: "10px"}}>{tutorial[step]["questionText1_0"]}</span>
                        <div className={isTextAnswerCorrect ? css.dropdownDisabled : css.dropdown}>
                            <input className={css.dropdownBody} readOnly={isTextAnswerCorrect} placeholder={"Wähle aus"} type="text" value={textAnswer2} onChange={(e) => onChangeTextInput2(e.target.value)}/>

                            <div className={isTextAnswerCorrect ? css.dropdownTestDisabled : css.dropdownTest}>
                                <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"}/>
                                <div className={css.dropdownContent}>

                                    {Object.keys(tutorial[step]).filter((key) => (key.startsWith("option"))).map((key) =>

                                    <span className={css.dropdownElement} onClick={() => onChangeTextInput2(tutorial[step][key]["label"])}>
                                        {tutorial[step][key]["label"]}
                                    </span>)

                                    }

                                </div>
                            </div>
                        </div>
                        <span className={css.textAnswerLine} style={{marginLeft: "10px"}}>{tutorial[step]["questionText1_1"]}</span>
                    </div>
                );
            case "MULTIPLE":
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
            case "TEXT":
                return <div style={{width:"80%"}}>
                    <div className={css.textAnswerContainer}>
                        <span className={css.textAnswerLine} style={{marginRight: "10px"}}>{tutorial[step].question1.questionStart}</span>
                        <div className={isTextAnswerCorrect ? css.dropdownDisabled : css.dropdown}>
                            <input className={css.dropdownBody} readOnly={isTextAnswerCorrect} placeholder={"Anzahl eingeben"} type="text" value={textAnswer1} onChange={(e) => onChangeTextInput1(e.target.value)}/>

                            <div className={isTextAnswerCorrect ? css.dropdownTestDisabled : css.dropdownTest}>
                                <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"}/>
                                <div className={css.dropdownContent}>
                                    <span className={css.dropdownElement} onClick={() => onChangeTextInput1("0")}>0</span>
                                    <span className={css.dropdownElement} onClick={() => onChangeTextInput1("unendlich")}>unendlich</span>
                                </div>
                            </div>
                        </div>
                        <span className={css.textAnswerLine} style={{marginLeft: "10px"}}>{tutorial[step].question1.questionEnd}</span>
                    </div>

                    <div className={css.textAnswerContainer}>
                        <span className={css.textAnswerLine} style={{marginRight: "10px"}}>{tutorial[step].question2.questionStart}</span>
                        <div className={isTextAnswerCorrect ? css.dropdownDisabled : css.dropdown}>
                            <input className={css.dropdownBody} readOnly={isTextAnswerCorrect} placeholder={"Anzahl eingeben"} type="text" value={textAnswer2} onChange={(e) => onChangeTextInput2(e.target.value)}/>

                            <div className={isTextAnswerCorrect ? css.dropdownTestDisabled : css.dropdownTest}>
                                <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"}/>
                                <div className={css.dropdownContent}>
                                    <span className={css.dropdownElement} onClick={() => onChangeTextInput2("0")}>0</span>
                                    <span className={css.dropdownElement} onClick={() => onChangeTextInput2("unendlich")}>unendlich</span>
                                </div>
                            </div>
                        </div>
                        <span className={css.textAnswerLine} style={{marginLeft: "10px"}}>{tutorial[step].question2.questionEnd}</span>
                    </div>

                    {isTextAnswerCorrect && <div>
                        <span className={css.textAnswerLine} style={{marginTop: "30px", fontWeight:"bold", textDecoration:"underline"}}>
                            {tutorial[step].endQuestion}
                        </span>

                        <div className={css.textAnswerBar}>
                            <button className={css.textAnswerButton} style={{backgroundColor:getTextEndAnswerButtonColor()}} onClick={onChangeTextEndAnswer}>
                                {getTextEndAnswerButtonText()}
                            </button>
                            <span className={css.textAnswerText}>{getTextEndAnswerText()}</span>
                        </div>
                    </div>}
                </div>
            case "MESSAGE":
                return <div style={{marginTop:"20px", marginBottom:"20px"}}>
                    <span className={css.messageText}>{tutorial[step]["message"]}</span>
                </div>
        }


    }
    const a = (answer) => {
        onEnterAnswer(answer)
    }

    return (


        <div className={css.cardContainer}>

            <div className={css.header}>
                <img src={tutorialIndexData["diagramm" + tutorial[step]["diagrammStep"]]} alt="Diagramm of the debugging process." className={css.headerImage} />
            </div>


            <div className={css.questionSection}>
                <div className={css.questionHeader}>
                    <span style={{marginTop:"5px", marginBottom:"5px"}}>{tutorial[step]["text"]}</span>
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
                <button className={css.footerButton} onClick={() => onCheckAnswer(tutorial)}>Weiter</button>
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

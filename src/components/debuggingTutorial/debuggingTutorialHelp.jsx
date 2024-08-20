import css from "./debuggingTutorialHelp.css";
import PropTypes, {func} from "prop-types";
import React, {useEffect, useRef} from "react";
import dropdownIcon from "./images/icon--dropdown-selector.png";
import infoIcon from "./images/icon--info.png"
import shrinkIcon from './images/icon--shrink.svg';
import expandIcon from './images/icon--expand.png';

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
        questionMessage,
        onCloseQuestionMessage,
        onToggleDiagramm,
        showDiagramm,
        onShowDropdown,
        showDropdown,
        cardRef,
        ...posProps
    } = props;

    const stepRegex = /^step[1-9]_1$/;

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

                <div className={css.checkboxTrigger} onClick={() => setAnswer(0, key)}>
                    <button
                        className={(answers[0] === key) ? css.checkbox_active : css.checkbox}
                        key={key}
                        onClick={(e) => {
                            e.stopPropagation();
                            setAnswer(0, key);
                        }}
                        style={{borderRadius: "100px"}}
                    />
                </div>
            </div>
        ));
    }

    const renderMultipleChoice = () => {
        return Object.keys(tutorial[step]).filter((key) => (key.startsWith("option"))).map((key) => (
            <div key={key} className={css.option}>
                <img alt={"option picture"} className={css.smallImage}
                     style={{height: tutorial[step][key]["width"]}}
                     src={tutorialIndexData[tutorial[step][key]["img"]]}/>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <div className={css.checkboxTrigger} onClick={() => onEnterMultiAnswer(key)}>
                        <button key={key} onClick={(e) => {
                            e.stopPropagation();
                            onEnterMultiAnswer(key);}}
                                className= {selectedAnswers[key.at(6) - 1] ? css.checkbox_active : css.checkbox}>
                        </button>
                    </div>
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

                    <div className={isGapTextSolved ? css.dropdownTestDisabled : css.dropdownTest} onMouseEnter={() => isGapTextSolved ? {} : resetDropdownTimer("1")} onMouseLeave={() => isGapTextSolved ? {} : startDropdownTimer()}>
                        <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"}/>
                        {showDropdown === "1" && <div className={css.dropdownContent}>
                            <span className={css.dropdownElement} onClick={() => setAnswer(0, "0")}>0</span>
                            <span className={css.dropdownElement} onClick={() => setAnswer(0, "unendlich")}>unendlich</span>
                        </div>}
                    </div>
                </div>
                <span className={css.textAnswerLine} style={{marginLeft: "10px"}}>{tutorial[step].question1.questionEnd}</span>
            </div>

            <div className={css.textAnswerContainer}>
                <span className={css.textAnswerLine} style={{marginRight: "10px"}}>{tutorial[step].question2.questionStart}</span>
                <div className={isGapTextSolved ? css.dropdownDisabled : css.dropdown}>
                    <input className={css.dropdownBody} readOnly={isGapTextSolved} placeholder={"Anzahl eingeben"} type="text" value={answers[1]} onChange={(e) => setAnswer(1, e.target.value)}/>
                    <div className={isGapTextSolved ? css.dropdownTestDisabled : css.dropdownTest} onMouseEnter={() => isGapTextSolved ? {} : resetDropdownTimer("2")} onMouseLeave={() => isGapTextSolved ? {} : startDropdownTimer()}>
                        <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"}/>
                        {showDropdown === "2" && <div className={css.dropdownContent}>
                            <span className={css.dropdownElement} onClick={() => setAnswer(1, "0")}>0</span>
                            <span className={css.dropdownElement} onClick={() => setAnswer(1, "unendlich")}>unendlich</span>
                        </div>}
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
                    <div className={css.dropdownTest} onMouseEnter={() => resetDropdownTimer("1")} onMouseLeave={() => startDropdownTimer()}>
                        <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"}/>
                        {showDropdown !== null && <div className={css.dropdownContent}>
                            {Object.keys(tutorial[step]).filter((key) => (key.startsWith("option"))).map((key) =>

                                <span className={css.dropdownElement} onClick={() => setAnswer(0, tutorial[step][key]["label"])}>
                                        {tutorial[step][key]["label"]}
                                    </span>)
                            }
                        </div>}
                    </div>
                </div>
                <span className={css.textAnswerLine} style={{marginLeft: "10px"}}>{tutorial[step]["questionText1_1"]}</span>
            </div>
        );
    }
    const timeoutIdRef = useRef(null);
    const startDropdownTimer = function() {
        timeoutIdRef.current = setTimeout(() => {
            onShowDropdown(null);
        }, 100);
    }

    const resetDropdownTimer = function(id) {
        onShowDropdown(id);
        clearTimeout(timeoutIdRef.current);
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

    const renderMsg = function () {
        if (questionMessage === null || questionMessage === undefined) return null;

        const isCorrection = questionMessage.includes("[REVISITING]");
        const primaryColor= isCorrection ? "#4D97FFFF" : "#623d51ff";
        const secondaryColor= isCorrection ? "#b4d3ffff" : "#82645eff";

        return <div className={css.helpBox} style={{backgroundColor: secondaryColor}}>
            <div className={css.helpBoxHeader} style={{backgroundColor: primaryColor}}>Hinweis:</div>
            <span style={{
                padding: "5px 10px",
                color: "white",
                flexShrink: "1",
                width: "100%",
                textAlign: "start"
            }}>{isCorrection ? questionMessage.toString().slice(12) : questionMessage}</span>
            <div className={css.helpBoxClose} style={{backgroundColor: primaryColor}}
                 onClick={onCloseQuestionMessage}>X
            </div>
        </div>
    }

    const renderMsgBorder = function () {
        if (questionMessage === null || questionMessage === undefined) return null;

        const isCorrection = questionMessage.includes("[REVISITING]");
        const primaryColor= isCorrection ? "#4D97FFFF" : "#82645eff";

        return <>
            <div className={css.footerBorder} style={{borderColor: primaryColor}}/>
            <hr className={css.footerLine} style={{borderColor: primaryColor}}/>
        </>
    }

    return (
        <div className={css.cardContainer}>

            <div className={css.header} style={{backgroundColor: showDiagramm ? "transparent" : "rgba(77,151,255,0.42)",
                borderColor: showDiagramm ? "#4D97FFFF" : "transparent"}}>
                <div style={{position:"relative", width:"100%", display: "flex", alignItems: "flex-end"}}>
                    <img onClick={onToggleDiagramm} src={showDiagramm ? expandIcon : shrinkIcon} style={{width:"20px", height:"auto",marginLeft:"auto", marginRight:"10px", paddingBottom:"3px", paddingTop:"3px", cursor: "pointer"}} alt={"expandButton"}/>
                </div>
                {showDiagramm && <img draggable={false} src={tutorialIndexData["diagramm" + tutorial[step]["diagrammStep"]]} alt="Diagramm of the debugging process." className={css.headerImage} />}
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
                {renderMsg()}

                {!stepRegex.test(step) && <button className={css.footerButton} onClick={onStepBack}>Zurück</button>}
                <button className={css.footerButton} onClick={() => onCheckAnswer(tutorial)}>
                    Weiter
                    {renderMsgBorder()}
                </button>
            </div>


            <div ref={endRef} />
        </div>
    );
};

DebuggingTutorialHelp.props = {
    onHelp: PropTypes.func,
    tutorial: PropTypes.object.isRequired,
    step: PropTypes.string,
    onEnterAnswer: PropTypes.func,
    isHelpVisible: PropTypes.bool,
}


export default DebuggingTutorialHelp;

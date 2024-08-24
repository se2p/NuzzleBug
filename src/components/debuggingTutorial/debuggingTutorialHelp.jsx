import css from "./debuggingTutorialHelp.css";
import PropTypes from "prop-types";
import React, {useRef} from "react";
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

    const renderSingleChoice = () => {
        if (!tutorial || !tutorial[step]) {
            console.error("Missing tutorial or tutorial[step]");
            return null;
        }

        return Object.keys(tutorial[step])
            .filter(key => key.startsWith("option"))
            .map(key => {
                const option = tutorial[step][key];
                const isSelected = answers[0] === key;

                if (!option) {
                    console.error(`Missing option for key: ${key}`);
                    return null;
                }

                return (
                    <div key={key} className={css.option}>
                        <img
                            alt="option picture"
                            className={css.smallImage}
                            style={{width: option["width"]}}
                            src={tutorialIndexData[option["img"]] || undefined}
                        />

                        <div className={css.checkboxTrigger} onClick={() => setAnswer(0, key)}>
                            <button
                                className={isSelected ? css.checkboxActive : css.checkbox}
                                key={key}
                                onClick={e => {
                                    e.stopPropagation();
                                    setAnswer(0, key);
                                }}
                                style={{borderRadius: "100px"}}
                            />
                        </div>
                    </div>
                );
            });
    }

    const renderMultipleChoice = () => {
        return Object.keys(tutorial[step])
            .filter(key => key.startsWith("option"))
            .map(key => {
                const option = tutorial[step][key];
                const isSelected = selectedAnswers[key.charAt(6) - 1];

                return (
                    <div key={key} className={css.option}>
                        <img
                            alt="option picture"
                            className={css.smallImage}
                            style={{height: option["width"]} || "auto"}
                            src={tutorialIndexData[option["img"]] || undefined}
                        />
                        <div className={css.checkboxTrigger} onClick={() => onEnterMultiAnswer(key)}>
                            <button
                                className={isSelected ? css.checkboxActive : css.checkbox}
                                onClick={e => {
                                    e.stopPropagation();
                                    onEnterMultiAnswer(key);
                                }}
                            />
                        </div>
                    </div>
                );
            });
    }

    const renderMessage = () => {
        const message = tutorial[step]["message"];
        const img = tutorial[step].img;
        const imgSrc = tutorialIndexData[img];
        const width = tutorial[step].width;

        return (
            <div className={css.messageTextContainer}>
                {message && <span className={css.messageText}>{message}</span>}
                {img &&
                <img src={imgSrc} style={{height:"auto", width}}
                     draggable={false} alt={"messageContent"}/>}
            </div>
        );
    }

    const renderGapText = () => {
        if (isGapTextSolved) {hideDropDowns()}
        const { questionStart: gapStart1, questionEnd: gapEnd1 } = tutorial[step].question1;
        const { questionStart: gapStart2, questionEnd: gapEnd2 } = tutorial[step].question2;
        const { endQuestion: endText } = tutorial[step];

        return (
            <div style={{ width: '80%' }}>
                <div className={css.textAnswerContainer}>
                    <span className={css.textAnswerLine} style={{ marginRight: '10px' }}>{gapStart1}</span>
                    <div className={isGapTextSolved ? css.dropdownDisabled : css.dropdown}>
                        <input
                            className={css.dropdownBody}
                            readOnly={isGapTextSolved}
                            placeholder={'Anzahl eingeben'}
                            type="text"
                            value={answers[0]}
                            onChange={e => setAnswer(0, e.target.value)}
                        />
                        <div
                            className={isGapTextSolved ? css.dropdownTestDisabled : css.dropdownTest}
                            onMouseEnter={() => (isGapTextSolved ? {} : resetDropdownTimer('1'))}
                            onMouseLeave={() => (isGapTextSolved ? {} : startDropdownTimer())}
                        >
                            <img className={css.dropdownIcon} src={dropdownIcon} alt="selectorIcon" />
                            {showDropdown === '1' && (
                                <div className={css.dropdownContent}>
                                    <span className={css.dropdownElement} onClick={() => setAnswer(0, '0')}>
                                        0
                                    </span>
                                    <span className={css.dropdownElement} onClick={() => setAnswer(0, 'unendlich')}>
                                        unendlich
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <span className={css.textAnswerLine} style={{ marginLeft: '10px' }}>{gapEnd1}</span>
                </div>
                <div className={css.textAnswerContainer}>
                    <span className={css.textAnswerLine} style={{ marginRight: '10px' }}>{gapStart2}</span>
                    <div className={isGapTextSolved ? css.dropdownDisabled : css.dropdown}>
                        <input
                            className={css.dropdownBody}
                            readOnly={isGapTextSolved}
                            placeholder={'Anzahl eingeben'}
                            type="text"
                            value={answers[1]}
                            onChange={e => setAnswer(1, e.target.value)}
                        />
                        <div
                            className={isGapTextSolved ? css.dropdownTestDisabled : css.dropdownTest}
                            onMouseEnter={() => (isGapTextSolved ? {} : resetDropdownTimer('2'))}
                            onMouseLeave={() => (isGapTextSolved ? {} : startDropdownTimer())}
                        >
                            <img className={css.dropdownIcon} src={dropdownIcon} alt="selectorIcon" />
                            {showDropdown === '2' && (
                                <div className={css.dropdownContent}>
                                    <span className={css.dropdownElement} onClick={() => setAnswer(1, '0')}>
                                        0
                                    </span>
                                    <span className={css.dropdownElement} onClick={() => setAnswer(1, 'unendlich')}>
                                        unendlich
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <span className={css.textAnswerLine} style={{ marginLeft: '10px' }}>{gapEnd2}</span>
                </div>
                {isGapTextSolved && (
                    <div>
                        <span className={css.textAnswerHeader}>{endText}</span>
                        <div className={css.textAnswerBar}>
                            <button
                                className={css.textAnswerButton}
                                style={{ backgroundColor: gapButtonState()[2] }}
                                onClick={onGapTextButton}
                            >
                                {gapButtonState()[0]}
                            </button>
                            <span className={css.textAnswerText}>{gapButtonState()[1]}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const hideDropDowns = () => {
        // Timeout necessary, as update in render() can lead to errors.
        timeoutIdRef.current = setTimeout(() => {
            onShowDropdown(null);
        }, 0);
    }

    /**
     * Returns the state of the gap gap button based on the current answer.
     *
     * @return {Array} An array containing the button text, description, and background color.
     */
    const gapButtonState = () => {
        const answer = answers[2];
        const states = {
            "": ["wähle aus", "", "#4D97FFFF"],
            "true": ["ja", tutorial[step].endQuestionTrue, "#70a45f"],
            "false": ["nein", tutorial[step].endQuestionFalse, "#ff8b4d"],
        };
        return states[answer] || states[""];
    }


    const renderDropdown = () => {
        const questionStart = tutorial[step]["questionText1_0"];
        const questionEnd = tutorial[step]["questionText1_1"];
        const options = Object.keys(tutorial[step])
            .filter((key) => key.startsWith("option"))
            .map((key) => tutorial[step][key]);

        return (
            <div className={css.textAnswerContainer}>
                <span className={css.textAnswerLine} style={{marginRight: "10px"}}>{questionStart}</span>
                <div className={css.dropdown}>
                    <input className={css.dropdownBody} readOnly={true} placeholder={"Wähle aus"} type="text" value={answers[0]} />
                    <div className={css.dropdownTest} onMouseEnter={() => resetDropdownTimer("1")} onMouseLeave={() => startDropdownTimer()}>
                        <img className={css.dropdownIcon} src={dropdownIcon} alt={"selectorIcon"} />
                        {showDropdown !== null && (
                            <div className={css.dropdownContent}>
                                {options.map((option) => (
                                    <span
                                        className={css.dropdownElement}
                                        key={option.label}
                                        onClick={() => setAnswer(0, option.label)}
                                    >
                                        {option.label}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <span className={css.textAnswerLine} style={{marginLeft: "10px"}}>{questionEnd}</span>
            </div>
        );
    }
    const timeoutIdRef = useRef(null);

    const startDropdownTimer = () => {
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

    const renderMsg = () => {
        if (!questionMessage) {
            return null;
        }

        const pageRevisit = questionMessage.includes("[REVISITING]");
        const primaryColor = pageRevisit ? "#575e75" : "#ff8b4d";
        const secondaryColor = pageRevisit ? "rgb(121,128,161)" : "#fdb17b";
        const trimmedMessage = pageRevisit ? questionMessage.slice(12) : questionMessage;

        return (
            <div className={css.helpBox} style={{ backgroundColor: secondaryColor }}>
                <div className={css.helpBoxHeader} style={{ backgroundColor: primaryColor }}>
                    {pageRevisit? "Hinweis" : "Achtung"}
                </div>
                <span className={css.helpText}>{trimmedMessage}</span>
                <div className={css.helpBoxClose} style={{ backgroundColor: primaryColor }} onClick={onCloseQuestionMessage}>
                    X
                </div>
            </div>
        );
    }

    const renderMessageBorder = () => {
        if (!questionMessage) return null;

        const isCorrection = questionMessage.includes('[REVISITING]');
        const primaryColor = isCorrection ? '#575e75' : '#ff8b4d';

        return (
            <>
                <div className={css.footerBorder} style={{ borderColor: primaryColor }} />
                <hr className={css.footerLine} style={{ borderColor: primaryColor }} />
            </>
        );
    }

    return (
        <div className={css.cardContainer}>
            <div className={css.header} style={{backgroundColor: showDiagramm ? "transparent" : "#4D97FF6B",
                borderColor: showDiagramm ? "#4D97FFFF" : "transparent"}}>
                <div className={css.diagrammButtonContainer}>
                    <img className={css.diagrammButton}
                         onClick={onToggleDiagramm}
                         src={showDiagramm ? expandIcon : shrinkIcon}
                         draggable={false} alt={"expandButton"}/>
                </div>
                {showDiagramm && <img
                    draggable={false}
                    src={tutorialIndexData["diagramm" + tutorial[step]["diagrammStep"]]}
                    alt="Diagramm of the debugging process." className={css.headerImage}
                />}
            </div>

            <div className={css.questionSection}>
                <div className={css.questionHeader}>
                    <span style={{marginTop:"5px", marginBottom:"5px"}}>{tutorial[step]["text"]}</span>
                    {tutorial[step]["help"] !== null && <div className={isHelpVisible ? css.infoButtonBackground : css.infoButtonBackgroundInvisible} onClick={props.onHelp}>
                        <img className={css.helpButton} src={infoIcon} alt={"infoButton"}/>
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
                    {renderMessageBorder()}
                </button>
            </div>
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

import css from './debugging-help.css';
import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import dropdownIcon from '../../../../images/icon--dropdown-selector.png';
import bubbleIndicator from '../../../../images/bubbleDecalGreyHelp.png';
import euliLeft from '../../../../images/OwlBranchRight.png';
import bubbleIndicatorBlue from '../../../../images/bubbleDecalBlue.png';
import MultipleChoice from './question-types/multiple-choice.jsx';
import SingleChoice from './question-types/single-choice.jsx';
import Message from './question-types/message.jsx';
import Mark from './question-types/mark.jsx';
import MarkChoice from './question-types/mark-choice.jsx';
import Explanation from './question-explanations.jsx';

const RESPONSE_DEFAULT = 'scratch-gui/debugging-tutorial-help/DEFAULT';
const RESPONSE_EXPLANATION = 'scratch-gui/debugging-tutorial-help/EXPLANATION';
const RESPONSE_EXPLANATION1 = 'scratch-gui/debugging-tutorial-help/EXPLANATION1';
const RESPONSE_EXPLANATION2 = 'scratch-gui/debugging-tutorial-help/EXPLANATION2';
const RESPONSE_EXPLANATION3 = 'scratch-gui/debugging-tutorial-help/EXPLANATION3';
const RESPONSE_EXPLANATION4 = 'scratch-gui/debugging-tutorial-help/EXPLANATION4';
const RESPONSE_HELP = 'scratch-gui/debugging-tutorial-help/RESPONSE_HELP';
const RESPONSE_CONTROL = 'scratch-gui/debugging-tutorial-help/RESPONSE_CONTROL';


const DebuggingHelp = props => {
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
        addSelectedBlock,
        removeSelectedBlock,
        selectedBlocks,
        onDiagrammExplanation,
        showExplanation,
        responseType, // New
        setResponseType,
        onHomeMenu,
        guiMessages,
        ...posProps
    } = props;

    const stepRegex = /^step[1-9]_1$/;
    const timeoutIdRef = useRef(null);

    const parseQuestion = function (){
        switch (tutorial[step].questionType) {
        case 'SINGLE_CHOICE':
            // return renderSingleChoice();
            // return renderToggle();

            return (<SingleChoice
                tutorial={tutorial}
                step={step}
                tutorialIndexData={tutorialIndexData}
                answers={answers}
                setAnswer={setAnswer}
            />);
        case 'DROPDOWN':
            return renderDropdown();
        case 'MULTIPLE_CHOICE':
            // return renderMultipleChoice();
            return (<MultipleChoice
                tutorial={tutorial}
                step={step}
                tutorialIndexData={tutorialIndexData}
                selectedAnswers={selectedAnswers}
                onEnterMultiAnswer={onEnterMultiAnswer}
            />);
        case 'GAP_TEXT':
            return renderGapText();
        case 'MESSAGE':
            return (<Message
                tutorial={tutorial}
                step={step}
                tutorialIndexData={tutorialIndexData}
            />);
        case 'MARK':
            return (<Mark
                tutorial={tutorial}
                step={step}
                answers={answers}
                setAnswer={setAnswer}
                tutorialIndexData={tutorialIndexData}
                selectedBlocks={selectedBlocks}
                addSelectedBlock={addSelectedBlock}
                removeSelectedBlock={removeSelectedBlock}
            />);
            // return renderMark();
        case 'MARK_CHOICE':
            // return renderMarkChoice();
            return (<MarkChoice
                selectedBlocks={selectedBlocks}
                tutorial={tutorial}
                step={step}
                answers={answers}
                setAnswer={setAnswer}
                tutorialIndexData={tutorialIndexData}
            />);
        default:
            console.log(`Unknown questionType found: ${tutorial[step].questionType}`);
        }
    };


    const renderGapText = () => {
        if (isGapTextSolved) {
            hideDropDowns();
        }
        const {questionStart: gapStart1, questionEnd: gapEnd1} = tutorial[step].question1;
        const {questionStart: gapStart2, questionEnd: gapEnd2} = tutorial[step].question2;
        const {endQuestion: endText} = tutorial[step];

        return (
            <div style={{width: '90%', marginLeft: '10px'}}>
                <div className={css.textAnswerContainer}>
                    <span
                        className={css.textAnswerLine}
                        style={{marginRight: '10px'}}
                    >{gapStart1}</span>
                    <div
                        className={isGapTextSolved ? css.dropdownDisabled : css.dropdown}
                        style={{width: '150px'}}
                    >
                        <input
                            className={css.dropdownBody}
                            readOnly={isGapTextSolved}
                            placeholder={'...'}
                            type="text"
                            value={answers[0]}
                            onChange={e => setAnswer(0, e.target.value)}
                        />
                        <div
                            className={isGapTextSolved ? css.dropdownTestDisabled : css.dropdownTest}
                            onMouseEnter={() => (isGapTextSolved ? {} : resetDropdownTimer('1'))}
                            onMouseLeave={() => (isGapTextSolved ? {} : startDropdownTimer())}
                        >
                            <img
                                className={css.dropdownIcon}
                                src={dropdownIcon}
                                alt="selectorIcon"
                            />
                            {showDropdown === '1' && (
                                <div className={css.dropdownContent}>
                                    <span
                                        className={css.dropdownElement}
                                        onClick={() => setAnswer(0, '0')}
                                    >
                                        0
                                    </span>
                                    <span
                                        className={css.dropdownElement}
                                        onClick={() => setAnswer(0, '1')}
                                    >
                                        1
                                    </span>
                                    <span
                                        className={css.dropdownElement}
                                        onClick={() => setAnswer(0, 'mehrmals')}
                                    >
                                        mehrmals
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <span
                        className={css.textAnswerLine}
                        style={{marginLeft: '10px'}}
                    >{gapEnd1}</span>
                </div>
                <div className={css.textAnswerContainer}>
                    <span
                        className={css.textAnswerLine}
                        style={{marginRight: '10px'}}
                    >{gapStart2}</span>
                    <div
                        className={isGapTextSolved ? css.dropdownDisabled : css.dropdown}
                        style={{width: '150px'}}
                    >
                        <input
                            className={css.dropdownBody}
                            readOnly={isGapTextSolved}
                            placeholder={'...'}
                            type="text"
                            value={answers[1]}
                            onChange={e => setAnswer(1, e.target.value)}
                        />
                        <div
                            className={isGapTextSolved ? css.dropdownTestDisabled : css.dropdownTest}
                            onMouseEnter={() => (isGapTextSolved ? {} : resetDropdownTimer('2'))}
                            onMouseLeave={() => (isGapTextSolved ? {} : startDropdownTimer())}
                        >
                            <img
                                className={css.dropdownIcon}
                                src={dropdownIcon}
                                alt="selectorIcon"
                            />
                            {showDropdown === '2' && (
                                <div className={css.dropdownContent}>
                                    <span
                                        className={css.dropdownElement}
                                        onClick={() => setAnswer(1, '0')}
                                    >
                                        0
                                    </span>
                                    <span
                                        className={css.dropdownElement}
                                        onClick={() => setAnswer(1, '1')}
                                    >
                                        1
                                    </span>
                                    <span
                                        className={css.dropdownElement}
                                        onClick={() => setAnswer(1, 'mehrmals')}
                                    >
                                        mehrmals
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <span
                        className={css.textAnswerLine}
                        style={{marginLeft: '10px'}}
                    >{gapEnd2}</span>
                </div>
                {isGapTextSolved && (
                    <div>
                        <span className={css.textAnswerHeader}>{endText}</span>
                        <div className={css.textAnswerBar}>
                            <button
                                className={css.textAnswerButton}
                                style={{backgroundColor: gapButtonState()[2]}}
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
    };

    const hideDropDowns = () => {
        // Timeout necessary, as update in render() can lead to errors.
        timeoutIdRef.current = setTimeout(() => {
            onShowDropdown(null);
        }, 0);
    };

    /**
     * Returns the state of the gap button based on the current answer.
     *
     * @return {Array} An array containing the button text, description, and background color.
     */
    const gapButtonState = () => {
        const answer = answers[2];
        const states = {
            '': [guiMessages.help.select, '', '#4D97FFFF'],
            'true': [guiMessages.help.true, tutorial[step].endQuestionTrue, '#70a45f'],
            'false': [guiMessages.help.false, tutorial[step].endQuestionFalse, '#ff8b4d']
        };
        return states[answer] || states[''];
    };

    const renderDropdown = () => {
        const questionStart = tutorial[step].questionText1_0;
        const questionEnd = tutorial[step].questionText1_1;
        const options = Object.keys(tutorial[step])
            .filter(key => key.startsWith('option'))
            .map(key => tutorial[step][key]);

        return (
            <div
                className={css.textAnswerContainer}
                style={{marginLeft: '10px'}}
            >
                <span
                    className={css.textAnswerLine}
                    style={{marginRight: '10px'}}
                >{questionStart}</span>
                <div className={css.dropdown}>
                    <input
                        className={css.dropdownBody}
                        readOnly
                        placeholder={'...'}
                        type="text"
                        value={answers[0]}
                    />
                    <div
                        className={css.dropdownTest}
                        onMouseEnter={() => resetDropdownTimer('1')}
                        onMouseLeave={() => startDropdownTimer()}
                    >
                        <img
                            className={css.dropdownIcon}
                            src={dropdownIcon}
                            alt={'selectorIcon'}
                        />
                        {showDropdown !== null && (
                            <div className={css.dropdownContent}>
                                {options.map(option => (
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
                <span
                    className={css.textAnswerLine}
                    style={{marginLeft: '10px'}}
                >{questionEnd}</span>
            </div>
        );
    };


    const startDropdownTimer = () => {
        timeoutIdRef.current = setTimeout(() => {
            onShowDropdown(null);
        }, 100);
    };

    const resetDropdownTimer = function (id) {
        onShowDropdown(id);
        clearTimeout(timeoutIdRef.current);
    };

    const renderHelpPage = () => (
        <div className={css.pageContainer}>
            <div
                className={css.whiteBox}
                style={{paddingBottom: '0', paddingTop: '0', marginBottom: '10px'}}
            >
                <div className={css.bubbleContainer}>
                    <div className={css.bubbleBoxContainer}>
                        <div className={css.bubble}>
                            <img
                                className={css.bubbleIndicator}
                                alt={'Bubble-Decal'}
                                src={bubbleIndicator}
                            />
                            {getResponseText()}
                        </div>
                    </div>
                    <img
                        src={euliLeft}
                        alt={'Picture of Euli'}
                        className={css.owlImage}
                        draggable={false}
                    />
                </div>
            </div>

            <div className={css.whiteBox}>
                <div
                    className={css.questionSection}
                    style={{filter:
                                 responseType === RESPONSE_EXPLANATION ||
                                 responseType === RESPONSE_EXPLANATION1 ||
                                 responseType === RESPONSE_EXPLANATION2 ||
                                 responseType === RESPONSE_EXPLANATION3 ||
                                 responseType === RESPONSE_EXPLANATION4 ||
                                 responseType === RESPONSE_CONTROL ?
                                     'grayscale(90%)' : 'none'}}
                >
                    <img
                        className={css.responseBubbleIndicator}
                        src={bubbleIndicatorBlue}
                        alt={'bubbleDecal'}
                    />
                    <div className={css.questionHeader}>
                        <span>{tutorial[step].response}</span>
                    </div>
                    {parseQuestion()}
                </div>
            </div>

            <div className={css.footer}>
                <div>
                    <button
                        className={css.footerButton}
                        onClick={() => setResponseType(RESPONSE_HELP)}
                    >
                        {guiMessages.help.helpButton}
                    </button>
                </div>

                <div style={{display: 'flex', zIndex: '100'}}>
                    <div
                        className={css.footerBackButton}
                        onClick={() => {
                            onStepBack(); setResponseType(RESPONSE_DEFAULT);
                        }}
                    />
                    <div
                        className={css.footerNextButton}
                        onClick={() => {
                            onCheckAnswer(tutorial); setResponseType(RESPONSE_DEFAULT);
                        }}
                    />

                    <div className={css.preloadFooterBackButton} />
                    <div className={css.preloadFooterNextButton} />
                </div>
            </div>
        </div>
    );

    const getResponseText = () => {
        switch (responseType) {
        case RESPONSE_DEFAULT:
            // Falls eine eigene Frage-Nachricht vorhanden ist, wird diese priorisiert.
            if (questionMessage != null && !questionMessage.startsWith('[REVISITING]')) {
                return (
                    <div className={css.responseContainer}>
                        <p style={{fontSize: '1rem', marginBottom: '10px'}}>
                            <strong><u style={{color: '#ff735a'}}>{guiMessages.help.warning}</u>&nbsp;{questionMessage}</strong>
                        </p>
                    </div>
                );
            }

            // Sicherstellen, dass wir eine Frage aus dem aktuellen Tutorial-Schritt haben.
            const {text} = tutorial[step] || {};
            return (
                <div className={css.responseContainer}>
                    <p style={{fontSize: '1rem', marginBottom: '10px'}}>
                        <strong><u style={{color: '#d2a99e'}}>Euli:</u>&nbsp;{text}</strong>
                    </p>
                    {questionMessage?.startsWith('[REVISITING]') && (
                        <p style={{fontSize: '0.8rem'}}>
                            <span style={{color: '#ff735a', fontWeight: 'bold'}}>
                                Hinweis:&nbsp;
                            </span>
                            {questionMessage?.slice(12)}
                        </p>
                    )}
                </div>
            );
        case RESPONSE_EXPLANATION:
            return (
                <div className={css.responseContainer}>
                    <p>
                        <strong style={{fontSize: '1.2rem'}}>
                            Worüber soll ich dir mehr erzählen?
                        </strong>
                    </p>

                    <div className={css.responseButtonList}>
                        <div className={css.responseButton}>
                            <button
                                className={css.responseButtonNext}
                                onClick={() => setResponseType(RESPONSE_CONTROL)}
                                style={{backgroundColor: '#a42de3', color: 'white'}}
                            >
                                Wie funktioniert die Steuerung?
                            </button>
                        </div>
                        <div className={css.responseButton}>
                            <button
                                className={css.responseButtonNext}
                                onClick={() => setResponseType(RESPONSE_EXPLANATION1)}
                                style={{backgroundColor: '#f16947ff', color: 'white'}}
                            >
                                Was soll ich tun?
                            </button>
                        </div>
                        <div className={css.responseButton}>
                            <button
                                className={css.responseButtonNext}
                                onClick={() => setResponseType(RESPONSE_DEFAULT)}
                                style={{backgroundColor: '#d3325bff', color: 'white'}}
                            >
                                Zurück
                            </button>
                        </div>
                    </div>
                </div>
            );
        case RESPONSE_EXPLANATION1:
            return (
                <div className={css.responseContainer}>
                    <p style={{fontSize: '1rem', marginBottom: '0px', color: '#f16947ff'}}><strong>Was soll ich tun?</strong></p>
                    <p>Auch Profis haben manchmal Schwierigkeiten, Fehler im Code zu finden.
                        Aber keine Sorge, wir packen das zusammen! Ich helfe dir,
                        Schritt für Schritt den Fehler aufzuspüren.</p>

                    <div className={css.responseButtonContainer}>
                        <button
                            className={css.responseButtonNext}
                            onClick={() => setResponseType(RESPONSE_EXPLANATION2)}
                        >Weiter
                        </button>
                    </div>
                </div>
            );
        case RESPONSE_EXPLANATION2:
            return (
                <div className={css.responseContainer}>
                    <p style={{fontSize: '1rem', marginBottom: '0px', color: '#f16947ff'}}><strong>Was soll ich tun?</strong></p>
                    <p>Mein Ziel ist es, dich langsam zum Fehler zu führen. Dafür stelle ich dir mehrere Fragen,
                        die du nacheinander beantworten kannst. Keine Eile – wir gehen alles in deinem Tempo durch!</p>

                    <div className={css.responseButtonContainer}>
                        <button
                            className={css.responseButtonNext}
                            onClick={() => setResponseType(RESPONSE_EXPLANATION3)}
                        >Weiter
                        </button>
                    </div>
                </div>
            );
        case RESPONSE_EXPLANATION3:
            return (
                <div className={css.responseContainer}>
                    <p style={{fontSize: '1rem', marginBottom: '0px', color: '#f16947ff'}}><strong>Was soll ich tun?</strong></p>
                    <p>Falls du mal bei einer Frage nicht weiterkommst, klick einfach auf 'Hilf mir', und ich gebe
                        dir einen Tipp. Wenn du nicht weißt, wie du die Frage steuern sollst, probier 'Steuerung' aus.</p>

                    <div className={css.responseButtonContainer}>
                        <button
                            className={css.responseButtonNext}
                            onClick={() => setResponseType(RESPONSE_EXPLANATION4)}
                        >Weiter
                        </button>
                    </div>
                </div>
            );
        case RESPONSE_EXPLANATION4:
            return (
                <div className={css.responseContainer}>
                    <p style={{fontSize: '1rem', marginBottom: '0px', color: '#f16947ff'}}><strong>Was soll ich tun?</strong></p>
                    <p>Los geht’s! Beantworte einfach meine erste Frage, und wir arbeiten uns zusammen durch. Du
                        wirst sehen, das wird spannend – und am Ende finden wir den Fehler!</p>

                    <div className={css.responseButtonContainer}>
                        <button
                            className={css.responseButtonNext}
                            style={{backgroundColor: '#f16947ff', color: 'white'}}
                            onClick={() => setResponseType(RESPONSE_DEFAULT)}
                        >Los gehts!
                        </button>
                    </div>
                </div>
            );
        case RESPONSE_HELP:
            return (
                <div className={css.responseContainer}>
                    <p style={{marginBottom: '10px', fontSize: '1rem'}}>
                        <strong><u style={{color: '#a3cbff'}}>Hilfestellung:</u>&nbsp;
                            {tutorial[step].help === null ?
                                'Zu diesem Schritt kann ich dir im Moment nicht mehr verraten.' :
                                tutorial[step].help}</strong>
                    </p>
                    <div className={css.responseButtonContainer}>
                        <button
                            className={css.responseButtonNext}
                            onClick={() => setResponseType(RESPONSE_DEFAULT)}
                            style={{backgroundColor: '#A3CBFFFF'}}
                        >Alles klar!
                        </button>
                    </div>
                </div>
            );
        case RESPONSE_CONTROL:
            return (
                <div className={css.responseContainer}>
                    <p style={{fontSize: '1rem', marginBottom: '0px', color: '#bd6eff'}}><strong>Wie funktioniert die Steuerung?</strong></p>
                    <Explanation questionType={tutorial[step].questionType} />

                    <div className={css.responseButtonContainer}>
                        <button
                            className={css.responseButtonNext}
                            onClick={() => setResponseType(RESPONSE_DEFAULT)}
                        >Alles klar!
                        </button>
                    </div>
                </div>
            );
        }
    };

    return renderHelpPage();
};

DebuggingHelp.props = {
    onHelp: PropTypes.func,
    tutorial: PropTypes.object.isRequired,
    step: PropTypes.string,
    onEnterAnswer: PropTypes.func,
    isHelpVisible: PropTypes.bool
};

export default DebuggingHelp;

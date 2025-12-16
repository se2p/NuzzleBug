import css from "./final-step.css"
import owl2 from "./images/owlTransparent.png"
import bubbleIndicatorBlue from "./images/bubbleIDecalBlue2.png"
import React, {useState} from "react";
import rightArrow from "../cards/icon--next.svg";
import iconDescription from "./images/icon--Description.png";




/**
 * Renders the final congratulation message after finishing a tutorial.
 */
export const FinalStep = ({ tutorialMessages, guiMessages, onBackToTutorialSelection }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [wrongOptions, setWrongOptions] = useState([]);
    const [showSolution, setShowSolution] = useState(false);
    const [answer, setAnswer] = useState("");
    const [renderButtons2, setRenderButtons] = useState(true);

    const [pageState, setPageState] = useState("before");
    const PAGE = {
        BEFORE: "before",
        QUESTION: "question",
        AFTER: "after",
    };

    const correctAnswer = 10;
    const answerB = [1,2,5];
    const isCorrect =
        answer.trim() !== "" && Number(answer) === Number(correctAnswer);


    const toggleOption = (index) => {
        setShowSolution(false);
        setSelectedOptions((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index) // abwählen
                : [...prev, index]               // auswählen
        );
    };


    const renderQuestion = (guiMessages) => {
        const questionData = "a";
        return (
            <div className={css.cpContainer}>
                <div className={css.whiteBox} style={{paddingTop: "0"}}>

                    <div style={{width: "100%"}}>
                        <div className={css.tabContainer}>
                            <button className={css.tabButton}
                                    id="beschreibungTab">
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <img className={css.icon} src={iconDescription} alt={"errorIcon"}/>
                                    Boot
                                </div>
                            </button>
                        </div>
                        <div className={css.container} style={{borderColor: "#4D97FFFF"}}>
                            {getContent()}
                        </div>
                    </div>

                </div>
                {renderNextButton(guiMessages, "Überprüfen")}
            </div>
        );
    }

    const renderNextButton = (guiMessages, text, onBackToTutorialSelection) => {
        return (
            <div>
                <div
                    className={css.rightButton}
                    onClick={() => evaluate(onBackToTutorialSelection)}
                >
                    <span>{text}</span>
                    <img
                        draggable={false}
                        src={rightArrow}
                        alt="Arrow pointing right"
                    />
                </div>
            </div>
        );
    }

    const getContent = () => {
        return (
            <div className={css.qaCard} data-has-preview="true">
                <div className={css.qaLeft}>
                    <div className={css.qaQuestion}>
                        <div className={css.qaQuestionLabel}>Frage 1:</div>
                        <div className={css.qaQuestionText}>
                            Which of these blocks controls how many times this loop is executed?
                        </div>
                    </div>

                    {renderButtons2 ? renderButtons() : renderInputField()}

                </div>
                <div className={css.qaPreview} aria-label="Block-Vorschau">
                    <img
                        src={owl2}
                        alt="Scratch block preview"
                        className={css.qaPreviewImg}
                        draggable={false}
                    />
                </div>
            </div>
        );
    }

    const renderInputField = () => {
        return (<div className={css.qaInputRow} aria-label="Zahl eingeben">
            <input
                className={[
                    css.qaNumberInput,
                    showSolution && (isCorrect ? css.qaInputRight : css.qaInputWrong),
                ].filter(Boolean).join(" ")}
                type="number"
                inputMode="numeric"
                value={answer}
                onChange={(e) => {
                    setShowSolution(false);
                    setAnswer(e.target.value);
                }}
                placeholder="Zahl eingeben"
            />
        </div>
        );
    }

    const renderButtons = () => {
        return (
            <div
                className={css.qaOptions}
                role="group"
                aria-label="Antwortoptionen"
            >
                <button
                    className={[
                        css.qaOption,
                        selectedOptions.includes(1) && css.qaOptionSelected,
                        showSolution && (wrongOptions.includes(1) ? css.qaOptionWrong : css.qaOptionRight)
                    ].filter(Boolean).join(' ')}
                    type="button"
                    onClick={() => {
                        toggleOption(1);
                        setWrongOptions([1, 2, 5]);
                    }}>
                    <span className={css.pill}>Hmm...</span>
                </button>

                <button
                    className={[
                        css.qaOption,
                        selectedOptions.includes(2) && css.qaOptionSelected,
                        showSolution && (wrongOptions.includes(2) ? css.qaOptionWrong : css.qaOptionRight)
                    ].filter(Boolean).join(' ')}
                    type="button"
                    onClick={() => toggleOption(2)}>
                    <span className={`${css.pill} ${css.pillNumber}`}>10</span>
                </button>

                <button
                    className={[
                        css.qaOption,
                        selectedOptions.includes(3) && css.qaOptionSelected,
                        showSolution && (wrongOptions.includes(3) ? css.qaOptionWrong : css.qaOptionRight)
                    ].filter(Boolean).join(' ')}
                    type="button"
                    onClick={() => toggleOption(3)}>
                    <span className={`${css.pill} ${css.pillNumber}`}>90</span>
                </button>

                <button
                    className={[
                        css.qaOption,
                        selectedOptions.includes(4) && css.qaOptionSelected,
                        showSolution && (wrongOptions.includes(4) ? css.qaOptionWrong : css.qaOptionRight)
                    ].filter(Boolean).join(' ')}
                    type="button"
                    onClick={() => toggleOption(4)}>
                    <span className={`${css.pill} ${css.pillNumber}`}>15</span>
                </button>

                <button
                    className={[
                        css.qaOption,
                        selectedOptions.includes(5) && css.qaOptionSelected,
                        showSolution && (wrongOptions.includes(5) ? css.qaOptionWrong : css.qaOptionRight)
                    ].filter(Boolean).join(' ')}
                    type="button"
                    onClick={() => toggleOption(5)}>
                    <span className={`${css.pill} ${css.pillNumber}`}>3</span>
                </button>
            </div>
        );
    }

    const evaluate = (onBackToTutorialSelection) => {
        if (pageState === PAGE.BEFORE) {
            setPageState(PAGE.QUESTION);
            return;
        }

        if (pageState === PAGE.AFTER) {
            onBackToTutorialSelection();
            return;
        }


        if (renderButtons2) {
            const wrongOptions = [1, 2, 3, 4, 5].filter(
                (n) => answerB.includes(n) !== selectedOptions.includes(n)
            );

            if (wrongOptions.length === 0) {
                setRenderButtons(false);
                return;
            }
            setWrongOptions(wrongOptions);
            setShowSolution(true);
        } else {
            setShowSolution(true);

            if (isCorrect) {
                setPageState(PAGE.AFTER)
            }
        }
    }


    const renderContent = (onBackToTutorialSelection) => {
        switch (pageState) {
            case PAGE.BEFORE:
                return (renderBeforePage(guiMessages));
            case PAGE.QUESTION:
                return (renderQuestion(guiMessages));
            case PAGE.AFTER:
                return (renderAfterPage(guiMessages, onBackToTutorialSelection));
        }
    }

    const renderBeforePage = (guiMessages) => {
        return (
            <div className={css.cpContainer}>
                <span className={css.finalTitle}>Sehr gut!</span>
                <div className={css.whiteBox}>
                    <div className={css.bubbleContainer}>
                        <div className={css.testStartBubble}>
                            <img className={css.finalBubbleIndicator} alt={"Bubble-Decal"} src={bubbleIndicatorBlue}/>
                            <span>
                              Klasse Arbeit! Du hast das Tutorial gemeistert und dein Spiel fertig erstellt.
                              <br/>Jetzt wartet eine kleine Herausforderung auf dich:
                              ein paar Fragen zu deinem Code.  <br/> <br/>Traust du dich?
                            </span>
                        </div>
                        <img src={owl2} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
                    </div>
                </div>
                {renderNextButton(guiMessages, "Los!")}
                {/*<div className={css.backToMenuButton} onClick={() => {onBackToTutorialSelection();}}>Weiter</div>*/}
            </div>
        );
    }
    const renderAfterPage = (guiMessages, onBackToTutorialSelection) => {
        return (
            <div className={css.cpContainer}>
                <span className={css.finalTitle}>Glückwunsch!</span>
                <div className={css.whiteBox}>
                    <div className={css.bubbleContainer}>
                        <div className={css.testStartBubble}>
                            <img className={css.finalBubbleIndicator} alt={"Bubble-Decal"} src={bubbleIndicatorBlue}/>
                            <span>Super gemacht! Du hast alle Aufgaben geschafft.<br/>
Doch das Abenteuer geht weiter: Es warten noch viele spannende Tutorials auf dich.<br/><br/>
Klicke unten auf den Pfeil und leg los!</span>
                        </div>
                        <img src={owl2} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
                    </div>
                </div>
                {renderNextButton(guiMessages, "Tutorials", onBackToTutorialSelection)}
            </div>
        );
    }

    return renderContent(onBackToTutorialSelection);
}

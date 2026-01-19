import PropTypes from "prop-types";
import React, {useRef, useState} from "react";
import css from "./debuggingTutorialStep.css"
import owl from "../images/OwlBranchRight.png"
import iconErrors from "../images/icon--Errors.png"
import iconDescription from "../images/icon--Description.png"
import iconControls from "../images/icon--Controls.png"
import buttonOwly from "../images/buttonOwly.png"
import buttonReset from "../images/buttonReset.png"
import buttonResult from "../images/buttonResults.png"
import buttonTest from "../images/buttonTest.png"
import bubbleIndicator from "../images/SpeachBubbleRed.png"
import bubbleIndicatorGray from "../images/bubbleDecalGrey.png"
import bubbleIndicatorBlue from "../images/bubbleIDecalBlue2.png"
import buttonHelp from "../images/buttonHelp.png"
import {renderResponseClassic, renderResponseDebugging} from "../tutorial-step-response-renderer.jsx";
import {
    RESPONSE_START,
    RESPONSE_DEFAULT,
    RESPONSE_RELOAD,
    RESPONSE_TESTING,
    RESPONSE_TESTING_FINISHED,
    RESPONSE_ASK_TEST_START,
    PAGE_OVERVIEW,
    PAGE_RESPONSE,
    PAGE_TEST_RESULTS,
    PAGE_HELP,
    RESPONSE_EXPLANATION1,
    RESPONSE_EXPLANATION2, RESPONSE_EXPLANATION3, RESPONSE_EXPLANATION4
} from '../tutorial-constants.jsx';
import TestResults from "../test-results/test-results.jsx";
import rightArrow from "../../cards/icon--next.svg";
import leftArrow from "../../cards/icon--prev.svg";
import logging from 'scratch-vm/src/util/logging.js';
import {
    checkUserMadeErrors,
    generateControlImages,
    getBorderColor,
    handleHoldButton, logResponse,
    resetHoldButton
} from "./tutorial-step-util.jsx";
import {ENABLE_RESET_BUTTON, ENABLE_TODO_BUTTON} from "../config.ts";
import {FinalStep, renderFinalStep} from "../final-step.jsx";
import TutorialHelpPage from "./tutorial-help-page.jsx";
import HintGenerator from "../GPT-prompts/hint-generation.js";
import {parseColoredText} from "../typewriter.jsx";
const DebuggingTutorialStep = props => {
    const {
        onOpenHelp,
        tutorialMessages,
        step,
        onStartTests,
        isErrorInfoVisible,
        testResults,
        onTestDetails,
        showTestDetail,
        nextStep,
        onResetProject,
        setLoading,
        isLoading,
        reachedLastStep,
        projectLoadingState,
        setContentType,
        contentType,
        showErrorInfo,
        setResponseType,
        responseType,
        setCurPage,
        curPage,
        showQuickHandle,
        isShowingQuickHandle,
        tutorialIndexData,
        setCurTestDetails,
        curTestDetails,
        isDebuggingTutorial,
        overviewStep,
        showControlOverview,
        setHelpType,
        helpType,
        onBackToTutorialSelection,
        hasCodeUpdated,
        testPageIndex,
        onIncreaseTestPageIndex,
        onDecreaseTestPageIndex,
        guiMessages,
        sprites,
        setSelectedSprite,
        selectedSprite,
        vm,
        removeTutorialPoint,
        tutorialPoints,
        ...posProps
    } = props;


    const progressBarRef = useRef(null);
    const timeoutIdRef = useRef(null);

    const handleMouseDown = () => {
        timeoutIdRef.current = handleHoldButton(progressBarRef, () => {
            setCurPage(PAGE_TEST_RESULTS);
            onStartTests();
            showQuickHandle();
        }, setLoading);
    };
    const handleMouseUp = () => resetHoldButton(progressBarRef, setLoading, timeoutIdRef);


    const renderResponse = () => {
        return (
            <div className={css.cpContainer}>
                <div className={css.whiteBox} style={{marginTop: "60px", width: "80%", border: "#575E75FF solid 3px"}}>
                    <img className={css.controlPanelImageSmall} src={owl} alt={"Owl picture"} draggable={false}/>

                    <div>
                        <div className={css.responseBubble}>
                            <img className={css.responseBubbleIndicator} src={bubbleIndicatorGray} alt={"bubbleDecal"}/>
                            {getResponse()}
                        </div>
                    </div>
                </div>

                <div className={css.cpButtonRow}>
                    {isDebuggingTutorial ? <div className={css.controlPanelButtonParent}>
                        <img
                            className={css.cpButton}
                            src={buttonTest}
                            alt={"Button Icon"}
                            draggable={false}
                            onClick={() => {
                                if (testResults === null || testResults === undefined) {
                                    //setResponseType(RESPONSE_ASK_TEST_START);
                                    setCurPage(PAGE_TEST_RESULTS);
                                } else {
                                    setCurPage(PAGE_TEST_RESULTS);
                                    if (!testResults?.passed) setResponseType(RESPONSE_DEFAULT);
                                }
                                //if (!testResults?.passed) handleTestStart()
                                }
                        }
                            style={{
                                filter: (responseType === RESPONSE_START
                                || responseType === RESPONSE_DEFAULT
                                || responseType === RESPONSE_TESTING
                                || responseType === RESPONSE_TESTING_FINISHED) && !testResults?.passed ? "none" : "grayscale(100%) brightness(1.2)",
                            }}
                        />
                        <span className={css.cpButtonDescription}>{guiMessages.step.testButton}</span>
                    </div> :
                    <div className={css.controlPanelButtonParent}>
                        <img
                            className={css.cpButton}
                            src={buttonResult}
                            alt={"Button Icon"}
                            draggable={false}
                            style={{
                                filter: responseType === RESPONSE_START
                                || responseType === RESPONSE_ASK_TEST_START || testResults?.passed
                                || responseType === RESPONSE_DEFAULT ? "none" : "grayscale(100%) brightness(2.6)",
                            }}
                            onClick={() => {
                                if (testResults === null || testResults === undefined) {
                                    setResponseType(RESPONSE_ASK_TEST_START);
                                } else {
                                    setCurPage(PAGE_TEST_RESULTS);
                                    if (!testResults?.passed) setResponseType(RESPONSE_DEFAULT);
                                }
                            }}
                        />
                        <span className={css.cpButtonDescription}>{guiMessages.step.resultButton}</span>
                    </div>}
                    <div className={css.controlPanelButtonParent}>
                        <img
                            className={css.cpButton}
                            src={buttonOwly}
                            alt={"Button Icon"}
                            draggable={false}
                            style={{
                                filter: responseType === RESPONSE_START
                                || responseType === RESPONSE_DEFAULT ? "none" : "grayscale(100%) brightness(1.6)",
                            }}
                            onClick={() => {if (isDebuggingTutorial) {
                                if (logging.isActive()) {
                                    logging.logClickEvent('BUTTON', new Date(), 'OPEN_HELP_PAGE', null);
                                }

                                onOpenHelp();
                            }}}
                        />
                        <span className={css.cpButtonDescription}>{guiMessages.step.euliButton}</span>
                    </div>
                    {ENABLE_TODO_BUTTON && <div className={css.controlPanelButtonParent}>
                        <img
                            className={css.cpButton}
                            src={buttonHelp}
                            onClick={() => {if (!testResults?.passed) setResponseType(RESPONSE_EXPLANATION1)}}
                            alt={"Button Icon"}
                            draggable={false}
                            style={{
                                filter: responseType === RESPONSE_START
                                || responseType === RESPONSE_DEFAULT
                                || responseType === RESPONSE_EXPLANATION1
                                || responseType === RESPONSE_EXPLANATION2
                                || responseType === RESPONSE_EXPLANATION3
                                || responseType === RESPONSE_EXPLANATION4 ? "none" : "grayscale(100%) brightness(1)",
                            }}
                        />
                        <span className={css.cpButtonDescription}>{guiMessages.step.todoButton}</span>
                    </div>}
                    {ENABLE_RESET_BUTTON && <div className={css.controlPanelButtonParent}>
                        <img
                            className={css.cpButton}
                            src={buttonReset}
                            onClick={() => {if (!testResults?.passed) setResponseType(RESPONSE_RELOAD)}}
                            alt={"Button Icon"}
                            style={{
                                filter: responseType === RESPONSE_START
                                || responseType === RESPONSE_DEFAULT
                                || responseType === RESPONSE_RELOAD ? "none" : "grayscale(100%) brightness(1.8)",
                            }}
                            draggable={false}
                        />
                        <span className={css.cpButtonDescription}>{guiMessages.step.resetButton}</span>
                    </div>}
                </div>
            </div>
        );
    }

    const renderOverview = () => {
        return (
            <div className={css.cpContainer}>
                <div className={css.whiteBoxOverview}>
                    <div style={{width: "100%"}}>
                        {/* Tabs */}
                        <div className={css.tabContainer}>
                            <button className={css.tabButton}
                                    style={{backgroundColor: contentType === "DETAILS" ? "#4D97FFFF" : ""}} id="beschreibungTab"
                                    onClick={() => setContentType("DETAILS")}>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <img className={css.icon} src={iconDescription} alt={"errorIcon"} draggable={false}/>
                                    {guiMessages.step.description}
                                </div>
                            </button>

                            {isDebuggingTutorial &&
                                <button className={css.tabButton}
                                        style={{backgroundColor: contentType === "ERRORS" ? "#cf3b28FF" : ""}} id="fehlerTab"
                                        onClick={() => setContentType("ERRORS")}>
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <img className={css.icon} src={iconErrors} alt={"errorIcon"} draggable={false}/>
                                        {guiMessages.step.error}
                                    </div>
                                </button>
                            }

                            {showControlOverview && <button className={css.tabButton}
                                    style={{backgroundColor: contentType === "CONTROLS" ? "#ffab19ff" : ""}} id="steuerungTab"
                                    onClick={() => setContentType("CONTROLS")}>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <img className={css.icon} src={iconControls} alt={"errorIcon"} draggable={false}/>
                                    {guiMessages.step.controls}
                                </div>
                            </button>}
                        </div>
                        {/* Content */}
                        <div className={css.container} style={{borderColor: getBorderColor(contentType)}}>
                            {getContent()}
                        </div>
                    </div>
                </div>

                {/* Next Button */}
                <div className={css.buttonContainer}>
                    {isShowingQuickHandle ?
                        <div
                            className={css.overviewNextButton}
                            onClick={() => setCurPage(PAGE_TEST_RESULTS)} //TODO onClick={() => setCurPage("RESPONSE")}
                        >
                            <span>{guiMessages.step.next}</span>
                            <img
                                draggable={false}
                                src={rightArrow}
                                alt="Arrow pointing right"
                            />
                        </div>
                        :
                        <button
                            className={isLoading ? css.resetButtonPressed : css.resetButton}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {guiMessages.step.startTutorial}
                            <div className={css.progressBar} ref={progressBarRef}></div>
                        </button>
                    }
                </div>
            </div>
        );
    }

    const handleTestStart = () => {
        setResponseType(RESPONSE_TESTING);
        onStartTests();
    }

    const handleProjectReset = () => {
        onResetProject();
        setResponseType(RESPONSE_DEFAULT);
    }

    const getResponse = () => {
        if (isDebuggingTutorial) {
            return renderResponseDebugging(responseType, {
                setResponseType,
                handleProjectReset,
                handleTestStart,
                getResultText,
                guiMessages
            });
        } else {
            return renderResponseClassic(responseType, {
                setResponseType,
                handleProjectReset,
                handleTestStart,
                getResultText,
                guiMessages
            });
        }
    }

    const getContent = () => {
        switch (contentType) {
            case "DETAILS":
                return (
                    <div className={css.detailsContainer}>
                        <div className={css.textArea}>
                            <h1>{tutorialMessages[overviewStep]["title"]}</h1>
                            <p>
                                {parseColoredText(tutorialMessages[overviewStep]["description"])}
                            </p>
                        </div>
                        <div className={css.verticalLineContainer}>
                            <div className={css.verticalLine}></div>
                        </div>
                        <div className={css.imageArea}>
                            <img src={tutorialIndexData[tutorialMessages[overviewStep]["image"]]} draggable={false} className={css.overviewImage} alt={"StepImage"}/>
                        </div>
                    </div>
                );
            case "ERRORS":
                return (
                    <div className={css.errorContainer}>
                        <div style={{display:"flex", flexDirection: "column", width: "100%", justifyContent: "space-between", height: "200px"}}>
                            <div className={css.detailsContainer}>
                                <div className={css.bubble}>

                                    <img className={css.bubbleIndicator} alt={"Bubble-Decal"} src={bubbleIndicator}/>

                                    {isErrorInfoVisible ?
                                        <p>
                                            <strong>{guiMessages.step.ofCourse}</strong> <br/><br/> {tutorialMessages[overviewStep]["errorDescription"]}
                                        </p> : <p>
                                            {guiMessages.step.errMessage1} <strong>{tutorialMessages[overviewStep]["errorAmount"]} {guiMessages.step.errMessage2}</strong> {guiMessages.step.errMessage3}
                                        </p>
                                    }
                                </div>
                            </div>

                            {!isErrorInfoVisible &&
                                <div style={{display:"flex", justifyContent:"flex-start"}}>
                                    <span className={css.p}>{guiMessages.step.showError1}</span>
                                    <button onClick={showErrorInfo} className={css.errorButton}>{guiMessages.step.showError2}</button>
                                </div>
                            }

                        </div>
                        <img src={owl} alt={"Picture of Euli"} className={css.image} draggable={false}/>
                    </div>
                );
            case "CONTROLS":
                return (
                    <div style={{width:"100%", display:"flex", flexDirection:"column", marginRight:"15px", alignItems:"center"}}>
                        <div className={css.controlContainer}>
                            {generateControlImages(tutorialMessages, overviewStep)}
                        </div>
                        <p className={css.p} style={{textAlign:"center"}}>{parseColoredText(tutorialMessages[overviewStep]["controlInfo"])}</p>
                    </div>
                );
            default:
                console.warn(contentType + " is unknown!");
        }
    }

    /**
     * Returns the feedback-summary for Euli.
     */
    const getResultText = () => { //TODO Refactor! (Gehört in eulis response code!)
        if (testResults?.passed) {
            return (
                <div className={css.responseTextArea}>
                    <p>Sieht super aus!</p>
                    <p style={{marginTop: "15px"}}>Du kannst nun zum <button className={css.responseButtonAccept} style={{marginLeft: "0", marginRight: "0"}} onClick={() => nextStep()}>nächsten Level</button> gehen.</p>
                </div>);
        }

        if (checkUserMadeErrors(testResults)) {
            return (
                <div className={css.responseTextArea}>
                    <p>Hoppla, anscheinend haben sich noch weitere Fehler eingeschlichen!</p>
                    <p>Du kannst jederzeit <span style={{color: "#62A4FFFF", fontWeight: "bold"}}>Euli fragen</span> oder das Projekt <span style={{color: "#ff5a57", fontWeight: "bold"}}>zurücksetzen</span>.</p>
                    <p style={{marginTop: "15px", gap:"10px"}}>
                        <button
                            className={css.responseButtonTestResults}
                            onClick={() => {setCurPage(PAGE_TEST_RESULTS); setResponseType(RESPONSE_DEFAULT);}}
                        >Testergebnisse</button>
                        <button
                            className={css.responseButtonNext}
                            onClick={() => setResponseType(RESPONSE_DEFAULT)}
                        >Schließen</button>
                    </p>
                </div>);
        } else {
            return (
                <div className={css.responseTextArea}>
                    <p>Huch! Da sind noch nicht alle eingebauten Fehler behoben.</p>
                    <p>Wenn du Hilfe brauchst, klicke auf <span style={{color: "#62A4FFFF", fontWeight: "bold"}}>Frag Euli </span>.</p>

                    <div style={{marginTop:"15px"}}>
                        <button
                            className={css.responseButtonNext}
                            onClick={() => setResponseType(RESPONSE_DEFAULT)}
                        >Schließen</button>
                        <button
                            className={css.responseButtonTestResults}
                            onClick={() => {setCurPage(PAGE_TEST_RESULTS); setResponseType(RESPONSE_DEFAULT)}}
                        >Testergebnisse</button>
                    </div>
                </div>);
        }
    }

    //TODO move to reducer

    const [help, setHelp] = useState(null);
    const [isGeneratingHint, setIsGeneratingHint] = useState(true);
    const [finishedAnswer, setFinishedAnswer] = useState(false);
    const [optionSelected, setOptionSelected] = useState(false);
    const [shuffledOptionIndexes, setShuffledOptionIndexes] = useState(generateRandom123());

    const [hint, setHint] = useState({
        problemText: "",
        solutionOptions: [
            { id:"A", code:"", isCorrect:true,  explanation:"" },
            { id:"B", code:"", isCorrect:false, explanation:"" },
            { id:"C", code:"", isCorrect:false, explanation:"" }
        ]
    });

    const requestHint = (fastMode) => {
        setShuffledOptionIndexes(generateRandom123()); //Irgendwie komisch!
        setCurPage(PAGE_HELP);
        setIsGeneratingHint(true);
        setFinishedAnswer(false);
        setShuffledOptionIndexes(generateRandom123());
        const result = testResults.details.find(e => e.testId === curTestDetails)?.prompt;
        const passedDescriptions = testResults.details
            .filter(e => e.result === "pass")
            .map(e => e.prompt)
            .join('; ');

        if (logging.isActive()) { logging.logClickEvent('BUTTON', new Date(), 'OPEN_HELP_PAGE', null); }

        HintGenerator.generateHint(vm.toJSON(), result, passedDescriptions, vm.getLocale(), fastMode, (h) => {setHint(h); setIsGeneratingHint(false);})
            .then(hint1 => {

                setHelp(hint1);
                setIsGeneratingHint(false);
                logResponse(hint1, curTestDetails, result);})
            .catch(err => console.error(err));
    }


    function generateRandom123() {
        const arr = [0, 1, 2];

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }


    const renderPage = () => {
        if (reachedLastStep) return <FinalStep tutorialMessages={tutorialMessages} guiMessages={guiMessages} onBackToTutorialSelection={() => onBackToTutorialSelection()} tutorialPoints={tutorialPoints}/>; //TODO remove true

        switch (curPage) {
            case PAGE_OVERVIEW:
                return renderOverview();
            case PAGE_RESPONSE:
                return renderResponse();
            case PAGE_TEST_RESULTS:
                return <TestResults
                    testResults={testResults}
                    step={step}
                    testPageIndex={testPageIndex}
                    setCurPage={setCurPage}
                    hasCodeUpdated={hasCodeUpdated}
                    nextStep={nextStep}
                    onDecreaseTestPageIndex={onDecreaseTestPageIndex}
                    onIncreaseTestPageIndex={onIncreaseTestPageIndex}
                    projectLoadingState={projectLoadingState}
                    curTestDetails={curTestDetails}
                    guiMessages={guiMessages}
                    setCurTestDetails={setCurTestDetails}
                    handleTestStart={handleTestStart}
                    openHelpPage={() => requestHint(true)}
                />
            case PAGE_HELP:
                const HELP_SWITCH_COSTUME_ON_START = {
                    "problemText": "Problem: Wenn das Spiel startet, sieht das Boot nicht so aus, wie es am Anfang aussehen sollte.",
                    "solutionOptions": [
                        {
                            "id": "A",
                            "code": "when flag clicked\nswitch costume to (normal)",
                            "isCorrect": true,
                            "explanation": "Beim Start des Spiels wird das Boot sofort in das gewünschte Aussehen versetzt, sodass es gleich richtig aussieht."
                        },
                        {
                            "id": "B",
                            "code": "when flag clicked\n" +
                                "forever\n" +
                                "if <touching [mouse-pointer v] ?> then\n" +
                                "say (Hallo!)\n" +
                                "end\n" +
                                "end",
                            "isCorrect": false,
                            "explanation": "Das Boot ändert sein Aussehen erst sehr spät oder vielleicht gar nicht, weil es auf etwas wartet, das nicht unbedingt passiert."
                        },
                        {
                            "id": "C",
                            "code": "when flag clicked\nsay ()",
                            "isCorrect": false,
                            "explanation": "Das Boot macht zwar etwas Sichtbares, aber sein Aussehen bleibt gleich und ändert sich beim Start nicht."
                        }
                    ]
                };


                return (
                    <TutorialHelpPage
                        help={hint}
                        isGeneratingHint={isGeneratingHint}
                        generateNewHint={() => requestHint(false)}
                        onFinishedAnswer={() => setFinishedAnswer(true)}
                        finishedAnswer={finishedAnswer}
                        returnToTestResults={() => {setCurPage(PAGE_TEST_RESULTS); setCurTestDetails("");}}
                        locale={props.locale}
                        guiMessages={guiMessages}
                        setOptionSelected={() => setOptionSelected(true)}
                        optionSelected={optionSelected}
                        removeTutorialPoint={removeTutorialPoint}
                        shuffledOptionIndexes={shuffledOptionIndexes}
                    />
                );
        }
    }

    return <>
        <img src={bubbleIndicatorBlue} style={{display: "none"}} alt={"preload"}/>
        <img src={bubbleIndicatorGray} style={{display: "none"}} alt={"preload"}/>
        <img src={bubbleIndicator} style={{display: "none"}} alt={"preload"}/>

        {curPage === PAGE_RESPONSE && <div className={css.leftButton} onClick={() => setCurPage(PAGE_OVERVIEW)}>
            <img src={leftArrow} alt="Next" draggable={false} />
        </div>}
        {curPage === PAGE_TEST_RESULTS && <div className={css.leftButton} onClick={() => {setCurPage(PAGE_OVERVIEW); if (testResults?.passed) {setResponseType(RESPONSE_TESTING_FINISHED)} else {setResponseType(RESPONSE_DEFAULT)}}}>
            <img src={leftArrow} alt="Next" draggable={false} />
        </div>}
        {curPage === PAGE_HELP && !help?.finishedHelpFlag && <div className={css.leftButton} onClick={() => {setCurPage(PAGE_TEST_RESULTS)}}>
            <img src={leftArrow} alt="Next" draggable={false} />
        </div>}
        {renderPage()}
    </>
}

DebuggingTutorialStep.props = {
    onOpenHelp: PropTypes.func.isRequired,
    step: PropTypes.string,
    onStartTests: PropTypes.func,
    onReset: PropTypes.func,
}

export default DebuggingTutorialStep;


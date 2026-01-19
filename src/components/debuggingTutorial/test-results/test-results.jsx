import css from "./test-results.css"
import React, {useState} from 'react';

import owl from "../images/OwlBranchRight.png"
import owlDown from "../images/owlDown.png"
import bubbleIndicatorGray from "../images/bubbleDecalGrey.png"
import bubbleIndicatorGreenDark from "../images/bubbleDecalGreenDark.png";
import bubbleIndicatorGreenLight from "../images/bubbleDecalGreenLight.png";

import testSuccess from "../images/icon--testSuccess.png"
import testFailed from "../images/icon--testFailed.png"
import testRunning from "../images/icon--testRunning.png"
import {SHOW_LLM_HINTS} from "../config.ts";
import {getPaginationInfo, getRunningStep, getStepColor, getTestText, TypewriterText} from "./test-utils.jsx";

const TestResults = (props) => {
    const { testResults, step, testPageIndex, curTestDetails,onDecreaseTestPageIndex,
        onIncreaseTestPageIndex} = props;

    const [help, setHelp] = useState(false);

    const context = {
        ...props,
        onComplete: () => setHelp(true),
        onStart: () => setHelp(false),
        help: help,
        pagination: getPaginationInfo(props.testResults, props.step, props.testPageIndex),
    };
    const { showLeftArrow, showRightArrow } = context.pagination;

    return (
        <div className={css.container}>
            <img src={bubbleIndicatorGreenDark} style={{display: "none"}} alt={"preload"}/>
            <img src={bubbleIndicatorGreenLight} style={{display: "none"}} alt={"preload"}/>
            <img src={testRunning} style={{display: "none"}} alt={"preload"}/>
            <img src={testFailed} style={{display: "none"}} alt={"preload"}/>
            <img src={testSuccess} style={{display: "none"}} alt={"preload"}/>

            <div className={css.whiteBoxTop}>
                <div className={css.bubbleContainer}>
                    <div className={css.columnFlex}>
                        <div className={css.euliBubble}>
                            <img className={css.bubbleIndicator} alt="Bubble-Decal" src={bubbleIndicatorGray} draggable={false}/>
                            {getTestText(context)}
                        </div>
                        {renderResponse(context)}
                    </div>
                    <img src={curTestDetails === "" ? owl : owlDown} alt="Picture of Euli" className={css.owlImage} draggable={false}/>
                </div>
            </div>

            <div className={css.testNavigationWrapper}>
                <div className={css.testLeftArrow} onClick={() => onDecreaseTestPageIndex()} style={{ visibility: showLeftArrow ? 'visible' : 'hidden' }}>
                    <div className={css.nextTestIcon}/>
                </div>

                <div className={css.WhiteBoxBottom}>
                    <div className={css.testResultContainer}>
                        {parseTestResults(context)}
                    </div>
                </div>

                <div className={css.testRightArrow} onClick={() => onIncreaseTestPageIndex()} style={{ visibility: showRightArrow ? 'visible' : 'hidden' }}>
                    <div className={css.nextTestIcon} style={{ transform: "scaleX(-1)" }} />
                </div>
            </div>
        </div>
    );
};



/**
 * The answer-bubbles, the user can select to answer eulis questions. (e.g. next step)
 */
const renderResponse = ({hasCodeUpdated, projectLoadingState, curTestDetails, nextStep, testResults, handleTestStart, guiMessages, step, help}) => {
    const msg = guiMessages.test_results;

    if (testResults?.passed && projectLoadingState !== "TEST_PAUSE") {
        return (
            <div className={css.nextBubble} onClick={nextStep}>
                <div className={css.nextBubbleIndicator} />
                {msg.next_step}
            </div>
        );
    }

    if (projectLoadingState === "TEST" || projectLoadingState === "TEST_PAUSE") {
        return (
            <div style={{width:"100%"}}>
                <div className={css.loadingHeader}>
                    <span className={css.stepLabel}>Schritt:</span>

                    {[...Array(step +1)].map((_, i) => {
                        const stepNum = step + 1 - i;
                        return (
                            <span
                                key={stepNum}
                                className={`${css.stepNumber} ${
                                    getRunningStep(testResults) === stepNum ? css.blink : ""
                                }`}
                                style={{ backgroundColor: getStepColor(testResults, stepNum) }}
                            >
                                {stepNum}
                            </span>
                        );
                    })}
                </div>
                {projectLoadingState !== "TEST_PAUSE" && <span className={css.loader}></span>}
            </div>
        );
    }

    if (hasCodeUpdated && projectLoadingState !== "TEST_PAUSE") {
        return (
            <div className={`${css.helpBubble} ${(projectLoadingState !== "TEST") ? '' : css.selected}`} onClick={() => { if (projectLoadingState !== "TEST") handleTestStart()}} style={{marginBottom: "0px"}}>
                <div className={css.selectionBubbleIndicator} />
                {msg.test_again}
            </div>
        );
    }
}

/**
 * Returns Euli's feedback-details containing all test results.
 */
const parseTestResults = ({testResults, testPageIndex, curTestDetails, projectLoadingState, step, setCurTestDetails, guiMessages, openHelpPage}) => {
    if (!testResults) return null;

    // 1) Sortieren (absteigend nach Test-ID)
    const sortedDetails = [...testResults.details]
        .sort((a, b) => b.testId.localeCompare(a.testId));

    // Anzahl Items pro Seite
    const itemsPerPage = 4;

    // Berechne den Offset für pageIndex (0 → 0–3, 1 → 4–7, …)
    const start = testPageIndex * itemsPerPage;

    // 2) Default-Filter anwenden (Nur Tests aus aktuellem Schritt + fehlgeschlagene aus letzten Schritten)
    const filteredDetails = sortedDetails.filter(e => {
        const isCurrentStep    = e.testId.charAt(4) === (step + 1).toString();
        const passed           = e.result === "pass" || e.result === "running";
        return isCurrentStep || !passed; //TODO REACTIVATE ON Classic-Tutorials!!!
        //return true;
    }).slice(start, start + itemsPerPage);

    // 3) Im Details-Modus: Slice um das ausgewählte Element, sonst ganzes Filter-Array
    let visibleDetails;

    if (curTestDetails) {
        // a) Index im gefilterten Array finden
        const targetIndex = filteredDetails.findIndex(t => t.testId === curTestDetails);
        const len         = filteredDetails.length;

        if (targetIndex !== -1 && len > 0) {
            // b) Start/End für 3-Zone berechnen
            let start = targetIndex - 1;
            let end   = targetIndex + 1;

            if (start < 0)        { start = 0; end = Math.min(2, len - 1); }
            if (end   > len - 1)  { end   = len - 1; start = Math.max(len - 3, 0); }

            // c) slice aus dem gefilterten Array
            visibleDetails = filteredDetails.slice(start, end + 1);

        } else {
            // Fallback: wenn curTestDetails nicht gefunden, zeige das ganze filteredDetails
            visibleDetails = filteredDetails;
        }

    } else {
        // kein Element ausgewählt → ganz normal alle gefilterten
        visibleDetails = filteredDetails;
    }

    return visibleDetails.map((e, idx) => {
        // Nummer für das UI: Original-Index in sortedDetails + 1
        const originalIdx = sortedDetails.findIndex(t => t === e);

        const isCurrentStep = e.testId.charAt(4) === (step + 1).toString();
        const passed        = e.result === "pass";

        return createTestElement(
            passed,
            e,
            originalIdx + 1,
            isCurrentStep,
            projectLoadingState,
            curTestDetails,
            setCurTestDetails,
            guiMessages,
            openHelpPage,
        );
    });
};


const createTestElement = (passed, e, testElementNumber, isCurrentStep, projectLoadingState, curTestDetails, setCurTestDetails, guiMessages, openHelpPage) => {
    const msg = guiMessages.test_results;

    //console.log(e.testId + ": " + JSON.stringify(e.result));

    const headerBgColor = (projectLoadingState === "TEST" && e.result === "running")
        ? "#afd8fd"
        : passed
            ? "#89ddaf"
            : "#d16857";

    const iconSrc = (projectLoadingState === "TEST" && e.result === "running")
        ? testRunning
        : passed
            ? testSuccess
            : testFailed;

    const headerText = passed ? msg.passed : msg.failed;

    const buttonStyle = (projectLoadingState === "TEST" && e.result === "running")
        ? css.testElementButton
        : passed
            ? css.testElementButtonPassed
            : css.testElementButtonFailed;


    if (curTestDetails === e.testId) {
        return (
            <div key={e.testId} className={css.testElementContainer} style={{width:"450px"}}>
                <div className={(projectLoadingState === "TEST" && e.result === "running") ? css.testElementHeaderAnimation : css.testElementHeader} style={{backgroundColor: headerBgColor, height:"60px"}}>
                    <div className={css.testElementTitleExtended}>
                        <img src={iconSrc} style={{width: "43px", marginRight: "10px"}} className={css.testElementIcon} alt={"ResultIcon"} draggable={false}/>
                        {(projectLoadingState === "TEST" && e.result === "running") ? <span>{msg.loading}</span> : <span>{headerText}</span>}
                    </div>
                </div>
                <span className={css.testElementTitle}>{e.test}</span>
                <p className={css.testElementText} key={e.testId}>{e.testDescription}</p>
                {passed ?
                    <div className={css.buttonWrapper} onClick={() => setCurTestDetails("")}>
                        <div className={buttonStyle}>
                            {msg.close_button}
                        </div>
                    </div>
                    :
                    <div className={css.buttonContainer}>
                        <div className={css.buttonWrapper} style={{paddingRight:"5px"}} onClick={() => setCurTestDetails("")}>
                            <div className={buttonStyle}
                                 style={SHOW_LLM_HINTS ? { borderBottomRightRadius: 0, borderTopRightRadius: 0 } : {}}
                            >
                                {msg.close_button}
                            </div>
                        </div>
                        {SHOW_LLM_HINTS && <div className={css.buttonWrapper} style={{paddingLeft:"5px"}} onClick={() => openHelpPage("step1_Costume1")}>
                            <div className={css.testElementButtonHelp}>
                                {msg.help_button}
                            </div>
                        </div>}
                    </div>
                }
            </div>);
    }

    return (
        <div key={e.testId} className={css.testElementContainer}>
            <div className={(projectLoadingState === "TEST" && e.result === "running") ? css.testElementHeaderAnimation : css.testElementHeader} style={{backgroundColor: headerBgColor}}>
                <img src={iconSrc} className={css.testElementIcon} alt={"ResultIcon"} draggable={false}/>
                {(projectLoadingState === "TEST" && e.result === "running") ? <span>{msg.loading}</span> : <span>{headerText}</span>}
            </div>
            <span className={css.testElementTitle}>{e.test}</span>
            <div className={css.buttonWrapper} onClick={() => setCurTestDetails(e.testId)}>
                <div className={buttonStyle}>
                    {msg.details_button}
                </div>
            </div>
        </div>
    );
}

export default TestResults;





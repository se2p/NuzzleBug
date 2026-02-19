import css from "./test-results.css"
import React, {useState} from 'react';

import owl from "../../../../images/OwlBranchRight.png"
import owlDown from "../../../../images/owlDown.png"
import bubbleIndicatorGray from "../../../../images/bubbleDecalGrey.png"
import bubbleIndicatorGreenDark from "../../../../images/bubbleDecalGreenDark.png";
import bubbleIndicatorGreenLight from "../../../../images/bubbleDecalGreenLight.png";

import testSuccess from "../../../../images/icon--testSuccess.png"
import testFailed from "../../../../images/icon--testFailed.png"
import testRunning from "../../../../images/icon--testRunning.png"
import { tutorialConfig } from "../../../../config.js";
import {getPaginationInfo, getRunningStep, getStepColor, getTestText} from "./test-utils.jsx";

const TestResults = (props) => {
    const {curTestDetails,onDecreaseTestPageIndex,onIncreaseTestPageIndex} = props;

    // Die Bubble, mit der der nutzer die Testausführung erneut starten kann, soll nach einem Test mit kurzem Delay
    // angezeigt werden.
    const [showTestAgainBubble, setShowTestAgainBubble] = useState(false);


    const context = {
        ...props,
        onComplete: () => setShowTestAgainBubble(true),
        hideTestAgainBubble: () => setShowTestAgainBubble(false),
        showTestAgainBubble: showTestAgainBubble,
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



const renderResponse = ({projectLoadingState, nextStep, testResults, handleTestStart, guiMessages, step, showTestAgainBubble, hideTestAgainBubble}) => {
    // Nächster Schritt
    if (testResults?.passed ) {
        return (
            <div className={css.nextBubble} onClick={nextStep}>
                <div className={css.nextBubbleIndicator} />
                {guiMessages.test_results.next_step}
            </div>
        );
    }


    //Laden
    if (projectLoadingState === "TEST" || projectLoadingState === "TEST_PAUSE") {
        return (
            <div style={{width:"100%"}}>
                <div className={css.loadingHeader}>
                    <span className={css.stepLabel}>{guiMessages.test_results.step}</span>

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

    // teste erneut
    if (showTestAgainBubble) {
        return (
            <div className={`${css.helpBubble} ${(projectLoadingState !== "TEST") ? '' : css.selected}`} onClick={() => { if (projectLoadingState !== "TEST") handleTestStart(); hideTestAgainBubble()}} style={{marginBottom: "0px"}}>
                <div className={css.selectionBubbleIndicator} />
                {guiMessages.test_results.test_again}
            </div>
        );
    }
}

/**
 * Returns Euli's feedback-details containing all test results.
 */
const parseTestResults = ({testResults, testPageIndex, curTestDetails, projectLoadingState, step, setCurTestDetails, guiMessages, openHelpPage, tutorialMessages}) => {
    if (!testResults) return null;

    const sortedDetails = [...testResults.details]
        .sort((a, b) => b.testId.localeCompare(a.testId));
    const itemsPerPage = 4;
    const start = testPageIndex * itemsPerPage;

    const filteredDetails = sortedDetails.filter(e => {
        const isCurrentStep    = e.testId.charAt(4) === (step + 1).toString();
        const passed           = e.result === "pass" || e.result === "running";
        return isCurrentStep || !passed;
        //return true; besser für Debug-Tutorials?
    }).slice(start, start + itemsPerPage);

    const visibleDetails = sliceElements(filteredDetails, curTestDetails);

    return visibleDetails.map((e) => {
        // Nummer für das UI = Index in sortedDetails + 1, da sortedDetails mit 0 beginnt
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
            tutorialMessages
        );
    });
};

const SLICE_START_BY_IDX = [0, 0, 1, 1];

function sliceElements(arr, selectedId) {
    if (!selectedId) return arr;

    const idx = arr.findIndex(x => x.testId === selectedId);
    if (idx === -1) return arr;

    if (arr.length <= 3) return arr;

    const start = SLICE_START_BY_IDX[idx] ?? 0;
    return arr.slice(start, start + 3);
}


const createTestElement = (passed, e, testElementNumber, isCurrentStep, projectLoadingState, curTestDetails, setCurTestDetails, guiMessages, openHelpPage, tutorialMessages) => {
    const msg = guiMessages.test_results;

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

    const helpButtonStyle = (projectLoadingState !== "TEST" && projectLoadingState !== "TEST_PAUSE") ? css.testElementButtonHelp : css.testElementButtonHelpInactive;

    if (curTestDetails === e.testId) {
        return (
            <div key={e.testId} className={css.testElementContainer} style={{width:"450px"}}>
                <div className={(projectLoadingState === "TEST" && e.result === "running") ? css.testElementHeaderAnimation : css.testElementHeader} style={{backgroundColor: headerBgColor, height:"60px"}}>
                    <div className={css.testElementTitleExtended}>
                        <img src={iconSrc} style={{width: "43px", marginRight: "10px"}} className={css.testElementIcon} alt={"ResultIcon"} draggable={false}/>
                        {(projectLoadingState === "TEST" && e.result === "running") ? <span>{msg.loading}</span> : <span>{headerText}</span>}
                    </div>
                </div>
                <span className={css.testElementTitle}>{tutorialMessages["test" + e.testId].name}</span>
                <p className={css.testElementText} key={e.testId}>{tutorialMessages["test" + e.testId].description}</p>
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
                                 style={tutorialConfig.classic.hintSystemEnabled ? { borderBottomRightRadius: 0, borderTopRightRadius: 0 } : {}}
                            >
                                {msg.close_button}
                            </div>
                        </div>
                        {tutorialConfig.classic.hintSystemEnabled &&
                            <div className={css.buttonWrapper}
                                 style={{paddingLeft:"5px"}}
                                 onClick={() => {if (projectLoadingState !== "TEST" && projectLoadingState !== "TEST_PAUSE") openHelpPage()}}
                            >
                            <div className={helpButtonStyle}>
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
            <span className={css.testElementTitle}>{tutorialMessages["test" + e.testId].name}</span>
            <div className={css.buttonWrapper} onClick={() => setCurTestDetails(e.testId)}>
                <div className={buttonStyle}>
                    {msg.details_button}
                </div>
            </div>
        </div>
    );
}

export default TestResults;





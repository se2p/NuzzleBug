import css from "./test-results.css"
import React, {useEffect, useRef, useState} from 'react';

import owl from "./images/OwlBranchRight.png"
import owlDown from "./images/owlDown.png"
import upButton from "./images/upButton.png"
import bubbleIndicatorGray from "./images/bubbleDecalGrey.png"

import testSuccess from "./images/icon--testSuccess.png"
import testFailed from "./images/icon--testFailed.png"
import testRunning from "./images/icon--testRunning.png"

// Hauptkomponente
const TestResults = ({
                         testResults,
                         step,
                         testPageIndex,
                         setCurPage,
                         hasCodeUpdated,
                         nextStep,
                         onDecreaseTestPageIndex,
                         onIncreaseTestPageIndex,
                         projectLoadingState,
                         curTestDetails,
                         guiMessages,
                         setCurTestDetails,
                         handleTestStart,
                     }) => {
    const { showLeftArrow, showRightArrow } = getPaginationInfo(testResults, step, testPageIndex);
    const showNextStepButton = !hasCodeUpdated && testResults.passed;


    /*
            <div className={css.arrowButtonContainer}>
                <div className={css.upArrowFill}/>
                <img className={css.backButton}
                     src={upButton}
                     onClick={() => setCurPage("RESPONSE")}
                     alt="Next page button"
                     draggable={false}
                />
            </div>
*/

    return (
        <div className={css.container}>
            <div className={css.whiteBoxTop}>
                <div className={css.bubbleContainer}>
                    <div className={css.columnFlex}>
                        <div className={css.euliBubble}>
                            <img className={css.bubbleIndicator} alt="Bubble-Decal" src={bubbleIndicatorGray}/>
                            {getTestText({ projectLoadingState, testResults, curTestDetails, hasCodeUpdated, guiMessages })}
                        </div>
                        {renderResponse({hasCodeUpdated, projectLoadingState, curTestDetails, nextStep, showNextStepButton, testResults, handleTestStart})}
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
                        {parseTestResults({testResults, testPageIndex, curTestDetails, projectLoadingState, step, setCurTestDetails})}
                    </div>
                </div>

                <div className={css.testRightArrow} onClick={() => onIncreaseTestPageIndex()} style={{ visibility: showRightArrow ? 'visible' : 'hidden' }}>
                    <div className={css.nextTestIcon} style={{ transform: "scaleX(-1)" }} />
                </div>
            </div>
        </div>
    );
};

// Gibt Eulis Text (obere Sprechblase) zurück
const getTestText = ({ projectLoadingState, testResults, curTestDetails, hasCodeUpdated, guiMessages }) => {
    const msg = guiMessages.test_results.response;

    if (projectLoadingState === "TEST") {
        return <span>{msg.loading}</span>;
    }

    if (testResults?.passed) {
        return <span>{msg.passed_all}</span>;
    }

    if (curTestDetails) {
        const result = testResults.details.find(e => e.testId === curTestDetails)?.result;
        return <span>{result === "pass" ? msg.test_passed : msg.test_failed}</span>;
    }

    if (hasCodeUpdated) {
        return <span>{msg.code_changed}</span>;
    }

    return <span>{msg.default}</span>;
};

/**
 * The answer-bubbles, the user can select to answer eulis questions. (e.g. next step)
 */
const renderResponse = ({hasCodeUpdated, projectLoadingState, curTestDetails, nextStep, showNextStepButton, testResults, handleTestStart}) => {
    if (hasCodeUpdated || (projectLoadingState === "TEST")) {
        return (
            <div className={`${css.helpBubble} ${(projectLoadingState !== "TEST") ? '' : css.selected}`} onClick={() => { if (projectLoadingState !== "TEST") handleTestStart()}} style={{marginBottom: "0px"}}>
                <div className={css.selectionBubbleIndicator} />
                Ja, teste erneut!
            </div>
        );
    }
    if (showNextStepButton) {
        return (
            <div className={css.nextBubble} onClick={nextStep}>
                <div className={css.nextBubbleIndicator} />
                Weiter zum nächsten Schritt
            </div>
        );
    }
}

/**
 * Returns Euli's feedback-details containing all test results.
 */
const parseTestResults = ({testResults, testPageIndex, curTestDetails, projectLoadingState, step, setCurTestDetails}) => {
    if (testResults.passed) return null;

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
        const passed           = e.result === "pass";
        return isCurrentStep || !passed;
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
        );
    });
};


const createTestElement = (passed, e, testElementNumber, isCurrentStep, projectLoadingState, curTestDetails, setCurTestDetails) => {
    const headerBgColor = (projectLoadingState === "TEST")
        ? "#afd8fd"
        : passed
            ? "#89ddaf"
            : "#d16857";

    const iconSrc = (projectLoadingState === "TEST")
        ? testRunning
        : passed
            ? testSuccess
            : testFailed;

    const headerText = passed ? "Bestanden" : "Gescheitert";

    const buttonStyle = (projectLoadingState === "TEST")
        ? css.testElementButton
        : passed
            ? css.testElementButtonPassed
            : css.testElementButtonFailed;


    if (curTestDetails === e.testId) {
        return (
            <div key={e.testId} className={css.testElementContainer} style={{width:"450px"}}>
                <div className={css.testElementHeader} style={{backgroundColor: headerBgColor, height:"60px"}}>
                    <div className={css.testElementTitleExtended}>
                        <img src={iconSrc} style={{width: "43px", marginRight: "10px"}} className={css.testElementIcon} alt={"ResultIcon"} draggable={false}/>
                        {(projectLoadingState === "TEST") ? <TypewriterText text={"Lädt..."}/> : <span>{headerText}</span>}
                    </div>
                </div>
                <span className={css.testElementTitle}>{e.test}</span>
                <p className={css.testElementText} key={e.testId}>{e.testDescription}</p>
                {passed ?
                    <div className={css.buttonWrapper}>
                        <div className={buttonStyle} onClick={() => setCurTestDetails("")}>
                            Schließen
                        </div>
                    </div>
                    :
                    <div className={css.buttonContainer}>
                        <div className={css.buttonWrapper} style={{paddingRight:"5px"}}>
                            <div className={buttonStyle} style={{borderBottomRightRadius:"0px", borderTopRightRadius:"0px"}} onClick={() => setCurTestDetails("")}>
                                Schließen
                            </div>
                        </div>
                        <div className={css.buttonWrapper} style={{paddingLeft:"5px"}}>
                            <div className={css.testElementButtonHelp} onClick={() => setCurTestDetails("")}>
                                Hilfe
                            </div>
                        </div>
                    </div>
                }
            </div>);
    }

    return (
        <div key={e.testId} className={css.testElementContainer}>
            <div className={css.testElementHeader} style={{backgroundColor: headerBgColor}}>
                <img src={iconSrc} className={css.testElementIcon} alt={"ResultIcon"} draggable={false}/>
                {(projectLoadingState === "TEST") ? <TypewriterText text={"Lädt..."}/> : <span>{headerText}</span>}
            </div>
            <span className={css.testElementTitle}>{e.test}</span>
            <div className={css.buttonWrapper}>
                <div className={buttonStyle} onClick={() => setCurTestDetails(e.testId)}>
                    Details
                </div>
            </div>
        </div>
    );
}






// Hilfsfunktion: Berechnet, ob die pagination-Pfeile sichtbar sein sollen
const getPaginationInfo = (testResults, step, testPageIndex) => {
    if (!testResults.details) return { showLeftArrow: false, showRightArrow: false };

    const visibleResults = testResults.details.filter(e => {
        const isCurrentStep = e.testId.charAt(4) === (step + 1).toString();
        const passed = e.result === "pass";
        return isCurrentStep || !passed;
    });

    const showLeftArrow = visibleResults.length >= 5 && testPageIndex > 0;
    const showRightArrow = visibleResults.length >= 5 && testPageIndex < Math.ceil(visibleResults.length / 4) - 1;

    return { showLeftArrow, showRightArrow };
};






export default TestResults;




/**
 * Animiert den Text, indem er ähnlich zu einer Schreibmaschine Buchstabe für Buchstabe des Textes ergänzt.
 */
function TypewriterText({
                            text,
                            speed = 40,
                            pauseAfterComplete = 40,
                            className = '',
                        }) {
    const [displayed, setDisplayed] = useState('');
    const idxRef = useRef(0);
    const timerRef = useRef(null);

    useEffect(() => {
        function startTyping() {
            setDisplayed('\u00A0');
            idxRef.current = 0;

            timerRef.current = setInterval(() => {
                idxRef.current += 1;
                setDisplayed(text.substring(0, idxRef.current));

                if (idxRef.current >= text.length) {
                    clearInterval(timerRef.current);
                    setTimeout(startTyping, pauseAfterComplete);
                }
            }, speed);
        }

        startTyping();

        return () => clearInterval(timerRef.current);
    }, [text, speed, pauseAfterComplete]);

    return (
        <span className={className} style={{ whiteSpace: 'pre-wrap' }}>
            {displayed}
        </span>
    );
}


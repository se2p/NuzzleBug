import css from "./debuggingTutorialStep.css";
import React from "react";
import logging from 'scratch-vm/src/util/logging.js';

/**
 * Helper-function for the delayed reset button.
 */
export const handleHoldButton = (progressBarRef, onComplete, setLoading) => {
    if (!progressBarRef.current) return;
    setLoading(true);
    progressBarRef.current.style.width = '90%';
    progressBarRef.current.style.transition = 'width 1s linear';

    const timeout = setTimeout(() => {
        onComplete();
        if (progressBarRef.current) {
            progressBarRef.current.style.transition = 'none';
            progressBarRef.current.style.width = '0';
        }
    }, 1100);

    return timeout;
};

export const resetHoldButton = (progressBarRef, setLoading, timeoutIdRef) => {
    setLoading(false);
    clearTimeout(timeoutIdRef.current);
    if (progressBarRef.current) {
        progressBarRef.current.style.transition = 'none';
        progressBarRef.current.style.width = '0';
    }
};

export const generateControlImages = (tutorialMessages, overviewStep) => {
    return Object.keys(tutorialMessages[overviewStep])
        .filter(key => key.startsWith("controlImage"))
        .map(key => {
            return (
                <img
                    src={tutorialIndexData[tutorialMessages[overviewStep][key]]}
                    draggable={false}
                    className={css.controlImage}
                    alt={"ControlImage"}
                />);
        });
}

export const getBorderColor = (contentType) => {
    let col = "#000000";
    switch (contentType) {
        case "DETAILS":
            col = "#4D97FFFF"
            break;
        case "CONTROLS":
            col = "#ffab19ff"
            break;
        case "ERRORS":
            col = "#cf3b28FF"
            break;
        default:
            console.log("unknown contentType: " + contentType)
    }
    return col;
}

export const checkUserMadeErrors = function (testResults) {
    let userMadeError = false;
    if (testResults === null || testResults.details === undefined) return false;
    testResults.details.map(e => {
        if (e.result !== "passed" && e.testDescription !== "DEBUGGING_ERROR") {
            userMadeError = true;
        }
    });
    return userMadeError;
}

export const logResponse = (hint, testId, testDescription) => {
    if (!logging.isActive()) return;

    const logMsg = {
        question: {
            testId: testId,
            prompt: testDescription
        },
        response: hint
    };

    const text = JSON.stringify(logMsg, null, 2); // optional: schön formatiertes JSON
    const blob = new Blob([text], { type: "application/json" });
    const file = new File([blob], `LLM_${testId}.json`, { type: "application/json" });

    logging.logFile(file.name, "json", file, new Date());
};

export const logTutorialScore = (score, tutorialTitle) => {

    if (!logging.isActive()) return;

    const logMsg = {
        tutorialTitle: tutorialTitle,
        score: score
    };

    const text = JSON.stringify(logMsg, null, 2); // optional: schön formatiertes JSON
    const blob = new Blob([text], { type: "application/json" });
    const file = new File([blob], `SCORE_${tutorialTitle}.json`, { type: "application/json" });

    logging.logFile(file.name, "json", file, new Date());
};

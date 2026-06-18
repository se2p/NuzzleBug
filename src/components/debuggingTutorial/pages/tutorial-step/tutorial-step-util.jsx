import css from './tutorial-flow/tutorial-flow.css';
import React from 'react';
import logging from 'scratch-vm/src/util/logging.js';
import scratchblocks from 'scratchblocks';

/**
 * Helper-function for the delayed reset button.
 */
export const handleHoldButton = (progressBarRef, onComplete, setLoading) => {
    if (!progressBarRef.current) return;
    setLoading(true);
    progressBarRef.current.style.width = '90%';
    progressBarRef.current.style.transition = 'width 1s linear';

    return setTimeout(() => {
        onComplete();
        if (progressBarRef.current) {
            progressBarRef.current.style.transition = 'none';
            progressBarRef.current.style.width = '0';
        }
    }, 1100);
};

export const resetHoldButton = (progressBarRef, setLoading, timeoutIdRef) => {
    setLoading(false);
    clearTimeout(timeoutIdRef.current);
    if (progressBarRef.current) {
        progressBarRef.current.style.transition = 'none';
        progressBarRef.current.style.width = '0';
    }
};

export const generateControlImages = (tutorialMessages, overviewStep, tutorialIndexData) => Object.keys(tutorialMessages[overviewStep])
    .filter(key => key.startsWith('controlImage'))
    .map(key => (
        <img
            src={tutorialIndexData[tutorialMessages[overviewStep][key]]}
            draggable={false}
            className={css.controlImage}
            alt={'ControlImage'}
        />));

export const getBorderColor = contentType => {
    let col = '#000000';
    switch (contentType) {
    case 'DETAILS':
        col = '#4D97FFFF';
        break;
    case 'CONTROLS':
        col = '#ffab19ff';
        break;
    case 'ERRORS':
        col = '#cf3b28FF';
        break;
    default:
        console.log(`unknown contentType: ${contentType}`);
    }
    return col;
};

export const checkUserMadeErrors = function (testResults) {
    let userMadeError = false;
    if (testResults === null || testResults.details === undefined) return false;
    testResults.details.map(e => {
        if (e.result !== 'passed' && e.testDescription !== 'DEBUGGING_ERROR') {
            userMadeError = true;
        }
    });
    return userMadeError;
};

/**
 * Translates the given scratchBlocksText into the given locale.
 *
 * @param scratchBlocksText Englisch scratch code.
 * @param locale The locale, the code gets translated into.
 * @returns {*|string} The translated text or "", if scratchBlocksText does not contain valid code.
 */
export const translate = (scratchBlocksText, locale) => {
    if (typeof scratchBlocksText !== 'string' || scratchBlocksText.trim() === '') return '';

    try {
        const parsed = scratchblocks.parse(localizeScratchCode(scratchBlocksText, locale), {lang: 'en'});

        if (locale === 'de') {
            if (Array.isArray(parsed)) {
                parsed.forEach(b => b?.translate?.(scratchblocks.allLanguages.de));
            } else {
                parsed?.translate?.(scratchblocks.allLanguages.de);
            }
        }

        if (Array.isArray(parsed)) {
            return parsed.map(b => b.stringify()).join('\n\n');
        }
        return parsed.stringify();
    } catch (e) {
        console.log(`Given scratchCode can not be translated: ${scratchBlocksText}${e}`);
        logLLMError(scratchBlocksText);
        return 'No functioning code :(';
    }
};

const DROPDOWN_MAP_DE = {
    'mouse-pointer': 'Mauszeiger',
    'random position': 'Zufallsposition',
    'edge': 'Rand'
};

// Das LLM hat teils Probleme damit, Parameter korrekt zu übersetzen -> Manueller Fallback.
// TODO Erweitern! Z.B. Pfeiltasten umbenennen!
function localizeScratchCode (code, locale) {
    if (locale !== 'de') return code;

    return code.replace(
        /\(([^)]+) v\)/g,
        (_, value) => {
            const mapped = DROPDOWN_MAP_DE[value];
            return `(${mapped ?? value} v)`;
        }
    );
}

/**
 * Logged den vom LLM generierten Hinweis.
 * @param hintObj Das Ergebnis der LLM-Anfrage.
 * @param testId Die Id des Tests, für welchen der Hinweis generiert wurde.
 * @param optionsSelectHistory Die Reihenfolge, in welcher der Nutzer die 3 Optionen ausgewählt hat. [1,2,3]
 * @param durationMs Wie lange es dauert, bis der Einleitungstext vom LLM generiert wurde
 */
export const logResponse = (hintObj, testId, optionsSelectHistory, durationMs) => {
    const solutionOptions = Array.isArray(hintObj?.solutionOptions) ? hintObj.solutionOptions : [];

    // Füge für jede der 3 Optionen ein, in welcher Reihenfolge diese vom Nutzer ausgewählt wurde.
    // Wenn der Nutzer einen Distraktor nicht angeklickt hat, ist selectionSequence=0.
    const updatedHintObj = {
        ...hintObj,
        solutionOptions: solutionOptions.map((opt, i) => ({
            ...opt,
            selectionSequence: optionsSelectHistory[i] ?? null
        }))
    };

    const logMsg = {
        testId: testId,
        response: updatedHintObj,
        response_delay: durationMs
    };

    logging.logJsonEvent(`LLM_${testId}.json`, 'TUTORIAL', 'LLM', logMsg, new Date());
};

/**
 * Logged die erreichten TutorialPoints.
 * @param score Der aktuelle Score.
 * @param tutorialTitle De Titel des aktuellen Tutorials, um den Score in der DB später eindeutig zuordnen zu können.
 */
export const logTutorialScore = (score, tutorialTitle) => {
    const logMsg = {
        tutorialTitle: tutorialTitle,
        score: score
    };

    logging.logJsonEvent(`SCORE_${tutorialTitle}.json`, 'TUTORIAL', 'GENERIC', logMsg, new Date());
};

export const logLLMError = scratchBlocks => {
    const logMsg = {
        scratchBlocks: scratchBlocks
    };

    logging.logJsonEvent(`ERROR.json`, 'TUTORIAL', 'GENERIC', logMsg, new Date());
};

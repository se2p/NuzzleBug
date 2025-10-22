import React, { useEffect, useRef, useState } from "react";
/**
 * Owly's text in the top speech bubble based on the current state of the test result page.
 * @returns {JSX.Element} A <span> containing Owly's response.
 */
export const getTestText = ({
                                projectLoadingState,
                                testResults,
                                curTestDetails,
                                hasCodeUpdated,
                                guiMessages,
                            }) => {
    const msg = guiMessages?.test_results?.response ?? {};
    if (projectLoadingState === "TEST") return <span>{msg.loading}</span>;

    if (testResults?.passed && projectLoadingState !== "TEST_PAUSE") return <span>{msg.passed_all}</span>;

    if (curTestDetails) {
        const result = testResults?.details?.find(e => e.testId === curTestDetails)?.result;
        return <span>{result === "pass" ? msg.test_passed : msg.test_failed}</span>;
    }

    if (hasCodeUpdated && projectLoadingState !== "TEST_PAUSE") { //TODO CONSTANT!!!
        return <span>{msg.code_changed}</span>;
    }

    return <span>{msg.default}</span>;
};


/**
 * Utility function that determines the visibility of pagination arrows based on the currently shown tests and max. number of test results.
 */
export const getPaginationInfo = (testResults, step, testPageIndex) => {
    if (!testResults || !testResults.details) return { showLeftArrow: false, showRightArrow: false };

    const visibleResults = testResults.details.filter(e => {
        const isCurrentStep = e.testId.charAt(4) === (step + 1).toString();
        const passed = e.result === "pass" || e.result === "running";
        return isCurrentStep || !passed;
    });

    const showLeftArrow = visibleResults.length >= 5 && testPageIndex > 0;
    const showRightArrow = visibleResults.length >= 5 && testPageIndex < Math.ceil(visibleResults.length / 4) - 1;

    return { showLeftArrow, showRightArrow };
};


/**
 * Gibt die Farbe für einen Schritt basierend auf seinen Testergebnissen zurück.
 *
 * @param {object} testResults - Das komplette Testergebnis-Objekt mit .details
 * @param {number} stepNumber - Die Schrittzahl (z.B. 1, 2, 3, ...)
 * @returns {"grün" | "rot" | "grau"} - Farbe für den Schrittstatus
 */
export function getStepColor(testResults, stepNumber) {
    if (!testResults?.details) return "#aeb0bb";

    // Alle Tests des gegebenen Schritts herausfiltern
    const stepTests = testResults.details.filter(t =>
        t.testId?.startsWith(`step${stepNumber}_`)
    );

    // Wenn der Schritt keine Tests enthält, gib neutral "grau" zurück
    if (stepTests.length === 0) return "#aeb0bb";

    // Falls noch ein Test läuft → neutral bleiben
    const isRunning = stepTests.some(t => t.result === "running");
    if (isRunning) return "#aeb0bb";

    // Falls ALLE Tests "pass" sind → grün
    const allPassed = stepTests.every(t => t.result === "pass");
    if (allPassed) return "#89ddaf";

    // Wenn mindestens ein Test fail ist (und keiner läuft) → rot
    const hasFail = stepTests.some(t => t.result === "fail");
    if (hasFail) return "#d16857ff";

    // Fallback (z. B. wenn unbekannte Zustände existieren)
    return "#aeb0bb";
}



/**
 * Gibt den höchsten Schrittindex (z. B. 3) zurück,
 * bei dem gerade mindestens ein Test "running" ist.
 *
 * @param {object} testResults - Das gesamte Testergebnisobjekt mit .details
 * @returns {number | null} - Die höchste laufende Schrittzahl oder null, wenn keiner läuft
 */
export function getRunningStep(testResults) {
    if (!testResults?.details) return null;

    // Alle Tests mit Status "running"
    const runningTests = testResults.details.filter(t => t.result === "running");
    if (runningTests.length === 0) return null;

    // Extrahiere alle Stepnummern (z. B. 1, 2, 3 …)
    const runningSteps = runningTests
        .map(t => {
            const match = t.testId?.match(/^step(\d+)_/);
            return match ? parseInt(match[1], 10) : null;
        })
        .filter(n => n !== null);

    // Wenn keine gültigen IDs → null
    if (runningSteps.length === 0) return null;

    // Den höchsten Step zurückgeben
    return Math.max(...runningSteps);
}

/**
 * Animiert den Text, indem er ähnlich zu einer Schreibmaschine Buchstabe für Buchstabe des Textes ergänzt.
 */
export function TypewriterText({
                            text,
                            speed = 40,
                            pauseAfterComplete = 40,
                            className = '',
                        }) {
    const [displayed, setDisplayed] = useState('');
    const idxRef = useRef(0);
    const timerRef = useRef(null);       // Für setInterval
    const timeoutRef = useRef(null);     // Für setTimeout
    const isMounted = useRef(true);      // Damit setState nach Unmount verhindert wird

    useEffect(() => {
        isMounted.current = true;

        function startTyping() {
            if (!isMounted.current) return;

            setDisplayed('\u00A0');
            idxRef.current = 0;

            timerRef.current = setInterval(() => {
                if (!isMounted.current) return;

                idxRef.current += 1;
                setDisplayed(text.substring(0, idxRef.current));

                if (idxRef.current >= text.length) {
                    clearInterval(timerRef.current);

                    timeoutRef.current = setTimeout(() => {
                        if (isMounted.current) startTyping();
                    }, pauseAfterComplete);
                }
            }, speed);
        }

        startTyping();

        return () => {
            isMounted.current = false;
            clearInterval(timerRef.current);
            clearTimeout(timeoutRef.current);
        };
    }, [text, speed, pauseAfterComplete]);

    return (
        <span className={className} style={{ whiteSpace: 'pre-wrap' }}>
            {displayed}
        </span>
    );
}


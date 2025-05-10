import React from "react";
import css from "./debuggingTutorialStep.css"

import {
    RESPONSE_START,
    RESPONSE_DEFAULT,
    RESPONSE_RELOAD,
    RESPONSE_TESTING,
    RESPONSE_TESTING_FINISHED,
    RESPONSE_EXPLANATION1,
    RESPONSE_EXPLANATION2,
    RESPONSE_EXPLANATION3,
    RESPONSE_EXPLANATION4,
    RESPONSE_ASK_TEST_START
} from './tutorial-constants.jsx';


/**
 * Contains Eulis responses which are the same for both tutorial-types.
 * @returns {JSX.Element}
 */
function renderCommonResponse(responseType, {
    setResponseType,
    handleTestStart,
    getResultText
})  {
    switch (responseType) {
        case RESPONSE_START:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p> Wie kann ich dir helfen? </p>
                        <p style={{marginTop: "15px"}}>
                            Wenn du nicht weißt, wie du anfangen sollst, drücke einfach auf
                            <span style={{color: "#ffae2f", fontWeight:"bold"}}> Was soll ich tun?</span>
                        </p>
                    </div>
                </div>
            );
        case RESPONSE_DEFAULT:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p> Alles klar! </p>
                        <p style={{marginTop: "15px"}}>
                            Wenn ich noch irgendetwas für dich tun kann, lass es mich wissen :)
                        </p>
                    </div>
                </div>
            );
        case RESPONSE_TESTING:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p> Warte bitte kurz, während ich mir deinen Code genauer anschaue...</p>
                    </div>

                    <span className={css.loader}></span>
                </div>
            );
        case RESPONSE_TESTING_FINISHED:
            return (
                <div className={css.responseContainer}>
                    {getResultText()}
                </div>
            );
        case RESPONSE_ASK_TEST_START:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p> Ich kann noch keine Testergebnisse anzeigen, weil ich deinen Code zuerst testen muss. Soll ich die Tests starten?</p>

                        <div className={css.responseButtonContainer}>
                            <button className={css.responseButtonAccept}
                                    onClick={() => {setResponseType(RESPONSE_DEFAULT); handleTestStart()}}>Ja, Testen!
                            </button>
                            <button className={css.responseButtonNext}
                                    onClick={() => setResponseType(RESPONSE_DEFAULT)}>Nein
                            </button>
                        </div>
                    </div>
                </div>
            );
        case RESPONSE_EXPLANATION2:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p> Mit einem Klick auf <span style={{color: "#c276ff", fontWeight: "bold"}}>Testergebnisse </span> kannst du dir jederzeit die Ergebnisse meiner letzten Prüfung anschauen.</p>

                        <div className={css.responseButtonContainer}>
                            <button className={css.responseButtonNext}
                                    onClick={() => setResponseType(RESPONSE_EXPLANATION3)}>Weiter
                            </button>
                        </div>
                    </div>
                </div>
            );
        default: return <span>ERROR: unknown RESPONSE!</span>;
    }
}

export function renderResponseClassic(responseType, {
    setResponseType,
    handleProjectReset,
    handleTestStart,
    getResultText
}) {
    switch (responseType) {

        case RESPONSE_RELOAD:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p> Natürlich kann ich deinen Code zurücksetzen, damit du von vorne
                            beginnen kannst. Möchtest du fortfahren? </p>

                        <div className={css.responseButtonContainer}>
                            <button className={css.responseButtonAccept} onClick={() => handleProjectReset()}>Ja</button>
                            <button className={css.responseButtonDecline} onClick={() => setResponseType(RESPONSE_DEFAULT)}>Nein</button>
                        </div>
                    </div>
                </div>
            );
        case RESPONSE_EXPLANATION1:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p style={{marginBottom: "15px"}}>Deine Aufgabe ist es, das beschriebene Spiel schrittweise zu programmieren.</p>
                        <p>Sobald du glaubst, dass du die aktuelle Aufgabe gelöst hast, klicke auf <span style={{color: "#52ddb6ff", fontWeight: "bold"}}>Lösung Testen</span>
                            . Ich überprüfe dann, ob dein Code korrekt funktioniert.</p>
                        <div className={css.responseButtonContainer}>
                            <button className={css.responseButtonNext}
                                    onClick={() => setResponseType(RESPONSE_EXPLANATION2)}>Weiter
                            </button>
                        </div>
                    </div>
                </div>
            );
        case RESPONSE_EXPLANATION3:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p> TODO Hier kannst du die Qualität prüfen!Wenn du mal nicht weiterkommst oder Hilfe brauchst, kannst du mich jederzeit über <span style={{color: "#62a4ffff", fontWeight: "bold"}}>Frag Euli </span>
                            um Unterstützung bitten. Gemeinsam finden wir die Fehler bestimmt!</p>

                        <div className={css.responseButtonContainer}>
                            <button className={css.responseButtonNext}
                                    onClick={() => setResponseType(RESPONSE_EXPLANATION4)}>Weiter
                            </button>
                        </div>
                    </div>
                </div>
            );
        case RESPONSE_EXPLANATION4:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p> Und falls du von vorne beginnen möchtest, kein Problem: Klicke einfach auf <span style={{color: "#ff5a57", fontWeight: "bold"}}>Neu Laden</span>
                            , und der Code wird zurückgesetzt. Danach kannst du mit frischem Elan erneut beginnen!</p>

                        <div className={css.responseButtonContainer}>
                            <button className={css.responseButtonNext}
                                    onClick={() => setResponseType(RESPONSE_DEFAULT)}>Alles klar!
                            </button>
                        </div>
                    </div>
                </div>
            );
        default: return renderCommonResponse(responseType, {
            setResponseType,
            handleTestStart,
            getResultText
        });
    }
}


export function renderResponseDebugging(responseType, {
    setResponseType,
    handleProjectReset,
    handleTestStart,
    getResultText
}) {
    switch (responseType) {

        case RESPONSE_RELOAD:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p> Natürlich kann ich deinen Code zurücksetzen, damit du mit der Fehlersuche von vorne
                            beginnen kannst. Möchtest du fortfahren? </p>

                        <div className={css.responseButtonContainer}>
                            <button className={css.responseButtonAccept} onClick={() => handleProjectReset()}>Ja</button>
                            <button className={css.responseButtonDecline} onClick={() => setResponseType(RESPONSE_DEFAULT)}>Nein</button>
                        </div>
                    </div>
                </div>
            );
        case RESPONSE_EXPLANATION1:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p style={{marginBottom: "15px"}}>Deine Aufgabe ist es, alle Fehler im Code zu finden.</p>
                        <p>Sobald du glaubst, alle gefunden zu haben, klicke auf <span style={{color: "#52ddb6ff", fontWeight: "bold"}}>Lösung Testen</span>
                            . Ich überprüfe dann, ob der Code korrekt funktioniert.</p>
                        <div className={css.responseButtonContainer}>
                            <button className={css.responseButtonNext}
                                    onClick={() => setResponseType(RESPONSE_EXPLANATION2)}>Weiter
                            </button>
                        </div>
                    </div>
                </div>
            );
        case RESPONSE_EXPLANATION3:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p> Wenn du mal nicht weiterkommst oder Hilfe brauchst, kannst du mich jederzeit über <span style={{color: "#62a4ffff", fontWeight: "bold"}}>Frag Euli </span>
                            um Unterstützung bitten. Gemeinsam finden wir die Fehler bestimmt!</p>

                        <div className={css.responseButtonContainer}>
                            <button className={css.responseButtonNext}
                                    onClick={() => setResponseType(RESPONSE_EXPLANATION4)}>Weiter
                            </button>
                        </div>
                    </div>
                </div>
            );
        case RESPONSE_EXPLANATION4:
            return (
                <div className={css.responseContainer}>
                    <div className={css.responseTextArea}>
                        <p> Und falls du versehentlich ein paar Codeblöcke gelöscht hast, kein Problem: Klicke einfach auf <span style={{color: "#ff5a57", fontWeight: "bold"}}>Neu Laden</span>
                            , und der Code wird zurückgesetzt. Danach kannst du mit frischem Elan weiter auf Fehlersuche gehen!</p>

                        <div className={css.responseButtonContainer}>
                            <button className={css.responseButtonNext}
                                    onClick={() => setResponseType(RESPONSE_DEFAULT)}>Alles klar!
                            </button>
                        </div>
                    </div>
                </div>
            );
        default: return renderCommonResponse(responseType, {
            setResponseType,
            handleTestStart,
            getResultText
        });
    }
}

import PropTypes from "prop-types";
import React, {useRef} from "react";
import css from "./debuggingTutorialStep.css"
import owl from "./images/owl-b.svg"
import failed_debugging from "./images/icon--failed-debugging.png"
import {FormattedMessage} from "react-intl";
import owlIcon from "./images/owl-b.svg"
import congratulations from "./images/Glückwunsch.png"
import euliLeft from "./images/euliLeft.png"
import iconErrors from "./images/icon--Errors.png"
import iconDescription from "./images/icon--Description.png"
import iconControls from "./images/icon--Controls.png"
import iconBack from "./images/icon--backButton.png"
import buttonHelp from "./images/buttonHelp.png"
import buttonOwly from "./images/buttonOwly.png"
import buttonReset from "./images/buttonReset.png"
import buttonResult from "./images/buttonResults.png"
import buttonTest from "./images/buttonTest.png"
import certificateBanner from "./images/CertificateBanner.png"
import certificateSignature from "./images/certificateSignature.png"
import certificateElementBody from "./images/certificateElementBody.png"
import certificateElementButton from "./images/certificateElementButton.png"
import certificateElementMedal from "./images/certificateElementMedall.png"
import certificateResultMedal from "./images/certificateMedalOverall.png"
import bubbleIndicator from "./images/SpeachBubbleRed.png"
import bubbleIndicatorGray from "./images/bubbleDecalGrey.png"

const RESPONSE_START = 'scratch-gui/debugging-tutorial-cards/RESPONSE_START'; // Also present in the reducer class
const RESPONSE_DEFAULT = 'scratch-gui/debugging-tutorial-cards/RESPONSE_DEFAULT';
const RESPONSE_RELOAD = 'scratch-gui/debugging-tutorial-cards/RESPONSE_RELOAD';
const RESPONSE_TESTING = 'scratch-gui/debugging-tutorial-cards/RESPONSE_TESTING';
const RESPONSE_TESTING_FINISHED = 'scratch-gui/debugging-tutorial-cards/RESPONSE_TESTING_FINISHED'; // Also present in the container class
const RESPONSE_EXPLANATION1 = 'scratch-gui/debugging-tutorial-cards/RESPONSE_EXPLANATION1';
const RESPONSE_EXPLANATION2 = 'scratch-gui/debugging-tutorial-cards/RESPONSE_EXPLANATION2';
const RESPONSE_EXPLANATION3 = 'scratch-gui/debugging-tutorial-cards/RESPONSE_EXPLANATION3';
const RESPONSE_EXPLANATION4 = 'scratch-gui/debugging-tutorial-cards/RESPONSE_EXPLANATION4';


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
        ...posProps
    } = props;

    const overviewStep = "overviewStep".concat((step + 1).toString());






    /**
     * Returns Euli's feedback-details containing all test results.
     */
    const parseDetails = () => {
        return testResults.details
            .sort((a, b) => b.testId.localeCompare(a.testId))
            .map(e => {
                const isCurrentStep = e.testId.charAt(4) === (step + 1).toString();
                const passed = e.result === "pass";
                const isDebuggingError = e.testDescription === "DEBUGGING_ERROR";

                if (isCurrentStep) {
                    return <div className={css.resultItem}>
                        <span style={{marginLeft: "10px", color: passed ? "#48a231" : "#a60b0b"}}>{e.test}</span>
                        {!isDebuggingError && !passed && <img alt="resultIcon" src={failed_debugging} style={{
                            width: "20px",
                            height: "auto",
                            marginRight: "7px"
                        }}/>}
                    </div>
                } else if (!passed) {
                    return <div className={css.resultItem}>
                        <span style={{marginLeft: "10px", color: "#a60b0b"}}>{e.test}</span>
                        <img alt="resultIcon" src={failed_debugging}
                             style={{width: "20px", height: "auto", marginRight: "7px"}}/>
                    </div>
                }
            });
    };

    const progressBarRef = useRef(null);
    const timeoutIdRef = useRef(null);

    /**
     * Helper-function for the delayed reset button.
     */
    const handleMouseDown = () => {
        setLoading(true);
        progressBarRef.current.style.width = '90%';
        progressBarRef.current.style.transition = 'width 1s linear';

        timeoutIdRef.current = setTimeout(() => {
            setCurPage("RESPONSE");
            showQuickHandle();
            progressBarRef.current.style.transition = 'none';
            progressBarRef.current.style.width = '0';
        }, 1100);
    };

    /**
     * Helper-function for the delayed reset button.
     */
    const handleMouseUp = () => {
        setLoading(false);
        clearTimeout(timeoutIdRef.current);
        progressBarRef.current.style.transition = 'none';
        progressBarRef.current.style.width = '0';
    };

    /**
     * Renders the current step.
     */
    const renderStep = () => {
        return (
            <div className={css.container}>
                <div style={{textAlign: "left"}}>
                    <span className={css.descriptionHeader}>{"Schritt " + (step + 1)}</span>
                </div>

                <p className={css.description}>
                    {tutorialMessages[overviewStep]["description"]}
                </p>

                <div className={css.errorBar}>
                    <span className={css.errorText}>Anzahl an Fehlern: </span>
                    <span className={css.errorNumber}>
                    {tutorialMessages[overviewStep]["errorAmount"]}
                </span>
                    <button className={css.detailsButton} onClick={onErrorClicked}>Details
                        <span className={css.tooltipText}>Falls du den Fehler nicht findest: </span>
                    </button>
                </div>

                {isErrorInfoVisible && <div className={css.error} onClick={onErrorClicked}>
                    {tutorialMessages[overviewStep]["errorDescription"]}
                </div>}

                <div className={css.explanationBar}>
                    <span className={css.explanationText}>
                    <u><b>Das ist zu tun:</b></u> Finde den Fehler und klicke auf <b>Überprüfen</b>, damit Euli deinen Code checkt. Wenn alles passt,
                    klicke auf <b>Weiter gehts</b>. Brauchst du Hilfe, klicke auf <b>Frage Euli</b>.
                    </span>
                </div>

                <div className={css.buttonBar}>
                    <div className={css.resetContainer}>

                        <button
                            className={projectLoadingState !== null ? projectLoadingState === "RESET" ? css.resetButtonLoading : css.buttonElementDisabled : isLoading ? css.resetButtonPressed : css.resetButton}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {projectLoadingState !== null ? projectLoadingState === "RESET" ? "Lädt..." : "Warten" : "Zurücksetzen"}
                            <div className={css.progressBar} ref={progressBarRef}></div>
                        </button>
                    </div>

                    <button className={css.buttonElement} onClick={onOpenHelp}>
                        <FormattedMessage //TODO TRANSLATE
                            defaultMessage="Frage Euli"
                            description="Title for button to shrink question category"
                            id="gui.cards.shrinkk"
                        />
                        <img alt={"Owl-Icon"} style={{width: "auto", height: "30px", marginLeft: "10px"}}
                             src={owlIcon}/>
                    </button>

                    {projectLoadingState !== null ?
                        <button className={css.buttonElementDisabled} disabled={true}>
                            {projectLoadingState === "TEST" ? "Lädt..." : "Warten"}
                        </button>
                        : <button
                            className={(testResults !== null && testResults.passed) ? css.nextButton : css.buttonElement}
                            onClick={(testResults !== null && testResults.passed) ? nextStep : onStartTests}>
                            {(testResults !== null && testResults.passed) ? "Weiter gehts!" : "Überprüfen"}
                        </button>}
                </div>

                {testResults !== null && <div className={css.testContainer}>
                    <div className={css.testBox}>
                        <div className={css.testResContainer}>
                        <span className={css.testNumber} style={{marginBottom: "10px", marginTop: "10px"}}>
                            {testResults.passed ? "Glückwunsch!" : "Schade!"}
                        </span>
                            {!testResults.passed &&
                                <button className={css.testResultButton} onClick={onTestDetails}>Details</button>}
                        </div>

                        {showTestDetail && !testResults.passed ?
                            <div style={{display: "flex", flexDirection: "column", alignItems: "flex"}}>
                                {parseDetails()}
                            </div> : <span style={{marginBottom: "5px", marginLeft: "10px", textAlign: "left"}}>
                            {getResultText()}
                        </span>}

                    </div>
                    <img style={{width: "100px", height: "auto"}} alt={"owl-picture explaining the result"} src={owl}/>
                </div>}
            </div>
        )
    }

    /**
     * Renders the final message, after finishing a tutorial.
     */
    const renderFinalStep = () => {
        return (<div className={css.container}>
            <img className={css.titleImage} src={congratulations} alt={"Picture of the final step"}
                 style={{marginTop: "15px", width: "300px", height: "auto"}}/>
            <div className={css.descriptionFinish}>
                <p>{tutorialMessages.levelFinishedText}</p>
            </div>

            <div className={css.detailsBar}>
                <div className={css.detailsBarElement}>
                    <span className={css.detailsTitle}>Mögliche Ergänzungen: </span>
                    <span className={css.detailsText}>{tutorialMessages.levelFinishedSuggestions}</span>
                </div>
            </div>
        </div>);
    }

    //return reachedLastStep ? renderFinalStep() : renderStep();

    const renderResponse = () => {
        return (
            <div className={css.cpContainer}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <img className={css.cpBackButton} src={iconBack} onClick={() => setCurPage("OVERVIEW")} alt={"Return Button"}/>
                </div>
                <div className={css.whiteBox}>
                    <img className={css.controlPanelImageSmall} src={euliLeft} alt={"Owl picture"} draggable={false}/>

                    <div>
                        <div className={css.responseBubble}>
                            <img className={css.responseBubbleIndicator} src={bubbleIndicatorGray} alt={"bubbleDecal"}/>
                            {getResponse()}
                        </div>
                    </div>

                </div>
                <div className={css.cpButtonRow}>
                    <div className={css.controlPanelButtonParent}>
                        <img
                            className={css.cpButton}
                            src={buttonTest}
                            alt={"Button Icon"}
                            draggable={false}
                            onClick={() => handleTestStart()}
                            style={{
                                filter: responseType === RESPONSE_START
                                || responseType === RESPONSE_DEFAULT
                                || responseType === RESPONSE_TESTING
                                || responseType === RESPONSE_TESTING_FINISHED? "none" : "grayscale(100%) brightness(1.2)",
                            }}
                        />
                        <span className={css.cpButtonDescription}>Lösung testen</span>
                    </div>
                    <div className={css.controlPanelButtonParent}>
                        <img
                            className={css.cpButton}
                            src={buttonResult}
                            alt={"Button Icon"}
                            draggable={false}
                            style={{
                                filter: responseType === RESPONSE_START
                                || responseType === RESPONSE_DEFAULT ? "none" : "grayscale(100%) brightness(2.6)",
                            }}
                            onClick={() => setCurPage("TEST_RESULTS")}
                        />
                        <span className={css.cpButtonDescription}>Testergebnisse</span>
                    </div>
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
                            onClick={onOpenHelp}
                        />
                        <span className={css.cpButtonDescription}>Frage Euli</span>
                    </div>
                    <div className={css.controlPanelButtonParent}>
                        <img
                            className={css.cpButton}
                            src={buttonHelp}
                            onClick={() => setResponseType(RESPONSE_EXPLANATION1)}
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
                        <span className={css.cpButtonDescription}>Was soll ich tun?</span>
                    </div>
                    <div className={css.controlPanelButtonParent}>
                        <img
                            className={css.cpButton}
                            src={buttonReset}
                            onClick={() => setResponseType(RESPONSE_RELOAD)}
                            alt={"Button Icon"}
                            style={{
                                filter: responseType === RESPONSE_START
                                || responseType === RESPONSE_DEFAULT
                                || responseType === RESPONSE_RELOAD ? "none" : "grayscale(100%) brightness(1.8)",
                            }}
                            draggable={false}
                        />
                        <span className={css.cpButtonDescription}>Neu laden</span>
                    </div>
                </div>
            </div>
        );
    }

    const renderOverview = () => {
        return (
            <div style={{width: "100%"}}>
                {/* Tabs */}
                <div className={css.tabContainer}>
                    <button className={css.tabButton}
                            style={{backgroundColor: contentType === "DETAILS" ? "#4D97FFFF" : ""}} id="beschreibungTab"
                            onClick={() => setContentType("DETAILS")}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <img className={css.icon} src={iconDescription} alt={"errorIcon"}/>
                            Beschreibung
                        </div>
                    </button>
                    <button className={css.tabButton}
                            style={{backgroundColor: contentType === "ERRORS" ? "#cf3b28FF" : ""}} id="fehlerTab"
                            onClick={() => setContentType("ERRORS")}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <img className={css.icon} src={iconErrors} alt={"errorIcon"}/>
                            Fehler
                        </div>
                    </button>
                    <button className={css.tabButton}
                            style={{backgroundColor: contentType === "CONTROLS" ? "#ffab19ff" : ""}} id="steuerungTab"
                            onClick={() => setContentType("CONTROLS")}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <img className={css.icon} src={iconControls} alt={"errorIcon"}/>
                            Steuerung
                        </div>
                    </button>
                </div>
                {/* Content */}
                <div className={css.container} style={{borderColor: getBorderColor()}}>
                    {getContent()}
                </div>
                {/* Next Button */}
                <div className={css.buttonContainer}>
                    {isShowingQuickHandle ?
                        <img className={css.cpBackButton} src={iconBack} onClick={() => setCurPage("RESPONSE")} style={{transform: "scaleY(-1)"}} alt={"Next page button"}/>
                            :
                        <button
                            className={isLoading ? css.resetButtonPressed : css.resetButton}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            Ich habe die Aufgabenstellung gelesen
                            <div className={css.progressBar} ref={progressBarRef}></div>
                        </button>
                    }
                </div>
            </div>
        );
    }

    const renderTestResults = () => {
        return (
            <div style={{display: "flex", alignItems: "center", flexDirection: "column", marginTop: "20px"}}>
                <img className={css.cpBackButton} src={iconBack} onClick={() => setCurPage("RESPONSE")} alt={"Return Button"}/>

                <div className={css.certificateFrame}>
                    <div className={css.cornerTopLeft}></div>
                    <div className={css.cornerTopRight}></div>
                    <div className={css.cornerBottomLeft}></div>
                    <div className={css.cornerBottomRight}></div>
                    <div>
                        <span className={css.certificateTitle}>ZERTIFIKAT</span>
                        <img className={css.certificateBanner} src={certificateBanner} alt={"Banner"}/>
                        <div className={css.certificateContainer}>
                            <div className={css.certificateContent}>
                                {generateCertificateElement()}
                                {generateCertificateElement()}
                                {generateCertificateElement()}
                            </div>
                            <div className={css.certificateFooter}>
                                <img src={certificateResultMedal} alt={"medal"} className={css.certificateResultMedal}/>
                                <img src={certificateSignature} alt={"Signature"} className={css.certificateSignature}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }


    const generateCertificateElement = () => {
        return (
            <div className={css.certificateElement}>
                <div className={css.certificateElementContainer}>
                    <span className={css.certificateElementText}>1) Schale bewegt sich</span>
                    <img className={css.certificateElementBody} src={certificateElementBody} alt={"Background"}/>
                    <img className={css.certificateElementMedal} src={certificateElementMedal} alt={"Medal"}/>
                </div>
                <img className={css.certificateElementButton} src={certificateElementButton} alt={"button"}/>
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
        switch (responseType) {
            case RESPONSE_START:
                return (
                    <div className={css.responseContainer}>
                        <div className={css.responseTextArea}>
                            <p> Wie kann ich dir helfen? </p>
                            <p style={{marginTop: "15px"}}>
                                Wenn du nicht weißt, wie du anfangen sollst, drücke einfach auf
                                <span style={{color: "#ffae2f", fontWeight:"bold"}}> Was sol ich tun?</span>
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
            default: return null;
        }
    }

    const getContent = () => {
        switch (contentType) {
            case "DETAILS":
                return (
                    <div className={css.detailsContainer}>
                        <div className={css.textArea}>
                            <h1>Schritt 1</h1>
                            <p>
                                {tutorialMessages[overviewStep]["description"]}
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
                                            <strong>Gerne!</strong> <br/><br/> Der Fehler besteht darin, dass sich die Schale nicht wie gewünscht mit den beiden Pfeiltasten nach links und rechts steuern lässt.
                                        </p> : <p>
                                            In dem Programm wurde <strong>1 Fehler</strong> eingebaut.
                                            Kannst du ihn finden?
                                        </p>
                                    }
                                </div>
                            </div>

                            {!isErrorInfoVisible &&
                                <div style={{display:"flex", justifyContent:"flex-start"}}>
                                    <span className={css.p}>Falls nicht, kannst du ihn jederzeit</span>
                                    <button onClick={showErrorInfo} className={css.errorButton}>Aufdecken</button>
                                </div>
                            }

                        </div>
                        <img src={euliLeft} alt={"Picture of Euli"} className={css.image} draggable={false}/>
                    </div>
                );
            case "CONTROLS":
                return (
                    <div style={{width:"100%", display:"flex", flexDirection:"column"}}>
                        <div className={css.controlContainer}>
                            {generateControlImages()}
                        </div>
                        <p className={css.p} style={{textAlign:"center"}}>{tutorialMessages[overviewStep]["controlInfo"]}</p>
                    </div>
                );
            default:
                console.warn(contentType + " is unknown!");
        }
    }

    const generateControlImages = () => {
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

    const getBorderColor = () => {
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
                console.warn("unknown contentType: " + contentType)
        }
        return col;
    }

    /**
     * Returns the feedback-summary for Euli.
     */
    const getResultText = () => {
        if (checkUserMadeErrors()) {
            return (
                <div className={css.responseTextArea}>
                    <p>Hoppla, anscheinend haben sich noch weitere Fehler eingeschlichen!</p>
                    <p>Du kannst jederzeit <span style={{color: "#62A4FFFF", fontWeight: "bold"}}>Euli fragen</span> oder das Projekt <span style={{color: "#ff5a57", fontWeight: "bold"}}>zurücksetzen</span>.</p>
                    <p style={{marginTop: "15px"}}>
                        Dann schaue ich mir die
                        <button
                            className={css.responseButtonTestResults}
                            onClick={() => setCurPage("TEST_RESULTS")}
                        >Testergebnisse</button>
                        an oder suche direkt
                        <button
                            className={css.responseButtonNext}
                            onClick={() => setResponseType(RESPONSE_DEFAULT)}
                        >weiter</button>
                        .
                    </p>
                </div>);
        } else if (testResults.passed) {
            return (
                <div className={css.responseTextArea}>
                    <p>Sieht super aus!</p>
                    <p style={{marginTop: "15px"}}>Du kannst nun zum <button className={css.responseButtonAccept} style={{marginLeft: "0", marginRight: "0"}} onClick={() => nextStep()}>nächsten Level</button> gehen.</p>
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
                            onClick={() => {setCurPage("TEST_RESULTS"); setResponseType(RESPONSE_DEFAULT)}}
                        >Testergebnisse</button>
                    </div>
                </div>);
        }
    }


    /**
     * Returns true, if the user has created more errors, which lead to at least one additional testcase to fail.
     */
    const checkUserMadeErrors = function () {
        let userMadeError = false;
        if (testResults.details === undefined) return false;
        testResults.details.map(e => {
            if (e.result !== "passed" && e.testDescription !== "DEBUGGING_ERROR") {
                userMadeError = true;
            }
        });
        return userMadeError;
    }

    const renderPage = () => {
        switch (curPage) {
            case "OVERVIEW":
                return renderOverview();
            case "RESPONSE":
                return renderResponse();
            case "TEST_RESULTS":
                return renderTestResults();
        }
    }

    return renderPage();
}

DebuggingTutorialStep.props = {
    onOpenHelp: PropTypes.func.isRequired,
    step: PropTypes.string,
    onStartTests: PropTypes.func,
    onReset: PropTypes.func,
}

export default DebuggingTutorialStep;

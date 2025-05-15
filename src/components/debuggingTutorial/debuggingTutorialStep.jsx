import PropTypes from "prop-types";
import React, {useRef} from "react";
import css from "./debuggingTutorialStep.css"
import owl from "./images/OwlBranchRight.png"
import failed_debugging from "./images/icon--failed-debugging.png"
import {FormattedMessage} from "react-intl";
import owlIcon from "./images/owl-b.svg"
import congratulations from "./images/Glückwunsch.png"
import iconErrors from "./images/icon--Errors.png"
import iconDescription from "./images/icon--Description.png"
import iconControls from "./images/icon--Controls.png"
import iconBack from "./images/icon--backButton.png"
import buttonHelp from "./images/buttonHelp.png"
import buttonOwly from "./images/buttonOwly.png"
import buttonReset from "./images/buttonReset.png"
import buttonResult from "./images/buttonResults.png"
import buttonTest from "./images/buttonTest.png"
import bubbleIndicator from "./images/SpeachBubbleRed.png"
import bubbleIndicatorGray from "./images/bubbleDecalGrey.png"
import bubbleIndicatorBlue from "./images/bubbleIDecalBlue2.png";
import downButton from "./images/downButton.png"
import upButton from "./images/upButton.png"
import backButton from "./images/nextButton3.png";
import closeIcon from "./images/iconClose.png"
import downloadIcon from "./images/downloadIcon.png"
import bubbleIndicatorPurple from "./images/bubbleDecalPurple.png"
import owl2 from "./images/owlTransparent.png"
import {renderResponse2, renderResponseClassic, renderResponseDebugging} from "./tutorial-step-response-renderer.jsx";
import testSuccess from "./images/icon--testSuccess.png"
import testFailed from "./images/icon--testFailed.png"
import testRunning from "./images/icon--testRunning.png"


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
import scratchblocks from "scratchblocks";
import stylesHints from "../tutorial/styles/tutorial-code-quality.css";
import ScratchBlocks from "scratchblocks-react";
import saveTrueIcon from "./images/saveTrueIcon.png";
import saveTrueIconWhite from "./images/autoSaveOnWhite.png";


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
        onDownload,
        downloaded,
        isDebuggingTutorial,
        overviewStep,
        showControlOverview,
        showDownloadsOverview,
        curQualityResult,
        setHelpType,
        helpType,
        onBackToTutorialSelection,
        hasUpdatedSinceLastTest,
        hasUpdatedSinceLastTest2,//TODO remove
        hasCodeUpdated,
        ...posProps
    } = props;


    const progressBarRef = useRef(null);
    const timeoutIdRef = useRef(null);

    /**
     * Helper-function for the delayed reset button.
     */
    const handleMouseDown = () => {
        if (progressBarRef.current === null) return;

        setLoading(true);
        progressBarRef.current.style.width = '90%';
        progressBarRef.current.style.transition = 'width 1s linear';

        timeoutIdRef.current = setTimeout(() => {
            setCurPage("RESPONSE");
            showQuickHandle();
            if (progressBarRef.current !== null) {
                progressBarRef.current.style.transition = 'none';
                progressBarRef.current.style.width = '0';
            }
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
     * Renders the final message, after finishing a tutorial.
     */
    const renderFinalStep = () => {
        return (
            <div className={css.cpContainer}>
                <span className={css.finalTitle}>Glückwunsch!</span>
                <div className={css.whiteBox}>
                    <div className={css.bubbleContainer}>
                        <div className={css.testStartBubble}>
                            <img className={css.finalBubbleIndicator} alt={"Bubble-Decal"} src={bubbleIndicatorBlue}/>
                            {tutorialMessages.levelFinishedText}
                        </div>
                        <img src={owl2} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
                    </div>
                </div>
                <div className={css.backToMenuButton} onClick={() => onBackToTutorialSelection()}>Weiter</div>
            </div>
        );
    }

    const renderResponse = () => {
        return (
            <div className={css.cpContainer}>
                <div className={css.arrowButtonContainer}>
                    <div className={css.upArrowFill}/>
                    <img className={css.backButton}
                         src={upButton}
                         onClick={() => setCurPage("OVERVIEW")}
                         alt={"Next page button"}
                         draggable={false}
                    />
                </div>

                <div className={css.whiteBox}>
                    <img className={css.controlPanelImageSmall} src={owl} alt={"Owl picture"} draggable={false}/>

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
                            onClick={() => {if (!testResults?.passed) handleTestStart()}}
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
                                || responseType === RESPONSE_ASK_TEST_START
                                || responseType === RESPONSE_DEFAULT ? "none" : "grayscale(100%) brightness(2.6)",
                            }}
                            onClick={() => {
                                if (testResults === null || testResults === undefined) {
                                    setResponseType(RESPONSE_ASK_TEST_START);
                                } else if (!testResults?.passed) {
                                    setCurPage("TEST_RESULTS");setResponseType(RESPONSE_DEFAULT);
                                }
                            }}
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
                            onClick={() => {if (!testResults?.passed) {
                                if (isDebuggingTutorial) {
                                    onOpenHelp();
                                } else {
                                    setCurPage("HELP");
                                }
                            }}}
                        />
                        <span className={css.cpButtonDescription}>Frage Euli</span>
                    </div>
                    <div className={css.controlPanelButtonParent}>
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
                        <span className={css.cpButtonDescription}>Was soll ich tun?</span>
                    </div>
                    <div className={css.controlPanelButtonParent}>
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
                        <span className={css.cpButtonDescription}>Neu laden</span>
                    </div>
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
                                    <img className={css.icon} src={iconDescription} alt={"errorIcon"}/>
                                    Beschreibung
                                </div>
                            </button>

                            {isDebuggingTutorial ?
                                <button className={css.tabButton}
                                        style={{backgroundColor: contentType === "ERRORS" ? "#cf3b28FF" : ""}} id="fehlerTab"
                                        onClick={() => setContentType("ERRORS")}>
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <img className={css.icon} src={iconErrors} alt={"errorIcon"}/>
                                        Fehler
                                    </div>
                                </button>
                                :
                                (showDownloadsOverview && <button className={css.tabButton}
                                        style={{backgroundColor: contentType === "DOWNLOADS" ? "#b14eea" : ""}} id="downloadTab"
                                        onClick={() => setContentType("DOWNLOADS")}>
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <img className={css.icon} src={downloadIcon} alt={"downloadIcon"}/>
                                        Downloads
                                    </div>
                                </button>)
                            }

                            {showControlOverview && <button className={css.tabButton}
                                    style={{backgroundColor: contentType === "CONTROLS" ? "#ffab19ff" : ""}} id="steuerungTab"
                                    onClick={() => setContentType("CONTROLS")}>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <img className={css.icon} src={iconControls} alt={"errorIcon"}/>
                                    Steuerung
                                </div>
                            </button>}
                        </div>
                        {/* Content */}
                        <div className={css.container} style={{borderColor: getBorderColor()}}>
                            {getContent()}
                        </div>
                    </div>
                </div>

                {/* Next Button */}
                <div className={css.buttonContainer}>
                    {isShowingQuickHandle ?
                        <div className={css.arrowButtonContainer}>
                            <div className={css.downArrowFill}/>
                            <img className={css.backButton}
                                 src={downButton}
                                 onClick={() => setCurPage("RESPONSE")}
                                 alt={"Next page button"}
                                 draggable={false}
                            />
                        </div>
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



    const renderCodeQuality = () => {
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
                                    <img className={css.icon} src={iconDescription} alt={"errorIcon"}/>
                                    Smells
                                </div>
                            </button>

                            <button className={css.tabButton}
                                    style={{backgroundColor: contentType === "ERRORS" ? "#cf3b28FF" : ""}} id="fehlerTab"
                                    onClick={() => setContentType("ERRORS")}>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <img className={css.icon} src={iconErrors} alt={"errorIcon"}/>
                                    Good
                                </div>
                            </button>

                        </div>

                        {/* Content */}
                        <div className={css.container} style={{borderColor: getBorderColor()}}>
                            {getCodeQualityContent()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getCodeQualityContent = () => {
        return(
            <div className={css.qualityContainer}>
                <div className={css.arrowButtonContainer}>
                    <div className={css.upArrowFill}/>
                    <img className={css.backButton}
                         src={upButton}
                         onClick={() => setCurPage("OVERVIEW")}
                         alt={"Next page button"}
                         draggable={false}
                    />
                </div>


                <div className={css.qualityHeader}>
                    <div className={css.qualitySpriteTitle}>
                    </div>
                    <div className={css.qualityTitle}>

                    </div>

                    <div className={css.qualityContent}>
                        <div className={css.qualityButtonContainer}>
                            <img className={css.qualityButton} alt={"back"}/>
                        </div>
                        <div className={css.qualityDescription}>

                        </div>
                        <div className={css.qualityCodeImg}>
                            {curQualityResult !== undefined &&
                            <ScratchBlocksImage
                                scratchBlocksText={curQualityResult.codeSnippet}
                                locale={props.locale}
                            />}
                        </div>
                        <div className={css.qualityButtonContainer}>
                            <img className={css.qualityButton} alt={"next"}/>
                        </div>
                    </div>
                </div>
            </div>);
    }



    const renderTestResults = () => {
        return (
            <div className={css.testContainer}>
                <div className={css.arrowButtonContainer}>
                    <div className={css.upArrowFill}/>
                    <img className={css.backButton}
                         src={upButton}
                         onClick={() => setCurPage("RESPONSE")}
                         alt={"Next page button"}
                         draggable={false}
                    />
                </div>

                <div className={css.testWhiteBoxTop}>

                    <div className={css.bubbleContainer}>
                        <div className={css.columnFlex}>
                            <div className={css.testStartBubble}>
                                <img className={css.testBubbleIndicator} alt={"Bubble-Decal"} src={bubbleIndicatorGray}/>
                                {getTestText()}
                            </div>
                            {(hasCodeUpdated || (projectLoadingState === "TEST")) && <div className={`${css.helpBubble} ${(projectLoadingState !== "TEST") ? '' : css.selected}`} onClick={() => { if (projectLoadingState !== "TEST") handleTestStart()}}>
                                <div className={css.selectionBubbleIndicator} />
                                Ja, teste erneut!
                            </div>}
                        </div>

                        <img src={owl2} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
                    </div>
                </div>


                <div className={css.testWhiteBox} style={{marginTop: "20px", display:"flex", flexDirection:"column", padding: "10px 0px 0px 10px", marginBottom:"10px"}}>
                    <strong style={{fontSize:"1.2rem"}}>Testergebnisse</strong>
                    <div className={css.testResultContainer}>
                        {parseTestResults()}
                    </div>
                </div>
            </div>
        );
    }

    const getTestText = () => {
        if (projectLoadingState === "TEST") return <span>Warte bitte kurz, bis ich deinen Code überprüft habe!</span>

        if (hasUpdatedSinceLastTest2) return <span>Anscheinend hat sich dein Code seit dem letzten Testlauf verändert.</span>

        if (curTestDetails !== "") return <span>Hier siehst du Details zum Test</span>

        return (testResults !== null) ? <span>Hier siehst du deine einzelnen Testergebnisse</span>
            : <span>Es wurden noch keine Tests durchgeführt, die ich dir hier anzeigen kann.</span>;
    }

    /**
     * Returns Euli's feedback-details containing all test results.
     */
    const parseTestResults = () => {
        if (testResults === null || testResults === undefined) return (
            <div className={css.testStartButton}
                 onClick={() => {setResponseType(RESPONSE_TESTING); handleTestStart(); setCurPage("RESPONSE")}}>
                Test Starten
            </div>
        );

        hasUpdatedSinceLastTest();

        return testResults.details //TODO Extend!
            .sort((a, b) => b.testId.localeCompare(a.testId))
            .map((e, index) => {
                const isCurrentStep = e.testId.charAt(4) === (step + 1).toString();
                const passed = e.result === "pass";
                const isDebuggingError = e.testDescription === "DEBUGGING_ERROR";
                return createTestElement(passed, e, (index + 1));
            });
    };


    const createTestElement = (passed, e, testElementNumber) => {
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

        const headerText = (projectLoadingState === "TEST")
            ? "Lädt…"
            : passed
                ? "Bestanden"
                : "Gescheitert";


        if (curTestDetails === e.testId) {
            return (
                <div key={e.testId} className={css.testElementContainer} style={{width:"450px"}}>
                    <div className={css.testElementHeader} style={{backgroundColor: headerBgColor, height:"60px"}}>
                        <div className={css.testElementTitleExtended}>
                            <img src={iconSrc} style={{width: "43px", marginRight: "10px"}} className={css.testElementIcon} alt={"ResultIcon"}/>
                            {headerText}
                        </div>
                    </div>
                    <span className={css.testElementTitle}>{e.test}</span>
                    <p className={css.testElementText}>{e.testDescription}</p>
                    <div className={css.testElementButton} style={{borderColor: headerBgColor}} onClick={() => setCurTestDetails("")}>
                        Schließen
                    </div>
                </div>);
        }

        return (
            <div key={e.testId} className={css.testElementContainer} onClick={() => setCurTestDetails(e.testId)}>
                <div className={css.testElementHeader} style={{backgroundColor: headerBgColor}}>
                    <img src={iconSrc} className={css.testElementIcon} alt={"ResultIcon"}/>
                    {headerText}
                </div>
                <span className={css.testElementTitle}>{e.test}</span>
                <div className={css.testElementButton} style={{borderColor: headerBgColor}}>
                    Details
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
                getResultText
            });
        } else {
            return renderResponseClassic(responseType, {
                setResponseType,
                handleProjectReset,
                handleTestStart,
                getResultText
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
            case "DOWNLOADS":
                return (
                    <div className={css.errorContainer}>
                        <div style={{display:"flex", flexDirection: "column", width: "100%", justifyContent: "space-between", height: "200px"}}>
                            <div className={css.downloadContainer2}>
                                <div className={css.bubble} style={{backgroundColor:"#c276ff"}}>
                                    <img className={css.bubbleIndicator} alt={"Bubble-Decal"} src={bubbleIndicatorPurple}/>
                                    <p>
                                        Hier kannst du alle bilder downloaden, die du für den aktuellen Schritt brauchst
                                    </p>
                                </div>
                                <div className={css.downloadContainer}>
                                    {generateDownloadButtons()}
                                </div>
                            </div>
                        </div>
                        <img src={owl} alt={"Picture of Euli"} className={css.image} draggable={false}/>
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
                                            <strong>Gerne!</strong> <br/><br/> {tutorialMessages[overviewStep]["errorDescription"]}
                                        </p> : <p>
                                            In dem Programm wurde <strong>{tutorialMessages[overviewStep]["errorAmount"]} Fehler</strong> eingebaut.
                                            Kannst du ihn finden?
                                        </p>
                                    }
                                </div>
                            </div>

                            {!isErrorInfoVisible &&
                                <div style={{display:"flex", justifyContent:"flex-start"}}>
                                    <span className={css.p}>Falls nicht, kannst du ihn jederzeit</span>
                                    <button onClick={showErrorInfo} className={css.errorButton}>aufdecken</button>
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
                            {generateControlImages()}
                        </div>
                        <p className={css.p} style={{textAlign:"center"}}>{tutorialMessages[overviewStep]["controlInfo"]}</p>
                    </div>
                );
            default:
                console.warn(contentType + " is unknown!");
        }
    }

    const generateDownloadButtons = () => {
        return Object.keys(tutorialMessages[overviewStep])
            .filter(key => key.startsWith("download"))
            .map(key => {
                return (generateDownloadButton3((key.match(/\d+$/)[0])));
            });
    }

    const generateDownloadButton3 = (id) => {
        const downloadTitle = tutorialMessages[overviewStep]["download" + id.toString()];
        const downloadImg = tutorialIndexData["downloadContent" + id.toString()];
        const isDownloaded = downloaded.includes(downloadTitle);

        return (
            <div key={id} className={`${css.downloadBox} ${isDownloaded ? css.downloadBoxFinished : ''}`}>
                <img className={css.downloadImage}
                     src={downloadImg} alt={"Download Preview"}/>
                <div className={css.downloadButton} onClick={() => onDownload(downloadTitle, downloadImg)}>
                    {isDownloaded ? "Fertig" : ("Download " + downloadTitle)}
                </div>
            </div>
        );
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
            case "DOWNLOADS":
                col = "#b14eea"
                break;
            default:
                console.log("unknown contentType: " + contentType)
        }
        return col;
    }

    /**
     * Returns the feedback-summary for Euli.
     */
    const getResultText = () => { //TODO Refactor!
        if (checkUserMadeErrors()) {
            return (
                <div className={css.responseTextArea}>
                    <p>Hoppla, anscheinend haben sich noch weitere Fehler eingeschlichen!</p>
                    <p>Du kannst jederzeit <span style={{color: "#62A4FFFF", fontWeight: "bold"}}>Euli fragen</span> oder das Projekt <span style={{color: "#ff5a57", fontWeight: "bold"}}>zurücksetzen</span>.</p>
                    <p style={{marginTop: "15px"}}>
                        <button
                            className={css.responseButtonTestResults}
                            onClick={() => {setCurPage("TEST_RESULTS"); setResponseType(RESPONSE_DEFAULT);}}
                        >Testergebnisse</button>
                        <button
                            className={css.responseButtonNext}
                            onClick={() => setResponseType(RESPONSE_DEFAULT)}
                        >Schließen</button>
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
        if (testResults === null || testResults.details === undefined) return false;
        testResults.details.map(e => {
            if (e.result !== "passed" && e.testDescription !== "DEBUGGING_ERROR") {
                userMadeError = true;
            }
        });
        return userMadeError;
    }

    const renderHelp = () => {
        return (
            <div className={css.testContainer}>
                <div className={css.arrowButtonContainer}>
                    <div className={css.upArrowFill}/>
                    <img className={css.backButton}
                         src={upButton}
                         onClick={() => setCurPage("RESPONSE")}
                         alt={"Back"}
                         draggable={false}
                    />
                </div>

                <div className={css.testWhiteBox} style={{marginTop: "10px", padding: "10px 0px 10px 10px"}}>
                    <div className={css.helpContainer}>
                        <div className={css.helpBubbleEuli}>
                            <img className={css.helpBubbleEuliIndicator} alt={"Bubble-Decal"} src={bubbleIndicatorBlue}/>
                            <span>Eigene Programme zu schreiben, kann manchmal ganz schön knifflig sein.<br/>Möchtest du einen Tipp von mir?</span>
                        </div>

                        <div className={`${css.helpBubble} ${(helpType === "") ? '' : css.selected}`} onClick={() => {
                            if (helpType === "") {
                                setHelpType("HINT");
                            }
                        }}>
                            <div className={css.selectionBubbleIndicator} />
                            Ja bitte, gib mir einen Hinweis
                        </div>

                        {helpType !== "" && <div className={css.helpBubbleEuli}>
                            <img className={css.helpBubbleEuliIndicator} alt={"Bubble-Decal"} src={bubbleIndicatorBlue}/>
                            {(helpType === "HINT") ? <span>Klar: Nutze folgende Blöcke</span> : <span>Hier die Lösung</span>}
                            <div style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"center", marginTop:"10px"}}>
                                <img src={(helpType === "SOLUTION") ? tutorialIndexData["imageSolutionDE" + (step + 1).toString()] : tutorialIndexData["imageStep" + (step + 1).toString()]} alt={"Solution"} className={css.helpImage}/>
                            </div>
                        </div>}

                        {helpType !== "" && <div className={`${css.helpBubble} ${(helpType === "HINT") ? '' : css.selected}`} onClick={() => setHelpType("SOLUTION")}>
                            <div className={css.selectionBubbleIndicator} />
                            Kannst du mit stattdessen die fertige Lösung zeigen?
                        </div>}
                    </div>

                    <div className={css.imageContainer}>
                        <img src={owl} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
                    </div>
                </div>
            </div>
        );
    }

    const renderPage = () => {
        if (reachedLastStep) return renderFinalStep();

        switch (curPage) {
            case "OVERVIEW":
                return renderOverview();
            case "RESPONSE":
                return renderResponse();
            case "TEST_RESULTS":
                return renderTestResults();
            case "CODE_QUALITY":
                return renderCodeQuality(); // TODO delete
            case "HELP":
                return renderHelp();
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










const translate = (scratchBlocksText, locale) => {
    const block = scratchblocks.parse(scratchBlocksText, {
        languages: ['en', 'de']
    });
    if (locale === 'de') {
        block.translate(scratchblocks.allLanguages.de);
    }
    return block.stringify();
};

const ScratchBlocksImage = props => (
    <div className={stylesHints.scratchImage}>
        <ScratchBlocks
            blockStyle="scratch3"
            languages={['en', 'de']}
        >
            {translate(props.scratchBlocksText, props.locale)}
        </ScratchBlocks>
    </div>
);

ScratchBlocksImage.propTypes = {
    scratchBlocksText: PropTypes.string,
    locale: PropTypes.string
};

import PropTypes from "prop-types";
import React, {useRef, useState} from "react";
import css from "./debuggingTutorialStep.css"
import owl from "./images/OwlBranchRight.png"
import iconErrors from "./images/icon--Errors.png"
import iconDescription from "./images/icon--Description.png"
import iconControls from "./images/icon--Controls.png"
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
import bubbleIndicatorPurple from "./images/bubbleDecalPurple.png"
import owl2 from "./images/owlTransparent.png"
import {renderResponseClassic, renderResponseDebugging} from "./tutorial-step-response-renderer.jsx";
import { TransitionGroup } from 'react-transition-group'
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
import {EuliBubble, UserBubble} from "./bubbles.jsx";
import TestResults from "./test-results.jsx";
import rightArrow from "../cards/icon--next.svg";
import leftArrow from "../cards/icon--prev.svg";
import ScratchBlocks from "scratchblocks-react";




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
        testPageIndex,
        onIncreaseTestPageIndex,
        onDecreaseTestPageIndex,
        guiMessages,
        sprites,
        setSelectedSprite,
        selectedSprite,
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
                        <div className={css.testStartBubble} style={{borderColor:"#4D97FFFF"}}>
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
                {/*<div className={css.arrowButtonContainer}>
                    <div className={css.upArrowFill}/>
                    <img className={css.backButton}
                         src={upButton}
                         onClick={() => setCurPage("OVERVIEW")}
                         alt={"Next page button"}
                         draggable={false}
                    />
                </div>*/}





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
                                    setReturnToTestResults(false);
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
                        <span className={css.cpButtonDescription}>Schritt neu starten</span>
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

                            {isDebuggingTutorial &&
                                <button className={css.tabButton}
                                        style={{backgroundColor: contentType === "ERRORS" ? "#cf3b28FF" : ""}} id="fehlerTab"
                                        onClick={() => setContentType("ERRORS")}>
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <img className={css.icon} src={iconErrors} alt={"errorIcon"}/>
                                        Fehler
                                    </div>
                                </button>
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
                        /*<div className={css.arrowButtonContainer}>
                            <div className={css.downArrowFill}/>
                            <img className={css.backButton}
                                 src={downButton}
                                 onClick={() => setCurPage("RESPONSE")}
                                 alt={"Next page button"}
                                 draggable={false}
                            />
                        </div>*/


                        <div
                            className={css.overviewNextButton}
                            onClick={() => setCurPage("RESPONSE")}
                        >
                            <span>Weiter</span>
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
                            Ich habe die Aufgabenstellung gelesen
                            <div className={css.progressBar} ref={progressBarRef}></div>
                        </button>
                    }
                </div>
            </div>
        );
    }

    const renderTestResults = () => {
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
            openHelpPage={openHelp}
        />
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
            case "DOWNLOADS": //TODO remove
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
                                    generateDownloadButtons()
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
                console.log("unknown contentType: " + contentType)
        }
        return col;
    }

    /**
     * Returns the feedback-summary for Euli.
     */
    const getResultText = () => { //TODO Refactor! (Gehört in eulis response code!)
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
     */ //TODO DELETE?
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

    //TODO move to reducer
    const [helpIndex, setHelpIndex] = useState(0);
    const [returnToTestResults, setReturnToTestResults] = useState(false);
    const openHelp = (spriteKey) => {
        setSelectedSprite(spriteKey);
        setHelpIndex(30);
        setCurPage("HELP");
        setReturnToTestResults(true);
    }

    const renderHelp = () => {
        const selectedSpriteName = selectedSprite
            ? tutorialMessages?.[selectedSprite.split("_")[0]]?.[selectedSprite.split("_")[1]?.toLowerCase()]?.["name"]
            : "";
        return (
            <div className={css.testContainer}>
                <div className={css.spriteSelection}>
                    {sprites.map(key =>
                        <div className={selectedSprite === key ? css.spriteElementSelected : css.spriteElement} onClick={() => {setSelectedSprite(key); setHelpIndex(30)}} style={{opacity: helpIndex >= 2 ? 1 : 0}}>
                            <img src={tutorialIndexData[key]} className={css.spriteElementIcon} alt={"SpriteImage"} draggable={false}/>
                        </div>
                    )}
                </div>


                <div className={css.helpWhiteBox}>
                    <div className={css.helpContainer}>
                        <TransitionGroup component={null}>
                            <EuliBubble text={"Programmieren ist oft ganz schön schwer. Soll ich dir helfen?\nWähle zuerst eine Figur aus, bei der ich dir helfen kann:"} isVisible={helpIndex >= 0 && helpIndex < 10} key={"aaa"} onTypewriterComplete={() => setHelpIndex(1)} isTypewriterFinished={helpIndex >= 1}/>
                            <UserBubble text={"Mich interessiert die Figur: " + selectedSpriteName} isVisible={helpIndex >= 1 && helpIndex < 10} key={"asdad"} isSelected={helpIndex >= 2}>
                                {helpIndex < 2 && <div className={css.spriteSelection} style={{marginTop:"5px"}}>
                                    {sprites.map(key =>
                                        <div className={selectedSprite === key ? css.spriteElementSelected : css.spriteElement} onClick={() => {setSelectedSprite(key); setHelpIndex(2)}}>
                                            <img src={tutorialIndexData[key]} className={css.spriteElementIcon} alt={"SpriteImage"} draggable={false}/>
                                        </div>
                                    )}
                                </div>}
                            </UserBubble>
                            <EuliBubble text={"Die Katze ist wie eine echte Katze.\nSie liegt nur rum ohne irgendetwas zu machen, außer manchmal zu miauen."} isVisible={helpIndex >= 2 && helpIndex < 10} key={"aa23as"} onTypewriterComplete={() => setHelpIndex(3)} isTypewriterFinished={helpIndex >= 3}/>
                            <UserBubble text={"Gib mir einen weiteren Hinweis!"} isVisible={helpIndex >= 3 && helpIndex < 20} key={"asdad2"} onClick={() => setHelpIndex(10)} isSelected={helpIndex >= 10}/>
                            <EuliBubble text={"Selbstverständlich! Nutze folgenden Block:"} isVisible={helpIndex >= 10 && helpIndex < 20} key={"aaas3"} onTypewriterComplete={() => setHelpIndex(11)} isTypewriterFinished={helpIndex >= 11}>
                                <div style={{transform: "scale(0.8)"}}>
                                    <ScratchBlocks
                                        blockStyle="scratch3"
                                        languages={['en', 'de']}
                                    >
                                        {"Sage [Miau]"}
                                    </ScratchBlocks>
                                </div>
                            </EuliBubble>

                            <UserBubble text={"Bitte noch einen weiteren Hinweis!"} isVisible={helpIndex >= 11 && helpIndex < 20} key={"asdad24"}/>

                            <EuliBubble text={"Hier ein Hinweis zur Figur " + selectedSpriteName + ":\nDas Boot muss sich durchgehend zum Mauszeiger drehen."} isVisible={helpIndex >= 30 && helpIndex < 40} key={"aaa6"} onTypewriterComplete={() => setHelpIndex(31)} isTypewriterFinished={helpIndex >= 31}/>
                            <UserBubble text={"Ich brauche noch mehr Hilfe"} isVisible={helpIndex >= 31 && helpIndex < 40} key={"asd23ad2"} onClick={() => setHelpIndex(40)} isSelected={helpIndex >= 40}/>
                            <EuliBubble text={"Hier die vollständige Lösung von " + selectedSpriteName + "."} isVisible={helpIndex >= 40 && helpIndex < 50} key={"aaa9"} onTypewriterComplete={() => setHelpIndex(43)} isTypewriterFinished={helpIndex >= 43}/>

                        </TransitionGroup>
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
            case "HELP":
                return renderHelp();
        }
    }
    return <>
        {curPage === "RESPONSE" && <div className={css.leftButton} onClick={() => setCurPage("OVERVIEW")}>
            <img src={leftArrow} alt="Next" draggable={false} />
        </div>}
        {curPage === "TEST_RESULTS" && <div className={css.leftButton} onClick={() => setCurPage("RESPONSE")}>
            <img src={leftArrow} alt="Next" draggable={false} />
        </div>}
        {curPage === "HELP" && <div className={css.leftButton} onClick={() => {returnToTestResults ? setCurPage("TEST_RESULTS") : setCurPage("RESPONSE")}}>
            <img src={leftArrow} alt="Next" draggable={false} />
        </div>}
        {renderPage()}
        {false && <div className={css.rightButton} onClick={null}>
            <img src={rightArrow} alt="Next" draggable={false} />
        </div>}
    </>
}

DebuggingTutorialStep.props = {
    onOpenHelp: PropTypes.func.isRequired,
    step: PropTypes.string,
    onStartTests: PropTypes.func,
    onReset: PropTypes.func,
}

export default DebuggingTutorialStep;


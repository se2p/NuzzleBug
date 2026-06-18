import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';
import css from './tutorial-flow.css';

import bubbleIndicator from '../../../images/SpeachBubbleRed.png';
import bubbleIndicatorGray from '../../../images/bubbleDecalGrey.png';
import bubbleIndicatorBlue from '../../../images/bubbleIDecalBlue2.png';
import leftArrow from '../../../images/icon--prev.svg';

import {renderResponseClassic, renderResponseDebugging} from '../../../shared/tutorial-step-response-renderer.jsx';
import {
    RESPONSE_DEFAULT, RESPONSE_TESTING, RESPONSE_TESTING_FINISHED, PAGE_OVERVIEW, PAGE_RESPONSE,
    PAGE_TEST_RESULTS, PAGE_HELP
} from '../../../shared/tutorial-constants.jsx';
import TestResults from '../features/test-results/test-results.jsx';

import logging from 'scratch-vm/src/util/logging.js';
import {checkUserMadeErrors, getBorderColor, logResponse} from '../tutorial-step-util.jsx';
import {tutorialConfig} from '../../../config.js';
import {FinalStep} from '../features/final-step/final-step.jsx';
import TutorialHelpPage from '../features/help-page/tutorial-help-page.jsx';
import HintGenerator from '../../../shared/hint-generation.js';
import ResponsePage from '../features/debugging-home/response-page.jsx';
import OverviewPage from '../features/step-overview/overview-page.jsx';

const DebuggingTutorialStep = props => {
    const {
        onOpenHelp,
        tutorialMessages,
        step,
        onStartTests,
        isErrorInfoVisible,
        testResults,
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
        isDebuggingTutorial,
        overviewStep,
        showControlOverview,
        onBackToTutorialSelection,
        hasCodeUpdated,
        testPageIndex,
        onIncreaseTestPageIndex,
        onDecreaseTestPageIndex,
        guiMessages,
        vm,
        removeTutorialPoint,
        tutorialPoints
    } = props;

    const handleTestStart = () => {
        setResponseType(RESPONSE_TESTING);
        onStartTests();
    };

    const handleProjectReset = () => {
        onResetProject();
        setResponseType(RESPONSE_DEFAULT);
    };

    const getResponse = () => {
        if (isDebuggingTutorial) {
            return renderResponseDebugging(responseType, {
                setResponseType,
                handleProjectReset,
                handleTestStart,
                getResultText,
                guiMessages
            });
        }
        return renderResponseClassic(responseType, {
            setResponseType,
            handleProjectReset,
            handleTestStart,
            getResultText,
            guiMessages
        });

    };

    const getResultText = () => {
        if (testResults?.passed) {
            return (
                <div className={css.responseTextArea}>
                    <p>Sieht super aus!</p>
                    <p style={{marginTop: '15px'}}>Du kannst nun zum <button
                        className={css.responseButtonAccept}
                        style={{marginLeft: '0', marginRight: '0'}}
                        onClick={() => nextStep()}
                    >nächsten Level</button> gehen.</p>
                </div>);
        }

        if (checkUserMadeErrors(testResults)) {
            return (
                <div className={css.responseTextArea}>
                    <p>Hoppla, anscheinend haben sich noch weitere Fehler eingeschlichen!</p>
                    <p>Du kannst jederzeit <span style={{color: '#62A4FFFF', fontWeight: 'bold'}}>Euli fragen</span> oder das Projekt <span style={{color: '#ff5a57', fontWeight: 'bold'}}>zurücksetzen</span>.</p>
                    <p style={{marginTop: '15px', gap: '10px'}}>
                        <button
                            className={css.responseButtonTestResults}
                            onClick={() => {
                                setCurPage(PAGE_TEST_RESULTS); setResponseType(RESPONSE_DEFAULT);
                            }}
                        >Testergebnisse</button>
                        <button
                            className={css.responseButtonNext}
                            onClick={() => setResponseType(RESPONSE_DEFAULT)}
                        >Schließen</button>
                    </p>
                </div>);
        }
        return (
            <div className={css.responseTextArea}>
                <p>Huch! Da sind noch nicht alle eingebauten Fehler behoben.</p>
                <p>Wenn du Hilfe brauchst, klicke auf <span style={{color: '#62A4FFFF', fontWeight: 'bold'}}>Frag Euli </span>.</p>

                <div style={{marginTop: '15px'}}>
                    <button
                        className={css.responseButtonNext}
                        onClick={() => setResponseType(RESPONSE_DEFAULT)}
                    >Schließen</button>
                    <button
                        className={css.responseButtonTestResults}
                        onClick={() => {
                            setCurPage(PAGE_TEST_RESULTS); setResponseType(RESPONSE_DEFAULT);
                        }}
                    >Testergebnisse</button>
                </div>
            </div>);

    };

    // TODO gehört in den reducer
    const [isGeneratingHint, setIsGeneratingHint] = useState(true);
    const [finishedAnswer, setFinishedAnswer] = useState(false);
    const [shuffledOptionIndexes, setShuffledOptionIndexes] = useState(generateRandomIndexes());
    const hintRequestIdRef = useRef(0);
    const [llmDuration, setLlmDuration] = useState(-1);
    const [hint, setHint] = useState({
        problemText: '',
        solutionOptions: [
            {id: 'A', code: '', isCorrect: true, explanation: ''},
            {id: 'B', code: '', isCorrect: false, explanation: ''},
            {id: 'C', code: '', isCorrect: false, explanation: ''}
        ]
    });

    const requestHint = fastMode => {
        setShuffledOptionIndexes(generateRandomIndexes());
        setCurPage(PAGE_HELP);
        setIsGeneratingHint(true);
        setFinishedAnswer(false);

        const result = testResults.details.find(e => e.testId === curTestDetails)?.prompt;
        const passedDescriptions = testResults.details
            .filter(e => e.result === 'pass')
            .map(e => e.prompt)
            .join('; ');

        const myRequestId = ++hintRequestIdRef.current;
        let firstChunkLogged = false;

        logging.logClickEvent('BUTTON', new Date(), 'OPEN_HELP_PAGE', null);

        if (tutorialConfig.classic.llmHintsEnabled) {
            const startTime = performance.now();
            setLlmDuration(-1);
            HintGenerator.generateHint(vm.toJSON(), result, passedDescriptions, vm.getLocale(), fastMode, h => {
                if (hintRequestIdRef.current !== myRequestId) return;
                setHint(h);
                setIsGeneratingHint(false);
                if (!firstChunkLogged) {
                    firstChunkLogged = true;
                    const tFirst = performance.now() - startTime;
                    setLlmDuration(tFirst);
                }
            })
                .finally(hint1 => {
                    if (hintRequestIdRef.current !== myRequestId) return;
                    setIsGeneratingHint(false);
                })
                .catch(err => console.log(err));
        }
    };


    function generateRandomIndexes () {
        const arr = [0, 1, 2];

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }


    const renderPage = () => {
        if (reachedLastStep) {
            return (
                <FinalStep
                    tutorialMessages={tutorialMessages}
                    guiMessages={guiMessages}
                    onBackToTutorialSelection={() => onBackToTutorialSelection()}
                    tutorialPoints={tutorialPoints}
                />
            );
        }

        switch (curPage) {
        case PAGE_OVERVIEW:
            return (<OverviewPage
                contentType={contentType}
                isLoading={isLoading}
                isShowingQuickHandle={isShowingQuickHandle}
                isDebuggingTutorial={isDebuggingTutorial}
                showControlOverview={showControlOverview}
                setContentType={setContentType}
                setLoading={setLoading}
                onStartAfterHold={startTests => {
                    if (isDebuggingTutorial) {
                        setCurPage(PAGE_RESPONSE);
                    } else {
                        setCurPage(PAGE_TEST_RESULTS);
                        if (startTests) onStartTests();
                    }
                    showQuickHandle();
                }}
                getBorderColor={getBorderColor}
                guiMessages={guiMessages}
                tutorialMessages={tutorialMessages}
                overviewStep={overviewStep}
                tutorialIndexData={tutorialIndexData}
                isErrorInfoVisible={isErrorInfoVisible}
                showErrorInfo={showErrorInfo}
            />);
        case PAGE_RESPONSE:
            return (<ResponsePage
                guiMessages={guiMessages}
                isDebuggingTutorial={isDebuggingTutorial}
                responseType={responseType}
                testResults={testResults}
                setCurPage={setCurPage}
                setResponseType={setResponseType}
                onOpenHelp={onOpenHelp}
                PAGE_TEST_RESULTS={PAGE_TEST_RESULTS}
                getResponse={getResponse}
                onClickTest={() => {
                    setCurPage(PAGE_TEST_RESULTS); onStartTests();
                }}
            />);
        case PAGE_TEST_RESULTS:
            return (<TestResults
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
                openHelpPage={() => requestHint(true)}
                tutorialMessages={tutorialMessages}
            />);
        case PAGE_HELP:
            return (
                <TutorialHelpPage
                    help={hint}
                    isGeneratingHint={isGeneratingHint}
                    onFinishedAnswer={() => setFinishedAnswer(true)}
                    finishedAnswer={finishedAnswer}
                    locale={props.locale}
                    guiMessages={guiMessages}
                    removeTutorialPoint={removeTutorialPoint}
                    shuffledOptionIndexes={shuffledOptionIndexes}
                    logResponse={testHistory => logResponse(hint, curTestDetails, testHistory, llmDuration)}
                    vm={vm}
                />
            );
        }
    };


    return (<>
        <img
            src={bubbleIndicatorBlue}
            style={{display: 'none'}}
            alt={'preload'}
        />
        <img
            src={bubbleIndicatorGray}
            style={{display: 'none'}}
            alt={'preload'}
        />
        <img
            src={bubbleIndicator}
            style={{display: 'none'}}
            alt={'preload'}
        />

        {curPage === PAGE_RESPONSE && <div
            className={css.leftButton}
            onClick={() => setCurPage(PAGE_OVERVIEW)}
        >
            <img
                src={leftArrow}
                alt="Next"
                draggable={false}
            />
        </div>}
        {curPage === PAGE_TEST_RESULTS && <div
            className={css.leftButton}
            onClick={() => {
                if (isDebuggingTutorial) {
                    setCurPage(PAGE_RESPONSE);
                } else {
                    setCurPage(PAGE_OVERVIEW);
                } if (testResults?.passed) {
                    setResponseType(RESPONSE_TESTING_FINISHED);
                } else {
                    setResponseType(RESPONSE_DEFAULT);
                }
            }}
        >
            <img
                src={leftArrow}
                alt="Next"
                draggable={false}
            />
        </div>}
        {curPage === PAGE_HELP && <div
            className={css.leftButton}
            onClick={() => {
                setCurPage(PAGE_TEST_RESULTS);
            }}
        >
            <img
                src={leftArrow}
                alt="Next"
                draggable={false}
            />
        </div>}
        {renderPage()}
    </>);
};

DebuggingTutorialStep.propTypes = {
    onOpenHelp: PropTypes.func.isRequired,
    step: PropTypes.number,
    onStartTests: PropTypes.func,
    onReset: PropTypes.func
};

export default DebuggingTutorialStep;

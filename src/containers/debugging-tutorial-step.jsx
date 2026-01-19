import React from 'react';
import {connect} from 'react-redux';

import {
    onTestDetails,
    resetStep,
    setCodeResetPoint,
    setContentType,
    setCurPage,
    setCurTestDetails,
    setHelpType,
    setLastTutorial,
    setLoading,
    setLoadingProject,
    setResponseType,
    showErrorInfo,
    showQuickHandle,
    updateTestResults,
    setLastTestedProject,
    setHasCodeUpdated,
    setTestPageIndex,
    setSelectedSprite,
    setCurTestRuns,
} from "../reducers/debugging-tutorial-step";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/tutorial-step/debuggingTutorialStep.jsx';
import PropTypes from "prop-types";
import VirtualMachine from "scratch-vm";

import {lock, unlock} from '../reducers/vm-status';
import {spriteUpload} from "../lib/file-uploader";
import {runTest2} from "tutorial-tests/src/test-runner/test-runner";

import logging from 'scratch-vm/src/util/logging.js';
import {logTutorialScore} from "../components/debuggingTutorial/tutorial-step/tutorial-step-util.jsx";



const RESPONSE_TESTING_FINISHED = 'scratch-gui/debugging-tutorial-cards/RESPONSE_TESTING_FINISHED'; //TODO REMOVE

class DebuggingTutorialStep extends React.Component {
    constructor(props) {
        super(props);
        this.onTest = this.onTest.bind(this);
        this.onNextStep = this.onNextStep.bind(this);
        this.addSprite = this.addSprite.bind(this);
        this.convertToBuffer = this.convertToBuffer.bind(this);
        this.checkForCodeUpdate = this.checkForCodeUpdate.bind(this);
        this.onIncreaseTestPageIndex = this.onIncreaseTestPageIndex.bind(this);
        this.getSprites = this.getSprites.bind(this);
        this.requestHints = this.requestHints.bind(this)
        this.litterboxWebURL = 'https://scratch.fim.uni-passau.de/'; // localhost default: http://localhost:8080

        this.interval = null;
    }

    onTest() {
        if (logging.isActive()) {
            logging.logClickEvent('ICON', new Date(), 'START_TESTS', null);
            logging.pauseLogging(true);
        }
        //this.props.setMouseEnabled(false);
        //this.requestHints();
        this.props.setLoadingProject("TEST");
        this.props.lockVM();

        if (this.props.curTestRuns === 3) {
            this.props.setTutorialPoints(this.props.tutorialPoints - 1);
        }
        this.props.setCurTestRuns(this.props.curTestRuns + 1);

        //logging.logClickEvent('BUTTON', new Date(), 'CHECK_CODE_QUALITY2', null);




       // this.props.setLastTestedProject(this.props.vm.toJSON());

        runTest2(this.props.vm, this.props.tutorialIndexData.testId, this.props.step, (update) => {
            this.props.updateTestResults(update);
        }).then(finalResult => {
            this.props.updateTestResults(finalResult);
        }).finally(() => {
            this.props.unlockVM();
            this.props.setLoadingProject("TEST_PAUSE"); //TODO REMOVE!
            if (this.props.curPage !== "TEST_RESULTS") { //Wenn bereits in TestResults, dann braucht man keine Antwort von Euli in der Übersicht
                this.props.setResponseType(RESPONSE_TESTING_FINISHED);
            } else if (this.props.testResults?.passed) {
                this.props.setResponseType(RESPONSE_TESTING_FINISHED);
            }
            this.props.setHasCodeUpdated(true);
            this.delayTestPause();
            this.props.vm.start();
            this.restartProject();
            //this.props.setMouseEnabled(true);
            //logging.pauseLogging(false);
        });




/*
        const summary = runTest(this.props.vm, this.props.tutorialIndexData.testId, this.props.step)
            .catch(error => {console.log(`Test execution crashed: ${error}`);
        });
        summary.then(result => {
            this.props.updateTestResults(result);
            this.props.unlockVM();
        }).finally(() => {
            this.props.unlockVM();
            this.props.setLoadingProject("TEST_PAUSE"); //TODO REMOVE!
            if (this.props.curPage !== "TEST_RESULTS") { //Wenn bereits in TestResults, dann braucht man keine Antwort von Euli in der Übersicht
                this.props.setResponseType(RESPONSE_TESTING_FINISHED);
            } else if (this.props.testResults.passed) {
                this.props.setResponseType(RESPONSE_TESTING_FINISHED);
            }
            this.props.setHasCodeUpdated(false);
            this.delayTestPause();
        });*/
    }

    async restartProject() {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await sleep(200);
        this.props.vm.greenFlag();
        await sleep(500);
        this.props.vm.stopAll();
    }

    async delayTestPause() {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await sleep(2000);
        await this.props.setLoadingProject(null);
        await logging.pauseLogging(false);
    }

    onNextStep() {
        if (logging.isActive()) {
            logging.logClickEvent('ICON', new Date(), 'NEXT_STEP', null);
            logging.pauseLogging(true);
        }

        this.props.setTutorialPoints(this.props.tutorialPoints + 3); //Add 3 points
        this.props.setLoadingProject("NEXT");
        this.props.resetStep();

        if (this.props.step + 1 !== this.props.tutorialIndexData.totalSteps) {

            if (this.props.isDebuggingTutorial) {
                const projectDataExists = this.props.tutorialIndexData["project" + (this.props.step + 2).toString()];

                if (projectDataExists) {
                    this.props.vm.start();
                    this.props.vm.clear();
                    this.props.lockVM();
                    this.props.vm.loadProject(this.props.tutorialIndexData["project" + (this.props.step + 2).toString()])
                        .catch(e => console.log("Error while loading project: " + e.toString()))
                        .finally(() => {
                            this.props.unlockVM();
                            this.props.setLoadingProject(null);
                        });
                }
            } else {
                const keys = Object.keys(this.props.tutorialIndexData).filter((key) =>
                    key.startsWith("step" + (this.props.step + 2).toString() + "_Costume")
                );

                const promises = keys.map(async (key) => {
                    const costumeKey = key.split('_')[1].toLowerCase();
                    const costume = this.props.tutorialIndexData[key];

                    const stepKey = "step" + (this.props.step + 2).toString();
                    const stepMessages = this.props.tutorialMessages?.[stepKey];


                    if (!stepMessages || !stepMessages[costumeKey]) return;

                    const name = stepMessages[costumeKey].name;
                    const size = stepMessages[costumeKey].size;

                    await this.addSprite(costume, name, size);
                });

                // Warte auf alle .addSprite() Aufrufe
                Promise.all(promises).then(() => {
                    console.log("added all sprites!");
                    this.props.vm.start();

                    this.setSavepoint();
                    this.delayTestPause(); // Resumes logging
                });
            }

        }
        logTutorialScore(this.props.tutorialPoints + 3, this.props.tutorialMessages?.title + "_" + (this.props.step + 1))
        this.props.onIncreaseStep();
    }


    async setSavepoint() {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await sleep(1000);
        await this.props.setCodeResetPoint(this.props.vm.toJSON());
    }





// Handle Sprite Upload ohne Benutzerinteraktion
    addSprite(sprite, title, size) {
        const storage = this.props.vm.runtime.storage;
        const fileType = 'image/png';
        this.convertToBuffer(sprite).then(r => spriteUpload(r, fileType, title, storage, newSprite => {
                const spriteJSON = this.setSpriteAttributes(newSprite, title, size);
                this.props.vm.addSprite(spriteJSON).catch(e => console.log(e));
            }, () => console.log("fertig 31"))
        );
    };

    setSpriteAttributes(sprite, name, size) {
        const spriteJSON = JSON.parse(sprite);
        spriteJSON.name = name;
        spriteJSON.size = size;
        return JSON.stringify(spriteJSON);
    }

    async convertToBuffer(sprite) {
        try {
            const response = await fetch(sprite);
            return await response.arrayBuffer();
        } catch (error) {
            console.error('Error fetching the image:', error);
        }
    }

    onResetProject() {
        this.props.setLoadingProject("RESET");
        this.props.vm.start();
        this.props.vm.clear();
        this.props.lockVM();

        let data;

        if (this.props.codeResetPoint !== null) {
            data = this.props.codeResetPoint;
        } else {
            data = this.props.tutorialIndexData["project" + (this.props.step + 1).toString()];
        }

        this.props.vm.loadProject(data)
            .catch(e => console.log("Error while resetting project: " + e.toString()))
            .finally(() => {
                this.props.unlockVM();
                this.props.setLoadingProject(null);});
    }

    componentDidMount() {
        if (this.props.lastTutorial === null) {
            this.props.setLastTutorial(JSON.stringify(this.props.tutorialMessages));
        } else {
            if (JSON.stringify(this.props.tutorialMessages) !== this.props.lastTutorial) {
                this.props.setLastTutorial(JSON.stringify(this.props.tutorialMessages));
                this.props.resetStep();
            }
        }
        /* this.interval = setInterval(() => {
             this.checkForCodeUpdate();
         }, 1000);
         console.log("Started updating!");*/
    }






    requestHints() {
        const program = this.props.vm.toJSON();
        const url = `${this.litterboxWebURL}/litterbox/analyse.php`; // /tutorial-system/generate-feedback
        let detectors = 'default';
        if (this.props.detectors) {
            detectors = this.props.detectors;
        }
        const language = this.props.locale === 'de' ? 'de' : 'en';
        const jsonBody = JSON.stringify({
            language: language, detectors: detectors, program: program
        });
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonBody,
            referrerPolicy: 'origin-when-cross-origin'
        })
            .then(response => response.json())
            .then(problems => {
                const result = problems.map(hint => ({
                    title: hint.name,
                    description: hint.hint,
                    sprite: hint.sprite,
                    costume: hint.costume,
                    type: hint.type,
                    codeSnippet: hint.scratchBlocksCode
                }));
                console.log(result);
            })
            // ignore errors to avoid crashing the tutorial tab
            // eslint-disable-next-line no-unused-vars
            .catch(ignored => {console.log("Cached! " + ignored.toString())});
    }



    componentWillUnmount() {
        clearInterval(this.interval); // Wichtig, sonst bleibt das Intervall aktiv!
    }

    checkForCodeUpdate() {
        if (this.props.curPage === "TEST_RESULTS" && this.props.projectLoadingState !== "TEST") { //Only check while the user sees their test-results
            //this.props.setHasCodeUpdated((this.props.vm.toJSON() !== this.props.lastTestedProject)); TODO Removed for performance reasons
        }
    }

    onIncreaseTestPageIndex(amount) {
        const newIndex = this.props.testPageIndex + amount;
        this.props.setTestPageIndex(Math.max(newIndex, 0));
    }

    /**
     * Returns the keys of all current Sprites (up until this step)
     */
    getSprites() {
        const maxStep = this.props.step + 1;

        return Object.keys(this.props.tutorialIndexData).filter((key) => {
            const match = key.match(/^step(\d+)_Costume/);
            if (match) {
                const stepNumber = parseInt(match[1], 10);
                return stepNumber >= 1 && stepNumber <= maxStep;
            }
            return false;
        });
    }

    render () {
        const reachedLastStep = (this.props.step === this.props.stepCount);
        const overviewStep = "overviewStep".concat((this.props.step + 1).toString());
        const showControlOverview = this.props.tutorialMessages?.["overviewStep" + (this.props.step + 1).toString()]?.controlImage1 != null;

        return( <DebuggingTutorialStepComponent
                onStartTests={() => this.onTest()}
                nextStep={() => this.onNextStep()}
                onResetProject={() => this.onResetProject()}
                reachedLastStep={reachedLastStep}
                showControlOverview={showControlOverview}
                overviewStep={overviewStep}
                onIncreaseTestPageIndex={() => this.onIncreaseTestPageIndex(1)}
                onDecreaseTestPageIndex={() => this.onIncreaseTestPageIndex(-1)}
                sprites={() => this.getSprites()}
                removeTutorialPoint={() => this.props.setTutorialPoints(this.props.tutorialPoints - 1)}
                {...this.props}
            />
        );
    }
}

DebuggingTutorialStep.propTypes = {
    onOpenHelp: PropTypes.func,
    tutorialMessages: PropTypes.any,
    step: PropTypes.number,
    startTests: PropTypes.func,
    showErrorInfo: PropTypes.func,
    projectFiles: PropTypes.any,
    updateTestResults: PropTypes.func,
    testResults: PropTypes.any,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    onIncreaseStep: PropTypes.func,
    nextStep: PropTypes.func,
    resetStep: PropTypes.func,
    lockVM: PropTypes.func,
    unlockVM: PropTypes.func,
    showReset: PropTypes.bool,
    showResetOptions: PropTypes.func,
    stepCount: PropTypes.number,
    setLoading: PropTypes.func,
    setLoadingProject: PropTypes.func,
    tutorialIndexData: PropTypes.any,
    lastTutorial: PropTypes.any,
    setLastTutorial: PropTypes.func,
    setContentType: PropTypes.func,
    contentType: PropTypes.any,
    setResponseType: PropTypes.func,
    responseType: PropTypes.any,
    setCurPage: PropTypes.func,
    curPage: PropTypes.any,
    isShowingQuickHandle: PropTypes.any,
    showQuickHandle: PropTypes.func,
    setCurTestDetails: PropTypes.func,
    curTestDetails: PropTypes.string,
    isDebuggingTutorial: PropTypes.bool,
    showControlOverview: PropTypes.bool,
    overviewStep: PropTypes.string,
    toJson: PropTypes.func,
    locale: PropTypes.string.isRequired,
    detectors: PropTypes.string,
    setHelpType: PropTypes.func,
    helpType: PropTypes.string,
    onBackToTutorialSelection: PropTypes.func,
    setCodeResetPoint: PropTypes.func,
    codeResetPoint: PropTypes.any,
    lastTestedProject: PropTypes.any,
    setLastTestedProject: PropTypes.func,
    setHasCodeUpdated: PropTypes.func,
    hasCodeUpdated: PropTypes.bool,
    setTestPageIndex: PropTypes.func,
    testPageIndex: PropTypes.number,
    guiMessages: PropTypes.any,
    sprites: PropTypes.any,
    setSelectedSprite: PropTypes.func,
    selectedSprite: PropTypes.string,
    projectLoadingState: PropTypes.string,
    setMouseEnabled: PropTypes.func,
    setTutorialPoints: PropTypes.func,
    tutorialPoints: PropTypes.number,
    removeTutorialPoint: PropTypes.func,
    setCurTestRuns: PropTypes.func,
    curTestRuns: PropTypes.number,
};

const mapStateToProps = state => ({
    isErrorInfoVisible: state.scratchGui.debuggingTutorialStep.isErrorInfoVisible,
    testResults: state.scratchGui.debuggingTutorialStep.testResults,
    showTestDetail: state.scratchGui.debuggingTutorialStep.showTestDetail,
    showReset: state.scratchGui.debuggingTutorialStep.showReset,
    isLoading: state.scratchGui.debuggingTutorialStep.isLoading,
    projectLoadingState: state.scratchGui.debuggingTutorialStep.projectLoadingState,
    lastTutorial: state.scratchGui.debuggingTutorialStep.lastTutorial,
    contentType: state.scratchGui.debuggingTutorialStep.contentType,
    responseType: state.scratchGui.debuggingTutorialStep.responseType,
    curPage: state.scratchGui.debuggingTutorialStep.page,
    isShowingQuickHandle: state.scratchGui.debuggingTutorialStep.isShowingQuickHandle,
    curTestDetails: state.scratchGui.debuggingTutorialStep.curTestDetails,
    toJson: state.scratchGui.vm.toJSON.bind(state.scratchGui.vm),
    locale: state.locales.locale,
    helpType: state.scratchGui.debuggingTutorialStep.helpType,
    codeResetPoint: state.scratchGui.debuggingTutorialStep.codeResetPoint,
    lastTestedProject: state.scratchGui.debuggingTutorialStep.lastTestedProject,
    hasCodeUpdated: state.scratchGui.debuggingTutorialStep.hasUpdated,
    testPageIndex: state.scratchGui.debuggingTutorialStep.testPageIndex,
    selectedSprite: state.scratchGui.debuggingTutorialStep.selectedSprite,
    curTestRuns: state.scratchGui.debuggingTutorialStep.curTestRuns,
});

const mapDispatchToProps = dispatch => ({
    showErrorInfo: () => dispatch(showErrorInfo()),
    resetStep: () => dispatch(resetStep()),
    updateTestResults: (results) => dispatch(updateTestResults(results)),
    onTestDetails: () => dispatch(onTestDetails()),
    lockVM: () => dispatch(lock()),
    unlockVM: () => dispatch(unlock()),
    setLoading: (isLoading) => dispatch(setLoading(isLoading)),
    setLoadingProject: (loadingType) => dispatch(setLoadingProject(loadingType)),
    setLastTutorial: (tutorial) => dispatch(setLastTutorial(tutorial)),
    setContentType: (contentType) => dispatch(setContentType(contentType)),
    setResponseType: (responseType) => dispatch(setResponseType(responseType)),
    setCurPage: (page) => dispatch(setCurPage(page)),
    showQuickHandle: () => dispatch(showQuickHandle()),
    setCurTestDetails: (testId) => dispatch(setCurTestDetails(testId)),
    setHelpType: (type) => dispatch(setHelpType(type)),
    setCodeResetPoint: (project) => dispatch(setCodeResetPoint(project)),
    setLastTestedProject: (newCode) => dispatch(setLastTestedProject(newCode)),
    setHasCodeUpdated: (value) => dispatch(setHasCodeUpdated(value)),
    setTestPageIndex: (index) => dispatch(setTestPageIndex(index)),
    setSelectedSprite: (key) => dispatch(setSelectedSprite(key)),
    setCurTestRuns: (runs) => dispatch(setCurTestRuns(runs)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialStep);

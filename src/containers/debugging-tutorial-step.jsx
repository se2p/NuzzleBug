import React from 'react';
import {connect} from 'react-redux';

import {
    addDownloaded,
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
    setQualityResults,
    setResponseType,
    showErrorInfo,
    showQuickHandle,
    updateTestResults,
    setLastTestedProject,
    setHasCodeUpdated,
    setTestPageIndex,
    setSelectedSprite,
} from "../reducers/debugging-tutorial-step";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/debuggingTutorialStep.jsx';
import PropTypes from "prop-types";
import VirtualMachine from "scratch-vm";

import {lock, unlock} from '../reducers/vm-status';
import {runTest} from "tutorial-tests";
import downloadBlob from "../lib/download-blob";
import bootImage from "../components/debuggingTutorial/images/owlTransparent.png";
import {spriteUpload} from "../lib/file-uploader";

const RESPONSE_TESTING_FINISHED = 'scratch-gui/debugging-tutorial-cards/RESPONSE_TESTING_FINISHED'; //TODO REMOVE

class DebuggingTutorialStep extends React.Component {
    constructor(props) {
        super(props);
        this.onTest = this.onTest.bind(this);
        this.onNextStep = this.onNextStep.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.requestHints = this.requestHints.bind(this);
        this.addSprite = this.addSprite.bind(this);
        this.convertToBuffer = this.convertToBuffer.bind(this);
        this.hasUpdatedSinceLastTest = this.hasUpdatedSinceLastTest.bind(this);
        this.checkForCodeUpdate = this.checkForCodeUpdate.bind(this);
        this.onIncreaseTestPageIndex = this.onIncreaseTestPageIndex.bind(this);
        this.getSprites = this.getSprites.bind(this);
        this.litterboxWebURL = 'https://scratch.fim.uni-passau.de/litterbox-api'; // localhost default: http://localhost:8080

        this.interval = null;
    }

    onTest() {
        this.props.setLoadingProject("TEST");
        this.props.lockVM();

        this.props.setLastTestedProject(this.props.vm.toJSON());

        const summary = runTest(this.props.vm, this.props.tutorialIndexData.testId, this.props.step)
            .catch(error => {console.log(`Test execution crashed: ${error}`);
        });
        summary.then(result => {
            this.props.updateTestResults(result);
            this.props.unlockVM();
        }).finally(() => {
            this.props.unlockVM();
            this.props.setLoadingProject(null); //TODO REMOVE!
            this.props.setResponseType(RESPONSE_TESTING_FINISHED);
            this.props.setHasCodeUpdated(false);
        });
    }

    onNextStep() {
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
                    console.log("ZZZZZ: " + costumeKey + " , " + "step" + (this.props.step + 2).toString());
                    const costume = this.props.tutorialIndexData[key];
                    await this.addSprite(costume, this.props.tutorialMessages["step" + (this.props.step + 2).toString()][costumeKey]["name"], this.props.tutorialMessages["step" + (this.props.step + 2).toString()][costumeKey]["size"]);
                });

                // Warte auf alle .addSprite() Aufrufe
                Promise.all(promises).then(() => {
                    console.log("added all sprites!");
                    this.props.vm.start();

                    this.setSavepoint();
                });
            }

        }
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





    requestHints() {
        const program = this.props.toJson();
        const url = `${this.litterboxWebURL}/tutorial-system/generate-feedback`;
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

                this.props.setQualityResults(result);
            })
            // ignore errors to avoid crashing the tutorial tab
            // eslint-disable-next-line no-unused-vars
            .catch(ignored => {console.log("Cached! " + ignored.toString())});
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

        console.log("resetting: " + data);

        this.props.vm.loadProject(data)
            .catch(e => console.log("Error while resetting project: " + e.toString()))
            .finally(() => {
                this.props.unlockVM();
                this.props.setLoadingProject(null);});
    }


    handleDownload (name, content) {
        const img = new Image();
        img.src = content;
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');

        img.onload = function () {
            c.width = this.naturalWidth;
            c.height = this.naturalHeight;
            ctx.drawImage(this, 0, 0);
            c.toBlob(blob => {
                downloadBlob(name.concat('.png'), blob);
            }, 'image/png', 1);
        };
        this.props.addDownloaded(name);
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

        this.interval = setInterval(() => {
            this.checkForCodeUpdate();
        }, 1000);
        console.log("Started updating!");
    }

    componentWillUnmount() {
        clearInterval(this.interval); // Wichtig, sonst bleibt das Intervall aktiv!
        console.log("Stopped updating!");
    }


    hasUpdatedSinceLastTest () {
         //= (this.props.vm.toJSON() === this.props.lastTestedProject);

    }

    checkForCodeUpdate() { //TODO inline
        if (this.props.curPage === "TEST_RESULTS") { //Only check while the user sees their test-results
            this.props.setHasCodeUpdated((this.props.vm.toJSON() !== this.props.lastTestedProject));
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
        const showControlOverview = this.props.tutorialMessages?.["overviewStep" + (this.props.step + 1).toString()]?.controlImage1 !== null;
        const showDownloadsOverview = this.props.tutorialMessages?.["overviewStep" + (this.props.step + 1).toString()]?.download1 !== null;
console.log(this.props.selectedSprite);
        return( <DebuggingTutorialStepComponent
                onStartTests={() => this.onTest()}
                nextStep={() => this.onNextStep()}
                onResetProject={() => this.onResetProject()}
                reachedLastStep={reachedLastStep}
                onDownload={(name, content) => this.handleDownload(name, content)}
                showControlOverview={showControlOverview}
                overviewStep={overviewStep}
                showDownloadsOverview={showDownloadsOverview}
                curQualityResult={this.props.qualityResults?.at(0)}
                hasUpdatedSinceLastTest={() => this.hasUpdatedSinceLastTest()}
                hasUpdatedSinceLastTest2={this.props.hasCodeUpdated}
                onIncreaseTestPageIndex={() => this.onIncreaseTestPageIndex(1)}
                onDecreaseTestPageIndex={() => this.onIncreaseTestPageIndex(-1)}
                sprites={this.getSprites()}
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
    onDownload: PropTypes.func,
    addDownloaded: PropTypes.func,
    downloaded: PropTypes.any,
    isDebuggingTutorial: PropTypes.bool,
    showControlOverview: PropTypes.bool,
    overviewStep: PropTypes.string,
    showDownloadsOverview: PropTypes.bool,
    toJson: PropTypes.func,
    locale: PropTypes.string.isRequired,
    detectors: PropTypes.string,
    setQualityResults: PropTypes.func,
    qualityResults: PropTypes.array,
    curQualityResult: PropTypes.array,
    setHelpType: PropTypes.func,
    helpType: PropTypes.string,
    onBackToTutorialSelection: PropTypes.func,
    setCodeResetPoint: PropTypes.func,
    codeResetPoint: PropTypes.any,
    lastTestedProject: PropTypes.any,
    setLastTestedProject: PropTypes.func,
    hasUpdatedSinceLastTest: PropTypes.func, //TODO REMOVE
    hasUpdatedSinceLastTest2: PropTypes.bool,
    setHasCodeUpdated: PropTypes.func,
    hasCodeUpdated: PropTypes.bool,
    setTestPageIndex: PropTypes.func,
    testPageIndex: PropTypes.number,
    guiMessages: PropTypes.any,
    sprites: PropTypes.any,
    setSelectedSprite: PropTypes.func,
    selectedSprite: PropTypes.string
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
    downloaded: state.scratchGui.debuggingTutorialStep.downloaded,
    toJson: state.scratchGui.vm.toJSON.bind(state.scratchGui.vm),
    locale: state.locales.locale,
    qualityResults: state.scratchGui.debuggingTutorialStep.qualityResults,
    helpType: state.scratchGui.debuggingTutorialStep.helpType,
    codeResetPoint: state.scratchGui.debuggingTutorialStep.codeResetPoint,
    lastTestedProject: state.scratchGui.debuggingTutorialStep.lastTestedProject,
    hasCodeUpdated: state.scratchGui.debuggingTutorialStep.hasUpdated,
    testPageIndex: state.scratchGui.debuggingTutorialStep.testPageIndex,
    selectedSprite: state.scratchGui.debuggingTutorialStep.selectedSprite,
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
    addDownloaded: (addedName) => dispatch(addDownloaded(addedName)),
    setQualityResults: (results) => dispatch(setQualityResults(results)),
    setHelpType: (type) => dispatch(setHelpType(type)),
    setCodeResetPoint: (project) => dispatch(setCodeResetPoint(project)),
    setLastTestedProject: (newCode) => dispatch(setLastTestedProject(newCode)),
    setHasCodeUpdated: (value) => dispatch(setHasCodeUpdated(value)),
    setTestPageIndex: (index) => dispatch(setTestPageIndex(index)),
    setSelectedSprite: (key) => dispatch(setSelectedSprite(key)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialStep);

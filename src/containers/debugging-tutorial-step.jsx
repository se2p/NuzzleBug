import React from 'react';
import {connect} from 'react-redux';

import {
    resetStep,
    showErrorInfo,
    updateTestResults,
    onTestDetails,
    setLoading,
    setLoadingProject,
    setLastTutorial,
    setContentType,
    setResponseType,
    setCurPage,
    showQuickHandle,
} from "../reducers/debugging-tutorial-step";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/debuggingTutorialStep.jsx';
import PropTypes from "prop-types";
import VirtualMachine from "scratch-vm";

import {lock, unlock} from '../reducers/vm-status';
import {runTest} from "tutorial-tests";

const RESPONSE_TESTING_FINISHED = 'scratch-gui/debugging-tutorial-cards/RESPONSE_TESTING_FINISHED'; //TODO REMOVE

class DebuggingTutorialStep extends React.Component {
    constructor(props) {
        super(props);
        this.onTest = this.onTest.bind(this);
        this.onNextStep = this.onNextStep.bind(this);
    }

    onTest() {
        this.props.setLoadingProject("TEST");
        this.props.lockVM();
        const summary = runTest(this.props.vm, this.props.tutorialMessages.testId, this.props.step)
            .catch(error => {console.log(`Test execution crashed: ${error}`);
        });
        summary.then(result => {
            this.props.updateTestResults(result);
            this.props.unlockVM();
        }).finally(() => {
            this.props.unlockVM();
            this.props.setLoadingProject(null); //TODO REMOVE!
            this.props.setResponseType(RESPONSE_TESTING_FINISHED);
        });
    }

    onNextStep() {
        this.props.setLoadingProject("NEXT");
        this.props.resetStep();

        if (this.props.step + 1 !== this.props.tutorialIndexData.totalSteps) {
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

        this.props.onIncreaseStep();
    }

    onResetProject() {
        this.props.setLoadingProject("RESET");
        this.props.vm.start();
        this.props.vm.clear();
        this.props.lockVM();
        this.props.vm.loadProject(this.props.tutorialIndexData["project" + (this.props.step + 1).toString()])
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
    }

    render () {
        console.log("KOKOKOKOKOK " + JSON.stringify(this.props.tutorialIndexData));
        const reachedLastStep = (this.props.step === this.props.stepCount);
        return (
            <DebuggingTutorialStepComponent
                onStartTests={() => this.onTest()}
                nextStep={() => this.onNextStep()}
                onResetProject={() => this.onResetProject()}
                reachedLastStep={reachedLastStep}
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
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialStep);

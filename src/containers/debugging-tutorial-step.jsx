import React from 'react';
import {connect} from 'react-redux';

import {resetStep, errorClicked, updateTestResults, onTestDetails, setLoading, setLoadingProject} from "../reducers/debugging-tutorial-step";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/debuggingTutorialStep.jsx';
import PropTypes from "prop-types";
import VirtualMachine from "scratch-vm";

import {lock, unlock} from '../reducers/vm-status';
import {runTest} from "tutorial-tests";



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
            this.props.setLoadingProject(null);
        });
    }

    onNextStep() {
        this.props.setLoadingProject("NEXT");
        this.props.resetStep();
        this.props.vm.start();
        this.props.vm.clear();
        this.props.lockVM();
        this.props.vm.loadProject(this.props.tutorialIndexData["project" + (this.props.step + 2).toString()])
            .catch(e => console.log("Error while loading project: " + e.toString())) //TODO Stop loading on end
            .finally(() => {
                this.props.unlockVM();
                this.props.setLoadingProject(null);
            });
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

    render () {
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
    onErrorClicked: PropTypes.func,
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
};

const mapStateToProps = state => ({
    isErrorInfoVisible: state.scratchGui.debuggingTutorialStep.isErrorInfoVisible,
    testResults: state.scratchGui.debuggingTutorialStep.testResults,
    showTestDetail: state.scratchGui.debuggingTutorialStep.showTestDetail,
    showReset: state.scratchGui.debuggingTutorialStep.showReset,
    isLoading: state.scratchGui.debuggingTutorialStep.isLoading,
    projectLoadingState: state.scratchGui.debuggingTutorialStep.projectLoadingState,
});

const mapDispatchToProps = dispatch => ({
    onErrorClicked: () => dispatch(errorClicked()),
    resetStep: () => dispatch(resetStep()),
    updateTestResults: (results) => dispatch(updateTestResults(results)),
    onTestDetails: () => dispatch(onTestDetails()),
    lockVM: () => dispatch(lock()),
    unlockVM: () => dispatch(unlock()),
    setLoading: (isLoading) => dispatch(setLoading(isLoading)),
    setLoadingProject: (loadingType) => dispatch(setLoadingProject(loadingType)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialStep);

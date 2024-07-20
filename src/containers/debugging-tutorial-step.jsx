import React from 'react';
import {connect} from 'react-redux';

import {resetStep, errorClicked, updateTestResults, onTestDetails, setLoading} from "../reducers/debugging-tutorial-step";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/debuggingTutorialStep.jsx';
import PropTypes from "prop-types";
import VirtualMachine from "scratch-vm";

import {lock, unlock} from '../reducers/vm-status';
import {runTest} from 'tutorial-tests';
import asdProject from '!arraybuffer-loader!../components/debuggingTutorial/testProject/Scratch-Projekt(1).sb3';



class DebuggingTutorialStep extends React.Component {
    constructor(props) {
        super(props);
        this.onTest = this.onTest.bind(this);
        this.onNextStep = this.onNextStep.bind(this);
    }


    onTest() {
        this.props.lockVM();
        const summary = runTest(this.props.vm, "testTutorial", 0).catch(error => {
            console.log(`Test execution crashed: ${error}`);
            this.props.unlockVM();
        });
        summary.then(result => {
            this.props.updateTestResults(result);
            this.props.unlockVM();
        });
    }

    onNextStep() {
        this.props.resetStep();
        this.props.onIncreaseStep();
        this.myRef.scrollTop = 0;
    }

    onResetProject() {
        this.props.vm.loadProject(asdProject);
    }

    render () {
        return (
            <DebuggingTutorialStepComponent
                onStartTests={() => this.onTest()}
                nextStep={() => this.onNextStep}
                onResetProject={() => this.onResetProject()}
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
};

const mapStateToProps = state => ({
    isErrorInfoVisible: state.scratchGui.debuggingTutorialStep.isErrorInfoVisible,
    testResults: state.scratchGui.debuggingTutorialStep.testResults,
    showTestDetail: state.scratchGui.debuggingTutorialStep.showTestDetail,
    showReset: state.scratchGui.debuggingTutorialStep.showReset,
    isLoading: state.scratchGui.debuggingTutorialStep.isLoading,
});

const mapDispatchToProps = dispatch => ({
    onErrorClicked: () => dispatch(errorClicked()),
    resetStep: () => dispatch(resetStep()),
    updateTestResults: (results) => dispatch(updateTestResults(results)),
    onTestDetails: () => dispatch(onTestDetails()),
    lockVM: () => dispatch(lock()),
    unlockVM: () => dispatch(unlock()),
    setLoading: (isLoading) => dispatch(setLoading(isLoading)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialStep);

import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import ControlsComponent from '../components/controls/controls.jsx';
import {
    ObservationState
} from '../components//interrogative-debugging/version-2/toggle-observation/toggle-observation.jsx';
import {viewCards} from '../reducers/interrogative-debugging/version-1/ir-cards.js';

import Test from 'whisker-main/whisker-main/src/test-runner/test';
import TestRunner from 'whisker-main/whisker-main/dist/src/test-runner/test-runner';
import {ModelTester} from 'whisker-main/whisker-main/dist/src/whisker/model/ModelTester';

class Controls extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleGreenFlagClick',
            'handleRunTestClick',
            'handlePauseResumeClick',
            'handleStepBack',
            'handleStepOver',
            'handleInitialStep',
            'handleInitialTestStep',
            'handleStopAllClick',
            'handleToggleObservationClick',
            'onTestDone'
        ]);
        this.observationState = props.observationActive ?
            ObservationState.ACTIVE : ObservationState.INACTIVE;

        this.testRunner = new TestRunner();
        this.testRunner.on(TestRunner.TEST_PASS, this.onTestDone);
        this.testRunner.on(TestRunner.TEST_FAIL, this.onTestDone);
        this.testRunner.on(TestRunner.TEST_ERROR, this.onTestDone);
        this.testRunner.on(TestRunner.TEST_SKIP, this.onTestDone);

        this.modelTester = new ModelTester();
    }
    handleGreenFlagClick (e) {
        e.preventDefault();

        if (this.props.projectPaused) {
            // Resets the state of the VM back to normal.
            // Otherwise we could not start execution again.
            this.resetPauseResume();
        }

        if (e.shiftKey) {
            this.props.vm.setTurboMode(!this.props.turbo);
        } else {
            if (!this.props.isStarted) {
                clearInterval(this.props.vm.runtime._steppingInterval);
                this.props.vm.runtime._steppingInterval = null;
                this.props.vm.start();
            }
            this.props.vm.greenFlag();
        }
    }
    handleRunTestClick (e) {
        e.preventDefault();

        if (this.props.whiskerTest) {
            if (this.props.projectPaused) {
                // Resets the state of the VM back to normal.
                // Otherwise we could not start execution again.
                this.resetPauseResume();
            }
            const test = this.props.whiskerTest;
            test.isRunning = true;
            test.resultStatus = null;
            this.forceUpdate();
            this.testRunner.runTests(
                this.props.vm,
                test.project,
                [test],
                this.modelTester,
                test.props,
                test.modelProps
            );
        }
    }
    onTestDone (result) {
        const test = this.props.whiskerTest;
        test.isRunning = false;
        test.resultStatus = result.status;
        this.forceUpdate();
    }
    handleStepBack (e) {
        e.preventDefault();
        if ((this.props.projectRunning && this.props.projectPaused) || !this.props.projectRunning) {
            this.props.vm.stepBack();
        }
    }
    handleStepOver (e) {
        e.preventDefault();

        if (this.props.projectPaused && this.props.projectRunning) {
            this.props.vm.stepOver();
        }
    }
    handleInitialStep (e) {
        e.preventDefault();

        this.props.vm.runtime.oneStep = true;
        this.handleGreenFlagClick(e);
        this.props.vm.haltExecution();
    }
    handleInitialTestStep (e) {
        e.preventDefault();

        this.props.vm.runtime.oneStep = true;
        this.handleRunTestClick(e);
        this.props.vm.haltExecution();
    }
    handlePauseResumeClick (e) {
        e.preventDefault();

        if (!this.props.projectRunning) {
            // No handling when project isn't running.
            return;
        }

        if (this.props.projectPaused) {
            this.resetPauseResume();
        } else {
            this.props.vm.haltExecution();
        }
    }
    handleStopAllClick (e) {
        e.preventDefault();

        if (this.props.projectPaused) {
            // Resets the state of the VM back to normal.
            // Otherwise we could not stop execution.
            this.resetPauseResume();
        }

        this.props.vm.stopAll();
    }
    resetPauseResume () {
        this.props.vm.resumeExecution();
    }
    handleToggleObservationClick (e) {
        e.preventDefault();
        if (this.props.observationActive) {
            this.deactivateObservation();
        } else {
            this.activateObservation();
        }
    }
    activateObservation () {
        this.props.vm.activateObservation();
        this.setObservationState(ObservationState.ACTIVATED);
        setTimeout(() => this.setObservationState(ObservationState.ACTIVE), 200);
    }
    deactivateObservation () {
        this.props.vm.deactivateObservation();
        this.setObservationState(ObservationState.DEACTIVATED);
        setTimeout(() => this.setObservationState(ObservationState.INACTIVE), 200);
    }
    setObservationState (state) {
        this.observationState = state;
        this.forceUpdate();
    }
    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            isStarted, // eslint-disable-line no-unused-vars
            handleIRQuestionsClick,
            projectRunning,
            projectPaused,
            irDisabled,
            turbo,
            interrogationSupported,
            interrogationEnabled,
            observationActive,
            whiskerTest,
            ...props
        } = this.props;

        return (
            <ControlsComponent
                {...props}
                active={projectRunning}
                paused={projectPaused}
                irDisabled={irDisabled}
                turbo={turbo}
                interrogationSupported={interrogationSupported}
                interrogationEnabled={interrogationEnabled}
                observationState={this.observationState}
                observationActive={observationActive}
                vm={vm}
                whiskerTest={whiskerTest}
                onGreenFlagClick={this.handleGreenFlagClick}
                onRunTestClick={this.handleRunTestClick}
                onStepBackClick={this.handleStepBack}
                onStepOverClick={this.handleStepOver}
                onInitialStepClick={this.handleInitialStep}
                onInitialTestStepClick={this.handleInitialTestStep}
                onPauseResumeClick={this.handlePauseResumeClick}
                onStopAllClick={this.handleStopAllClick}
                onIRQuestionsClick={handleIRQuestionsClick}
                onToggleObservationClick={this.handleToggleObservationClick}
            />
        );
    }
}

Controls.propTypes = {
    isStarted: PropTypes.bool.isRequired,
    handleIRQuestionsClick: PropTypes.func.isRequired,
    projectPaused: PropTypes.bool.isRequired,
    irDisabled: PropTypes.bool.isRequired,
    projectRunning: PropTypes.bool.isRequired,
    turbo: PropTypes.bool.isRequired,
    interrogationSupported: PropTypes.bool.isRequired,
    interrogationEnabled: PropTypes.bool.isRequired,
    observationActive: PropTypes.bool.isRequired,
    projectChanged: PropTypes.bool.isRequired,
    vm: PropTypes.instanceOf(VM),
    whiskerTest: PropTypes.instanceOf(Test)
};

const mapStateToProps = state => ({
    isStarted: state.scratchGui.vmStatus.running,
    projectPaused: state.scratchGui.vmStatus.paused,
    irDisabled: state.scratchGui.ircards.disabled,
    projectRunning: state.scratchGui.vmStatus.running,
    turbo: state.scratchGui.vmStatus.turbo,
    interrogationSupported: state.scratchGui.irDebugger.supported,
    interrogationEnabled: state.scratchGui.irDebugger.enabled,
    observationActive: state.scratchGui.vmStatus.observationActive,
    projectChanged: state.scratchGui.projectChanged,
    whiskerTest: state.scratchGui.vmStatus.whiskerTest
});

const mapDispatchToProps = dispatch => ({
    handleIRQuestionsClick: () => dispatch(viewCards())
});

export default connect(mapStateToProps, mapDispatchToProps)(Controls);

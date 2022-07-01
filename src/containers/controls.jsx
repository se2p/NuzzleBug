import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import logging from 'scratch-vm/src/util/logging.js';
import {connect} from 'react-redux';

import ControlsComponent from '../components/controls/controls.jsx';
import {
    ObservationState
} from '../components//interrogative-debugging/version-2/toggle-observation/toggle-observation.jsx';
import {viewCards} from '../reducers/interrogative-debugging/version-1/ir-cards.js';
import {setTestRunningState} from '../reducers/vm-status.js';

import Test from 'whisker-main/whisker-main/dist/src/test-runner/test';
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
            'onTestStart',
            'onTestDone',
            'onTestRunEnd'
        ]);
        this.observationState = props.observationActive ?
            ObservationState.ACTIVE : ObservationState.INACTIVE;

        this.testRunner = new TestRunner();
        this.testRunner.on(TestRunner.TEST_START, this.onTestStart);
        this.testRunner.on(TestRunner.TEST_PASS, this.onTestDone);
        this.testRunner.on(TestRunner.TEST_FAIL, this.onTestDone);
        this.testRunner.on(TestRunner.TEST_ERROR, this.onTestDone);
        this.testRunner.on(TestRunner.TEST_SKIP, this.onTestDone);
        this.testRunner.on(TestRunner.RUN_END, this.onTestRunEnd);

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
        if (logging.isActive()) {
            logging.logClickEvent('ICON', new Date(), 'GREENFLAG', null);
        }
    }
    handleRunTestClick (e) {
        e.preventDefault();

        if (this.props.whiskerTest) {
            this.props.onTestStart();
            
            if (this.props.projectPaused) {
                // Resets the state of the VM back to normal.
                // Otherwise we could not start execution again.
                this.resetPauseResume();
            }
            const test = this.props.whiskerTest;
            test.isLoading = true;
            test.isRunning = false;
            test.resultStatus = null;
            this.forceUpdate();
            setTimeout(() => this.testRunner.runTests(
                this.props.vm,
                test.project,
                [test],
                this.modelTester,
                test.props,
                test.modelProps
            ), 100);
        }
    }
    onTestStart () {
        if (this.haltAfterFirstTestStep) {
            this.props.vm.haltExecution();
            this.props.vm.runtime.oneStep = true;
            this.haltAfterFirstTestStep = false;
        }
        const test = this.props.whiskerTest;
        test.isLoading = false;
        test.isRunning = true;
        this.props.vm.runtime.whiskerTestRunning = true;
        this.forceUpdate();
    }
    onTestDone (result) {
        const test = this.props.whiskerTest;
        test.isRunning = false;
        test.resultStatus = result.status;
        this.props.vm.runtime.whiskerTestRunning = false;
        const traces = this.props.vm.runtime.traceInfo.tracer.traces;
        traces[traces.length - 1].whiskerTestEnd = true;
        this.props.onTestEnd();
        this.forceUpdate();
    }
    onTestRunEnd () {
        if (this.props.projectPaused) {
            // Resets the state of the VM back to normal.
            // Otherwise we could not stop execution.
            this.resetPauseResume();
        }
        this.props.vm.stopAll();
        this.props.vm.runtime._executeStep();
    }
    handleStepBack (e) {
        e.preventDefault();
        if ((this.props.projectRunning && this.props.projectPaused) || !this.props.projectRunning) {
            this.props.vm.stepBack();
            if (logging.isActive()) {
                logging.logClickEvent('BUTTON', new Date(), 'STEP_BACK', null);
            }
        }
    }
    handleStepOver (e) {
        e.preventDefault();

        if (this.props.projectPaused && this.props.projectRunning) {
            this.props.vm.stepOver();
            if (logging.isActive()) {
                logging.logClickEvent('BUTTON', new Date(), 'STEP_OVER', null);
            }
        }
    }
    handleInitialStep (e) {
        e.preventDefault();

        this.props.vm.runtime.oneStep = true;
        this.handleGreenFlagClick(e);
        this.props.vm.haltExecution();
        if (logging.isActive()) {
            logging.logClickEvent('BUTTON', new Date(), 'PAUSE_EXECUTION', null);
        }
    }
    handleInitialTestStep (e) {
        e.preventDefault();

        this.haltAfterFirstTestStep = true;
        this.handleRunTestClick(e);
    }
    handlePauseResumeClick (e) {
        e.preventDefault();

        if (!this.props.projectRunning) {
            // No handling when project isn't running.
            return;
        }

        if (this.props.projectPaused) {
            this.resetPauseResume();
            if (logging.isActive()) {
                logging.logClickEvent('BUTTON', new Date(), 'RESUME_EXECUTION', null);
            }
        } else {
            this.props.vm.haltExecution();
            if (logging.isActive()) {
                logging.logClickEvent('BUTTON', new Date(), 'PAUSE_EXECUTION', null);
            }
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
        if (this.testRunner.vmWrapper) {
            this.testRunner.vmWrapper.end();
        }
        if (logging.isActive()) {
            logging.logClickEvent('ICON', new Date(), 'STOPALL', null);
        }
    }
    resetPauseResume () {
        this.props.vm.resumeExecution();
    }
    handleToggleObservationClick (e) {
        e.preventDefault();
        if (this.props.observationActive) {
            this.deactivateObservation();
            if (logging.isActive()) {
                logging.logClickEvent('BUTTON', new Date(), 'DEACTIVATE_OBSERVATION', null);
            }
        } else {
            this.activateObservation();
            if (logging.isActive()) {
                logging.logClickEvent('BUTTON', new Date(), 'ACTIVATE_OBSERVATION', null);
            }
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

        delete props.projectChanged;
        delete props.onTestStart;
        delete props.onTestEnd;

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
    onTestStart: PropTypes.func.isRequired,
    onTestEnd: PropTypes.func.isRequired,
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
    onTestStart: () => dispatch(setTestRunningState(true)),
    onTestEnd: () => dispatch(setTestRunningState(false)),
    handleIRQuestionsClick: () => dispatch(viewCards())
});

export default connect(mapStateToProps, mapDispatchToProps)(Controls);

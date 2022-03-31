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

class Controls extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleGreenFlagClick',
            'handlePauseResumeClick',
            'handleStepBack',
            'handleStepOver',
            'handleStopAllClick',
            'handleToggleObservationClick'
        ]);
        this.observationState = props.observationActive ?
            ObservationState.ACTIVE : ObservationState.INACTIVE;
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
                this.props.vm.start();
            }
            this.activateObservation();
            this.props.vm.runtime.observation.traceStart = 0;
            this.props.vm.greenFlag();
        }
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
        if (!this.props.projectRunning) {
            this.props.vm.runtime.oneStep = true;
            this.handleGreenFlagClick(e);
            this.props.vm.haltExecution();
        }
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
            observationActive,
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
                observationState={this.observationState}
                observationActive={observationActive}
                vm={vm}
                onGreenFlagClick={this.handleGreenFlagClick}
                onStepBackClick={this.handleStepBack}
                onStepOverClick={this.handleStepOver}
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
    observationActive: PropTypes.bool.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    isStarted: state.scratchGui.vmStatus.running,
    projectPaused: state.scratchGui.vmStatus.paused,
    irDisabled: state.scratchGui.ircards.disabled,
    projectRunning: state.scratchGui.vmStatus.running,
    turbo: state.scratchGui.vmStatus.turbo,
    interrogationSupported: state.scratchGui.irDebugger.supported,
    observationActive: state.scratchGui.vmStatus.observationActive
});

const mapDispatchToProps = dispatch => ({
    handleIRQuestionsClick: () => dispatch(viewCards())
});

export default connect(mapStateToProps, mapDispatchToProps)(Controls);

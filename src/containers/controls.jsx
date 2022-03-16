import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import ControlsComponent from '../components/controls/controls.jsx';
import {
    QuestionGenerationState
} from '../components//interrogative-debugging/version-2/toggle-question-generation/toggle-question-generation.jsx';
import {viewCards} from '../reducers/interrogative-debugging/version-1/ir-cards.js';

class Controls extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleGreenFlagClick',
            'handlePauseResumeClick',
            'handleStepOver',
            'handleStopAllClick',
            'handleToggleQuestionGenerationClick'
        ]);
        this.questionGenerationState = props.questionGenerationActive ?
            QuestionGenerationState.ACTIVE : QuestionGenerationState.INACTIVE;
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
            this.activateQuestionGeneration();
            this.props.vm.runtime.questionGeneration.traceStart = 0;
            this.props.vm.greenFlag();
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
    handleToggleQuestionGenerationClick (e) {
        e.preventDefault();
        if (this.props.questionGenerationActive) {
            this.deactivateQuestionGeneration();
        } else {
            this.activateQuestionGeneration();
        }
    }
    activateQuestionGeneration () {
        this.props.vm.activateQuestionGeneration();
        this.setQuestionGenerationState(QuestionGenerationState.ACTIVATED);
        setTimeout(() => this.setQuestionGenerationState(QuestionGenerationState.ACTIVE), 200);
    }
    deactivateQuestionGeneration () {
        this.props.vm.deactivateQuestionGeneration();
        this.setQuestionGenerationState(QuestionGenerationState.DEACTIVATED);
        setTimeout(() => this.setQuestionGenerationState(QuestionGenerationState.INACTIVE), 200);
    }
    setQuestionGenerationState (state) {
        this.questionGenerationState = state;
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
            questionGenerationActive,
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
                questionGenerationState={this.questionGenerationState}
                questionGenerationActive={questionGenerationActive}
                vm={vm}
                onGreenFlagClick={this.handleGreenFlagClick}
                onStepOverClick={this.handleStepOver}
                onPauseResumeClick={this.handlePauseResumeClick}
                onStopAllClick={this.handleStopAllClick}
                onIRQuestionsClick={handleIRQuestionsClick}
                onToggleQuestionGenerationClick={this.handleToggleQuestionGenerationClick}
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
    questionGenerationActive: PropTypes.bool.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    isStarted: state.scratchGui.vmStatus.running,
    projectPaused: state.scratchGui.vmStatus.paused,
    irDisabled: state.scratchGui.ircards.disabled,
    projectRunning: state.scratchGui.vmStatus.running,
    turbo: state.scratchGui.vmStatus.turbo,
    interrogationSupported: state.scratchGui.irDebugger.supported,
    questionGenerationActive: state.scratchGui.vmStatus.questionGenerationActive
});

const mapDispatchToProps = dispatch => ({
    handleIRQuestionsClick: () => dispatch(viewCards())
});

export default connect(mapStateToProps, mapDispatchToProps)(Controls);

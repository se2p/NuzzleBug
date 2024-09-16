import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import logging from 'scratch-vm/src/util/logging.js';
import {connect} from 'react-redux';
import {injectIntl, intlShape} from 'react-intl';

import ControlsComponent from '../components/controls/controls.jsx';
import {TracingState} from '../components/toggle-tracing/toggle-tracing.jsx';
import {viewCards} from '../reducers/interrogative-debugging/version-1/ir-cards.js';

import {actionExecuted, openHelpMenu, repositionHelpMenuWindow} from '../reducers/help-menu';
import {viewTutorial} from '../reducers/tutorial-cards.js';

class Controls extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleKeyDown',
            'handleGreenFlagClick',
            'handlePauseResumeClick',
            'handleHelpMenuButtonClick',
            'handleStepBack',
            'handleStepOver',
            'handleInitialStep',
            'handleStopAllClick',
            'handleToggleTracingClick'
        ]);

        props.vm.runtime.branchDistTracingActive = false;

        this.tracingState = props.tracingActive ?
            TracingState.ACTIVE : TracingState.INACTIVE;
    }
    componentDidMount () {
        document.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount () {
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    handleKeyDown (e) {
        if (e.key === 'F5') {
            this.handleGreenFlagClick(e);
        }
        if (e.key === 'F6') {
            this.handleInitialStep(e);
        }
        if (e.key === 'F7') {
            this.handlePauseResumeClick(e);
        }
        if (e.key === 'F8') {
            this.handleStepBack(e);
        }
        if (e.key === 'F9') {
            this.handleStepOver(e);
        }
        if (e.key === 'F10') {
            this.handleStopAllClick(e);
        }
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

        if (this.props.helpMenuOpen && !this.props.wasActionExecuted) {
            this.props.onActionExecuted();
            this.forceUpdate();
        }
        if (logging.isActive()) {
            logging.logClickEvent('ICON', new Date(), 'GREENFLAG', null);
        }
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
    handleHelpMenuButtonClick (e) {
        e.preventDefault();
        if ((this.props.projectRunning && this.props.projectPaused) || !this.props.projectRunning) {
            const x = window.innerWidth - 480 - 200;
            const y = window.innerHeight / 4;
            this.props.doRepositionHelpMenuWindow(x, y);
            this.props.onHelpMenuButtonClick();
            if (this.props.executedOnce){
                this.props.onActionExecuted();
            }
            if (logging.isActive()) {
                logging.logClickEvent('BUTTON', new Date(), 'HELP_MENU_BUTTON', null);
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
        this.props.vm.haltExecutionForDebugger();
        if (logging.isActive()) {
            logging.logClickEvent('BUTTON', new Date(), 'PAUSE_EXECUTION', null);
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
            if (logging.isActive()) {
                logging.logClickEvent('BUTTON', new Date(), 'RESUME_EXECUTION', null);
            }
        } else {
            this.props.vm.haltExecutionForDebugger();
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
        if (logging.isActive()) {
            logging.logClickEvent('ICON', new Date(), 'STOPALL', null);
        }
    }
    resetPauseResume () {
        this.props.vm.resumeExecutionForDebugger();
    }
    handleToggleTracingClick (e) {
        e.preventDefault();
        if (this.props.tracingActive) {
            this.deactivateTracing();
            if (logging.isActive()) {
                logging.logClickEvent('BUTTON', new Date(), 'DEACTIVATE_OBSERVATION', null);
            }
        } else {
            this.activateTracing();
            if (logging.isActive()) {
                logging.logClickEvent('BUTTON', new Date(), 'ACTIVATE_OBSERVATION', null);
            }
        }
    }
    activateTracing () {
        this.props.vm.activateTracing();
        if (this.props.vm.runtime.tracingActive) {
            this.setTracingState(TracingState.ACTIVATED);
            setTimeout(() => this.setTracingState(TracingState.ACTIVE), 200);
        } else {
            // eslint-disable-next-line no-alert
            alert(this.props.intl.formatMessage({id: 'gui.ir-debugger.tracing.impossible'}));
        }
    }
    deactivateTracing () {
        this.props.vm.deactivateTracing();
        this.setTracingState(TracingState.DEACTIVATED);
        setTimeout(() => this.setTracingState(TracingState.INACTIVE), 200);
    }
    setTracingState (state) {
        this.tracingState = state;
        this.forceUpdate();
    }

    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            isStarted, // eslint-disable-line no-unused-vars
            helpMenuOpen, // eslint-disable-line no-unused-vars
            onActionExecuted, // eslint-disable-line no-unused-vars
            wasActionExecuted, // eslint-disable-line no-unused-vars
            executedOnce, // eslint-disable-line no-unused-vars
            projectChanged, // eslint-disable-line no-unused-vars
            doRepositionHelpMenuWindow, // eslint-disable-line no-unused-vars
            handleIRQuestionsClick,
            projectRunning,
            projectPaused,
            irDisabled,
            handleTutorialClick,
            handleDebugTutorialClick,//TODO
            turbo,
            interrogationSupported,
            interrogationEnabled,
            tracingActive,
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
                tracingState={this.tracingState}
                tracingActive={tracingActive}
                vm={vm}
                onGreenFlagClick={this.handleGreenFlagClick}
                onStepBackClick={this.handleStepBack}
                onHelpMenuButtonClick={this.handleHelpMenuButtonClick}
                onStepOverClick={this.handleStepOver}
                onInitialStepClick={this.handleInitialStep}
                onPauseResumeClick={this.handlePauseResumeClick}
                onStopAllClick={this.handleStopAllClick}
                onIRQuestionsClick={handleIRQuestionsClick}
                onToggleTracingClick={this.handleToggleTracingClick}
                onTutorialClick={handleTutorialClick} //handleTutorialClick UNNÖTIG? WIRD NUR AM ANFANG AUFGERUFEN
                onDebugTutorialClick={handleDebugTutorialClick}//TODO
            />
        );
    }
}

Controls.propTypes = {
    intl: intlShape.isRequired,
    isStarted: PropTypes.bool.isRequired,
    handleIRQuestionsClick: PropTypes.func.isRequired,
    projectPaused: PropTypes.bool.isRequired,
    irDisabled: PropTypes.bool.isRequired,
    projectRunning: PropTypes.bool.isRequired,
    handleTutorialClick: PropTypes.func.isRequired,
    handleDebugTutorialClick: PropTypes.func, //TODO isRequired
    turbo: PropTypes.bool.isRequired,
    onHelpMenuButtonClick: PropTypes.func.isRequired,
    onActionExecuted: PropTypes.func.isRequired,
    wasActionExecuted: PropTypes.bool.isRequired,
    helpMenuOpen: PropTypes.bool.isRequired,
    executedOnce: PropTypes.bool.isRequired,
    interrogationSupported: PropTypes.bool.isRequired,
    interrogationEnabled: PropTypes.bool.isRequired,
    tracingActive: PropTypes.bool.isRequired,
    projectChanged: PropTypes.bool.isRequired,
    doRepositionHelpMenuWindow: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    isStarted: state.scratchGui.vmStatus.running,
    projectPaused: state.scratchGui.vmStatus.paused,
    irDisabled: state.scratchGui.ircards.disabled,
    projectRunning: state.scratchGui.vmStatus.running,
    turbo: state.scratchGui.vmStatus.turbo,
    interrogationSupported: state.scratchGui.irDebugger.supported,
    interrogationEnabled: state.scratchGui.irDebugger.enabled,
    helpMenuOpen: state.scratchGui.helpMenu.visible,
    wasActionExecuted: state.scratchGui.helpMenu.actionExecuted,
    executedOnce: state.scratchGui.helpMenu.executedOnce,
    tracingActive: state.scratchGui.vmStatus.tracingActive,
    projectChanged: state.scratchGui.projectChanged,
    tutorialCardsVisible: state.scratchGui.tutorialCards.visible,
    locale: state.locales.locale
});

const mapDispatchToProps = dispatch => ({
    onHelpMenuButtonClick: () => dispatch(openHelpMenu()),
    handleIRQuestionsClick: () => dispatch(viewCards()),
    onActionExecuted: () => dispatch(actionExecuted()),
    doRepositionHelpMenuWindow: (x, y) => dispatch(repositionHelpMenuWindow(x, y)),
    handleTutorialClick: () => dispatch(viewTutorial()), //dispatch(viewTutorial())
    handleDebugTutorialClick: () => dispatch(viewDebuggingTutorial()) //TODO Zeigt tutorial an
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Controls));

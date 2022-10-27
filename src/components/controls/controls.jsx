import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import VM from 'scratch-vm';
import Test from 'whisker-main/whisker-main/dist/src/test-runner/test';

import GreenFlag from '../green-flag/green-flag.jsx';
import RunTest from '../run-test/run-test.jsx';
import PauseResume from '../pause-resume/pause-resume.jsx';
import StepOver from '../step-over/step-over.jsx';
import InitialStep from '../initial-step/initial-step.jsx';
import InitialTestStep from '../initial-test-step/initial-test-step.jsx';
import StepBack from '../step-back/step-back.jsx';
import HelpMenuButton from "../help-menu-button/help-menu-button.jsx";
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';
import IRQuestions from '../interrogative-debugging/version-1/ir-questions/ir-question-button.jsx';
import ToggleTracing, {TracingState} from '../toggle-tracing/toggle-tracing.jsx';

import styles from './controls.css';

const messages = defineMessages({
    goTitle: {
        id: 'gui.controls.go',
        defaultMessage: 'Go',
        description: 'Green flag button title'
    },
    runTestTitle: {
        id: 'gui.ir-debugger.controls.run-test',
        defaultMessage: 'Run test',
        description: 'Run test button title'
    },
    pauseTitle: {
        id: 'gui.ir-debugger.controls.pause',
        defaultMessage: 'Pause',
        description: 'Pause button title'
    },
    resumeTitle: {
        id: 'gui.ir-debugger.controls.resume',
        defaultMessage: 'Resume',
        description: 'Resume button title'
    },
    stepBackTitle: {
        id: 'gui.ir-debugger.controls.step-back',
        defaultMessage: 'Step back',
        description: 'Step back button title'
    },
    stepOverTitle: {
        id: 'gui.ir-debugger.controls.step-over',
        defaultMessage: 'Step Over',
        description: 'Step Over button title'
    },
    helpMenuButtonTitle: {
        id: 'gui.help-menu.controls.help-menu-button',
        defaultMessage: 'Help Menu',
        description: 'Help menu button title'
    },
    initialStepTitle: {
        id: 'gui.ir-debugger.controls.initial-step',
        defaultMessage: 'Initial Step',
        description: 'Initial Step button title'
    },
    initialTestStepTitle: {
        id: 'gui.ir-debugger.controls.initial-test-step',
        defaultMessage: 'Initial Test Step',
        description: 'Initial Test Step button title'
    },
    stopTitle: {
        id: 'gui.controls.stop',
        defaultMessage: 'Stop',
        description: 'Stop button title'
    },
    irQuestionTitle: {
        id: 'gui.ir-debugger.controls.ir-questions',
        defaultMessage: 'Show Questions',
        description: 'Show questions button title'
    },
    activateTracing: {
        id: 'gui.ir-debugger.controls.activate-tracing',
        defaultMessage: 'Activate tracing',
        description: 'Activate tracing button title'
    },
    deactivateTracing: {
        id: 'gui.ir-debugger.controls.deactivate-tracing',
        defaultMessage: 'Deactivate tracing',
        description: 'Deactivate tracing button title'
    }
});

const Controls = function (props) {
    const {
        active,
        className,
        intl,
        onGreenFlagClick,
        onRunTestClick,
        onPauseResumeClick,
        onStopAllClick,
        onStepBackClick,
        onStepOverClick,
        onHelpMenuButtonClick,
        onInitialStepClick,
        onInitialTestStepClick,
        onIRQuestionsClick,
        onToggleTracingClick,
        irDisabled,
        vm,
        paused,
        turbo,
        interrogationSupported,
        interrogationEnabled,
        tracingState,
        tracingActive,
        whiskerTest,
        ...componentProps
    } = props;

    const showQuestionButton = false;

    return (
        <div
            className={classNames(styles.controlsContainer, className)}
            {...componentProps}
        >
            <GreenFlag
                active={active && !paused && !whiskerTest?.isRunning}
                title={intl.formatMessage(messages.goTitle)}
                onClick={onGreenFlagClick}
            />
            {whiskerTest ? <RunTest
                testResult={whiskerTest.resultStatus}
                active={active && !paused && whiskerTest.isRunning}
                title={intl.formatMessage(messages.runTestTitle, {name: whiskerTest.name})}
                onClick={onRunTestClick}
            /> : null}
            {whiskerTest && whiskerTest.isLoading ? (
                <div className={styles.loader} />
            ) : null}
            {interrogationSupported ? (<InitialStep
                title={intl.formatMessage(messages.initialStepTitle)}
                onClick={onInitialStepClick}
            />) : null}
            {whiskerTest && interrogationSupported ? (<InitialTestStep
                title={intl.formatMessage(messages.initialTestStepTitle, {name: whiskerTest.name})}
                onClick={onInitialTestStepClick}
            />) : null}
            {interrogationSupported ? <PauseResume
                active={active}
                paused={paused}
                title={intl.formatMessage(paused ? messages.resumeTitle : messages.pauseTitle)}
                onClick={onPauseResumeClick}
            /> : null}
            {interrogationSupported ? (<StepBack
                vm={vm}
                active={active}
                paused={paused}
                interrogationEnabled={interrogationEnabled}
                title={intl.formatMessage(messages.stepBackTitle)}
                onClick={onStepBackClick}
            />) : null}
            {interrogationSupported ? (<StepOver
                active={active}
                paused={paused}
                title={intl.formatMessage(messages.stepOverTitle)}
                onClick={onStepOverClick}
            />) : null}
            <StopAll
                active={active}
                title={intl.formatMessage(messages.stopTitle)}
                onClick={onStopAllClick}
            />

            {turbo ? (
                <TurboMode />
            ) : null}
            {interrogationSupported && showQuestionButton ? <IRQuestions
                active={!irDisabled && (!active || paused)}
                onClick={onIRQuestionsClick}
                title={intl.formatMessage(messages.irQuestionTitle)}
            /> : null}
            {interrogationSupported ? (<ToggleTracing
                title={tracingActive ?
                    intl.formatMessage(messages.deactivateTracing) :
                    intl.formatMessage(messages.activateTracing)
                }
                onClick={onToggleTracingClick}
                state={tracingState}
                active={tracingActive}
            />) : null}
            {// Todo Only open Help Menu, when a block is present
                interrogationSupported ? (<HelpMenuButton
                active={active}
                paused={paused}
                title={intl.formatMessage(messages.helpMenuButtonTitle)}
                onClick={onHelpMenuButtonClick}
            />) : null}
        </div>
    );
};

Controls.propTypes = {
    active: PropTypes.bool,
    paused: PropTypes.bool,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onGreenFlagClick: PropTypes.func.isRequired,
    onRunTestClick: PropTypes.func.isRequired,
    onPauseResumeClick: PropTypes.func.isRequired,
    onStepBackClick: PropTypes.func.isRequired,
    onStepOverClick: PropTypes.func.isRequired,
    onHelpMenuButtonClick: PropTypes.func.isRequired,
    onInitialStepClick: PropTypes.func.isRequired,
    onInitialTestStepClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    onIRQuestionsClick: PropTypes.func.isRequired,
    onToggleTracingClick: PropTypes.func.isRequired,
    irDisabled: PropTypes.bool,
    turbo: PropTypes.bool,
    interrogationSupported: PropTypes.bool,
    interrogationEnabled: PropTypes.bool,
    vm: PropTypes.instanceOf(VM),
    tracingState: PropTypes.oneOf(Object.values(TracingState)).isRequired,
    tracingActive: PropTypes.bool,
    whiskerTest: PropTypes.instanceOf(Test)
};

Controls.defaultProps = {
    active: false,
    paused: false,
    turbo: false,
    irDisabled: false
};

export default injectIntl(Controls);

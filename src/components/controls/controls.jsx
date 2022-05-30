import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import VM from 'scratch-vm';
import Test from 'whisker-main/whisker-main/src/test-runner/test';

import GreenFlag from '../green-flag/green-flag.jsx';
import RunTest from '../run-test/run-test.jsx';
import PauseResume from '../pause-resume/pause-resume.jsx';
import StepOver from '../step-over/step-over.jsx';
import InitialStep from '../initial-step/initial-step.jsx';
import InitialTestStep from '../initial-test-step/initial-test-step.jsx';
import StepBack from '../step-back/step-back.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';
import IRQuestions from '../interrogative-debugging/version-1/ir-questions/ir-question-button.jsx';
import ToggleObservation, {ObservationState}
from '../interrogative-debugging/version-2/toggle-observation/toggle-observation.jsx';

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
    activateObservation: {
        id: 'gui.ir-debugger.controls.activate-observation',
        defaultMessage: 'Activate observation',
        description: 'Activate observation button title'
    },
    deactivateObservation: {
        id: 'gui.ir-debugger.controls.deactivate-observation',
        defaultMessage: 'Deactivate observation',
        description: 'Deactivate observation button title'
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
        onInitialStepClick,
        onInitialTestStepClick,
        onIRQuestionsClick,
        onToggleObservationClick,
        irDisabled,
        vm,
        paused,
        turbo,
        interrogationSupported,
        interrogationEnabled,
        observationState,
        observationActive,
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
            {interrogationSupported ? (<ToggleObservation
                title={observationActive ?
                    intl.formatMessage(messages.deactivateObservation) :
                    intl.formatMessage(messages.activateObservation)
                }
                onClick={onToggleObservationClick}
                state={observationState}
                active={observationActive}
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
    onInitialStepClick: PropTypes.func.isRequired,
    onInitialTestStepClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    onIRQuestionsClick: PropTypes.func.isRequired,
    onToggleObservationClick: PropTypes.func.isRequired,
    irDisabled: PropTypes.bool,
    turbo: PropTypes.bool,
    interrogationSupported: PropTypes.bool,
    interrogationEnabled: PropTypes.bool,
    vm: PropTypes.instanceOf(VM),
    observationState: PropTypes.oneOf(Object.values(ObservationState)).isRequired,
    observationActive: PropTypes.bool,
    whiskerTest: PropTypes.instanceOf(Test)
};

Controls.defaultProps = {
    active: false,
    paused: false,
    turbo: false,
    irDisabled: false
};

export default injectIntl(Controls);

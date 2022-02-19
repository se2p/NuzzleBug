import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import GreenFlag from '../green-flag/green-flag.jsx';
import PauseResume from '../pause-resume/pause-resume.jsx';
import StepOver from '../step-over/step-over.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';
import IRQuestions from '../interrogative-debugging/version-1/ir-questions/ir-question-button.jsx';
import ToggleQuestionGeneration, {QuestionGenerationState}
from '../interrogative-debugging/version-2/toggle-question-generation/toggle-question-generation.jsx';

import styles from './controls.css';

const messages = defineMessages({
    goTitle: {
        id: 'gui.controls.go',
        defaultMessage: 'Go',
        description: 'Green flag button title'
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
    stepOverTitle: {
        id: 'gui.ir-debugger.controls.step-over',
        defaultMessage: 'Step Over',
        description: 'Step Over button title'
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
    activateQuestionGeneration: {
        id: 'gui.ir-debugger.controls.activate-question-generation',
        defaultMessage: 'Activate question generation',
        description: 'Activate question generation button title'
    },
    deactivateQuestionGeneration: {
        id: 'gui.ir-debugger.controls.deactivate-question-generation',
        defaultMessage: 'Deactivate question generation',
        description: 'Deactivate question generation button title'
    }
});

const Controls = function (props) {
    const {
        active,
        className,
        intl,
        onGreenFlagClick,
        onPauseResumeClick,
        onStopAllClick,
        onStepOverClick,
        onIRQuestionsClick,
        onToggleQuestionGenerationClick,
        irDisabled,
        paused,
        turbo,
        interrogationSupported,
        questionGenerationState,
        questionGenerationActive,
        ...componentProps
    } = props;
    return (
        <div
            className={classNames(styles.controlsContainer, className)}
            {...componentProps}
        >
            <GreenFlag
                active={active && !paused}
                title={intl.formatMessage(messages.goTitle)}
                onClick={onGreenFlagClick}
            />
            {interrogationSupported ? <PauseResume
                active={active}
                paused={paused}
                title={intl.formatMessage(paused ? messages.resumeTitle : messages.pauseTitle)}
                onClick={onPauseResumeClick}
            /> : null}
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
            {interrogationSupported ? <IRQuestions
                active={!irDisabled && (!active || paused)}
                onClick={onIRQuestionsClick}
                title={intl.formatMessage(messages.irQuestionTitle)}
            /> : null}
            {interrogationSupported ? (<ToggleQuestionGeneration
                title={questionGenerationActive ?
                    intl.formatMessage(messages.deactivateQuestionGeneration) :
                    intl.formatMessage(messages.activateQuestionGeneration)
                }
                onClick={onToggleQuestionGenerationClick}
                state={questionGenerationState}
                active={questionGenerationActive}
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
    onPauseResumeClick: PropTypes.func.isRequired,
    onStepOverClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    onIRQuestionsClick: PropTypes.func.isRequired,
    onToggleQuestionGenerationClick: PropTypes.func.isRequired,
    irDisabled: PropTypes.bool,
    turbo: PropTypes.bool,
    interrogationSupported: PropTypes.bool,
    questionGenerationState: PropTypes.oneOf(Object.values(QuestionGenerationState)).isRequired,
    questionGenerationActive: PropTypes.bool
};

Controls.defaultProps = {
    active: false,
    paused: false,
    turbo: false,
    irDisabled: false
};

export default injectIntl(Controls);

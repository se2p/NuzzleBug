import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import VM from 'scratch-vm';

import GreenFlag from '../green-flag/green-flag.jsx';
import PauseResume from '../pause-resume/pause-resume.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';
import IRQuestions from '../ir-questions/questions.jsx';

import styles from './controls.css';

const messages = defineMessages({
    goTitle: {
        id: 'gui.controls.go',
        defaultMessage: 'Go',
        description: 'Green flag button title'
    },
    pauseTitle: {
        id: 'gui.controls.pause',
        defaultMessage: 'Pause',
        description: 'Pause button title'
    },
    resumeTitle: {
        id: 'gui.controls.resume',
        defaultMessage: 'Resume',
        description: 'Resume button title'
    },
    stopTitle: {
        id: 'gui.controls.stop',
        defaultMessage: 'Stop',
        description: 'Stop button title'
    },
    irQuestionTitle: {
        id: 'gui.controls.ir-questions',
        defaultMessage: 'Show Questions',
        description: 'Show questions title'
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
        paused,
        turbo,
        vm,
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
            <PauseResume
                active={active}
                paused={paused}
                title={intl.formatMessage(paused ? messages.resumeTitle : messages.pauseTitle)}
                onClick={onPauseResumeClick}
            />
            <StopAll
                active={active}
                title={intl.formatMessage(messages.stopTitle)}
                onClick={onStopAllClick}
            />
            {turbo ? (
                <TurboMode />
            ) : null}
            <IRQuestions
                active={!active || paused}
                vm={vm}
            />
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
    onStopAllClick: PropTypes.func.isRequired,
    turbo: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

Controls.defaultProps = {
    active: false,
    paused: false,
    turbo: false
};

export default injectIntl(Controls);

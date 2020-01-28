import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import iconPause from './icon--pause.svg';
import iconResume from './icon--resume.svg';
import styles from './pause-resume.css';

const PauseResumeComponent = function (props) {
    const {
        active,
        paused,
        className,
        onClick,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.pauseResume,
                {
                    [styles.isActive]: active,
                    [styles.paused]: paused
                }
            )}
            draggable={false}
            src={paused ? iconResume : iconPause}
            title={paused ? 'Resume' : 'Pause'}
            onClick={onClick}
            {...componentProps}
        />
    );
};

PauseResumeComponent.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    paused: PropTypes.bool
};

PauseResumeComponent.defaultProps = {
    active: false,
    paused: false,
    title: 'Stop'
};

export default PauseResumeComponent;

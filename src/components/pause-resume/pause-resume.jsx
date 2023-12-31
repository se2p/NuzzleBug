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
        title,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.pauseResume,
                {
                    [styles.isActive]: active,
                    [styles.paused]: paused && active
                }
            )}
            draggable={false}
            src={paused && active ? iconResume : iconPause}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};

PauseResumeComponent.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    paused: PropTypes.bool,
    title: PropTypes.string
};

PauseResumeComponent.defaultProps = {
    active: false,
    paused: false,
    title: 'Pause'
};

export default PauseResumeComponent;

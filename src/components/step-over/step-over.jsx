import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import icon from './icon--paw-steps.svg';
import styles from './step-over.css';

const StepOverComponent = function (props) {
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
                styles.stopOver,
                {
                    [styles.enabled]: !active || (active && paused)
                }
            )}
            draggable={false}
            src={icon}
            onClick={onClick}
            title={title}
            {...componentProps}
        />
    );
};

StepOverComponent.propTypes = {
    active: PropTypes.bool,
    paused: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

StepOverComponent.defaultProps = {
    active: false,
    paused: false,
    title: 'Step Over'
};

export default StepOverComponent;

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import icon from './icon--eye.svg';
import styles from './toggle-tracing.css';

export const TracingState = Object.freeze({
    ACTIVE: 1,
    INACTIVE: 2,
    ACTIVATED: 3,
    DEACTIVATED: 4
});

const ToggleTracingComponent = function (props) {
    const {
        className,
        onClick,
        title,
        state,
        active,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.toggleTracing,
                {
                    [styles.active]: active,
                    [styles.activated]: state === TracingState.ACTIVATED,
                    [styles.deactivated]: state === TracingState.DEACTIVATED
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

ToggleTracingComponent.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
    active: PropTypes.bool,
    state: PropTypes.oneOf(Object.values(TracingState)).isRequired
};

ToggleTracingComponent.defaultProps = {
    title: 'Toggle tracing'
};

export default ToggleTracingComponent;

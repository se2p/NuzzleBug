import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import icon from './icon--eye.svg';
import styles from './toggle-observation.css';

export const ObservationState = Object.freeze({
    ACTIVE: 1,
    INACTIVE: 2,
    ACTIVATED: 3,
    DEACTIVATED: 4
});

const ToggleObservationComponent = function (props) {
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
                styles.toggleObservation,
                {
                    [styles.active]: active,
                    [styles.activated]: state === ObservationState.ACTIVATED,
                    [styles.deactivated]: state === ObservationState.DEACTIVATED
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

ToggleObservationComponent.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
    active: PropTypes.bool,
    state: PropTypes.oneOf(Object.values(ObservationState)).isRequired
};

ToggleObservationComponent.defaultProps = {
    title: 'Toggle observation'
};

export default ToggleObservationComponent;

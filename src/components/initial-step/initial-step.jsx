import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import icon from './icon--initial-step.svg';
import styles from './initial-step.css';

const InitialStepComponent = function (props) {
    const {
        className,
        onClick,
        title,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.initialStep
            )}
            draggable={false}
            src={icon}
            onClick={onClick}
            title={title}
            {...componentProps}
        />
    );
};

InitialStepComponent.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

InitialStepComponent.defaultProps = {
    title: 'Initial Step'
};

export default InitialStepComponent;

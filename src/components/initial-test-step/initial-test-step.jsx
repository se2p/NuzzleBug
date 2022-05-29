import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import icon from './icon--initial-test-step.svg';
import styles from './initial-test-step.css';

const InitialTestStepComponent = function (props) {
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

InitialTestStepComponent.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

InitialTestStepComponent.defaultProps = {
    title: 'Initial Test Step'
};

export default InitialTestStepComponent;

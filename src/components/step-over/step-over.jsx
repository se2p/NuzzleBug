import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import icon from './icon--step-over.svg';
import styles from './step-over.css';

const StepOverComponent = function (props) {
    const {
        className,
        onClick,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.stopOver
            )}
            draggable={false}
            src={icon}
            onClick={onClick}
            {...componentProps}
        />
    );
};

StepOverComponent.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

export default StepOverComponent;

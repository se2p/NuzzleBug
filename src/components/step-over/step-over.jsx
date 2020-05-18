import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import icon from './icon--step-over.svg';
import styles from './step-over.css';

const StepOverComponent = function (props) {
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
                styles.stopOver
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
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

StepOverComponent.defaultProps = {
    title: 'Step Over'
};

export default StepOverComponent;

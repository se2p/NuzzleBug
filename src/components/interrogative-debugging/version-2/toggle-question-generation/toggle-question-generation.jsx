import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import icon from './icon--eye.svg';
import styles from './toggle-question-generation.css';

const ToggleQuestionGenerationComponent = function (props) {
    const {
        className,
        onClick,
        title,
        questionGenerationActive,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.toggleQuestionGeneration,
                {
                    [styles.active]: questionGenerationActive
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

ToggleQuestionGenerationComponent.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
    questionGenerationActive: PropTypes.bool.isRequired
};

ToggleQuestionGenerationComponent.defaultProps = {
    title: 'Toggle question generation'
};

export default ToggleQuestionGenerationComponent;

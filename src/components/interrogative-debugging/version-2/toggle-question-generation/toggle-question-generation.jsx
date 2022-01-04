import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import icon from './icon--eye.svg';
import styles from './toggle-question-generation.css';

export const QuestionGenerationState = Object.freeze({
    ACTIVE: 1,
    INACTIVE: 2,
    ACTIVATED: 3,
    DEACTIVATED: 4
});

const ToggleQuestionGenerationComponent = function (props) {
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
                styles.toggleQuestionGeneration,
                {
                    [styles.active]: active,
                    [styles.activated]: state === QuestionGenerationState.ACTIVATED,
                    [styles.deactivated]: state === QuestionGenerationState.DEACTIVATED
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
    active: PropTypes.bool,
    state: PropTypes.oneOf(Object.values(QuestionGenerationState)).isRequired
};

ToggleQuestionGenerationComponent.defaultProps = {
    title: 'Toggle question generation'
};

export default ToggleQuestionGenerationComponent;

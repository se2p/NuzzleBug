import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import iconQuestions from './icon--questions.svg';

import styles from './ir-question-button.css';

const IRQuestions = props => {
    const {
        active,
        className,
        onClick,
        title,
        ...componentProps
    } = props;

    return (
        <>
            <img
                className={classNames(
                    className,
                    styles.irQuestionsButton,
                    {
                        [styles.isActive]: active
                    }
                )}
                draggable={false}
                aria-disabled={active}
                src={iconQuestions}
                title={title}
                onClick={active ? onClick : null}
                {...componentProps}
            />
        </>
    );
};

IRQuestions.propTypes = {
    active: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

IRQuestions.defaultProps = {
    title: 'Show Questions'
};

export default IRQuestions;

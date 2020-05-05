import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import iconQuestions from './icon--questions.svg';

import styles from './ir-question-button.css';

const messages = defineMessages({
    showQuestionTitle: {
        id: 'gui.ir-questions.show-question',
        defaultMessage: 'Show Questions',
        description: 'Show question button title'
    }
});

const IRQuestions = props => {
    const {
        active,
        className,
        intl,
        onClick,
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
                title={intl.formatMessage(messages.showQuestionTitle)}
                onClick={active ? onClick : null}
                {...componentProps}
            />
        </>
    );
};

IRQuestions.propTypes = {
    active: PropTypes.bool.isRequired,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onClick: PropTypes.func.isRequired
};

export default injectIntl(IRQuestions);

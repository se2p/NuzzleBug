import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';

import {Question} from '../../lib/ir-questions';

import styles from './question.css';
import Box from '../box/box.jsx';

const IRQuestion = props => {
    const {
        className,
        intl,
        onClick,
        question,
        ...componentProps
    } = props;
    return (
        <li
            key={question.id}
            className={classNames(styles.irQuestion, className)}
            {...componentProps}
        >
            <Box className={styles.irQuestion}>
                <span className={styles.irQuestionText}>
                    {question.text}
                </span>
                <button
                    className={styles.irQuestionAnswerButton}
                    onClick={onClick}
                >
                    <span className={styles.irQuestionAnswerButtonText}>
                        <FormattedMessage
                            defaultMessage="Show Answer"
                            description="Label for button to show answer for interrogative debugging question"
                            id="gui.ir-questions.show-answer"
                        />
                    </span>
                </button>
            </Box>
        </li>
    );
};

IRQuestion.propTypes = {
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onClick: PropTypes.func.isRequired,
    question: PropTypes.instanceOf(Question).isRequired
};

IRQuestion.defaultProps = {
};

export default injectIntl(IRQuestion);

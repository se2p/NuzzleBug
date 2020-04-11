import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';

import {Statement} from 'scratch-ir';

import styles from './question-answer-statement.css';

/* eslint-disable-next-line react/prefer-stateless-function */
class QuestionAnswerStatement extends React.Component {
    /* eslint-disable-next-line no-useless-constructor */
    constructor (props) {
        super(props);
    }

    // TODO Phil 05/03/2020: could add onClick method which lets the specific block glow

    render () {
        const {
            intl,
            letBlockGlow,
            statement
        } = this.props;
        return (
            <li
                className={styles.irAnswerStatement}
                onClick={letBlockGlow}
            >
                <span> {statement.opcode} </span>
                <span> {statement.startValue} {'->'} {statement.endValue} </span>
            </li>
        );
    }
}

QuestionAnswerStatement.propTypes = {
    intl: intlShape.isRequired,
    letBlockGlow: PropTypes.func,
    statement: PropTypes.instanceOf(Trace)
};

export default injectIntl(QuestionAnswerStatement);

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';

import QuestionAnswerStatement from '../ir-question-answer-statement/question-answer-statement.jsx';
import {Answer} from 'scratch-ir';

import styles from './question-answer.css';

import bindAll from 'lodash.bindall';
import Box from '../box/box.jsx';

class QuestionAnswer extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'renderStatements'
        ]);
    }

    renderStatements (statements) {
        return statements.map(statement =>
            (<QuestionAnswerStatement
                key={this.props.answer.id}
                intl={this.props.intl}
                statement={statement}
                glowFunction={this.props.glowFunction}
            />)
        );
    }

    render () {
        const {
            // eslint-disable-next-line no-unused-vars
            intl,
            answer,
            // eslint-disable-next-line no-unused-vars
            glowFunction
        } = this.props;

        const statements = answer.statements ? answer.statements : [];
        const variable = answer.variable;
        const startValue = answer.startValue;
        const endValue = answer.endValue;

        const renderedStatements = this.renderStatements(statements);

        return (
            <Box
                className={styles.irAnswer}
            >
                <span>
                    {answer.text}
                </span>
                <br />
                {variable ? (
                    <div>
                        <span>{`${variable.name} was changed ${statements.length} times.`}</span>
                        <br />
                        <span>{`Start value: ${startValue}`}</span>
                        <br />
                        <span>{`End value: ${endValue}.`}</span>
                    </div>
                ) : null }
                {statements.length ? (
                    <ul className={styles.irAnswerStatements}>
                        {renderedStatements}
                    </ul>
                ) : null }
            </Box>
        );
    }
}

QuestionAnswer.propTypes = {
    intl: intlShape.isRequired,
    answer: PropTypes.instanceOf(Answer).isRequired,
    glowFunction: PropTypes.func.isRequired
};

QuestionAnswer.defaultProps = {};

export default injectIntl(QuestionAnswer);

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import {Question} from '../../lib/interrogative-debugging/ir-questions';
import QuestionAnswer from '../ir-question-answer/question-answer.jsx';

import styles from './question-row.css';
import Box from '../box/box.jsx';

import bindAll from 'lodash.bindall';

const messages = defineMessages({
    showAnswer: {
        id: 'gui.ir-questions.show-answer',
        defaultMessage: 'Show Answer',
        description: `Label for button to show answer for interrogative debugging question`
    },
    calculating: {
        id: 'gui.ir-questions.show-answer-calculation',
        defaultMessage: 'Calculating...',
        description: `Indication that an interrogative debugging question's answer is calculating.`
    }
});

class IRQuestionRow extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleShowQuestion'
        ]);
        this.state = {
            showAnswer: false,
            calculating: false
        };
    }

    handleShowQuestion (e) {
        e.preventDefault();
        if (this.state.showAnswer) {
            this.setState({showAnswer: false});
        } else {
            this.setState({showAnswer: true});
            if (!this.state.answer) {
                this.setState({calculating: true}, () => {
                    const answer = this.props.computeAnswer();
                    this.setState({
                        answer: answer,
                        calculating: false
                    });
                });
            }
        }
    }

    render () {
        const {
            className,
            intl,
            question,
            // eslint-disable-next-line no-unused-vars
            computeAnswer,
            ...componentProps
        } = this.props;
        return (
            <li
                key={question.id}
                className={classNames(styles.irQuestionContainer, className)}
                {...componentProps}
            >
                <Box className={styles.irQuestion}>
                    <span className={styles.irQuestionText}>
                        {question.text}
                    </span>
                    <button
                        className={styles.irQuestionAnswerButton}
                        onClick={this.handleShowQuestion}
                    >
                        <span className={styles.irQuestionAnswerButtonText}>
                            {intl.formatMessage(messages.showAnswer)}
                        </span>
                    </button>
                </Box>
                <Box>
                    {this.state.calculating && !this.state.showAnswer ? (
                        <span>
                            {intl.formatMessage(messages.calculating)}
                        </span>
                    ) : null}
                    {this.state.showAnswer && this.state.answer ? (
                        <QuestionAnswer
                            key={this.state.answer.id}
                            intl={intl}
                            answer={this.state.answer}
                        />
                    ) : null}
                </Box>
            </li>
        );
    }

}

IRQuestionRow.propTypes = {
    className: PropTypes.string,
    intl: intlShape.isRequired,
    question: PropTypes.instanceOf(Question).isRequired,
    computeAnswer: PropTypes.func.isRequired
};

IRQuestionRow.defaultProps = {};

export default injectIntl(IRQuestionRow);

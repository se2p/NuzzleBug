import React, {Fragment} from 'react';
import bindAll from 'lodash.bindall';
import Box from '../box/box.jsx';
import irStyles from './ir-cards.css';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import {Question} from 'scratch-ir';
import IRAnswer from './ir-answer.jsx';

class IRQuestion extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleShowQuestion'
        ]);
        this.state = {
            answer: null,
            showAnswer: false,
            calculating: false
        };
    }

    handleShowQuestion (e) {
        e.preventDefault();
        const computeAnswer = this.props.computeAnswer;

        if (this.state.showAnswer) {
            this.setState({showAnswer: false});
        } else {
            this.setState({showAnswer: true});
            if (!this.state.answer) {
                this.setState({calculating: true}, () => {
                    const answer = computeAnswer(this.props.question);
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
            intl,
            glowBlock,
            question
        } = this.props;
        const text = question.text;
        return (
            <Fragment>
                <Box className={irStyles.question}>
                    <span className={irStyles.questionText}>
                        {intl.formatMessage(text.msg, text.data)}
                    </span>
                    <button
                        className={irStyles.showAnswerButton}
                        onClick={this.handleShowQuestion}
                    >
                        <span>
                            {this.state.showAnswer ? (
                                <FormattedMessage
                                    defaultMessage="Hide Answer"
                                    description="Label for button to hide answer for interrogative debugging question"
                                    id="gui.ir-questions.hide-answer"
                                />
                            ) : (
                                <FormattedMessage
                                    defaultMessage="Show Answer"
                                    description="Label for button to show answer for interrogative debugging question"
                                    id="gui.ir-questions.show-answer"
                                />
                            )}
                        </span>
                    </button>
                </Box>
                <Box>
                    {this.state.calculating && !this.state.showAnswer ? (
                        <FormattedMessage
                            id="gui.ir-questions.show-answer-calculation"
                            description="Indication that an interrogative debugging question's answer is calculating."
                            defaultMessage="Calculating..."
                        />
                    ) : null}
                    {this.state.showAnswer && this.state.answer ? (
                        <IRAnswer
                            answer={this.state.answer}
                            glowBlock={glowBlock}
                        />
                    ) : null}
                </Box>
            </Fragment>
        );
    }
}

IRQuestion.propTypes = {
    intl: intlShape.isRequired,
    computeAnswer: PropTypes.func.isRequired,
    glowBlock: PropTypes.func.isRequired,
    question: PropTypes.instanceOf(Question).isRequired
};

export default injectIntl(IRQuestion);

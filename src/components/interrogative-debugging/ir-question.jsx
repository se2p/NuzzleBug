import React, {Fragment} from 'react';
import bindAll from 'lodash.bindall';
import Box from '../box/box.jsx';
import irStyles from './ir-cards.css';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import {Question} from 'scratch-ir';
import IRAnswer from './ir-answer.jsx';

const defaultState = {
    answer: null,
    showAnswer: false
};

class IRQuestion extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleShowQuestion'
        ]);
        this.state = defaultState;
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (this.props.question !== nextProps.question) {
            this.setState(defaultState);
            return true;
        }
        if (this.state.answer !== nextState.answer || this.state.showAnswer !== nextState.showAnswer) {
            return true;
        }
        return false;
    }

    handleShowQuestion (e) {
        e.preventDefault();

        if (this.state.showAnswer) {
            this.setState({showAnswer: false});
        } else {
            this.setState({showAnswer: true});
            if (!this.state.answer) {
                const answer = this.props.computeAnswer(this.props.question);
                this.setState({
                    answer: answer
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

import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import {Question} from 'scratch-ir';

import IRAnswer from './ir-answer.jsx';
import Box from '../box/box.jsx';
import irStyles from './ir-cards.css';
import styles from './ir-cards.css';
import iconHeadLight from './icon--light-head.svg';
import iconHide from './icon--hide.svg';
import iconShow from './icon--show.svg';

const messages = defineMessages({
    showAnswerTitle: {
        id: 'gui.ir-question.show-answer',
        defaultMessage: 'Show Answer',
        description: 'Show answer button title'
    },
    hideAnswerTitle: {
        id: 'gui.ir-question.hide-answer',
        defaultMessage: 'Hide Answer',
        description: 'Hide answer button title'
    }
});

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
            <>
                <Box className={irStyles.question}>
                    <div className={irStyles.questionTextContainer}>
                        <img
                            className={styles.showIcon}
                            alt={'Question Indicator'}
                            src={iconHeadLight}
                        />
                        <span className={irStyles.questionText}>
                            {intl.formatMessage(text.msg, text.data)}
                        </span>
                    </div>
                    <button
                        className={irStyles.showAnswerButton}
                        onClick={this.handleShowQuestion}
                    >
                        {this.state.showAnswer ?
                            <img
                                className={styles.buttonIcon}
                                title={intl.formatMessage(messages.hideAnswerTitle)}
                                src={iconHide}
                            /> :
                            <img
                                className={styles.buttonIcon}
                                title={intl.formatMessage(messages.showAnswerTitle)}
                                src={iconShow}
                            />
                        }
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
            </>
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

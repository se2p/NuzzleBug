import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';

import {Question_v2 as Question} from 'scratch-ir';

import styles from './ir-question.css';

class IRQuestion extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleQuestionClick'
        ]);
    }

    handleQuestionClick () {
        const {
            question,
            onQuestionClick
        } = this.props;
        onQuestionClick(question);
    }

    render () {
        const {
            question,
            selectedQuestion,
            color
        } = this.props;
        const isSelected = selectedQuestion && question.id === selectedQuestion.id;
        return (
            <div onClick={this.handleQuestionClick}>
                <div
                    className={styles.questionBackground}
                    style={isSelected ? {backgroundColor: color} : null}
                />
                <div
                    className={styles.questionBorder}
                    style={isSelected ? {borderColor: color} : null}
                />
                <div
                    className={styles.questionText}
                    style={isSelected ? {color: 'black'} : null}
                >
                    {question.text}
                </div>
            </div>
        );
    }
}

IRQuestion.propTypes = {
    question: PropTypes.instanceOf(Question).isRequired,
    selectedQuestion: PropTypes.instanceOf(Question),
    onQuestionClick: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired
};

export default injectIntl(IRQuestion);

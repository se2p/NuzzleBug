import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {FormattedHTMLMessage} from 'react-intl';

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
                    <FormattedHTMLMessage
                        tagName="div"
                        {...question.message}
                    />
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

export default IRQuestion;

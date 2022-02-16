import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {FormattedHTMLMessage} from 'react-intl';
import classNames from 'classnames';

import {QuestionV2 as Question} from 'scratch-ir';

import styles from './ir-question.css';
import irStyles from '../ir-styles.css';

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

    _hexToRgba (hex, a) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `rgb(${r}, ${g}, ${b}, ${a})`;
        }
        return null;
    }

    render () {
        const {
            question,
            selectedQuestion
        } = this.props;
        const isSelected = selectedQuestion && question.id === selectedQuestion.id;
        return (
            <div onClick={this.handleQuestionClick}>
                <div
                    className={classNames(styles.questionText, irStyles[`color-${question.color.replace('#', '')}`])}
                    style={isSelected ? {
                        color: 'black',
                        borderColor: question.color,
                        backgroundColor: this._hexToRgba(question.color, 0.3)
                    } : null}
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
    onQuestionClick: PropTypes.func.isRequired
};

export default IRQuestion;

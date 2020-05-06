import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';

import {Question} from 'scratch-ir';

import irStyles from './ir-cards.css';

import IRQuestion from './ir-question.jsx';


class QuestionCategory extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'renderRows'
        ]);
    }

    renderRows (questions) {
        const {
            computeAnswer,
            glowBlock,
            formatBlock
        } = this.props;
        return questions.map(question => (
            <li
                key={question.id}
                className={irStyles.questionContainer}
            >
                <IRQuestion
                    computeAnswer={computeAnswer}
                    glowBlock={glowBlock}
                    question={question}
                    formatBlock={formatBlock}
                />
            </li>
        ));
    }

    render () {
        const {
            category
        } = this.props;
        return (
            <div className={irStyles.categoryContainer}>
                {category.questions.length ? (
                    <ul className={irStyles.questionList}>
                        {this.renderRows(category.questions)}
                    </ul>
                ) : category.info.id ? (
                    <span>{`No questions for ${category.info.isStage ? 'the ' : ''}${category.info.name}`}</span>
                ) : null}
            </div>
        );
    }
}

QuestionCategory.propTypes = {
    category: PropTypes.shape({
        info: PropTypes.shape({
            name: PropTypes.string,
            id: PropTypes.string,
            currentCostume: PropTypes.number,
            direction: PropTypes.number,
            isStage: PropTypes.bool,
            isOriginal: PropTypes.bool,
            visible: PropTypes.bool,
            xPosition: PropTypes.number,
            yPosition: PropTypes.number
        }).isRequired,
        questions: PropTypes.arrayOf(PropTypes.instanceOf(Question)).isRequired
    }).isRequired,
    computeAnswer: PropTypes.func.isRequired,
    formatBlock: PropTypes.func.isRequired,
    glowBlock: PropTypes.func.isRequired
};

export default QuestionCategory;

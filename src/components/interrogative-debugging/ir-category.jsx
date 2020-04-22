import React from 'react';
import PropTypes from 'prop-types';

import {Question} from 'scratch-ir';

import irStyles from './ir-cards.css';

import IRQuestion from './ir-question.jsx';

const renderRows = (questions, computeAnswer, glowBlock) =>
    questions.map(question => (
        <li
            key={question.id}
            className={irStyles.questionContainer}
        >
            <IRQuestion
                computeAnswer={computeAnswer}
                glowBlock={glowBlock}
                question={question}
            />
        </li>
    ));


const QuestionCategory = ({category, computeAnswer, glowBlock}) => (
    <div className={irStyles.categoryContainer}>
        {category.questions.length ? (
            <ul className={irStyles.questionList}>
                {renderRows(category.questions, computeAnswer, glowBlock)}
            </ul>
        ) : category.info.id ? (
            <span>{`No questions for ${category.info.isStage ? 'the ' : ''}${category.info.name}`}</span>
        ) : null}
    </div>
);

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
    glowBlock: PropTypes.func.isRequired
};

export default QuestionCategory;

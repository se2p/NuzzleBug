import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';

import {Question} from 'scratch-ir';

import irStyles from './ir-cards.css';

import {StatementFormatter} from '../../lib/libraries/ir-messages.js';
import IRQuestion from './ir-question.jsx';


class QuestionCategory extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'renderRows'
        ]);
    }

    renderRows (questions) {
        return questions.map(question => (
            <li
                key={question.id}
                className={irStyles.questionContainer}
            >
                <IRQuestion
                    question={question}
                    {...this.props}
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
                <ul className={irStyles.questionList}>
                    {category.questions.length ? this.renderRows(category.questions) : null}
                </ul>
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
    statementFormatter: PropTypes.instanceOf(StatementFormatter).isRequired,
    glowBlock: PropTypes.func.isRequired
};

export default QuestionCategory;

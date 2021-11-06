import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import {injectIntl} from 'react-intl';

import {QuestionCategory, Question_v2 as Question} from 'scratch-ir';

import IRQuestion from '../ir-question/ir-question.jsx';
import iconArrowRight from '../icons/icon--arrow-right.svg';
import iconArrowDown from '../icons/icon--arrow-down.svg';
import styles from './ir-question-category.css';

class IRQuestionCategory extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleToggleExpansion',
            'renderQuestions'
        ]);
        this.state = {
            expanded: false
        };
    }

    handleToggleExpansion () {
        this.setState(state => ({
            expanded: !state.expanded
        }));
    }

    renderQuestions (questions, color) {
        const {
            onQuestionClick,
            selectedQuestion
        } = this.props;
        
        return (
            <ul className={styles.questionList}>
                {questions.map(question => (
                    <li
                        key={question.id}
                        className={styles.questionListItem}
                    >
                        <IRQuestion
                            question={question}
                            selectedQuestion={selectedQuestion}
                            onQuestionClick={onQuestionClick}
                            color={color}
                        />
                    </li>
                ))}
            </ul>
        );
    }
    
    render () {
        const {
            questionCategory,
            renderCategories,
            color
        } = this.props;

        return (
            <div>
                <div
                    className={styles.category}
                    onClick={this.handleToggleExpansion}
                >
                    <button className={styles.arrowButton}>
                        <img
                            title={this.state.expanded ? 'Close category' : 'Expand category'} // @Adina ToDo: Translate
                            src={this.state.expanded ? iconArrowDown : iconArrowRight}
                            className={questionCategory.color ?
                                classNames(styles.icon, styles.whiteIcon) :
                                classNames(styles.icon, styles.grayIcon)}
                        />
                    </button>
                    <div className={styles.categoryText}>
                        {questionCategory.name}
                    </div>
                </div>
                {this.state.expanded ? (
                    <div>
                        {questionCategory.questionCategories && questionCategory.questionCategories.length ?
                            renderCategories(questionCategory.questionCategories, styles, color) : null}
                        {questionCategory.questions && questionCategory.questions.length ?
                            this.renderQuestions(questionCategory.questions, color) : null}
                    </div>
                ) : null}
            </div>
        );
    }
}

IRQuestionCategory.propTypes = {
    questionCategory: PropTypes.instanceOf(QuestionCategory).isRequired,
    renderCategories: PropTypes.func.isRequired,
    selectedQuestion: PropTypes.instanceOf(Question),
    onQuestionClick: PropTypes.func.isRequired,
    color: PropTypes.string.isRequired
};

export default injectIntl(IRQuestionCategory);

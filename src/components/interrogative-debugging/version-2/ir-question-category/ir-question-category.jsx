import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import {injectIntl, intlShape} from 'react-intl';

import logging from 'scratch-vm/src/util/logging.js';

import {QuestionCategory, QuestionV2 as Question} from 'scratch-ir';

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

    componentDidMount () {
        if (this.props.selectedQuestion && !this.state.expanded) {
            const questionId = this.props.selectedQuestion.id;
            const category = this.props.questionCategory;
            if (this._containsQuestion(category, questionId)) {
                this.handleToggleExpansion();
            }
        }
    }

    _containsQuestion (category, questionId) {
        if (category.questions &&
            category.questions.some(question => question.id === questionId)) {
            return true;
        }
        if (category.questionCategories) {
            for (const childCategory of category.questionCategories) {
                if (this._containsQuestion(childCategory, questionId)) {
                    return true;
                }
            }
        }
        return false;
    }

    handleToggleExpansion (event) {
        if (event && logging.isActive()) {
            logging.logQuestionEvent(
                'QUESTION_CATEGORY',
                new Date(),
                this.state.expanded ? 'CLOSE_CATEGORY' : 'OPEN_CATEGORY',
                null,
                null,
                null,
                null,
                this.props.questionCategory.type,
                this.props.questionCategory.form ? this.props.questionCategory.form : '',
                null
            );
        }
        this.setState(state => ({
            expanded: !state.expanded
        }));
    }

    renderQuestions (questions) {
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
                        />
                    </li>
                ))}
            </ul>
        );
    }

    render () {
        const {
            intl,
            questionCategory,
            selectedCategory,
            renderCategories
        } = this.props;

        if(selectedCategory && selectedCategory.id === questionCategory.id){
            this.state.expanded = true;
        }

        return (
            <div>
                <div
                    className={styles.category}
                    onClick={this.handleToggleExpansion}
                >
                    <button className={styles.arrowButton}>
                        <img
                            title={this.state.expanded ?
                                intl.formatMessage({
                                    defaultMessage: 'Close category',
                                    description: 'Title for button to close the category',
                                    id: 'gui.ir-debugger.category.close'
                                }) :
                                intl.formatMessage({
                                    defaultMessage: 'Expand category',
                                    description: 'Title for button to expand the category',
                                    id: 'gui.ir-debugger.category.expand'
                                })
                            }
                            src={this.state.expanded ? iconArrowDown : iconArrowRight}
                            className={questionCategory.color ?
                                classNames(styles.icon, styles.whiteIcon) :
                                classNames(styles.icon, styles.grayIcon)}
                        />
                    </button>
                    <div className={styles.categoryText}>
                        {intl.formatMessage(questionCategory.message)}
                    </div>
                </div>
                {this.state.expanded ? (
                    <div>
                        {questionCategory.questionCategories && questionCategory.questionCategories.length ?
                            renderCategories(questionCategory.questionCategories, styles) : null}
                        {questionCategory.questions && questionCategory.questions.length ?
                            this.renderQuestions(questionCategory.questions) : null}
                    </div>
                ) : null}
            </div>
        );
    }
}

IRQuestionCategory.propTypes = {
    intl: intlShape.isRequired,
    questionCategory: PropTypes.instanceOf(QuestionCategory).isRequired,
    renderCategories: PropTypes.func.isRequired,
    selectedQuestion: PropTypes.instanceOf(Question),
    onQuestionClick: PropTypes.func.isRequired
};

export default injectIntl(IRQuestionCategory);

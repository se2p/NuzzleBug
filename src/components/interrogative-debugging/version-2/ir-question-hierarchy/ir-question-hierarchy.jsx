import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';

import {QuestionCategory, QuestionV2 as Question} from 'scratch-ir';

import hierarchyStyles from './ir-question-hierarchy.css';
import IRQuestionCategory from '../ir-question-category/ir-question-category.jsx';

class IRQuestionHierarchy extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'renderCategories'
        ]);
    }

    renderCategories (categories, styles) {
        const {
            intl,
            onQuestionClick,
            selectedQuestion,
            selectedCategory
        } = this.props;

        return (
            <ul className={styles.categoryList}>
                {categories.map(category => (
                    <li
                        key={category.id}
                        className={styles.categoryListItem}
                        style={category.color ? {
                            backgroundColor: category.color,
                            color: 'white'
                        } : null}
                    >
                        <IRQuestionCategory
                            intl={intl}
                            questionCategory={category}
                            renderCategories={this.renderCategories}
                            selectedCategory={selectedCategory}
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
            questionHierarchy
        } = this.props;

        return questionHierarchy.length ?
            this.renderCategories(questionHierarchy, hierarchyStyles) :
            <FormattedMessage
                defaultMessage="No questions available"
                description="Title of empty question hierarchy"
                id="gui.ir-debugger.question-hierarchy.empty"
            />;
    }
}

IRQuestionHierarchy.propTypes = {
    intl: intlShape.isRequired,
    questionHierarchy: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)).isRequired,
    selectedQuestion: PropTypes.instanceOf(Question),
    onQuestionClick: PropTypes.func.isRequired
};

export default injectIntl(IRQuestionHierarchy);

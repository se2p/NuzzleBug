import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {injectIntl, intlShape} from 'react-intl';

import {QuestionCategory, Question_v2 as Question} from 'scratch-ir';

import hierarchyStyles from './ir-question-hierarchy.css';
import IRQuestionCategory from '../ir-question-category/ir-question-category.jsx';

class IRQuestionHierarchy extends React.Component {
    
    constructor (props) {
        super(props);
        bindAll(this, [
            'renderCategories'
        ]);
    }

    renderCategories (categories, styles, color) {
        const {
            intl,
            onQuestionClick,
            selectedQuestion
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
                            selectedQuestion={selectedQuestion}
                            onQuestionClick={onQuestionClick}
                            color={category.color ? category.color : color}
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
        return this.renderCategories(questionHierarchy, hierarchyStyles, 'white');
    }
}

IRQuestionHierarchy.propTypes = {
    intl: intlShape.isRequired,
    questionHierarchy: PropTypes.arrayOf(PropTypes.instanceOf(QuestionCategory)).isRequired,
    selectedQuestion: PropTypes.instanceOf(Question),
    onQuestionClick: PropTypes.func.isRequired
};

export default injectIntl(IRQuestionHierarchy);

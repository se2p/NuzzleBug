import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';
import VM from 'scratch-vm';

import {Question} from '../../lib/ir-questions';

import Box from '../box/box.jsx';
import styles from './question-category.css';

import bindAll from 'lodash.bindall';
import IRQuestionRow from '../ir-question-row/question-row.jsx';

class IRQuestionCategory extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'questionRows'
        ]);
    }

    questionRows (questions) {
        return questions.map(question =>
            (<IRQuestionRow
                key={question.id}
                question={question}
                vm={this.props.vm}
            />)
        );
    }

    render () {
        const {
            category,
            questions
        } = this.props;

        const renderedQuestions = this.questionRows(questions);

        return questions.length ? (
            <Box/* className={styles.irQuestionsCategory}*/>
                <h4 className={styles.irQuestionsCategoryName}>{category.name}</h4>
                <ul>
                    {renderedQuestions}
                </ul>
            </Box>
        ) : null;
    }
}

IRQuestionCategory.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
    questions: PropTypes.arrayOf(PropTypes.instanceOf(Question)).isRequired,
    category: PropTypes.shape({
        name: PropTypes.string
    }).isRequired
};

IRQuestionCategory.defaultProps = {
    category: {info: 'Category Name'}
};

export default injectIntl(IRQuestionCategory);

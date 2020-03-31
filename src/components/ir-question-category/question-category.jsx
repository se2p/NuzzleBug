import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';
import VM from 'scratch-vm';

import {ControlDependenceGraph, ControlFlowGraph} from 'scratch-analysis';
import {Question, computeQuestionAnswer} from '../../lib/interrogative-debugging/ir-questions';

import Box from '../box/box.jsx';
import styles from './question-category.css';

import bindAll from 'lodash.bindall';
import IRQuestionRow from '../ir-question-row/question-row.jsx';

class IRQuestionCategory extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'questionRows',
            'computeQuestionsAnswer'
        ]);
    }

    computeQuestionsAnswer (question) {
        const vm = this.props.vm;
        const traceMap = this.props.traceMap;
        const cfg = this.props.cfg;
        const cdg = this.props.cdg;

        return () => computeQuestionAnswer(question, vm, traceMap, cfg, cdg);

    }

    questionRows (questions) {
        return questions.map(question =>
            (<IRQuestionRow
                key={question.id}
                question={question}
                computeAnswer={this.computeQuestionsAnswer(question)}
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
    traceMap: PropTypes.instanceOf(Map).isRequired,
    cfg: PropTypes.instanceOf(ControlFlowGraph).isRequired,
    cdg: PropTypes.instanceOf(ControlDependenceGraph).isRequired,
    questions: PropTypes.arrayOf(PropTypes.instanceOf(Question)).isRequired,
    category: PropTypes.shape({
        name: PropTypes.string
    }).isRequired
};

IRQuestionCategory.defaultProps = {
    category: {info: 'Category Name'}
};

export default injectIntl(IRQuestionCategory);

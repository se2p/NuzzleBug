import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import iconQuestions from './icon--questions.svg';
import {computeQuestions, createTraceMap} from '../../lib/interrogative-debugging/ir-questions';
import {generateCDG, generateCFG} from 'scratch-analysis';

import IRQuestionCategory from '../ir-question-category/question-category.jsx';
import VM from 'scratch-vm';

import styles from './questions.css';
import Modal from '../../containers/modal.jsx';
import Box from '../box/box.jsx';
import bindAll from 'lodash.bindall';

const messages = defineMessages({
    showQuestionTitle: {
        id: 'gui.ir-questions.show-question',
        defaultMessage: 'Show Question',
        description: 'Show question button title'
    }
});

class IRQuestions extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleQuestionModalOpenClick',
            'handleQuestionModalCloseClick',
            'questionCategories'
        ]);
        this.state = {questionModal: false};
    }

    handleQuestionModalOpenClick () {
        if (this.props.active) {
            this.setState({questionModal: true});
        }
    }

    handleQuestionModalCloseClick () {
        this.setState({questionModal: false});
    }

    questionCategories (categories, traceMap, cfg, cdg) {
        return categories.map(category =>
            (<IRQuestionCategory
                key={category.info.name}
                category={category.info}
                questions={category.questions}
                vm={this.props.vm}
                traceMap={traceMap}
                cfg={cfg}
                cdg={cdg}
            />)
        );
    }

    render () {
        const {
            active,
            className,
            intl,
            vm,
            ...componentProps
        } = this.props;
        let cfg;
        let cdg;
        let traceMap;
        let questionCategories;

        if (active && this.state.questionModal) {
            cfg = generateCFG(vm);
            cdg = generateCDG(cfg);
            traceMap = createTraceMap(vm);

            questionCategories = computeQuestions(vm, traceMap, cfg, cdg);
        } else {
            questionCategories = null;
        }
        // TODO Phil 05/03/2020: Could differentiate between no green flag exists or just nothing triggered yet.

        return (
            <>
                <img
                    className={classNames(
                        className,
                        styles.irQuestionsButton,
                        {
                            [styles.isActive]: active
                        }
                    )}
                    draggable={false}
                    src={iconQuestions}
                    title={intl.formatMessage(messages.showQuestionTitle)}
                    onClick={this.handleQuestionModalOpenClick}
                    {...componentProps}
                />
                {this.state.questionModal ?
                    (!questionCategories || questionCategories.empty) ? (
                        <Modal
                            id={'ir-questions-categories'}
                            className={styles.irQuestionsModal}
                            onRequestClose={this.handleQuestionModalCloseClick}
                            contentLabel={'Why did nothing happen?'}
                        >
                            <Box className={styles.irQuestionsModalBody}>
                                <ul>
                                    <li><span>{'You have to click the Green Flag to start.'}</span></li>
                                    <li><span>{'Or you forgot a script triggered by the Green Flag.'}</span></li>
                                </ul>
                            </Box>
                        </Modal>
                    ) : (
                        <Modal
                            id={'ir-questions-categories'}
                            className={styles.irQuestionsModal}
                            onRequestClose={this.handleQuestionModalCloseClick}
                            contentLabel={'Why did all of that just happen?'}
                        >
                            <Box className={styles.irQuestionsModalBody}>
                                {this.questionCategories(questionCategories.misc, traceMap, cfg, cdg)}
                                {this.questionCategories(questionCategories.targets, traceMap, cfg, cdg)}
                            </Box>
                        </Modal>
                    ) : null}
            </>
        );
    }
}

IRQuestions.propTypes = {
    active: PropTypes.bool.isRequired,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default injectIntl(IRQuestions);

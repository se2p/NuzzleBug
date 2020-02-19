import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import iconQuestions from './icon--questions.svg';
import {computeQuestions} from '../../lib/ir-questions';

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

    questionCategories (categories) {
        return categories.map(category =>
            (<IRQuestionCategory
                key={category.info.name}
                category={category.info}
                questions={category.questions}
                vm={this.props.vm}
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
        const questionCategories = computeQuestions(vm);

        return (
            <div>
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
                {this.state.questionModal ? (
                    <Modal
                        id={'ir-questions-categories'}
                        className={styles.irQuestionsModal}
                        onRequestClose={this.handleQuestionModalCloseClick}
                        contentLabel={'Why did all of that just happen?'}
                    >
                        <Box className={styles.irQuestionsModalBody}>
                            {this.questionCategories(questionCategories.misc)}
                            {this.questionCategories(questionCategories.targets)}
                            {this.questionCategories(questionCategories.globalVariables)}
                        </Box>
                    </Modal>
                ) : null}
            </div>
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

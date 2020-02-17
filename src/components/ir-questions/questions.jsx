import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import iconQuestions from './icon--questions.svg';
import {Question} from '../../lib/ir-questions';

import IRQuestion from '../ir-question-row/question.jsx';

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
            'buildHandleShowQuestion'
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
    buildHandleShowQuestion (question) {
        return e => {
            e.preventDefault();
            // TODO Phil 17/02/2020: Calculate answer and show answer modal
            console.log(question);
        };
    }

    render () {
        const {
            active,
            className,
            intl,
            questions,
            ...componentProps
        } = this.props;
        const renderedQuestions = questions.map(question =>
            (<IRQuestion
                key={question.id}
                question={question}
                onClick={this.buildHandleShowQuestion(question)}
            />)
        );
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
                {this.state.questionModal && renderedQuestions ? (
                    <Modal
                        id={'ir-questions'}
                        className={styles.irQuestionsModal}
                        onRequestClose={this.handleQuestionModalCloseClick}
                        contentLabel={'Why did all of that just happen?'}
                    >
                        <Box className={styles.irQuestionsModalBody}>
                            <Box className={styles.irQuestionsList}>
                                <ul>
                                    {renderedQuestions}
                                </ul>
                            </Box>
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
    questions: PropTypes.arrayOf(PropTypes.instanceOf(Question)).isRequired
};

export default injectIntl(IRQuestions);

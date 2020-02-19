import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';
import VM from 'scratch-vm';

import {computeQuestionAnswer, Question} from '../../lib/ir-questions';

import styles from './question-row.css';
import Box from '../box/box.jsx';

import bindAll from 'lodash.bindall';

class IRQuestionRow extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleShowQuestion'
        ]);
    }

    handleShowQuestion (e) {
        e.preventDefault();
        // TODO Phil 17/02/2020: Calculate answer and show answer modal
        computeQuestionAnswer(this.props.question, this.props.vm);
    }

    render () {
        const {
            className,
            question,
            ...componentProps
        } = this.props;
        return (
            <li
                key={question.id}
                className={classNames(styles.irQuestion, className)}
                {...componentProps}
            >
                <Box className={styles.irQuestion}>
                    <span className={styles.irQuestionText}>
                        {question.text}
                    </span>
                    <button
                        className={styles.irQuestionAnswerButton}
                        onClick={this.handleShowQuestion}
                    >
                        <span className={styles.irQuestionAnswerButtonText}>
                            <FormattedMessage
                                defaultMessage="Show Answer"
                                description="Label for button to show answer for interrogative debugging question"
                                id="gui.ir-questions.show-answer"
                            />
                        </span>
                    </button>
                </Box>
            </li>
        );
    }

}

IRQuestionRow.propTypes = {
    className: PropTypes.string,
    intl: intlShape.isRequired,
    question: PropTypes.instanceOf(Question).isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

IRQuestionRow.defaultProps = {};

export default injectIntl(IRQuestionRow);

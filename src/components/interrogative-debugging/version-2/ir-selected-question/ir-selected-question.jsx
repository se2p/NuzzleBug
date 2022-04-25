import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, FormattedHTMLMessage} from 'react-intl';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';

import {QuestionV2 as Question} from 'scratch-ir';

import styles from './ir-selected-question.css';
import irStyles from '../ir-styles.css';

import thinkBubble from '../icons/icon--think-bubble.svg';
import positiveFeedback from '../icons/icon--positive-feedback.svg';
import neutralFeedback from '../icons/icon--neutral-feedback.svg';
import negativeFeedback from '../icons/icon--negative-feedback.svg';

const Feedback = Object.freeze({
    POSITIVE: 1,
    NEUTRAL: 0,
    NEGATIVE: -1
});

class IRSelectedQuestion extends React.Component {

    constructor (props) {
        super(props);
        this.state = {};

        bindAll(this, [
            'handleFeedback',
            'handlePositiveFeedback',
            'handleNeutralFeedback',
            'handleNegativeFeedback'
        ]);
    }
    
    handleFeedback (value) {
        if (this.props.selectedQuestion.feedback === value) {
            this.props.selectedQuestion.feedback = null;
        } else {
            this.props.selectedQuestion.feedback = value;
        }
        this.forceUpdate();
    }

    getFeedbackIcon (feedback) {
        if (feedback === Feedback.POSITIVE) {
            return positiveFeedback;
        }
        if (feedback === Feedback.NEUTRAL) {
            return neutralFeedback;
        }
        if (feedback === Feedback.NEGATIVE) {
            return negativeFeedback;
        }
    }

    handlePositiveFeedback () {
        this.handleFeedback(Feedback.POSITIVE);
    }

    handleNeutralFeedback () {
        this.handleFeedback(Feedback.NEUTRAL);
    }

    handleNegativeFeedback () {
        this.handleFeedback(Feedback.NEGATIVE);
    }

    render () {
        const {
            selectedQuestion
        } = this.props;
        return (
            <div>
                {selectedQuestion ? (
                    <div>
                        <div
                            className={classNames(
                                styles.selectedQuestion,
                                irStyles[`color-${selectedQuestion.color.replace('#', '')}`]
                            )}
                        >
                            <FormattedHTMLMessage
                                tagName="div"
                                {...selectedQuestion.message}
                            />
                        </div>

                        <div className={styles.feedback}>
                            <img
                                className={selectedQuestion.feedback === Feedback.POSITIVE ?
                                    classNames(styles.selectedFeedbackButton, styles.feedbackButton) :
                                    classNames(styles.feedbackButton)}
                                onClick={this.handlePositiveFeedback}
                                src={positiveFeedback}
                            />
                            <img
                                className={selectedQuestion.feedback === Feedback.NEUTRAL ?
                                    classNames(styles.selectedFeedbackButton, styles.feedbackButton) :
                                    classNames(styles.feedbackButton)}
                                onClick={this.handleNeutralFeedback}
                                src={neutralFeedback}
                            />
                            <img
                                className={selectedQuestion.feedback === Feedback.NEGATIVE ?
                                    classNames(styles.selectedFeedbackButton, styles.feedbackButton) :
                                    classNames(styles.feedbackButton)}
                                onClick={this.handleNegativeFeedback}
                                src={negativeFeedback}
                            />
                            <img
                                className={classNames(styles.thinkBubble)}
                                src={thinkBubble}
                            />
                            {typeof selectedQuestion.feedback === 'undefined' ? null : (
                                <img
                                    className={styles.selectedFeedbackButtonSmall}
                                    src={this.getFeedbackIcon(selectedQuestion.feedback)}
                                />
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

IRSelectedQuestion.propTypes = {
    selectedQuestion: PropTypes.instanceOf(Question)
};

export default injectIntl(IRSelectedQuestion);

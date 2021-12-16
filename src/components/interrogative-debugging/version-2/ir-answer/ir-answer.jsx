import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';
import {FormattedHTMLMessage} from 'react-intl';
import classNames from 'classnames';

import {QuestionV2 as Question} from 'scratch-ir';

import styles from './ir-answer.css';
import irStyles from '../ir-styles.css';

class IRAnswer extends React.Component {

    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        const {
            selectedQuestion
        } = this.props;
        return (
            <div>
                {selectedQuestion ? (
                    <div>
                        <span
                            className={classNames(
                                styles.selectedQuestion,
                                irStyles[`color-${selectedQuestion.color.replace('#', '')}`]
                            )}
                        >
                            <FormattedHTMLMessage
                                tagName="div"
                                {...selectedQuestion.message}
                            />
                        </span>
                    </div>
                ) : null}
            </div>
        );
    }
}

IRAnswer.propTypes = {
    selectedQuestion: PropTypes.instanceOf(Question)
};

export default injectIntl(IRAnswer);
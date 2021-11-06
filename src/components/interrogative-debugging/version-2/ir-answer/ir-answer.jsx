import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';

import {Question_v2 as Question} from 'scratch-ir';

import styles from './ir-answer.css';

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
                        <span className={styles.selectedQuestion}>
                            {selectedQuestion.text}
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

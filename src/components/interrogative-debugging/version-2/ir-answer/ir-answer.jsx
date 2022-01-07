import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';

import styles from './ir-answer.css';

class IRAnswer extends React.Component {

    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div style={styles.answer} />
        );
    }
}

IRAnswer.propTypes = {
    answer: PropTypes.shape({})
};

export default injectIntl(IRAnswer);

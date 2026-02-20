import React from 'react';
import PropTypes from 'prop-types';

import Button from '../button/button.jsx';
import styles from './hidden-debugging-button.css';

const HiddenDebuggingButton = props => (
    <Button
        className={styles.hiddenDebuggingButton}
        onClick={props.onClick}
    />
);


HiddenDebuggingButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default HiddenDebuggingButton;

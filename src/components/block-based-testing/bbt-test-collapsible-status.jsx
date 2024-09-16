import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Box from '../box/box.jsx';
import styles from './bbt-test-collapsible-entries.css';
import neutralIcon from './icons/circle_FILL0_wght300_GRAD0_opsz24.svg';
import passIcon from './icons/check_circle_FILL0_wght300_GRAD0_opsz24.svg';
import failIcon from './icons/cancel_FILL0_wght300_GRAD0_opsz24.svg';

const messages = defineMessages({
    testNotRunYet: {
        id: 'gui.blockBasedTesting.testNotRunYet',
        defaultMessage: 'Test not run yet.'
    },
    testPassed: {
        id: 'gui.blockBasedTesting.testPassed',
        defaultMessage: 'Test passed!'
    },
    testFailed: {
        id: 'gui.blockBasedTesting.testFailed',
        defaultMessage: 'Test failed!'
    },
    testTimedOut: {
        id: 'gui.blockBasedTesting.testTimedOut',
        defaultMessage: 'Test timed out!'
    },
    testRunning: {
        id: 'gui.blockBasedTesting.testRunning',
        defaultMessage: 'Test running...'
    }
});

const BBTCollapsibleStatusEntry = props => {

    let boxClassName = styles.main;
    let messageClassName = styles.noDescription;
    let icon = neutralIcon;
    let message = props.intl.formatMessage(messages.testNotRunYet);

    switch (props.status) {

    case 'pass':
        boxClassName = classNames(boxClassName, styles.backgroundGreen);
        messageClassName = styles.text;
        icon = passIcon;
        message = props.intl.formatMessage(messages.testPassed);
        break;

    case 'fail':
        boxClassName = classNames(boxClassName, styles.backgroundRed);
        messageClassName = styles.text;
        icon = failIcon;
        message = props.intl.formatMessage(messages.testFailed);
        break;

    case 'timeout':
        boxClassName = classNames(boxClassName, styles.backgroundRed);
        messageClassName = styles.text;
        icon = failIcon;
        message = props.intl.formatMessage(messages.testTimedOut);
        break;

    case 'running':
        boxClassName = classNames(boxClassName, styles.backgroundPurple);
        messageClassName = styles.text;
        message = props.intl.formatMessage(messages.testRunning);
        break;
    }

    return (
        <Box className={boxClassName}>
            <img
                className={styles.icon}
                title={'Status'}
                alt={'Status'}
                draggable={false}
                src={icon}
            />
            <div className={messageClassName}>
                {message}
            </div>
        </Box>
    );
};

BBTCollapsibleStatusEntry.propTypes = {
    intl: intlShape,
    status: PropTypes.oneOf(['none', 'running', 'fail', 'pass', 'timeout'])
};

export default injectIntl(BBTCollapsibleStatusEntry);

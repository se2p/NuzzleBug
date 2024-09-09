import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Box from '../box/box.jsx';
import whiskerIcon from './icons/whisker-icon.svg';
import styles from './bbt-test-collapsible-entries.css';

const messages = defineMessages({
    whiskerTest: {
        id: 'gui.blockBasedTesting.whiskerTest',
        defaultMessage: 'Whisker Test'
    },
    thisIsAWhiskerTest: {
        id: 'gui.blockBasedTesting.thisIsAWhiskerTest',
        defaultMessage: 'This is a Whisker Test!'
    }
});

const BBTCollapsibleWhiskerEntry = props => (
    <Box className={styles.main}>
        <img
            className={styles.icon}
            title={props.intl.formatMessage(messages.whiskerTest)}
            alt={props.intl.formatMessage(messages.whiskerTest)}
            draggable={false}
            src={whiskerIcon}
        />

        <div className={styles.text}>
            {props.intl.formatMessage(messages.thisIsAWhiskerTest)}
        </div>
    </Box>
);

BBTCollapsibleWhiskerEntry.propTypes = {
    intl: intlShape
};

export default injectIntl(BBTCollapsibleWhiskerEntry);

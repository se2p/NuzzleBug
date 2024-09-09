import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import Box from '../box/box.jsx';
import locationIcon from './icons/home_FILL0_wght300_GRAD0_opsz24.svg';
import arrowRightIcon from './icons/arrow_circle_right_FILL0_wght300_GRAD0_opsz24.svg';
import styles from './bbt-test-collapsible-entries.css';

const messages = defineMessages({
    location: {
        id: 'gui.blockBasedTesting.location',
        defaultMessage: 'Location'
    },
    locateMsg: {
        id: 'gui.blockBasedTesting.locate',
        defaultMessage: 'Locate'
    }
});

const BBTCollapsibleLocationEntry = props => (

    <Box className={styles.main}>
        <img
            className={styles.icon}
            title={props.intl.formatMessage(messages.location)}
            alt={props.intl.formatMessage(messages.location)}
            draggable={false}
            src={locationIcon}
        />

        <div className={styles.text}>
            {props.spriteName}
        </div>

        <img
            className={styles.iconRight}
            title={props.intl.formatMessage(messages.locateMsg)}
            alt={props.intl.formatMessage(messages.locateMsg)}
            draggable={false}
            src={arrowRightIcon}
            onClick={props.onLocateTest}
        />

    </Box>
);

BBTCollapsibleLocationEntry.propTypes = {
    intl: intlShape,
    spriteName: PropTypes.string.isRequired,
    onLocateTest: PropTypes.func.isRequired
};

export default injectIntl(BBTCollapsibleLocationEntry);

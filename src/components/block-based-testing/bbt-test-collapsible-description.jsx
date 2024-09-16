import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import Box from '../box/box.jsx';
import descriptionIcon from './icons/description_FILL0_wght300_GRAD0_opsz24.svg';
import styles from './bbt-test-collapsible-entries.css';

const messages = defineMessages({
    description: {
        id: 'gui.blockBasedTesting.description',
        defaultMessage: 'Description'
    },
    noDescription: {
        id: 'gui.blockBasedTesting.noDescription',
        defaultMessage: 'No description provided.'
    }
});

const BBTCollapsibleDescriptionEntry = props => (
    <Box className={styles.main}>
        <img
            className={styles.icon}
            title={props.intl.formatMessage(messages.description)}
            alt={props.intl.formatMessage(messages.description)}
            draggable={false}
            src={descriptionIcon}
        />

        {(props.description && props.description !== '') ? (
            <div className={styles.text}>
                {props.description}
            </div>
        ) : (
            <div className={styles.noDescription}>
                {props.intl.formatMessage(messages.noDescription)}
            </div>
        )}
    </Box>
);

BBTCollapsibleDescriptionEntry.propTypes = {
    intl: intlShape,
    description: PropTypes.string
};

export default injectIntl(BBTCollapsibleDescriptionEntry);

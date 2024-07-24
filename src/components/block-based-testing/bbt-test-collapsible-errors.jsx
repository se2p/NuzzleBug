import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Box from '../box/box.jsx';
import styles from './bbt-test-collapsible-entries.css';
import errorIcon from './icons/warning_FILL0_wght300_GRAD0_opsz24.svg';
import lineIcon from './icons/horizontal_rule_FILL0_wght300_GRAD0_opsz24.svg';
import arrowRightIcon from './icons/arrow_circle_right_FILL0_wght300_GRAD0_opsz24.svg';

const messages = defineMessages({
    blockErrorsOccurred: {
        id: 'gui.blockBasedTesting.blockErrorsOccurred',
        defaultMessage: 'Block errors occurred!'
    },
    locateMsg: {
        id: 'gui.blockBasedTesting.locate',
        defaultMessage: 'Locate'
    },
    OTHER_TEST_ALREADY_RUNNING: {
        id: 'gui.blockBasedTesting.OTHER_TEST_ALREADY_RUNNING',
        defaultMessage: 'Another test is already running!'
    },
    TOP_BLOCK_NOT_A_BBT_TEST_HAT: {
        id: 'gui.blockBasedTesting.TOP_BLOCK_NOT_A_BBT_TEST_HAT',
        defaultMessage: 'The top block of this script is not a \'Start test\' block!'
    },
    SAVED_STATE_EMPTY: {
        id: 'gui.blockBasedTesting.SAVED_STATE_EMPTY',
        defaultMessage: 'There is no saved program state!'
    },
    ASSERTION_MISSING_CONDITION: {
        id: 'gui.blockBasedTesting.ASSERTION_MISSING_CONDITION',
        defaultMessage: 'This check contains no condition!'
    },
    ASSERTION_MISSING_VALUE: {
        id: 'gui.blockBasedTesting.ASSERTION_MISSING_VALUE',
        defaultMessage: 'This check is missing a value!'
    },
    ASSERTION_NOT_EQUAL: {
        id: 'gui.blockBasedTesting.ASSERTION_NOT_EQUAL',
        defaultMessage: 'Values are not equal!'
    },
    ASSERTION_NOT_A_NUMBER: {
        id: 'gui.blockBasedTesting.ASSERTION_NOT_A_NUMBER',
        defaultMessage: 'Value is not a number!'
    },
    ASSERTION_VALUE_GREATER: {
        id: 'gui.blockBasedTesting.ASSERTION_VALUE_GREATER',
        defaultMessage: 'A is greater than B!'
    },
    ASSERTION_VALUE_GREATER_OR_EQUAL: {
        id: 'gui.blockBasedTesting.ASSERTION_VALUE_GREATER_OR_EQUAL',
        defaultMessage: 'A is greater than or equal to B!'
    },
    ASSERTION_VALUE_LESS: {
        id: 'gui.blockBasedTesting.ASSERTION_VALUE_LESS',
        defaultMessage: 'A is less than B!'
    },
    ASSERTION_VALUE_LESS_OR_EQUAL: {
        id: 'gui.blockBasedTesting.ASSERTION_VALUE_LESS_OR_EQUAL',
        defaultMessage: 'A is less than or equal to B!'
    },
    CONDITION_IS_FALSE: {
        id: 'gui.blockBasedTesting.CONDITION_IS_FALSE',
        defaultMessage: 'The condition is false!'
    },
    CONDITION_IS_TRUE: {
        id: 'gui.blockBasedTesting.CONDITION_IS_TRUE',
        defaultMessage: 'The condition is true!'
    },
    SPRITE_DOES_NOT_EXIST: {
        id: 'gui.blockBasedTesting.SPRITE_DOES_NOT_EXIST',
        defaultMessage: 'The sprite does not exist!'
    },
    STAGE_DOES_NOT_EXIST: {
        id: 'gui.blockBasedTesting.STAGE_DOES_NOT_EXIST',
        defaultMessage: 'The stage does not exist!'
    },
    TEST_ABORTED: {
        id: 'gui.blockBasedTesting.TEST_ABORTED',
        defaultMessage: 'Test aborted!'
    },
    WHISKER_TEST_ERROR: {
        id: 'gui.blockBasedTesting.WHISKER_TEST_ERROR',
        defaultMessage: 'A Whisker error occurred!'
    },
    TEST_TIMEOUT: {
        id: 'gui.blockBasedTesting.TEST_TIMEOUT',
        defaultMessage: 'Test timed out!'
    }
});

const BBTCollapsibleErrorEntry = props => (<>
    <Box className={classNames(styles.main, styles.noBorders, styles.backgroundRed)}>
        <img
            className={styles.icon}
            title={props.intl.formatMessage(messages.blockErrorsOccurred)}
            alt={props.intl.formatMessage(messages.blockErrorsOccurred)}
            draggable={false}
            src={errorIcon}
        />
        <div className={styles.text}>
            {props.intl.formatMessage(messages.blockErrorsOccurred)}
        </div>
    </Box>

    {props.errors ? (
        Object.entries(props.errors)
            .map(([blockId, errorObject]) => (
                <Box
                    className={classNames(styles.main, styles.noBorders, styles.backgroundRed)}
                    key={blockId}
                >
                    <img
                        className={classNames(styles.icon, styles.iconVerticallyCentered)}
                        title={props.intl.formatMessage(messages.blockErrorsOccurred)}
                        alt={props.intl.formatMessage(messages.blockErrorsOccurred)}
                        draggable={false}
                        src={lineIcon}
                    />
                    <div className={styles.text}>
                        {props.intl.formatMessage(messages[errorObject.type])}
                    </div>
                    <img
                        className={classNames(styles.iconRight, styles.iconVerticallyCentered)}
                        title={props.intl.formatMessage(messages.locateMsg)}
                        alt={props.intl.formatMessage(messages.locateMsg)}
                        draggable={false}
                        src={arrowRightIcon}
                        onClick={() => {
                            props.onLocateBlock(blockId);
                        }}
                    />
                </Box>))
    ) : null} </>);

BBTCollapsibleErrorEntry.propTypes = {
    intl: intlShape,
    errors: PropTypes.object,
    onLocateBlock: PropTypes.func.isRequired
};

export default injectIntl(BBTCollapsibleErrorEntry);

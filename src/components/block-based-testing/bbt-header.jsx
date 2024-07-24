import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Box from '../box/box.jsx';

import styles from './bbt-header.css';
import runAllIcon from './icons/icon--start.png';
import uploadIcon from './icons/upload_FILL1_wght300_GRAD0_opsz48.png';
import trashIcon from './icons/trash-icon.svg';
import closeIcon from './icons/cancel_FILL1_wght400_GRAD0_opsz48.png';
import gridIcon from './icons/grid_view_FILL0_wght300_GRAD0_opsz48.png';
import mouseCoordinatesIcon from './icons/arrow_selector_tool_FILL0_wght400_GRAD0_opsz48.png';
import stackIcon from './icons/stacks_FILL0_wght400_GRAD0_opsz48.png';

const messages = defineMessages({
    runAllTests: {
        id: 'gui.blockBasedTesting.runAllTestsButton',
        defaultMessage: 'Run all tests'
    },
    uploadWhiskerTests: {
        id: 'gui.blockBasedTesting.uploadWhiskerTestsButton',
        defaultMessage: 'Load Whisker Tests from file'
    },
    clearAllTestResults: {
        id: 'gui.blockBasedTesting.clearAllTestResultsButton',
        defaultMessage: 'Clear all test results'
    },
    showExamplesWindow: {
        id: 'gui.blockBasedTesting.showExamplesWindowButton',
        defaultMessage: 'Show test examples'
    },
    showBatchEvaluation: {
        id: 'gui.blockBasedTesting.showBatchEvaluationButton',
        defaultMessage: 'Show batch evaluation'
    },
    showCoordinatesTooltip: {
        id: 'gui.blockBasedTesting.showCoordinatesTooltipButton',
        defaultMessage: 'Show cursor coordinates tooltip'
    },
    hideTestInterface: {
        id: 'gui.blockBasedTesting.hideTestInterfaceButton',
        defaultMessage: 'Hide Test Interface'
    }
});

const BBTHeaderComponent = props => (
    <Box className={styles.main}>

        <img
            className={classNames(
                styles.icon,
                styles.iconSmallerPadding,
                {
                    [styles.iconDisabled]: !props.isRunAllButtonEnabled
                }
            )}
            draggable={false}
            src={runAllIcon}
            title={props.intl.formatMessage(messages.runAllTests)}
            alt={props.intl.formatMessage(messages.runAllTests)}
            onClick={props.isRunAllButtonEnabled ? props.onRunAllTests : null}
        />

        <label htmlFor="whisker-tests-upload">
            <img
                className={classNames(
                    styles.icon,
                    styles.iconSmallPadding,
                    {
                        [styles.iconDisabled]: !props.isWhiskerUploadButtonEnabled
                    }
                )}
                src={uploadIcon}
                title={props.intl.formatMessage(messages.uploadWhiskerTests)}
                alt={props.intl.formatMessage(messages.uploadWhiskerTests)}
                draggable={false}
            />
        </label>
        <input
            id="whisker-tests-upload"
            type="file"
            disabled={!props.isWhiskerUploadButtonEnabled}
            onChange={props.onUploadWhiskerTests}
        />

        <img
            className={classNames(
                styles.icon,
                styles.iconSmallPadding,
                {
                    [styles.iconActive]: props.isBBTExampleWindowVisible
                }
            )}
            draggable={false}
            src={gridIcon}
            title={props.intl.formatMessage(messages.showExamplesWindow)}
            alt={props.intl.formatMessage(messages.showExamplesWindow)}
            onClick={props.onToggleBBTExamplesWindow}
        />

        <img
            className={classNames(
                styles.icon,
                styles.iconSmallerPadding,
                {
                    [styles.iconActive]: props.isBBTCoordinatesTooltipVisible
                }
            )}
            draggable={false}
            src={mouseCoordinatesIcon}
            title={props.intl.formatMessage(messages.showCoordinatesTooltip)}
            alt={props.intl.formatMessage(messages.showCoordinatesTooltip)}
            onClick={props.onToggleBBTCoordinatesTooltip}
        />

        <img
            className={classNames(
                styles.icon,
                styles.iconNormalPadding,
                {
                    [styles.iconDisabled]: !props.isClearAllTestResultsButtonEnabled
                }
            )}
            draggable={false}
            src={trashIcon}
            title={props.intl.formatMessage(messages.clearAllTestResults)}
            alt={props.intl.formatMessage(messages.clearAllTestResults)}
            onClick={props.isClearAllTestResultsButtonEnabled ? props.onClearAllTestStatus : null}
        />

        <img
            className={classNames(styles.icon, styles.iconSmallerPadding, styles.iconRight)}
            draggable={false}
            src={closeIcon}
            title={props.intl.formatMessage(messages.hideTestInterface)}
            alt={props.intl.formatMessage(messages.hideTestInterface)}
            onClick={props.onCloseBBTInterface}
        />

        <img
            className={classNames(
                styles.icon,
                styles.iconSmallerPadding,
                styles.iconRight,
                {
                    [styles.iconActive]: props.isBBTBatchEvalWindowVisible
                }
            )}
            draggable={false}
            src={stackIcon}
            title={props.intl.formatMessage(messages.showBatchEvaluation)}
            alt={props.intl.formatMessage(messages.showBatchEvaluation)}
            onClick={props.onToggleBatchEvaluationWindow}
        />
    </Box>
);

BBTHeaderComponent.propTypes = {
    intl: intlShape,
    isRunAllButtonEnabled: PropTypes.bool.isRequired,
    onRunAllTests: PropTypes.func.isRequired,
    isWhiskerUploadButtonEnabled: PropTypes.bool.isRequired,
    onUploadWhiskerTests: PropTypes.func.isRequired,
    isBBTExampleWindowVisible: PropTypes.bool.isRequired,
    isBBTBatchEvalWindowVisible: PropTypes.bool.isRequired,
    isBBTCoordinatesTooltipVisible: PropTypes.bool.isRequired,
    onToggleBBTExamplesWindow: PropTypes.func.isRequired,
    onToggleBatchEvaluationWindow: PropTypes.func.isRequired,
    onToggleBBTCoordinatesTooltip: PropTypes.func.isRequired,
    isClearAllTestResultsButtonEnabled: PropTypes.bool.isRequired,
    onClearAllTestStatus: PropTypes.func.isRequired,
    onCloseBBTInterface: PropTypes.func.isRequired
};

export default injectIntl(BBTHeaderComponent);

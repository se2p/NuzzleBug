import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Box from '../box/box.jsx';
import {BBTTestManager} from '../../lib/bbt-test-execution-logic-hoc.jsx';

import styles from './bbt-info-panel.css';
import trashIcon from './icons/trash-icon.svg';

const messages = defineMessages({
    testsAreRunning: {
        id: 'gui.blockBasedTesting.testsAreRunning',
        defaultMessage: 'Tests are running...'
    },
    results: {
        id: 'gui.blockBasedTesting.results',
        defaultMessage: 'Results'
    },
    clearAllTestResultsButton: {
        id: 'gui.blockBasedTesting.clearAllTestResultsButton',
        defaultMessage: 'Clear all test results'
    },
    passed: {
        id: 'gui.blockBasedTesting.passed',
        defaultMessage: 'passed'
    },
    failed: {
        id: 'gui.blockBasedTesting.failed',
        defaultMessage: 'failed'
    }
});

const BBTInfoPanelComponent = props => {
    const numberOfFinishedTests = props.numberOfPassedTests + props.numberOfFailedTests;
    const progress = `${Math.round(100 * numberOfFinishedTests / props.numberOfTotalTests)}%`;
    const result = `${Math.round(100 * props.numberOfPassedTests / props.numberOfTotalTests)}%`;

    const display = (props.isTestChainRunning && BBTTestManager.testChainRunning) ? progress : result;

    let classNameProgressBarOuter = styles.progressBarOuter;
    let classNameProgressBarInner = styles.progressBarInner;

    if (props.isTestChainRunning && BBTTestManager.testChainRunning) {
        classNameProgressBarOuter = classNames(classNameProgressBarOuter, styles.progressBarOuterRunning);
        classNameProgressBarInner = classNames(classNameProgressBarInner, styles.progressBarInnerRunning);
    } else {
        classNameProgressBarOuter = classNames(classNameProgressBarOuter, styles.progressBarOuterFinished);
        classNameProgressBarInner = classNames(classNameProgressBarInner, styles.progressBarInnerFinished);
    }

    return (
        <Box className={styles.infoPanel}>

            <div className={styles.headLine}>

                <div className={styles.headLineText}>
                    {(props.isTestChainRunning && BBTTestManager.testChainRunning) ?
                        props.intl.formatMessage(messages.testsAreRunning) : props.intl.formatMessage(messages.results)}
                </div>

                {(props.isTestChainRunning && BBTTestManager.testChainRunning) ? null : (
                    <img
                        className={styles.icon}
                        draggable={false}
                        src={trashIcon}
                        title={props.intl.formatMessage(messages.clearAllTestResultsButton)}
                        alt={props.intl.formatMessage(messages.clearAllTestResultsButton)}
                        onClick={props.onClearAllTestStatus}
                    />
                )}
            </div>

            <div className={classNameProgressBarOuter}>
                <div
                    className={classNameProgressBarInner}
                    style={{width: display}}
                >
                    {display === '0%' ? null : display}
                </div>
            </div>

            <div className={styles.resultsOuter}>
                <div className={classNames(styles.resultsInner, styles.resultsInnerLeft)}>
                    <div className={styles.resultsInnerNumber}>{props.numberOfPassedTests}</div>
                    <div>{props.intl.formatMessage(messages.passed)}</div>
                </div>
                <div className={classNames(styles.resultsInner, styles.resultsInnerRight)}>
                    <div className={styles.resultsInnerNumber}>{props.numberOfFailedTests}</div>
                    <div>{props.intl.formatMessage(messages.failed)}</div>
                </div>
            </div>

        </Box>
    );
};

BBTInfoPanelComponent.propTypes = {
    intl: intlShape,
    onClearAllTestStatus: PropTypes.func.isRequired,
    isTestChainRunning: PropTypes.bool.isRequired,
    numberOfTotalTests: PropTypes.number.isRequired,
    numberOfPassedTests: PropTypes.number.isRequired,
    numberOfFailedTests: PropTypes.number.isRequired
};

export default injectIntl(BBTInfoPanelComponent);

import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';

import Box from '../box/box.jsx';
import BBTInfoPanelComponent from './bbt-info-panel.jsx';

import styles from './bbt-test-plane.css';
import imgEnBbtCategory from './images/bbt_en.png';
import imgDeBbtCategory from './images/bbt_de.png';
import imgRunAll from './images/1.png';
import imgUploadWhiskerTests from './images/2.png';
import imgShowExamplesWindow from './images/3.png';
import imgShowCursorCoordinates from './images/4.png';
import imgClearTestResults from './images/5.png';
import imgShowBatchEvalWindow from './images/6.png';
import imgCloseBbtInterface from './images/7.png';

const messages = defineMessages({
    welcomeMsg: {
        id: 'gui.blockBasedTesting.tutorialScreen.welcomeMsg',
        defaultMessage: 'Welcome to the Test Interface!'
    },
    categoryHeadline: {
        id: 'gui.blockBasedTesting.tutorialScreen.categoryHeadline',
        defaultMessage: 'Tests, made out of blocks:'
    },
    category: {
        id: 'gui.blockBasedTesting.tutorialScreen.category',
        defaultMessage: 'To create your first block-based test, navigate to the "Block-Based Testing" category.'
    },
    runAllHeadline: {
        id: 'gui.blockBasedTesting.tutorialScreen.runAllHeadline',
        defaultMessage: 'Run all tests:'
    },
    runAll: {
        id: 'gui.blockBasedTesting.tutorialScreen.runAll',
        defaultMessage: 'Execute all your created or uploaded tests in order.'
    },
    uploadWhiskerTestsHeadline: {
        id: 'gui.blockBasedTesting.tutorialScreen.uploadWhiskerTestsHeadline',
        defaultMessage: 'Upload Whisker tests:'
    },
    uploadWhiskerTests: {
        id: 'gui.blockBasedTesting.tutorialScreen.uploadWhiskerTests',
        defaultMessage: 'This Scratch instance supports importing and running Whisker tests.'
    },
    showExamplesWindowHeadline: {
        id: 'gui.blockBasedTesting.tutorialScreen.showExamplesWindowHeadline',
        defaultMessage: 'Show example tests:'
    },
    showExamplesWindow: {
        id: 'gui.blockBasedTesting.tutorialScreen.showExamplesWindow',
        defaultMessage: 'Need some inspiration? See some pre-defined tests that can easily be re-used.'
    },
    showCursorCoordinatesHeadline: {
        id: 'gui.blockBasedTesting.tutorialScreen.showCursorCoordinatesHeadline',
        defaultMessage: 'Show cursor coordinates:'
    },
    showCursorCoordinates: {
        id: 'gui.blockBasedTesting.tutorialScreen.showCursorCoordinates',
        defaultMessage: 'Find out the x and y coordinates of any spot on the stage!'
    },
    clearTestResultsHeadline: {
        id: 'gui.blockBasedTesting.tutorialScreen.clearTestResultsHeadline',
        defaultMessage: 'Clear test results:'
    },
    clearTestResults: {
        id: 'gui.blockBasedTesting.tutorialScreen.clearTestResults',
        defaultMessage: 'Remove the result messages and colors from the interface and the test blocks.'
    },
    showBatchEvalWindowHeadline: {
        id: 'gui.blockBasedTesting.tutorialScreen.showBatchEvalWindowHeadline',
        defaultMessage: 'Batch Evaluation:'
    },
    showBatchEvalWindow: {
        id: 'gui.blockBasedTesting.tutorialScreen.showBatchEvalWindow',
        defaultMessage: 'Run a set of tests on multiple Scratch projects!'
    },
    closeBbtInterfaceHeadline: {
        id: 'gui.blockBasedTesting.tutorialScreen.closeBbtInterfaceHeadline',
        defaultMessage: 'Close the interface:'
    },
    closeBbtInterface: {
        id: 'gui.blockBasedTesting.tutorialScreen.closeBbtInterface',
        defaultMessage: 'Hide this area to have more space for the block editor.'
    }
});

const BBTTestPlaneComponent = props => (
    <Box className={styles.main}>

        {props.testCollapsiblesBBT.length === 0 && props.testCollapsiblesWhisker.length === 0 ? (
            <Box className={styles.tutorialScreen}>

                <div className={styles.welcomeMsg}>{props.intl.formatMessage(messages.welcomeMsg)}</div>

                <div className={styles.tutorialElement}>
                    <div className={styles.tutorialScreenImg}>
                        <img
                            src={props.intl.locale === 'de' ? imgDeBbtCategory : imgEnBbtCategory}
                            draggable={false}
                        />
                    </div>
                    <div className={styles.tutorialScreenText}>
                        <span className={styles.bold}>{props.intl.formatMessage(messages.categoryHeadline)}&nbsp;</span>
                        <span>{props.intl.formatMessage(messages.category)}</span>
                    </div>
                </div>

                <div className={styles.tutorialElement}>
                    <div className={styles.tutorialScreenImg}>
                        <img
                            src={imgRunAll}
                            draggable={false}
                        />
                    </div>
                    <div className={styles.tutorialScreenText}>
                        <span className={styles.bold}>{props.intl.formatMessage(messages.runAllHeadline)}&nbsp;</span>
                        <span>{props.intl.formatMessage(messages.runAll)}</span>
                    </div>
                </div>

                <div className={styles.tutorialElement}>
                    <div className={styles.tutorialScreenImg}>
                        <img
                            src={imgUploadWhiskerTests}
                            draggable={false}
                        />
                    </div>
                    <div className={styles.tutorialScreenText}>
                        <span
                            className={styles.bold}
                        >{props.intl.formatMessage(messages.uploadWhiskerTestsHeadline)}&nbsp;</span>
                        <span>{props.intl.formatMessage(messages.uploadWhiskerTests)}</span>
                    </div>
                </div>

                <div className={styles.tutorialElement}>
                    <div className={styles.tutorialScreenImg}>
                        <img
                            src={imgShowExamplesWindow}
                            draggable={false}
                        />
                    </div>
                    <div className={styles.tutorialScreenText}>
                        <span
                            className={styles.bold}
                        >{props.intl.formatMessage(messages.showExamplesWindowHeadline)}&nbsp;</span>
                        <span>{props.intl.formatMessage(messages.showExamplesWindow)}</span>
                    </div>
                </div>

                <div className={styles.tutorialElement}>
                    <div className={styles.tutorialScreenImg}>
                        <img
                            src={imgShowCursorCoordinates}
                            draggable={false}
                        />
                    </div>
                    <div className={styles.tutorialScreenText}>
                        <span
                            className={styles.bold}
                        >{props.intl.formatMessage(messages.showCursorCoordinatesHeadline)}&nbsp;</span>
                        <span>{props.intl.formatMessage(messages.showCursorCoordinates)}</span>
                    </div>
                </div>

                <div className={styles.tutorialElement}>
                    <div className={styles.tutorialScreenImg}>
                        <img
                            src={imgClearTestResults}
                            draggable={false}
                        />
                    </div>
                    <div className={styles.tutorialScreenText}>
                        <span
                            className={styles.bold}
                        >{props.intl.formatMessage(messages.clearTestResultsHeadline)}&nbsp;</span>
                        <span>{props.intl.formatMessage(messages.clearTestResults)}</span>
                    </div>
                </div>

                <div className={styles.tutorialElementBottom}>
                    <div className={styles.tutorialScreenImg}>
                        <img
                            src={imgShowBatchEvalWindow}
                            draggable={false}
                        />
                    </div>
                    <div className={styles.tutorialScreenText}>
                        <span
                            className={styles.bold}
                        >{props.intl.formatMessage(messages.showBatchEvalWindowHeadline)}&nbsp;</span>
                        <span>{props.intl.formatMessage(messages.showBatchEvalWindow)}</span>
                    </div>
                </div>

                <div className={styles.tutorialElementBottom}>
                    <div className={styles.tutorialScreenImg}>
                        <img
                            src={imgCloseBbtInterface}
                            draggable={false}
                        />
                    </div>
                    <div className={styles.tutorialScreenText}>
                        <span
                            className={styles.bold}
                        >{props.intl.formatMessage(messages.closeBbtInterfaceHeadline)}&nbsp;</span>
                        <span>{props.intl.formatMessage(messages.closeBbtInterface)}</span>
                    </div>
                </div>

            </Box>

        ) : (
            <Box className={styles.scrollWrapper}>
                {props.testCollapsiblesBBT}
                {props.testCollapsiblesWhisker}
            </Box>
        )}

        {props.isInfoPanelVisible ? (
            <BBTInfoPanelComponent
                onClearAllTestStatus={props.onClearAllTestStatus}
                numberOfFailedTests={props.numberOfFailedTests}
                numberOfPassedTests={props.numberOfPassedTests}
                numberOfTotalTests={props.numberOfTotalTests}
                isTestChainRunning={props.isTestChainRunning}
            />
        ) : null}

    </Box>
);

BBTTestPlaneComponent.propTypes = {
    intl: intlShape,
    testCollapsiblesBBT: PropTypes.node,
    testCollapsiblesWhisker: PropTypes.node,
    onClearAllTestStatus: PropTypes.func.isRequired,
    isInfoPanelVisible: PropTypes.bool.isRequired,
    isTestChainRunning: PropTypes.bool.isRequired,
    numberOfTotalTests: PropTypes.number,
    numberOfPassedTests: PropTypes.number,
    numberOfFailedTests: PropTypes.number
};

export default injectIntl(BBTTestPlaneComponent);

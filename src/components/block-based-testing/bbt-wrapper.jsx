import React from 'react';
import PropTypes from 'prop-types';

import Box from '../box/box.jsx';
import BBTHeaderComponent from './bbt-header.jsx';
import BBTTestPlaneComponent from './bbt-test-plane.jsx';

import styles from './bbt-wrapper.css';

const BBTWrapperComponent = props => (
    <Box className={styles.main}>
        <BBTHeaderComponent
            isRunAllButtonEnabled={props.isRunAllButtonEnabled}
            onRunAllTests={props.onRunAllTests}
            isWhiskerUploadButtonEnabled={props.isWhiskerUploadButtonEnabled}
            onUploadWhiskerTests={props.onUploadWhiskerTests}
            isBBTExampleWindowVisible={props.isBBTExampleWindowVisible}
            isBBTBatchEvalWindowVisible={props.isBBTBatchEvalWindowVisible}
            isBBTCoordinatesTooltipVisible={props.isBBTCoordinatesTooltipVisible}
            onToggleBBTExamplesWindow={props.onToggleBBTExamplesWindow}
            onToggleBatchEvaluationWindow={props.onToggleBatchEvaluationWindow}
            onToggleBBTCoordinatesTooltip={props.onToggleBBTCoordinatesTooltip}
            isClearAllTestResultsButtonEnabled={props.isClearAllTestResultsButtonEnabled}
            onClearAllTestStatus={props.onClearAllTestStatus}
            onCloseBBTInterface={props.onCloseBBTInterface}
        />
        <BBTTestPlaneComponent
            testCollapsiblesBBT={props.testCollapsiblesBBT}
            testCollapsiblesWhisker={props.testCollapsiblesWhisker}
            onClearAllTestStatus={props.onClearAllTestStatus}
            numberOfFailedTests={props.numberOfFailedTests}
            numberOfPassedTests={props.numberOfPassedTests}
            numberOfTotalTests={props.numberOfTotalTests}
            isInfoPanelVisible={props.isInfoPanelVisible}
            isTestChainRunning={props.isTestChainRunning}
        />
    </Box>
);

BBTWrapperComponent.propTypes = {

    // props for header
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
    onCloseBBTInterface: PropTypes.func.isRequired,

    // props for test plane
    testCollapsiblesBBT: PropTypes.node,
    testCollapsiblesWhisker: PropTypes.node,
    isInfoPanelVisible: PropTypes.bool.isRequired,
    isTestChainRunning: PropTypes.bool.isRequired,
    numberOfTotalTests: PropTypes.number,
    numberOfPassedTests: PropTypes.number,
    numberOfFailedTests: PropTypes.number
};

export default BBTWrapperComponent;

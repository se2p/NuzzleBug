import React, {useState} from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Box from '../../box/box.jsx';

import styles from './bbt-batch-evaluation-window.css';
import windowStyles from '../bbt-windows.css';
import cardStyles from '../../cards/card.css';

import shrinkIcon from '../../cards/icon--shrink.svg';
import expandIcon from '../../cards/icon--expand.svg';
import closeIcon from '../../cards/icon--close.svg';
import batchEvaluationImage from './images/batch-evaluation.png';
import leftArrowIcon from '../icons/west_FILL0_wght400_GRAD0_opsz24.png';
import rightArrowIcon from '../icons/east_FILL0_wght400_GRAD0_opsz24.png';
import runAllIcon from '../icons/icon--start.png';
import stopAllIcon from '../../stop-all/icon--stop-all.svg';
import trashIcon from '../icons/trash-icon.svg';
import downloadIcon from '../icons/download_FILL0_wght400_GRAD0_opsz24.png';

const messages = defineMessages({
    headline: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.headline',
        defaultMessage: 'Batch Evaluation'
    },
    text: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.text',
        defaultMessage: 'With Batch Evaluation, the block-based tests of a Scratch project can be run ' +
            'against multiple other projects. Load the project that contains the tests and set them as the ' +
            'cross-project Batch Evaluation Test Suite. Next, load another project and insert the tests ' +
            'from the Batch Evaluation Test Suite. It is also possible to open multiple Scratch project files ' +
            'and run the tests in all projects.'
    },
    expand: {
        id: 'gui.cards.expand',
        defaultMessage: 'Expand'
    },
    shrink: {
        id: 'gui.cards.shrink',
        defaultMessage: 'Shrink'
    },
    close: {
        id: 'gui.cards.close',
        defaultMessage: 'Close'
    },
    stage: {
        id: 'gui.stageSelector.stage',
        defaultMessage: 'Stage'
    },
    currentProject: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.currentProject',
        defaultMessage: 'Current Project'
    },
    noTests: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.noTests',
        defaultMessage: 'No tests!'
    },
    useAsBatchTestSuite: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.useAsBatchTestSuite',
        defaultMessage: 'Use as Batch Test Suite'
    },
    replaceBatchTestSuite: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.replaceBatchTestSuite',
        defaultMessage: 'Replace Batch Test Suite'
    },
    replaceTestsInCurrentProject: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.replaceTestsInCurrentProject',
        defaultMessage: 'Replace tests in current project'
    },
    batchTestSuite: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.batchTestSuite',
        defaultMessage: 'Batch Test Suite'
    },
    empty: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.empty',
        defaultMessage: 'Empty!'
    },
    fileName: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.fileName',
        defaultMessage: 'File Name'
    },
    controls: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.controls',
        defaultMessage: 'Controls'
    },
    noFilesSelected: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.noFilesSelected',
        defaultMessage: 'No files selected.'
    },
    dragAndDropFileSelection: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.dragAndDropFileSelection',
        defaultMessage: 'Drag and drop some files here, or click to select files'
    },
    runTestSuiteOnAllProjects: {
        id: 'gui.blockBasedTesting.batchEvaluationWindow.runTestSuiteOnAllProjects',
        defaultMessage: 'Run Test Suite on all projects'
    },
    clearAllTestResultsButton: {
        id: 'gui.blockBasedTesting.clearAllTestResultsButton',
        defaultMessage: 'Clear all test results'
    },
    downloadResultsButton: {
        id: 'gui.blockBasedTesting.downloadResultsButton',
        defaultMessage: 'Download test results'
    }
});

const BBTBatchEvaluationWindowComponent = props => {

    const [isExpanded, setExpanded] = useState(true);

    const currentProjectTestStatsKeys = Object.keys(props.currentProjectTestStats);
    const testStoreStatsKeys = Object.keys(props.testStoreStats);

    return (
        <Draggable bounds="parent">
            <Box className={classNames(windowStyles.window, styles.main)}>

                <Box className={windowStyles.header}>

                    <Box className={windowStyles.headerLeft}>
                        {props.intl.formatMessage(messages.headline)}
                    </Box>

                    <Box className={windowStyles.headerRight}>
                        {isExpanded ? (
                            <div
                                className={cardStyles.allButton}
                                onClick={() => setExpanded(false)}
                            >
                                <img
                                    draggable={false}
                                    src={shrinkIcon}
                                />
                                {props.intl.formatMessage(messages.shrink)}
                            </div>
                        ) : (
                            <div
                                className={cardStyles.allButton}
                                onClick={() => setExpanded(true)}
                            >
                                <img
                                    draggable={false}
                                    src={expandIcon}
                                />
                                {props.intl.formatMessage(messages.expand)}
                            </div>
                        )}

                        <div
                            className={cardStyles.allButton}
                            onClick={props.onClose}
                        >
                            <img
                                draggable={false}
                                src={closeIcon}
                            />
                            {props.intl.formatMessage(messages.close)}
                        </div>
                    </Box>

                </Box>

                {isExpanded ? (
                    <>
                        <Box className={windowStyles.middle}>
                            <Box className={windowStyles.middleLeft}>
                                {props.intl.formatMessage(messages.text)}
                            </Box>

                            <Box className={windowStyles.middleRight}>
                                <div>
                                    <img
                                        src={batchEvaluationImage}
                                        draggable={false}
                                    />
                                </div>
                            </Box>
                        </Box>

                        <Box className={styles.mainBody}>

                            <div className={styles.testStoreControlArea}>

                                <div className={styles.storeBox}>
                                    <div className={styles.storeBoxHeader}>
                                        {props.intl.formatMessage(messages.currentProject)}
                                    </div>
                                    <div className={styles.storeBoxBody}>
                                        {currentProjectTestStatsKeys.length === 0 ?
                                            <div>{props.intl.formatMessage(messages.noTests)}</div> :
                                            currentProjectTestStatsKeys.map(spriteName => (
                                                <div key={spriteName}>
                                                    {`${spriteName === '_stage_' ?
                                                        props.intl.formatMessage(messages.stage) :
                                                        spriteName
                                                    }: ${props.currentProjectTestStats[spriteName]}`}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className={styles.buttonBox}>
                                    <div
                                        className={styles.testStoreButton}
                                        onClick={props.onSaveTestsToTestStore}
                                    >
                                        <span className={styles.testStoreButtonText}>
                                            {testStoreStatsKeys.length === 0 ?
                                                props.intl.formatMessage(messages.useAsBatchTestSuite) :
                                                props.intl.formatMessage(messages.replaceBatchTestSuite)
                                            }
                                        </span>
                                        <img
                                            className={styles.testStoreButtonIcon}
                                            src={rightArrowIcon}
                                        />
                                    </div>

                                    <div
                                        className={styles.testStoreButton}
                                        onClick={props.onInjectTestsFromTestStore}
                                    >
                                        <img
                                            className={styles.testStoreButtonIcon}
                                            src={leftArrowIcon}
                                        />

                                        <span className={styles.testStoreButtonText}>
                                            {props.intl.formatMessage(messages.replaceTestsInCurrentProject)}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.storeBox}>
                                    <div className={styles.storeBoxHeader}>
                                        {props.intl.formatMessage(messages.batchTestSuite)}
                                    </div>
                                    <div className={styles.storeBoxBody}>

                                        {testStoreStatsKeys.length === 0 ?
                                            <div>{props.intl.formatMessage(messages.empty)}</div> :
                                            testStoreStatsKeys.map(spriteName => (
                                                <div key={spriteName}>
                                                    {`${spriteName === '_stage_' ?
                                                        props.intl.formatMessage(messages.stage) :
                                                        spriteName
                                                    }: ${props.testStoreStats[spriteName]}`}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.buttonArea}>
                                <div
                                    className={styles.controlButton}
                                    onClick={props.onRunTestSuiteOnAllProjects}
                                >
                                    <img
                                        className={styles.runAllIcon}
                                        src={runAllIcon}
                                    />
                                    <span className={styles.testStoreButtonText}>
                                        {props.intl.formatMessage(messages.runTestSuiteOnAllProjects)}
                                    </span>
                                </div>
                                <div
                                    className={styles.controlButton}
                                    onClick={props.onStop}
                                >
                                    <img
                                        className={styles.testStoreButtonIcon}
                                        src={stopAllIcon}
                                    />
                                    <span className={styles.testStoreButtonText}>
                                        {'Stop'}
                                    </span>
                                </div>
                                <div
                                    className={styles.controlButton}
                                    onClick={props.onClearAllResults}
                                >
                                    <img
                                        className={styles.testStoreButtonIcon}
                                        src={trashIcon}
                                    />
                                    <span className={styles.testStoreButtonText}>
                                        {props.intl.formatMessage(messages.clearAllTestResultsButton)}
                                    </span>
                                </div>
                                <div
                                    className={styles.controlButton}
                                    onClick={props.onDownloadResults}
                                >
                                    <img
                                        className={styles.runAllIcon}
                                        src={downloadIcon}
                                    />
                                    <span className={styles.testStoreButtonText}>
                                        {props.intl.formatMessage(messages.downloadResultsButton)}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.paddedArea}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{props.intl.formatMessage(messages.fileName)}</th>
                                            <th>{props.intl.formatMessage(messages.controls)}</th>
                                            {props.testStore.testInfos.map(testInfo => (
                                                <th key={`result-table-th-${testInfo.testId}`}>{testInfo.testName}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.projectFilesTableRows.length === 0 ?
                                            <tr>
                                                <td>{props.intl.formatMessage(messages.noFilesSelected)}</td>
                                                <td />
                                            </tr> :
                                            props.projectFilesTableRows}
                                    </tbody>
                                </table>
                            </div>

                            <div
                                className={styles.addFileArea}
                                {...props.getDropZoneRootProps()}
                            >
                                <input {...props.getDropZoneInputProps()} />
                                <div>{props.intl.formatMessage(messages.dragAndDropFileSelection)}</div>
                            </div>

                        </Box>
                    </>
                ) : null}
            </Box>
        </Draggable>
    );
};

BBTBatchEvaluationWindowComponent.propTypes = {
    intl: intlShape,
    testStore: PropTypes.object.isRequired,
    currentProjectTestStats: PropTypes.object.isRequired,
    testStoreStats: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSaveTestsToTestStore: PropTypes.func.isRequired,
    onInjectTestsFromTestStore: PropTypes.func.isRequired,
    projectFilesTableRows: PropTypes.node.isRequired,
    getDropZoneRootProps: PropTypes.func.isRequired,
    getDropZoneInputProps: PropTypes.func.isRequired,
    onRunTestSuiteOnAllProjects: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onClearAllResults: PropTypes.func.isRequired,
    onDownloadResults: PropTypes.func.isRequired
};

export default injectIntl(BBTBatchEvaluationWindowComponent);

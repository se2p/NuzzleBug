import React, {useRef} from 'react';
import {CSVLink} from 'react-csv';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import classNames from 'classnames';
import log from '../lib/log';
import {
    clearAllBatchEvalTestStatus,
    clearAllTestStatus,
    clearBatchEvalTestStatus,
    replaceBBTTests,
    resetInfoPanelStatus,
    setActiveBatchEvaluationFileId,
    setBatchEvalProjectFiles,
    setRequestToolboxUpdateRemotely,
    setTestStore,
    setTotalTestsForInfoPanel,
    showInfoPanel,
    toggleBatchEvaluationWindowVisibility
} from '../reducers/block-based-testing';
import BBTBatchEvaluationWindowComponent
from '../components/block-based-testing/batch-evaluation-window/bbt-batch-evaluation-window.jsx';
import VM from 'scratch-vm';
import logging from 'scratch-vm/src/util/logging.js';
import {useDropzone} from 'react-dropzone';
import BBTBatchEvaluationFileTableRow
from '../components/block-based-testing/batch-evaluation-window/bbt-batch-evaluation-file-tablerow.jsx';
import {LoadingStates, requestProjectUpload} from '../reducers/project-state';
import {setProjectTitle} from '../reducers/project-title';

import styles from '../components/block-based-testing/batch-evaluation-window/bbt-batch-evaluation-window.css';

import bbtTestCreationHOC from '../lib/bbt-test-creation-hoc.jsx';
import bbtTestExecutionLogicHOC, {BBTTestManager} from '../lib/bbt-test-execution-logic-hoc.jsx';
import bbtWorkspaceInteractionHOC from '../lib/bbt-workspace-interaction-hoc.jsx';

let nextFileId = 0;

const BBTBatchEvaluationWindow = props => {
    const {getRootProps, getInputProps} = useDropzone({
        onDrop: acceptedFiles => {
            acceptedFiles.map((file, index) => Object.assign(file, {
                id: index + nextFileId
            }));

            nextFileId += acceptedFiles.length;
            props.handleSetBatchEvalProjectFiles([...props.batchEvalProjectFiles, ...acceptedFiles]);
        }
    });

    const handleSaveTestsToTestStore = () => {

        const newTestStore = {
            globalVariables: [],
            targetsWithTests: {},
            testInfos: []
        };

        // global variables are actually just the (regular/local) variables of the stage!
        newTestStore.globalVariables = props.vm.runtime.getTargetForStage().variables;

        const originalTargets = props.vm.runtime.targets.filter(target => target.isOriginal);

        for (const target of originalTargets) {
            let targetContainsTests = false;
            const spriteName = target.isStage ? '_stage_' : target.sprite.name;

            for (const script of target.blocks.getScripts()) {

                const topBlock = target.blocks.getBlock(script);
                if (!topBlock || topBlock.opcode !== 'bbt_testHat') {
                    continue;
                }

                targetContainsTests = true;

                if (!(newTestStore.targetsWithTests.hasOwnProperty(spriteName))) {
                    newTestStore.targetsWithTests[spriteName] = {
                        comments: {},
                        localVariables: {},
                        testScripts: []
                    };
                }

                const xmlString = target.blocks.blockToXML(script, target.comments);
                newTestStore.targetsWithTests[spriteName].testScripts.push(xmlString);
                newTestStore.testInfos.push({
                    testName: props.bbtTests[topBlock.id].name,
                    spriteName: spriteName,
                    testId: topBlock.id
                });
            }

            if (targetContainsTests) {

                // local variables of the stage == global variables, stored already
                if (!target.isStage) {
                    newTestStore.targetsWithTests[spriteName].localVariables =
                        Object.assign({}, target.variables);
                }

                newTestStore.targetsWithTests[spriteName].comments =
                    Object.assign({}, target.comments);
            }
        }

        props.handleSetTestStore(newTestStore);
    };

    const removeAllBbtTestsFromCurrentProject = shouldRefreshWorkspaceAndBBTInterface => {
        for (const target of props.vm.runtime.targets) {

            // creating a shallow copy since scripts will be deleted during loop
            const scripts = [...target.blocks._scripts];

            for (const script of scripts) {
                const topBlock = target.blocks.getBlock(script);
                if (topBlock && topBlock.opcode === 'bbt_testHat') {
                    target.blocks.deleteBlock(script);
                }
            }
        }

        if (shouldRefreshWorkspaceAndBBTInterface) {
            props.vm.refreshWorkspace();
            props.onBBTSync();
        }
    };

    const handleInjectTestsFromTestStore = () => {

        removeAllBbtTestsFromCurrentProject(false);

        const stage = props.vm.runtime.getTargetForStage();

        for (const gv of Object.values(props.testStore.globalVariables)) {
            stage.createVariable(gv.id, gv.name, gv.type, gv.isCloud);
        }

        for (const spriteName of Object.keys(props.testStore.targetsWithTests)) {

            const currTarget = spriteName === '_stage_' ? stage : props.vm.runtime.getSpriteTargetByName(spriteName);

            if (!currTarget) {
                log.error(`Target ${spriteName} not found, can not inject tests!`);
                continue;
            }

            for (const comment of Object.values(props.testStore.targetsWithTests[spriteName].comments)) {
                currTarget.createComment(comment.id, comment.blockId, comment.text,
                    comment.x, comment.y, comment.width, comment.height, comment.minimized);
            }

            for (const localVariable of Object.values(props.testStore.targetsWithTests[spriteName].localVariables)) {
                currTarget.createVariable(localVariable.id, localVariable.name, localVariable.type);
            }

            for (const testScript of props.testStore.targetsWithTests[spriteName].testScripts) {
                props.vm.createBlocksFromDomString(currTarget, testScript, false);
            }
        }

        props.onBBTSync();
        props.vm.refreshWorkspace();
        props.setRequestToolboxUpdateRemotely(true);
    };

    const handleLoadProject = async function (fileId) {
        const projectFile = props.batchEvalProjectFiles.find(file => file.id === fileId);
        props.requestProjectUpload(props.loadingState);
        props.clearBlockTempColorsAndScriptGlows();
        props.handleResetInfoPanelStatus();

        await new Promise(resolve => {
            const fileReader = new FileReader();

            fileReader.onload = () => {
                const loadPromise = props.vm.loadProject(fileReader.result)
                    .then(() => {
                        props.setActiveBatchEvaluationFileId(fileId);
                        BBTTestManager.batchEvaluationFileID = fileId;
                        props.onBBTSync();
                        let projectTitle = 'unknown';
                        try {
                            projectTitle = projectFile.path.substring(0, Math.min(100, projectFile.path.length - 4));
                        } catch (ignored) {
                            // ignored
                        }

                        props.onSetProjectTitle(projectTitle);
                        props.vm.renderer.draw();
                    });

                resolve(loadPromise);
            };

            fileReader.readAsArrayBuffer(projectFile);
        });
    };

    const handleRunAllTestsOnFile = async function (fileId) {

        if (BBTTestManager.batchEvaluationFileID !== fileId) {
            await handleLoadProject(fileId);
        }

        handleInjectTestsFromTestStore();

        props.handleClearAllTestStatus();
        props.clearBlockTempColorsAndScriptGlows();
        props.handleResetInfoPanelStatus();
        props.handleSetTotalTestsForInfoPanel(
            Object.keys(props.bbtTests).length + Object.keys(props.whiskerTests).length);
        props.handleShowInfoPanel();

        return new Promise(resolve => {
            props.runAllTests(() => resolve());
        });
    };

    const handleClearAllTestStatusOfFile = fileId => {
        props.dispatchClearBatchEvalTestStatus(fileId);
    };

    const handleRemoveFile = fileId => {
        props.handleSetBatchEvalProjectFiles(props.batchEvalProjectFiles.filter(file => file.id !== fileId));
    };

    const handleRunTestSuiteOnAllProjects = async () => {
        if (BBTTestManager.batchEvaluationRunning) {
            return;
        }

        BBTTestManager.batchEvaluationRunning = true;
        props.dispatchClearAllBatchEvalTestStatus();

        for (const projectFile of props.batchEvalProjectFiles) {

            if (!BBTTestManager.batchEvaluationRunning) {
                break;
            }

            await handleRunAllTestsOnFile(projectFile.id);
        }

        BBTTestManager.batchEvaluationRunning = false;
    };

    const handleStop = () => {
        if (props.projectPaused) {
            // Resets the state of the VM back to normal.
            // Otherwise, we could not stop execution.
            props.vm.resumeExecutionForDebugger();
        }

        props.vm.stopAll();

        if (logging.isActive()) {
            logging.logClickEvent('ICON', new Date(), 'STOPALL', null);
        }
    };

    const handleClearAllResults = () => {
        props.dispatchClearAllBatchEvalTestStatus();
    };

    // https://stackoverflow.com/a/71974413
    let currentDate = new Date();
    currentDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000))
        .toISOString()
        .split('.')[0]
        .replace(/[T:]/g, '-');

    const csvLink = useRef();
    const csvFileName = `batch-test-results-${currentDate}.csv`;
    const csvHeaders = ['filename'].concat(props.testStore.testInfos.map(testInfo => testInfo.testName));
    const csvData = props.batchEvalProjectFiles.map(file =>
        [file.path].concat(props.testStore.testInfos.map(testInfo => (

            props.bbtBatchEvalStatus.hasOwnProperty(file.id) &&
            props.bbtBatchEvalStatus[file.id].hasOwnProperty(testInfo.testId) ?

                props.bbtBatchEvalStatus[file.id][testInfo.testId] :
                'none'))));

    const handleDownloadResults = () => csvLink.current.link.click();

    const testStoreStats = Object.values(props.testStore.testInfos)
        .reduce((previous, current) => {
            const spriteName = current.spriteName;
            if (!previous.hasOwnProperty(spriteName)) {
                previous[spriteName] = 0;
            }
            previous[spriteName]++;
            return previous;
        }, {});

    const currentProjectTestStats =
        Object.values(props.bbtTests)
            .reduce((previous, current) => {
                const target = props.vm.runtime.getTargetById(current.containingSpriteId);
                if (target) {
                    const spriteName = target.isStage ? '_stage_' : target.sprite.name;
                    if (!previous.hasOwnProperty(spriteName)) {
                        previous[spriteName] = 0;
                    }
                    previous[spriteName]++;
                }
                return previous;
            }, {});


    const projectFilesTableRows = props.batchEvalProjectFiles.map(file => {

        const resultTds = props.testStore.testInfos.map(testInfo => {

            let result = 'none';
            if (props.bbtBatchEvalStatus.hasOwnProperty(file.id) &&
                props.bbtBatchEvalStatus[file.id].hasOwnProperty(testInfo.testId)) {
                result = props.bbtBatchEvalStatus[file.id][testInfo.testId];
            }

            return (
                <td
                    key={`${file.id}-${testInfo.testId}`}
                    className={classNames(
                        {
                            [styles.backgroundRed]: result === 'fail' || result === 'timeout',
                            [styles.backgroundGreen]: result === 'pass'
                        }
                    )}
                >
                    {result}
                </td>
            );
        });

        return (
            <BBTBatchEvaluationFileTableRow
                resultTds={resultTds}
                key={file.id}
                fileId={file.id}
                fileName={file.path}
                iconsDisabled={!props.runAllTestsEnabled}
                isCurrentlyLoadedProject={file.id === props.activeBatchEvaluationFileId}
                onRunAllTestsOnFile={handleRunAllTestsOnFile}
                onLoadProject={handleLoadProject}
                onRemoveFile={handleRemoveFile}
                onClearAllTestStatus={handleClearAllTestStatusOfFile}
            />
        );
    });

    return (
        props.isBatchEvaluationWindowVisible ? (
            <>
                <CSVLink
                    headers={csvHeaders}
                    data={csvData}
                    ref={csvLink}
                    filename={csvFileName}
                    target="_blank"
                />
                <BBTBatchEvaluationWindowComponent
                    onClose={props.handleToggleBatchEvaluationWindowVisibility}
                    testStore={props.testStore}
                    currentProjectTestStats={currentProjectTestStats}
                    testStoreStats={testStoreStats}
                    projectFilesTableRows={projectFilesTableRows}
                    getDropZoneRootProps={getRootProps}
                    getDropZoneInputProps={getInputProps}
                    onSaveTestsToTestStore={handleSaveTestsToTestStore}
                    onInjectTestsFromTestStore={handleInjectTestsFromTestStore}
                    onRunTestSuiteOnAllProjects={handleRunTestSuiteOnAllProjects}
                    onStop={handleStop}
                    onClearAllResults={handleClearAllResults}
                    onDownloadResults={handleDownloadResults}
                />
            </>
        ) : null
    );
};

BBTBatchEvaluationWindow.propTypes = {

    // provided by bbtWorkspaceInteractionHOC
    clearBlockTempColorsAndScriptGlows: PropTypes.func.isRequired,

    // provided by bbtTestCreationHOC
    onBBTSync: PropTypes.func.isRequired,

    // provided by bbtTestExecutionLogicHOC
    runAllTests: PropTypes.func.isRequired,

    dispatchClearBatchEvalTestStatus: PropTypes.func.isRequired,
    dispatchClearAllBatchEvalTestStatus: PropTypes.func.isRequired,
    activeBatchEvaluationFileId: PropTypes.number.isRequired,
    setActiveBatchEvaluationFileId: PropTypes.func.isRequired,
    runAllTestsEnabled: PropTypes.bool.isRequired,
    isBatchEvaluationWindowVisible: PropTypes.bool.isRequired,
    setRequestToolboxUpdateRemotely: PropTypes.func.isRequired,
    bbtBatchEvalStatus: PropTypes.object.isRequired,
    bbtTests: PropTypes.object.isRequired,
    whiskerTests: PropTypes.object.isRequired,
    testStore: PropTypes.object.isRequired,
    batchEvalProjectFiles: PropTypes.array.isRequired,
    handleClearAllTestStatus: PropTypes.func.isRequired,
    handleResetInfoPanelStatus: PropTypes.func.isRequired,
    handleSetTotalTestsForInfoPanel: PropTypes.func.isRequired,
    handleShowInfoPanel: PropTypes.func.isRequired,
    handleToggleBatchEvaluationWindowVisibility: PropTypes.func.isRequired,
    handleClearBBTTests: PropTypes.func.isRequired,
    handleSetTestStore: PropTypes.func.isRequired,
    handleSetBatchEvalProjectFiles: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
    requestProjectUpload: PropTypes.func.isRequired,
    loadingState: PropTypes.oneOf(LoadingStates),
    onSetProjectTitle: PropTypes.func.isRequired,
    projectPaused: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    activeBatchEvaluationFileId: state.scratchGui.blockBasedTesting.activeBatchEvaluationFileId,
    loadingState: state.scratchGui.projectState.loadingState,
    runAllTestsEnabled: state.scratchGui.blockBasedTesting.runAllTestsEnabled,
    bbtBatchEvalStatus: state.scratchGui.blockBasedTesting.bbtBatchEvalStatus,
    isBatchEvaluationWindowVisible: state.scratchGui.blockBasedTesting.batchEvaluationWindowVisible,
    bbtTests: state.scratchGui.blockBasedTesting.bbtTests,
    whiskerTests: state.scratchGui.blockBasedTesting.whiskerTests,
    testStore: state.scratchGui.blockBasedTesting.testStore,
    batchEvalProjectFiles: state.scratchGui.blockBasedTesting.batchEvalProjectFiles,
    projectPaused: state.scratchGui.vmStatus.paused
});

const mapDispatchToProps = dispatch => ({
    handleClearAllTestStatus: () => dispatch(clearAllTestStatus()),
    handleResetInfoPanelStatus: () => dispatch(resetInfoPanelStatus()),
    handleSetTotalTestsForInfoPanel: number => dispatch(setTotalTestsForInfoPanel(number)),
    handleShowInfoPanel: () => dispatch(showInfoPanel()),
    dispatchClearBatchEvalTestStatus: fileID => dispatch(clearBatchEvalTestStatus(fileID)),
    dispatchClearAllBatchEvalTestStatus: () => dispatch(clearAllBatchEvalTestStatus()),
    setRequestToolboxUpdateRemotely: newValue => dispatch(setRequestToolboxUpdateRemotely(newValue)),
    setActiveBatchEvaluationFileId: fileId => dispatch(setActiveBatchEvaluationFileId(fileId)),
    onSetProjectTitle: title => dispatch(setProjectTitle(title)),
    requestProjectUpload: loadingState => dispatch(requestProjectUpload(loadingState)),
    handleClearBBTTests: () => dispatch(replaceBBTTests({})),
    handleSetTestStore: newTestStore => dispatch(setTestStore(newTestStore)),
    handleSetBatchEvalProjectFiles: newProjectFilesArray => dispatch(setBatchEvalProjectFiles(newProjectFilesArray)),
    handleToggleBatchEvaluationWindowVisibility: () => dispatch(toggleBatchEvaluationWindowVisibility())
});

export default compose(
    bbtTestCreationHOC,
    bbtTestExecutionLogicHOC,
    bbtWorkspaceInteractionHOC,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(BBTBatchEvaluationWindow);

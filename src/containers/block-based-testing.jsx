import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {
    addError,
    clearAllTestStatus,
    clearTestStatus,
    hideInterface,
    incrementInfoPanelFailedTests,
    incrementInfoPanelPassedTests,
    resetInfoPanelStatus,
    setBatchEvalTestStatus,
    setRunAllTestsEnabled,
    setTestStatus,
    setTotalTestsForInfoPanel,
    showInfoPanel,
    toggleBatchEvaluationWindowVisibility,
    toggleCoordinatesTooltipVisibility,
    toggleExamplesWindowVisibility
} from '../reducers/block-based-testing';

import VM from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';

import {activateTab, BLOCKS_TAB_INDEX} from '../reducers/editor-tab';
import BBTWrapperComponent from '../components/block-based-testing/bbt-wrapper.jsx';
import BBTTestCollapsibleComponent from '../components/block-based-testing/bbt-test-collapsible.jsx';
import {getIsShowingProject} from '../reducers/project-state';

import bbtTestExecutionLogicHOC, {BBTTestManager} from '../lib/bbt-test-execution-logic-hoc.jsx';
import bbtWorkspaceInteractionHOC from '../lib/bbt-workspace-interaction-hoc.jsx';
import bbtTestCreationHOC from '../lib/bbt-test-creation-hoc.jsx';

const colorRedBlock = '#d53b3b';
const colorPurpleBlock = '#8504af';
const colorGreenBlock = '#4d993f';

class BBTTestInterface extends React.Component {

    constructor (props) {
        super(props);

        bindAll(this, [
            'handleLocate',
            'handleRunAllTests',
            'handleRunBBTTest',
            'handleRunWhiskerTest',
            'handleClearAllTestStatus',
            'onBBTAssertionSuccess',
            'onBBTErrorOccurred',
            'onBBTBlockIsRunning',
            'onBBTBlockFinishedRunning',
            'onBBTTestStarted',
            'onBBTTestFinishedNaturally',
            'onBBTTestTimeout',
            'visualizeBBTTestResult',
            'onProjectRunStop',
            'onSyncBBTTestsAndReplaceDuplicateTestNames'
        ]);

        // enable block-based testing extension on startup
        if (!this.props.vm.extensionManager.isExtensionLoaded('bbt')) {
            this.props.vm.extensionManager.loadExtensionURL('bbt');
        }
    }

    componentDidMount () {
        this.workspace = ScratchBlocks.getMainWorkspace();

        this.props.vm.addListener('BBT_ASSERTION_SUCCESS', this.onBBTAssertionSuccess);
        this.props.vm.addListener('BBT_ERROR_OCCURRED', this.onBBTErrorOccurred);
        this.props.vm.addListener('BBT_BLOCK_IS_RUNNING', this.onBBTBlockIsRunning);
        this.props.vm.addListener('BBT_BLOCK_FINISHED_RUNNING', this.onBBTBlockFinishedRunning);
        this.props.vm.addListener('BBT_TEST_STARTED', this.onBBTTestStarted);
        this.props.vm.addListener('BBT_TEST_FINISHED_NATURALLY', this.onBBTTestFinishedNaturally);
        this.props.vm.addListener('BBT_TEST_TIMEOUT', this.onBBTTestTimeout);
        this.props.vm.addListener('PROJECT_RUN_STOP', this.onProjectRunStop);
        this.props.vm.addListener('SYNC_BBT_INTERFACE', this.onSyncBBTTestsAndReplaceDuplicateTestNames);
        this.props.vm.addListener('workspaceUpdate', this.props.reapplyBlockTempColorsAndScriptGlows);
    }

    componentDidUpdate (prevProps) {
        if (prevProps.interfaceVisible !== this.props.interfaceVisible) {
            // A resize event is dispatched so the workspace grows/shrinks when the test interface is hidden/visible.
            window.dispatchEvent(new Event('resize'));
        }
    }

    componentWillUnmount () {
        this.props.vm.removeListener('BBT_ASSERTION_SUCCESS', this.onBBTAssertionSuccess);
        this.props.vm.removeListener('BBT_ERROR_OCCURRED', this.onBBTErrorOccurred);
        this.props.vm.removeListener('BBT_BLOCK_IS_RUNNING', this.onBBTBlockIsRunning);
        this.props.vm.removeListener('BBT_BLOCK_FINISHED_RUNNING', this.onBBTBlockFinishedRunning);
        this.props.vm.removeListener('BBT_TEST_STARTED', this.onBBTTestStarted);
        this.props.vm.removeListener('BBT_TEST_FINISHED_NATURALLY', this.onBBTTestFinishedNaturally);
        this.props.vm.removeListener('BBT_TEST_TIMEOUT', this.onBBTTestTimeout);
        this.props.vm.removeListener('PROJECT_RUN_STOP', this.onProjectRunStop);
        this.props.vm.removeListener('SYNC_BBT_INTERFACE', this.onSyncBBTTestsAndReplaceDuplicateTestNames);
        this.props.vm.removeListener('workspaceUpdate', this.props.reapplyBlockTempColorsAndScriptGlows);
    }

    handleRunAllTests () {
        if (BBTTestManager.testChainRunning || this.props.vm.runtime.bbtTestRunning) {
            return;
        }

        this.handleClearAllTestStatus();

        this.props.handleSetTotalTestsForInfoPanel(
            Object.keys(this.props.bbtTests).length + Object.keys(this.props.whiskerTests).length);
        this.props.handleShowInfoPanel();

        this.props.runAllTests();
    }

    handleClearAllTestStatus () {
        this.props.handleClearAllTestStatus();
        this.props.clearBlockTempColorsAndScriptGlows();
        this.props.handleResetInfoPanelStatus();
    }

    onBBTAssertionSuccess (data) {
        this.props.setBlockTempColor(data.blockId, colorGreenBlock);
    }

    onBBTErrorOccurred (errorObject) {
        this.props.setBlockTempColor(errorObject.blockId, colorRedBlock);

        if (errorObject.testId) {
            // block failure occurred in a block that is part of a test script
            this.props.handleAddError(errorObject);
        }
    }

    onBBTBlockIsRunning (data) {
        this.props.setBlockTempColor(data.id, colorPurpleBlock);
    }

    onBBTBlockFinishedRunning (data) {
        this.props.setBlockTempColor(data.id, null);
    }

    onBBTTestStarted (data) {
        this.props.handleSetRunAllTestsEnabled(false);
        this.props.handleClearTestStatus(data.id, 'running');
        const spriteId = this.props.bbtTests[data.id].containingSpriteId;
        this.props.clearBlockTempColorsOfAllBlocksWithinScript(spriteId, data.id);
        this.props.fixYellowGlowOfATestScript(data.id);
    }

    onBBTTestFinishedNaturally (testId) {
        if (this.props.bbtTests[testId].status === 'timeout') {
            return;
        }

        this.visualizeBBTTestResult(testId);

        // Some tests are started without the knowledge of the gui (e.g. by clicking on a test script on the workspace).
        // In this case, no HOC instance will listen to test end events.
        //  The expectingTestEnd flag shows if these test end events need to be handled here.
        if (!BBTTestManager.expectingTestEnd) {
            this.props.handleSetRunAllTestsEnabled(true);
        }
    }

    onBBTTestTimeout (testId) {
        if (BBTTestManager.testChainRunning) {
            this.props.handleIncrementInfoPanelFailedTests();
        }

        this.props.clearBlockTempColorForSpecificColor(colorPurpleBlock);
        this.props.handleSetTestStatus(testId, 'timeout');

        if (BBTTestManager.batchEvaluationFileID !== -1) {
            this.props.handleSetBatchEvalTestStatus(
                BBTTestManager.batchEvaluationFileID, testId, 'timeout');
        }

        this.props.setStackResultGlow(testId, 'fail');

        if (!BBTTestManager.expectingTestEnd) {
            this.props.handleSetRunAllTestsEnabled(true);
        }
    }

    onProjectRunStop () {
        for (const bbtTest of Object.values(this.props.bbtTests)) {
            if (bbtTest.status === 'running') {
                this.props.handleAddError({
                    testId: bbtTest.id,
                    blockId: bbtTest.id,
                    type: 'TEST_ABORTED'
                });
                this.visualizeBBTTestResult(bbtTest.id, false);
            }
        }

        this.props.clearBlockTempColorForSpecificColor(colorPurpleBlock);

        // Some tests are started without the knowledge of the gui (e.g. by clicking on a test script on the workspace).
        // In this case, no HOC instance will listen to test end events.
        //  The expectingTestEnd flag shows if these test end events need to be handled here.
        if (!BBTTestManager.expectingTestEnd) {
            this.props.handleSetRunAllTestsEnabled(true);
        }
    }

    visualizeBBTTestResult (testId, optAlreadyKnownTestResult) {
        let testResult = optAlreadyKnownTestResult;

        if (typeof testResult === 'undefined') {
            testResult = Object.keys(this.props.bbtTests[testId].errors).length === 0;
        }

        if (BBTTestManager.testChainRunning) {
            if (testResult) {
                this.props.handleIncrementInfoPanelPassedTests();
            } else {
                this.props.handleIncrementInfoPanelFailedTests();
            }
        }

        this.props.handleSetTestStatus(testId, testResult ? 'pass' : 'fail');

        if (BBTTestManager.batchEvaluationFileID !== -1) {
            this.props.handleSetBatchEvalTestStatus(
                BBTTestManager.batchEvaluationFileID, testId, testResult ? 'pass' : 'fail');
        }

        this.props.setStackResultGlow(testId, testResult ? 'pass' : 'fail');
    }

    onSyncBBTTestsAndReplaceDuplicateTestNames (bbtTestHatBlockId) {
        if (!this.props.isShowingProject) {
            // only sync bbt tests if the vm is in "showing project" state and not currently loading a project
            return;
        }

        const newName = this.props.onBBTSync(bbtTestHatBlockId);

        if (newName) {
            let blocklyBlock = this.workspace.getBlockById(bbtTestHatBlockId);

            if (blocklyBlock && blocklyBlock.type === 'text') {
                blocklyBlock = blocklyBlock.parentBlock_;
            }

            if (blocklyBlock && blocklyBlock.type === 'bbt_testHat') {
                // The test was renamed and the test hat is currently on the workspace!

                blocklyBlock.childBlocks_[0].getField('TEXT').text_ = newName;

                if (this.workspace.isDragging()) {
                    this.props.rerenderBbtTestHatLater(blocklyBlock);
                } else {
                    this.props.rerenderBbtTestHat(blocklyBlock);
                }
            }
        }

        if (!this.workspace.isDragging()) {
            this.props.rerenderDeferredBbtTestHatsNow();
        }
    }

    async handleLocate (spriteId, hatBlockId) {
        await this.props.handleActivateCodeTab();
        this.props.vm.setEditingTarget(spriteId);
        this.props.vm.runtime.blinkBlock(hatBlockId);
        ScratchBlocks.getMainWorkspace()
            .centerOnBlock(hatBlockId);
    }

    handleRunBBTTest (testId) {
        this.props.runBBTTest(testId);
    }

    handleRunWhiskerTest (testId) {
        this.props.runWhiskerTest(testId);
    }

    render () {
        if (!this.props.interfaceVisible) return null;

        const testCollapsiblesBBT = Object.values(this.props.bbtTests)
            .map(test => {

                let spriteName;
                if (this.props.sprites[test.containingSpriteId]) {
                    spriteName = this.props.sprites[test.containingSpriteId].name;
                } else if (this.props.stage.id === test.containingSpriteId) {
                    spriteName = this.props.stage.name;
                }

                return (
                    <BBTTestCollapsibleComponent
                        isTestOrTestChainRunning={!this.props.runAllTestsEnabled}
                        key={test.id}
                        id={test.id}
                        name={test.name}
                        description={test.description}
                        status={test.status}
                        errors={test.errors}
                        containingSpriteId={test.containingSpriteId}
                        containingSpriteName={spriteName}
                        onLocate={this.handleLocate}
                        onRunTest={this.handleRunBBTTest}
                    />
                );
            });

        const testCollapsiblesWhisker = Object.values(this.props.whiskerTests)
            .map(test => (
                <BBTTestCollapsibleComponent
                    isTestOrTestChainRunning={!this.props.runAllTestsEnabled}
                    key={test.id}
                    id={test.id}
                    name={test.name}
                    description={test.description}
                    status={test.status}
                    errors={test.errors}
                    onRunTest={this.handleRunWhiskerTest}
                />
            ));

        const isRunAllButtonEnabled =
            this.props.runAllTestsEnabled &&
            (Object.keys(this.props.bbtTests).length > 0 || Object.keys(this.props.whiskerTests).length > 0);

        return (
            <BBTWrapperComponent
                isRunAllButtonEnabled={isRunAllButtonEnabled}
                onRunAllTests={this.handleRunAllTests}
                isWhiskerUploadButtonEnabled={this.props.runAllTestsEnabled}
                onUploadWhiskerTests={this.props.onClickWhiskerTestsUpload}
                isBBTExampleWindowVisible={this.props.isExamplesWindowVisible}
                isBBTBatchEvalWindowVisible={this.props.isBatchEvalWindowVisible}
                isBBTCoordinatesTooltipVisible={this.props.isCoordinatesTooltipVisible}
                onToggleBBTExamplesWindow={this.props.handleToggleBBTExamplesWindowVisibility}
                onToggleBatchEvaluationWindow={this.props.handleToggleBatchEvaluationWindowVisibility}
                onToggleBBTCoordinatesTooltip={this.props.handleToggleBBTCoordinatesTooltipVisibility}
                isClearAllTestResultsButtonEnabled={this.props.runAllTestsEnabled}
                onClearAllTestStatus={this.handleClearAllTestStatus}
                onCloseBBTInterface={this.props.handleHideInterface}
                testCollapsiblesBBT={testCollapsiblesBBT}
                testCollapsiblesWhisker={testCollapsiblesWhisker}
                isInfoPanelVisible={this.props.isInfoPanelVisible}
                isTestChainRunning={!this.props.runAllTestsEnabled}
                numberOfPassedTests={this.props.numberOfPassedTests}
                numberOfFailedTests={this.props.numberOfFailedTests}
                numberOfTotalTests={this.props.numberOfTotalTests}
            />
        );
    }
}

BBTTestInterface.propTypes = {

    // provided by bbtTestCreationHOC
    onClickWhiskerTestsUpload: PropTypes.func.isRequired,
    onBBTSync: PropTypes.func.isRequired,

    // provided by bbtTestExecutionLogicHOC
    runAllTests: PropTypes.func.isRequired,
    runBBTTest: PropTypes.func.isRequired,
    runWhiskerTest: PropTypes.func.isRequired,

    // provided by bbtWorkspaceInteractionHOC
    setBlockTempColor: PropTypes.func.isRequired,
    clearBlockTempColorForSpecificColor: PropTypes.func.isRequired,
    clearBlockTempColorsOfAllBlocksWithinScript: PropTypes.func.isRequired,
    setStackResultGlow: PropTypes.func.isRequired,
    reapplyBlockTempColorsAndScriptGlows: PropTypes.func.isRequired,
    clearBlockTempColorsAndScriptGlows: PropTypes.func.isRequired,
    fixYellowGlowOfATestScript: PropTypes.func.isRequired,
    rerenderBbtTestHat: PropTypes.func.isRequired,
    rerenderBbtTestHatLater: PropTypes.func.isRequired,
    rerenderDeferredBbtTestHatsNow: PropTypes.func.isRequired,


    interfaceVisible: PropTypes.bool.isRequired,
    isInfoPanelVisible: PropTypes.bool.isRequired,
    isExamplesWindowVisible: PropTypes.bool.isRequired,
    isBatchEvalWindowVisible: PropTypes.bool.isRequired,
    isCoordinatesTooltipVisible: PropTypes.bool.isRequired,
    runAllTestsEnabled: PropTypes.bool.isRequired,
    bbtTests: PropTypes.object.isRequired,
    whiskerTests: PropTypes.object.isRequired,
    sprites: PropTypes.object.isRequired,
    stage: PropTypes.object.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
    isShowingProject: PropTypes.bool.isRequired,
    numberOfPassedTests: PropTypes.number.isRequired,
    numberOfFailedTests: PropTypes.number.isRequired,
    numberOfTotalTests: PropTypes.number.isRequired,
    handleToggleBBTExamplesWindowVisibility: PropTypes.func.isRequired,
    handleToggleBatchEvaluationWindowVisibility: PropTypes.func.isRequired,
    handleToggleBBTCoordinatesTooltipVisibility: PropTypes.func.isRequired,
    handleHideInterface: PropTypes.func.isRequired,
    handleSetRunAllTestsEnabled: PropTypes.func.isRequired,
    handleActivateCodeTab: PropTypes.func.isRequired,
    handleSetTestStatus: PropTypes.func.isRequired,
    handleSetBatchEvalTestStatus: PropTypes.func.isRequired,
    handleAddError: PropTypes.func.isRequired,
    handleClearTestStatus: PropTypes.func.isRequired,
    handleClearAllTestStatus: PropTypes.func.isRequired,
    handleShowInfoPanel: PropTypes.func.isRequired,
    handleResetInfoPanelStatus: PropTypes.func.isRequired,
    handleSetTotalTestsForInfoPanel: PropTypes.func.isRequired,
    handleIncrementInfoPanelPassedTests: PropTypes.func.isRequired,
    handleIncrementInfoPanelFailedTests: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    interfaceVisible: state.scratchGui.blockBasedTesting.interfaceVisible,
    isExamplesWindowVisible: state.scratchGui.blockBasedTesting.examplesWindowVisible,
    isBatchEvalWindowVisible: state.scratchGui.blockBasedTesting.batchEvaluationWindowVisible,
    isCoordinatesTooltipVisible: state.scratchGui.blockBasedTesting.coordinatesTooltipVisible,
    bbtTests: state.scratchGui.blockBasedTesting.bbtTests,
    whiskerTests: state.scratchGui.blockBasedTesting.whiskerTests,
    sprites: state.scratchGui.targets.sprites,
    stage: state.scratchGui.targets.stage,
    isShowingProject: getIsShowingProject(state.scratchGui.projectState.loadingState),
    isInfoPanelVisible: state.scratchGui.blockBasedTesting.infoPanelVisible,
    runAllTestsEnabled: state.scratchGui.blockBasedTesting.runAllTestsEnabled,
    numberOfFailedTests: state.scratchGui.blockBasedTesting.infoPanelFailedTests,
    numberOfPassedTests: state.scratchGui.blockBasedTesting.infoPanelPassedTests,
    numberOfTotalTests: state.scratchGui.blockBasedTesting.infoPanelTotalTests
});

const mapDispatchToProps = dispatch => ({
    handleToggleBBTExamplesWindowVisibility: () => dispatch(toggleExamplesWindowVisibility()),
    handleToggleBatchEvaluationWindowVisibility: () => dispatch(toggleBatchEvaluationWindowVisibility()),
    handleToggleBBTCoordinatesTooltipVisibility: () => dispatch(toggleCoordinatesTooltipVisibility()),
    handleHideInterface: () => dispatch(hideInterface()),
    handleSetRunAllTestsEnabled: value => dispatch(setRunAllTestsEnabled(value)),
    handleActivateCodeTab: () => dispatch(activateTab(BLOCKS_TAB_INDEX)),
    handleSetTestStatus: (testID, newStatus) => dispatch(setTestStatus(testID, newStatus)),
    handleSetBatchEvalTestStatus: (fileID, testID, newStatus) =>
        dispatch(setBatchEvalTestStatus(fileID, testID, newStatus)),
    handleAddError: errorObject => dispatch(addError(errorObject)),
    handleClearTestStatus: (testID, newStatus) => dispatch(clearTestStatus(testID, newStatus)),
    handleClearAllTestStatus: () => dispatch(clearAllTestStatus()),
    handleShowInfoPanel: () => dispatch(showInfoPanel()),
    handleResetInfoPanelStatus: () => dispatch(resetInfoPanelStatus()),
    handleIncrementInfoPanelPassedTests: () => dispatch(incrementInfoPanelPassedTests()),
    handleIncrementInfoPanelFailedTests: () => dispatch(incrementInfoPanelFailedTests()),
    handleSetTotalTestsForInfoPanel: number => dispatch(setTotalTestsForInfoPanel(number))
});

export default compose(
    bbtTestCreationHOC,
    bbtTestExecutionLogicHOC,
    bbtWorkspaceInteractionHOC,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(BBTTestInterface);

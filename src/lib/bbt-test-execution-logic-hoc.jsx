import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import VM from 'scratch-vm';
import {
    addError,
    clearAllTestStatus,
    clearTestStatus,
    incrementInfoPanelFailedTests,
    incrementInfoPanelPassedTests,
    setRunAllTestsEnabled,
    setTestStatus
} from '../reducers/block-based-testing';
import {TestRunner} from 'whisker/whisker-main';

const BBTTestManager = {
    testChainRunning: false,
    testChainBbtTests: [],
    batchEvaluationRunning: false,
    batchEvaluationFileID: -1,
    expectingTestEnd: false,
    callbackAfterAllTestsAreDone: null
};

/**
 * Higher Order Component providing BBT test execution logic functionality.
 *
 * @param {React.Component} WrappedComponent component that needs BBT test execution logic functionality
 * @returns {React.Component} original component enhanced with BBT test execution logic functionality
 */
const bbtTestExecutionLogicHOC = function (WrappedComponent) {

    class bbtTestExecutionLogic extends React.Component {

        constructor (props) {
            super(props);

            bindAll(this, [
                'connectTestRelatedListeners',
                'disconnectTestRelatedListeners',
                'runAllTests',
                'onBBTTestFinishedNaturally',
                'onProjectRunStop',
                'runNextTest',
                'runBBTTest',
                'runAllWhiskerTests',
                'runWhiskerTest'
            ]);
        }

        connectTestRelatedListeners () {
            BBTTestManager.expectingTestEnd = true;
            this.props._vm.addListener('BBT_TEST_FINISHED_NATURALLY', this.onBBTTestFinishedNaturally);
            this.props._vm.addListener('PROJECT_RUN_STOP', this.onProjectRunStop);
        }

        disconnectTestRelatedListeners () {
            BBTTestManager.expectingTestEnd = false;
            this.props._vm.removeListener('BBT_TEST_FINISHED_NATURALLY', this.onBBTTestFinishedNaturally);
            this.props._vm.removeListener('PROJECT_RUN_STOP', this.onProjectRunStop);
        }

        runAllTests (optCallbackAfterAllTestsAreDone) {
            if (BBTTestManager.testChainRunning || this.props._vm.runtime.testRunning) {
                return;
            }

            BBTTestManager.callbackAfterAllTestsAreDone = optCallbackAfterAllTestsAreDone;

            this.props._setBusyWithTestStuff(true);
            this.props._clearAllTestStatus();
            BBTTestManager.testChainRunning = true;
            BBTTestManager.testChainBbtTests = Object.keys(this.props._bbtTests);

            // start the chain
            this.runNextTest();
        }

        runNextTest () {
            if (this.props._vm.runtime.testRunning) {
                return;
            }

            const nextTestId = BBTTestManager.testChainBbtTests.shift();

            if (!nextTestId) {
                this.runAllWhiskerTests();

                BBTTestManager.testChainRunning = false;
                this.props._setBusyWithTestStuff(false);

                if (BBTTestManager.callbackAfterAllTestsAreDone) {
                    BBTTestManager.callbackAfterAllTestsAreDone();
                    BBTTestManager.callbackAfterAllTestsAreDone = null;
                }

                return;
            }

            if (!this.props._bbtTests.hasOwnProperty(nextTestId)) {
                this.runNextTest();
                return;
            }

            this.runBBTTest(nextTestId);
        }

        runBBTTest (testId) {
            if (this.props._vm.runtime.testRunning) {
                return;
            }

            const test = this.props._bbtTests[testId];

            if (!test) {
                return;
            }

            this.props._setBusyWithTestStuff(true);

            // listen to test end events only if this instance was the one starting the test
            this.connectTestRelatedListeners();

            this.props._vm.runtime._pushThread(
                testId, this.props._vm.runtime.getTargetById(test.containingSpriteId), null);
        }

        async runAllWhiskerTests () {
            if (this.props._vm.runtime.testRunning) {
                return;
            }

            for (const whiskerTestID of Object.keys(this.props._whiskerTests)) {
                await this.runWhiskerTest(whiskerTestID);
            }
        }

        async runWhiskerTest (testID) {
            if (this.props._vm.runtime.testRunning) {
                return;
            }

            this.props._vm.runtime.testRunning = true;
            this.props._setBusyWithTestStuff(true);
            this.props._handleClearTestStatus(testID, 'running');

            const test = this.props._whiskerTests[testID];
            if (!test) {
                return;
            }

            const whiskerTestRunner = new TestRunner();
            const result = await whiskerTestRunner.runTestInPreloadedVM(this.props._vm, test);

            if (result.status === 'pass') {
                this.props._handleSetTestStatus(testID, 'pass');
                this.props._handleIncrementInfoPanelPassedTests();

            } else {
                this.props._handleAddError({
                    testId: testID,
                    blockId: testID,
                    type: 'WHISKER_TEST_ERROR'
                });

                this.props._handleSetTestStatus(testID, 'fail');
                this.props._handleIncrementInfoPanelFailedTests();
            }

            this.props._vm.runtime.testRunning = false;
            this.props._setBusyWithTestStuff(false);
        }

        onBBTTestFinishedNaturally () {
            this.disconnectTestRelatedListeners();

            if (BBTTestManager.testChainRunning) {
                this.runNextTest();
            } else {
                this.props._setBusyWithTestStuff(false);
            }
        }

        onProjectRunStop () {
            this.disconnectTestRelatedListeners();

            BBTTestManager.testChainRunning = false;
            BBTTestManager.testChainBbtTests = [];
            BBTTestManager.batchEvaluationRunning = false;

            if (BBTTestManager.callbackAfterAllTestsAreDone) {
                BBTTestManager.callbackAfterAllTestsAreDone();
            }

            BBTTestManager.callbackAfterAllTestsAreDone = null;

            this.props._setBusyWithTestStuff(false);
        }

        render () {
            const {
                /* eslint-disable no-unused-vars */
                _vm,
                _bbtTests,
                _whiskerTests,
                _clearAllTestStatus,
                _setBusyWithTestStuff,
                _handleSetTestStatus,
                _handleClearTestStatus,
                _handleAddError,
                _handleIncrementInfoPanelPassedTests,
                _handleIncrementInfoPanelFailedTests,
                /* eslint-enable no-unused-vars */

                ...componentProps
            } = this.props;

            return (
                <WrappedComponent
                    runAllTests={this.runAllTests}
                    runBBTTest={this.runBBTTest}
                    runWhiskerTest={this.runWhiskerTest}
                    {...componentProps}
                />
            );
        }
    }

    bbtTestExecutionLogic.propTypes = {
        _vm: PropTypes.instanceOf(VM).isRequired,
        _bbtTests: PropTypes.object.isRequired,
        _whiskerTests: PropTypes.object.isRequired,

        _clearAllTestStatus: PropTypes.func.isRequired,
        _setBusyWithTestStuff: PropTypes.func.isRequired,
        _handleSetTestStatus: PropTypes.func.isRequired,
        _handleClearTestStatus: PropTypes.func.isRequired,
        _handleAddError: PropTypes.func.isRequired,
        _handleIncrementInfoPanelPassedTests: PropTypes.func.isRequired,
        _handleIncrementInfoPanelFailedTests: PropTypes.func.isRequired
    };

    const mapStateToProps = state => ({
        _vm: state.scratchGui.vm,
        _bbtTests: state.scratchGui.blockBasedTesting.bbtTests,
        _whiskerTests: state.scratchGui.blockBasedTesting.whiskerTests
    });

    const mapDispatchToProps = dispatch => ({
        _clearAllTestStatus: () => dispatch(clearAllTestStatus()),
        _setBusyWithTestStuff: newValue => dispatch(setRunAllTestsEnabled(!newValue)), // TODO rename
        _handleSetTestStatus: (testID, newStatus) => dispatch(setTestStatus(testID, newStatus)),
        _handleClearTestStatus: (testID, newStatus) => dispatch(clearTestStatus(testID, newStatus)),
        _handleAddError: errorObject => dispatch(addError(errorObject)),
        _handleIncrementInfoPanelPassedTests: () => dispatch(incrementInfoPanelPassedTests()),
        _handleIncrementInfoPanelFailedTests: () => dispatch(incrementInfoPanelFailedTests())
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(bbtTestExecutionLogic);
};

export default bbtTestExecutionLogicHOC;

export {BBTTestManager};

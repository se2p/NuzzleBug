import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {addWhiskerTest, replaceBBTTests} from '../reducers/block-based-testing';
import {TestRunner} from 'whisker/whisker-main';
import VM from 'scratch-vm';

/**
 * Higher Order Component providing both BBT and Whisker test creation functionality.
 *
 * @param {React.Component} WrappedComponent component that needs test creation functionality
 * @returns {React.Component} original component enhanced with test creation functionality
 */
const bbtTestCreationHOC = function (WrappedComponent) {

    class bbtTestCreation extends React.Component {
        constructor (props) {
            super(props);

            bindAll(this, [
                'handleClickWhiskerTestsUpload',
                'handleBBTSync'
            ]);
        }

        /**
         * Reads the VM's block representation, finds all BBT test hats
         * and updates the tests stored in the Redux store. Can also ensure
         * that a (newly created?) BBT test has a unique name.
         *
         * @param {?string} blockIdToDedupe BBT test hat block or corresponding input block.
         * If provided, it is ensured that this BBT test has a unique name.
         * @returns {string|null} the new test name if the deduplication (renaming)
         * of the test name was necessary. Otherwise, null. Callers can use this
         * to decide if the field of the blockly block needs to be updated and re-rendered.
         */
        handleBBTSync (blockIdToDedupe) {
            let newName = null;
            let allTestNames;

            if (blockIdToDedupe) {
                allTestNames = Object.values(this.props._bbtTests)
                    .map(bbtTest => bbtTest.name);
            }

            const foundTests = {};

            for (const target of this.props._vm.runtime.targets) {

                const bbtTestHatBlocks = Object.values(target.blocks._blocks)
                    .filter(block => block.opcode === 'bbt_testHat');

                for (const bbtTestHatBlock of bbtTestHatBlocks) {

                    // input block: where the test name can be entered
                    const correspondingInputBlock = target.blocks._blocks[bbtTestHatBlock.inputs.testName.block];
                    const correspondingComment = target.comments[bbtTestHatBlock.comment];

                    if (!correspondingInputBlock) {
                        // BBT test hat block without input block?
                        continue;
                    }

                    const testName = correspondingInputBlock.fields.TEXT.value;

                    // deduplication of test name needed?
                    if (!newName &&
                        blockIdToDedupe &&
                        (blockIdToDedupe === bbtTestHatBlock.id ||
                            blockIdToDedupe === correspondingInputBlock.id) &&
                        allTestNames.includes(testName)) {

                        if (target.blocks._blocks[blockIdToDedupe].opcode === 'text') {
                            blockIdToDedupe = target.blocks._blocks[blockIdToDedupe].parent;
                        }

                        const bbtTest = this.props._bbtTests[blockIdToDedupe];

                        if (bbtTest) {
                            allTestNames.splice(allTestNames.indexOf(bbtTest.name));
                        }

                        newName = this._createUnusedName(testName, allTestNames);
                        /* eslint-disable-next-line no-console */
                        console.log(`${testName} is duplicate, renaming to ${newName}`);

                        correspondingInputBlock.fields.TEXT.value = newName;
                    }

                    foundTests[bbtTestHatBlock.id] =
                        {
                            id: bbtTestHatBlock.id,
                            name: correspondingInputBlock.fields.TEXT.value,
                            description: correspondingComment ? correspondingComment.text : null,
                            containingSpriteId: target.id,
                            hatBlockId: bbtTestHatBlock.id
                        };
                }
            }

            this.props._dispatchReplaceBBTTests(foundTests);
            return newName;
        }

        /**
         * Generates a unique name. Adapted from scratch-vm StringUtils.
         *
         * @param {string} name a potential name that may not be unique
         * @param {string[]} existingNames array of existing names
         * @returns {string} a unique name, similar to
         * the original name with incrementing number at the end
         */
        _createUnusedName (name, existingNames) {
            let j = name.length - 1;
            while ((j >= 0) && ('0123456789'.indexOf(name.charAt(j)) > -1)) j--;
            name = name.slice(0, j + 1);
            let i = 2;
            while (existingNames.indexOf(name + i) >= 0) i++;
            return name + i;
        }

        /**
         * Handles uploading Whisker tests from file.
         *
         * @param {object} event the 'change' event from a file input
         */
        handleClickWhiskerTestsUpload (event) {
            const reader = new FileReader();

            reader.onload = e => {
                const uploadedTests = this._createWhiskerTestsFromString(e.target.result);

                for (const test of uploadedTests) {
                    this.props._dispatchAddWhiskerTest(test);
                }
            };

            reader.readAsText(event.target.files[0]);
        }

        /**
         * Creates Whisker tests from the content of a file.
         * Copied from whisker-web (loadTestsFromString).
         *
         * @param {object} string containing the content of a Whisker tests file
         * @returns {Test[]} an array of Whisker tests
         */
        _createWhiskerTestsFromString (string) {

            /* eslint-disable-next-line no-eval */
            const tests = eval(`
                (function () {
                    const module = Object.create(null);
                    ${string};
                    return module.exports;
                })();
            `);

            return TestRunner.convertTests(tests);
        }

        render () {
            const {
                /* eslint-disable no-unused-vars */
                _vm,
                _bbtTests,
                _dispatchAddWhiskerTest,
                _dispatchReplaceBBTTests,
                /* eslint-enable no-unused-vars */

                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    onClickWhiskerTestsUpload={this.handleClickWhiskerTestsUpload}
                    onBBTSync={this.handleBBTSync}
                    {...componentProps}
                />
            );
        }
    }

    bbtTestCreation.propTypes = {
        _vm: PropTypes.instanceOf(VM).isRequired,
        _bbtTests: PropTypes.object.isRequired,
        _dispatchAddWhiskerTest: PropTypes.func.isRequired,
        _dispatchReplaceBBTTests: PropTypes.func.isRequired
    };

    const mapStateToProps = state => ({
        _vm: state.scratchGui.vm,
        _bbtTests: state.scratchGui.blockBasedTesting.bbtTests
    });

    const mapDispatchToProps = dispatch => ({
        _dispatchAddWhiskerTest: newTest => dispatch(addWhiskerTest(newTest)),
        _dispatchReplaceBBTTests: newTests => dispatch(replaceBBTTests(newTests))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(bbtTestCreation);
};

export default bbtTestCreationHOC;

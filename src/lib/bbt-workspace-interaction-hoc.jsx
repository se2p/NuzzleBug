import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import VM from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';

const blocksWithTempColor = new Map();
const scriptsWithResultGlow = new Map();
let bbtTestHatsToRenderLater = [];

/**
 * Higher Order Component to interact with the workspace.
 *
 * @param {React.Component} WrappedComponent component that needs workspace interaction functionality
 * @returns {React.Component} original component enhanced with workspace interaction functionality
 */
const bbtWorkspaceInteractionHOC = function (WrappedComponent) {

    class bbtWorkspaceInteraction extends React.Component {
        constructor (props) {
            super(props);

            bindAll(this, [
                'setBlockTempColor',
                'clearBlockTempColorForSpecificColor',
                'clearBlockTempColorsOfAllBlocksWithinScript',
                'setStackResultGlow',
                'reapplyBlockTempColorsAndScriptGlows',
                'clearBlockTempColorsAndScriptGlows',
                'fixYellowGlowOfATestScript',
                'rerenderBbtTestHatLater',
                'rerenderDeferredBbtTestHatsNow'
            ]);
        }

        componentDidMount () {
            this.workspace = ScratchBlocks.getMainWorkspace();
        }

        /**
         * Set temp color of a block.
         *
         * @param {string} blockId block ID
         * @param {string|null} color hex string of color (e.g. '#d53b3b'), or null to remove temp color
         */
        setBlockTempColor (blockId, color) {
            if (color) {
                blocksWithTempColor.set(blockId, color);
            } else {
                blocksWithTempColor.delete(blockId);
            }

            try {
                this.workspace.setBlockTempColor(blockId, color);
            } catch (ignored) {
                // ignore blocks that don't exist, maybe they were deleted or
                // are not currently on the workspace because they
                // belong to a target other than the current editingTarget
            }
        }

        /**
         * Apply red or green glow to a script, with blinking.
         *
         * @param {string} topBlockId top block ID
         * @param {('pass'|'fail')} result result of the test
         */
        setStackResultGlow (topBlockId, result) {
            scriptsWithResultGlow.set(topBlockId, result);

            // blinking, adapted from scratch-vm blinkBlock
            const glowTimes = 2;
            const glowDuration = 150; // ms
            for (let i = 0; i < glowTimes; i++) {
                setTimeout(() => {
                    try {
                        this.workspace.glowStack(topBlockId, false);
                    } catch (ignored) {
                        // the test script is probably not currently on the workspace
                        // because it belongs to a target other than the current editingTarget
                    }
                    setTimeout(() => {
                        try {
                            this.workspace.glowStackCustomColor(topBlockId, result);
                        } catch (ignored) {
                            // ignored
                        }
                    }, glowDuration);
                }, i * 2 * glowDuration);
            }
        }

        /**
         * Re-apply block temp colors and script glows.
         * Useful when another sprite is selected in the GUI.
         */
        reapplyBlockTempColorsAndScriptGlows () {
            for (const [blockId, color] of blocksWithTempColor) {
                try {
                    this.workspace.setBlockTempColor(blockId, color);
                } catch (ignored) {
                    // ignored
                }
            }

            for (const [topBlockId, result] of scriptsWithResultGlow) {
                try {
                    this.workspace.glowStackCustomColor(topBlockId, result);
                } catch (ignored) {
                    // ignored
                }
            }
        }

        /**
         * Clear block temp colors and script glows.
         */
        clearBlockTempColorsAndScriptGlows () {
            for (const [topBlockId, _] of scriptsWithResultGlow) {
                try {
                    this.workspace.glowStack(topBlockId, false);
                } catch (ignored) {
                    // ignored
                }
            }
            scriptsWithResultGlow.clear();

            for (const [blockId, _] of blocksWithTempColor) {
                try {
                    this.workspace.setBlockTempColor(blockId, null);
                } catch (ignored) {
                    // ignored
                }
            }
            blocksWithTempColor.clear();
        }

        /**
         * Clears the block temp color of all blocks with a specific color.
         *
         * @param {string} specifiedColor hex string of color (e.g. '#d53b3b')
         */
        clearBlockTempColorForSpecificColor (specifiedColor) {
            const blockIdsToClear = [];

            for (const [blockId, color] of blocksWithTempColor) {
                if (color === specifiedColor) {
                    blockIdsToClear.push(blockId);
                }
            }

            for (const blockId of blockIdsToClear) {
                this.setBlockTempColor(blockId, null);
            }
        }

        /**
         * Clears the block temp color of all blocks within a script.
         *
         * @param {string} targetId target ID
         * @param {string} topBlockId top block ID
         */
        clearBlockTempColorsOfAllBlocksWithinScript (targetId, topBlockId) {
            const target = this.props._vm.runtime.getTargetById(targetId);

            if (!target) {
                return;
            }

            const blockIdsToClear = [];

            for (const [blockId, _] of blocksWithTempColor) {
                const currentTopBlockId = target.blocks.getTopLevelScript(blockId);

                if (currentTopBlockId && currentTopBlockId === topBlockId) {
                    blockIdsToClear.push(blockId);
                }
            }

            for (const blockId of blockIdsToClear) {
                this.setBlockTempColor(blockId, null);
            }
        }

        /**
         * A test script that has a result glow will not change its glow
         * from green/red to yellow again when re-run. This function fixes that
         * by turning it off and on again. "Hello, IT?"
         *
         * @param {string} topBlockId top block ID
         */
        fixYellowGlowOfATestScript (topBlockId) {
            try {
                // remove test result glow if any
                this.workspace.glowStack(topBlockId, false);
                // manually glow running test, since test result glow prevented this
                this.workspace.glowStack(topBlockId, true);

            } catch (ignored) {
                // ignored
            }
        }

        /**
         * Rerender the name input field of a BBT Test Hat.
         *
         * @param {object} blocklyBlock blocklyBlock
         */
        rerenderBbtTestHat (blocklyBlock) {
            if (!blocklyBlock.childBlocks_[0]) return;

            blocklyBlock.childBlocks_[0].getField('TEXT')
                .forceRerender();
        }

        /**
         * If a field of a block is forcefully re-rendered while it is being dragged,
         * visual glitches occur. Therefore, they are not re-rendered immediately,
         * but later.
         * (Currently used for BBT test hats when preventing duplicate test names.)
         *
         * @param {object} blocklyBlock blocklyBlock
         */
        rerenderBbtTestHatLater (blocklyBlock) {
            bbtTestHatsToRenderLater.push(blocklyBlock);
        }

        /**
         * If a field of a block is forcefully re-rendered while it is being dragged,
         * visual glitches occur. Therefore, they are not re-rendered immediately,
         * but later. Call this function when it is time for that.
         * (Currently used for BBT test hats when preventing duplicate test names.)
         */
        rerenderDeferredBbtTestHatsNow () {
            for (const blocklyBBTTestHat of bbtTestHatsToRenderLater) {
                this.rerenderBbtTestHat(blocklyBBTTestHat);
            }

            bbtTestHatsToRenderLater = [];
        }

        render () {
            const {
                /* eslint-disable no-unused-vars */
                _vm,
                /* eslint-enable no-unused-vars */

                ...componentProps
            } = this.props;

            return (
                <WrappedComponent
                    setBlockTempColor={this.setBlockTempColor}
                    clearBlockTempColorForSpecificColor={this.clearBlockTempColorForSpecificColor}
                    setStackResultGlow={this.setStackResultGlow}
                    reapplyBlockTempColorsAndScriptGlows={this.reapplyBlockTempColorsAndScriptGlows}
                    clearBlockTempColorsAndScriptGlows={this.clearBlockTempColorsAndScriptGlows}
                    fixYellowGlowOfATestScript={this.fixYellowGlowOfATestScript}
                    rerenderBbtTestHat={this.rerenderBbtTestHat}
                    rerenderBbtTestHatLater={this.rerenderBbtTestHatLater}
                    rerenderDeferredBbtTestHatsNow={this.rerenderDeferredBbtTestHatsNow}
                    clearBlockTempColorsOfAllBlocksWithinScript={this.clearBlockTempColorsOfAllBlocksWithinScript}
                    {...componentProps}
                />
            );
        }

    }

    bbtWorkspaceInteraction.propTypes = {
        _vm: PropTypes.instanceOf(VM).isRequired
    };

    const mapStateToProps = state => ({
        _vm: state.scratchGui.vm
    });

    return connect(
        mapStateToProps
    )(bbtWorkspaceInteraction);
};

export default bbtWorkspaceInteractionHOC;

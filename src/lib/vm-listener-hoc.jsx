import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';

import {connect} from 'react-redux';

import {injectIntl, intlShape} from 'react-intl';

import {updateTargets} from '../reducers/targets';
import {updateBlockDrag} from '../reducers/block-drag';
import {updateMonitors} from '../reducers/monitors';
import {setProjectChanged, setProjectUnchanged} from '../reducers/project-changed';
import {
    setRunningState,
    setPauseState,
    setTurboState,
    setStartedState,
    setTestRunningState,
    setTracingActiveState
} from '../reducers/vm-status';
import {showExtensionAlert} from '../reducers/alerts';
import {updateMicIndicator} from '../reducers/mic-indicator';
import {
    openBlockDebugger,
    disableDebugger,
    enableDebugger
} from '../reducers/interrogative-debugging/version-2/ir-debugger';

/*
 * Higher Order Component to manage events emitted by the VM
 * @param {React.Component} WrappedComponent component to manage VM events for
 * @returns {React.Component} connected component with vm events bound to redux
 */
const vmListenerHOC = function (WrappedComponent) {
    class VMListener extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'handleKeyDown',
                'handleKeyUp',
                'handleProjectChanged',
                'handleTracingLimitReached',
                'handleTracingDeactivated',
                'handleBlockDragUpdate',
                'handleTargetsUpdate'
            ]);
            // We have to start listening to the vm here rather than in
            // componentDidMount because the HOC mounts the wrapped component,
            // so the HOC componentDidMount triggers after the wrapped component
            // mounts.
            // If the wrapped component uses the vm in componentDidMount, then
            // we need to start listening before mounting the wrapped component.
            this.props.vm.on('targetsUpdate', this.handleTargetsUpdate);
            this.props.vm.on('MONITORS_UPDATE', this.props.onMonitorsUpdate);
            this.props.vm.on('BLOCK_DRAG_UPDATE', this.handleBlockDragUpdate);
            this.props.vm.on('BLOCK_ASK_WHY', this.props.onBlockAskWhy);
            this.props.vm.on('TURBO_MODE_ON', this.props.onTurboModeOn);
            this.props.vm.on('TURBO_MODE_OFF', this.props.onTurboModeOff);
            this.props.vm.on('PROJECT_RUN_START', this.props.onProjectRunStart);
            this.props.vm.on('PROJECT_RUN_STOP', this.props.onProjectRunStop);
            this.props.vm.on('PROJECT_RUN_PAUSE', this.props.onProjectRunPause);
            this.props.vm.on('PROJECT_RUN_RESUME', this.props.onProjectRunResume);
            this.props.vm.on('PROJECT_CHANGED', this.handleProjectChanged);
            this.props.vm.on('RUNTIME_STARTED', this.props.onRuntimeStarted);
            this.props.vm.on('PROJECT_START', this.props.onGreenFlag);
            this.props.vm.on('PERIPHERAL_CONNECTION_LOST_ERROR', this.props.onShowExtensionAlert);
            this.props.vm.on('MIC_LISTENING', this.props.onMicListeningUpdate);
            this.props.vm.on('TRACING_ACTIVE', this.props.onActivateTracing);
            this.props.vm.on('TRACING_INACTIVE', this.props.onDeactivateTracing);
            this.props.vm.on('TRACING_LIMIT_REACHED', this.handleTracingLimitReached);
            this.props.vm.on('TRACING_DEACTIVATED', this.handleTracingDeactivated);
            this.props.vm.on('TEST_RUN_START', this.props.onTestRunStart);
            this.props.vm.on('TEST_RUN_END', this.props.onTestRunEnd);
        }
        componentDidMount () {
            if (this.props.attachKeyboardEvents) {
                document.addEventListener('keydown', this.handleKeyDown);
                document.addEventListener('keyup', this.handleKeyUp);
            }
            this.props.vm.postIOData('userData', {username: this.props.username});
        }
        componentDidUpdate (prevProps) {
            if (prevProps.username !== this.props.username) {
                this.props.vm.postIOData('userData', {username: this.props.username});
            }

            // Re-request a targets update when the shouldUpdateTargets state changes to true
            // i.e. when the editor transitions out of fullscreen/player only modes
            if (this.props.shouldUpdateTargets && !prevProps.shouldUpdateTargets) {
                this.props.vm.emitTargetsUpdate(false /* Emit the event, but do not trigger project change */);
            }
        }
        componentWillUnmount () {
            this.props.vm.removeListener('PERIPHERAL_CONNECTION_LOST_ERROR', this.props.onShowExtensionAlert);
            this.props.vm.removeListener('TRACING_LIMIT_REACHED', this.handleTracingLimitReached);
            this.props.vm.removeListener('TRACING_DEACTIVATED', this.handleTracingDeactivated);
            if (this.props.attachKeyboardEvents) {
                document.removeEventListener('keydown', this.handleKeyDown);
                document.removeEventListener('keyup', this.handleKeyUp);
            }
        }
        handleProjectChanged () {
            if (this.props.shouldUpdateProjectChanged && !this.props.projectChanged) {
                this.props.onProjectChanged();
            }
        }
        handleTracingLimitReached () {
            // eslint-disable-next-line no-alert
            alert(this.props.intl.formatMessage({id: 'gui.ir-debugger.tracing.limit-reached'}));
        }
        handleTracingDeactivated () {
            // eslint-disable-next-line no-alert
            alert(this.props.intl.formatMessage({id: 'gui.ir-debugger.tracing.deactivated'}));
        }
        handleBlockDragUpdate (areBlocksOverGui) {
            if (this.props.projectChanged) {
                this.props.onProjectSaved();
                this.props.onProjectChanged();
            } else {
                this.props.onProjectChanged();
            }
            this.props.onBlockDragUpdate(areBlocksOverGui);
        }
        handleTargetsUpdate (data) {
            if (this.props.shouldUpdateTargets) {
                this.props.onTargetsUpdate(data);
            }
        }
        handleKeyDown (e) {
            // Don't capture keys intended for Blockly inputs.
            if (e.target !== document && e.target !== document.body) return;

            if (this.props.testRunning) return;

            const key = (!e.key || e.key === 'Dead') ? e.keyCode : e.key;
            this.props.vm.postIOData('keyboard', {
                key: key,
                isDown: true
            });

            // Prevent space/arrow key from scrolling the page.
            if (e.keyCode === 32 || // 32=space
                (e.keyCode >= 37 && e.keyCode <= 40)) { // 37, 38, 39, 40 are arrows
                e.preventDefault();
            }
        }
        handleKeyUp (e) {
            if (this.props.testRunning) return;
            
            // Always capture up events,
            // even those that have switched to other targets.
            const key = (!e.key || e.key === 'Dead') ? e.keyCode : e.key;
            this.props.vm.postIOData('keyboard', {
                key: key,
                isDown: false
            });

            // E.g., prevent scroll.
            if (e.target !== document && e.target !== document.body) {
                e.preventDefault();
            }
        }
        render () {
            const {
                /* eslint-disable no-unused-vars */
                attachKeyboardEvents,
                projectChanged,
                shouldUpdateTargets,
                shouldUpdateProjectChanged,
                onBlockDragUpdate,
                onBlockAskWhy,
                onGreenFlag,
                onKeyDown,
                onKeyUp,
                onMicListeningUpdate,
                onMonitorsUpdate,
                onTargetsUpdate,
                onProjectChanged,
                onProjectRunStart,
                onProjectRunStop,
                onProjectRunPause,
                onProjectRunResume,
                onProjectSaved,
                onRuntimeStarted,
                onTurboModeOff,
                onTurboModeOn,
                onShowExtensionAlert,
                onActivateTracing,
                onDeactivateTracing,
                /* eslint-enable no-unused-vars */
                ...props
            } = this.props;

            delete props.onTestRunStart;
            delete props.onTestRunEnd;

            return <WrappedComponent {...props} />;
        }
    }
    VMListener.propTypes = {
        intl: intlShape.isRequired,
        attachKeyboardEvents: PropTypes.bool,
        onBlockDragUpdate: PropTypes.func.isRequired,
        onBlockAskWhy: PropTypes.func.isRequired,
        onGreenFlag: PropTypes.func,
        onKeyDown: PropTypes.func,
        onKeyUp: PropTypes.func,
        onMicListeningUpdate: PropTypes.func.isRequired,
        onMonitorsUpdate: PropTypes.func.isRequired,
        onProjectChanged: PropTypes.func.isRequired,
        onProjectRunStart: PropTypes.func.isRequired,
        onProjectRunStop: PropTypes.func.isRequired,
        onProjectRunPause: PropTypes.func.isRequired,
        onProjectRunResume: PropTypes.func.isRequired,
        onProjectSaved: PropTypes.func.isRequired,
        onRuntimeStarted: PropTypes.func.isRequired,
        onShowExtensionAlert: PropTypes.func.isRequired,
        onTargetsUpdate: PropTypes.func.isRequired,
        onTurboModeOff: PropTypes.func.isRequired,
        onTurboModeOn: PropTypes.func.isRequired,
        onActivateTracing: PropTypes.func.isRequired,
        onDeactivateTracing: PropTypes.func.isRequired,
        onTestRunStart: PropTypes.func.isRequired,
        onTestRunEnd: PropTypes.func.isRequired,
        projectChanged: PropTypes.bool,
        shouldUpdateTargets: PropTypes.bool,
        shouldUpdateProjectChanged: PropTypes.bool,
        testRunning: PropTypes.bool,
        username: PropTypes.string,
        vm: PropTypes.instanceOf(VM).isRequired
    };
    VMListener.defaultProps = {
        attachKeyboardEvents: true,
        onGreenFlag: () => ({})
    };
    const mapStateToProps = state => ({
        projectChanged: state.scratchGui.projectChanged,
        // Do not emit target or project updates in fullscreen or player only mode
        // or when recording sounds (it leads to garbled recordings on low-power machines)
        shouldUpdateTargets: !state.scratchGui.mode.isFullScreen && !state.scratchGui.mode.isPlayerOnly &&
            !state.scratchGui.modals.soundRecorder,
        // Do not update the projectChanged state in fullscreen or player only mode
        shouldUpdateProjectChanged: !state.scratchGui.mode.isFullScreen && !state.scratchGui.mode.isPlayerOnly,
        vm: state.scratchGui.vm,
        testRunning: state.scratchGui.vmStatus.testRunning,
        username: state.session && state.session.session && state.session.session.user ?
            state.session.session.user.username : ''
    });
    const mapDispatchToProps = dispatch => ({
        onTargetsUpdate: data => {
            dispatch(updateTargets(data.targetList, data.editingTarget));
        },
        onMonitorsUpdate: monitorList => {
            dispatch(updateMonitors(monitorList));
        },
        onBlockDragUpdate: areBlocksOverGui => {
            dispatch(updateBlockDrag(areBlocksOverGui));
        },
        onBlockAskWhy: blockId => {
            dispatch(openBlockDebugger(blockId));
        },
        onProjectRunStart: () => dispatch(setRunningState(true)),
        onProjectRunStop: () => dispatch(setRunningState(false)),
        onProjectRunPause: () => dispatch(setPauseState(true)),
        onProjectRunResume: () => dispatch(setPauseState(false)),
        onProjectChanged: () => dispatch(setProjectChanged()),
        onProjectSaved: () => dispatch(setProjectUnchanged()),
        onRuntimeStarted: () => dispatch(setStartedState(true)),
        onTurboModeOn: () => dispatch(setTurboState(true)),
        onTurboModeOff: () => dispatch(setTurboState(false)),
        onShowExtensionAlert: data => {
            dispatch(showExtensionAlert(data));
        },
        onMicListeningUpdate: listening => {
            dispatch(updateMicIndicator(listening));
        },
        onActivateTracing: () => {
            dispatch(setTracingActiveState(true));
            dispatch(enableDebugger());
        },
        onDeactivateTracing: () => {
            dispatch(setTracingActiveState(false));
            dispatch(disableDebugger());
        },
        onTestRunStart: () => dispatch(setTestRunningState(true)),
        onTestRunEnd: () => dispatch(setTestRunningState(false))
    });
    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps
    )(VMListener));
};

export default vmListenerHOC;

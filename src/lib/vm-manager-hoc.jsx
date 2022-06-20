import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import VM from 'scratch-vm';
import AudioEngine from 'scratch-audio';

import {setProjectUnchanged} from '../reducers/project-changed';
import {setProjectTitle} from '../reducers/project-title';
import {
    LoadingStates,
    getIsLoadingWithId,
    onLoadedProject,
    projectError
} from '../reducers/project-state';

import {
    setWhiskerTest,
    setIsWhiskerProjectLoading
} from '../reducers/vm-status';

import TestRunner from 'whisker-main/whisker-main/dist/src/test-runner/test-runner';
/*
 * Higher Order Component to manage events emitted by the VM
 * @param {React.Component} WrappedComponent component to manage VM events for
 * @returns {React.Component} connected component with vm events bound to redux
 */
const vmManagerHOC = function (WrappedComponent) {
    class VMManager extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'loadProject'
            ]);
        }
        componentDidMount () {
            if (!this.props.vm.initialized) {
                this.audioEngine = new AudioEngine();
                this.props.vm.attachAudioEngine(this.audioEngine);
                this.props.vm.setCompatibilityMode(true);
                this.props.vm.initialized = true;
                this.props.vm.setLocale(this.props.locale, this.props.messages);
            }
            if (!this.props.isPlayerOnly && !this.props.isStarted) {
                this.props.vm.start();
            }
            window.addEventListener('message', event => {
                if (event.data.hasOwnProperty('testIndex') && event.data.tests &&
                    event.data.props && event.data.modelProps && event.data.project) {
                    if (this.isProjectLoading) {
                        setTimeout(() => window.postMessage(event.data, '*'), 100);
                    } else {
                        this.loadProject(event.data.project, event.data.props.projectName, true);
                        /* eslint-disable-next-line no-eval */
                        const tests = TestRunner.convertTests(eval(`${event.data.tests};module.exports;`));
                        const test = tests[event.data.testIndex];
                        test.project = event.data.project;
                        test.props = event.data.props;
                        test.modelProps = event.data.modelProps;
                        this.props.onReceivedWhiskerTest(test);
                    }
                }
            });
            if (window.opener) {
                window.opener.postMessage('loaded', '*');
            }
        }
        componentDidUpdate (prevProps) {
            // if project is in loading state, AND fonts are loaded,
            // and they weren't both that way until now... load project!
            if (!this.isProjectLoading && this.props.isLoadingWithId && this.props.fontsLoaded &&
                (!prevProps.isLoadingWithId || !prevProps.fontsLoaded)) {
                this.loadProject(this.props.projectData);
            }
            // Start the VM if entering editor mode with an unstarted vm
            if (!this.props.isPlayerOnly && !this.props.isStarted) {
                this.props.vm.start();
            }
        }
        loadProject (projectData, projectFileName, isWhiskerProject) {
            this.isProjectLoading = true;
            if (isWhiskerProject) {
                this.props.onWhiskerProjectLoading();
            }
            return this.props.vm.loadProject(projectData)
                .then(() => {
                    if (isWhiskerProject) {
                        this.props.onWhiskerProjectLoaded();
                    }
                    this.props.onLoadedProject(this.props.loadingState, this.props.canSave);
                    if (projectFileName) {
                        this.props.onSetProjectTitle(this.getProjectTitleFromFileName(projectFileName));
                    }
                    this.isProjectLoading = false;
                    // Wrap in a setTimeout because skin loading in
                    // the renderer can be async.
                    setTimeout(() => this.props.onSetProjectUnchanged());

                    // If the vm is not running, call draw on the renderer manually
                    // This draws the state of the loaded project with no blocks running
                    // which closely matches the 2.0 behavior, except for monitors–
                    // 2.0 runs monitors and shows updates (e.g. timer monitor)
                    // before the VM starts running other hat blocks.
                    if (!this.props.isStarted || isWhiskerProject) {
                        // Wrap in a setTimeout because skin loading in
                        // the renderer can be async.
                        setTimeout(() => {
                            this.props.vm.renderer.draw();
                        });
                    }
                })
                .catch(e => {
                    this.props.onError(e);
                });
        }
        getProjectTitleFromFileName (fileName) {
            if (!fileName) return '';
            // only parse title with valid scratch project extensions
            // (.sb, .sb2, and .sb3)
            const matches = fileName.match(/^(.*)\.sb[23]?$/);
            if (!matches) return '';
            return matches[1].substring(0, 100); // truncate project title to max 100 chars
        }
        render () {
            const {
                /* eslint-disable no-unused-vars */
                fontsLoaded,
                loadingState,
                locale,
                messages,
                isStarted,
                onError: onErrorProp,
                onLoadedProject: onLoadedProjectProp,
                onSetProjectUnchanged,
                projectData,
                /* eslint-enable no-unused-vars */
                isLoadingWithId: isLoadingWithIdProp,
                vm,
                ...componentProps
            } = this.props;

            delete componentProps.onReceivedWhiskerTest;
            delete componentProps.onWhiskerProjectLoading;
            delete componentProps.onWhiskerProjectLoaded;
            
            return (
                <WrappedComponent
                    isLoading={isLoadingWithIdProp}
                    vm={vm}
                    {...componentProps}
                />
            );
        }
    }

    VMManager.propTypes = {
        canSave: PropTypes.bool,
        cloudHost: PropTypes.string,
        fontsLoaded: PropTypes.bool,
        isLoadingWithId: PropTypes.bool,
        isPlayerOnly: PropTypes.bool,
        isStarted: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        locale: PropTypes.string,
        messages: PropTypes.objectOf(PropTypes.string),
        onError: PropTypes.func,
        onLoadedProject: PropTypes.func,
        onSetProjectUnchanged: PropTypes.func,
        onSetProjectTitle: PropTypes.func,
        onReceivedWhiskerTest: PropTypes.func,
        onWhiskerProjectLoading: PropTypes.func,
        onWhiskerProjectLoaded: PropTypes.func,
        projectData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        username: PropTypes.string,
        vm: PropTypes.instanceOf(VM).isRequired
    };

    const mapStateToProps = state => {
        const loadingState = state.scratchGui.projectState.loadingState;
        return {
            fontsLoaded: state.scratchGui.fontsLoaded,
            isLoadingWithId: getIsLoadingWithId(loadingState),
            locale: state.locales.locale,
            messages: state.locales.messages,
            projectData: state.scratchGui.projectState.projectData,
            projectId: state.scratchGui.projectState.projectId,
            loadingState: loadingState,
            isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
            isStarted: state.scratchGui.vmStatus.started
        };
    };

    const mapDispatchToProps = dispatch => ({
        onError: error => dispatch(projectError(error)),
        onLoadedProject: (loadingState, canSave) =>
            dispatch(onLoadedProject(loadingState, canSave, true)),
        onSetProjectUnchanged: () => dispatch(setProjectUnchanged()),
        onSetProjectTitle: title => dispatch(setProjectTitle(title)),
        onWhiskerProjectLoading: () => dispatch(setIsWhiskerProjectLoading(true)),
        onWhiskerProjectLoaded: () => dispatch(setIsWhiskerProjectLoading(false)),
        onReceivedWhiskerTest: test => dispatch(setWhiskerTest(test))
    });

    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );

    return connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(VMManager);
};

export default vmManagerHOC;

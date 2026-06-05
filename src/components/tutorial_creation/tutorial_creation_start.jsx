import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';

import Modal from '../../containers/modal.jsx';
import {connect} from 'react-redux';
import {closeTutorialCreation} from '../../reducers/modals';
import scratchImage from '../../lib/assets/scratch.png';
import tutGenImage from '../../lib/assets/tutorial_generator.png';
import styles from './tutorial_creation.css';
import TutorialCreationTabs from './tutorial_creation_tabs.jsx';
import VM from 'scratch-vm';
import {TutorialCreation} from './tutorial_creation';
import emptyImage from '../../lib/assets/empty.png';
import classNames from 'classnames';
import {TutorialLoader} from './tutorial_loader';


const messages = defineMessages({
    title: {
        id: 'gui.tutorialCreation.title',
        defaultMessage: 'Start a new Tutorial Creation',
        description: 'Create a new tutorial'
    },
    successfulRead: {
        id: 'gui.tutorialCreation.successfulRead',
        defaultMessage: 'Successfully read tutorial',
        description: 'Tutorial was successfully loaded'
    }
});


class TutorialCreationComponent extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'handleStartCreation',
            'handleCloseAndSave',
            'handleTutorialUpload',
            'loadTests'
        ]);
        this.state = {
            loaded: false,
            start: false,
            tutorialCreation: new TutorialCreation(emptyImage)
        };
        // pass intl to tutorial loader for messages
        TutorialLoader.intl = this.props.intl;
    }

    componentDidMount () {
        // load tests
        this.loadTests();
        // Allow the spinner to display before loading the content
        setTimeout(() => {
            this.setState({loaded: true});
            this.mounted = true;
        });
    }

    // to not display anything prematurely
    mounted = false;

    // method to advance state to next step
    handleStartCreation (){
        if (this.mounted) {
            this.setState({start: true});
        }
    }

    // Method to handle saving the current edit when going back to the main stage
    handleCloseAndSave (){
        // Persist the current edit so it can be resumed when the creation UI is
        // reopened in the same session.
        // IMPORTANT: this MUST NOT be stored as a stage comment. Stage comments are
        // serialized into the project (sb3.js serializeComments) and would corrupt the
        // standard Scratch "Save to your computer" (.sb3) export. We therefore keep the
        // resume state on the (non-serialized) runtime instead.
        const jsonString = JSON.stringify(this.state.tutorialCreation);
        this.props.vm.runtime.tutorialCreationSaveState = {file: jsonString};

        // save images (resolves asynchronously)
        TutorialLoader.createImages(this.state.tutorialCreation).then(json => {
            if (this.props.vm.runtime.tutorialCreationSaveState) {
                this.props.vm.runtime.tutorialCreationSaveState.images = json;
            }
        });

        // close modal
        this.props.onCloseModal();
    }

    // Method to load all test from the current stage and use the ones applicable for creating a tutorial
    loadTests (){

        // parsed resume state (see handleCloseAndSave: stored on the runtime, never in
        // stage comments, so that it cannot leak into / corrupt the .sb3 export)
        let parsedData;
        let parsedImages;
        const saveState = this.props.vm.runtime.tutorialCreationSaveState;
        const hasSaveState = typeof saveState !== 'undefined' && saveState !== null;

        if (hasSaveState) {
            if (typeof saveState.file !== 'undefined') {
                parsedData = JSON.parse(saveState.file);
            }
            if (typeof saveState.images !== 'undefined') {
                parsedImages = JSON.parse(saveState.images);
            }
        }

        // load actual tests with tutorial loader
        const loadedCreation = TutorialLoader.createTests(parsedData, parsedImages,
            hasSaveState,
            this.props.vm,
            this.state.tutorialCreation);

        // update state with new tutorialCreation store
        this.setState({tutorialCreation: loadedCreation});

    }

    // Method to handle uploading (thus editing) an existing tutorial
    handleTutorialUpload (event) {
        // upload with tutorial loader
        TutorialLoader.handleTutorialUpload(event, this.props.vm, this.state.tutorialCreation).then(newCreation => {
            alert(this.props.intl.formatMessage(messages.successfulRead)); // eslint-disable-line
            this.setState({tutorialCreation: newCreation});
        });
    }


    render () {
        return (
            <Modal
                fullScreen
                contentLabel={this.props.intl.formatMessage(messages.title)}
                id="tutorialCreation"
                onRequestClose={this.handleCloseAndSave}
            >
                {this.state.start ? (
                    <TutorialCreationTabs
                        tutorialCreation={this.state.tutorialCreation}
                        intl={this.props.intl}
                    />
                ) : (<div>
                    <img
                        className={styles.logo}
                        src={scratchImage}
                    />
                    <img
                        className={styles.tutLogo}
                        src={tutGenImage}
                    />
                    <div style={{display: 'flex'}}>
                        <label className={classNames(styles.button, styles.orange)}>
                            <input
                                type="file"
                                // accept=".json"
                                onChange={this.handleTutorialUpload}
                            />

                            <FormattedMessage
                                defaultMessage="Upload Edit"
                                description="Upload and Edit a Tutorial"
                                id="gui.tutorialCreation.upload"
                            />
                        </label>
                        <button
                            className={styles.button}
                            onClick={this.handleStartCreation}
                        >
                            <FormattedMessage
                                defaultMessage="Start Edit"
                                description="Start with the tutorial creation"
                                id="gui.tutorialCreation.start"
                            />
                        </button>
                    </div>
                </div>)}
            </Modal>
        );
    }
}

TutorialCreationComponent.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
    onCloseModal: PropTypes.func,
    intl: intlShape
};

const mapStateToProps = state => ({
    visible: state.scratchGui.modals.tutorialCreation
});


const mapDispatchToProps = dispatch => ({
    onCloseModal: () => dispatch(closeTutorialCreation())
});

export default injectIntl(connect(mapStateToProps,
    mapDispatchToProps
)(TutorialCreationComponent));

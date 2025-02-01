import React from 'react';
import {connect} from 'react-redux';
import DebuggingTutorialOverviewComponent from '../components/debuggingTutorial/debuggingTutorialOverview.jsx';
import PropTypes from "prop-types";
import VirtualMachine from "scratch-vm";
import {setLastTutorial, setLoading, toggleAutosave} from "../reducers/debugging-tutorial-overview"
import JSZip from "jszip";

class DebuggingTutorialOverview extends React.Component {
    constructor(props) {
        super(props);
        this.loadProject = this.loadProject.bind(this);
    }

    /**
     * Handles the click on 'Start'. If a new tutorial is selected, the tutorial gets loaded
     * and, if the option was selected, a backup of the current project downloaded. After this,
     * the user gets directed to the step-Overview of the current tutorial.
     */
    handleStart() {
        const isNewTutorialSelected = JSON.stringify(this.props.tutorialMessages) !== JSON.stringify((this.props.lastTutorial));
        if (isNewTutorialSelected) {
            if (this.props.autoSave) {
                this.props.setLoading(true);
                const zip = new JSZip();
                zip.file('project.json', this.props.vm.toJSON());
                zip.generateAsync({
                    type: 'blob',
                    mimeType: 'application/x.scratch.sb3',
                    compression: 'DEFLATE',
                    compressionOptions: {
                        level: 6
                    }
                })
                    .then(output => {
                        const url = URL.createObjectURL(output);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'backup.sb3';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        this.loadProject();
                    })
                    .catch(error => {
                        console.log(error);
                        this.props.setLoading(false);
                    });
            } else {
                this.loadProject();
            }
        } else {
            this.props.onStartTutorial();
        }
    }

    /**
     * Loads the new tutorial. This includes the required sprites, code, etc.
     */
    loadProject() {
        this.props.setLoading(true);
        this.props.vm.start();
        this.props.vm.clear();
        this.props.vm.loadProject(this.props.tutorialIndexData["project1"])
            .then(() => {
                this.props.setLastTutorial(this.props.tutorialMessages);
                this.props.onStartTutorial();})
            .catch((e) => console.log("Error loading new Project: " + e.toString()))
            .finally(() => this.props.setLoading(false));
    }

    render () {
        const isNewTutorialSelected = this.props.lastTutorial !== null && this.props.lastTutorial !== undefined ? this.props.tutorialMessages.title !== this.props.lastTutorial.title : true;
        let lastTutorialTitle = null;
        if (isNewTutorialSelected && this.props.lastTutorial !== null && this.props.lastTutorial !== undefined) {
            lastTutorialTitle = this.props.lastTutorial.title;
        }
        console.log("KKKKKK " + JSON.stringify(this.props.tutorialIndexData));
        return (
            <DebuggingTutorialOverviewComponent
                onStart={() => this.handleStart()}
                isNewTutorialSelected={isNewTutorialSelected}
                lastTutorialTitle={lastTutorialTitle}
                toggleAutosave={toggleAutosave}
                {...this.props}
            />
        );
    }
}

DebuggingTutorialOverview.propTypes = {
    title: PropTypes.string,
    tutorialMessages: PropTypes.any,
    tutorialPicture: PropTypes.any,
    onStartTutorial: PropTypes.func.isRequired,
    lastTutorial: PropTypes.any,
    setLastTutorial: PropTypes.func,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    setLoading: PropTypes.func,
    isLoading: PropTypes.bool,
    tutorialIndexData: PropTypes.any,
    autoSave: PropTypes.bool,
};

const mapStateToProps = state => ({
    lastTutorial: state.scratchGui.debuggingTutorialOverview.lastTutorial,
    isLoading: state.scratchGui.debuggingTutorialOverview.isLoading,
    autoSave: state.scratchGui.debuggingTutorialOverview.autoSave,
});
const mapDispatchToProps = dispatch => ({
    setLastTutorial: (tutorial) => dispatch(setLastTutorial(tutorial)),
    setLoading: (isLoading) => dispatch(setLoading(isLoading)),
    toggleAutosave: () => dispatch(toggleAutosave()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialOverview);

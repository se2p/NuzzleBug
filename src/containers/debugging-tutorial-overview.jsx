import React from 'react';
import {connect} from 'react-redux';
import DebuggingTutorialOverviewComponent from '../components/debuggingTutorial/pages/tutorial-overview/debuggingTutorialOverview.jsx';
import PropTypes from "prop-types";
import VirtualMachine from "scratch-vm";
import {setLastTutorial, setLoading, setAutoSave, setContentType, reset, lastStartedTutorial} from "../reducers/debugging-tutorial-overview"
import JSZip from "jszip";
import {CONTENT_START_TUTORIAL, CONTENT_DESCRIPTION} from "../components/debuggingTutorial/shared/tutorial-constants.jsx";
import logging from 'scratch-vm/src/util/logging.js';

class DebuggingTutorialOverview extends React.Component {
    constructor(props) {
        super(props);
        this.loadProject = this.loadProject.bind(this);
        this.openAutoSaveSelection = this.openAutoSaveSelection.bind(this);
        this.isEmptyProject = this.isEmptyProject.bind(this);
    }


    handleStart() {
        const isNewTutorialSelected = this.props.tutorialMessages?.title !== this.props.lastStartedTutorial;

        if (isNewTutorialSelected) {
            this.props.setTutorialPoints(3);
            this.props.setLastStartedTutorial(this.props.tutorialMessages?.title);
            if (this.props.autoSave === "YES") {
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
            console.log("OLD");
        }
        this.props.setContentType(CONTENT_DESCRIPTION);
    }

    loadProject() {
        logging.pauseLogging(true);
        this.props.setLoading(true);
        this.props.vm.start();

        const projectId = "project_" + this.props.vm.getLocale();

        if (projectId in this.props.tutorialIndexData && this.props.tutorialIndexData[projectId] != null) { //Lädt nur, wenn projectData angegeben wurde
            this.props.vm.loadProject(this.props.tutorialIndexData[projectId])
                .then(() => {
                    this.props.onStartTutorial();})
                .catch((e) => console.log("Error loading new Project: " + e.toString()))
                .finally(() => {
                    this.props.setLoading(false);
                    this.delayResumeLogging();
                });
        } else {
            this.props.onStartTutorial();
        }
    }

    // Gib der vm Zeit, das Projekt zu laden. Aktiviere danach das logging, um nur Nutzerinteraktionen zu loggen.
    async delayResumeLogging() {
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        await sleep(2000);
        await logging.pauseLogging(false);
    }

    openAutoSaveSelection() {
        this.props.setLastTutorial(this.props.tutorialMessages.title);
        this.props.setContentType(CONTENT_START_TUTORIAL);
    }

    /**
     * Checks, if the current project includes at least one codeblocks.
     */
    isEmptyProject() {
        const jsonString = this.props.vm.toJSON();
        const project = JSON.parse(jsonString);
        let blockCount = 0;

        for (const target of project.targets) {
            if (target.blocks) {
                blockCount += Object.keys(target.blocks).length;
            }
        }
        return blockCount === 0;
    }

    render () {

        const isNewTutorialSelected = this.props.tutorialMessages?.title !== this.props.lastTutorial;

        if (this.props.lastTutorial === null || this.props.lastTutorial === undefined) {
            this.props.setLastTutorial(this.props.tutorialMessages.title);
        } else if (isNewTutorialSelected) {
            this.props.reset();
        }

        return (
            <DebuggingTutorialOverviewComponent
                onStart={() => this.handleStart()}
                openAutoSaveSelection={() => this.openAutoSaveSelection()}
                isProjectEmpty={this.isEmptyProject()}
                isNewTutorialSelected={isNewTutorialSelected}
                {...this.props}
            />
        );
    }
}

DebuggingTutorialOverview.propTypes = {
    tutorialMessages: PropTypes.any,
    tutorialPicture: PropTypes.any,
    onStartTutorial: PropTypes.func.isRequired,
    lastTutorial: PropTypes.any,
    setLastTutorial: PropTypes.func,
    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    setLoading: PropTypes.func,
    isLoading: PropTypes.bool,
    tutorialIndexData: PropTypes.any,
    autoSave: PropTypes.string,
    setContentType: PropTypes.func,
    contentType: PropTypes.any,
    setAutoSave: PropTypes.func,
    reset: PropTypes.func,
    openAutoSaveSelection: PropTypes.func,
    lastStartedTutorial: PropTypes.string,
    setLastStartedTutorial: PropTypes.func,
    isProjectEmpty: PropTypes.bool,
    isNewTutorialSelected: PropTypes.bool,
    guiMessages: PropTypes.any,
    setTutorialPoints: PropTypes.func,
};

const mapStateToProps = state => ({
    lastTutorial: state.scratchGui.debuggingTutorialOverview.lastTutorial,
    isLoading: state.scratchGui.debuggingTutorialOverview.isLoading,
    autoSave: state.scratchGui.debuggingTutorialOverview.autoSave,
    contentType: state.scratchGui.debuggingTutorialOverview.contentType,
    lastStartedTutorial: state.scratchGui.debuggingTutorialOverview.lastStartedTutorial,
});
const mapDispatchToProps = dispatch => ({
    setLastTutorial: (tutorial) => dispatch(setLastTutorial(tutorial)),
    setLoading: (isLoading) => dispatch(setLoading(isLoading)),
    setAutoSave: (type) => dispatch(setAutoSave(type)),
    setContentType: (contentType) => dispatch(setContentType(contentType)),
    reset: () => dispatch(reset()),
    setLastStartedTutorial: (tutorial) => dispatch(lastStartedTutorial(tutorial)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialOverview);

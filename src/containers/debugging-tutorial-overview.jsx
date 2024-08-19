import React from 'react';
import {connect} from 'react-redux';
import DebuggingTutorialOverviewComponent from '../components/debuggingTutorial/debuggingTutorialOverview.jsx';
import PropTypes from "prop-types";
import VirtualMachine from "scratch-vm";
import asdProject from '!arraybuffer-loader!../components/debuggingTutorial/testProject/Scratch-Projekt(4).sb3';
import {setLastTutorial, setLoading} from "../reducers/debugging-tutorial-overview"
import JSZip from "jszip";

class DebuggingTutorialOverview extends React.Component {
    constructor(props) {
        super(props);
    }

    loadProject() { //TODO
        const isNewTutorialSelected = JSON.stringify(this.props.tutorialMessages) !== JSON.stringify((this.props.lastTutorial));
        if (isNewTutorialSelected) {
            this.props.setLoading(true);
            console.log("starting autosave");
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
                    console.log("finished autosaving");





                    this.props.vm.loadProject(asdProject)
                        .then(() => {
                            this.props.setLastTutorial(this.props.tutorialMessages);
                            this.props.onStartTutorial();})
                        .catch((e) => console.log("Error loading new Project: " + e.toString()))
                        .finally(() => this.props.setLoading(false));
                })
                .catch(error => {
                    console.log(error);
                    this.props.setLoading(false);
                });
        } else {
            this.props.onStartTutorial();
        }
    }

    render () {
        const isNewTutorialSelected = JSON.stringify(this.props.tutorialMessages) !== JSON.stringify((this.props.lastTutorial));

        let lastTutorialTitle = null;
        if (isNewTutorialSelected && this.props.lastTutorial !== null) {
            lastTutorialTitle = this.props.lastTutorial.title;
        }

        return (
            <DebuggingTutorialOverviewComponent
                onStart={() => this.loadProject()}
                isNewTutorialSelected={isNewTutorialSelected}
                lastTutorialTitle={lastTutorialTitle}
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
};

const mapStateToProps = state => ({
    lastTutorial: state.scratchGui.debuggingTutorialOverview.lastTutorial,
    isLoading: state.scratchGui.debuggingTutorialOverview.isLoading,
});
const mapDispatchToProps = dispatch => ({
    setLastTutorial: (tutorial) => dispatch(setLastTutorial(tutorial)),
    setLoading: (isLoading) => dispatch(setLoading(isLoading)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialOverview);

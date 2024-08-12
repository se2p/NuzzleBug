import React from 'react';
import {connect} from 'react-redux';
import DebuggingTutorialOverviewComponent from '../components/debuggingTutorial/debuggingTutorialOverview.jsx';
import PropTypes from "prop-types";
import VirtualMachine from "scratch-vm";
import asdProject from '!arraybuffer-loader!../components/debuggingTutorial/testProject/Scratch-Projekt(4).sb3';
import {setLastTutorial} from "../reducers/debugging-tutorial-overview"

class DebuggingTutorialOverview extends React.Component {

    loadProject() {
        const isNewTutorialSelected = JSON.stringify(this.props.tutorialMessages) !== JSON.stringify((this.props.lastTutorial));
        if (isNewTutorialSelected) this.props.vm.loadProject(asdProject); //TODO LOADING SCREEN + lock/unlock vm

        this.props.setLastTutorial(this.props.tutorialMessages);
        this.props.onStartTutorial();
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
    vm: PropTypes.instanceOf(VirtualMachine).isRequired
};

const mapStateToProps = state => ({
    lastTutorial: state.scratchGui.debuggingTutorialOverview.lastTutorial,
});
const mapDispatchToProps = dispatch => ({
    setLastTutorial: (tutorial) => dispatch(setLastTutorial(tutorial)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialOverview);

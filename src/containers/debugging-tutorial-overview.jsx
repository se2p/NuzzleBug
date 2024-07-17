import React from 'react';
import {connect} from 'react-redux';
import {onStartTutorial} from "../reducers/debugging-tutorial-overview"
import DebuggingTutorialOverviewComponent from '../components/debuggingTutorial/debuggingTutorialOverview.jsx';
import PropTypes from "prop-types";
import VirtualMachine from "scratch-vm";
import asdProject from '!arraybuffer-loader!../components/debuggingTutorial/testImg/Scratch-Projekt(1).sb3';

class DebuggingTutorialOverview extends React.Component {

    loadProject() {
        this.props.vm.loadProject(asdProject);
    }

    render () {
        return (
            <DebuggingTutorialOverviewComponent
                onStartTutorial={this.loadProject()}
                {...this.props}
            />
        );
    }
}

DebuggingTutorialOverview.propTypes = {
    title: PropTypes.string,
    tutorialMessages: PropTypes.string,
    tutorialPicture: PropTypes.any,
    onStartTutorial: PropTypes.func.isRequired,

    vm: PropTypes.instanceOf(VirtualMachine).isRequired
};

const mapStateToProps = state => ({
});
const mapDispatchToProps = dispatch => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialOverview);

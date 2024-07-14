import React from 'react';
import {connect} from 'react-redux';
import {onStartTutorial} from "../reducers/debugging-tutorial-overview"
import DebuggingTutorialOverviewComponent from '../components/debuggingTutorial/debuggingTutorialOverview.jsx';
import PropTypes from "prop-types";
import VirtualMachine from "scratch-vm";

class DebuggingTutorialOverview extends React.Component {


    loadProject() {
        //console.log(this.props.vm.toJSON())
        if (this.props.projectFiles !== undefined)  {
            //console.log(this.props.vm.toJSON())
            this.props.vm.loadProject(this.props.projectFiles.toString()).then(r => this.props.onStartTutorial);
        }
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

    vm: PropTypes.instanceOf(VirtualMachine).isRequired,
    projectFiles: PropTypes.string, //TODO Ändere PropType weil für String zu lange?
};

const mapStateToProps = state => ({
});
const mapDispatchToProps = dispatch => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialOverview);

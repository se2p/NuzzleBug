import React from 'react';
import {connect} from 'react-redux';

import {increaseStep, errorClicked} from "../reducers/debugging-tutorial-step1";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/DebuggingTutorialStep1.jsx';
import PropTypes from "prop-types";



class DebuggingTutorialStep1 extends React.Component {

    onStartTests() { //TODO ADD TESTING!
        this.props.startTests();
    }


    render () {
        return (
            <DebuggingTutorialStepComponent
                {...this.props}
            />
        );
    }
}




DebuggingTutorialStep1.propTypes = {
    onOpenHelp: PropTypes.func,
    tutorialMessages: PropTypes.any,
    step: PropTypes.string,
    startTests: PropTypes.func,
    onErrorClicked: PropTypes.func,
};

const mapStateToProps = state => ({
    step: state.scratchGui.debuggingTutorialStep.step,
    isErrorInfoVisible: state.scratchGui.debuggingTutorialStep.isErrorInfoVisible,
});

const mapDispatchToProps = dispatch => ({
    onStartTests: () => dispatch(increaseStep()),
    onErrorClicked: () => dispatch(errorClicked()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialStep1);

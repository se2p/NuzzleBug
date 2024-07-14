import React from 'react';
import {connect} from 'react-redux';

import {
    onEnterAnswer,
    onHelp,
    onCheckAnswer,
    onStepBack,
    onEnterMultiAnswer,
    onChangeTextInput1,
    onChangeTextInput2,
    onChangeTextEndAnswer, } from "../reducers/debugging-tutorial-step";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/debuggingTutorialStep.jsx';
import PropTypes from "prop-types";

class DebuggingTutorialStep extends React.Component {


    render () {
        return (
            <DebuggingTutorialStepComponent
                isTextAnswerCorrect={
                this.props.textAnswer1.toLowerCase() === this.props.tutorial[this.props.step]["textAnswer1"] &&
                    this.props.textAnswer2.toLowerCase() === this.props.tutorial[this.props.step]["textAnswer2"]}
                {...this.props}
            />
        );
    }
}




DebuggingTutorialStep.propTypes = {
    textAnswer1: PropTypes.string,
    textAnswer2: PropTypes.string,
    tutorial: PropTypes.any.isRequired,
    step: PropTypes.string
};

const mapStateToProps = state => ({
    step: state.scratchGui.debuggingTutorial.step,
    isHelpVisible: state.scratchGui.debuggingTutorial.isHelpVisible,
    selectedAnswer: state.scratchGui.debuggingTutorial.selectedAnswer,
    selectedAnswers: state.scratchGui.debuggingTutorial.selectedAnswers,
    textAnswer1: state.scratchGui.debuggingTutorial.textAnswer1,
    textAnswer2: state.scratchGui.debuggingTutorial.textAnswer2,
    textEndAnswer: state.scratchGui.debuggingTutorial.textEndAnswer,
});

const mapDispatchToProps = dispatch => ({
    onEnterAnswer: (answer) => dispatch(onEnterAnswer(answer)),
    onHelp: () => dispatch(onHelp()),
    onCheckAnswer: () => dispatch(onCheckAnswer()),
    onStepBack: () => dispatch(onStepBack()),
    onEnterMultiAnswer: (answer) => dispatch(onEnterMultiAnswer(answer)),
    onChangeTextInput1: (input) => dispatch(onChangeTextInput1(input)),
    onChangeTextInput2: (input) => dispatch(onChangeTextInput2(input)),
    onChangeTextEndAnswer: () => dispatch(onChangeTextEndAnswer()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialStep);

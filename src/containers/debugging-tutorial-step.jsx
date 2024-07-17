import React from 'react';
import {connect} from 'react-redux';

import {
    onHelp,
    onCheckAnswer,
    onStepBack,
    onEnterMultiAnswer,
    setAnswer,
    onGapTextButton,} from "../reducers/debugging-tutorial-step";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/debuggingTutorialStep.jsx';
import PropTypes from "prop-types";

class DebuggingTutorialStep extends React.Component {

    render () {
        const isGapTextSolved = this.props.tutorial[this.props.step].questionType === "GAP_TEXT"
            && this.props.answers[0].toLowerCase() === this.props.tutorial[this.props.step].question1.questionSolution
            && this.props.answers[1].toLowerCase() === this.props.tutorial[this.props.step].question2.questionSolution;


        return (
            <DebuggingTutorialStepComponent
                isGapTextSolved={isGapTextSolved}
                {...this.props}
            />
        );
    }
}




DebuggingTutorialStep.propTypes = {
    tutorial: PropTypes.any.isRequired,
    tutorialIndexData: PropTypes.any.isRequired,
    step: PropTypes.string,
    onSetTutorial: PropTypes.func,
    answers: PropTypes.any,
};

const mapStateToProps = state => ({
    step: state.scratchGui.debuggingTutorial.step,
    isHelpVisible: state.scratchGui.debuggingTutorial.isHelpVisible,
    selectedAnswers: state.scratchGui.debuggingTutorial.selectedAnswers,
    answers: state.scratchGui.debuggingTutorial.answers,
});

const mapDispatchToProps = dispatch => ({
    onHelp: () => dispatch(onHelp()),
    onCheckAnswer: (tutorial) => dispatch(onCheckAnswer(tutorial)),
    onStepBack: () => dispatch(onStepBack()),
    onEnterMultiAnswer: (answer) => dispatch(onEnterMultiAnswer(answer)),
    setAnswer: (index, value) => dispatch(setAnswer(value, index)),
    onGapTextButton: () => dispatch(onGapTextButton()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialStep);

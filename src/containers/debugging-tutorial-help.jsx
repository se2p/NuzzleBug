import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';

import {
    onHelp,
    onCheckAnswer,
    onStepBack,
    onEnterMultiAnswer,
    setAnswer,
    onGapTextButton,
    onCloseQuestionMessage,
    onToggleDiagramm,} from "../reducers/debugging-tutorial-help";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/debuggingTutorialHelp.jsx';
import PropTypes from "prop-types";

class DebuggingTutorialHelp extends React.Component {

    render () {
        const tutorialStep = this.props.tutorial[this.props.step];

        if (this.props.solvedSteps.includes(this.props.step)) {
            this.props.answers[0] = tutorialStep.question1.questionSolution;
            this.props.answers[1] = tutorialStep.question2.questionSolution;
        }

        const isGapTextSolved = tutorialStep.questionType === "GAP_TEXT"
            && this.props.answers[0].toLowerCase() === tutorialStep.question1.questionSolution
            && this.props.answers[1].toLowerCase() === tutorialStep.question2.questionSolution;
        return (
            <DebuggingTutorialStepComponent
                isGapTextSolved={isGapTextSolved}
                {...this.props}
            />
        );
    }
}




DebuggingTutorialHelp.propTypes = {
    tutorial: PropTypes.any.isRequired,
    tutorialIndexData: PropTypes.any.isRequired,
    step: PropTypes.string,
    onSetTutorial: PropTypes.func,
    answers: PropTypes.any,
    solvedSteps: PropTypes.any,
};

const mapStateToProps = state => ({
    step: state.scratchGui.debuggingTutorial.step,
    isHelpVisible: state.scratchGui.debuggingTutorial.isHelpVisible,
    selectedAnswers: state.scratchGui.debuggingTutorial.selectedAnswers,
    answers: state.scratchGui.debuggingTutorial.answers,
    solvedSteps: state.scratchGui.debuggingTutorial.solvedSteps,
    questionMessage: state.scratchGui.debuggingTutorial.questionMessage,
    showDiagramm: state.scratchGui.debuggingTutorial.showDiagramm,
});

const mapDispatchToProps = dispatch => ({
    onHelp: () => dispatch(onHelp()),
    onCheckAnswer: (tutorial) => dispatch(onCheckAnswer(tutorial)),
    onStepBack: () => dispatch(onStepBack()),
    onEnterMultiAnswer: (answer) => dispatch(onEnterMultiAnswer(answer)),
    setAnswer: (index, value) => dispatch(setAnswer(value, index)),
    onGapTextButton: () => dispatch(onGapTextButton()),
    onCloseQuestionMessage: () => dispatch(onCloseQuestionMessage()),
    onToggleDiagramm: () => dispatch(onToggleDiagramm()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialHelp);

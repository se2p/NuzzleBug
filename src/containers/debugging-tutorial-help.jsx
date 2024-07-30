import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';

import {
    onHelp,
    onStepBack,
    onEnterMultiAnswer,
    setAnswer,
    onGapTextButton,
    onCloseQuestionMessage,
    onToggleDiagramm,
    setStep,
    reset,
    setQuestionMessage,
    addSolvedStep,} from "../reducers/debugging-tutorial-help";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/debuggingTutorialHelp.jsx';
import PropTypes from "prop-types";

class DebuggingTutorialHelp extends React.Component {
    constructor(props) {
        super(props);
        this.checkAnswer = this.checkAnswer.bind(this);
    }



    checkAnswer(step, tutorial) {
        switch (tutorial["questionType"]) {
            case "SINGLE_CHOICE":
                if (this.props.answers[0] === "") {
                    break;
                }

                if (tutorial[this.props.answers[0]]["next"] === "wrongAnswer") {
                    this.props.setQuestionMessage(tutorial.correctionText);
                    break;
                }

                this.props.setStep(tutorial[this.props.answers[0]]["next"].slice(6)); //step1_12 -> 12
                this.props.reset(); //TODO Maybe check if step != lastStep?
                break;
            case "MULTIPLE_CHOICE":
                if (JSON.stringify(this.props.selectedAnswers) === JSON.stringify(tutorial["solution"])) {

                    this.props.setStep(tutorial["next"].slice(6));
                    this.props.reset();
                } else {
                    this.props.setQuestionMessage(tutorial.correctionText);
                }
                break;
            case "MESSAGE":
                this.props.setStep(tutorial["next"].slice(6));
                this.props.reset();
                break;
            case "DROPDOWN":
                if (this.props.answers[0] !== "") {
                    const findOption = () => Object.entries(tutorial)
                        .find(([key, value]) => value.label === this.props.answers[0])?.[0] || null;
                    this.props.setStep(tutorial[findOption()]["next"].slice(6));
                    this.props.reset();
                }
                break;
            case "GAP_TEXT":
                if (this.props.answers[2] !== "") {
                    const nextStep = this.props.answers[2] !== "false" ?
                        tutorial.endQuestionTrueNext : tutorial.endQuestionFalseNext;
                    // The GAP TEXT was solved. Next time when visiting this specific step, solve the first 2 inputFields
                    this.props.addSolvedStep(step);
                    this.props.setStep(nextStep.slice(6));
                    this.props.reset();
                }
                break;
        }
    }

    render () {
        const curStep = "step" + (this.props.stepNumber + 1).toString() + "_" + this.props.level;
        const tutorialStep = this.props.tutorial[curStep];

        if (this.props.solvedSteps.includes(curStep)) {
            this.props.answers[0] = tutorialStep.question1.questionSolution;
            this.props.answers[1] = tutorialStep.question2.questionSolution;
        }

        const isGapTextSolved = tutorialStep.questionType === "GAP_TEXT"
            && this.props.answers[0].toLowerCase() === tutorialStep.question1.questionSolution
            && this.props.answers[1].toLowerCase() === tutorialStep.question2.questionSolution;
        return (
            <DebuggingTutorialStepComponent
                step={curStep}
                isGapTextSolved={isGapTextSolved}
                onCheckAnswer={() => this.checkAnswer(curStep, tutorialStep)}
                {...this.props}
            />
        );
    }
}




DebuggingTutorialHelp.propTypes = {
    tutorial: PropTypes.any.isRequired,
    tutorialIndexData: PropTypes.any.isRequired,
    stepNumber: PropTypes.number,
    level: PropTypes.string,
    onSetTutorial: PropTypes.func,
    answers: PropTypes.any,
    solvedSteps: PropTypes.any,
    setStep: PropTypes.func,
    reset: PropTypes.func,
    selectedAnswers: PropTypes.any,
    setQuestionMessage: PropTypes.func,
    addSolvedStep: PropTypes.func,
};

const mapStateToProps = state => ({
    isHelpVisible: state.scratchGui.debuggingTutorial.isHelpVisible,
    selectedAnswers: state.scratchGui.debuggingTutorial.selectedAnswers,
    answers: state.scratchGui.debuggingTutorial.answers,
    solvedSteps: state.scratchGui.debuggingTutorial.solvedSteps,
    questionMessage: state.scratchGui.debuggingTutorial.questionMessage,
    showDiagramm: state.scratchGui.debuggingTutorial.showDiagramm,
    level: state.scratchGui.debuggingTutorial.step,
});

const mapDispatchToProps = dispatch => ({
    onHelp: () => dispatch(onHelp()),
    onStepBack: () => dispatch(onStepBack()),
    onEnterMultiAnswer: (answer) => dispatch(onEnterMultiAnswer(answer)),
    setAnswer: (index, value) => dispatch(setAnswer(value, index)),
    onGapTextButton: () => dispatch(onGapTextButton()),
    onCloseQuestionMessage: () => dispatch(onCloseQuestionMessage()),
    onToggleDiagramm: () => dispatch(onToggleDiagramm()),
    setStep: (step) => dispatch(setStep(step)),
    reset: () => dispatch(reset()),
    setQuestionMessage: (content) => dispatch(setQuestionMessage(content)),
    addSolvedStep: (stepNumber) => dispatch(addSolvedStep(stepNumber)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialHelp);

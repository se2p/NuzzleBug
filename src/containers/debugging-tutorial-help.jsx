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
    addSolvedStep,
    setLastStepNumber,
    resetComponent,
    setLastTutorial,} from "../reducers/debugging-tutorial-help";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/debuggingTutorialHelp.jsx';
import PropTypes from "prop-types";

class DebuggingTutorialHelp extends React.Component {

    constructor(props) {
        super(props);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.setAnswer = this.setAnswer.bind(this);
        this.onGapTextButton = this.onGapTextButton.bind(this);
    }

    checkAnswer(step, tutorial) {
        switch (tutorial["questionType"]) {
            case "SINGLE_CHOICE":
                if (this.props.answers[0] === "") {
                    break;
                }

                if (tutorial[this.props.answers[0]]["next"] === "wrongAnswer") {
                    this.props.setQuestionMessage(tutorial.correctionText);
                    this.props.addSolvedStep(step, this.props.answers[0]);
                    break;
                }

                //TODO if (tutorial[this.props.answers[0]]["next"] !== step)???
                this.props.addSolvedStep(step, this.props.answers[0]);
                this.props.setStep(tutorial[this.props.answers[0]]["next"].slice(6)); //step1_12 -> 12
                this.props.reset();

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
                    if (tutorial[findOption()]["next"] !== "wrongAnswer") {
                        this.props.addSolvedStep(step, this.props.answers[0]);
                        this.props.setStep(tutorial[findOption()]["next"].slice(6));
                        this.props.reset();
                    } else {
                        this.props.setQuestionMessage(tutorial.correctionText);
                        this.props.addSolvedStep(step, this.props.answers[0]);
                    }
                }
                break;
            case "GAP_TEXT":
                if (this.props.answers[2] !== "") {
                    const nextStep = this.props.answers[2] !== "false" ?
                        tutorial.endQuestionTrueNext : tutorial.endQuestionFalseNext;
                    // The GAP TEXT was solved. Next time when visiting this specific step, solve the first 2 inputFields
                    if (nextStep !== "wrongAnswer") { //TODO
                        this.props.addSolvedStep(step, this.props.answers[2]);
                        this.props.setStep(nextStep.slice(6));
                        this.props.reset();
                    } else {
                        this.props.addSolvedStep(step, this.props.answers[2]);
                        this.props.setQuestionMessage(tutorial.correctionText);
                    }
                }
                break;
        }
    }

    setAnswer(index, value, step) {
        this.props.onSetAnswer(index, value);
        if (this.props.solvedSteps.hasOwnProperty(step) && this.props.solvedSteps[step].includes(value)) {
            this.props.setQuestionMessage("[REVISITING]Schon gelöst!");
        } else {
            this.props.setQuestionMessage(null);
        }
    }

    onGapTextButton(step) {
        this.setAnswer(2, this.props.answers[2] === "true" ? "false" : "true", step);
    }

    componentDidMount() {
        if (this.props.stepNumber !== this.props.lastStepNumber || JSON.stringify(this.props.tutorial) !== JSON.stringify(this.props.lastTutorial)) {
            this.props.resetComponent();
            this.props.setLastStepNumber(this.props.stepNumber);
            this.props.setLastTutorial(this.props.tutorial);
        }
    }

    render () {
        let curStep;
        if (JSON.stringify(this.props.tutorial) !== JSON.stringify(this.props.lastTutorial)) {
            this.props.resetComponent();
            this.props.setLastTutorial(this.props.tutorial);
            return null;
        } else {
            curStep = "step" + (this.props.stepNumber + 1).toString() + "_" + this.props.level;
        }


        const tutorialStep = this.props.tutorial[curStep];

        const isGapTextSolved = tutorialStep.questionType === "GAP_TEXT" //TODO
            && this.props.answers[0].toLowerCase() === tutorialStep.question1.questionSolution
            && this.props.answers[1].toLowerCase() === tutorialStep.question2.questionSolution;
        return (
            <DebuggingTutorialStepComponent
                step={curStep}
                isGapTextSolved={isGapTextSolved}
                onCheckAnswer={() => this.checkAnswer(curStep, tutorialStep)}
                setAnswer={(index, value) => this.setAnswer(index, value, curStep)}
                onGapTextButton={() => this.onGapTextButton(curStep)}
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
    shouldReset: PropTypes.number,
    lastStepNumber: PropTypes.number,
    setLastStepNumber: PropTypes.func,
    resetComponent: PropTypes.func,
    lastTutorial: PropTypes.any,
    setLastTutorial: PropTypes.func,
    onSetAnswer: PropTypes.func,
    onGapTextButton: PropTypes.func,
};

const mapStateToProps = state => ({
    isHelpVisible: state.scratchGui.debuggingTutorial.isHelpVisible,
    selectedAnswers: state.scratchGui.debuggingTutorial.selectedAnswers,
    answers: state.scratchGui.debuggingTutorial.answers,
    solvedSteps: state.scratchGui.debuggingTutorial.solvedSteps,
    questionMessage: state.scratchGui.debuggingTutorial.questionMessage,
    showDiagramm: state.scratchGui.debuggingTutorial.showDiagramm,
    level: state.scratchGui.debuggingTutorial.step,
    lastStepNumber: state.scratchGui.debuggingTutorial.lastStepNumber,
    lastTutorial: state.scratchGui.debuggingTutorial.lastTutorial,
});

const mapDispatchToProps = dispatch => ({
    onHelp: () => dispatch(onHelp()),
    onStepBack: () => dispatch(onStepBack()),
    onEnterMultiAnswer: (answer) => dispatch(onEnterMultiAnswer(answer)),
    onSetAnswer: (index, value) => dispatch(setAnswer(value, index)),
    onGapTextButtonssssssssss: () => dispatch(onGapTextButton()),
    onCloseQuestionMessage: () => dispatch(onCloseQuestionMessage()),
    onToggleDiagramm: () => dispatch(onToggleDiagramm()),
    setStep: (step) => dispatch(setStep(step)),
    reset: () => dispatch(reset()),
    setQuestionMessage: (content) => dispatch(setQuestionMessage(content)),
    addSolvedStep: (step, solution) => dispatch(addSolvedStep(step, solution)),
    setLastStepNumber: (step) => dispatch(setLastStepNumber(step)),
    resetComponent: () => dispatch(resetComponent()),
    setLastTutorial: (tutorial) => dispatch(setLastTutorial(tutorial)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialHelp);

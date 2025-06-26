import React from 'react';
import {connect} from 'react-redux';

import {
    onHelp,
    onStepBack,
    onEnterMultiAnswer,
    setAnswer,
    onCloseQuestionMessage,
    onToggleDiagramm,
    setStep,
    reset,
    setQuestionMessage,
    addSolvedStep,
    setLastStepNumber,
    resetComponent,
    setLastTutorial,
    setMultiAnswer,
    showDropdown,
    addSelectedBlock,
    removeSelectedBlock,
    onDiagrammExplanation,
    setResponseType,
} from "../reducers/debugging-tutorial-help";
import DebuggingTutorialStepComponent from '../components/debuggingTutorial/debugging/debuggingTutorialHelp.jsx';
import PropTypes from "prop-types";

class DebuggingTutorialHelp extends React.Component {

    constructor(props) {
        super(props);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.setAnswer = this.setAnswer.bind(this);
        this.onGapTextButton = this.onGapTextButton.bind(this);
        this.solveStep = this.solveStep.bind(this);
        this.onEnterMultiAnswer = this.onEnterMultiAnswer.bind(this);
    }

    /**
     * Checks if the current answers are correct. If true, the next Question gets displayed.
     */
    checkAnswer(step, tutorial) {
        switch (tutorial["questionType"]) {
            case "SINGLE_CHOICE":
            case "MARK_CHOICE":
                if (this.props.answers[0] === "") {
                    break;
                }

                if (tutorial[this.props.answers[0]]["next"] === "wrongAnswer") {
                    let correctionText = tutorial[this.props.answers[0]].correctionText === null
                        ? tutorial.correctionText : tutorial[this.props.answers[0]].correctionText;
                    this.props.setQuestionMessage(correctionText);
                    this.props.addSolvedStep(step, this.props.answers[0]);
                    break;
                }

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

                    if (nextStep !== "wrongAnswer") {
                        this.props.addSolvedStep(step, this.props.answers[2]);
                        this.props.setStep(nextStep.slice(6));
                        this.props.reset();
                    } else {
                        this.props.addSolvedStep(step, this.props.answers[2]);
                        this.props.setQuestionMessage(tutorial.correctionText);
                    }
                } else {
                   this.props.setQuestionMessage("Die beiden Felder sind noch nicht korrekt ausgefüllt");
                }
                break;
            case "MARK":
                let correctSelection = false;
                tutorial.necessaryAnswers.forEach(answer => {
                    if (this.props.selectedBlocks.hasOwnProperty(answer.slice(0, 7)) && this.props.selectedBlocks[answer.slice(0, 7)].includes(Number(answer.slice(8)))) {
                        correctSelection = true;
                    }
                });

                Object.entries(this.props.selectedBlocks).forEach(([option, idList]) => {
                    if (idList.some(element => !tutorial.possibleAnswers.includes(option +"_"+ element) && !tutorial.necessaryAnswers.includes(option +"_"+ element))) {
                        correctSelection = false;
                    }
                });

                if (correctSelection) {
                    this.props.setStep(tutorial["next"].slice(6));
                    this.props.reset();
                } else {
                    this.props.setQuestionMessage(tutorial.correctionText);
                }
                break;
            default:
                console.log("Unknown QuestionType encountered: " + tutorial["questionType"])
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.level !== this.props.level) {
            const curStep = "step" + (this.props.stepNumber + 1).toString() + "_" + this.props.level;
            const tutorialStep = this.props.tutorial[curStep];
            this.solveStep(curStep, tutorialStep);
            this.props.onScrollBottom();
        }
    }

    /**
     * opulates the most recent user inputs for a specific question if the question has been answered before.
     */
    solveStep(step, tutorial) {
        if (!this.props.solvedSteps.hasOwnProperty(step)) return;
        switch (tutorial["questionType"]) {
            case "SINGLE_CHOICE":
            case "MARK_CHOICE":
            case "DROPDOWN":
                this.props.onSetAnswer(0, this.props.solvedSteps[step][this.props.solvedSteps[step].length - 1])
                break;
            case "MULTIPLE_CHOICE":
                this.props.setMultiAnswer(tutorial["solution"]);
                break;
            case "GAP_TEXT":
                this.props.onSetAnswer(0, tutorial.question1.questionSolution);
                this.props.onSetAnswer(1, tutorial.question2.questionSolution);
                this.props.onSetAnswer(2,this.props.solvedSteps[step][this.props.solvedSteps[step].length - 1]);
                break;
        }
    }

    setAnswer(index, value, step) {
        this.props.onSetAnswer(index, value);
        if (this.props.solvedSteps.hasOwnProperty(step) && this.props.solvedSteps[step].includes(value)) {
            this.props.setQuestionMessage("[REVISITING]Bereits untersucht");
        } else {
            this.props.setQuestionMessage(null);
        }
    }

    onGapTextButton(step) {
        this.setAnswer(2, this.props.answers[2] === "true" ? "false" : "true", step);
    }

    onEnterMultiAnswer(step, answers) {
        this.props.enterMultiAnswer(answers);
        this.props.addSolvedStep(step, "solved :)");
    }

    render () {
        if (this.props.stepNumber !== this.props.lastStepNumber) {
            this.props.resetComponent();
            this.props.setLastStepNumber(this.props.stepNumber);
            return null;
        }

        let curStep;

        if (this.props.tutorial === null) return null;

        if (this.props.lastTutorial === null || JSON.stringify(this.props.tutorial) !== JSON.stringify(this.props.lastTutorial)) {
            this.props.resetComponent();
            this.props.setLastTutorial(this.props.tutorial);
            return null;
        } else {
            curStep = "step" + (this.props.stepNumber + 1).toString() + "_" + this.props.level;
        }

        const tutorialStep = this.props.tutorial[curStep];

        const isGapTextSolved = tutorialStep.questionType === "GAP_TEXT"
            && this.props.answers[0].toLowerCase() === tutorialStep.question1.questionSolution
            && this.props.answers[1].toLowerCase() === tutorialStep.question2.questionSolution;

        return (
            <DebuggingTutorialStepComponent
                cardRef={ref => (this.myRef = ref)}
                step={curStep}
                isGapTextSolved={isGapTextSolved}
                onCheckAnswer={() => this.checkAnswer(curStep, tutorialStep)}
                setAnswer={(index, value) => this.setAnswer(index, value, curStep)}
                onGapTextButton={() => this.onGapTextButton(curStep)}
                onEnterMultiAnswer={(answer) => this.onEnterMultiAnswer(curStep, answer)}
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
    enterMultiAnswer: PropTypes.func,
    setMultiAnswer: PropTypes.func,
    onShowDropdown: PropTypes.func,
    onScrollBottom: PropTypes.func,
    selectedBlocks: PropTypes.any,
    showExplanation: PropTypes.bool,
    responseType: PropTypes.any,
    setResponseType: PropTypes.func
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
    showDropdown: state.scratchGui.debuggingTutorial.showDropdown,
    selectedBlocks: state.scratchGui.debuggingTutorial.selectedBlocks,
    showExplanation: state.scratchGui.debuggingTutorial.explanation,
    responseType: state.scratchGui.debuggingTutorial.responseType,
});

const mapDispatchToProps = dispatch => ({
    onHelp: () => dispatch(onHelp()),
    onStepBack: () => dispatch(onStepBack()),
    enterMultiAnswer: (answer) => dispatch(onEnterMultiAnswer(answer)),
    onSetAnswer: (index, value) => dispatch(setAnswer(value, index)),
    onCloseQuestionMessage: () => dispatch(onCloseQuestionMessage()),
    onToggleDiagramm: () => dispatch(onToggleDiagramm()),
    setStep: (step) => dispatch(setStep(step)),
    reset: () => dispatch(reset()),
    setQuestionMessage: (content) => dispatch(setQuestionMessage(content)),
    addSolvedStep: (step, solution) => dispatch(addSolvedStep(step, solution)),
    setLastStepNumber: (step) => dispatch(setLastStepNumber(step)),
    resetComponent: () => dispatch(resetComponent()),
    setLastTutorial: (tutorial) => dispatch(setLastTutorial(tutorial)),
    setMultiAnswer: (answers) => dispatch(setMultiAnswer(answers)),
    onShowDropdown: (show) => dispatch(showDropdown(show)),
    addSelectedBlock: (option, id) => dispatch(addSelectedBlock(option, id)),
    removeSelectedBlock: (option, id) => dispatch(removeSelectedBlock(option, id)),
    onDiagrammExplanation: () => dispatch(onDiagrammExplanation()),
    setResponseType: (responseType) => dispatch(setResponseType(responseType)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebuggingTutorialHelp);

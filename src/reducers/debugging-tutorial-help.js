import {string} from "to-style";

const ENTER_MULTI_ANSWER = 'scratch-gui/debugging-tutorial-cards/ENTER_MULTI_ANSWER';
const HELP = 'scratch-gui/debugging-tutorial-cards/HELP';
const STEP_BACK = 'scratch-gui/debugging-tutorial-cards/STEP_BACK';
const GAP_TEXT_BUTTON = 'scratch-gui/debugging-tutorial-cards/GAP_TEXT_BUTTON';
const SET_ANSWER = 'scratch-gui/debugging-tutorial-cards/SET_ANSWER';
const CLOSE_QUESTION = 'scratch-gui/debugging-tutorial-cards/CLOSE_QUESTION';
const TOGGLE_DIAGRAMM = 'scratch-gui/debugging-tutorial-cards/TOGGLE_DIAGRAMM';
const SET_STEP = 'scratch-gui/debugging-tutorial-cards/SET_STEP';
const RESET = 'scratch-gui/debugging-tutorial-cards/RESET';
const SET_QUESTION_MSG = 'scratch-gui/debugging-tutorial-cards/SET_QUESTION_MSG';
const ADD_SOLVED = 'scratch-gui/debugging-tutorial-cards/ADD_SOLVED';
const SET_LAST_STEP = 'scratch-gui/debugging-tutorial-cards/SET_LAST_STEP';
const RESET_COMPONENT = 'scratch-gui/debugging-tutorial-cards/RESET_COMPONENT';
const SET_LAST_TUTORIAL = 'scratch-gui/debugging-tutorial-cards/SET_LAST_TUTORIAL';

const initialState = { //TODO Remove logic from reducer!
    step: "1",
    tutorial: null,
    isHelpVisible: false,
    stepStack: ["1"],
    answers: ["", "", ""],
    selectedAnswers: [false, false, false, false, false, false],
    solvedSteps: {},
    questionMessage: null,
    showDiagramm: true,
    lastStepNumber: -1,
    lastTutorial: null,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }

    const baseState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case STEP_BACK:
            if (baseState.stepStack.length > 1) {
                baseState.step = baseState.stepStack.pop();
                baseState.answers = ["", "", ""];
                baseState.selectedAnswers = [false, false, false, false, false, false];
                baseState.isHelpVisible = false;
                baseState.questionMessage = null;
            }
            break;
        case ENTER_MULTI_ANSWER:
            baseState.selectedAnswers[action.index] = !baseState.selectedAnswers[action.index];
            break;
        case HELP:
            baseState.isHelpVisible = !baseState.isHelpVisible;
            break;
        case GAP_TEXT_BUTTON:
            if (baseState.answers[2] === "") {
                baseState.answers[2] = "true";
            } else {
                baseState.answers[2] === "true" ?
                    baseState.answers[2] = "false" : baseState.answers[2] = "true";
            }
            break;
        case SET_ANSWER:
            baseState.answers[action.index] = action.value;
            break;
        case CLOSE_QUESTION:
            baseState.questionMessage = null;
            break;
        case TOGGLE_DIAGRAMM:
            baseState.showDiagramm = !baseState.showDiagramm;
            break;
        case SET_STEP:
            if (baseState.step !== action.step) {
                baseState.stepStack = [...baseState.stepStack, baseState.step];
                baseState.step = action.step;
            }
            break;
        case RESET:
            baseState.answers = ["", "", ""];
            baseState.selectedAnswers = [false, false, false, false, false, false];
            baseState.isHelpVisible = false;
            baseState.questionMessage = null;
            break;
        case SET_QUESTION_MSG:
            baseState.questionMessage = action.content;
            break;
        case ADD_SOLVED:
            addToKey(baseState.solvedSteps, action.step, action.solution);
            console.log("Solved Steps: " + JSON.stringify(baseState.solvedSteps));
            break;
        case SET_LAST_STEP:
            baseState.lastStepNumber = action.step;
            break;
        case RESET_COMPONENT:
            baseState.answers = ["", "", ""];
            baseState.selectedAnswers = [false, false, false, false, false, false];
            baseState.isHelpVisible = false;
            baseState.questionMessage = null;
            baseState.step = "1";
            baseState.stepStack = ["1"];
            baseState.solvedSteps = {};
            baseState.showDiagramm = true;
            break;
        case SET_LAST_TUTORIAL:
            baseState.lastTutorial = action.tutorial;
            break;
    }
    return baseState;
};

function addToKey(obj, key, element) {
    if (obj.hasOwnProperty(key)) {
        if (!obj[key].includes(element)) obj[key].push(element);
    } else {
        obj[key] = [element];
    }
}

const onEnterMultiAnswer = function (answer) {
    let index = answer.charAt(6) - 1; //option1 -> 0
    return {type: ENTER_MULTI_ANSWER, index};
}

const onHelp = function () {
    return {type: HELP};
}

const onStepBack = function () {
    return {type: STEP_BACK};
}

const onGapTextButton = function () {
    return {type: GAP_TEXT_BUTTON};
}

const setAnswer = function (value, index) {
    return {type: SET_ANSWER, value, index}
}

const onCloseQuestionMessage = function () {
    return {type: CLOSE_QUESTION}
}

const onToggleDiagramm = function () {
    return {type: TOGGLE_DIAGRAMM}
}

const setStep = function (step) {
    return {type: SET_STEP, step}
}

const reset = function () {
    return {type: RESET}
}

const setQuestionMessage = function (content) {
    return {type: SET_QUESTION_MSG, content}
}

const addSolvedStep = function (step, solution) {
    return {type: ADD_SOLVED, step, solution}
}

const setLastStepNumber = function (step) {
    return {type: SET_LAST_STEP, step}
}

const resetComponent = function () {
    return {type: RESET_COMPONENT}
}

const setLastTutorial = function (tutorial) {
    return {type: SET_LAST_TUTORIAL, tutorial}
}

export {
    reducer as default,
    initialState as debuggingTutorialInitialState,
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
    setLastTutorial,
};

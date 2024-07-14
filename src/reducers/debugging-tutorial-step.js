import {func} from "prop-types";


const ENTER_ANSWER = 'scratch-gui/debugging-tutorial-cards/ENTER_ANSWER';
const ENTER_MULTI_ANSWER = 'scratch-gui/debugging-tutorial-cards/ENTER_MULTI_ANSWER';
const HELP = 'scratch-gui/debugging-tutorial-cards/HELP';
const CHECK_ANSWER = 'scratch-gui/debugging-tutorial-cards/CHECK_ANSWER';
const STEP_BACK = 'scratch-gui/debugging-tutorial-cards/STEP_BACK';
const CHANGE_TEXT1 = 'scratch-gui/debugging-tutorial-cards/CHANGE_TEXT1';
const CHANGE_TEXT2 = 'scratch-gui/debugging-tutorial-cards/CHANGE_TEXT2';
const CHANGE_TEXT_END_ANSWER = 'scratch-gui/debugging-tutorial-cards/CHANGE_TEXT_END_ANSWER';

const initialState = {
    step: "step1",
    isHelpVisible: false,
    selectedAnswer: null,
    stepStack: ["step1"],
    selectedAnswers: [false, false, false, false, false, false],
    textAnswer1: "",
    textAnswer2: "",
    textEndAnswer: "",
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    const baseState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case STEP_BACK:
            if (baseState.stepStack.length > 1) {
                baseState.stepStack.pop()
                baseState.step = baseState.stepStack.pop(); // step1, step2, step3, step4 -> step1, step2
                baseState.stepStack.push(baseState.step) //TODO BRUH WTF
                baseState.selectedAnswer = null;
            }
            break;
        case ENTER_ANSWER:
            baseState.selectedAnswer = action.answer;
            break;
        case ENTER_MULTI_ANSWER:
            baseState.selectedAnswers[action.index] = !baseState.selectedAnswers[action.index];
            console.log(baseState.selectedAnswers)
            break;
        case HELP:
            baseState.isHelpVisible = !baseState.isHelpVisible;
            break;
        case CHECK_ANSWER:
            switch (baseState.tutorial[baseState.step]["questionType"]) {
                case "SINGLE":
                    if (baseState.selectedAnswer === null) {
                        break;
                    }

                    let lastStep = baseState.step;

                    if (baseState.tutorial[baseState.step][baseState.selectedAnswer]["next"] === "wrongAnswer") {
                        break;
                    }

                    baseState.step = baseState.tutorial[baseState.step][baseState.selectedAnswer]["next"];
                    if (baseState.step !== lastStep) {
                        baseState.stepStack = [...baseState.stepStack, baseState.step];
                        baseState.selectedAnswer = null;
                        baseState.isHelpVisible = false;
                    }
                    break;
                case "MULTIPLE":
                    console.log(baseState.selectedAnswers + "  /  " + baseState.tutorial[baseState.step]["solution"]);

                    if (JSON.stringify(baseState.selectedAnswers) === JSON.stringify(baseState.tutorial[baseState.step]["solution"])) {
                        let lastStep = baseState.step;
                        baseState.step = baseState.tutorial[baseState.step]["next"];
                        if (baseState.step !== lastStep) {
                            baseState.stepStack = [...baseState.stepStack, baseState.step];
                            baseState.selectedAnswers = [false, false, false, false, false, false];
                            baseState.isHelpVisible = false;
                        }
                    }
                    break;
            }
            break;
        case CHANGE_TEXT1:
            baseState.textAnswer1 = action.input;
            break;
        case CHANGE_TEXT2:
            baseState.textAnswer2 = action.input;
            break;
        case CHANGE_TEXT_END_ANSWER:
            if (baseState.textEndAnswer === "") {
                baseState.textEndAnswer = "true";
            } else {
                baseState.textEndAnswer === "true" ?
                    baseState.textEndAnswer = "false" : baseState.textEndAnswer = "true";
            }

            break;
    }
    return baseState;
};

const onEnterAnswer = function (answer) {
    return {type: ENTER_ANSWER, answer};
}

const onEnterMultiAnswer = function (answer) {
    let index = answer.charAt(6) - 1; //option1 -> 0
    return {type: ENTER_MULTI_ANSWER, index};
}

const onHelp = function () {
    return {type: HELP};
}

const onCheckAnswer = function () {
    return {type: CHECK_ANSWER};
}

const onStepBack = function () {
    return {type: STEP_BACK};
}

const onChangeTextInput1 = function (input) {
    console.log("changing text input: " + input)
    return {type: CHANGE_TEXT1, input};
}

const onChangeTextInput2 = function (input) {
    return {type: CHANGE_TEXT2, input};
}

const onChangeTextEndAnswer = function () {
    return {type: CHANGE_TEXT_END_ANSWER};
}

export {
    reducer as default,
    initialState as debuggingTutorialInitialState,
    onEnterAnswer,
    onHelp,
    onCheckAnswer,
    onStepBack,
    onEnterMultiAnswer,
    onChangeTextInput1,
    onChangeTextInput2,
    onChangeTextEndAnswer,
};

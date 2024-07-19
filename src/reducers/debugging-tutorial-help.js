const ENTER_MULTI_ANSWER = 'scratch-gui/debugging-tutorial-cards/ENTER_MULTI_ANSWER';
const HELP = 'scratch-gui/debugging-tutorial-cards/HELP';
const CHECK_ANSWER = 'scratch-gui/debugging-tutorial-cards/CHECK_ANSWER';
const STEP_BACK = 'scratch-gui/debugging-tutorial-cards/STEP_BACK';
const GAP_TEXT_BUTTON = 'scratch-gui/debugging-tutorial-cards/GAP_TEXT_BUTTON';
const SET_ANSWER = 'scratch-gui/debugging-tutorial-cards/SET_ANSWER';

const initialState = { //TODO Needs complete rework. Remove logic from reducer!
    step: "step1",
    tutorial: null,
    isHelpVisible: false,
    stepStack: ["step1"],
    answers: ["", "", ""],
    selectedAnswers: [false, false, false, false, false, false],
    solvedSteps: [],
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
                baseState.stepStack.push(baseState.step) //TODO BRUH
                baseState.answers = ["", "", ""];
                baseState.selectedAnswers = [false, false, false, false, false, false];
                baseState.isHelpVisible = false;
            }
            break;
        case ENTER_MULTI_ANSWER:
            baseState.selectedAnswers[action.index] = !baseState.selectedAnswers[action.index];
            break;
        case HELP:
            baseState.isHelpVisible = !baseState.isHelpVisible;
            break;
        case CHECK_ANSWER:
            baseState.tutorial = action.tutorial;
            checkAnswerParse(baseState, action);
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
    }
    return baseState;
};

const resetAnswers = function (baseState, lastStep) {
    if (baseState.step !== lastStep) { //Only when visiting a new step.
        baseState.stepStack = [...baseState.stepStack, baseState.step];
        baseState.answers = ["", "", ""];
        baseState.selectedAnswers = [false, false, false, false, false, false];
        baseState.isHelpVisible = false;
    }
}

const checkAnswerParse = function (baseState) { //TODO move from reducer into other class
    let lastStep = baseState.step;
    switch (baseState.tutorial[baseState.step]["questionType"]) {
        case "SINGLE_CHOICE":
            if (baseState.answers[0] === "") {
                break;
            }

            if (baseState.tutorial[baseState.step][baseState.answers[0]]["next"] === "wrongAnswer") {
                break; //TODO Display Message
            }

            baseState.step = baseState.tutorial[baseState.step][baseState.answers[0]]["next"];
            resetAnswers(baseState, lastStep);
            break;
        case "MULTIPLE_CHOICE":
            if (JSON.stringify(baseState.selectedAnswers) === JSON.stringify(baseState.tutorial[baseState.step]["solution"])) {

                baseState.step = baseState.tutorial[baseState.step]["next"];
                resetAnswers(baseState, lastStep);
            }
            break;
        case "DROPDOWN":
            if (baseState.answers[0] !== "") {
                const findOption = () => Object.entries(baseState.tutorial[baseState.step])
                    .find(([key, value]) => value.label === baseState.answers[0])?.[0] || null;
                baseState.step = baseState.tutorial[baseState.step][findOption()]["next"];
                resetAnswers(baseState, lastStep);
            }
            break;
        case "GAP_TEXT":
            if (baseState.answers[2] !== "") {
                baseState.step = baseState.answers[2] !== "false" ?
                    baseState.tutorial[baseState.step].endQuestionTrueNext :
                    baseState.step = baseState.tutorial[baseState.step].endQuestionFalseNext;
                resetAnswers(baseState, lastStep);
                // The GAP TEXT was solved. Next time when visiting this specific step, solve the first 2 inputFields
                baseState.solvedSteps = [...baseState.solvedSteps, lastStep];
            }
            break;
        case "MESSAGE":
            baseState.step = baseState.tutorial[baseState.step].next;
            baseState.isHelpVisible = false;
            baseState.stepStack = [...baseState.stepStack, baseState.step];
            break;
    }
}

const onEnterMultiAnswer = function (answer) {
    let index = answer.charAt(6) - 1; //option1 -> 0
    return {type: ENTER_MULTI_ANSWER, index};
}

const onHelp = function () {
    return {type: HELP};
}

const onCheckAnswer = function (tutorial) {
    return {type: CHECK_ANSWER, tutorial};
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


export {
    reducer as default,
    initialState as debuggingTutorialInitialState,
    onHelp,
    onCheckAnswer,
    onStepBack,
    onEnterMultiAnswer,
    setAnswer,
    onGapTextButton,
};

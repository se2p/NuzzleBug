
const RESET = 'scratch-gui/tutorial-step/RESET';
const NEXT_TEST = 'scratch-gui/tutorial-cards/NEXT_TEST';
const NEXT_TUTORIAL_STEP = 'scratch-gui/tutorial-cards/NEXT_TUTORIAL_STEP';
const SUCCESS = 'scratch-gui/tutorial-cards/SUCCESS';
const FAIL = 'scratch-gui/tutorial-cards/FAIL';
const EXPAND_SOLUTION = 'scratch-gui/tutorial-cards/EXPAND_SOLUTION';

const initialState = {
    testedStep: -1,
    currentStep: 0,
    success: false,
    failedTimes: 0,
    failureMessage: '',
    solutionExpanded: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case RESET:
        return Object.assign({}, state, {
            currentStep: 0,
            testedStep: -1,
            failedTimes: 0
        });
    case NEXT_TEST:
        return Object.assign({}, state, {
            testedStep: state.testedStep + 1,
            solutionExpanded: false
        });
    case NEXT_TUTORIAL_STEP: {
        return Object.assign({}, state, {
            currentStep: state.currentStep + 1,
            success: false
        });
    }
    case SUCCESS: {
        return Object.assign({}, state, {
            success: true,
            failureMessage: '',
            failedTimes: 0
        });
    }
    case FAIL: {
        return Object.assign({}, state, {
            failureMessage: action.failureMessage,
            failedTimes: state.failedTimes + 1
        });
    }
    case EXPAND_SOLUTION: {
        return Object.assign({}, state, {
            solutionExpanded: !state.solutionExpanded
        });
    }
    default:
        return state;
    }
};

const reset = function () {
    return {type: RESET};
};

const testNextStep = function () {
    return {type: NEXT_TEST};
};

const nextTutorialStep = function () {
    return {type: NEXT_TUTORIAL_STEP};
};

const success = function () {
    return {type: SUCCESS};
};

const fail = function (failureMessage) {
    return {type: FAIL, failureMessage};
};

const expandSolution = function () {
    return {type: EXPAND_SOLUTION};
};

export {
    reducer as default,
    initialState as tutorialStepInitialState,
    reset,
    testNextStep,
    nextTutorialStep,
    success,
    fail,
    expandSolution
};

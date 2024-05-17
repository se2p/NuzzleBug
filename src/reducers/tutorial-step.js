const RESET = 'scratch-gui/tutorial-card-step/RESET';
const NEXT_TEST = 'scratch-gui/tutorial-cards/NEXT_TEST';
const TEST_STARTED = 'scratch-gui/tutorial-cards/TEST_STARTED';
const TEST_STOPPED = 'scratch-gui/tutorial-cards/TEST_STOPPED';
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
    solutionExpanded: false,
    currentlyTesting: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case RESET:
        return initialState;
    case NEXT_TEST:
        return Object.assign({}, state, {
            testedStep: state.testedStep + 1,
            solutionExpanded: false
        });
    case TEST_STARTED:
        return Object.assign({}, state, {
            currentlyTesting: true
        });
    case TEST_STOPPED:
        return Object.assign({}, state, {
            currentlyTesting: false
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

const testStarted = function () {
    return {type: TEST_STARTED};
};

const testStopped = function () {
    return {type: TEST_STOPPED};
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
    testStarted,
    testStopped,
    nextTutorialStep,
    success,
    fail,
    expandSolution
};

const RESET = 'scratch-gui/tutorial-step/RESET';
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
    if (typeof state === 'undefined') {
        state = initialState;
    }
    const baseState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
    case RESET:
        return initialState;
    case NEXT_TEST:
        baseState.testedStep = state.testedStep + 1;
        baseState.solutionExpanded = false;
        break;
    case TEST_STARTED:
        baseState.currentlyTesting = true;
        break;
    case TEST_STOPPED:
        baseState.currentlyTesting = false;
        break;
    case NEXT_TUTORIAL_STEP:
        baseState.currentStep = state.currentStep + 1;
        baseState.success = false;
        break;
    case SUCCESS:
        baseState.success = true;
        baseState.failureMessage = '';
        baseState.failedTimes = 0;
        break;
    case FAIL:
        baseState.failureMessage = action.failureMessage;
        baseState.failedTimes = state.failedTimes + 1;
        break;
    case EXPAND_SOLUTION:
        baseState.solutionExpanded = !state.solutionExpanded;
        break;
    }
    return baseState;
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

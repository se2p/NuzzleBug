const SET_RUNNING_STATE = 'scratch-gui/vm-status/SET_RUNNING_STATE';
const SET_PAUSE_STATE = 'scratch-gui/vm-status/SET_PAUSED_STATE';
const SET_TURBO_STATE = 'scratch-gui/vm-status/SET_TURBO_STATE';
const SET_STARTED_STATE = 'scratch-gui/vm-status/SET_STARTED_STATE';
const SET_TRACING_ACTIVE_STATE = 'scratch-gui/vm-status/SET_TRACING_ACTIVE_STATE';
const SET_WHISKER_TEST = 'scratch-gui/vm-status/SET_WHISKER_TEST';
const SET_IS_WHISKER_PROJECT_LOADING = 'scratch-gui/vm-status/SET_IS_WHISKER_PROJECT_LOADING';
const SET_TEST_RUNNING_STATE = 'scratch-gui/vm-status/SET_TEST_RUNNING_STATE';

const initialState = {
    running: false,
    started: false,
    paused: false,
    turbo: false,
    tracingActive: true,
    isWhiskerProjectLoading: false,
    testRunning: false,
    whiskerTest: null
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_STARTED_STATE:
        return Object.assign({}, state, {
            started: action.started
        });
    case SET_RUNNING_STATE:
        return Object.assign({}, state, {
            running: action.running
        });
    case SET_PAUSE_STATE:
        return Object.assign({}, state, {
            paused: action.paused
        });
    case SET_TURBO_STATE:
        return Object.assign({}, state, {
            turbo: action.turbo
        });
    case SET_TRACING_ACTIVE_STATE:
        return Object.assign({}, state, {
            tracingActive: action.tracingActive
        });
    case SET_WHISKER_TEST:
        return Object.assign({}, state, {
            whiskerTest: action.whiskerTest
        });
    case SET_IS_WHISKER_PROJECT_LOADING:
        return Object.assign({}, state, {
            isWhiskerProjectLoading: action.isWhiskerProjectLoading
        });
    case SET_TEST_RUNNING_STATE:
        return Object.assign({}, state, {
            testRunning: action.testRunning
        });
    default:
        return state;
    }
};

const setStartedState = function (started) {
    return {
        type: SET_STARTED_STATE,
        started: started
    };
};


const setRunningState = function (running) {
    return {
        type: SET_RUNNING_STATE,
        running: running
    };
};

const setPauseState = function (paused) {
    return {
        type: SET_PAUSE_STATE,
        paused: paused
    };
};

const setTurboState = function (turbo) {
    return {
        type: SET_TURBO_STATE,
        turbo: turbo
    };
};

const setTracingActiveState = function (tracingActive) {
    return {
        type: SET_TRACING_ACTIVE_STATE,
        tracingActive: tracingActive
    };
};

const setWhiskerTest = function (whiskerTest) {
    return {
        type: SET_WHISKER_TEST,
        whiskerTest: whiskerTest
    };
};

const setIsWhiskerProjectLoading = function (isWhiskerProjectLoading) {
    return {
        type: SET_IS_WHISKER_PROJECT_LOADING,
        isWhiskerProjectLoading: isWhiskerProjectLoading
    };
};

const setTestRunningState = function (testRunning) {
    return {
        type: SET_TEST_RUNNING_STATE,
        testRunning: testRunning
    };
};

export {
    reducer as default,
    initialState as vmStatusInitialState,
    setRunningState,
    setStartedState,
    setTurboState,
    setPauseState,
    setTracingActiveState,
    setIsWhiskerProjectLoading,
    setWhiskerTest,
    setTestRunningState
};

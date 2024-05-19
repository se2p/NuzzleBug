const SET_RUNNING_STATE = 'scratch-gui/vm-status/SET_RUNNING_STATE';
const SET_PAUSE_STATE = 'scratch-gui/vm-status/SET_PAUSED_STATE';
const SET_TURBO_STATE = 'scratch-gui/vm-status/SET_TURBO_STATE';
const SET_STARTED_STATE = 'scratch-gui/vm-status/SET_STARTED_STATE';
const SET_TRACING_ACTIVE_STATE = 'scratch-gui/vm-status/SET_TRACING_ACTIVE_STATE';
const SET_WHISKER_TEST = 'scratch-gui/vm-status/SET_WHISKER_TEST';
const SET_IS_WHISKER_PROJECT_LOADING = 'scratch-gui/vm-status/SET_IS_WHISKER_PROJECT_LOADING';
const SET_TEST_RUNNING_STATE = 'scratch-gui/vm-status/SET_TEST_RUNNING_STATE';
const LOCK = 'scratch-gui/vm-status/LOCK';
const UNLOCK = 'scratch-gui/vm-status/UNLOCK';


const initialState = {
    running: false,
    started: false,
    paused: false,
    turbo: false,
    tracingActive: true,
    isWhiskerProjectLoading: false,
    testRunning: false,
    whiskerTest: null,
    locked: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    const baseState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
    case SET_STARTED_STATE:
        baseState.started = action.started;
        break;
    case SET_RUNNING_STATE:
        baseState.running = action.running;
        break;
    case SET_PAUSE_STATE:
        baseState.paused = action.paused;
        break;
    case SET_TURBO_STATE:
        baseState.turbo = action.turbo;
        break;
    case SET_TRACING_ACTIVE_STATE:
        baseState.tracingActive = action.tracingActive;
        break;
    case SET_WHISKER_TEST:
        baseState.whiskerTest = action.whiskerTest;
        break;
    case SET_IS_WHISKER_PROJECT_LOADING:
        baseState.isWhiskerProjectLoading = action.isWhiskerProjectLoading;
        break;
    case SET_TEST_RUNNING_STATE:
        baseState.testRunning = action.testRunning;
        break;
    case LOCK:
        baseState.locked = true;
        break;
    case UNLOCK:
        baseState.locked = false;
        break;
    }
    return baseState;
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

const lock = function () {
    return {
        type: LOCK
    };
};

const unlock = function () {
    return {
        type: UNLOCK
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
    setTestRunningState,
    lock,
    unlock
};

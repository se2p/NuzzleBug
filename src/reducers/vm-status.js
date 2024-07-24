const SET_RUNNING_STATE = 'scratch-gui/vm-status/SET_RUNNING_STATE';
const SET_PAUSE_STATE = 'scratch-gui/vm-status/SET_PAUSED_STATE';
const SET_TURBO_STATE = 'scratch-gui/vm-status/SET_TURBO_STATE';
const SET_STARTED_STATE = 'scratch-gui/vm-status/SET_STARTED_STATE';
const SET_TRACING_ACTIVE_STATE = 'scratch-gui/vm-status/SET_TRACING_ACTIVE_STATE';
const LOCK = 'scratch-gui/vm-status/LOCK';
const UNLOCK = 'scratch-gui/vm-status/UNLOCK';


const initialState = {
    running: false,
    started: false,
    paused: false,
    turbo: false,
    tracingActive: true,
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
    lock,
    unlock
};

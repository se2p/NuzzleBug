const SET_RUNNING_STATE = 'scratch-gui/vm-status/SET_RUNNING_STATE';
const SET_PAUSE_STATE = 'scratch-gui/vm-status/SET_PAUSED_STATE';
const SET_TURBO_STATE = 'scratch-gui/vm-status/SET_TURBO_STATE';
const SET_STARTED_STATE = 'scratch-gui/vm-status/SET_STARTED_STATE';
const SET_OBSERVATION_ACTIVE_STATE = 'scratch-gui/vm-status/SET_OBSERVATION_ACTIVE_STATE';

const initialState = {
    running: false,
    started: false,
    paused: false,
    turbo: false,
    observationActive: false
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
    case SET_OBSERVATION_ACTIVE_STATE:
        return Object.assign({}, state, {
            observationActive: action.observationActive
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

const setObservationActiveState = function (observationActive) {
    return {
        type: SET_OBSERVATION_ACTIVE_STATE,
        observationActive: observationActive
    };
};

export {
    reducer as default,
    initialState as vmStatusInitialState,
    setRunningState,
    setStartedState,
    setTurboState,
    setPauseState,
    setObservationActiveState
};

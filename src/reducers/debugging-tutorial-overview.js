const SET_LAST_TUTORIAL = 'scratch-gui/debugging-tutorial-overview/SET_LAST_TUTORIAL';
const SET_LOADING = 'scratch-gui/debugging-tutorial-overview/SET_LOADING';
const TOGGLE_AUTO_SAVE = 'scratch-gui/debugging-tutorial-overview/TOGGLE_AUTO_SAVE';
const SET_CONTENT_TYPE = 'scratch-gui/debugging-tutorial-overview/SET_CONTENT_TYPE';
const RESET = 'scratch-gui/debugging-tutorial-overview/RESET';
const LAST_TUTORIAL = 'scratch-gui/debugging-tutorial-overview/LAST_TUTORIAL';

const CONTENT_START = 'scratch-gui/debugging-tutorial-overview/DESCRIPTION';

const initialState = {
    lastTutorial: null,
    isLoading: false,
    autoSave: "",
    contentType: CONTENT_START,
    lastStartedTutorial: null,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    const baseState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case SET_LAST_TUTORIAL:
            baseState.lastTutorial = action.tutorial;
            break;
        case SET_LOADING:
            baseState.isLoading = action.isLoading;
            break;
        case TOGGLE_AUTO_SAVE:
            baseState.autoSave = action.t;
            break;
        case SET_CONTENT_TYPE:
            baseState.contentType = action.contentType;
            break;
        case LAST_TUTORIAL:
            baseState.lastStartedTutorial = action.tutorial;
            break;
        case RESET:
            baseState.isLoading = false;
            baseState.autoSave = "";
            baseState.contentType = CONTENT_START;
            break;
    }
    return baseState;
};

const setLastTutorial = function (tutorial) {
    return {type: SET_LAST_TUTORIAL, tutorial};
}

const setLoading = function (isLoading) {
    return {type: SET_LOADING, isLoading};
}

const setAutoSave = function (t) {
    return {type: TOGGLE_AUTO_SAVE, t};
}

const setContentType = function (contentType) {
    return {type: SET_CONTENT_TYPE, contentType};
}

const reset = function () {
    return {type: RESET};
}

const lastStartedTutorial = function (tutorial) {
    return {type: LAST_TUTORIAL, tutorial};
}

export {
    reducer as default,
    initialState as debuggingTutorialOverviewInitialState,
    setLastTutorial,
    setLoading,
    setAutoSave,
    setContentType,
    reset,
    lastStartedTutorial,
};

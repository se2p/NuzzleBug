const SET_LAST_TUTORIAL = 'scratch-gui/debugging-tutorial-cards/SET_LAST_TUTORIAL';
const SET_LOADING = 'scratch-gui/debugging-tutorial-cards/SET_LOADING';
const TOGGLE_AUTO_SAVE = 'scratch-gui/debugging-tutorial-cards/TOGGLE_AUTO_SAVE';

const initialState = {
    lastTutorial: null,
    isLoading: false,
    autoSave: false,
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
            baseState.autoSave = !baseState.autoSave;
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

const toggleAutosave = function () {
    return {type: TOGGLE_AUTO_SAVE};
}

export {
    reducer as default,
    initialState as debuggingTutorialOverviewInitialState,
    setLastTutorial,
    setLoading,
    toggleAutosave,
};

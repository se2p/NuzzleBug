const SET_LAST_TUTORIAL = 'scratch-gui/debugging-tutorial-cards/SET_LAST_TUTORIAL';

const initialState = {
    lastTutorial: null,
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
    }
    return baseState;
};

const setLastTutorial = function (tutorial) {
    return {type: SET_LAST_TUTORIAL, tutorial};
}

export {
    reducer as default,
    initialState as debuggingTutorialOverviewInitialState,
    setLastTutorial,
};

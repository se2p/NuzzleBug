const TOGGLE_HIDDEN_DEBUGGING_WINDOW_VISIBILITY = 'TOGGLE_HIDDEN_DEBUGGING_WINDOW_VISIBILITY';

const initialState = {
    windowVisible: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;

    switch (action.type) {

    case TOGGLE_HIDDEN_DEBUGGING_WINDOW_VISIBILITY:
        return Object.assign({}, state, {
            windowVisible: !state.windowVisible
        });

    default:
        return state;
    }
};

const toggleHiddenDebuggingWindowVisibility = function () {
    return {type: TOGGLE_HIDDEN_DEBUGGING_WINDOW_VISIBILITY};
};

export {
    reducer as default,
    initialState as hiddenDebuggingInitialState,
    toggleHiddenDebuggingWindowVisibility
};

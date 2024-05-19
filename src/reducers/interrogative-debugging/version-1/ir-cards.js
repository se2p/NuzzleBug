// Copied from './vm-status'
const SET_RUNNING_STATE = 'scratch-gui/vm-status/SET_RUNNING_STATE';
// Copied from './block-drag'
const BLOCK_DRAG_UPDATE = 'scratch-gui/block-drag/BLOCK_DRAG_UPDATE';
// Copied from './project-changed'
const SET_PROJECT_CHANGED = 'scratch-gui/project-changed/SET_PROJECT_CHANGED';

const CLOSE_CARDS = 'scratch-gui/ircards/CLOSE_CARDS';
const ENABLE_CARDS = 'scratch-gui/ircards/ENABLE_CARDS';
const DISABLE_CARDS = 'scratch-gui/ircards/DISABLE_CARDS';
const SHRINK_EXPAND_CARDS = 'scratch-gui/ircards/SHRINK_EXPAND_CARDS';
const VIEW_CARDS = 'scratch-gui/ircards/VIEW_CARDS';
const NEXT_STEP = 'scratch-gui/ircards/NEXT_STEP';
const PREV_STEP = 'scratch-gui/ircards/PREV_STEP';
const RESET_STEP = 'scratch-gui/ircards/RESET_STEP';
const DRAG_CARD = 'scratch-gui/ircards/DRAG_CARD';
const START_DRAG = 'scratch-gui/ircards/START_DRAG';
const END_DRAG = 'scratch-gui/ircards/END_DRAG';

const initialState = {
    visible: false,
    disabled: false,
    step: 0,
    x: 0,
    y: 0,
    expanded: true,
    dragging: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_PROJECT_CHANGED:
        return Object.assign({}, state, initialState);
    case CLOSE_CARDS:
        return Object.assign({}, state, {
            visible: false
        });
    case BLOCK_DRAG_UPDATE:
        return Object.assign({}, state, {
            disabled: true
        });
    case SET_RUNNING_STATE:
        if (!action.running) {
            return state;
        }
        return Object.assign({}, state, {
            disabled: false
        });
    case ENABLE_CARDS:
        return Object.assign({}, state, {
            disabled: false
        });
    case DISABLE_CARDS:
        return Object.assign({}, state, {
            disabled: true
        });
    case SHRINK_EXPAND_CARDS:
        return Object.assign({}, state, {
            expanded: !state.expanded
        });
    case VIEW_CARDS:
        return Object.assign({}, state, {
            visible: true
        });
    case NEXT_STEP:
        return Object.assign({}, state, {
            step: state.step + 1
        });
    case PREV_STEP:
        if (state.step > 0) {
            return Object.assign({}, state, {
                step: state.step - 1
            });
        }
        return state;
    case RESET_STEP:
        return Object.assign({}, state, {
            step: action.step
        });
    case DRAG_CARD:
        return Object.assign({}, state, {
            x: action.x,
            y: action.y
        });
    case START_DRAG:
        return Object.assign({}, state, {
            dragging: true
        });
    case END_DRAG:
        return Object.assign({}, state, {
            dragging: false
        });
    default:
        return state;
    }
};

const viewCards = function () {
    return {type: VIEW_CARDS};
};

const closeCards = function () {
    return {type: CLOSE_CARDS};
};

const enableCards = function () {
    return {type: ENABLE_CARDS};
};

const disableCards = function () {
    return {type: DISABLE_CARDS};
};

const shrinkExpandCards = function () {
    return {type: SHRINK_EXPAND_CARDS};
};

const nextStep = function () {
    return {type: NEXT_STEP};
};

const prevStep = function () {
    return {type: PREV_STEP};
};

const resetStep = function (step) {
    return {type: RESET_STEP, step};
};

const dragCard = function (x, y) {
    return {type: DRAG_CARD, x, y};
};

const startDrag = function () {
    return {type: START_DRAG};
};

const endDrag = function () {
    return {type: END_DRAG};
};

export {
    reducer as default,
    initialState as irCardsInitialState,
    viewCards,
    closeCards,
    enableCards,
    disableCards,
    shrinkExpandCards,
    nextStep,
    prevStep,
    resetStep,
    dragCard,
    startDrag,
    endDrag
};

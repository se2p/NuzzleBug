const CLOSE_CARDS = 'scratch-gui/ircards/CLOSE_CARDS';
const SHRINK_EXPAND_CARDS = 'scratch-gui/ircards/SHRINK_EXPAND_CARDS';
const VIEW_CARDS = 'scratch-gui/ircards/VIEW_CARDS';
const NEXT_STEP = 'scratch-gui/ircards/NEXT_STEP';
const PREV_STEP = 'scratch-gui/ircards/PREV_STEP';
const DRAG_CARD = 'scratch-gui/ircards/DRAG_CARD';
const START_DRAG = 'scratch-gui/ircards/START_DRAG';
const END_DRAG = 'scratch-gui/ircards/END_DRAG';

const initialState = {
    visible: false,
    content: {},
    step: 0,
    x: 0,
    y: 0,
    expanded: true,
    dragging: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CLOSE_CARDS:
        return Object.assign({}, state, {
            visible: false
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

const shrinkExpandCards = function () {
    return {type: SHRINK_EXPAND_CARDS};
};

const nextStep = function () {
    return {type: NEXT_STEP};
};

const prevStep = function () {
    return {type: PREV_STEP};
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
    shrinkExpandCards,
    nextStep,
    prevStep,
    dragCard,
    startDrag,
    endDrag
};

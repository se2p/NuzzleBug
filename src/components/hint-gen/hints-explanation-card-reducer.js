const CLOSE_CARDS = 'scratch-gui/cards/CLOSE_CARDS';
const SHRINK_EXPAND_CARDS = 'scratch-gui/cards/SHRINK_EXPAND_CARDS';
const VIEW_CARDS = 'scratch-gui/cards/VIEW_CARDS';
const ACTIVATE_DECK = 'scratch-gui/cards/ACTIVATE_DECK';
const DRAG_CARD = 'scratch-gui/cards/DRAG_CARD';
const START_DRAG = 'scratch-gui/cards/START_DRAG';
const END_DRAG = 'scratch-gui/cards/END_DRAG';

const initialState = {
    visible: false,
    content: {
        hints: []
    },
    x: 0,
    y: 0,
    expanded: true,
    dragging: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }

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
    case ACTIVATE_DECK:
        return Object.assign({}, state, {
            activeDeckId: action.activeDeckId,
            step: 0,
            x: 0,
            y: 0,
            expanded: true,
            visible: true
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

export {
    reducer as default,
    initialState as hintsExplanationCardInitialState
};

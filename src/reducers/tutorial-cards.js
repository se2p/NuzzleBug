// Copied from './block-drag'
const BLOCK_DRAG_UPDATE = 'scratch-gui/block-drag/BLOCK_DRAG_UPDATE';

const CLOSE_CARDS = 'scratch-gui/tutorial-cards/CLOSE_CARDS';
const SHRINK_EXPAND_CARDS = 'scratch-gui/tutorial-cards/SHRINK_EXPAND_CARDS';
const VIEW_CARDS = 'scratch-gui/tutorial-cards/VIEW_CARDS';
const NEXT_STEP = 'scratch-gui/tutorial-cards/NEXT_STEP';
const PREV_STEP = 'scratch-gui/tutorial-cards/PREV_STEP';
const DRAG_CARD = 'scratch-gui/tutorial-cards/DRAG_CARD';
const START_DRAG = 'scratch-gui/tutorial-cards/START_DRAG';
const END_DRAG = 'scratch-gui/tutorial-cards/END_DRAG';
const SELECT_TUTORIAL = 'scratch-gui/tutorial-cards/SELECT_TUTORIAL';
const HOME_MENU = 'scratch-gui/tutorial-cards/HOME_MENU';

const initialState = {
    visible: false,
    menu: true,
    tutorial: '',
    step: 0,
    totalSteps: 0,
    x: 0,
    y: 0,
    expanded: true,
    dragging: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CLOSE_CARDS:
        return {
            ...state,
            visible: false
        };
    case BLOCK_DRAG_UPDATE:
        return {
            ...state,
            disabled: true
        };
    case SHRINK_EXPAND_CARDS:
        return {
            ...state,
            expanded: !state.expanded
        };
    case VIEW_CARDS:
        return {
            ...state,
            visible: true
        };
    case NEXT_STEP:
        return {
            ...state,
            step: state.step + 1
        };
    case PREV_STEP:
        if (state.step > 0) {
            return {
                ...state,
                step: state.step - 1
            };
        }
        return state;
    case DRAG_CARD:
        return {
            ...state,
            x: action.x,
            y: action.y
        };
    case START_DRAG:
        return {
            ...state,
            dragging: true
        };
    case END_DRAG:
        return {
            ...state,
            dragging: false
        };
    case SELECT_TUTORIAL:
        return {
            ...state,
            tutorial: action.tutorial,
            totalSteps: action.totalSteps,
            menu: false
        };
    case HOME_MENU:
        return {
            ...state,
            tutorial: '',
            menu: true,
            totalSteps: 0,
            step: 0
        };
    default:
        return state;
    }
};

const viewTutorial = function () {
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

const selectTutorial = function (tutorial, totalSteps) {
    return {type: SELECT_TUTORIAL, tutorial, totalSteps};
};

const homeMenu = function () {
    return {type: HOME_MENU};
};

export {
    reducer as default,
    initialState as tutorialCardsInitialState,
    viewTutorial,
    closeCards,
    shrinkExpandCards,
    nextStep,
    prevStep,
    dragCard,
    startDrag,
    endDrag,
    selectTutorial,
    homeMenu
};

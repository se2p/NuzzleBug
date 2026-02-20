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
const SET_CONTENT = 'scratch-gui/tutorial-cards/SET_CONTENT';
const START_TUTORIAL = 'scratch-gui/tutorial-cards/START_TUTORIAL';
const OPEN_HELP = 'scratch-gui/tutorial-cards/OPEN_HELP';
const SET_TUTORIAL_POINTS = 'scratch-gui/tutorial-cards/SET_TUTORIAL_POINTS';

const initialState = {
    visible: false,
    menu: true,
    tutorial: '',
    step: 0,
    totalSteps: 0,
    x: 0,
    y: 0,
    expanded: true,
    dragging: false,
    contentType: "OVERVIEW",
    tutorialPoints: 3,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CLOSE_CARDS:
        return Object.assign({}, state, {
            visible: false
        });
    case BLOCK_DRAG_UPDATE:
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
    case SELECT_TUTORIAL:
        return Object.assign({}, state, {
            tutorial: action.tutorial,
            totalSteps: action.totalSteps,
            contentType: 'TUTORIAL_SELECTED',
            menu: false
        });
    case HOME_MENU:
        return Object.assign({}, state, {
            tutorial: '',
            menu: true,
            totalSteps: 0,
            step: 0,
            contentType: 'OVERVIEW'
        });
    case SET_CONTENT:
        return Object.assign({}, state, {
            contentType: action.contentType
        });
    case START_TUTORIAL:
        return Object.assign({}, state, {
            contentType: 'DEBUGGING_STEP'
        });
    case OPEN_HELP:
        return Object.assign({}, state, {
            contentType: 'DEBUGGING_HELP'
        });
    case SET_TUTORIAL_POINTS:
        return Object.assign({}, state, {
            tutorialPoints: action.points
        });
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

const setContentType = function (contentType) {
    return {type: SET_CONTENT, contentType};
}

const onStartTutorial = function () {
    return {type: START_TUTORIAL}
}

const onOpenHelp = function () {
    return {type: OPEN_HELP}
}

const setTutorialPoints = function (points) {
    return {type: SET_TUTORIAL_POINTS, points};
}

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
    homeMenu,
    setContentType,
    onStartTutorial,
    onOpenHelp,
    setTutorialPoints
};

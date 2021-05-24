// Copied from './block-drag'
const BLOCK_DRAG_UPDATE = 'scratch-gui/block-drag/BLOCK_DRAG_UPDATE';

const CLOSE_CARDS = 'scratch-gui/tutorial-cards/CLOSE_CARDS';
const ENABLE_CARDS = 'scratch-gui/tutorial-cards/ENABLE_CARDS';
const DISABLE_CARDS = 'scratch-gui/tutorial-cards/DISABLE_CARDS';
const SHRINK_EXPAND_CARDS = 'scratch-gui/tutorial-cards/SHRINK_EXPAND_CARDS';
const VIEW_CARDS = 'scratch-gui/tutorial-cards/VIEW_CARDS';
const NEXT_STEP = 'scratch-gui/tutorial-cards/NEXT_STEP';
const PREV_STEP = 'scratch-gui/tutorial-cards/PREV_STEP';
const RESET_STEP = 'scratch-gui/tutorial-cards/RESET_STEP';
const DRAG_CARD = 'scratch-gui/tutorial-cards/DRAG_CARD';
const START_DRAG = 'scratch-gui/tutorial-cards/START_DRAG';
const END_DRAG = 'scratch-gui/tutorial-cards/END_DRAG';
const SELECT_TUTORIAL = 'scratch-gui/tutorial-cards/SELECT_TUTORIAL';
const HOME_MENU = 'scratch-gui/tutorial-cards/HOME_MENU';
const NEXT_TEST = 'scratch-gui/tutorial-cards/NEXT_TEST';
const NEXT_TUTORIAL_STEP = 'scratch-gui/tutorial-cards/NEXT_TUTORIAL_STEP';

const initialState = {
    visible: false,
    disabled: false,
    menu: true,
    tutorial: '',
    testedStep: -1,
    currentTutorialStep: 0,
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
    case BLOCK_DRAG_UPDATE:
        return Object.assign({}, state, {
            disabled: true
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
    case SELECT_TUTORIAL:
        return Object.assign({}, state, {
            tutorial: action.tutorial,
            totalSteps: action.totalSteps,
            menu: false
        });
    case HOME_MENU:
        return Object.assign({}, state, {
            tutorial: '',
            menu: true,
            totalSteps: 0,
            step: 0,
            currentTutorialStep: 0,
            testedStep: -1
        });
    case NEXT_TEST:
        return Object.assign({}, state, {
            testedStep: state.testedStep + 1
        });
    case NEXT_TUTORIAL_STEP: {
        return state.currentTutorialStep + 1 < state.totalSteps ?
            Object.assign({}, state, {
                currentTutorialStep: state.currentTutorialStep + 1,
                step: state.step + 1
            }) : state;
    }
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

const selectTutorial = function (tutorial, totalSteps) {
    return {type: SELECT_TUTORIAL, tutorial, totalSteps};
};

const homeMenu = function () {
    return {type: HOME_MENU};
};

const testNextStep = function () {
    return {type: NEXT_TEST};
};

const nextTutorialStep = function () {
    return {type: NEXT_TUTORIAL_STEP};
};

export {
    reducer as default,
    initialState as tutorialCardsInitialState,
    viewTutorial,
    closeCards,
    enableCards,
    disableCards,
    shrinkExpandCards,
    nextStep,
    prevStep,
    resetStep,
    dragCard,
    startDrag,
    endDrag,
    selectTutorial,
    homeMenu,
    testNextStep,
    nextTutorialStep
};

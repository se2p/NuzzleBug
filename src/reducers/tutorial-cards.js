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
    if (typeof state === 'undefined') {
        state = initialState;
    }
    const baseState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
    case CLOSE_CARDS:
        baseState.visible = false;
        break;
    case BLOCK_DRAG_UPDATE:
        baseState.disabled = true;
        break;
    case SHRINK_EXPAND_CARDS:
        baseState.expanded = !state.expanded;
        break;
    case VIEW_CARDS:
        baseState.visible = true;
        break;
    case NEXT_STEP:
        baseState.step = state.step + 1;
        break;
    case PREV_STEP:
        if (state.step > 0) {
            baseState.step = state.step - 1;
        }
        break;
    case DRAG_CARD:
        baseState.x = action.x;
        baseState.y = action.y;
        break;
    case START_DRAG:
        baseState.dragging = true;
        break;
    case END_DRAG:
        baseState.dragging = false;
        break;
    case SELECT_TUTORIAL:
        baseState.tutorial = action.tutorial;
        baseState.totalSteps = action.totalSteps;
        baseState.menu = false;
        break;
    case HOME_MENU:
        baseState.tutorial = '';
        baseState.menu = true;
        baseState.totalSteps = 0;
        baseState.step = 0;
        break;
    }
    return baseState;
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

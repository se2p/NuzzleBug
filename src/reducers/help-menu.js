const SELECT_LOCALE = 'scratch-gui/locales/SELECT_LOCALE';

const OPEN = 'scratch-gui/help-menu/OPEN';
const CLOSE = 'scratch-gui/help-menu/CLOSE';
const SHRINK_EXPAND = 'scratch-gui/help-menu/SHRINK_EXPAND';
const START_DRAG = 'scratch-gui/help-menu/START_DRAG';
const DRAG = 'scratch-gui/help-menu/DRAG';
const END_DRAG = 'scratch-gui/help-menu/END_DRAG';
const REPOSITION_HMW = 'scratch-gui/help-menu/REPOSITION_HMW';
const INJECT_HELP_MENU = 'scratch-gui/help-menu/INJECT_HELP_MENU';

const RUN_ACTION = 'scratch-gui/help-menu/RUN_ACTION';
const ACTION_EXECUTED = 'scratch-gui/help-menu/ACTION_EXECUTED';
const SPRITE_SELECTION = 'scratch-gui/help-menu/SPRITE_SELECTION';
const SELECTED_SPRITE = 'scratch-gui/help-menu/SELECTED_SPRITE';
const CHOOSE_CATEGORY = 'scratch-gui/help-menu/CHOOSE_CATEGORY';
const QUESTION_TYPE = 'scratch-gui/help-menu/QUESTION_TYPE';
const FINISHED = 'scratch-gui/help-menu/FINISHED';

const supportedLanguages = ['de', 'en'];

const initialState = {
    visible: false,
    supported: true,
    x: 0,
    y: 0,
    expanded: true,
    executedOnce: true,
    dragging: false,
    runAction: true,
    spriteSelection: false,
    targetName: null,
    chooseCategory: false,
    chooseQuestionType: false,
    finished: false,
    actionExecuted: false,
    injected: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    switch (action.type) {
    case SELECT_LOCALE: {
        const supported = supportedLanguages.includes(action.locale);
        return Object.assign({}, state, {
            supported: supported
        });
    }
    case OPEN:
        return Object.assign({}, state, {
            visible: true
        });
    case CLOSE:
        return Object.assign({}, state, {
            visible: false,
            runAction: true,
            spriteSelection: false,
            targetName: null,
            chooseCategory: false,
            chooseQuestionType: false,
            finished: false,
            actionExecuted: false,
            injected: false
        });
    case SHRINK_EXPAND:
        return Object.assign({}, state, {
            expanded: !state.expanded
        });
    case START_DRAG:
        return Object.assign({}, state, {
            dragging: true
        });
    case DRAG:
        return Object.assign({}, state, {
            x: action.x,
            y: action.y
        });
    case REPOSITION_HMW:
        return Object.assign({}, state, {
            x: action.x,
            y: action.y
        });
    case END_DRAG:
        return Object.assign({}, state, {
            dragging: false
        });
    case RUN_ACTION:
        return Object.assign({}, state, {
            runAction: true,
            spriteSelection: false,
            chooseCategory: false,
            chooseQuestionType: false,
            finished: false
        });
    case SPRITE_SELECTION:
        return Object.assign({}, state, {
            runAction: false,
            spriteSelection: true,
            chooseCategory: false,
            chooseQuestionType: false,
            finished: false,
            actionExecuted: false,
            injected: false
        });
    case SELECTED_SPRITE:
        return Object.assign({}, state, {
            targetName: action.targetName
        });
    case CHOOSE_CATEGORY:
        return Object.assign({}, state, {
            runAction: false,
            spriteSelection: false,
            chooseCategory: true,
            chooseQuestionType: false,
            finished: false,
            visible: false,
            injected: true
        });
    case QUESTION_TYPE:
        return Object.assign({}, state, {
            runAction: false,
            spriteSelection: false,
            chooseCategory: false,
            chooseQuestionType: true,
            finished: false
        });
    case FINISHED:
        return Object.assign({}, state, {
            runAction: false,
            spriteSelection: false,
            chooseCategory: false,
            chooseQuestionType: false,
            finished: true
        });
    case ACTION_EXECUTED:
        return Object.assign({}, state, {
            actionExecuted: true,
            executedOnce: true
        });
    case INJECT_HELP_MENU:
        return Object.assign({}, state, {
            injected: true
        });
    default:
        return state;
    }
};

const openHelpMenu = function () {
    return {type: OPEN};
};

const injectHelpMenu = function () {
    return {type: INJECT_HELP_MENU};
};

const closeHelpMenu = function () {
    return {type: CLOSE};
};

const shrinkExpandHelpMenu = function () {
    return {type: SHRINK_EXPAND};
};

const startDragHelpMenu = function () {
    return {type: START_DRAG};
};

const dragHelpMenu = function (x, y) {
    return {type: DRAG, x, y};
};

const endDragHelpMenu = function () {
    return {type: END_DRAG};
};

const selectSprite = function (targetName) {
    return {type: SELECTED_SPRITE, targetName};
};

const actionExecuted = function (){
    return {type: ACTION_EXECUTED};
};

const startRunAction = function () {
    return {type: RUN_ACTION};
};

const startSpriteSelection = function () {
    return {type: SPRITE_SELECTION};
};

const startChooseCategory = function () {
    return {type: CHOOSE_CATEGORY};
};

const startChooseQuestionType = function () {
    return {type: QUESTION_TYPE};
};

const startFinished = function () {
    return {type: FINISHED};
};

const repositionHelpMenuWindow = function (x, y) {
    return {type: REPOSITION_HMW, x, y};
};

export {
    reducer as default,
    initialState as helpMenuInitialState,
    openHelpMenu,
    closeHelpMenu,
    shrinkExpandHelpMenu,
    startDragHelpMenu,
    dragHelpMenu,
    endDragHelpMenu,
    selectSprite,
    startRunAction,
    startFinished,
    startChooseQuestionType,
    startSpriteSelection,
    startChooseCategory,
    actionExecuted,
    repositionHelpMenuWindow,
    injectHelpMenu
};

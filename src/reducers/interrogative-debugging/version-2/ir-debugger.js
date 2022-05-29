import ScratchBlocks from 'scratch-blocks';

const SET_PROJECT_CHANGED = 'scratch-gui/project-changed/SET_PROJECT_CHANGED';
const SET_RUNNING_STATE = 'scratch-gui/vm-status/SET_RUNNING_STATE';
const SET_PAUSE_STATE = 'scratch-gui/vm-status/SET_PAUSED_STATE';
const SET_OBSERVATION_ACTIVE_STATE = 'scratch-gui/vm-status/SET_OBSERVATION_ACTIVE_STATE';
const SELECT_LOCALE = 'scratch-gui/locales/SELECT_LOCALE';

const ENABLE = 'scratch-gui/ir-debugger/ENABLE';
const DISABLE = 'scratch-gui/ir-debugger/DISABLE';

const OPEN = 'scratch-gui/ir-debugger/OPEN';
const CLOSE = 'scratch-gui/ir-debugger/CLOSE';
const SHRINK_EXPAND = 'scratch-gui/ir-debugger/SHRINK_EXPAND';

const START_DRAG = 'scratch-gui/ir-debugger/START_DRAG';
const DRAG = 'scratch-gui/ir-debugger/DRAG';
const END_DRAG = 'scratch-gui/ir-debugger/END_DRAG';

const supportedLanguages = ['de', 'en'];

const initialState = {
    targetId: null,
    blockId: null,
    visible: false,
    enabled: true,
    supported: true,
    x: 0,
    y: 0,
    expanded: true,
    dragging: false,
    projectRunning: false,
    projectPaused: false,
    observationActive: true
};

const forwardDebuggerEnabled = function (enabled) {
    ScratchBlocks.setInterrogativeDebuggerEnabled(enabled);
};

const forwardDebuggerSupported = function (supported, vm) {
    vm.setInterrogativeDebuggerSupported(supported);
    ScratchBlocks.setInterrogativeDebuggerSupported(supported);
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
        forwardDebuggerEnabled(initialState.enabled);
    }
    switch (action.type) {
    case SET_PROJECT_CHANGED:
        return Object.assign({}, state, initialState, {
            supported: state.supported
        });
    case SET_RUNNING_STATE: {
        return Object.assign({}, state, {
            projectRunning: action.running
        });
    }
    case SET_PAUSE_STATE: {
        return Object.assign({}, state, {
            projectPaused: action.paused
        });
    }
    case SELECT_LOCALE: {
        const supported = supportedLanguages.includes(action.locale);
        return Object.assign({}, state, {
            supported: supported
        });
    }
    case ENABLE:
        forwardDebuggerEnabled(true);
        return Object.assign({}, state, {
            enabled: true
        });
    case DISABLE:
        forwardDebuggerEnabled(false);
        return Object.assign({}, state, {
            enabled: false
        });
    case OPEN:
        return Object.assign({}, state, {
            visible: true,
            targetId: action.targetId,
            blockId: action.blockId,
            costumeUrl: action.costumeUrl
        });
    case CLOSE:
        return Object.assign({}, state, {
            visible: false,
            targetId: null
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
    case END_DRAG:
        return Object.assign({}, state, {
            dragging: false
        });
    case SET_OBSERVATION_ACTIVE_STATE:
        return Object.assign({}, state, {
            observationActive: action.observationActive
        });
    default:
        return state;
    }
};

const enableDebugger = function () {
    return {type: ENABLE};
};

const disableDebugger = function () {
    return {type: DISABLE};
};

const openTargetDebugger = function (targetId, costumeUrl) {
    return {type: OPEN, targetId, costumeUrl};
};

const openBlockDebugger = function (blockId, costumeUrl) {
    return {type: OPEN, blockId, costumeUrl};
};

const closeDebugger = function () {
    return {type: CLOSE};
};

const shrinkExpandDebugger = function () {
    return {type: SHRINK_EXPAND};
};

const startDragDebugger = function () {
    return {type: START_DRAG};
};

const dragDebugger = function (x, y) {
    return {type: DRAG, x, y};
};

const endDragDebugger = function () {
    return {type: END_DRAG};
};

export {
    reducer as default,
    initialState as irDebuggerInitialState,
    enableDebugger,
    disableDebugger,
    openTargetDebugger,
    openBlockDebugger,
    closeDebugger,
    shrinkExpandDebugger,
    startDragDebugger,
    dragDebugger,
    endDragDebugger,
    forwardDebuggerEnabled,
    forwardDebuggerSupported
};

import ScratchBlocks from 'scratch-blocks';

const SET_PROJECT_CHANGED = 'scratch-gui/project-changed/SET_PROJECT_CHANGED';
const BLOCK_DRAG_UPDATE = 'scratch-gui/block-drag/BLOCK_DRAG_UPDATE';
const SET_RUNNING_STATE = 'scratch-gui/vm-status/SET_RUNNING_STATE';
const SET_PAUSE_STATE = 'scratch-gui/vm-status/SET_PAUSED_STATE';
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
    enabled: false,
    supported: true,
    x: 0,
    y: 0,
    expanded: true,
    dragging: false,
    projectRunning: false,
    projectPaused: false
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
    }
    switch (action.type) {
    case SET_PROJECT_CHANGED:
        forwardDebuggerEnabled(initialState.enabled);
        return Object.assign({}, state, initialState, {
            supported: state.supported
        });
    case BLOCK_DRAG_UPDATE:
        forwardDebuggerEnabled(false);
        return Object.assign({}, state, {
            enabled: false
        });
    case SET_RUNNING_STATE: {
        const enabled = !action.running || state.projectPaused;
        forwardDebuggerEnabled(enabled);
        return Object.assign({}, state, {
            projectRunning: action.running,
            enabled: enabled
        });
    }
    case SET_PAUSE_STATE: {
        const enabled = action.paused || !state.projectRunning;
        forwardDebuggerEnabled(enabled);
        return Object.assign({}, state, {
            projectPaused: action.paused,
            enabled: enabled
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

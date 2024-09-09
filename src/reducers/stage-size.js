import {STAGE_DISPLAY_SIZES} from '../lib/layout-constants.js';

const SET_STAGE_SIZE = 'scratch-gui/StageSize/SET_STAGE_SIZE';
const SET_CANVAS_COORDINATES = 'scratch-gui/StageSize/SET_CANVAS_COORDINATES';

const initialState = {
    stageSize: STAGE_DISPLAY_SIZES.large,
    canvasLeft: 0,
    canvasTop: 0
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {

    case SET_STAGE_SIZE:
        return Object.assign({}, state, {
            stageSize: action.stageSize
        });

    case SET_CANVAS_COORDINATES:
        return Object.assign({}, state, {
            canvasLeft: action.canvasLeft,
            canvasTop: action.canvasTop
        });

    default:
        return state;
    }
};

const setStageSize = function (stageSize) {
    return {
        type: SET_STAGE_SIZE,
        stageSize: stageSize
    };
};

const setCanvasCoordinates = function (canvasLeft, canvasTop) {
    return {
        type: SET_CANVAS_COORDINATES,
        canvasLeft: canvasLeft,
        canvasTop: canvasTop
    };
};

export {
    reducer as default,
    initialState as stageSizeInitialState,
    setStageSize,
    setCanvasCoordinates
};

import {func} from "prop-types";
import testTutorial from "../components/debuggingTutorial/test/Tree.js";

const NEXT_STEP = 'scratch-gui/debugging-tutorial-cards/NEXT_STEP';
const HELP = 'scratch-gui/debugging-tutorial-cards/HELP';

const initialState = {
    step: "step1",
    tutorial: testTutorial,
    helpVisible: false,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    const baseState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        /*case CLOSE:
            baseState.visible = false;
            console.log("CLOSE_DEBUG_CARDS_TRUE")
            break;
        case VIEW_CARDS:
            baseState.visible = !baseState.visible;
            console.log("VIEW_DEBUG_CARDS_TRUE")
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
            break;*/
        case NEXT_STEP:
            if (baseState.tutorial !== null) {
                baseState.step = baseState.tutorial[baseState.step]["next"]; //TODO WHAT IF END IS REACHED?
            }
            break;
        case HELP:
            if (baseState.tutorial !== null) {
                baseState.helpVisible = !baseState.helpVisible;
            }
            break;
    }
    return baseState;
};

const checkAnswer = function () {
    return {type: NEXT_STEP};
}

const onHelp = function () {
    return {type: HELP};
}

export {
    reducer as default,
    initialState as debuggingTutorialInitialState,
    checkAnswer,
    onHelp,
};

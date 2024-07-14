import {func} from "prop-types";
import testTutorial from "../components/debuggingTutorial/test/Tree.js";


const START_TUTORIAL = 'scratch-gui/debugging-tutorial-cards/START_TUTORIAL';

const initialState = {
    step: "step1",
    isOverviewVisible: true,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    const baseState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case START_TUTORIAL:
            baseState.isOverviewVisible = false;
            break;
    }
    return baseState;
};

const onStartTutorial = function () {
    return {type: START_TUTORIAL};
}

export {
    reducer as default,
    initialState as debuggingTutorialOverviewInitialState,
    onStartTutorial,
};

const INCREASE_STEP = 'scratch-gui/debugging-tutorial-cards/INCREASE_STEP';
const ERROR_CLICKED = 'scratch-gui/debugging-tutorial-cards/ERROR_CLICKED';

const initialState = {
    step: "step1",
    isErrorInfoVisible: false,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    const baseState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case INCREASE_STEP:
            baseState.step = "step" + (parseInt(baseState.step.charAt(4)) + 1); //step1 -> step2
            break;
        case ERROR_CLICKED:
            baseState.isErrorInfoVisible = !baseState.isErrorInfoVisible;
            break;
    }
    return baseState;
};

const increaseStep = function () {
    return {type: INCREASE_STEP};
}

const errorClicked = function () {
    return {type: ERROR_CLICKED};
}

export {
    reducer as default,
    initialState as debuggingTutorialStepInitialState,
    increaseStep,
    errorClicked,
};

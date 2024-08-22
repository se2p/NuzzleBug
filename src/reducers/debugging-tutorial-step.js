const RESET_STEP = 'scratch-gui/debugging-tutorial-cards/RESET_STEP';
const ERROR_CLICKED = 'scratch-gui/debugging-tutorial-cards/ERROR_CLICKED';
const UPDATE_TEST_RESULTS = 'scratch-gui/debugging-tutorial-cards/UPDATE_TEST_RESULTS';
const TEST_DETAILS = 'scratch-gui/debugging-tutorial-cards/TEST_DETAILS';
const SET_LOADING = 'scratch-gui/debugging-tutorial-cards/SET_LOADING';
const SET_LOADING_PROJECT = 'scratch-gui/debugging-tutorial-cards/SET_LOADING_PROJECT';



const initialState = {
    step: 0,
    isErrorInfoVisible: false,
    testResults: null,
    showTestDetail: false,
    isLoading: false,
    projectLoadingState: null,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    const baseState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case ERROR_CLICKED:
            baseState.isErrorInfoVisible = !baseState.isErrorInfoVisible;
            break;
        case UPDATE_TEST_RESULTS:
            baseState.testResults = action.results;
            break;
        case TEST_DETAILS:
            baseState.showTestDetail = !baseState.showTestDetail;
            break;
        case SET_LOADING:
            baseState.isLoading = action.isLoading;
            break;
        case SET_LOADING_PROJECT:
            baseState.projectLoadingState = action.loadingType;
            break;
        case RESET_STEP:
            baseState.isErrorInfoVisible = false;
            baseState.showTestDetail = false;
            baseState.testResults = null;
            baseState.projectLoadingState = null;
            baseState.isLoading = false;
            break;
    }
    return baseState;
};

const resetStep = function () {
    return {type: RESET_STEP};
}

const errorClicked = function () {
    return {type: ERROR_CLICKED};
}

const updateTestResults = function (results) {
    return {type: UPDATE_TEST_RESULTS, results};
}

const onTestDetails = function () {
    return {type: TEST_DETAILS};
}

const setLoading = function (isLoading) {
    return {type: SET_LOADING, isLoading};
}

const setLoadingProject = function (loadingType) {
    return {type: SET_LOADING_PROJECT, loadingType};
}

export {
    reducer as default,
    initialState as debuggingTutorialStepInitialState,
    resetStep,
    errorClicked,
    updateTestResults,
    onTestDetails,
    setLoading,
    setLoadingProject,
};

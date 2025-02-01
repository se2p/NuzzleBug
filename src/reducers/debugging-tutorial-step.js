const RESET_STEP = 'scratch-gui/debugging-tutorial-cards/RESET_STEP';
const ERROR_CLICKED = 'scratch-gui/debugging-tutorial-cards/ERROR_CLICKED';
const UPDATE_TEST_RESULTS = 'scratch-gui/debugging-tutorial-cards/UPDATE_TEST_RESULTS';
const TEST_DETAILS = 'scratch-gui/debugging-tutorial-cards/TEST_DETAILS';
const SET_LOADING = 'scratch-gui/debugging-tutorial-cards/SET_LOADING';
const SET_LOADING_PROJECT = 'scratch-gui/debugging-tutorial-cards/SET_LOADING_PROJECT';
const SET_TUTORIAL = 'scratch-gui/debugging-tutorial-cards/SET_TUTORIAL';
const SET_CONTENT_TYPE = 'scratch-gui/debugging-tutorial-cards/SET_CONTENT_TYPE';
const SET_RESPONSE = 'scratch-gui/debugging-tutorial-cards/SET_RESPONSE';
const SET_PAGE = 'scratch-gui/debugging-tutorial-cards/SET_PAGE';
const SHOW_QUICK_HANDLE = 'scratch-gui/debugging-tutorial-cards/SHOW_QUICK_HANDLE';


const RESPONSE_START_VALUE = 'scratch-gui/debugging-tutorial-cards/RESPONSE_START'

const initialState = {
    step: 0,
    isErrorInfoVisible: false,
    testResults: null,
    showTestDetail: false,
    isLoading: false,
    projectLoadingState: null,
    lastTutorial: null,
    contentType: "DETAILS",
    responseType: RESPONSE_START_VALUE,
    page: "OVERVIEW",
    isShowingQuickHandle: false,
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    const baseState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case ERROR_CLICKED:
            baseState.isErrorInfoVisible = true;
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
        case SET_TUTORIAL:
            baseState.lastTutorial = action.tutorial;
            break;
        case SET_CONTENT_TYPE:
            baseState.contentType = action.contentType;
            break;
        case SET_RESPONSE:
            baseState.responseType = action.responseType;
            break;
        case SET_PAGE:
            baseState.page = action.page;
            break;
        case SHOW_QUICK_HANDLE:
            baseState.isShowingQuickHandle = true;
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

const showErrorInfo = function () {
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

const setLastTutorial = function (tutorial) {
    return {type: SET_TUTORIAL, tutorial};
}

const setContentType = function (contentType) {
    return {type: SET_CONTENT_TYPE, contentType};
}

const setResponseType = function (responseType) {
    return {type: SET_RESPONSE, responseType};
}

const setCurPage = function (page) {
    return {type: SET_PAGE, page};
}

const showQuickHandle = function () {
    return {type: SHOW_QUICK_HANDLE};
}

export {
    reducer as default,
    initialState as debuggingTutorialStepInitialState,
    resetStep,
    showErrorInfo,
    updateTestResults,
    onTestDetails,
    setLoading,
    setLoadingProject,
    setLastTutorial,
    setContentType,
    setResponseType,
    setCurPage,
    showQuickHandle,
};

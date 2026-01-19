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
const SET_TEST_DETAILS = 'scratch-gui/debugging-tutorial-cards/SET_TEST_DETAILS';
const SET_HELP_TYPE = 'scratch-gui/debugging-tutorial-cards/SET_HELP_TYPE';
const SET_CODE_RESET_POINT = 'scratch-gui/debugging-tutorial-cards/SET_CODE_RESET_POINT';
const SET_LAST_TESTED_PROJECT = 'scratch-gui/debugging-tutorial-cards/SET_LAST_TESTED_PROJECT';
const SET_HAS_CODE_UPDATED = 'scratch-gui/debugging-tutorial-cards/SET_HAS_CODE_UPDATED';
const SET_TEST_PAGE_INDEX = 'scratch-gui/debugging-tutorial-cards/SET_TEST_PAGE_INDEX';
const SET_SELECTED_SPRITE = 'scratch-gui/debugging-tutorial-cards/SET_SELECTED_SPRITE';
const SET_CUR_TEST_RUN = 'scratch-gui/debugging-tutorial-cards/SET_CUR_TEST_RUN';

import {PAGE_OVERVIEW} from '../components/debuggingTutorial/tutorial-constants.jsx';


const RESPONSE_START_VALUE = 'scratch-gui/debugging-tutorial-cards/RESPONSE_START';

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
    page: PAGE_OVERVIEW,
    isShowingQuickHandle: false,
    curTestDetails: "",
    helpType: "",
    codeResetPoint: null,
    lastTestedProject: null,
    hasUpdated: false,
    testPageIndex: 0,
    selectedSprite: null,
    curTestRuns: 0,
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
        case SET_TEST_DETAILS:
            baseState.curTestDetails = action.testId;
            break;
        case SET_HELP_TYPE:
            baseState.helpType = action.helpType;
            break;
        case SET_CODE_RESET_POINT:
            baseState.codeResetPoint = action.project;
            break;
        case SET_LAST_TESTED_PROJECT:
            baseState.lastTestedProject = action.newProject;
            break;
        case SET_HAS_CODE_UPDATED:
            baseState.hasUpdated = action.hasUpdated;
            break;
        case SET_TEST_PAGE_INDEX:
            baseState.testPageIndex = action.index;
            break;
        case SET_SELECTED_SPRITE:
            baseState.selectedSprite = action.key;
            break;
        case SET_CUR_TEST_RUN:
            baseState.curTestRuns = action.runs;
            break;
        case RESET_STEP:
            baseState.isErrorInfoVisible = false;
            baseState.showTestDetail = false;
            baseState.testResults = null;
            baseState.projectLoadingState = null;
            baseState.isLoading = false;
            baseState.curTestDetails = "";
            baseState.page = PAGE_OVERVIEW;
            baseState.responseType = RESPONSE_START_VALUE;
            baseState.contentType = "DETAILS";
            baseState.isShowingQuickHandle = false;
            baseState.helpType = "";
            baseState.codeResetPoint = null;
            baseState.lastTestedProject = null;
            baseState.hasUpdated = false;
            baseState.testPageIndex = 0;
            baseState.selectedSprite = null;
            baseState.curTestRuns = 0;
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

const setCurTestDetails = function (testId) {
    return {type: SET_TEST_DETAILS, testId};
}

const setHelpType = function (helpType) {
    return {type: SET_HELP_TYPE, helpType};
}

const setCodeResetPoint = function (project) {
    return {type: SET_CODE_RESET_POINT, project};
}

const setLastTestedProject = function (newProject) {
    return {type: SET_LAST_TESTED_PROJECT, newProject};
}

const setHasCodeUpdated = function (hasUpdated) {
    return {type: SET_HAS_CODE_UPDATED, hasUpdated};
}

const setTestPageIndex = function (index) {
    return {type: SET_TEST_PAGE_INDEX, index};
}

const setSelectedSprite = function (key) {
    return {type: SET_SELECTED_SPRITE, key};
}

const setCurTestRuns = function (runs) {
    return {type: SET_CUR_TEST_RUN, runs};
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
    setCurTestDetails,
    setHelpType,
    setCodeResetPoint,
    setLastTestedProject,
    setHasCodeUpdated,
    setTestPageIndex,
    setSelectedSprite,
    setCurTestRuns,
};

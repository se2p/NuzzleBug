const SHOW_INTERFACE = 'scratch-gui/bbt/SHOW_INTERFACE';
const HIDE_INTERFACE = 'scratch-gui/bbt/HIDE_INTERFACE';
const TOGGLE_EXAMPLES_WINDOW_VISIBILITY = 'scratch-gui/bbt/TOGGLE_EXAMPLES_WINDOW_VISIBILITY';
const TOGGLE_BATCH_EVALUATION_WINDOW_VISIBILITY = 'scratch-gui/bbt/TOGGLE_BATCH_EVALUATION_WINDOW_VISIBILITY';
const TOGGLE_COORDINATES_TOOLTIP_VISIBILITY = 'scratch-gui/bbt/TOGGLE_COORDINATES_TOOLTIP_VISIBILITY';
const SET_RUN_ALL_TESTS_ENABLED = 'scratch-gui/bbt/SET_RUN_ALL_TESTS_ENABLED';
const SET_ACTIVE_BATCH_EVALUATION_FILE_ID = 'scratch-gui/bbt/SET_ACTIVE_BATCH_EVALUATION_FILE_ID';

const REPLACE_BBT_TESTS = 'scratch-gui/bbt/REPLACE_BBT_TESTS';
const ADD_WHISKER_TEST = 'scratch-gui/bbt/ADD_WHISKER_TEST';

const SET_REQUEST_TOOLBOX_UPDATE_REMOTELY = 'scratch-gui/bbt/SET_REQUEST_TOOLBOX_UPDATE_REMOTELY';

const SET_TEST_STORE = 'scratch-gui/bbt/SET_TEST_STORE';
const SET_BATCH_EVAL_PROJECT_FILES = 'scratch-gui/bbt/SET_BATCH_EVAL_PROJECT_FILES';

const SET_TEST_STATUS = 'scratch-gui/bbt/SET_TEST_STATUS';
const CLEAR_TEST_STATUS = 'scratch-gui/bbt/CLEAR_TEST_STATUS';
const CLEAR_ALL_TEST_STATUS = 'scratch-gui/bbt/CLEAR_ALL_TEST_STATUS';

const SET_BATCH_EVAL_TEST_STATUS = 'scratch-gui/bbt/SET_BATCH_EVAL_TEST_STATUS';
const CLEAR_BATCH_EVAL_TEST_STATUS = 'scratch-gui/bbt/CLEAR_BATCH_EVAL_TEST_STATUS';
const CLEAR_ALL_BATCH_EVAL_TEST_STATUS = 'scratch-gui/bbt/CLEAR_ALL_BATCH_EVAL_TEST_STATUS';

const ADD_ERROR = 'scratch-gui/bbt/ADD_ERROR';

const SHOW_INFO_PANEL = 'scratch-gui/bbt/SHOW_INFO_PANEL';
const HIDE_INFO_PANEL = 'scratch-gui/bbt/HIDE_INFO_PANEL';
const INCREMENT_INFO_PANEL_PASSED_TESTS = 'scratch-gui/bbt/INCREMENT_INFO_PANEL_PASSED_TESTS';
const INCREMENT_INFO_PANEL_FAILED_TESTS = 'scratch-gui/bbt/INCREMENT_INFO_PANEL_FAILED_TESTS';
const SET_INFO_PANEL_TOTAL_TESTS = 'scratch-gui/bbt/SET_INFO_PANEL_TOTAL_TESTS';
const RESET_INFO_PANEL_STATUS = 'scratch-gui/bbt/RESET_INFO_PANEL_STATUS';

const initialState = {
    interfaceVisible: false,
    examplesWindowVisible: false,
    batchEvaluationWindowVisible: false,
    coordinatesTooltipVisible: false,

    requestToolboxUpdateRemotely: false,

    runAllTestsEnabled: true,

    activeBatchEvaluationFileId: -1,

    infoPanelVisible: false,
    infoPanelPassedTests: 0,
    infoPanelFailedTests: 0,
    infoPanelTotalTests: 0,


    /**
     * A Block-Based Test status during batch evaluation.
     *
     * @typedef {Object} BBTTestStatus
     * @property {string} id - Unique ID of the Block-Based Test.
     * @property {'fail'|'pass'|'none'|'running'} status - Status of the Block-Based Test.
     */

    /**
     *  @type {Object.<number, BBTTestStatus>} - Contains the status of the batch evaluation.
     *  Keys are the ID of the BatchEvalProjectFile, BBTTestStatus objects are the values.
     *
     *  EXAMPLE:
     *      0: {
     *             '123asd123asd': 'fail',
     *             '234dsfjsdkjf': 'fail'
     *         }
     */
    bbtBatchEvalStatus: {},

    /**
     * The global test store, contains information about the global test suite.
     */
    testStore: {
        globalVariables: [],
        targetsWithTests: {},
        testInfos: []
    },

    /**
     * Batch evaluation project file entry.
     *
     * @typedef {Object} BatchEvalProjectFile
     * @property {number} id - The ID of a project file.
     * @property {string} path - The filename of a project file.
     */

    /**
     *  @type {Array.<BatchEvalProjectFile>} - Contains the Batch evaluation project files.
     *
     *  EXAMPLE:
     *     [{id: 0, path: 'somefile.sb3'}]
     */
    batchEvalProjectFiles: [],

    /**
     * A Block-Based Test.
     *
     * @typedef {Object} BBTTest
     * @property {string} id - Unique ID of a test, also equal to the hat block ID of that test.
     * @property {'bbt'} type - Indicates the type of test.
     * @property {string} name - The name of a test, provided by the user through the input field of the hat block.
     * @property {string} description - The description of a test,
     * provided by the user through a comment on the hat block.
     * @property {'fail'|'pass'|'none'|'running'} status - The status of a test.
     * @property {Object.<string, string>} errors - The recorded errors of a test.
     * The keys represent the ID of the block in which the error occurred,
     * the value references an BBTErrorType as defined in the VM.
     * @property {string} containingSpriteId - The ID of the containing sprite.
     */

    /**
     *  @type {Object.<string, BBTTest>} - Contains the Block-Based tests.
     *  Keys are the ID, BBTTest objects are the values.
     *
     *  EXAMPLE:
     *     '123asd123asd' : {
     *         id: '123asd123asd', // (= hatBlockID)
     *         type: 'bbt',
     *         name: 'Test 1',
     *         description: 'Lorem ipsum dolor sit amet, consetetur.',
     *         status: 'fail', // ('pass', 'none', 'running')
     *         errors: {
     *             ']#_;aQ[h;b^piMF?0r}[': 'ASD_TYPE',
     *             '){yrz/KrqsT*!QE`f_M5': 'ASD_TYPE',
     *             'd;+3/rS:,60ccJ$PUc`;': 'ASD_TYPE'
     *         },
     *         containingSpriteId: '987dsa987dsa'
     *     }
     */
    bbtTests: {},

    /**
     * A Whisker test.
     *
     * @typedef {Object} WhiskerTest
     * @property {string} id - Unique ID of a test.
     * @property {'whisker'} type - Indicates the type of test.
     * @property {string} name - The name of a test.
     * @property {string} description - The description of a test.
     * @property {'fail'|'pass'|'none'|'running'} status - The status of a test.
     * @property {Object.<string, 'WHISKER_TEST_ERROR'>} errors - The recorded errors of a test.
     * The keys represent the ID of the block in which the error occurred.
     * @property {() => void} test - The asynchronous function that is the actual Whisker test.
     */

    /**
     *  @type {Object.<string, WhiskerTest>} - Contains the Whisker tests.
     *  Keys are the ID, WhiskerTest objects are the values.
     *
     * EXAMPLE:
     *     'whisker-0': {
     *         id: 'whisker-0',
     *         type: 'whisker',
     *         name: 'Test 1',
     *         description: 'Lorem ipsum dolor sit amet, consetetur.',
     *         status: 'fail',
     *         errors: {
     *             ']#_;aQ[h;b^piMF?0r}[': 'WHISKER_TEST_ERROR',
     *             '){yrz/KrqsT*!QE`f_M5': 'WHISKER_TEST_ERROR',
     *             'd;+3/rS:,60ccJ$PUc`;': 'WHISKER_TEST_ERROR'
     *         },
     *         test: async () => {alert('hardcoded test started')}
     *     }
     */
    whiskerTests: {}
};

const reducer = function (state, action) {

    if (typeof state === 'undefined') state = initialState;

    switch (action.type) {

    case SHOW_INTERFACE:
        return Object.assign({}, state, {
            interfaceVisible: true
        });

    case HIDE_INTERFACE:
        return Object.assign({}, state, {
            interfaceVisible: false
        });

    case TOGGLE_EXAMPLES_WINDOW_VISIBILITY:
        return Object.assign({}, state, {
            examplesWindowVisible: !state.examplesWindowVisible
        });

    case TOGGLE_BATCH_EVALUATION_WINDOW_VISIBILITY:
        return Object.assign({}, state, {
            batchEvaluationWindowVisible: !state.batchEvaluationWindowVisible
        });

    case TOGGLE_COORDINATES_TOOLTIP_VISIBILITY:
        return Object.assign({}, state, {
            coordinatesTooltipVisible: !state.coordinatesTooltipVisible
        });

    case SET_RUN_ALL_TESTS_ENABLED:
        return Object.assign({}, state, {
            runAllTestsEnabled: action.payload
        });

    case SET_ACTIVE_BATCH_EVALUATION_FILE_ID:
        return Object.assign({}, state, {
            activeBatchEvaluationFileId: action.payload
        });

    case SET_REQUEST_TOOLBOX_UPDATE_REMOTELY:
        return Object.assign({}, state, {
            requestToolboxUpdateRemotely: action.payload
        });

    case REPLACE_BBT_TESTS: {
        const newBBTTests = action.payload;

        for (const testID of Object.keys(newBBTTests)) {
            if (testID in state.bbtTests) {
                newBBTTests[testID].status = state.bbtTests[testID].status;
                newBBTTests[testID].errors = state.bbtTests[testID].errors;
            } else {
                newBBTTests[testID].status = 'none';
                newBBTTests[testID].errors = {};
            }
        }

        return Object.assign({}, state, {
            bbtTests: newBBTTests
        });
    }

    case ADD_WHISKER_TEST: {
        const testID = `whisker-${Object.keys(state.whiskerTests).length}`;

        return Object.assign({}, state, {
            whiskerTests: {
                ...state.whiskerTests,
                [testID]: {
                    id: testID,
                    status: 'none',
                    errors: {},
                    ...action.payload
                }
            }
        });
    }

    case SET_TEST_STATUS: {
        const testID = action.payload[0];
        const newStatus = action.payload[1];

        if (testID.startsWith('whisker-')) {
            return Object.assign({}, state, {
                whiskerTests: {
                    ...state.whiskerTests,
                    [testID]: {...state.whiskerTests[testID], status: newStatus}
                }
            });
        }

        return Object.assign({}, state, {
            bbtTests: {
                ...state.bbtTests,
                [testID]: {...state.bbtTests[testID], status: newStatus}
            }
        });
    }

    case CLEAR_TEST_STATUS: {
        const testID = action.payload[0];
        const newStatus = action.payload[1];

        if (testID.toString()
            .startsWith('whisker-')) {
            return Object.assign({}, state, {
                whiskerTests: {
                    ...state.whiskerTests,
                    [testID]: {...state.whiskerTests[testID], status: newStatus, errors: {}}
                }
            });
        }

        return Object.assign({}, state, {
            bbtTests: {
                ...state.bbtTests,
                [testID]: {...state.bbtTests[testID], status: newStatus, errors: {}}
            }
        });
    }

    case CLEAR_ALL_TEST_STATUS: {
        const newBBTTests = Object.assign({}, state.bbtTests); // copy old bbtTests (SHALLOW copy!)
        const newWhiskerTests = Object.assign({}, state.whiskerTests); // copy old whiskerTests (SHALLOW copy!)

        for (const testID of Object.keys(state.bbtTests)) {
            newBBTTests[testID] = {
                ...newBBTTests[testID],
                status: 'none',
                errors: {}
            };
        }

        for (const testID of Object.keys(state.whiskerTests)) {
            newWhiskerTests[testID] = {
                ...newWhiskerTests[testID],
                status: 'none',
                errors: {}
            };
        }

        return Object.assign({}, state, {
            bbtTests: newBBTTests,
            whiskerTests: newWhiskerTests
        });
    }

    case SET_BATCH_EVAL_TEST_STATUS: {
        const fileID = action.payload[0];
        const testID = action.payload[1];
        const newStatus = action.payload[2];

        return Object.assign({}, state, {
            bbtBatchEvalStatus: {
                ...state.bbtBatchEvalStatus,
                [fileID]: {...state.bbtBatchEvalStatus[fileID], [testID]: newStatus}
            }
        });
    }

    case SET_TEST_STORE: {
        return Object.assign({}, state, {
            testStore: action.payload
        });
    }

    case SET_BATCH_EVAL_PROJECT_FILES: {
        return Object.assign({}, state, {
            batchEvalProjectFiles: action.payload
        });
    }

    case CLEAR_BATCH_EVAL_TEST_STATUS: {
        const fileID = action.payload;

        return Object.assign({}, state, {
            bbtBatchEvalStatus: {
                ...state.bbtBatchEvalStatus,
                [fileID]: {}
            }
        });
    }

    case CLEAR_ALL_BATCH_EVAL_TEST_STATUS: {
        return Object.assign({}, state, {
            bbtBatchEvalStatus: {}
        });
    }

    case ADD_ERROR: {
        const testID = action.payload.testId;
        const blockID = action.payload.blockId;

        if (testID.startsWith('whisker-')) {
            return Object.assign({}, state, {
                whiskerTests: {
                    ...state.whiskerTests,
                    [testID]: {
                        ...state.whiskerTests[testID],
                        errors: {...state.whiskerTests[testID].errors, [blockID]: action.payload}
                    }
                }
            });
        }

        return Object.assign({}, state, {
            bbtTests: {
                ...state.bbtTests,
                [testID]: {
                    ...state.bbtTests[testID],
                    errors: {...state.bbtTests[testID].errors, [blockID]: action.payload}
                }
            }
        });
    }

    case SHOW_INFO_PANEL: {
        return Object.assign({}, state, {
            infoPanelVisible: true
        });
    }

    case HIDE_INFO_PANEL: {
        return Object.assign({}, state, {
            infoPanelVisible: false
        });
    }

    case RESET_INFO_PANEL_STATUS: {
        return Object.assign({}, state, {
            infoPanelVisible: false,
            infoPanelPassedTests: 0,
            infoPanelFailedTests: 0
        });
    }

    case INCREMENT_INFO_PANEL_PASSED_TESTS: {
        return Object.assign({}, state, {
            infoPanelPassedTests: state.infoPanelPassedTests + 1
        });
    }

    case INCREMENT_INFO_PANEL_FAILED_TESTS: {
        return Object.assign({}, state, {
            infoPanelFailedTests: state.infoPanelFailedTests + 1
        });
    }

    case SET_INFO_PANEL_TOTAL_TESTS: {
        return Object.assign({}, state, {
            infoPanelTotalTests: action.payload
        });
    }

    default:
        return state;
    }
};

const showInterface = function () {
    return {type: SHOW_INTERFACE};
};

const hideInterface = function () {
    return {type: HIDE_INTERFACE};
};

const toggleExamplesWindowVisibility = function () {
    return {type: TOGGLE_EXAMPLES_WINDOW_VISIBILITY};
};

const toggleBatchEvaluationWindowVisibility = function () {
    return {type: TOGGLE_BATCH_EVALUATION_WINDOW_VISIBILITY};
};

const toggleCoordinatesTooltipVisibility = function () {
    return {type: TOGGLE_COORDINATES_TOOLTIP_VISIBILITY};
};

const setRequestToolboxUpdateRemotely = function (newValue) {
    return {
        type: SET_REQUEST_TOOLBOX_UPDATE_REMOTELY,
        payload: newValue
    };
};

const setTestStore = function (newTestStore) {
    return {
        type: SET_TEST_STORE,
        payload: newTestStore
    };
};

const setBatchEvalProjectFiles = function (newProjectFilesArray) {
    return {
        type: SET_BATCH_EVAL_PROJECT_FILES,
        payload: newProjectFilesArray
    };
};

const replaceBBTTests = function (newTests) {
    return {
        type: REPLACE_BBT_TESTS,
        payload: newTests
    };
};

const addWhiskerTest = function (newTest) {
    return {
        type: ADD_WHISKER_TEST,
        payload: newTest
    };
};

const setTestStatus = function (testID, newStatus) {
    return {
        type: SET_TEST_STATUS,
        payload: [testID, newStatus]
    };
};

const clearTestStatus = function (testID, newStatus) {
    return {
        type: CLEAR_TEST_STATUS,
        payload: [testID, newStatus]
    };
};

const clearAllTestStatus = function () {
    return {
        type: CLEAR_ALL_TEST_STATUS
    };
};

const setBatchEvalTestStatus = function (fileID, testID, newStatus) {
    return {
        type: SET_BATCH_EVAL_TEST_STATUS,
        payload: [fileID, testID, newStatus]
    };
};

const clearBatchEvalTestStatus = function (fileID) {
    return {
        type: CLEAR_BATCH_EVAL_TEST_STATUS,
        payload: fileID
    };
};

const clearAllBatchEvalTestStatus = function () {
    return {
        type: CLEAR_ALL_BATCH_EVAL_TEST_STATUS
    };
};

const addError = function (errorObject) {
    return {
        type: ADD_ERROR,
        payload: errorObject
    };
};

const setRunAllTestsEnabled = function (value) {
    return {
        type: SET_RUN_ALL_TESTS_ENABLED,
        payload: value
    };
};

const setActiveBatchEvaluationFileId = function (fileId) {
    return {
        type: SET_ACTIVE_BATCH_EVALUATION_FILE_ID,
        payload: fileId
    };
};

const showInfoPanel = function () {
    return {
        type: SHOW_INFO_PANEL
    };
};

const resetInfoPanelStatus = function () {
    return {
        type: RESET_INFO_PANEL_STATUS
    };
};

const incrementInfoPanelPassedTests = function () {
    return {
        type: INCREMENT_INFO_PANEL_PASSED_TESTS
    };
};

const incrementInfoPanelFailedTests = function () {
    return {
        type: INCREMENT_INFO_PANEL_FAILED_TESTS
    };
};

const setTotalTestsForInfoPanel = function (num) {
    return {
        type: SET_INFO_PANEL_TOTAL_TESTS,
        payload: num
    };
};


export {
    reducer as default,
    initialState as blockBasedTestingInitialState,

    showInterface,
    hideInterface,
    toggleExamplesWindowVisibility,
    toggleBatchEvaluationWindowVisibility,
    toggleCoordinatesTooltipVisibility,
    setRunAllTestsEnabled,

    replaceBBTTests,
    addWhiskerTest,

    setRequestToolboxUpdateRemotely,
    setTestStore,
    setBatchEvalProjectFiles,
    setActiveBatchEvaluationFileId,

    setTestStatus,
    clearTestStatus,
    clearAllTestStatus,

    setBatchEvalTestStatus,
    clearBatchEvalTestStatus,
    clearAllBatchEvalTestStatus,

    addError,
    showInfoPanel,
    resetInfoPanelStatus,
    incrementInfoPanelPassedTests,
    incrementInfoPanelFailedTests,
    setTotalTestsForInfoPanel
};

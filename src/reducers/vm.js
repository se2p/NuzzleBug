import VM from 'scratch-vm';
import storage from '../lib/storage';
import {experimentData} from 'scratch-vm/src/util/logging.js';

const SET_VM = 'scratch-gui/vm/SET_VM';
const defaultVM = new VM();
experimentData.baseUrl = process.env.SCRATCHLOG_BASE_URL;
defaultVM.attachStorage(storage);
const initialState = defaultVM;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_VM:
        return action.vm;
    default:
        return state;
    }
};
const setVM = function (vm) {
    return {
        type: SET_VM,
        vm: vm
    };
};

export {
    reducer as default,
    initialState as vmInitialState,
    setVM
};

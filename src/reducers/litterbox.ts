enum LitterBoxInterfaceActionType {
    SHOW_INTERFACE = 'scratch-gui/litterbox/SHOW_INTERFACE',
    HIDE_INTERFACE = 'scratch-gui/litterbox/HIDE_INTERFACE',
    TOGGLE_INTERFACE = 'scratch-gui/litterbox/TOGGLE_INTERFACE'
}

interface LitterBoxInterfaceAction {
    type: LitterBoxInterfaceActionType;
}

export interface LitterBoxState {
    interfaceVisible: boolean;
}

const initialState: LitterBoxState = {
    // todo(fein): only for development, switch to false afterwards
    interfaceVisible: true
};

const reducer = function (state: LitterBoxState | undefined, action: LitterBoxInterfaceAction): LitterBoxState {
    state ??= {...initialState};

    switch (action.type) {
    case LitterBoxInterfaceActionType.TOGGLE_INTERFACE:
        state = {...state, interfaceVisible: !state.interfaceVisible};
        break;
    case LitterBoxInterfaceActionType.SHOW_INTERFACE:
        state = {...state, interfaceVisible: true};
        break;
    case LitterBoxInterfaceActionType.HIDE_INTERFACE:
        state = {...state, interfaceVisible: false};
        break;
    default:
        // do nothing
        break;
    }

    return state;
};

const toggleInterface = function (): LitterBoxInterfaceAction {
    return {type: LitterBoxInterfaceActionType.TOGGLE_INTERFACE};
};

const showInterface = function (): LitterBoxInterfaceAction {
    return {type: LitterBoxInterfaceActionType.SHOW_INTERFACE};
};

const hideInterface = function (): LitterBoxInterfaceAction {
    return {type: LitterBoxInterfaceActionType.HIDE_INTERFACE};
};

export {
    reducer as default,
    initialState as litterBoxInitialState,

    toggleInterface,
    showInterface,
    hideInterface
};

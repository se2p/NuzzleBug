enum LitterBoxInterfaceActionType {
    SHOW_INTERFACE = 'scratch-gui/litterbox/SHOW_INTERFACE',
    HIDE_INTERFACE = 'scratch-gui/litterbox/HIDE_INTERFACE'
}

interface LitterBoxInterfaceAction {
    type: LitterBoxInterfaceActionType;
}

export interface LitterBoxState {
    interfaceVisible: boolean;
}

const initialState: LitterBoxState = {
    interfaceVisible: false
};

const reducer = function (state: LitterBoxState | undefined, action: LitterBoxInterfaceAction): LitterBoxState {
    state ??= {...initialState};

    switch (action.type) {
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

const showInterface = function (): LitterBoxInterfaceAction {
    return {type: LitterBoxInterfaceActionType.SHOW_INTERFACE};
};

const hideInterface = function (): LitterBoxInterfaceAction {
    return {type: LitterBoxInterfaceActionType.HIDE_INTERFACE};
};

export {
    reducer as default,
    initialState as litterBoxInitialState,

    showInterface,
    hideInterface
};

const initialState = {
    showDebug: false,
};

const Setting = (state = initialState, action) => {
    switch (action.type) {
        case 'SETTING.SET_SHOW_DEBUG':
          return {
            ...state,
            showDebug: action.data,
          };
        case 'SETTING.CLEAR':
          return initialState;
        default:
          return state;
    }
};

export default Setting;
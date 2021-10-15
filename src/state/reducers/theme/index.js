const initialState = {
    theme: 'system',
    font: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'THEME.SET_THEME':
          return {
            ...state,
            theme: action.data,
          };
        case 'THEME.SET_FONT':
          return {
            ...state,
            font: action.data,
          };
        case 'THEME.RESET':
          return initialState;
        default:
          return state;
    }
};
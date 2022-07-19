const initialState = {
    data: [],
    lastHeaderIndex: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SURVEY_PASAR.SET_DATA':
            return {
                ...state,
                data: action.data,
            };
        case 'SURVEY_PASAR.SET_LAST_HEADER_INDEX':
            return {
                ...state,
                lastHeaderIndex: action.data,
            };
        case 'SURVEY_PASAR.RESET':
            return initialState;
        default:
            return state;
    }
};
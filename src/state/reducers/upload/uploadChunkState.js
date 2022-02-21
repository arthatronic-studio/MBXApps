const initialState = {
    chunkData: [],
    chunkError: [],
    onUpload: false,
    endUpload: false,
    errorUpload: false,
    total: 0,
    progress: 0,

    isProses: false,
    totalProses: 0,
    countProses: 0,
};

const uploadChunkState = (state = initialState, action) => {
    switch (action.type) {
        case 'UPLOAD_CHUNK_STATE.SET_DATA':
            return {
                ...state,
                chunkData: action.data,
                total: action.data.length,
            };
        case 'UPLOAD_CHUNK_STATE.SET_TOTAL':
            return {
                ...state,
                total: action.data,
            };
        case 'UPLOAD_CHUNK_STATE.SET_PROGRESS':
            return {
                ...state,
                progress: action.data,
            };
        case 'UPLOAD_CHUNK_STATE.SET_ERROR':
            return {
                ...state,
                chunkError: state.chunkError.concat(action.data),
            };
        case 'UPLOAD_CHUNK_STATE.SET_ON_UPLOAD':
            return {
                ...state,
                onUpload: true,
            };
        case 'UPLOAD_CHUNK_STATE.SET_END_UPLOAD':
            return {
                ...state,
                onUpload: false,
                endUpload: true,
            };

        // ERROR UPLOAD
        case 'UPLOAD_CHUNK_STATE.SET_ERROR_UPLOAD':
            return {
                ...state,
                errorUpload: action.data,
            };

        // IS PROSES
        case 'UPLOAD_CHUNK_STATE.UPDATE_IS_PORSES':
            return {
                ...state,
                ...action.data,
            };
        case 'UPLOAD_CHUNK_STATE.RESET':
            return initialState;
        default:
            return state;
    }
};

export default uploadChunkState;
const initialState = {
    booking: null,
    bookingDetail: null,
    bookingHistory: [],
    fetching: false,
    error: null,
    fetchingStatus: false,
    fetchingCancel: false,
};

const booking = (state = initialState, action) => {
    switch (action.type) {
        case 'BOOKING.REQUEST_BOOKING':
            return {
                ...state,
                fetching: true,
                error: null
            };
            break;
        case 'BOOKING.REQUEST_BOOKING_STATUS':
            return {
                ...state,
                fetchingStatus: true,
                error: null
            };
            break;
        case 'BOOKING.REQUEST_BOOKING_CANCEL':
            return {
                ...state,
                fetchingCancel: true,
                error: null
            };
            break;
        case 'BOOKING.ADD_BOOKING':
            return {
                ...state,
                fetching: false,
                fetchingStatus: false,
                booking: action.data,
                error: null
            };
            break;
        case 'BOOKING.ADD_BOOKING_DETAIL':

            return {
                ...state,
                fetching: false,
                bookingDetail: action.data,
            };
            break;
        case 'BOOKING.ADD_BOOKING_HISTORY':
            return {
                ...state,
                fetching: false,
                bookingHistory: state.bookingHistory.concat(action.data)
            };
            break;
        case 'BOOKING.UPDATE_BOOKING_HISTORY':
            return {
                ...state,
                fetching: false,
                fetchingStatus: false,
                fetchingCancel: false,
                bookingHistory: state.bookingHistory.map(book => {
                    if(book.id === action.id) {
                        return {
                            ...book,
                            bookingStatus: action.data
                        };
                    } else {
                        return {
                            ...book
                        }
                    }
                })
            };
            break;
        case 'BOOKING.CLEAR_BOOKING_ERROR':
            return {
                ...state,
                fetching: false,
                fetchingStatus: false,
                fetchingCancel: false,
                error: null,
            };
            break;
        case 'BOOKING.CLEAR_BOOKING':
            return {
                ...state,
                booking: {},
                bookingDetail: null,
                fetching: false,
                fetchingStatus: false,
                fetchingCancel: false,
                error: null,
            };
            break;
        case 'BOOKING.CLEAR_BOOKING_CANCEL':
            return {
                ...state,
                fetchingCancel: false,
                error: null,
            };
            break;
        case 'BOOKING.ADD_BOOKING_ERROR':
            return {
                ...state,
                fetching: false,
                fetchingStatus: false,
                fetchingCancel: false,
                error: action.data,
            };
            break;
        default:
            return state;
            break;
    }
};

export default booking;

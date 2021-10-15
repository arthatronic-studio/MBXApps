const initialState = {
    data: {},
    future_time: null,
    login: {
        user: null,
        bookingHistory: []
    },
    register: {
      status: false
    },
    forgetPassword: {
      status: false
    },
    changePassword: {
      status: false
    },
    error: '',
    loading: false,
};

const Auth = (state = initialState, action) => {
    switch (action.type) {
        case 'USER.ADD_AUTH_TOKEN':
          return {
            ...state,
            data: {
              ...state.data,
              ...action.data
            },
            future_time: action.future_time
          };
        case 'USER.FETCH_LOGIN':
        case 'USER.FETCH_REGISTER':
        case 'USER.FETCH_FORGET_PASSWORD':
        case 'USER.FETCH_CHANGE_PASSWORD':
        case 'USER.FETCH_PROFILE':
          return {
            ...state,
            loading: true
          };
        case 'USER.LOGIN':
          return {
            ...state,
            login: { ...state.login, user: action.user },
            loading: false,
          };
        case 'USER.REGISTER':
          return {
            ...state,
            register: { status: action.status },
            loading: false,
          };
       case 'USER.FORGET_PASSWORD':
          return {
            ...state,
            forgetPassword: { status: action.status },
            loading: false,
          };
         case 'USER.CHANGE_PASSWORD':
          return {
            ...state,
            changePassword: { status: action.status },
            loading: false,
          };
        case 'USER.ADD_BOOKING_LOGIN':
          return {
            ...state,
            login: { ...state.login, bookingHistory: action.bookingHistory },
            loading: false,
          };
        case 'USER.UPDATE_BOOKING_LOGIN':
          return {
            ...state,
            login: { ...state.login, bookingHistory: state.login.bookingHistory.concat(action.data) },
            loading: false,
          };
        case 'USER.UPDATE_BOOKING_STATUS':
          return {
            ...state,
            login: {
              ...state.login,
              bookingHistory: state.login.bookingHistory.map(booking => {
                if (booking.id === action.id) return { ...booking, bookingStatus: action.data };
                return { ...booking };
              })
            },
            loading: false,
          };
        case 'USER.UPDATE_PROFILE':
          return {
            ...state,
            login: {
              ...state.login,
              user: { ...state.login.user, ...action.user }
            },
            loading: false,
          };
        case 'USER.LOGIN_ERROR':
        case 'USER.REGISTER_ERROR':
        case 'USER.FORGET_PASSWORD_ERROR':
        case 'USER.CHANGE_PASSWORD_ERROR':
        case 'USER.PROFILE_ERROR':
          return {
            ...state,
            register: {
              status: false
            },
            forgetPassword: {
              status: false
            },
            changePassword: {
              status: false
            },
            error: action.error,
            loading: false
          };
        case 'USER.CLEAR_LOADING':
          return {
            ...state,
            loading: false
          };
        case 'USER.CLEAR_ERROR':
          return {
            ...state,
            error: '',
          };
        case 'USER.CLEAR_LOGIN':
        case 'USER.CLEAR_REGISTER':
        case 'USER.CLEAR_FORGET_PASSWORD':
        case 'USER.LOGOUT':
          return initialState;
        default:
          return state;
    }
};

export default Auth;

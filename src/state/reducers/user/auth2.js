const initialState = {
    token: null,
    user: null,
    checkin: null,
    stateBeacons: [],
};

const Auth2 = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTH.SET_TOKEN':
          return {
            ...state,
            token: action.data,
          };
        case 'AUTH.SET_USER':
          return {
            ...state,
            user: action.data,
          };
        case 'AUTH.SET_CHECKIN':
          return {
            ...state,
            checkin: action.data,
          };
        case 'AUTH.SET_STATE_BEACONS':
          return {
            ...state,
            stateBeacons: action.data,
          };
        case 'AUTH.CLEAR':
          return initialState;
        default:
          return state;
    }
};

export default Auth2;
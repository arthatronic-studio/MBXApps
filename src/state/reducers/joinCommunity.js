const initialState = {
  userDetail: {},
  userList: [],
  chapterList: [],
  fetching: false,
  error: null,
  fetchingStatus: false,
  fetchingCancel: false,
};

const joinCommunity = (state = initialState, action) => {
  switch (action.type) {
    case 'JOINCOMMUNITY.USER_DETAIL':
      return {
        ...state,
        fetching: true,
        error: null,
      };
      break;
    case 'JOINCOMMUNITY.FETCH':
      return {
        ...state,
        loading: true,
      };
      break;
    case 'JOINCOMMUNITY.USER_LIST':
      return {
        ...state,
        fetchingStatus: true,
        error: null,
      };
      break;
    case 'JOINCOMMUNITY.CHAPTER_LIST':
      return {
        ...state,
        fetchingCancel: true,
        error: null,
      };
      break;
    default:
      return state;
      break;
  }
};

export default joinCommunity;

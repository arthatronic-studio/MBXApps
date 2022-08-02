const initialState = {
    data: [],
};

const Article = (state = initialState, action) => {
    switch (action.type) {
        case 'ARTICLE.ADD_HISTORY':
          console.log(action, "action bro");
          const newData = [
            action.search,
            ...state.data
          ];
          const newDataUniq = newData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.history === value.history
            ))
          )
          return {
            ...state,
            data: newDataUniq
          };
        case 'ARTICLE.REMOVE_HISTORY':
          return {
            ...state,
            data: state.data.filter(item => item.history !== action.data)
          };
        case 'ARTICLE.CLEAR_HISTORY':
          return initialState;
        default:
          return state;
    }
};

export default Article;

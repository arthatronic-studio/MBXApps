const initialState = {
    data: [],
};

const Event = (state = initialState, action) => {
    switch (action.type) {
        case 'EVENT.ADD_HISTORY':
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
        case 'EVENT.REMOVE_HISTORY':
          return {
            ...state,
            data: state.data.filter(item => item.history !== action.data)
          };
        case 'EVENT.CLEAR_HISTORY':
          return initialState;
        default:
          return state;
    }
};

export default Event;

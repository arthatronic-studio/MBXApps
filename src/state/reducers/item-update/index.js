const initialState = {
    name: '',
    item: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'ITEM_UPDATE.ADD':
          return {
            ...state,
            name: action.data.name,
            item: action.data.item,
          };
        case 'ITEM_UPDATE.CLEAR':
          return initialState;
        default:
          return state;
    }
};
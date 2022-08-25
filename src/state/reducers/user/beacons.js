const initialState = {
  listCheckinUID: [],
  listCheckinRange: [],
  listMerchUID: [],
  listMerchRange: [],
  listArtUID: [],
  listArtRange: [],
  listOtherUID: [],
  listOtherRange: [],
  listOtherType: [],
};

const Beacons = (state = initialState, action) => {
  switch (action.type) {
    case 'BEACONS.SET_LIST_CHECKIN':
      return {
        ...state,
        listCheckinUID: action.data.listUID,
        listCheckinRange: action.data.listRange,
      };
    case 'BEACONS.SET_LIST_MERCH':
      return {
        ...state,
        listMerchUID: action.data.listUID,
        listMerchRange: action.data.listRange,
      };
    case 'BEACONS.SET_LIST_ART':
      return {
        ...state,
        listArtUID: action.data.listUID,
        listArtRange: action.data.listRange,
      };
    case 'BEACONS.SET_LIST_OTHER':
      return {
        ...state,
        listOtherUID: action.data.listUID,
        listOtherRange: action.data.listRange,
        listOtherType: action.data.listType,
      };
    case 'BEACONS.CLEAR':
      return initialState;
    default:
      return state;
  }
};

export default Beacons;
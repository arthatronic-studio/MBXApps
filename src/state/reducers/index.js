import {persistCombineReducers} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import Auth from './user/auth';
import booking from './booking';
import theme from './theme';
import joinCommunity from './joinCommunity';

const config = {
  key: 'root',
  storage: AsyncStorage,
};

const reducer = persistCombineReducers(config, {
  'user.auth': Auth,
  booking,
  theme,
  joinCommunity,
});

export default reducer;

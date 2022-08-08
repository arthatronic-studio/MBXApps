import {persistCombineReducers} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import Auth from './user/auth';
import booking from './booking';
import theme from './theme';
import Article from './history/article';
import uploadChunkState from './upload/uploadChunkState';
import surveyPasar from './survey/pasar';
import itemUpdate from './item-update';

const config = {
  key: 'root',
  storage: AsyncStorage,
};

const reducer = persistCombineReducers(config, {
  'user.auth': Auth,
  booking,
  theme,
  uploadChunkState,
  'history.article': Article,
  surveyPasar,
  itemUpdate,
});

export default reducer;

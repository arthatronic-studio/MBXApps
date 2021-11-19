import {Platform} from 'react-native';
import axios from 'axios';
import {Buffer} from 'buffer';
import Config from 'react-native-config';
import qs from 'qs';
import Moment from 'moment';
import gql from 'graphql-tag';
import Client from '../../../lib/apollo';
import {joinCommunityMember} from 'src/lib/query/joinCommunityMember';

export const joinCommunityUserList = () => async (dispatch, getState) => {
  console.log('test');
  dispatch({type: 'JOINCOMMUNITY.FETCH'});
  Client.query({query: joinCommunityMember})
    .then((res) => {
      dispatch({type: 'JOINCOMMUNITY.USER_LIST', user: res.data});
    })
    .catch((error) => {
      console.log(error, 'error profile');
      dispatch({type: 'USER.PROFILE_ERROR', error});
    });
};
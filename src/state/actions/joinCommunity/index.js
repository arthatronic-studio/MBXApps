import {Platform} from 'react-native';
import axios from 'axios';
import {Buffer} from 'buffer';
import Config from 'react-native-config';
import querystring from 'querystring';
import Moment from 'moment';
import gql from 'graphql-tag';
import Client from '../../../lib/apollo';
import {joinCommunityMember} from 'src/lib/query/joinCommunityMember';

const clientId =
  Platform.OS === 'ios' ? Config.CLIENT_ID_IOS : Config.CLIENT_ID_ANDROID;
const secret =
  Platform.OS === 'ios'
    ? Config.CLIENT_SECRET_IOS
    : Config.CLIENT_SECRET_ANDROID;
// const encodeData = new Buffer(clientId + ':' + secret).toString('base64');
const encodeData = new Buffer(`${clientId}:${secret}`).toString('base64');

const instance = axios.create({
  baseURL: Config.AUTH_API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${encodeData}`,
  },
});

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

export const updateCurrentUserProfile = (params) => async (
  dispatch,
  getState,
) => {
  const {
    firstName,
    lastName,
    email,
    phoneCountryCode,
    phoneNumber,
    address,
    city,
    postalCode,
    country,
    idCardNumber,
    Nomor_ID,
    Alamat,
  } = params;

  dispatch({type: 'USER.CLEAR_ERROR'});
  dispatch({type: 'USER.FETCH_PROFILE'});
  Client.mutate({
    mutation: updateUserProfileMutation,
    variables: {
      firstName,
      lastName,
      email,
      phoneCountryCode,
      phoneNumber,
      address,
      city,
      postalCode,
      country,
      idCardNumber,
      Nomor_ID,
      Alamat,
    },
  })
    .then((res) => {
      dispatch(getCurrentUserProfile());
    })
    .catch((error) => {
      dispatch({type: 'USER.PROFILE_ERROR', error});
    });
};

export const login = (tempEmail, password, fcm_token) => async (
  dispatch,
  getState,
) => {
  const email = tempEmail ? tempEmail.toLowerCase() : tempEmail;
  dispatch({type: 'USER.CLEAR_LOGIN'});
  dispatch({type: 'USER.FETCH_LOGIN'});
  const response = await callAuthApi(email, password, null, fcm_token);

  console.log(response, 'response');

  if (response.success) {
    await setToken(dispatch, response.data);

    Client.query({query: getUserQuery})
      .then((res) => {
        console.log(res, 'res getUserQuery');
        dispatch({
          type: 'USER.LOGIN',
          user: {...res.data.getLogonUserAccessControl, guest: false},
        });
        dispatch(getCurrentUserProfile());
      })
      .catch((error) => {
        dispatch({type: 'USER.LOGIN_ERROR', error});
        console.log(error, 'error getUserQuery');
      });
  } else dispatch({type: 'USER.LOGIN_ERROR', error: response.error});
};

export const refetchUserGuest = () => (dispatch, getState) =>
  dispatch({type: 'USER.FETCH_LOGIN_GUEST', guest: true});

const getUserQuery = gql`
  {
    getLogonUserAccessControl {
      userId
      userName
      firstName
      lastName
      email
      listAccessControl {
        moduleName
        functionName
        add
        view
        edit
      }
    }
  }
`;

const getUserProfileQuery = gql`
  {
    currentUser {
      userId
      userName
      firstName
      lastName
      email
      phoneCountryCode
      phoneNumber
      address
      city
      postalCode
      country
      organizationId
      organizationName
      userCode
      isDirector
      idCardNumber
      image
      qr_code
      Foto_Profil
      Nomor_ID
      Alamat
      Tanggal_Lahir
    }
  }
`;

const updateUserProfileMutation = gql`
  mutation inputUserDetails(
    $firstName: String!
    $lastName: String
    $phoneCountryCode: String
    $phoneNumber: String
    $email: String
    $address: String
    $city: String
    $postalCode: String
    $country: String
    $idCardNumber: String
    $Nomor_ID: String
    $Alamat: String
  ) {
    inputUserDetails(
      firstName: $firstName
      lastName: $lastName
      phoneCountryCode: $phoneCountryCode
      phoneNumber: $phoneNumber
      email: $email
      address: $address
      city: $city
      postalCode: $postalCode
      country: $country
      idCardNumber: $idCardNumber
      Nomor_ID: $Nomor_ID
      Alamat: $Alamat
    ) {
      userId
      userName
      firstName
      lastName
      email
      phoneCountryCode
      phoneNumber
      address
      city
      postalCode
      country
      idCardNumber
      Nomor_ID
      Alamat
    }
  }
`;

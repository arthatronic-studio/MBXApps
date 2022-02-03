import { Platform } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import Config from 'react-native-config';
import Moment from 'moment';
import gql from 'graphql-tag';
import qs from 'qs';
import Client from '../../../lib/apollo';

const client_id = Platform.OS === 'ios' ? Config.CLIENT_ID_IOS : Config.CLIENT_ID_ANDROID;
const client_secret = Platform.OS === 'ios' ? Config.CLIENT_SECRET_IOS : Config.CLIENT_SECRET_ANDROID;
const encodeData = new Buffer(`${client_id}:${client_secret}`).toString('base64');
const instance = axios.create({ baseURL: Config.AUTH_API_URL, headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${encodeData}` } });

export const callAuthApi = async (tempEmail, password, refreshToken, fcm_token) => {
  const email = tempEmail ? tempEmail.toLowerCase() : tempEmail;
  let body = { scope: Config.SCOPE, };
  try {
    if (email && password) body = { ...body, grant_type: 'password', client_id, client_secret, username: email, password, fcm_token };
    else if (refreshToken) body = { ...body, grant_type: 'refresh_token', refresh_token: refreshToken };
    else body = { ...body, grant_type: Config.GRANT_TYPE, client_id, client_secret };

    console.log('body auth', body);

    const response = await instance.post('/oauth/token', qs.stringify(body));
    if (response) return { success: true, data: response.data };
    return { success: false, error: 'Kesalahan server' };
  }
  catch (error) {
    if (error.response) {
      console.log(error, 'error response');
      return { success: false, error: 'Kesalahan server' };
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
    }
    else if (error.request) {
      console.log(error, 'error request');
      return { success: false, error: 'Kesalahan server' };
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
    }
    else {
      console.log(error, 'error');
      return { success: false, error: 'Kesalahan server' };
      // Something happened in setting up the request that triggered an Error
      // console.log('Error', error.message);
    }
  }
};


export const callForgetPassword = (tempEmail) => async (dispatch, getState) => {
  const email = tempEmail ? tempEmail.toLowerCase() : tempEmail;

  dispatch({ type: 'USER.CLEAR_FORGET_PASSWORD' });
  dispatch({ type: 'USER.FETCH_FORGET_PASSWORD' });

  try {
    const response = await callAuthApi();
    if (response.success) {
      await setToken(dispatch, response.data);

      const instanceRegister = axios.create({ baseURL: Config.AUTH_API_URL, headers: { 'Content-Type': 'application/json', Authorization: `${response.data.token_type} ${response.data.access_token}` } });

      if (email) {
        let body = { email };
        const response2 = await instanceRegister.post('/api/user/forgotPassword', body);
        
        console.log(response2, 'response2');

        if (response2.status === 200 && typeof response2.data === 'string') {
          dispatch({ type: 'USER.FORGET_PASSWORD', status: true });
        } else {
          dispatch({ type: 'USER.FORGET_PASSWORD_ERROR', error: 'Could not find Email' });
        }
      } else {
        dispatch({ type: 'USER.FORGET_PASSWORD_ERROR', error: 'Could not find Email' });
      }
    } else {
      dispatch({ type: 'USER.FORGET_PASSWORD_ERROR', error: 'Could not find Email' });
    }
  }
  catch (error) {
    console.log(error, 'error response2');
    if (error.response) {
        dispatch({ type: 'USER.FORGET_PASSWORD_ERROR', error: 'Could not find Email' });
    }
    else if (error.request) {
        dispatch({ type: 'USER.FORGET_PASSWORD_ERROR', error: 'Email Not Registered'});
    }
    else {
        dispatch({ type: 'USER.FORGET_PASSWORD_ERROR', error: error.message });
    }
  }
};


export const callChangePassword = (tempEmail, oldPassword, newPassword) => async (dispatch, getState) => {
  const email = tempEmail ? tempEmail.toLowerCase() : tempEmail;
  dispatch({ type: 'USER.FETCH_CHANGE_PASSWORD' });
  try {
            if(email && oldPassword && newPassword){
              const response = await callAuthApi(email, oldPassword);
              if (response.success) {
                await setToken(dispatch, response.data);
                const instanceRegister = axios.create({ baseURL: Config.AUTH_API_URL, headers: { 'Content-Type': 'application/json', Authorization: `${response.data.token_type} ${response.data.access_token}` } });

                      let body = {
                        old_password : oldPassword,
                        new_password : newPassword,
                        login_name : email
                      };
                      const response2 = await instanceRegister.post('/api/ChangePassword', body);
                      if (response2.status === 200)
                      {
                        dispatch({ type: 'USER.CHANGE_PASSWORD', status: true });
                      }else{
               dispatch({ type: 'USER.CHANGE_PASSWORD_ERROR', error: 'Gagal Merubah Password' });

            }
                    }else{
               dispatch({ type: 'USER.CHANGE_PASSWORD_ERROR', error: 'Gagal Merubah Password' });

            }

            }else{
               dispatch({ type: 'USER.CHANGE_PASSWORD_ERROR', error: 'Gagal Merubah Password' });

            }
  }
  catch (error) {
    if (error.response) {
        dispatch({ type: 'USER.CHANGE_PASSWORD_ERROR', error: 'Could not find Email' });
    }
    else if (error.request) {
        dispatch({ type: 'USER.CHANGE_PASSWORD_ERROR', error: 'Email Not Registered'});
    }
    else {
        dispatch({ type: 'USER.CHANGE_PASSWORD_ERROR', error: error.message });
    }
  }
};

export const getToken = () => async (dispatch, getState) => {
  const auth = getState()['user.auth'];
  let response;
  if (auth.login.user && Moment(auth.future_time).isBefore(Moment())) response = await callAuthApi(null, null, auth.data.refresh_token);
  else if (!auth.data.access_token || Moment(auth.future_time).isBefore(Moment())) response = await callAuthApi();
  if (response && response.success) await setToken(dispatch, response.data);
};

export const getCurrentUserProfile = () => async (dispatch, getState) => {
  dispatch({ type: 'USER.FETCH_PROFILE' });
  Client.query({ query: getUserProfileQuery })
  .then(res => {
   dispatch({ type: 'USER.UPDATE_PROFILE', user: res.data.currentUser });
  })
  .catch(error => {
    console.log(error, 'error profile');
   dispatch({ type: 'USER.PROFILE_ERROR', error });
 });
};


export const updateCurrentUserProfile = (params) => async (dispatch, getState) => {
  const {
    firstName, lastName, email, phoneCountryCode, phoneNumber, address, city, postalCode, country, idCardNumber, externalCode, idNumber, photoProfile, birthDate, street, block, space
  } = params;

  dispatch({ type: 'USER.CLEAR_ERROR' });
  dispatch({ type: 'USER.FETCH_PROFILE' });
  Client.mutate({
    mutation: updateUserProfileMutation,
    variables: { firstName, lastName, email, phoneCountryCode, phoneNumber, address, city, postalCode, country, idCardNumber, externalCode, idNumber, photoProfile, birthDate, street, block, space }
  })
  .then(res => {
    console.log("res ini", res);
    dispatch(getCurrentUserProfile());
  })
  .catch(error => {
    console.log("error ini", error);
    dispatch({ type: 'USER.PROFILE_ERROR', error });
 });
};

export const login = (tempEmail, password, fcm_token) => async (dispatch, getState) => {
  const email = tempEmail ? tempEmail.toLowerCase() : tempEmail;
  dispatch({ type: 'USER.CLEAR_LOGIN' });
  dispatch({ type: 'USER.FETCH_LOGIN' });
  const response = await callAuthApi(email, password, null, fcm_token);

  console.log(response, 'response');
  
  if (response.success) {
    await setToken(dispatch, response.data);

    Client.query({ query: getUserQuery })
    .then(res => {
      console.log(res, 'res getUserQuery');
      dispatch({ type: 'USER.LOGIN', user: { ...res.data.getLogonUserAccessControl, guest: false } });
      dispatch(getCurrentUserProfile());
    })
    .catch(error => {
      dispatch({ type: 'USER.LOGIN_ERROR', error });
      console.log(error, 'error getUserQuery')
    });
  }
  else dispatch({ type: 'USER.LOGIN_ERROR', error: response.error });
};

export const register = (user) => async (dispatch, getState) => {
  dispatch({ type: 'USER.CLEAR_REGISTER' });
  dispatch({ type: 'USER.FETCH_REGISTER' });
  const response = await callAuthApi();
  if (response.success) {
    await setToken(dispatch, response.data);
    const instanceRegister = axios.create({ baseURL: Config.AUTH_API_URL, headers: { 'Content-Type': 'application/json', Authorization: `${response.data.token_type} ${response.data.access_token}` } });
    try {
      const email = user.email ? user.email.toLowerCase() : user.email;
      const body = {
        id: null,
        username: user.username,
        password: user.password,
        imei: '00000',
        active: 0,
        first_name: user.firstName,
        last_name: user.lastName,
        email,
        phone_country_code: user.phoneCountryCode,
        phone_number: user.phoneNumber,
        reference_code: '',
        initial_code: '',
        idCardNumber : user.idCardNumber,
        Nomor_ID : user.idNumber,
        Alamat : user.address,
        city: '',
        postal_code: '',
        country: '',
        tanggalLahir : user.tanggalLahir,
      };
      const responseRegis = await instanceRegister.post('/api/registration/signup', body);
      
      // console.log(responseRegis, 'responseRegis');
      
      if (responseRegis.data.Success) dispatch({ type: 'USER.REGISTER', status: responseRegis.data.Success });
      else dispatch({ type: 'USER.REGISTER_ERROR', status: responseRegis.data.Success, error: responseRegis.data.Message });
    }
    catch (error) {
      dispatch({ type: 'USER.REGISTER_ERROR', error });
    }
  }
  else {
    dispatch({ type: 'USER.REGISTER_ERROR', error: response.error });
  }
};

export const guestLogin = () => async (dispatch, getState) => {
  dispatch({ type: 'USER.CLEAR_LOGIN' });
  dispatch({ type: 'USER.FETCH_LOGIN' });
  const response = await callAuthApi('guest', 'guest');

  if (response.success) {
    await setToken(dispatch, response.data);
     Client.query({ query: getUserQuery })
    .then(res => {
      dispatch({ type: 'USER.LOGIN', user: { ...res.data.getLogonUserAccessControl, guest: true } });
    })
    .catch(error => {
      dispatch({ type: 'USER.LOGIN_ERROR', error });
    });
  }
  else dispatch({ type: 'USER.LOGIN_ERROR', error: response.error });
};

export const refetchUserGuest = () => (dispatch, getState) => dispatch({ type: 'USER.FETCH_LOGIN_GUEST', guest: true });

export function setToken(dispatch, data) {
  dispatch({ type: 'USER.ADD_AUTH_TOKEN', data, future_time: Moment().add(data.expires_in - 400, 'seconds') });
}

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
}`;

const getUserProfileQuery = gql`
{
  currentUser{
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
    idCardNumber
    idNumber
    isDirector
    image
    photoProfile
    birthDate
  }
}`;


const updateUserProfileMutation = gql`
mutation inputUserDetails(
  $firstName: String!
  $lastName: String
  $email: String
  $phoneCountryCode: String
  $phoneNumber: String
  $address: String
  $city: String
  $postalCode: String
  $country: String
  $idCardNumber: String
  $externalCode: String
  $idNumber: String
  $photoProfile: String
  $birthDate: String
  $street: String
  $block: String
  $space: String
){
  inputUserDetails(
    firstName: $firstName
    lastName: $lastName
    email: $email
    phoneCountryCode: $phoneCountryCode
    phoneNumber: $phoneNumber
    address: $address
    city: $city
    postalCode: $postalCode
    country: $country
    idCardNumber: $idCardNumber
    externalCode: $externalCode
    idNumber: $idNumber
    photoProfile: $photoProfile
    birthDate: $birthDate
    street: $street
    block: $block
    space: $space
  ){
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
    idCardNumber
    idNumber
    isDirector
    image
    photoProfile
    birthDate
  }
}`;

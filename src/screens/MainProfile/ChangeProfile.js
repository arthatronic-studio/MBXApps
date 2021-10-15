import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity as NativeTouchable, ScrollView, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';

import {
  // Button,
  // TouchableOpacity,
  Text,
  Popup, usePopup,
  Loading,
  Header,
  useColor
} from '@src/components';
import {
  Button,
  TouchableOpacity,
} from '@src/components/Button';
import validate from '@src/lib/validate';

import { updateCurrentUserProfile } from '@src/state/actions/user/auth';
import { usePreviousState } from '@src/hooks';

const MainView = Styled(SafeAreaView)`
  flex: 1;
`;

const Container = Styled(View)`
  width: 100%;
  height: 100%;
  alignItems: center;
  justifyContent: center;
  padding: 30px 16px 0px;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 50px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const SignRegisterView = Styled(View)`
  width: 100%;
  marginTop: 36px;
  marginBottom: 24px;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: OpenSans-Regular;
  backgroundColor: transparent;
  borderBottomWidth: 1px;
  borderColor: #666666;
`;

const ErrorView = Styled(View)`
  width: 100%;
  paddingVertical: 4px;
  alignItems: flex-start;
`;

const SignButton = Styled(Button)`
  width: 100%;
  height: 45px;
  borderRadius: 4px;
`;

const RegisterButton = Styled(TouchableOpacity)`
  marginLeft: 4px;
`;

const TextTitleView = Styled(View)`
  width: 100%;
  marginBottom: 43px;
  alignItems: flex-start;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const inputs = ['fullName', 'idNumber', 'email', 'phoneNumber'];

export default ({ navigation, route }) => {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const {
    register,
    loading,
    error,
  } = useSelector(state => state['user.auth']);

  // prevstate
  const prevLoading = usePreviousState(loading);

  // hooks
  const { Color } = useColor();
  const isFocused = useIsFocused();
  const [popupProps, showPopup] = usePopup();

  // state
  const [allValid, setAllValid] = useState(false);
  const [userData, setUserData] = useState({
    fullName: user ? user.firstName + ' ' + user.lastName : '',
    idNumber: '',
    email: user ? user.email : '',
    phoneNumber: user ? user.phoneNumber : '',
  });
  const [errorData, setErrorData] = useState({
    fullName: null,
    idNumber: null,
    email: null,
    phoneNumber: null,
  });

  useEffect(() => {
    if (isFocused) {
      if (prevLoading && user && loading === false) {
        navigation.pop();
        showPopup('Data berhasil diubah', 'success');
      }
      if (!register.status && error) {
        showPopup('Terjadi Kesalaha, silahkan coba kembali', 'error');
        console.log(JSON.stringify(error), 'error');
        
        dispatch({ type: 'USER.LOGOUT' });
      }
    }
  }, [user, error, isFocused]);

  useEffect(() => {
    if (allValid) {
      setAllValid(false)

      const { fullName, idNumber, email, phoneNumber } = userData;

      const nameSplit = fullName.split(' ');
      let lastName = '';
      if (nameSplit[1]) {
        nameSplit.map((e, i) => {
          if (i !== 0) lastName += e + ' ';
        })
      }

      const newUserData = {
        firstName: nameSplit[0].trim(),
        lastName: lastName.trim(),
        email,
        phoneNumber,
      };

      dispatch(updateCurrentUserProfile(newUserData));
    }
  }, [allValid]);

  const isValueError = (name) => {
    const error = validate(name, userData[name]);
    setErrorData({ ...error, [name]: error });
  }

  const onChangeUserData = (key, val) => {
    setUserData({ ...userData, [key]: val });
  }

  const onSubmit = () => {
    let valid = true;
    const newErrorState = {};

    for (const input of inputs) {
      const error = validate(input, userData[input]);
      if (error) valid = false;
      newErrorState[input] = error;
    }

    setErrorData(newErrorState);
    setAllValid(valid);
  }

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <Header
        title='Ubah Profile'
        style={{paddingTop: 16}}
      />

      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{paddingBottom: 16}}>

        <Container>
          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Nama Lengkap</Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder='Masukan nama lengkap'
              keyboardType='default'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => onChangeUserData('fullName', text)}
              selectionColor={Color.text}
              value={userData.fullName}
              onBlur={() => isValueError('fullName')}
              style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.fullName}</Text>
          </ErrorView>


          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>NIK</Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder='Masukan NIK'
              keyboardType='number-pad'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => onChangeUserData('idNumber', text)}
              selectionColor={Color.text}
              value={userData.idNumber}
              onBlur={() => isValueError('idNumber')}
              style={{color: Color.text}}
              />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.idNumber}</Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Email</Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
                placeholder='Masukan email'
                keyboardType='email-address'
                placeholderTextColor={Color.gray}
                underlineColorAndroid='transparent'
                autoCorrect={false}
                onChangeText={(text) => onChangeUserData('email', text)}
                selectionColor={Color.text}
                value={userData.email}
                onBlur={() => isValueError('email')}
                style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.email}</Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Nomor Telepon</Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder='Masukan nomor telepon'
              keyboardType='phone-pad'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => onChangeUserData('phoneNumber', text)}
              selectionColor={Color.text}
              value={userData.phoneNumber}
              onBlur={() => isValueError('phoneNumber')}
              style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.phoneNumber}</Text>
          </ErrorView>

          {/* <View style={{width: '100%', paddingVertical: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <MaterialIcons size={16} name='check-box-outline-blank' color={Color.theme} style={{marginRight: 4}} />
            <Text align='left' size={12} color={Color.theme}>Saya ingin menerima berita terbaru MaudiKenal lewat email</Text>
          </View> */}

          {/* <View style={{width: '100%', paddingVertical: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <MaterialIcons size={16} name='check-box-outline-blank' color={Color.theme} style={{marginRight: 4}} />
            <Text align='left' size={12} color={Color.theme}>Saya setuju dengan <Text color={Color.secondary}>Syarat & Ketentuan</Text> yang berlaku.</Text>
          </View> */}

          <SignRegisterView>
            <SignButton
              onPress={() => onSubmit()}
            >
              Simpan
            </SignButton>
          </SignRegisterView>
        </Container>
      </ScrollView>

      <Loading visible={loading} />

      <Popup {...popupProps} />
    </MainView>
  );
};
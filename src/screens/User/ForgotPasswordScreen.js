import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import {
  Button,
  // Text,
  Popup, usePopup,
  Loading,
  useColor
} from '@src/components';
import Text from '@src/components/Text';
import validate from '@src/lib/validate';

import { callForgetPassword } from '@src/state/actions/user/auth';

const MainView = Styled(SafeAreaView)`
  flex: 1;
`;

const Container = Styled(View)`
  width: 100%;
  height: 100%;
  alignItems: center;
  justifyContent: center;
  padding: 92px 16px 0px;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 50;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: OpenSans-Regular;
  backgroundColor: transparent;
  borderBottomWidth: 1px;
  borderColor: #666666;
  fontSize: 17px;
`;

const SignRegisterView = Styled(View)`
  width: 100%;
  marginTop: 70px;
`;

const BackView = Styled(View)`
  width: 100%;
  marginTop: 16px;
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

const BackButton = Styled(Button)`
  width: 100%;
  height: 40px;
  borderRadius: 8px;
  backgroundColor: transparent;
`;

const TextTitleView = Styled(View)`
  width: 100%;
  marginBottom: 16px;
  alignItems: flex-start;
`;

const TextDescView = Styled(View)`
  width: 100%;
  marginBottom: 40px;
  alignItems: flex-start;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const inputs = ['email'];

const ForgotPasswordScreen = ({ navigation, route }) => {
  const [state, setState] = useState({
    email: '',
    error: {
      email: null,
    },
    allValid: false,
  });

  const {
    forgetPassword,
    loading,
    error
  } = useSelector(state => state['user.auth']);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [popupProps, showPopup] = usePopup();
  const { Color } = useColor();

  useEffect(() => {
    if (isFocused) {
      if (forgetPassword.status) {
        showPopup('Link Untuk Reset Password sudah dikirim ke email Anda', 'success');
        setTimeout(() => {
          navigation.navigate('LoginScreen', {
            forgotPasswordStatus: true,
            username: state.email,
          });
        }, 2500)
      }
      else if (!forgetPassword.status && error) {
        showPopup('Email Tidak Terdaftar', 'error');
        dispatch({ type: 'USER.LOGOUT' });
      }
    }
  }, [forgetPassword, error, isFocused]);

  useEffect(() => {
    if (state.allValid) {
      dispatch(callForgetPassword(state.email));
    }
  }, [state.allValid]);

  const isValueError = (name) => {
    const error = validate(name, state[name]);
    setState({ ...state, error: { ...state.error, [name]: error } });
  }

  const onSubmit = () => {
    let valid = true;
    const newErrorState = {};

    for (const input of inputs) {
      const error = validate(input, state[input]);
      if (error) valid = false;
      newErrorState[input] = error;
    }

    setState({ ...state, error: newErrorState, allValid: valid });
  }

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <ScrollView>
        <Container>
          <TextTitleView>
            <Text type='semibold' size={24} color={Color.primary} lineHeight={25} letterSpacing={0.3}>Lupa Kata Sandi</Text>
          </TextTitleView>

          <TextDescView>
            <Text size={12} align='left' lineHeight={19} letterSpacing={0.23}>Masukan alamat email yang Anda gunakan untuk login dan kami akan mengirimkan link atur ulang password.</Text>
          </TextDescView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Email</Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder='Masukan Email'
              keyboardType='email-address'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => setState({ ...state, email: text })}
              selectionColor={Color.text}
              value={state.email}
              onBlur={() => isValueError('email')}
              returnKeyType='done'
              onSubmitEditing={() => onSubmit()}
              blurOnSubmit={false}
              style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text color={12} type='medium' color={Color.error} align='left'>{state.error.email}</Text>
          </ErrorView>

          <SignRegisterView>
            <SignButton
              onPress={() => onSubmit()}
            >
              Kirim
            </SignButton>
          </SignRegisterView>

          <BackView>
            <BackButton type='regular' fontColor={Color.primary} onPress={() => navigation.pop()}>Kembali</BackButton>
          </BackView>
        </Container>
      </ScrollView>

      <Loading visible={loading} />

      <Popup {...popupProps} />
    </MainView>
  );
}

export default ForgotPasswordScreen;
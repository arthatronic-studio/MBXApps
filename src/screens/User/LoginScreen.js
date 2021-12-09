import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity as NativeTouchable, ScrollView, SafeAreaView, Image } from 'react-native';
import Styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import {
  Popup, usePopup,
  Loading,
  useColor
} from '@src/components';
import {
  Button,
  TouchableOpacity,
} from '@src/components/Button';
import Text from '@src/components/Text';
import validate from '@src/lib/validate';
import { shadowStyle } from '@src/styles';

import { login } from '@src/state/actions/user/auth';
import { redirectTo } from '@src//utils';

import {
  iconApp,
} from '@assets/images';

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

const CopyrightView = Styled(View)`
  width: 100%;
  height: 45px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: row;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 50;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
  borderRadius: 4px;
  marginTop: 8px;
`;

const PasswordRoundedView = Styled(EmailRoundedView)`
  alignItems: center;
`;

const EyeIconView = Styled(NativeTouchable)`
  height: 15px;
  width: 15px;
  justifyContent: center;
  alignItems: flex-end;
`;

const SignRegisterView = Styled(View)`
  width: 100%;
  marginVertical: 36px;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  borderRadius: 4px;
  padding: 0px 16px 0px 42px;
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

const RememberForgotPasswordContainer = Styled(View)`
  width: 100%;
  flexDirection: row;
  justifyContent: flex-start;
  alignItems: center;
`;

const ForgetPasswordView = Styled(TouchableOpacity)`
  width: 100%;
  height: 100%;
  alignItems: flex-end;
`;

const TextTitleView = Styled(View)`
  width: 100%;
  marginBottom: 40px;
  alignItems: flex-start;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const inputs = ['username', 'password'];

const LoginScreen = ({ navigation, route }) => {
  const [state, changeState] = useState({
    username: '',
    password: '',
    fcm_token: '',
    error: { username: null, password: null },
    showPassword: false,
    isSucceddForgot: false,
    allValid: false,
  });

  const setState = (obj) => {
    changeState({ ...state, ...obj });
  }

  const resetState = (obj) => {
    setState({
      username: '',
      password: '',
      error: { username: null, password: null },
      showPassword: false,
      ...obj,
    });
  }
  
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const user = useSelector(state => state['user.auth'].login.user);
  const {
    register,
    forgetPassword,
    loading,
    error,
  } = useSelector(state => state['user.auth']);

  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();

  const passwordRef = useRef();

  useEffect(() => {
    messaging().getToken().then((res) => {
      console.log('token fcm: ', res);
      setState({ fcm_token: res });
    });
  }, []);

  useEffect(() => {
    if (register.status) {
      dispatch({ type: 'USER.CLEAR_REGISTER' });
      showPopup('Pendaftaran berhasil, silahkan login menggunakan nomor telepon dan password kamu', 'success');
      resetState({});
    }
    else if (forgetPassword.status || (route.params && route.params.forgotPasswordStatus) ) {
      resetState({
        isSucceddForgot: true,
        username: route.params ? route.params.username : '',
      });
      navigation.setParams({ forgotPasswordStatus: false, username: '' });
    }
    else if (route.params && route.params.loginFrom) {
      showPopup('Silahkan Login terlebih dahulu', 'warning');
      resetState({});
    }
    else if (route.params && route.params.logout) {
      navigation.setParams({ logout: false });
      showPopup('Sesi Anda telah habis', 'warning');
      resetState({});
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      if (user && !user.guest) {
        if (route.params && route.params.loginFrom) {
          navigation.pop();
          route.params.afterLogin();
        } else {
          if (state.isSucceddForgot) {
            navigation.navigate('UserChangePassword', { password: state.password });
          } else {
            redirectTo('MainPage');
          }
        }
      }
      else if (!user && error !== '') {
        showPopup('Nomor telepon / Password yang Anda masukan salah atau Terjadi Kesalahan Server', 'error');
        dispatch({ type: 'USER.LOGOUT' });
      }
    }
  }, [user, error, route.params, state.isSucceddForgot, isFocused]);

  useEffect(() => {
    if (state.allValid) {
      setState({ allValid: false });
      dispatch(login(state.username, state.password, state.fcm_token));
    }
  }, [state.allValid])

  const isValueError = (name) => {
    const error = validate(name, state[name]);
    setState({ error: { ...state.error, [name]: error } });
  }

  const signIn = () => {
    let valid = true;
    const newErrorState = {};

    for (const input of inputs) {
      const error = validate(input, state[input]);
      if (error) valid = false;
      newErrorState[input] = error;
    }
    
    setState({ error: newErrorState, allValid: valid });
  }

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <ScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{paddingBottom: 16}}
      >
        <Container>
          <TextTitleView style={{alignItems: 'center'}}>
            <Image source={iconApp} style={{height: 90, width: 90}} />
          </TextTitleView>

          {state.isSucceddForgot && <TextTitleView style={{marginBottom: 16}}>
            <Text size={16} letterSpacing={0.36} align='left' style={{color: Color.info}}>Silakan login dengan kata sandi baru yang telah dikirimkan ke email Kamu</Text>
          </TextTitleView>}

          <EmailRoundedView style={{backgroundColor: Color.textInput, ...shadowStyle}}>
            <CustomTextInput
              placeholder='Email atau No. Telepon'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => setState({ username: text })}
              selectionColor={Color.text}
              value={state.username}
              onBlur={() => isValueError('username')}
              returnKeyType='next'
              onSubmitEditing={() => passwordRef.current.focus()}
              blurOnSubmit={false}
              keyboardType='default'
              style={{color: Color.text}}
            />
            <View style={{position: 'absolute', bottom: 0, left: 0, paddingLeft: 16, height: '100%', width: '10%', justifyContent: 'center', alignItems: 'flex-start'}}>
              <EyeIconView onPress={() => setState({ showPassword: !state.showPassword })}>
                <Ionicons size={14} name='person' color={Color.gray} />
              </EyeIconView>
            </View>
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{state.error.username}</Text>
          </ErrorView>

          <PasswordRoundedView style={{backgroundColor: Color.textInput, ...shadowStyle}}>
            <CustomTextInput
              ref={passwordRef}
              secureTextEntry={!state.showPassword}
              placeholder='Kata Sandi'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => setState({ password: text })}
              selectionColor={Color.text}
              value={state.password}
              onBlur={() => isValueError('password')}
              returnKeyType='send'
              onSubmitEditing={() => signIn()}
              blurOnSubmit={false}
              keyboardType='default'
              style={{color: Color.text}}
            />
            <View style={{position: 'absolute', bottom: 0, left: 0, paddingLeft: 16, height: '100%', width: '10%', justifyContent: 'center', alignItems: 'flex-start'}}>
              <EyeIconView onPress={() => setState({ showPassword: !state.showPassword })}>
                <SimpleLineIcons size={14} name='lock' color={Color.gray} />
              </EyeIconView>
            </View>
            <View style={{position: 'absolute', bottom: 0, right: 0, paddingRight: 16, height: '100%', width: '10%', justifyContent: 'center', alignItems: 'flex-end'}}>
              <EyeIconView onPress={() => setState({ showPassword: !state.showPassword })}>
                <Ionicons size={16} name={state.showPassword ? 'eye-off' : 'eye'} color={Color.gray} />
              </EyeIconView>
            </View>
          </PasswordRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{state.error.password}</Text>
          </ErrorView>

          <RememberForgotPasswordContainer>
            <ForgetPasswordView activeOpacity={1} onPress={() => navigation.navigate('ForgotPasswordScreen')}>
              <Text type='semibold' color={Color.primary}>Forgot password?</Text>
            </ForgetPasswordView>
          </RememberForgotPasswordContainer>

          <SignRegisterView>
            <SignButton
              onPress={() => signIn()}
            >
              Login
            </SignButton>
          </SignRegisterView>

          <CopyrightView>
            <Text letterSpacing={0.12}>Don't have an account? </Text>
            <Text type='semibold' color={Color.primary} letterSpacing={0.12} onPress={() => navigation.navigate('RegisterScreen')}>Register now</Text>
          </CopyrightView>
        </Container>
      </ScrollView>

      <Loading visible={loading} />

      <Popup {...popupProps} />
    </MainView>
  );
}

export default LoginScreen;

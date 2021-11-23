import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, BackHandler, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Button,
  Text,
  Popup, usePopup,
  Loading,
  useColor
} from '@src/components';
import validate from '@src/lib/validate';

import { callChangePassword } from '@src/state/actions/user/auth';
import { redirectTo } from '@src/utils';

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

const TextTitleView = Styled(View)`
  width: 100%;
  marginBottom: 32px;
  alignItems: flex-start;
`;

const InputView = Styled(View)`
  width: 100%;
  height: 50px;
  alignItems: flex-start;
  justifyContent: center;
`;
 
const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontSize: 14px;
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  borderBottomWidth: 1px;
  borderColor: #666666;
`;

const ErrorView = Styled(View)`
  width: 100%;
  paddingVertical: 4px;
  alignItems: flex-start;
`;

const EyeIconView = Styled(TouchableOpacity)`
  height: 15px;
  width: 15px;
  justifyContent: center;
  alignItems: flex-end;
`;

const SignRegisterView = Styled(View)`
  width: 100%;
  marginTop: 70px;
`;

const SignButton = Styled(Button)`
  width: 100%;
  height: 45px;
  borderRadius: 4px;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const UserChangePassword = ({ navigation, route }) => {
  const [state, changeState] = useState({
    password0: route.params ? route.params.password : '',
    password: '',
    password2: '',
    error: {
      password0: null,
      password: null,
      password2: null,
    },
    showPasswordOld: false,
    showPasswordNew: false,
    showPasswordConfirm: false,
    canGoBack: route.params && route.params.canGoBack,
    allValid: false,
  });

  const user = useSelector(state => state['user.auth'].login.user);
  const {
    changePassword,
    loading,
    error
  } = useSelector(state => state['user.auth']);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();

  const passwordRef = useRef();
  const password2Ref = useRef();

  const setState = (obj) => {
    changeState({ ...state, ...obj });
  }

  useEffect(() => {
    if (!state.canGoBack) {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    }

    return () => {
      if (!state.canGoBack) {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }
  }, []);

  const handleBackPress = () => {
    return true;
  }

  useEffect(() => {
    if (isFocused) {
      if (changePassword.status) {
        showPopup('Password Berhasil Diubah', 'success');
        setTimeout(() => {
          redirectTo('MainPage');
        }, 2500);
      }
      else if (error) {
        showPopup('Gagal Merubah Password', 'error');
        dispatch({ type: 'USER.LOGOUT' });
      }
    }
  }, [changePassword, error, isFocused]);

  useEffect(() => {
    if (state.allValid) {
      dispatch(callChangePassword(user.email, state.password0, state.password));
    }
  }, [state.allValid]);

  const isValueError = (name) => {
    if (name === 'password2' && state.password !== state.password2) {
      setState({ error: { ...state.error, [name]: 'Konfirmasi password tidak cocok' } });
    } else {
      const error = validate(name, state[name]);
      setState({ error: { ...state.error, [name]: error } });
    }
  }

  const onSubmit = () => {
    let valid = true;
    const newErrorState = {};
    const arrInput = ['password0', 'password', 'password2'];

    for (const input of arrInput) {
      const error = validate(input, state[input]);
      if (error) valid = false;
      newErrorState[input] = error;
    }

    if (valid && state.password !== state.password2) {
      valid = false;
      newErrorState.password2 = 'Konfirmasi password tidak cocok';
    }

    setState({ error: newErrorState, allValid: valid });
  }
    
  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <ScrollView keyboardShouldPersistTaps='handled'>
        <Container>
          <TextTitleView>
            <Text type='semibold' size={24} lineHeight={31} letterSpacing={0.36}>Ubah Password</Text>
          </TextTitleView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Kata Sandi Lama</Text>
          </LabelInput>
          <InputView>
            <CustomTextInput
              placeholder='Masukan kata sandi lama'
              placeholderTextColor={Color.gray}
              keyboardType='default'
              underlineColorAndroid='transparent'
              secureTextEntry={!state.showPasswordOld}
              autoCorrect={false}
              onChangeText={(password0) => setState({ password0 })}
              value={state.password0}
              selectionColor={Color.text}
              onBlur={() => isValueError('password0')}
              returnKeyType='next'
              onSubmitEditing={() => passwordRef.current.focus()}
              blurOnSubmit={false}
              style={{color: Color.text}}
            />
            <View style={{position: 'absolute', bottom: 0, right: 0, paddingRight: 8, height: '100%', width: '10%', justifyContent: 'center', alignItems: 'flex-end'}}>
              <EyeIconView onPress={() => setState({ showPasswordOld: !state.showPasswordOld })}>
                <Ionicons size={16} name={state.showPasswordOld ? 'eye-off' : 'eye'} color={Color.gray} />
              </EyeIconView>
            </View>
          </InputView>
          <ErrorView>
            <Text size={12} type='medium' color={Color.error} align='left'>{state.error.password0}</Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Kata Sandi Baru</Text>
          </LabelInput>
          <InputView>
            <CustomTextInput
              ref={passwordRef}
              placeholder='Masukan kata sandi baru'
              placeholderTextColor={Color.gray}
              keyboardType='default'
              secureTextEntry={!state.showPasswordNew}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(password) => setState({ password })}
              value={state.password}
              selectionColor={Color.text}
              onBlur={() => isValueError('password')}
              returnKeyType='next'
              onSubmitEditing={() => password2Ref.current.focus()}
              blurOnSubmit={false}
              style={{color: Color.text}}
            />
            <View style={{position: 'absolute', bottom: 0, right: 0, paddingRight: 8, height: '100%', width: '10%', justifyContent: 'center', alignItems: 'flex-end'}}>
              <EyeIconView onPress={() => setState({ showPasswordNew: !state.showPasswordNew })}>
                <Ionicons size={16} name={state.showPasswordNew ? 'eye-off' : 'eye'} color={Color.gray} />
              </EyeIconView>
            </View>
          </InputView>
          <ErrorView>
            <Text size={12} type='medium' color={Color.error} align='left'>{state.error.password}</Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Konfirmasi Kata Sandi</Text>
          </LabelInput>
          <InputView>
            <CustomTextInput
              ref={password2Ref}
              placeholder='Masukan ulang kata sandi baru'
              placeholderTextColor={Color.gray}
              keyboardType='default'
              secureTextEntry={!state.showPasswordConfirm}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(password2) => setState({ password2 })}
              value={state.password2}
              selectionColor={Color.text}
              onBlur={() => isValueError('password2')}
              returnKeyType='done'
              onSubmitEditing={() => onSubmit()}
              blurOnSubmit={false}
              style={{color: Color.text}}
            />
            <View style={{position: 'absolute', bottom: 0, right: 0, paddingRight: 8, height: '100%', width: '10%', justifyContent: 'center', alignItems: 'flex-end'}}>
              <EyeIconView onPress={() => setState({ showPasswordConfirm: !state.showPasswordConfirm })}>
                <Ionicons size={16} name={state.showPasswordConfirm ? 'eye-off' : 'eye'} color={Color.gray} />
              </EyeIconView>
            </View>
          </InputView>
          <ErrorView>
            <Text size={12} type='medium' color={Color.error} align='left'>{state.error.password2}</Text>
          </ErrorView>

          <SignRegisterView>
            <SignButton
              onPress={() => onSubmit()}
            >
              Ubah
            </SignButton>
          </SignRegisterView>
          {user && state.canGoBack && <View style={{width: '100%', marginTop: 12}}>
            <SignButton style={{backgroundColor: 'transparent'}} onPress={() => navigation.pop()}>
              <Text color={Color.primary}>Kembali</Text>
            </SignButton>
          </View>}
        </Container>
      </ScrollView>

      <Loading visible={loading} />

      <Popup {...popupProps} />
    </MainView>
  );
}

export default UserChangePassword;

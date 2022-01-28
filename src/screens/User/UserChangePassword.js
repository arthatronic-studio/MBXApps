import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity as NativeTouchable, BackHandler } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Button,
  Text,
  usePopup,
  useColor,
  Scaffold
} from '@src/components';
import validate from '@src/lib/validate';
import { callChangePassword } from '@src/state/actions/user/auth';
import { redirectTo } from '@src/utils';
import { Container, Divider } from 'src/styled';
import FormInput from 'src/components/FormInput';

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
      // else if (error) {
      //   showPopup('Gagal Merubah Password', 'error');
      //   dispatch({ type: 'USER.LOGOUT' });
      // }
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
    <Scaffold
      headerTitle=''
      popupProps={popupProps}
      fallback={loading}
    >
      <ScrollView
        keyboardShouldPersistTaps='handled'
      >
        <Container padding={16} marginTop={36}>
          <Container marginBottom={32}>
            <Text type='semibold' size={24} align='left' lineHeight={31} letterSpacing={0.36}>Ubah Password</Text>
          </Container>

          <FormInput
            secureTextEntry={!state.showPasswordOld}
            label='Kata Sandi Lama'
            placeholder='******'
            value={state.password0}
            onChangeText={(password0) => setState({ password0 })}
            onBlur={() => isValueError('password0')}
            returnKeyType='next'
            keyboardType='default'
            onSubmitEditing={() => passwordRef.current.focus()}
            error={state.error.password0}
            suffixIcon={
              <View style={{width: '10%', justifyContent: 'center', alignItems: 'flex-end'}}>
                <NativeTouchable
                  onPress={() => setState({ showPasswordOld: !state.showPasswordOld })}
                  style={{
                    height: 15,
                    width: 15,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}
                >
                  <Ionicons size={16} name={state.showPasswordOld ? 'eye-off' : 'eye'} color={Color.gray} />
                </NativeTouchable>
              </View>
            }
          />

          <FormInput
            ref={passwordRef}
            secureTextEntry={!state.showPasswordNew}
            label='Kata Sandi Baru'
            placeholder='******'
            value={state.password}
            onChangeText={(password) => setState({ password })}
            onBlur={() => isValueError('password')}
            returnKeyType='next'
            keyboardType='default'
            onSubmitEditing={() => password2Ref.current.focus()}
            error={state.error.password}
            suffixIcon={
              <View style={{width: '10%', justifyContent: 'center', alignItems: 'flex-end'}}>
                <NativeTouchable
                  onPress={() => setState({ showPasswordNew: !state.showPasswordNew })}
                  style={{
                    height: 15,
                    width: 15,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}
                >
                  <Ionicons size={16} name={state.showPasswordNew ? 'eye-off' : 'eye'} color={Color.gray} />
                </NativeTouchable>
              </View>
            }
          />

          <FormInput
            ref={password2Ref}
            secureTextEntry={!state.showPasswordConfirm}
            label='Konfirmasi Kata Sandi'
            placeholder='******'
            value={state.password2}
            onChangeText={(password2) => setState({ password2 })}
            onBlur={() => isValueError('password2')}
            returnKeyType='done'
            keyboardType='default'
            onSubmitEditing={() => onSubmit()}
            error={state.error.password2}
            suffixIcon={
              <View style={{width: '10%', justifyContent: 'center', alignItems: 'flex-end'}}>
                <NativeTouchable
                  onPress={() => setState({ showPasswordConfirm: !state.showPasswordConfirm })}
                  style={{
                    height: 15,
                    width: 15,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}
                >
                  <Ionicons size={16} name={state.showPasswordConfirm ? 'eye-off' : 'eye'} color={Color.gray} />
                </NativeTouchable>
              </View>
            }
          />

          <Divider height={24} />

          <Button onPress={() => onSubmit()}>
            Ubah
          </Button>

          {/* {user && state.canGoBack && <View style={{width: '100%', marginTop: 12}}>
            <SignButton style={{backgroundColor: 'transparent'}} onPress={() => navigation.pop()}>
              <Text color={Color.primary}>Kembali</Text>
            </SignButton>
          </View>} */}
        </Container>
      </ScrollView>
    </Scaffold>
  );
}

export default UserChangePassword;
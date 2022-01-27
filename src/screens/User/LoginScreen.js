import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity as NativeTouchable,
  ScrollView,
  useWindowDimensions,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import {
  usePopup,
  useColor,
  Scaffold,
} from '@src/components';
import {Button, TouchableOpacity} from '@src/components/Button';
import Text from '@src/components/Text';
import validate from '@src/lib/validate';
import {login} from '@src/state/actions/user/auth';
import {redirectTo} from '@src//utils';
import {iconApp} from '@assets/images';
import FormInput from 'src/components/FormInput';
import { Container, Row, Line } from 'src/styled';

const inputs = ['username', 'password'];

const LoginScreen = ({navigation, route}) => {
  const [state, changeState] = useState({
    username: '',
    password: '',
    fcm_token: '',
    error: {username: null, password: null},
    showPassword: false,
    isSucceddForgot: false,
    allValid: false,
  });

  const setState = obj => {
    changeState({...state, ...obj});
  };

  const resetState = obj => {
    setState({
      username: '',
      password: '',
      error: {username: null, password: null},
      showPassword: false,
      ...obj,
    });
  };

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {height, width} = useWindowDimensions();

  const user = useSelector(state => state['user.auth'].login.user);
  const {register, forgetPassword, loading, error} = useSelector(
    state => state['user.auth'],
  );

  const {Color} = useColor();
  const [popupProps, showPopup] = usePopup();

  const passwordRef = useRef();

  useEffect(() => {
    messaging()
      .getToken()
      .then(res => {
        console.log('token fcm: ', res);
        setState({fcm_token: res});
      });
  }, []);

  useEffect(() => {
    if (register.status) {
      dispatch({type: 'USER.CLEAR_REGISTER'});
      showPopup(
        'Pendaftaran berhasil, silahkan login menggunakan nomor telepon dan password kamu',
        'success',
      );
      resetState({});
    } else if (
      forgetPassword.status ||
      (route.params && route.params.forgotPasswordStatus)
    ) {
      resetState({
        isSucceddForgot: true,
        username: route.params ? route.params.username : '',
      });
      navigation.setParams({forgotPasswordStatus: false, username: ''});
    } else if (route.params && route.params.loginFrom) {
      showPopup('Silahkan Login terlebih dahulu', 'warning');
      resetState({});
    } else if (route.params && route.params.logout) {
      navigation.setParams({logout: false});
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
            navigation.navigate('UserChangePassword', {
              password: state.password,
            });
          } else {
            redirectTo('MainPage');
          }
        }
      } else if (!user && error !== '') {
        showPopup(
          'Nomor telepon / Password yang Anda masukan salah atau Terjadi Kesalahan Server',
          'error',
        );
        dispatch({type: 'USER.LOGOUT'});
      }
    }
  }, [user, error, route.params, state.isSucceddForgot, isFocused]);

  useEffect(() => {
    if (state.allValid) {
      setState({allValid: false});
      dispatch(login(state.username, state.password, state.fcm_token));
    }
  }, [state.allValid]);

  const isValueError = name => {
    const error = validate(name, state[name]);
    setState({error: {...state.error, [name]: error}});
  };

  const signIn = () => {
    let valid = true;
    const newErrorState = {};

    for (const input of inputs) {
      const error = validate(input, state[input]);
      if (error) valid = false;
      newErrorState[input] = error;
    }

    setState({error: newErrorState, allValid: valid});
  };

  return (
    <Scaffold
      header={<View />}
      popupProps={popupProps}
      fallback={loading}
    >
      <Image
        source={iconApp}
        style={{
          resizeMode: 'contain',
          height: '30%',
          width: '60%',
          marginTop: '10%',
          alignSelf: 'center',
          position: 'absolute',
        }}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: height / 3,
          paddingBottom: height / 3,
          backgroundColor: Color.theme
        }}
      >
        <View
          style={{
            borderColor: Color.border,
            borderWidth: 0.5,
            borderBottomWidth: 0,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <Container padding={16}>
            <Container marginTop={24} marginBottom={48}>
              <Text align='left' size={24} type='semibold'>Masuk</Text>
            </Container>

            {state.isSucceddForgot && (
              <View
                style={{
                  width: '100%',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}
              >
                <Text
                  size={16}
                  letterSpacing={0.36}
                  align="left"
                  style={{color: Color.info}}
                >
                  Silakan login dengan kata sandi baru yang telah dikirimkan ke email Kamu
                </Text>
              </View>
            )}

            <FormInput
              label='Email atau No. Telepon'
              placeholder='contoh@email.com'
              value={state.username}
              onChangeText={text => setState({username: text})}
              onBlur={() => isValueError('username')}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current.focus()}
              keyboardType="default"
              error={state.error.username}
            />

            <FormInput
              ref={passwordRef}
              secureTextEntry={!state.showPassword}
              label='Kata Sandi'
              placeholder='******'
              value={state.password}
              onChangeText={text => setState({password: text})}
              onBlur={() => isValueError('password')}
              returnKeyType="send"
              onSubmitEditing={() => signIn()}
              keyboardType="default"
              error={state.error.password}
              suffixIcon={
                <View
                  style={{
                    width: '10%',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <NativeTouchable
                    onPress={() => setState({showPassword: !state.showPassword})}
                    style={{
                      height: 15,
                      width: 15,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}
                  >
                    <Ionicons
                      size={16}
                      name={state.showPassword ? 'eye-off' : 'eye'}
                      color={Color.gray}
                    />
                  </NativeTouchable>
                </View>
              }
            />

            <Container paddingTop={4} paddingBottom={30}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
                style={{
                  width: '100%',
                  alignItems: 'flex-end',
                }}
              >
                <Text type="semibold" color={Color.primary}>
                  Lupa Kata Sandi?
                </Text>
              </TouchableOpacity>
            </Container>

            <Button
              onPress={() => signIn()}
            >
              Masuk
            </Button>

            <Container paddingVertical={24}>
              <Row justify='space-between'>
                <Line height={1} width='40%' color={Color.placeholder} />
                <Text size={12}>Atau</Text>
                <Line height={1} width='40%' color={Color.placeholder} />
              </Row>
            </Container>

            <Button
              color={Color.secondary}
              onPress={() => navigation.navigate('RegisterScreen')}
            >
              Daftar
            </Button>
          </Container>
        </View>
      </ScrollView>
    </Scaffold>
  );
};

export default LoginScreen;

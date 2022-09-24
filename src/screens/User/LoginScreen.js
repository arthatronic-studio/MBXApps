import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity as NativeTouchable,
  useWindowDimensions,
  Platform,
  Keyboard,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  usePopup,
  useColor,
  Scaffold,
  HeaderBig,
} from '@src/components';
import {Button, TouchableOpacity} from '@src/components/Button';
import Text from '@src/components/Text';
import validate from '@src/lib/validate';
import {guestLogin, login} from '@src/state/actions/user/auth';
import {redirectTo} from '@src//utils';
import FormInput from 'src/components/FormInput';
import { Container, Row, Line, Divider } from 'src/styled';
import PopupTermCondition from 'src/components/PopupTermCondition';
import WidgetBgFixIcon from './WidgetBgFixIcon';
import { accessClient } from 'src/utils/access_client';
import imageAssets, { iconApp } from 'assets/images';
import { postNonAuth } from 'src/api-rest/httpService';

const inputs = ['username', 'password'];
const shouldChangePassword = ['tribes123'];

const LoginScreen = ({navigation, route}) => {
  const [state, changeState] = useState({
    username: '',
    password: '000000',
    fcm_token: '',
    error: {username: null, password: null},
    showPassword: false,
    isSucceddForgot: false,
    allValid: false,
  });

  const [modalTerm, setModalTerm] = useState(false);
  const [fallback, setFallback] = useState(false);

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
  const shouldUpdateProfile = user && !user.firstName && (!user.email || user.email === 'test@mail.com');
  const {Color} = useColor();
  const [popupProps, showPopup] = usePopup();

  const passwordRef = useRef();

  useEffect(() => {
    if (route.params && route.params.triggerRegister) {
      navigation.setParams({ triggerRegister: false });
      
      // if (accessClient.isThisable) {
      //   setModalRegister(true);
      //   return;
      // }
    }
  }, [route.params]);


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

  // useEffect(() => {
  //   if (isFocused) {
  //     if (user && !user.guest) {
  //       if (route.params && route.params.loginFrom) {
  //         navigation.pop();
  //         route.params.afterLogin();
  //       } else {
  //         if (state.isSucceddForgot) {
  //           navigation.navigate('UserChangePassword', {
  //             password: state.password,
  //           });
  //           dispatch({ type: 'USER.CHANGE_PASSWORD', status: false });
  //         } else {
  //           showPopup(
  //             'Berhasil masuk',
  //             'success',
  //           );
  //           setTimeout(() => {
  //             if (shouldChangePassword.includes(state.password)) {
  //               navigation.navigate('UserChangePassword', {
  //                 password: state.password,
  //                 canGoBack: false,
  //               });
  //               dispatch({ type: 'USER.CHANGE_PASSWORD', status: false });
  //             } else if (shouldUpdateProfile) {
  //               redirectTo('ChangeProfile');
  //             } else {
  //               // setModalTerm(true);
  //               redirectTo('MainPage');
  //             }
  //           }, 1000);
  //         }
  //       }
  //     }
  //     else if (user && user.guest) {
  //       // Alert('Guest Login', 'Login sebagai Tamu?', () => redirectTo('MainPage'));
  //       redirectTo('MainPage');
  //     }
  //     else if (!user && error !== '') {
  //       showPopup(
  //         'Nomor telepon / Password yang Anda masukan salah atau Terjadi Kesalahan Server',
  //         'error',
  //       );
  //       dispatch({type: 'USER.LOGOUT'});
  //     }
  //   }
  // }, [user, error, route.params, state.isSucceddForgot, isFocused]);

  useEffect(() => {
    if (state.allValid) {
      setState({allValid: false});
      dispatch(login('082216981621' || state.username, state.password, state.fcm_token));
    }
  }, [state.allValid]);

  const onSubmitRest = async() => {
    const body = {
      phone: '62' + state.username,
    };

    setFallback(true);

    const result = await postNonAuth('otp', body);
    console.log('result otp', result);

    setFallback(false);

    if (result.status) {
      navigation.navigate('OtpScreen', { body, mustDelete: result.data });
      return;
    }

    showPopup(result.message, 'error');
  }

  const isValueError = name => {
    const error = validate(name, state[name]);
    setState({error: {...state.error, [name]: error}});
  };

  const signIn = () => {
    Keyboard.dismiss();

    let valid = true;
    const newErrorState = {};

    for (const input of inputs) {
      const error = validate(input, state[input]);
      if (error) valid = false;
      newErrorState[input] = error;
    }

    onSubmitRest();
    // setState({error: newErrorState, allValid: valid});
    setState({allValid: valid});
  };

  return (
    <Scaffold
      showHeader={false}
      // header={
      //   <HeaderBig
      //     title='Login'
      //     titleRight='Register'
      //     titleRightColor={Color.primarySoft}
      //     onPressRightButton={() => {
      //       navigation.navigate('RegisterScreen');
      //       dispatch({ type: 'USER.REGISTER', status: false });
      //     }}
      //     style={{ backgroundColor: 'transparent', paddingTop: 16 }}
      //   />
      // }
      popupProps={popupProps}
      fallback={loading}
      statusBarColor={Color.primary}
      translucent={Platform.OS === 'ios' ? false : true}
      useSafeArea={Platform.OS === 'ios' ? false : false}
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: Color.theme
        }}
      >
        <WidgetBgFixIcon />

        <View
          style={{
            // borderColor: Color.border,
            // borderWidth: 0.5,
            // borderBottomWidth: 0,
            // borderTopLeftRadius: 16,
            // borderTopRightRadius: 16,
          }}
        >
          <Container padding={16}>
            {/* <Container marginTop={24} marginBottom={48}>
              <Text align='left' size={24} type='semibold'>Masuk</Text>
            </Container> */}

            <View>
              <Image
                source={iconApp}
                style={{
                  width: width / 5,
                  height: width / 5,
                }}
              />
            </View>

            <Divider height={24} />

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

            <Container>
              <Text align='left' size={28}>
                Hello There!
              </Text>
              <Text align='left'>
                Silakan masukan nomor telepon Anda untuk masuk ke aplikasi
              </Text>
            </Container>

            <Divider height={32} />

            <FormInput
              label='No. Telepon'
              placeholder='851-XXXX-XXXX'
              value={state.username}
              onChangeText={(text) => {
                console.log('state.username', state.username.length, typeof text);
                if ((state.username.length <= 0 && text == 0) || isNaN(parseInt(text))) {
                  return;
                }
                setState({username: text});
              }}
              onBlur={() => isValueError('username')}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current ? passwordRef.current.focus() : onSubmitRest()}
              keyboardType="numeric"
              error={state.error.username}
              prefixIcon={
                <View style={{width: '10%'}}>
                  <Text align='left' color={Color.textSoft}>+62</Text>
                </View>
              }
            />

            {/* <FormInput
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
                    <Image
                      source={imageAssets.eyeSlash}
                      style={{
                        height: 24,
                        width: 24,
                        opacity: state.showPassword ? 0.5 : 1,
                      }}
                    />
                  </NativeTouchable>
                </View>
              }
            /> */}

            {/* <Container paddingBottom={24}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate('ForgotPasswordScreen');
                  dispatch({ type: 'USER.FORGET_PASSWORD', status: false });
                }}
                style={{
                  width: '100%',
                  alignItems: 'flex-end',
                }}
              >
                <Text type="semibold" color={Color.primarySoft}>
                  Lupa Password?
                </Text>
              </TouchableOpacity>
            </Container> */}

            <Button
              onPress={() => signIn()}
            >
              Login
            </Button>

            {/* {accessClient.LoginScreen.guesMode && <Container paddingTop={16}>
              <Button
                outline
                onPress={() => {
                  dispatch(guestLogin());
                }}
              >
                Guest Mode
              </Button>
            </Container>} */}
          </Container>
        </View>
      </KeyboardAwareScrollView>

      <PopupTermCondition
        visible={modalTerm}
        onClose={() => {
          setModalTerm(false);
          redirectTo('MainPage');
        }}
        onSubmit={() => {
          setModalTerm(false);
          redirectTo('MainPage');
        }}
      />
    </Scaffold>
  );
};

export default LoginScreen;

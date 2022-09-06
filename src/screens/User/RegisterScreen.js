import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity as NativeTouchable,
  useWindowDimensions,
  Platform,
  Keyboard,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  Text,
  usePopup,
  useColor,
  Scaffold,
  Header,
  useLoading,
} from '@src/components';
import { Button, TouchableOpacity } from '@src/components/Button';
import validate from '@src/lib/validate';
import { register as onRegister } from '@src/state/actions/user/auth';
import { Column, Container, Divider, Row } from 'src/styled';
import FormInput from 'src/components/FormInput';
import WidgetBgFixIcon from './WidgetBgFixIcon';
import { statusBarHeight } from 'src/utils/constants';
import { accessClient } from 'src/utils/access_client';
import imageAssets from 'assets/images';
import { postAPI } from 'src/api-rest/httpService';
import { redirectTo } from 'src/utils';
import { stateUpdateProfile } from 'src/api-rest/stateUpdateProfile';

const inputs = ['fullName', 'email', 'username', 'password', 'password2'];

const listGender = [
  { id: 'male', name: 'Laki-laki' },
  { id: 'female', name: 'Perempuan' },
];

const RegisterScreen = ({ navigation, route }) => {
  const [state, changeState] = useState({
    userData: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      password2: '',
      phoneCountryCode: '62',
      phoneNumber: '',
      birthOfDate: '',
    },
    error: {
      fullName: null,
      email: null,
      username: null,
      password: null,
      password2: null,
    },
    showPassword: false,
    allValid: false,
  });
  const [selectedJK, setSelectedJK] = useState(listGender[0]);

  const setState = obj => {
    changeState({ ...state, ...obj });
  };

  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const passwordConfRef = useRef();

  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const { register, loading, error } = useSelector(state => state['user.auth']);
  const auth = useSelector(state => state['auth']);

  console.log('auth',auth);

  const { Color } = useColor();
  const isFocused = useIsFocused();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  useEffect(() => {
    if (isFocused) {
      if (register.status) {
        navigation.pop();
      } else if (!register.status && error) {
        showPopup(error.trim(), 'error');
        dispatch({ type: 'USER.LOGOUT' });
      }
    }
  }, [register, error, isFocused]);

  useEffect(() => {
    if (state.allValid) {
      setState({ allValid: false });

      const {
        fullName,
        username,
        email,
        password,
        phoneCountryCode,
        phoneNumber,
      } = state.userData;

      const nameSplit = fullName.split(' ');
      let lastName = '';
      if (nameSplit[1]) {
        nameSplit.map((e, i) => {
          if (i !== 0) lastName += e + ' ';
        });
      }

      const newUserData = {
        username,
        firstName: nameSplit[0],
        lastName: lastName.trim(),
        email,
        password,
        phoneCountryCode,
        phoneNumber,
      };

      dispatch(onRegister(newUserData));
    }
  }, [state.allValid]);

  const isValueError = name => {
    const error = validate(name, state.userData[name]);
    setState({ error: { ...state.error, [name]: error } });
  };

  const onChangeUserData = (key, val) => {
    setState({ userData: { ...state.userData, [key]: val } });
  };

  const onSubmit = async() => {
    const body = {
      name: state.userData.fullName,
      email: state.userData.email,
      gender: selectedJK.id,
      dob: null,
    };

    const result = await stateUpdateProfile(body);
    console.log('result', result);
    if (result) {
      showLoading('success', 'Pendaftaran Berhasil');

      setTimeout(() => {
        redirectTo('MainPage');
      }, 2500);
      return;
    }

    showLoading('error', 'Pendaftaran Gagal');
    
    return;
    Keyboard.dismiss();

    let valid = true;
    const newErrorState = {};
    const { password, password2 } = state.userData;

    for (const input of inputs) {
      const error = validate(input, state.userData[input]);
      if (error) valid = false;
      newErrorState[input] = error;
    }

    if (password !== password2) {
      valid = false;
      newErrorState.password2 = 'Konfirmasi password tidak sama';
    }

    setState({ error: newErrorState, allValid: valid });
  };

  const renderRadio = ({ label, data, selected, flexDirection, onSelected }) => {
    return (
      <View style={{ alignItems: 'flex-start', marginBottom: 16 }}>
        <Text
          align='left'
          type='medium'
          size={12}
          color={Color.textSoft}
          style={{ marginBottom: 12 }}
        >
          {label}
        </Text>

        <View
          style={{
            flexDirection,
          }}
        >
          {data.map((v, id) => {
            const isSelected = selected && v.id === selected.id;

            return (
              <TouchableOpacity
                key={id}
                onPress={() => {
                  onSelected(v);
                }}
                style={{ paddingRight: 16, marginBottom: 8 }}
              >
                <Row align='center'>
                  <View
                    style={{ height: 18, width: 18, borderRadius: 18 / 2, borderWidth: 1, borderColor: Color.text, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center' }}
                  >
                    {isSelected && <View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: Color.primary }} />}
                  </View>
                  <Container paddingLeft={8}>
                    <Text size={12}>{v.name}</Text>
                  </Container>
                </Row>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <Scaffold
      header={
        <Header
          actions={
            <TouchableOpacity
              onPress={() => redirectTo('MainPage')}
            >
              <Text>
                Skip
              </Text>
            </TouchableOpacity>
          }
        />
      }
      popupProps={popupProps}
      loadingProps={loadingProps}
      fallback={loading}
    // statusBarColor={Color[accessClient.ColorBgParallax]}
    // translucent={Platform.OS === 'ios' ? true : isFocused}
    // useSafeArea={Platform.OS === 'ios' ? false : true}
    >
      {/* <WidgetBgFixIcon /> */}

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // marginTop: 36, // height / 3,
          // paddingBottom: height / 3,
          backgroundColor: Color.theme
        }}
      >
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
            <Container marginBottom={24}>
              <Text align='left' size={24} type='semibold'>Daftar</Text>
            </Container>

            <FormInput
              label='Nama Lengkap'
              placeholder='Adang Susanyo'
              value={state.userData.fullName}
              onChangeText={text => onChangeUserData('fullName', text)}
              onBlur={() => isValueError('fullName')}
              returnKeyType="next"
              keyboardType="default"
              onSubmitEditing={() => emailRef.current.focus()}
              error={state.error.fullName}
            />

            {/* hide */}
            {/* <FormInput
              label='Tanggal Lahir'
              placeholder='dd/mm/yyyyy'
              value={state.userData.birthOfDate}
              onChangeText={text => onChangeUserData('birthOfDate', text)}
              onBlur={() => isValueError('fullName')}
              returnKeyType="next"
              keyboardType="default"
              onSubmitEditing={() => emailRef.current.focus()}
              error={state.error.fullName}
              suffixIcon={
                <View style={{ width: '10%' }}>
                  <Text>V</Text>
                </View>
              }
            /> */}

            {/* hide */}
            {/* {renderRadio({
              flexDirection: 'row',
              label: 'Jenis Kelamin',
              data: listGender,
              selected: selectedJK,
              onSelected: (val) => {
                setSelectedJK(val)
              }
            })} */}

            <FormInput
              ref={emailRef}
              label='Email'
              placeholder='contoh@email.com'
              value={state.userData.email}
              onChangeText={text => onChangeUserData('email', text)}
              onBlur={() => isValueError('email')}
              returnKeyType="next"
              keyboardType="email-address"
              // onSubmitEditing={() => phoneRef.current.focus()}
              onSubmitEditing={() => onSubmit()}
              error={state.error.email}
            />

            {/* <FormInput
              ref={phoneRef}
              label='No. Telepon'
              placeholder='81312345678'
              value={state.userData.username}
              onChangeText={text => onChangeUserData('username', text)}
              onBlur={() => isValueError('username')}
              returnKeyType="next"
              keyboardType="default"
              onSubmitEditing={() => passwordRef.current.focus()}
              error={state.error.username}
              prefixIcon={
                <Container paddingRight={8}>
                  <Text>+62</Text>
                </Container>
              }
            /> */}

            {/* <FormInput
              ref={passwordRef}
              secureTextEntry={!state.showPassword}
              label='Kata Sandi'
              placeholder='******'
              value={state.userData.password}
              onChangeText={text => onChangeUserData('password', text)}
              onBlur={() => isValueError('password')}
              returnKeyType="next"
              keyboardType="default"
              onSubmitEditing={() => passwordConfRef.current.focus()}
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

            {/* <FormInput
              ref={passwordConfRef}
              secureTextEntry={!state.showPassword}
              label='Ulangi Kata Sandi'
              placeholder='******'
              value={state.userData.password2}
              onChangeText={text => onChangeUserData('password2', text)}
              onBlur={() => isValueError('password2')}
              returnKeyType="send"
              keyboardType="default"
              onSubmitEditing={() => onSubmit()}
              error={state.error.password2}
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

            {/* <View style={{width: '100%', paddingVertical: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
              <MaterialIcons size={16} name='check-box-outline-blank' color={Color.border} style={{marginRight: 4}} />
              <Text align='left' size={12} color={Color.border}>Saya ingin menerima berita terbaru lewat email</Text>
            </View> */}

            {/* <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
              <MaterialIcons
                size={16}
                name='check-box-outline-blank'
                color={Color.border}
              />
              <View style={{flex: 1, paddingLeft: 8}}>
                <Text
                  align='left'
                  color={Color.border}
                >
                  Saya setuju dengan <Text color={Color.primary}>Syarat & Ketentuan</Text> yang berlaku.
                </Text>
              </View>
            </View> */}

            {/* <Divider height={24} /> */}
          </Container>
        </View>
      </KeyboardAwareScrollView>

      <Container padding={16}>
        <Button
          onPress={() => onSubmit()}
        >
          Daftar
        </Button>
      </Container>

      {/* <Header
        style={{
          position: 'absolute',
          backgroundColor: 'transparent',
          top: statusBarHeight,
        }}
      /> */}
    </Scaffold>
  );
};

export default RegisterScreen;

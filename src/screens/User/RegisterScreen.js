import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity as NativeTouchable,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import {iconApp} from '@assets/images';
import {
  // Button,
  // TouchableOpacity,
  Text,
  Popup,
  usePopup,
  Loading,
  HeaderBig,
  useColor,
} from '@src/components';
import {Button, TouchableOpacity} from '@src/components/Button';
import validate from '@src/lib/validate';

import {register as onRegister} from '@src/state/actions/user/auth';

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
  height: 50px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const PasswordRoundedView = Styled(EmailRoundedView)`
  alignItems: center;
  flexDirection: row;
`;

const EyeIconView = Styled(NativeTouchable)`
  height: 15px;
  width: 15px;
  justifyContent: center;
  alignItems: flex-end;
`;

const SignRegisterView = Styled(View)`
  width: 100%;
  marginTop: 36px;
  marginBottom: 24px;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
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

const inputs = ['fullName', 'email', 'username', 'password', 'password2'];

const RegisterScreen = ({navigation, route}) => {
  const [state, changeState] = useState({
    userData: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      password2: '',
      phoneCountryCode: '62',
      phoneNumber: '',
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

  const setState = obj => {
    changeState({...state, ...obj});
  };

  const dispatch = useDispatch();
  const {register, loading, error} = useSelector(state => state['user.auth']);

  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [popupProps, showPopup] = usePopup();

  useEffect(() => {
    if (isFocused) {
      if (register.status) {
        navigation.pop();
      } else if (!register.status && error) {
        showPopup(error.trim(), 'error');
        dispatch({type: 'USER.LOGOUT'});
      }
    }
  }, [register, error, isFocused]);

  useEffect(() => {
    if (state.allValid) {
      setState({allValid: false});

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
    setState({error: {...state.error, [name]: error}});
  };

  const onChangeUserData = (key, val) => {
    setState({userData: {...state.userData, [key]: val}});
  };

  const onSubmit = () => {
    let valid = true;
    const newErrorState = {};
    const {password, password2} = state.userData;

    for (const input of inputs) {
      const error = validate(input, state.userData[input]);
      if (error) valid = false;
      newErrorState[input] = error;
    }

    if (password !== password2) {
      valid = false;
      newErrorState.password2 = 'Konfirmasi password tidak sama';
    }

    setState({error: newErrorState, allValid: valid});
  };

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 16}}>
        <HeaderBig style={{paddingTop: 16}} />
        <Container>
          <Image
            source={iconApp}
            style={{resizeMode: 'contain', height: '30%', width: '60%'}}
          />
          <TextTitleView>
            <Text
              type="semibold"
              color={Color.primary}
              size={24}
              lineHeight={31}
              letterSpacing={0.36}>
              Daftar Akun
            </Text>
          </TextTitleView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
              Nama Lengkap
            </Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder="Masukan nama lengkap"
              keyboardType="default"
              placeholderTextColor={Color.gray}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              onChangeText={text => onChangeUserData('fullName', text)}
              selectionColor={Color.text}
              value={state.userData.fullName}
              onBlur={() => isValueError('fullName')}
              style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type="medium" align="left">
              {state.error.fullName}
            </Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
              Email
            </Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder="Masukan email"
              keyboardType="email-address"
              placeholderTextColor={Color.gray}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              onChangeText={text => onChangeUserData('email', text)}
              selectionColor={Color.text}
              value={state.userData.email}
              onBlur={() => isValueError('email')}
              style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type="medium" align="left">
              {state.error.email}
            </Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
              Nomor Telepon
            </Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder="Masukan nomor telepon"
              keyboardType="default"
              placeholderTextColor={Color.gray}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              onChangeText={text => onChangeUserData('username', text)}
              selectionColor={Color.text}
              value={state.userData.username}
              onBlur={() => isValueError('username')}
              style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type="medium" align="left">
              {state.error.username}
            </Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
              Kata Sandi
            </Text>
          </LabelInput>
          <PasswordRoundedView>
            <CustomTextInput
              placeholder="Masukan kata sandi"
              placeholderTextColor={Color.gray}
              keyboardType="default"
              underlineColorAndroid="transparent"
              autoCorrect={false}
              secureTextEntry={!state.showPassword}
              onChangeText={text => onChangeUserData('password', text)}
              selectionColor={Color.text}
              value={state.userData.password}
              onBlur={() => isValueError('password')}
              style={{color: Color.text}}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                paddingRight: 8,
                height: '100%',
                width: '10%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <EyeIconView
                onPress={() => setState({showPassword: !state.showPassword})}>
                <Ionicons
                  size={16}
                  name={state.showPassword ? 'eye-off' : 'eye'}
                  color={Color.gray}
                />
              </EyeIconView>
            </View>
          </PasswordRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type="medium" align="left">
              {state.error.password}
            </Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>
              Konfirmasi Kata Sandi
            </Text>
          </LabelInput>
          <PasswordRoundedView>
            <CustomTextInput
              placeholder="Konfirmasi kata sandi"
              placeholderTextColor={Color.gray}
              keyboardType="default"
              underlineColorAndroid="transparent"
              autoCorrect={false}
              secureTextEntry={!state.showPassword}
              onChangeText={text => onChangeUserData('password2', text)}
              selectionColor={Color.text}
              value={state.userData.password2}
              onBlur={() => isValueError('password2')}
              style={{color: Color.text}}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                paddingRight: 8,
                height: '100%',
                width: '10%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <EyeIconView
                onPress={() => setState({showPassword: !state.showPassword})}>
                <Ionicons
                  size={16}
                  name={state.showPassword ? 'eye-off' : 'eye'}
                  color={Color.gray}
                />
              </EyeIconView>
            </View>
          </PasswordRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type="medium" align="left">
              {state.error.password2}
            </Text>
          </ErrorView>

          {/* <View style={{width: '100%', paddingVertical: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <MaterialIcons size={16} name='check-box-outline-blank' color={Color.theme} style={{marginRight: 4}} />
            <Text align='left' size={12} color={Color.theme}>Saya ingin menerima berita terbaru lewat email</Text>
          </View> */}

          {/* <View style={{width: '100%', paddingVertical: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <MaterialIcons size={16} name='check-box-outline-blank' color={Color.theme} style={{marginRight: 4}} />
            <Text align='left' size={12} color={Color.theme}>Saya setuju dengan <Text color={Color.secondary}>Syarat & Ketentuan</Text> yang berlaku.</Text>
          </View> */}

          <SignRegisterView>
            <SignButton onPress={() => onSubmit()}>Register</SignButton>
          </SignRegisterView>

          <CopyrightView>
            <Text>Sudah punya akun?</Text>
            <RegisterButton onPress={() => navigation.navigate('LoginScreen')}>
              <Text type="semibold">Masuk Sekarang!</Text>
            </RegisterButton>
          </CopyrightView>
        </Container>
      </ScrollView>

      <Loading visible={loading} />

      <Popup {...popupProps} />
    </MainView>
  );
};

export default RegisterScreen;

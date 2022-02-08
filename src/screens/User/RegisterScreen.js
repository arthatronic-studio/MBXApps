import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity as NativeTouchable,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import {iconApp} from '@assets/images';
import {
  Text,
  usePopup,
  useColor,
  Scaffold,
} from '@src/components';
import {Button, TouchableOpacity} from '@src/components/Button';
import validate from '@src/lib/validate';
import {register as onRegister} from '@src/state/actions/user/auth';
import { Container, Divider } from 'src/styled';
import FormInput from 'src/components/FormInput';

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

  const { height, width } = useWindowDimensions();
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
    <Scaffold
      headerTitle=''
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
              onSubmitEditing={() => {}}
              error={state.error.fullName}
            />

            <FormInput
              label='Email'
              placeholder='contoh@email.com'
              value={state.userData.email}
              onChangeText={text => onChangeUserData('email', text)}
              onBlur={() => isValueError('email')}
              returnKeyType="next"
              keyboardType="email-address"
              onSubmitEditing={() => {}}
              error={state.error.email}
            />

            <FormInput
              label='No. Telepon'
              placeholder='081312345678'
              value={state.userData.username}
              onChangeText={text => onChangeUserData('username', text)}
              onBlur={() => isValueError('username')}
              returnKeyType="next"
              keyboardType="default"
              onSubmitEditing={() => {}}
              error={state.error.username}
            />

            <FormInput  
              secureTextEntry={!state.showPassword}
              label='Kata Sandi'
              placeholder='******'
              value={state.userData.password}
              onChangeText={text => onChangeUserData('password', text)}
              onBlur={() => isValueError('password')}
              returnKeyType="next"
              keyboardType="default"
              onSubmitEditing={() => {}}
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

            <FormInput
              secureTextEntry={!state.showPassword}
              label='Ulangi Kata Sandi'
              placeholder='******'
              value={state.userData.password2}
              onChangeText={text => onChangeUserData('password2', text)}
              onBlur={() => isValueError('password2')}
              returnKeyType="send"
              keyboardType="default"
              onSubmitEditing={() => {}}
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
                    <Ionicons
                      size={16}
                      name={state.showPassword ? 'eye-off' : 'eye'}
                      color={Color.gray}
                    />
                  </NativeTouchable>
                </View>
              }
            />

            {/* <View style={{width: '100%', paddingVertical: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
              <MaterialIcons size={16} name='check-box-outline-blank' color={Color.theme} style={{marginRight: 4}} />
              <Text align='left' size={12} color={Color.theme}>Saya ingin menerima berita terbaru lewat email</Text>
            </View> */}

            {/* <View style={{width: '100%', paddingVertical: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
              <MaterialIcons size={16} name='check-box-outline-blank' color={Color.theme} style={{marginRight: 4}} />
              <Text align='left' size={12} color={Color.theme}>Saya setuju dengan <Text color={Color.primary}>Syarat & Ketentuan</Text> yang berlaku.</Text>
            </View> */}

            <Divider height={24} />

            <Button
              onPress={() => onSubmit()}
            >
              Daftar
            </Button>
          </Container>
        </View>
      </ScrollView>
    </Scaffold>
  );
};

export default RegisterScreen;

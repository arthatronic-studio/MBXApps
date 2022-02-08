import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import {
  usePopup,
  useColor,
  Scaffold,
} from '@src/components';
import Text from '@src/components/Text';
import { Button } from '@src/components/Button';
import validate from '@src/lib/validate';
import { callForgetPassword } from '@src/state/actions/user/auth';
import FormInput from 'src/components/FormInput';
import { Container, Divider } from 'src/styled';

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
      setState({ ...state, allValid: false });
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
    <Scaffold
      headerTitle=''
      popupProps={popupProps}
      fallback={loading}
    >
      <ScrollView
        keyboardShouldPersistTaps='handled'
      >
        <Container padding={16} marginTop={36}>
          <Container marginBottom={16}>
            <Text type='semibold' size={24} align='left' lineHeight={25} letterSpacing={0.3}>Lupa Kata Sandi</Text>
          </Container>

          <Container marginBottom={16}>
            <Text align='left' lineHeight={22.4} letterSpacing={0.23}>Masukkan alamat email untuk melakukan pengaturan ulang kata sandi.</Text>
          </Container>

          <FormInput
            label='Email'
            placeholder='contoh@gmail.com'
            value={state.email}
            onChangeText={(text) => setState({ ...state, email: text })}
            onBlur={() => isValueError('email')}
            keyboardType='email-address'
            returnKeyType='done'
            onSubmitEditing={() => onSubmit()}
            error={state.error.email}
          />

          <Divider height={24} />

          <Button
            color={Color.secondary}
            onPress={() => onSubmit()}
          >
            Lanjutkan
          </Button>
        </Container>
      </ScrollView>
    </Scaffold>
  );
}

export default ForgotPasswordScreen;
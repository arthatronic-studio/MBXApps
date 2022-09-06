import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Platform, TouchableOpacity as NativeTouchable, ScrollView, SafeAreaView, Image, Keyboard, BackHandler, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import Moment from 'moment';

import {
  Text,
  usePopup,
  Loading,
  useColor,
  Scaffold,
  Header
} from '@src/components';
import {
  Button,
  TouchableOpacity,
} from '@src/components/Button';
import validate from '@src/lib/validate';
import { updateCurrentUserProfile } from '@src/state/actions/user/auth';
import { usePreviousState } from '@src/hooks';
import { Container, Divider, Row } from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { redirectTo } from 'src/utils';
import { stateUpdateProfile } from 'src/api-rest/stateUpdateProfile';

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 50px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
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

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const inputs = ['fullName', 'email', 'tanggalLahir'];

const listGender = [
  { id: 'male', name: 'Laki-laki' },
  { id: 'female', name: 'Perempuan' },
];

export default ({ navigation, route }) => {
  // dispatch
  const dispatch = useDispatch();

  //
  const { width, height } = useWindowDimensions();
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const auth = useSelector(state => state['auth']);

  const {
    loading,
    error,
  } = useSelector(state => state['user.auth']);

  // prevstate
  const prevLoading = usePreviousState(loading);

  // hooks
  const { Color } = useColor();
  const isFocused = useIsFocused();
  const [popupProps, showPopup] = usePopup();

  // state
  const [allValid, setAllValid] = useState(false); ``
  const [userData, setUserData] = useState({
    fullName: auth ? auth.user.name : '',
    email: auth ? auth.user.email : '',
    tanggalLahir: auth && auth.user.dob ? auth.user.dob : Moment(new Date('1990')).format('DD-MM-YYYY'),
  });
  const [errorData, setErrorData] = useState({
    fullName: null,
    email: null,
    tanggalLahir: null,
  });

  //Image
  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');

  //Tanggal Lahir
  const [tanggalLahir, setDate] = useState(user && user.birthDate ? new Date(...user.birthDate.split("-").reverse()) : new Date('1990'));
  const [open, setOpen] = useState(false);
  const [selectedJK, setSelectedJK] = useState(listGender[0]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }
  }, []);

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.pop();
    }
    return true;
  }

  const isValueError = (name) => {
    const error = validate(name, userData[name]);
    setErrorData({ ...error, [name]: error });
  }

  const onChangeUserData = (key, val) => {
    setUserData({ ...userData, [key]: val });
  }

  const onSubmit = async() => {
    let valid = true;
    const newErrorState = {};

    for (const input of inputs) {
      const error = validate(input, userData[input]);
      if (error) valid = false;
      newErrorState[input] = error;
    }

    setErrorData(newErrorState);
    
    if (valid) {
      const body = {
        name: userData.fullName,
        email: userData.email,
        gender: selectedJK.id,
        dob: Moment(userData.tanggalLahir).format('YYYY-MM-DD'),
      };

      console.log('body', body);
  
      const result = await stateUpdateProfile(body);
      console.log('result', result);
      if (result) {
        showPopup('Data berhasil diubah', 'success');

        setTimeout(() => {
          if (navigation.canGoBack()) {
            navigation.pop();
          } else {
            redirectTo('MainPage');
          }
        }, 2500);

        return;
      }
  
      showPopup('Update Gagal', 'error');
    }
  }

  const renderRadio = ({ label, data, selected, flexDirection, onSelected }) => {
    return (
      <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 16 }}>
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
            width: '100%',
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
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{ height: 18, width: 18, borderRadius: 18 / 2, borderWidth: 1, borderColor: Color.text, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center' }}
                  >
                    {isSelected && <View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: Color.primary }} />}
                  </View>
                  <Container paddingLeft={8}>
                    <Text size={12}>{v.name}</Text>
                  </Container>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <Scaffold
      popupProps={popupProps}
      header={
        // handle user yg dipaksa update profile
        <Header
          title='Edit Profil'
          showLeftButton={navigation.canGoBack()}
          onPressLeftButton={() => {
            dispatch({ type: 'USER.CLEAR_ERROR' });
            navigation.goBack();
          }}
        />
      }
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <Container paddingHorizontal={16} paddingBottom={16}>
          {thumbImage !== '' && <TouchableOpacity
            onPress={() => { }}
            style={{ width: '100%', height: height / 3, borderRadius: 4, alignItems: 'center' }}
          >
            <Image
              style={{ height: '100%', aspectRatio: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}
              source={{ uri: `data:${mimeImage};base64,${thumbImage}` }}
            />
          </TouchableOpacity>}

          <TouchableOpacity
            onPress={() => {
              const options = {
                mediaType: 'photo',
                maxWidth: 640,
                maxHeight: 640,
                quality: 1,
                includeBase64: true,
              }

              launchImageLibrary(options, (callback) => {
                if (callback.didCancel || callback.errorCode || callback.errorMessage) {
                  return;
                }

                setThumbImage(callback.base64);
                setMimeImage(callback.type);
              })
            }}
            style={{ width: width / 3, aspectRatio: 1, borderRadius: width / 3, marginVertical: 16, backgroundColor: Color.border, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
          >
            <Entypo name='folder-images' size={22} style={{ marginBottom: 4 }} />
            <Text size={10}>Pilih gambar</Text>
          </TouchableOpacity>

          <Divider />

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{ opacity: 0.6 }}>Nama Lengkap</Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder='Masukan nama lengkap'
              keyboardType='default'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => onChangeUserData('fullName', text)}
              selectionColor={Color.text}
              value={userData.fullName}
              onBlur={() => isValueError('fullName')}
              style={{ color: Color.text }}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.fullName}</Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{ opacity: 0.6 }}>Tanggal Lahir</Text>
          </LabelInput>
          <EmailRoundedView>
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={{ width: width - 32, height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderBottomWidth: 0.5 }}
            >
              <View style={{ flex: 1 }}>
                <Text align='left'>{userData.tanggalLahir ? userData.tanggalLahir : 'Pilih Tanggal '} </Text>
              </View>
              <View style={{ flex: 1, paddingRight: 16, alignItems: 'flex-end' }}>
                <Ionicons name='chevron-down-outline' color={Color.text} />
              </View>
            </TouchableOpacity>
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.tanggalLahir}</Text>
          </ErrorView>

          {renderRadio({
            flexDirection: 'row',
            label: 'Jenis Kelamin',
            data: listGender,
            selected: selectedJK,
            onSelected: (val) => {
              setSelectedJK(val)
            }
          })}

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{ opacity: 0.6 }}>Email</Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder='Masukan email'
              keyboardType='email-address'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => onChangeUserData('email', text)}
              selectionColor={Color.text}
              value={userData.email}
              onBlur={() => isValueError('email')}
              style={{ color: Color.text }}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.email}</Text>
          </ErrorView>

          {/* <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{ opacity: 0.6 }}>Nomor Telepon</Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder='Masukan nomor telepon'
              keyboardType='phone-pad'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => onChangeUserData('phoneNumber', text)}
              selectionColor={Color.text}
              value={userData.phoneNumber}
              onBlur={() => isValueError('phoneNumber')}
              style={{ color: Color.text }}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.phoneNumber}</Text>
          </ErrorView> */}

          {/* <View style={{width: '100%', paddingVertical: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <MaterialIcons size={16} name='check-box-outline-blank' color={Color.theme} style={{marginRight: 4}} />
            <Text align='left' size={12} color={Color.theme}>Saya ingin menerima berita terbaru lewat email</Text>
          </View> */}

          {/* <View style={{width: '100%', paddingVertical: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <MaterialIcons size={16} name='check-box-outline-blank' color={Color.theme} style={{marginRight: 4}} />
            <Text align='left' size={12} color={Color.theme}>Saya setuju dengan <Text color={Color.secondary}>Syarat & Ketentuan</Text> yang berlaku.</Text>
          </View> */}
        </Container>
      </KeyboardAwareScrollView>

      <View style={{ padding: 16 }}>
        <Button onPress={() => onSubmit()}>
          Simpan
        </Button>
      </View>

      <Loading visible={loading} />

      {open && <DatePicker
        modal
        open={open}
        date={tanggalLahir}
        mode="date"
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
          onChangeUserData('tanggalLahir', Moment(date).format('DD-MM-YYYY'));
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />}
    </Scaffold>
  );
};
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  Platform,
  TouchableOpacity as NativeTouchable,
  ScrollView,
  SafeAreaView,
  Image,
  Keyboard,
  BackHandler,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import {launchImageLibrary} from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import Moment from 'moment';

import {
  Text,
  usePopup,
  Loading,
  useColor,
  Scaffold,
  Header,
  HeaderBig,
} from '@src/components';
import {Button, TouchableOpacity} from '@src/components/Button';
import validate from '@src/lib/validate';
import {updateCurrentUserProfile} from '@src/state/actions/user/auth';
import {usePreviousState} from '@src/hooks';
import {Container, Divider, Row} from 'src/styled';
import {accessClient} from 'src/utils/access_client';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {redirectTo} from 'src/utils';
import {stateUpdateProfile} from 'src/api-rest/stateUpdateProfile';
import imageAssets from 'assets/images';
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';
import ImagesPath from 'src/components/ImagesPath';
import FormInput from 'src/components/FormInput';
import FormSelect from 'src/components/FormSelect';
import FormInputV2 from 'src/components/FormInputV2';

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
  {id: 'male', name: 'Laki-laki'},
  {id: 'female', name: 'Perempuan'},
];

export default ({navigation, route}) => {
  // dispatch
  const dispatch = useDispatch();

  //
  const {width, height} = useWindowDimensions();
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const auth = useSelector(state => state['auth']);

  const {loading, error} = useSelector(state => state['user.auth']);

  // prevstate
  const prevLoading = usePreviousState(loading);

  // hooks
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [popupProps, showPopup] = usePopup();

  // state
  const [allValid, setAllValid] = useState(false);
  ``;
  const [userData, setUserData] = useState({
    fullName: auth ? auth.user.name : '',
    email: auth ? auth.user.email : '',
    tanggalLahir: auth && auth.user.dob ? auth.user.dob : '',
  });
  const [errorData, setErrorData] = useState({
    fullName: null,
    email: null,
    tanggalLahir: null,
  });

  //Image
  const [modalImagePicker, setModalImagePicker] = useState(false);
  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');

  //Tanggal Lahir
  const [tanggalLahir, setDate] = useState(
    user && user.birthDate
      ? new Date(...user.birthDate.split('-').reverse())
      : new Date('1990'),
  );
  const [open, setOpen] = useState(false);
  const [selectedJK, setSelectedJK] = useState(listGender[0]);

  // sampul
  const [modalSampulPicker, setModalSampulPicker] = useState(false);
  const [sampulImage, setSampulImage] = useState('');
  const [sampulMimeImage, setSampulMimeImage] = useState('image/jpeg');

  // const redirectTo = (name, params) => {
  //   navigation.dispatch(
  //     CommonActions.reset({
  //       index: 0,
  //       routes: [{name, params}],
  //     }),
  //   );
  // };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.pop();
    }
    return true;
  };

  const isValueError = name => {
    const error = validate(name, userData[name]);
    setErrorData({...error, [name]: error});
  };

  const onChangeUserData = (key, val) => {
    setUserData({...userData, [key]: val});
  };

  const onSubmit = async () => {
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
        // foto: `data:${mimeImage};base64,${thumbImage}`,
        // foto_sampul: `data:${sampulMimeImage};base64,${sampulImage}`,
      };

      console.log('body', body);

      const result = await stateUpdateProfile(body);
      console.log('result', result);
      if (result && result.status) {
        showPopup('Data berhasil diubah', 'success');

        setTimeout(() => {
          // if (navigation.canGoBack()) {
          //   navigation.pop();
          // } else {
            redirectTo('MainPage');
          // }
        }, 2500);

        return;
      }

      showPopup(result.message, 'error');
    }
  };

  const renderRadio = ({label, data, selected, flexDirection, onSelected}) => {
    return (
      <View style={{width: '100%', marginBottom: 16, flexDirection: 'row'}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginBottom: 2,
          }}>
          <Text type="medium" size={14} lineHeight={16} color={'#797979'}>
            {label}
          </Text>
        </View>

        <View
          style={{
            flex: 2,
            flexDirection: 'column',
          }}>
          {data.map((v, id) => {
            const isSelected = selected && v.id === selected.id;

            return (
              <TouchableOpacity
                key={id}
                onPress={() => {
                  onSelected(v);
                }}
                style={{paddingRight: 16, marginBottom: 8}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      height: 24,
                      width: 24,
                      borderRadius: 24 / 2,
                      borderWidth: 1,
                      borderColor: Color.text,
                      backgroundColor: Color.textInput,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {isSelected && (
                      <View
                        style={{
                          height: 16,
                          width: 16,
                          borderRadius: 16 / 2,
                          backgroundColor: Color.primary,
                        }}
                      />
                    )}
                  </View>
                  <Container paddingLeft={8}>
                    <Text
                      size={24}
                      type="medium"
                      color={isSelected ? Color.black : '#797979'}>
                      {v.name}
                    </Text>
                  </Container>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Scaffold
      popupProps={popupProps}
      header={
        <HeaderBig style={{backgroundColor: 'transparent'}} />
      }>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 16}}>
        <Container paddingHorizontal={16} paddingBottom={16}>
          <Divider height={32} />

          <Text
            size={27}
            type="medium"
            lineHeight={32}
            color={Color.primary}
            align="left">
            PROFILE
          </Text>
          <Divider height={8} />
          <Text size={12} lineHeight={18} color={Color.black} align="left">
            Cupcake ipsum dolor sit amet. I love cupcake sesame snaps cotton
            candy danish macaroon.
          </Text>

          <Divider height={40} />

          <FormInputV2
            label="Nama Lengkap"
            placeholder="Masukan nama lengkap"
            hideErrorHint
            keyboardType="default"
            value={userData.fullName}
            onChangeText={text => onChangeUserData('fullName', text)}
            onBlur={() => isValueError('fullName')}
            returnKeyType="next"
            onSubmitEditing={() => setOpen(true)}
          />

          {/* <FormInput
            editable={false}
            label="Tanggal Lahir"
            placeholder='yyyy-mm-dd'
            hideErrorHint
            keyboardType="default"
            value={userData.tanggalLahir}
            // onChangeText={(text) => onChangeUserData('tanggalLahir', text)}
            onBlur={() => isValueError('tanggalLahir')}
            returnKeyType="next"
          /> */}

          <FormInputV2
            label="Tanggal Lahir"
            placeholder="dd/mm/yyyy"
            hideErrorHint
            value={userData.tanggalLahir}
            onPress={() => setOpen(true)}
            editable={false}
          />

          <Divider />

          {renderRadio({
            flexDirection: 'row',
            label: 'Jenis Kelamin',
            data: listGender,
            selected: selectedJK,
            onSelected: val => {
              setSelectedJK(val);
            },
          })}

          <FormInputV2
            label="Email"
            placeholder="contoh@email.com"
            hideErrorHint
            keyboardType="email-address"
            value={userData.email}
            onChangeText={text => onChangeUserData('email', text)}
            onBlur={() => isValueError('email')}
            returnKeyType="next"
          />

          <Divider height={40} />

          <View
            style={{
              marginBottom: 16,
            }}>
            <TouchableOpacity
              disabled={
                userData.email != '' &&
                userData.tanggalLahir != '' &&
                userData.tanggalLahir !== '' ? false : true
              }
              onPress={() => {
                onSubmit();
              }}
              style={{
                paddingVertical: 12,
                width: width - 32,
                backgroundColor:
                  userData.email !== '' &&
                  userData.tanggalLahir !== '' &&
                  userData.tanggalLahir !== ''
                    ? '#242424'
                    : '#797979',
              }}>
              <Text
                size={14}
                type="medium"
                lineHeight={17}
                color={
                  userData.email !== '' &&
                  userData.tanggalLahir !== '' &&
                  userData.tanggalLahir !== ''
                    ? '#E7FF00'
                    : '#FFFFFF'
                }>
                Complete Now
              </Text>
            </TouchableOpacity>
          </View>

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

      <Loading visible={loading} />

      {open && (
        <DatePicker
          modal
          open={open}
          date={tanggalLahir}
          mode="date"
          onConfirm={date => {
            setOpen(false);
            setDate(date);
            onChangeUserData('tanggalLahir', Moment(date).format('YYYY-MM-DD'));
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      )}

      <ModalImagePicker
        visible={modalSampulPicker}
        onClose={() => {
          setModalSampulPicker(false);
        }}
        onSelected={callback => {
          if (callback.base64) {
            setSampulImage(callback.base64);
            setSampulMimeImage(callback.type);
          }

          setModalSampulPicker(false);
        }}
      />

      <ModalImagePicker
        visible={modalImagePicker}
        onClose={() => {
          setModalImagePicker(false);
        }}
        onSelected={callback => {
          if (callback.base64) {
            setThumbImage(callback.base64);
            setMimeImage(callback.type);
          }

          setModalImagePicker(false);
        }}
      />
    </Scaffold>
  );
};

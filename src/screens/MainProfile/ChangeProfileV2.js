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
  const {params} = route;

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
    ktp: auth && auth.user.ktp ? auth.user.ktp : '',
  });
  const [errorData, setErrorData] = useState({
    fullName: null,
    email: null,
    tanggalLahir: null,
    ktp: null,
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

  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);

      let body = {
        name: userData.fullName,
        email: userData.email,
        gender: selectedJK.id,
        dob: Moment(userData.tanggalLahir).format('YYYY-MM-DD'),
        // foto_sampul: `data:${sampulMimeImage};base64,${sampulImage}`,
      };

      if (thumbImage) {
        body.foto = thumbImage ? `data:${mimeImage};base64,${thumbImage}` : '';
      }

      if (userData.ktp !== '') {
        body.ktp = userData.ktp;
      }

      console.log('body', body);

      const result = await stateUpdateProfile(body);
      console.log('result', result);
      if (result && result.status) {
        setIsLoading(false);
        showPopup('Data berhasil diubah', 'success');

        setTimeout(() => {
          if (navigation.canGoBack()) {
            navigation.pop();
          } else {
            redirectTo('MainPage');
          }
        }, 2500);

        return;
      } else {
        setIsLoading(false);
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
    <Scaffold popupProps={popupProps} fallback={isLoading}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 16}}>
        <Container paddingHorizontal={16} paddingBottom={16}>
          <Divider height={16} />

          <Container flex={1} flexDirection="column" align="flex-start">
            <TouchableOpacity
              onPress={() => setModalImagePicker(true)}
            >
              <Image
                source={
                  thumbImage !== ''
                    ? {uri: `data:${mimeImage};base64,${thumbImage}`}
                    : ImagesPath.userChat
                }
                style={{
                  width: width * 0.16,
                  height: width * 0.16,
                  backgroundColor: Color.border,
                  borderRadius: 50,
                }}
              />
            </TouchableOpacity>
            <Divider height={11} />
            <Text
              size={14}
              color="#767676"
              lineHeight={17}
              type="medium"
              align="left">
              Image should formated JPG, JPEG, and PNG. Maksimal size of the
              iamge is 2mb
            </Text>
            <Divider height={8} />
            <TouchableOpacity onPress={() => setModalImagePicker(true)}>
              <Text
                size={14}
                color={Color.black}
                lineHeight={17}
                type="medium"
                align="left"
                underline>
                Change Picture
              </Text>
            </TouchableOpacity>
          </Container>

          <Divider height={16} />

          <FormInputV2
            label="Nama Lengkap"
            placeholder="Masukan nama lengkap"
            // hideErrorHint
            error={errorData.fullName}
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
            // hideErrorHint
            error={errorData.tanggalLahir}
            keyboardType="default"
            value={userData.tanggalLahir}
            // onChangeText={(text) => onChangeUserData('tanggalLahir', text)}
            onBlur={() => isValueError('tanggalLahir')}
            returnKeyType="next"
          /> */}

          <FormInputV2
            label="Tanggal Lahir"
            placeholder="dd/mm/yyyy"
            // hideErrorHint
            error={errorData.tanggalLahir}
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
            // hideErrorHint
            error={errorData.email}
            keyboardType="email-address"
            value={userData.email}
            onChangeText={text => onChangeUserData('email', text)}
            onBlur={() => isValueError('email')}
            returnKeyType="next"
          />

          <FormInputV2
            label="KTP"
            placeholder="1234567890"
            // hideErrorHint
            error={errorData.ktp}
            keyboardType="numeric"
            value={userData.ktp}
            onChangeText={text => onChangeUserData('ktp', text)}
            onBlur={() => isValueError('ktp')}
            returnKeyType="done"
          />

          <Divider height={40} />

          <View
            style={{
              marginBottom: 16,
            }}>
            <TouchableOpacity
              disabled={
                userData.email !== ''
                && userData.tanggalLahir !== ''
                // && thumbImage !== ''
                ? false : true
              }
              onPress={() => {
                onSubmit();
              }}
              style={{
                paddingVertical: 12,
                width: width - 32,
                backgroundColor:
                  userData.email !== ''
                  && userData.tanggalLahir !== ''
                  // && thumbImage !== ''
                  ? '#242424' : '#797979',
              }}>
              <Text
                size={14}
                type="medium"
                lineHeight={17}
                color={
                  userData.email !== ''
                  && userData.tanggalLahir !== ''
                  // && thumbImage !== ''
                  ? '#E7FF00' : '#FFFFFF'
                }>
                Save Change
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

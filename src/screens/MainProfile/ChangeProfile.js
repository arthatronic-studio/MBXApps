import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Platform, TouchableOpacity as NativeTouchable, ScrollView, SafeAreaView, Image, Keyboard, BackHandler, useWindowDimensions, ImageBackground } from 'react-native';
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
import imageAssets from 'assets/images';
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';
import ImagesPath from 'src/components/ImagesPath';
import FormInput from 'src/components/FormInput';
import FormSelect from 'src/components/FormSelect';

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
  const [tanggalLahir, setDate] = useState(user && user.birthDate ? new Date(...user.birthDate.split("-").reverse()) : new Date('1990'));
  const [open, setOpen] = useState(false);
  const [selectedJK, setSelectedJK] = useState(listGender[0]);

  // sampul
  const [modalSampulPicker, setModalSampulPicker] = useState(false);
  const [sampulImage, setSampulImage] = useState('');
  const [sampulMimeImage, setSampulMimeImage] = useState('image/jpeg');

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
        foto: `data:${mimeImage};base64,${thumbImage}`,
        foto_sampul: `data:${sampulMimeImage};base64,${sampulImage}`
      };

      console.log('body', body);
  
      const result = await stateUpdateProfile(body);
      console.log('result', result);
      if (result && result.status) {
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
  
      showPopup(result.message, 'error');
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
          centerTitle={false}
          title='Edit Profil'
          showLeftButton={navigation.canGoBack()}
          onPressLeftButton={() => {
            dispatch({ type: 'USER.CLEAR_ERROR' });
            navigation.goBack();
          }}
          actions={
            <TouchableOpacity
              onPress={() => {
                if(userData.email !== '' && userData.tanggalLahir !== '' && userData.tanggalLahir !== '' && sampulImage !== '' && thumbImage !== ''){
                  onSubmit()
                }else{
                  showPopup('Lengkapi data', 'error');
                }
              }}
            >
              <Text size={12} color={userData.email !== '' && userData.tanggalLahir !== '' && userData.tanggalLahir !== '' && sampulImage !== '' && thumbImage !== '' ? Color.primaryDark : "#ACAAA5"} type="medium">
                Simpan
              </Text>
            </TouchableOpacity>
          }
        />
      }
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <Container paddingHorizontal={16} paddingBottom={16}>
          <Text align="left" color={Color.black} type="medium" size={12}>
            Foto Sampul
          </Text>
          <Divider height={8}/>
          {sampulImage === '' ? 
            <TouchableOpacity
              onPress={() => setModalSampulPicker(true)}
              style={{ 
                flex: 1,
                backgroundColor: Color.border,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 40,
                borderRadius: 16
               }}
            >
              <Image
                source={imageAssets.galleryAdd}
              />
              <Divider height={10}/>
              <Text size={14} type="medium" color={Color.primaryDark}>
                Unggah Gambar
              </Text>
              <Divider height={4}/>
              <Text size={10} color={Color.textSoft}>
                Gambar berbentuk JPG, JPEG, atau PNG. {'\n'}
                Gambar berukuran maskimal 5mb
              </Text>
            </TouchableOpacity>
            :
            <ImageBackground
              style={{ 
                flex: 1,
              }}
              imageStyle={{ 
                borderRadius: 16, 
                resizeMode: 'cover',
               }}
              source={{ uri: `data:${sampulMimeImage};base64,${sampulImage}` }}
            >
              <Container
                align='center'
                justify='center'
                borderRadius={16}
                width="100%"
                paddingVertical={54}
                backgroundColor={"rgba(0, 0, 0, 0.4)"}
              >
                <Text size={10} color={Color.white}>
                  Gambar berbentuk JPG, JPEG, atau PNG. {'\n'}
                  Gambar berukuran maskimal 5mb
                </Text>
                <Divider height={8}/>
                <TouchableOpacity
                  onPress={() => setModalSampulPicker(true)}
                  style={{ 
                    borderWidth: 1,
                    padding: 10,
                    borderColor: Color.white,
                    borderRadius: 8
                  }}>
                  <Text size={12} type="medium" color={Color.white}>
                    Ganti Gambar
                  </Text>
                </TouchableOpacity>
              </Container>
            </ImageBackground>
          }

          <Divider height={8}/>

          <Text align="left" color={Color.black} type="medium" size={12}>
            Foto Profile
          </Text>

          <Divider height={8}/>

          <Container
            flex={1}
            flexDirection="row"
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
            <Divider width={8}/>
            <Container
              flex={1}
              justify="space-between"
              align='flex-start'
            >
              <Text size={10} color={Color.textSoft} align="left">
                Gambar berbentuk JPG, JPEG, atau PNG. {'\n'}
                Gambar berukuran maskimal 5mb
              </Text>
              <TouchableOpacity
                  onPress={() => setModalImagePicker(true)}
                  style={{ 
                    borderWidth: 1,
                    padding: 8,
                    borderColor: Color.textSoft,
                    borderRadius: 8
                  }}>
                  <Text size={10} type="medium" color={Color.primaryDark}>
                    Ganti Gambar
                  </Text>
                </TouchableOpacity>
            </Container>
          </Container>

          <Divider />

          <Text align="left" color={Color.black} type="medium" size={12}>
            Informasi Dasar
          </Text>

          <Divider />

          <FormInput
            label="Nama Lengkap"
            placeholder='Masukan nama lengkap'
            hideErrorHint
            keyboardType="default"
            value={userData.fullName}
            onChangeText={(text) => onChangeUserData('fullName', text)}
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
          <FormSelect
            label='Tanggal Lahir'
            placeholder='Pilih Tanggal'
            hideErrorHint
            // value={Moment(userData.eventDate).format('DD MMM YYYY')}
            value={userData.tanggalLahir}
            onPress={() => setOpen(true)}
            // error={errorUserData.usageType}
            // suffixIcon={
            //     <View style={{width: '10%', paddingRight: 16, justifyContent: 'center', alignItems: 'flex-end'}}>
            //         <Ionicons name='calendar' />
            //     </View>
            // }
          />

          <Divider />

          {renderRadio({
            flexDirection: 'row',
            label: 'Jenis Kelamin',
            data: listGender,
            selected: selectedJK,
            onSelected: (val) => {
              setSelectedJK(val)
            }
          })}

          <FormInput
            label="Email"
            placeholder='contoh@email.com'
            hideErrorHint
            keyboardType="email-address"
            value={userData.email}
            onChangeText={(text) => onChangeUserData('email', text)}
            onBlur={() => isValueError('email')}
            returnKeyType="next"
          />

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

      {open && <DatePicker
        modal
        open={open}
        date={tanggalLahir}
        mode="date"
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
          onChangeUserData('tanggalLahir', Moment(date).format('YYYY-MM-DD'));
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />}

      <ModalImagePicker
        visible={modalSampulPicker}
        onClose={() => {
          setModalSampulPicker(false);
        }}
        onSelected={(callback) => {
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
        onSelected={(callback) => {
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
import React, { useState, useEffect,useRef } from 'react';
import { View, TextInput,Platform, TouchableOpacity as NativeTouchable, ScrollView, SafeAreaView,Image,Keyboard, BackHandler, useWindowDimensions } from 'react-native';
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
  // Button,
  // TouchableOpacity,
  Text,
  Popup, usePopup,
  Loading,
  Header,
  useColor
} from '@src/components';
import {
  Button,
  TouchableOpacity,
} from '@src/components/Button';
import validate from '@src/lib/validate';

import { updateCurrentUserProfile } from '@src/state/actions/user/auth';
import { usePreviousState } from '@src/hooks';
import { Divider, MainView } from 'src/styled';

const Container = Styled(View)`
  width: 100%;
  height: 100%;
  alignItems: center;
  justifyContent: center;
  padding: 30px 16px 0px;
`;
const CustomTouch = Styled(TouchableOpacity)`
    backgroundColor: transparent;
`;
const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 50px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
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

const inputs = ['fullName', 'idCardNumber', 'email', 'phoneNumber','Nomor_ID', 'Alamat'];

export default ({ navigation, route }) => {
  // dispatch
  const dispatch = useDispatch();

  //
   const { height } = useWindowDimensions();
  // selector
  const user = useSelector(state => state['user.auth'].login.user);

  const {
    register,
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
  const [allValid, setAllValid] = useState(false);``
  const [userData, setUserData] = useState({
    fullName: user ? user.firstName + ' ' + user.lastName : '',
    idCardNumber: user ? user.idCardNumber : '',
    email: user ? user.email : '',
    phoneNumber: user ? user.phoneNumber : '',
    date: user && user.tanggalLahir ? user.tanggalLahir : new Date('1990'),
    Nomor_ID: user ? user.Nomor_ID :  '',
    Alamat : user ? user.Alamat : '',
  });
  const [errorData, setErrorData] = useState({
    fullName: null,
    idCardNumber: null,
    email: null,
    phoneNumber: null,
    Nomor_ID : null,
    Alamat : null,
  });

  //Image
  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');
  const handleBackPress = () => {
    backToSelectVideo();
    return true;
}

console.log('user', user);

const backToSelectVideo = () => {
    setThumbImage('');
    setMimeImage('image/jpeg');
}
//Tanggal Lahir
const [date, setDate] = useState(new Date('1990'))
const [open, setOpen] = useState(false)


  useEffect(() => {
    if (isFocused) {
      if (prevLoading && user && loading === false) {
        navigation.pop();
        showPopup('Data berhasil diubah', 'success');
      }
      if (!register.status && error) {
        showPopup('Terjadi Kesalaha, silahkan coba kembali', 'error');
        console.log(JSON.stringify(error), 'error');
        
        dispatch({ type: 'USER.LOGOUT' });
      }
    }
  }, [user, error, isFocused]);

  useEffect(() => {
    if (allValid) {
      setAllValid(false)

      const { fullName, idCardNumber, email, phoneNumber, Nomor_ID, Alamat } = userData;

      const nameSplit = fullName.split(' ');
      let lastName = '';
      if (nameSplit[1]) {
        nameSplit.map((e, i) => {
          if (i !== 0) lastName += e + ' ';
        })
      }

      const newUserData = {
        firstName: nameSplit[0].trim(),
        lastName: lastName.trim(),
        idCardNumber,
        email,
        phoneNumber,
        nomor_id: Nomor_ID,
        alamat: Alamat,
        
      };

      console.log('newUserData', newUserData);

      // dispatch(updateCurrentUserProfile(newUserData));
    }
  }, [allValid]);

  const isValueError = (name) => {
    const error = validate(name, userData[name]);
    setErrorData({ ...error, [name]: error });
  }

  const onChangeUserData = (key, val) => {
    setUserData({ ...userData, [key]: val });
  }

  const onSubmit = () => {
    let valid = true;
    const newErrorState = {};

    for (const input of inputs) {
      const error = validate(input, userData[input]);
      if (error) valid = false;
      newErrorState[input] = error;
    }

    setErrorData(newErrorState);
    setAllValid(valid);
  }

  console.log(userData, 'ini data');
  
  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <Header
        title='Ubah Profile'
        style={{paddingTop: 16}}
      />

      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{paddingBottom: 16}}>
        <Container>
          {thumbImage !== '' && <TouchableOpacity
              onPress={() => {}}
              style={{width: '100%', height: height / 3, borderRadius: 4, alignItems: 'center'}}
          >
              <Image
                  style={{height: '100%', aspectRatio: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}}
                  source={{ uri: `data:${mimeImage};base64,${thumbImage}` }}
              />
          </TouchableOpacity>}

              <LabelInput>
                  
              </LabelInput>
              <TouchableOpacity
                  onPress={() => {
                      const options = {
                          mediaType: 'photo',
                          maxWidth: 320,
                          maxHeight: 320,
                          quality: 1,
                          includeBase64: true,
                      }

                      launchImageLibrary(options, (callback) => {
                          setThumbImage(callback.base64);
                          setMimeImage(callback.type);
                      })
                  }}
                  style={{width: '100%', height: 70, borderRadius: 4, marginTop: 16, backgroundColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
              >
                  <Entypo name='folder-images' size={22} style={{marginBottom: 4}} />
                  <Text size={10}>Pilih gambar</Text>
              </TouchableOpacity>

          <Divider />
               
          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Nama Lengkap</Text>
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
              style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.fullName}</Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Tanggal Lahir</Text>
          </LabelInput>
          <EmailRoundedView>
           
            <CustomTouch onPress={() => setOpen(true)}>
                  <EmailRoundedView>
                          <View style={{height: 34, paddingRight: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                          <Text size={14} style={{marginTop: 2}}></Text>
                        <Text>{Moment(userData.date).isValid() ? Moment(userData.date).format('DD-MM-YYYY') : 'Pilih Tanggal '} </Text>
                          <Ionicons name='chevron-down-outline' color={Color.text} />
                      </View>
                  </EmailRoundedView>
              </CustomTouch> 
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.Tanggal_Lahir}</Text>
          </ErrorView>
         
          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>NIK</Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder='Masukan NIK'
              keyboardType='number-pad'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => onChangeUserData('idCardNumber', text)}
              selectionColor={Color.text}
              value={userData.idCardNumber}
              onBlur={() => isValueError('idCardNumber')}
              style={{color: Color.text}}
              />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.idCardNumber}</Text>
          </ErrorView>
          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Nomor Punggung</Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder=' Masukan nomor punggung '
              keyboardType='number-pad'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => onChangeUserData('Nomor_ID', text)}
              selectionColor={Color.text}
              value={userData.Nomor_ID}
              onBlur={() => isValueError('Nomor_ID')}
              style={{color: Color.text}}
              />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.Nomor_ID}</Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Email</Text>
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
                style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.email}</Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Alamat</Text>
          </LabelInput>
          <EmailRoundedView>
            <CustomTextInput
              placeholder='Masukan Alamat'
              keyboardType='default'
              placeholderTextColor={Color.gray}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              onChangeText={(text) => onChangeUserData('Alamat', text)}
              selectionColor={Color.text}
              value={userData.Alamat}
              onBlur={() => isValueError('Alamat')}
              style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.Alamat}</Text>
          </ErrorView>

          <LabelInput>
            <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Nomor Telepon</Text>
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
              style={{color: Color.text}}
            />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.phoneNumber}</Text>
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
            <SignButton
              onPress={() => onSubmit()}
            >
              Simpan
            </SignButton>
          </SignRegisterView>
        </Container>
      </ScrollView>

      <Loading visible={loading} />

      <Popup {...popupProps} />

      {open && <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
          onChangeUserData('date', date);
          console.log('koko',date);
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />}
    </MainView>
  );
};
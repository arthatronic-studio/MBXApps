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
import { Divider } from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { redirectTo } from 'src/utils';

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

const inputs = ['fullName', 'idCardNumber', 'email', 'phoneNumber','Nomor_ID', 'Alamat','tanggalLahir'];

export default ({ navigation, route }) => {
  // dispatch
  const dispatch = useDispatch();

  //
   const { height } = useWindowDimensions();
  // selector
  const user = useSelector(state => state['user.auth'].login.user);

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
  const [allValid, setAllValid] = useState(false);``
  const [userData, setUserData] = useState({
    fullName: user ? user.firstName + ' ' + user.lastName : '',
    idCardNumber: user ? user.idCardNumber : '',
    email: user ? user.email : '',
    phoneNumber: user ? user.phoneNumber : '',
    tanggalLahir: user && user.birthDate ? user.birthDate : Moment(new Date('1990')).format('DD-MM-YYYY'),
    Nomor_ID: user ? user.idNumber :  '',
    Alamat : user ? user.address : '',
  });
  const [errorData, setErrorData] = useState({
    fullName: null,
    idCardNumber: null,
    email: null,
    phoneNumber: null,
    Nomor_ID : null,
    Alamat : null,
    tanggalLahir: null
  });

  //Image
  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');

  //Tanggal Lahir
  const [tanggalLahir, setDate] = useState(user && user.birthDate ? new Date(...user.birthDate.split("-").reverse()) : new Date('1990'));
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (isFocused) {
      if (prevLoading && user && loading === false && error === '') {
        showPopup('Data berhasil diubah', 'success');

        setTimeout(() => {
          if (navigation.canGoBack()) {
            navigation.pop();
          } else {
            redirectTo('MainPage');
          }
        }, 2500);
      } else if (error) {
        showPopup('Terjadi Kesalahan, silahkan coba kembali', 'error');
        // showPopup(error?.message, 'error');
        console.log(JSON.stringify(error), 'error');
      }
    }
  }, [user, loading, error, isFocused]);

  useEffect(() => {
    if (allValid) {
      setAllValid(false)

      const { fullName, idCardNumber, email, phoneNumber, Nomor_ID, Alamat,tanggalLahir } = userData;

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
        idNumber: Nomor_ID,
        address: Alamat,
        birthDate: tanggalLahir,
        photoProfile : user && thumbImage === '' ? '' : 'data:image/png;base64,' + thumbImage
      };

      console.log('newUserData', newUserData);
      
      dispatch(updateCurrentUserProfile(newUserData));
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
  
  return (
    <Scaffold
      popupProps={popupProps}
      header={
        // handle user yg dipaksa update profile
        <Header 
          title='Ubah Profil' 
          showLeftButton={navigation.canGoBack()} 
          onPressLeftButton={() => {
            dispatch({ type: 'USER.CLEAR_ERROR' });
            navigation.goBack();
            }
          }
        />
      }
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{paddingBottom: 16}}
      >
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
                          <Text>{userData.tanggalLahir ? userData.tanggalLahir : 'Pilih Tanggal '} </Text>
                          <Ionicons name='chevron-down-outline' color={Color.text} />
                      </View>
                  </EmailRoundedView>
              </CustomTouch> 
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.tanggalLahir}</Text>
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
              maxLength={16}
              />
          </EmailRoundedView>
          <ErrorView>
            <Text size={12} color={Color.error} type='medium' align='left'>{errorData.idCardNumber}</Text>
          </ErrorView>

          {accessClient.ChangeProfile.showIdNumber && <>
            <LabelInput>
              <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Nomor Punggung</Text>
            </LabelInput>
            <EmailRoundedView>
              <CustomTextInput
                placeholder=' Masukan nomor punggung '
                keyboardType='default'
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
          </>}

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
        </Container>
      </KeyboardAwareScrollView>

      <View style={{padding: 16}}>
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
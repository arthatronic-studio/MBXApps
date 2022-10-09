import React, {useState, useEffect, createRef} from 'react';
import {
  View,
  TextInput,
  Keyboard,
  ScrollView,
  useWindowDimensions,
  Image,
  TouchableOpacity as NativeTouchable,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Scaffold from '@src/components/Scaffold';
import Text from '@src/components/Text';
import Button from 'src/components/Button/Button';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import {useColor} from '@src/components/Color';
import {usePopup} from 'src/components/Modal/Popup';
import {shadowStyle} from '@src/styles';
import {useInterval} from '@src/hooks/useInterval';
import {Container, Divider, Padding, Row} from 'src/styled';
// import {
//     bgLogin,
// } from '@assets/images';
import AlertModal from 'src/components/Modal/AlertModal';
// import { requestHttp } from 'src/api/httpService';
// import { requestGetCurrentUser } from 'src/api/user';
import {CommonActions} from '@react-navigation/native';
import {Header, HeaderBig} from 'src/components';
import {statusBarHeight} from 'src/utils/constants';
import {FormatDuration} from 'src/utils';
import {postNonAuth} from 'src/api-rest/httpService';
import {stateBeaconSetting} from 'src/api-rest/stateBeaconSetting';
import imageAssets from 'assets/images';

const initialCountdown = 60 * 1;

const OtpScreenV2 = ({navigation, route}) => {
  const {params} = route;

  const auth = useSelector(state => state['auth']);

  const [listTextInput, setListTextInput] = useState([]);
  const [activeIndex, setActiveIndex] = useState();
  const [countdown, setCountdown] = useState(initialCountdown);
  const [showModalPopup, setShowModalPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [errorSettingBeacon, setErrorSettingBeacon] = useState(false);

  const {Color} = useColor();
  const {height, width} = useWindowDimensions();

  const [popupProps, showPopup] = usePopup();
  const dispatch = useDispatch();

  useInterval(() => {
    handleCountDown();
  }, 1000);

  useEffect(() => {
    // setFcmToken(params.body.device_token);

    if (params.isGuest) {
      setIsLoading(true);
      onSubmit(params.isGuest);
    }
  }, []);

  const redirectTo = (name, params) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name, params}],
      }),
    );
  };

  const handleCountDown = () => {
    if (countdown > 0) {
      setCountdown(countdown - 1);
    }
  };

  const resetOtp = () => {
    let newListTextInput = [];
    for (let index = 0; index < 4; index++) {
      newListTextInput.push({ref: createRef(), value: ''});
    }
    setListTextInput(newListTextInput);
  };


  useEffect(() => {
    // showPopup('Otp berhasil dikirim', 'success');

    resetOtp();

    Keyboard.addListener('keyboardDidHide', () => setActiveIndex());

    return () => {
      Keyboard.removeListener('keyboardDidHide');
    };
  }, []);

  const onChangeText = (value, index, ref) => {
    if (ref) {
      if (value.length > 0) {
        ref.current.focus();
      }
    }

    let newListTextInput = [];
    listTextInput.forEach(e => newListTextInput.push(e));
    newListTextInput[index].value = value;
    setListTextInput(newListTextInput);
  };

  const onKeyPress = (key, index, ref) => {
    if (ref) {
      if (key === 'Backspace') {
        ref.current.focus();
      }
    }
  };

  const getCurrentUser = () => {
    // requestGetCurrentUser()
    //     .then((res) => {
    //         if (res.status) {
    //             dispatch({
    //                 type: 'USER.ADD_USER_DATA',
    //                 data: res.data,
    //             });
    //             setShowModalPopup(true);
    //             setTimeout(() => {
    //                 setShowModalPopup(false);
    //                 if (res.data.longitude == '0' && res.data.latitude == '0') {
    //                     redirectTo('SearchLocationScreen', { attachScreen: 'MAIN' });
    //                 } else {
    //                     redirectTo('MainPage');
    //                 }
    //             }, 2000);
    //         }
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
  };

  const onResendOtp = () => {
    const body = params.body;

    // requestHttp.post('member/otp', body)
    // .then((res) => {
    //     console.log('res otp', res);

    //     if (res.data && res.data.status) {
    //         showPopup('Otp berhasil dikirim', 'success');
    //     } else {
    //         showPopup(res.data.message, 'error');
    //     }
    // })
    // .catch((err) => {
    //     console.log('err otp', err);
    //     showPopup(err.message, 'error');
    // });
  };

  const onSubmit = async isGuest => {
    if (errorSettingBeacon) {
      handleNavigate(auth.user.isRegistered);

      return;
    }

    let otp = '';

    if (isGuest) {
      otp = '0912';
    } else {
      listTextInput.map(e => {
        if (e.value !== '') otp = otp + e.value;
      });
    }

    if (otp.length < 4) {
      showPopup('Silakan masukan nomor otp yang sesuai', 'warning');
      return;
    }

    setIsLoading(true);

    const body = {
      otp,
      phone: params.body.phone,
      // device_token: fcmToken,
    };

    console.log('body otp', body);

    const result = await postNonAuth('validate-otp', body);

    console.log('result', result);

    setIsLoading(false);

    if (result.status) {
      showPopup(result.message, 'success');
      dispatch({
        type: 'AUTH.SET_TOKEN',
        data: result.data.token,
      });
      dispatch({
        type: 'AUTH.SET_USER',
        data: result.data.user,
      });

      handleNavigate(result.data.user.isRegistered);

      return;
    }

    showPopup(result.message, 'error');
  };

  const handleNavigate = async isRegistered => {
    const beaconSetting = await stateBeaconSetting();

    if (beaconSetting) {
      if (typeof params.afterLogin === 'function') {
        params.afterLogin();
      } else if (isRegistered) {
        redirectTo('MainPage');
      } else {
        navigation.navigate('RegisterScreen');
      }

      setErrorSettingBeacon(false);

      return;
    }

    setErrorSettingBeacon(true);

    showPopup('Beacon initial error, silakan klik Verifikasi ulang', 'error');
  };

  return (
    <Scaffold
      popupProps={popupProps}
      isLoading={isLoading}
      fallback={params.isGuest}
      statusBarColor={'#EEEEEE'}
      style={{
        backgroundColor: '#EEEEEE',
      }}
      header={
        <HeaderBig style={{ backgroundColor: 'transparent' }} />
      }
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Keyboard.dismiss()}
          style={{
            flex: 1,
            paddingHorizontal: 16,
            marginTop: 16,
          }}>
          <Container marginTop={34} marginBottom={48} align="flex-start">
            <Text align="left" size={28} type="medium">
              OTP verification
            </Text>
            <Text align="left" type="medium" lineHeight={22}>
              Kami telah mengirimkan kode untuk melakukan verifikasi ke nomor
              kamu.
            </Text>
          </Container>

          <Row justify="space-between">
            <Text type="medium" size={14} lineHeight={16} color={'#797979'}>
              Code*
            </Text>
            <Row justify="center">
              {listTextInput.map((item, idx) => {
                const isFocus = activeIndex === idx;

                return (
                  <View
                    key={idx}
                    style={{
                      paddingHorizontal: 5,
                      width: '23%',
                      aspectRatio: 4 / 3,
                    }}>
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <TextInput
                        ref={item.ref}
                        maxLength={1}
                        selectTextOnFocus
                        keyboardType="numeric"
                        onFocus={() => setActiveIndex(idx)}
                        value={item.value}
                        onChangeText={text =>
                          onChangeText(
                            text,
                            idx,
                            listTextInput[idx + 1]
                              ? listTextInput[idx + 1].ref
                              : null,
                          )
                        }
                        onKeyPress={e =>
                          onKeyPress(
                            e.nativeEvent.key,
                            idx,
                            listTextInput[idx - 1]
                              ? listTextInput[idx - 1].ref
                              : null,
                          )
                        }
                        style={{
                          width: '100%',
                          height: '100%',
                          fontSize: 32,
                          textAlign: 'center',
                          fontFamily: 'Inter-Regular',
                          // borderBottomWidth: 2,
                          color: '#141414',
                          // color: isFocus || item.value !== '' ? Color.tertiary : Color.text,
                          backgroundColor: '#D9D9D9',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: isFocus ? 1 : 0,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </Row>
          </Row>

          <Padding top={10} bottom={40}>
            <Row justify="flex-end">
              <TouchableOpacity
                disabled={countdown > 0}
                onPress={() => {
                  if (countdown > 0) {
                  } else {
                    setCountdown(initialCountdown);
                    resetOtp();
                    onResendOtp();
                  }
                }}>
                <Text
                  type="semibold"
                  size={11}
                  lineHeight={13}
                  color="#797979"
                  // color={countdown > 0 ? Color.disabled : Color.text}
                  align="right">
                  Resend
                </Text>
              </TouchableOpacity>
              <Text align="right" size={11} type="medium" lineHeight={13} color="#141414">
                {` (${FormatDuration.getMinutesFromSeconds(countdown)})`}
              </Text>
            </Row>
          </Padding>

          <Container align='flex-end'>
              <NativeTouchable
                onPress={() => onSubmit()}
                disabled={listTextInput.length < 4}
                style={{ 
                  backgroundColor: listTextInput.length < 4 ? '#797979' : '#242424',
                  paddingVertical: 12,
                  paddingHorizontal: 64.5,
                 }}
              >
                <Text color={listTextInput.length < 4 ? Color.white : '#E7FF00'} type="medium" size={14} lineHeight={16}>
                  Verify
                </Text>
              </NativeTouchable>
            </Container>

          {/* <Button
            style={{marginBottom: 20, ...shadowStyle}}
            onPress={() => onSubmit()}>
            Verifikasi
          </Button> */}

          {/* <Divider />
          <Text color={Color.error}>Sample: {params.mustDelete}</Text> */}
        </TouchableOpacity>
      </ScrollView>

      <AlertModal
        visible={showModalPopup}
        title="Hore! Login Berhasil"
        subTitle="Yuk! jangan lupa cucian hari ini"
        showButton={false}
      />
    </Scaffold>
  );
};

export default OtpScreenV2;

import React, {useState, useEffect, createRef} from 'react';
import {
  View,
  TextInput,
  Keyboard,
  ScrollView,
  useWindowDimensions,
  Image,
  TouchableOpacity as NativeTouchable,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import messaging from '@react-native-firebase/messaging';

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
import {stateUpdateProfile} from 'src/api-rest/stateUpdateProfile';
import WebView from 'react-native-webview';

const initialCountdown = 60 * 1;

const WebViewScreen = ({navigation, route}) => {
  const {params} = route;

  const auth = useSelector(state => state['auth']);

  const [listTextInput, setListTextInput] = useState([]);
  const [activeIndex, setActiveIndex] = useState();
  const [countdown, setCountdown] = useState(initialCountdown);
  const [showModalPopup, setShowModalPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState(params.body.device_token);
  const [errorSettingBeacon, setErrorSettingBeacon] = useState(false);

  const {Color} = useColor();
  const {height, width} = useWindowDimensions();

  const [popupProps, showPopup] = usePopup();
  const dispatch = useDispatch();

  useInterval(() => {
    handleCountDown();
  }, 1000);

  // useEffect(() => {
  //   setFcmToken(params.body.device_token);

  //   if (params.isGuest) {
  //     setIsLoading(true);
  //     onSubmit(params.isGuest);
  //   }
  // }, []);

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

  // useEffect(() => {
  //   // showPopup('Otp berhasil dikirim', 'success');

  //   resetOtp();

  //   const unsub = Keyboard.addListener('keyboardDidHide', () => setActiveIndex());

  //   return () => {
  //     unsub.remove();
  //   };
  // }, []);

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
      fcm_token: fcmToken,
    };

    console.log('body otp ', body);

    const result = await postNonAuth('validate-otp', body);

    console.log('result validate otp', result);

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
      dispatch({
        type: 'AUTH.GUEST_ID',
        data: result.data.gues_id,
      });

      handleNavigate(result.data.user.isRegistered);

      return;
    }

    showPopup(result.message, 'error');
  };

  const handleNavigate = async isRegistered => {
    const beaconSetting = await stateBeaconSetting();

    const fcm_token = await messaging().getToken();
    const body = {fcm_token};
    const updateProfile = await stateUpdateProfile(body);
    console.log('updateProfile', updateProfile);

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

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <Button title="request permissions" onPress={requestCameraPermission} />
      </View>
      <WebView
        source={{uri: 'https://branch-nebulous-jupiter.glitch.me/ar1'}}
        javaScriptEnabled={true}
        cacheEnabled={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </SafeAreaView>
  );
};

export default WebViewScreen;

import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {Submit, usePopup, useColor, Row, Col, Text} from '@src/components';
import Scaffold from '@src/components/Scaffold';

import HeaderBig from 'src/components/HeaderBig';
import client from 'src/lib/apollo';
import {queryBannerList} from 'src/lib/query/banner';
import {onBoarding1, onBoarding2, onBoarding3} from 'assets/images';
import imageAssets from 'assets/images';
import {Divider} from 'src/styled';
import {statusBarHeight} from 'src/utils/constants';
import messaging from '@react-native-firebase/messaging';

const listBoarding = [
  {
    imageAsset: onBoarding1,
    title: 'SELAMAT DATANG DI BLOCX',
    subTitle:
      'Cari apapun yang kamu butuhkan disini dengan mudah, hanya dengan sentuhan jari di satu aplikasi.',
  },
  {
    imageAsset: onBoarding2,
    title: 'BELANJA DI M BLOC MARKET',
    subTitle: 'Cari apapun yang kamu butuhkan disini di Mbloc Market',
  },
  {imageAsset: onBoarding3, title: 'FABRIEK BLOC', subTitle: 'Login Sekarang'},
];

const DOT_SIZE = 32;

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const OnBoardingScreenV2 = ({navigation}) => {
  const {Color} = useColor();
  const [popupProps, showPopup] = usePopup();
  const pagerViewRef = useRef();
  const {height} = useWindowDimensions();

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const user = useSelector(state => state['user.auth'].login.user);
  const {loading, error} = useSelector(state => state['user.auth']);

  const opacity = useState(new Animated.Value(0))[0];
  const leftValue1 = useState(new Animated.Value(500))[0];
  const leftValue2 = useState(new Animated.Value(500))[0];
  const leftValue3 = useState(new Animated.Value(500))[0];

  const fadeInIcon = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const moveText1 = () => {
    Animated.timing(leftValue1, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const moveText2 = () => {
    Animated.timing(leftValue2, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const moveText3 = () => {
    Animated.timing(leftValue3, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    dispatch({type: 'USER.CLEAR_LOADING'});
    setTimeout(() => {
      fadeInIcon();
    }, 400);
    setTimeout(() => {
      moveText1();
    }, 1100);
    setTimeout(() => {
      moveText2();
    }, 1800);
    setTimeout(() => {
      moveText3();
    }, 2500);
  }, []);

  const handleNavigate = async () => {
    let token = '';
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      token = fcmToken;
    }
    const body = {
      phone: '6283891122802',
      device_token: token,
    };

    redirectTo('OtpScreenV2', {body, isGuest: true});
  };

  const handleNavigateWebView = async () => {
    let token = '';
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      token = fcmToken;
    }
    const body = {
      phone: '6283891122802',
      device_token: token,
    };

    redirectTo('WebViewScreen', {body, isGuest: true});
  };

  useEffect(() => {
    if (isFocused) {
      if (user) {
        // redirectTo('MainPage');

        const body = {
          phone: '6283891122802',
        };
        redirectTo('OtpScreenV2', {body, isGuest: true});
      } else {
        // fetchOnBoarding();
      }
    }
  }, [user, error, isFocused]);

  const redirectTo = (nav, params) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: nav, params}],
      }),
    );
  };

  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;

  return (
    <Scaffold
      style={{
        backgroundColor: Color.primary,
      }}
      header={
        user ? (
          <View />
        ) : (
          <Animated.View
            style={{
              width: '100%',
              height: 60,
              elevation: 0,
              borderBottomWidth: 0,
              paddingHorizontal: 16,
              marginVertical: 16,
              opacity,
            }}>
            <Row
              style={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Col
                size={6}
                justify="center"
                align="flex-start"
                style={{height: '100%'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={imageAssets.iconOnboarding}
                    // style={{width: 90, height: 40}}
                    resizeMode="contain"
                  />
                </View>
              </Col>
              <Col
                size={6}
                justify="center"
                align="flex-end"
                style={{height: '100%'}}>
                <Text
                  size={17}
                  type="medium"
                  align="left"
                  color={Color.white}
                  style={{
                    textDecorationLine: 'underline',
                  }}
                  onPress={() => {
                    handleNavigate();
                    // redirectTo('MainPage');
                    // const body = {
                    //   phone: '6283891122802',
                    // };
                    // redirectTo('OtpScreen', { body, isGuest: true });
                  }}>
                  Skip
                </Text>
              </Col>
            </Row>
          </Animated.View>
        )
      }
      fallback={user || loading}
      popupProps={popupProps}>
      <Animated.View
        paddingHorizontal={16}
        style={{flex: 1, justifyContent: 'space-between'}}>
        <Animated.View
          style={{
            flex: 8,
          }}>
          <Animated.Text
            style={{
              transform: [{translateX: leftValue1}],
              fontWeight: '500',
              fontSize: 24,
              color: Color.white,
              lineHeight: 28,
            }}>
            WELCOME
          </Animated.Text>
          <Divider height={16} />
          <Animated.Text
            style={{
              fontWeight: '400',
              transform: [{translateX: leftValue2}],
              fontSize: 42,
              color: Color.white,
              lineHeight: 51,
            }}>
            BLOCX BRINGS YOU TO A PERSONAL JOURNEY, EXPLORING NEW
          </Animated.Text>
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              transform: [{translateX: leftValue2}],
            }}>
            <Image source={imageAssets.iconOnboarding2} />
            <Divider width={10} />
            <Animated.Text
              style={{
                flex: 1,
                fontWeight: '400',
                transform: [{translateX: leftValue2}],
                fontSize: 42,
                color: '#E7FF00',
                lineHeight: 51,
              }}>
              DIGITAL EXPERIENCES
            </Animated.Text>
          </Animated.View>
          <Animated.Text
            style={{
              transform: [{translateX: leftValue2}],
              fontWeight: '400',
              fontSize: 42,
              color: Color.white,
              lineHeight: 51,
            }}>
            AROUND OUR HUMBLE SPACE AND FAILITIES
          </Animated.Text>
        </Animated.View>

        <AnimatedTouchableOpacity
          onPress={() => {
            handleNavigate();
            // redirectTo('MainPage');
            // const body = {
            //   phone: '6283891122802',
            // };
            // redirectTo('OtpScreen', { body, isGuest: true });
          }}
          style={{
            transform: [{translateY: leftValue3}],
            marginVertical: 16,
            borderWidth: 1,
            padding: 12,
            borderColor: '#E7FF00',
            flex: 1,
            maxHeight: 53,
          }}>
          <Animated.Text
            style={{
              color: '#E7FF00',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: 17,
              lineHeight: 20,
            }}>
            Get Started
          </Animated.Text>
        </AnimatedTouchableOpacity>

        <AnimatedTouchableOpacity
          onPress={() => {
            handleNavigateWebView();
          }}
          style={{
            transform: [{translateY: leftValue3}],
            marginVertical: 16,
            borderWidth: 1,
            padding: 12,
            borderColor: '#E7FF00',
            flex: 1,
            maxHeight: 53,
          }}>
          <Animated.Text
            style={{
              color: '#E7FF00',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: 17,
              lineHeight: 20,
            }}>
            Redirect To WebView
          </Animated.Text>
        </AnimatedTouchableOpacity>
      </Animated.View>
    </Scaffold>
  );
};

export default OnBoardingScreenV2;

import React, { useEffect, useState } from 'react';
import {View, Image, useWindowDimensions} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {Button, Scaffold, Text, useColor, usePopup} from '@src/components';
import {bgSplashFooter, bgSplashHeader, iconSplash} from '@assets/images';
import { Container } from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import { stateBeaconSetting } from 'src/api-rest/stateBeaconSetting';

const SplashScreen = ({navigation, route}) => {
  const {width, height} = useWindowDimensions();
  const {Color} = useColor();
  const user = useSelector(state => state['user.auth'].login.user);
  const auth = useSelector(state => state['auth']);
  const dispatch = useDispatch();
  const [popupProps, showPopup] = usePopup();

  const [isLoading, setIsLoading] = useState(false);
  const [errorSettingBeacon, setErrorSettingBeacon] = useState(false);

  console.log('auth splash', auth);

  useEffect(() => {
    dispatch({ type: 'THEME.SET_THEME', data: accessClient.Theme });

    setTimeout(() => {
      if (auth.token) {
        handleNavigate();
      } else {
        dispatch({ type: 'AUTH.CLEAR' });
        dispatch({type: 'USER.LOGOUT'});
        redirectTo('OnBoardingScreenV2');
      }
    }, 3000);
  }, []);

  const handleNavigate = async() => {
    // setIsLoading(true);
    
    // const beaconSetting = await stateBeaconSetting();

    // setIsLoading(false);

    // if (beaconSetting) {
      redirectTo('MainPage');

      // setErrorSettingBeacon(false);

    //   return;
    // }

    // setErrorSettingBeacon(true);

    // showPopup('Initial error, silakan muat ulang', 'error');
  }

  const redirectTo = nav => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: nav}],
      }),
    );
  };

  return (
    <Scaffold
      showHeader={false}
      style={{
        backgroundColor: '#141414',
      }}
      statusBarColor={'#141414'}
      popupProps={popupProps}
      fallback={isLoading}
    >
      {/* <View style={{position: 'absolute', width: '100%', aspectRatio: 1 }}>
        <Image
          source={bgSplashHeader}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View> */}

      <Container
        height={height}
        width={width}
        align='center'
        justify='center'
      >
        <View
          style={{
            width: '44%',
            aspectRatio: 1,
            marginBottom: 12,
          }}
        >
        <Image
          source={iconSplash}
          style={{
            height: '100%',
            width: '100%',
          }}
          resizeMode='contain'
        />
        </View>

        {/* <Text size={11} type='bold'>
          blocX
        </Text> */}

        {errorSettingBeacon && <View style={{width: '100%', paddingTop: 16}}>
          <Button
            onPress={() => handleNavigate()}
          >
            Muat Ulang
          </Button>
        </View>}
      </Container>

      <View style={{position: 'absolute', bottom: 50, width: '100%', alignItems: 'center'}}>
        <Image
          source={bgSplashFooter}
          style={{
            width: '22%',
            resizeMode:"contain"
          }}
        />
      </View>
      <View style={{position: 'absolute', bottom: 0, width: '200%', alignSelf: 'center' }}>
        <View
          style={{ 
            backgroundColor: '#EEFF00',
            paddingVertical: 15,
            width: '100%',
            alignSelf: 'center'
           }}
        >
          <Text numberOfLines={1} size={14} color="#141414" type="medium" lineHeight={17} align='center'>
          The Experience Agregator   •    blocx.id   •   blocX   •   The Experience Agitator   •   blocx.com            
          </Text>
        </View>
      </View>
    </Scaffold>
  );
};

export default SplashScreen;
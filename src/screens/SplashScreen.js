import React, { useEffect } from 'react';
import {View, Image, useWindowDimensions} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {Scaffold, Text, useColor} from '@src/components';
import {bgSplashFooter, bgSplashHeader, iconSplash} from '@assets/images';
import { Container } from 'src/styled';
import { accessClient } from 'src/utils/access_client';

const SplashScreen = ({navigation, route}) => {
  const {width, height} = useWindowDimensions();
  const {Color} = useColor();
  const user = useSelector(state => state['user.auth'].login.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'THEME.SET_THEME', data: accessClient.Theme });

    setTimeout(() => {
      if (user) {
        redirectTo('MainPage');
      } else {
        redirectTo('OnBoardingScreen');
      }
    }, 3000);
  }, []);

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
        backgroundColor: Color.primary
      }}
      statusBarColor={Color.primary}
    >
      <View style={{position: 'absolute', width: '50%', aspectRatio: 7/5 }}>
        <Image
          source={bgSplashHeader}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>

      <Container
        height={height}
        width={width}
        align='center'
        justify='center'
      >
        <View
          style={{
            width: '22%',
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

        <Text size={11} type='bold'>
          M Bloc X
        </Text>
      </Container>

      <View style={{position: 'absolute', bottom: 0, width: '100%', aspectRatio: 3/1 }}>
        <Image
          source={bgSplashFooter}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
    </Scaffold>
  );
};

export default SplashScreen;
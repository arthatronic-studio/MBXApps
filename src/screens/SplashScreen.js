import React, { useEffect } from 'react';
import {View, Image, useWindowDimensions} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {Scaffold, useColor} from '@src/components';
import {iconSplash} from '@assets/images';
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
        redirectTo('KnowMeScreen');
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
        backgroundColor: Color[accessClient.SplashScreen.backgroundColor]
      }}
      statusBarColor={Color[accessClient.SplashScreen.backgroundColor]}
    >
      <Container
        height={height}
        width={width}
        align='center'
        justify='center'
      >
        <Image
          source={iconSplash}
          style={{
            height: '30%',
            width: '60%',
          }}
          resizeMode='contain'
        />
      </Container>
    </Scaffold>
  );
};

export default SplashScreen;
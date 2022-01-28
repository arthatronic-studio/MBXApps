import React, { useEffect } from 'react';
import {View, Image, useWindowDimensions} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {Scaffold} from '@src/components';
import {iconSplash} from '@assets/images';
import { Container } from 'src/styled';

const SplashScreen = ({navigation, route}) => {
  const {width, height} = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);

  useEffect(() => {
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
      header={<View />}
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
import React, { useEffect } from 'react';
import { Image, SafeAreaView, Dimensions } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import {
  useColor
} from '@src/components';

import {
  iconSplash,
} from '@assets/images';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation, route }) => {
  const { Color } = useColor();

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

  const redirectTo = (nav) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: nav }
        ],
      })
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.theme, width: width, alignItems: 'center', justifyContent:'center'}}>
      <Image
        source={iconSplash}
        style={{
          width: '60%',
          height: undefined,
          aspectRatio: 8.7,
        }}
      />
    </SafeAreaView>
  );
}

export default SplashScreen;

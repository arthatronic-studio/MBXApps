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
import AlertModal from 'src/components/Modal/AlertModal';
import {CommonActions} from '@react-navigation/native';
import {HeaderBig} from 'src/components';
import imageAssets from 'assets/images';

const CompleteProfile = ({navigation, route}) => {
  const {params} = route;
  const {Color} = useColor();
  const {width} = useWindowDimensions();

  const [isLoading, setIsLoading] = useState(false);

  const [popupProps, showPopup] = usePopup();

  const redirectTo = (name, params) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name, params}],
      }),
    );
  };

  return (
    <Scaffold
      popupProps={popupProps}
      isLoading={isLoading}
      statusBarColor={'#EEEEEE'}
      style={{
        backgroundColor: '#EEEEEE',
      }}
      header={
        <HeaderBig
          titleRight="Skip"
          titleRightColor={Color.black}
          onPressRightButton={() => redirectTo('MainPage')}
          style={{backgroundColor: 'transparent', paddingTop: 16}}
        />
      }>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
        }}>
        <View style={{flex: 1}} />
        <View style={{flex: 3}}>
          <Container width={253} height={316}>
            <Image
              source={imageAssets.imageBlank}
              style={{width: '100%', height: '100%', resizeMode: 'cover'}}
            />
          </Container>
        </View>
        <View style={{flex: 1, paddingHorizontal: 16}}>
          <Text type="semibold" size={24} lineHeight={28} color={Color.black}>
            COMPLETE YOUR PROFILE
          </Text>
          <Text size={12} lineHeight={19} color={Color.black}>
            Cupcake ipsum dolor sit amet. I love cupcake sesame snaps cotton
            candy danish macaroon.
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: 16,
            paddingHorizontal: 16,
          }}>
          <TouchableOpacity
            onPress={() => redirectTo('CompleteProfileInput')}
            style={{
              borderWidth: 1,
              paddingVertical: 12,
              width: width - 32,
            }}>
            <Text size={14} type="medium" lineHeight={17} color="#242424">
              Complete Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Scaffold>
  );
};

export default CompleteProfile;

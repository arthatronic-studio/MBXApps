import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity as NativeTouchable,
  ScrollView,
  useWindowDimensions,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import {
  usePopup,
  useColor,
  Scaffold,
} from '@src/components';
import {Button, TouchableOpacity} from '@src/components/Button';
import Text from '@src/components/Text';
import validate from '@src/lib/validate';
import {login} from '@src/state/actions/user/auth';
import {redirectTo} from '@src//utils';
import {iconApp} from '@assets/images';
import FormInput from 'src/components/FormInput';
import { Container, Row, Line } from 'src/styled';
import PopupTermCondition from 'src/components/PopupTermCondition';
import { statusBarHeight } from 'src/utils/constants';

const WidgetBgFixIcon = () => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const {height, width} = useWindowDimensions();
    const {Color} = useColor();

    return (
        <>
            <View
                style={{
                width: '100%',
                height: height / 3,
                top: statusBarHeight + height / 3,
                position: 'absolute',
                backgroundColor: Color.primarySoft,
                }}
            />
            
            <View
                style={{
                width: '100%',
                height: height / 3,
                top: statusBarHeight,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Color.primarySoft,
                }}
            >
                <Image
                source={iconApp}
                style={{
                    resizeMode: 'contain',
                    height: '40%',
                    width: '70%',
                    marginTop: '10%',
                    alignSelf: 'center',            
                }}
                />
            </View>
        </>
    )
}

export default WidgetBgFixIcon;
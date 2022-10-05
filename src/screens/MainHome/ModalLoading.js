import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

import {
  Text,
  TouchableOpacity,
  useColor,
  Button,
} from '@src/components';
import { Container } from '@src/styled';
import { useNavigation } from '@react-navigation/native';

const defaultProps = {
  visible: false,
};

const ModalLoading = ({ visible }) => {

  const { Color } = useColor();
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  return (
    <Modal
      isVisible
      animationIn="slideInDown"
      animationOut="slideOutDown"
      backdropColor={Color.semiwhite}
      style={{
        margin: 16
      }}
    >
      <View
        style={{ width: '100%', borderRadius: 16, backgroundColor: Color.theme, }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              height: height / 12,
              aspectRatio: 1,
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator
              size={'large'}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Text
              size={16}
              letterSpacing={0.15}
              type='medium'
            >
              Mohon tunggu
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

ModalLoading.defaultProps = defaultProps;
export default ModalLoading;

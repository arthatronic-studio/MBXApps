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
import { Container, Divider } from '@src/styled';
import { useNavigation } from '@react-navigation/native';
import imageAssets from 'assets/images';
import { useSelector } from 'react-redux';

const defaultProps = {
  visible: false,
  onClose: () => {},
};

const ModalBeaconCheckin = ({ item, visible, onClose }) => {

  const auth = useSelector(state => state['auth']);
  const { Color } = useColor();
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  return (
    <Modal
      isVisible={visible}
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
              paddingHorizontal: 16,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                alignItems: 'center',
              }}
            >
              <Text size={12}>Selamat Datang di</Text>
              <Divider height={4} />
              <Text size={22} letterSpacing={0.15} type='medium'>{auth.user && auth.user.activityInfo && auth.user.activityInfo.location ? auth.user.activityInfo.location.name : ''}</Text>
              <Divider />
              <View
                style={{
                  width: '100%',
                  aspectRatio: 1,
                }}
              >
                <Image
                  source={{ uri: 'https://anekatempatwisata.com/wp-content/uploads/2022/04/M-Bloc-Space.jpg' }}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 8,
                  }}
                />
              </View>
            </View>

            <Container width='100%' paddingTop={16}>
              <Button
                outline
                color={Color.primaryMoreDark}
                onPress={() => {
                  onClose();
                }}
              >
                Tutup
              </Button>
            </Container>
          </View>
        </View>
    </Modal>
  );
};

ModalBeaconCheckin.defaultProps = defaultProps;
export default ModalBeaconCheckin;

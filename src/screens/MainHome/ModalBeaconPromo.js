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

const ModalBeaconPromo = ({ item, visible, onClose }) => {

  const auth = useSelector(state => state['auth']);
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
            paddingVertical: 10,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text size={16} letterSpacing={0.15} type='medium'>Lagi ada promo nih!</Text>
          </View>

          <Container width='100%' borderWidth={1} borderColor={Color.textSoft} radius={8}>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('TenantDetailScreen', { item });
              }}
              style={{
                width: '100%',
                paddingTop: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
              }}
            >
              <View style={{ height: 52, aspectRatio: 1 }}>
                <Image
                  // source={{ uri: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '' }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 8,
                    backgroundColor: Color.border,
                  }}
                />
              </View>
              <View style={{ flex: 1, padding: 10 }}>
                <Text align='left' type='medium' numberOfLines={2} letterSpacing={0.1}>Titik temu kopi</Text>
                <Text align='left' type='medium' numberOfLines={2} size={10} color={Color.disabled}>Kafe</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Fontisto
                  name={'angle-right'}
                  color={Color.primaryMoreDark}
                  size={15}
                />
              </View>
            </TouchableOpacity>

            <View style={{ width: '100%', padding: 12, aspectRatio: 16 / 9 }}>
              <View style={{ width: '100%', height: '100%', flexDirection: 'row', borderWidth: 1, borderColor: Color.textSoft, borderRadius: 8 }}>
                <Container flex={1} justify='space-between' padding={10}>
                  <View style={{ height: 52, aspectRatio: 1 }}>
                    <Image
                      // source={{ uri: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '' }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 8,
                        backgroundColor: Color.border,
                      }}
                    />
                  </View>
                  <View>
                    <Text size={22} align='left' color={Color.success} type='bold'>Weekend Time</Text>
                    <Text size={10} align='left'>Dicount All Coffee Variant up to 40%</Text>
                  </View>
                  <Text size={10} align='left'>01 Oct - 02 Oct 2022</Text>
                </Container>

                <View
                  style={{
                    height: '100%',
                    aspectRatio: 2 / 3,
                  }}
                >
                  <Image
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: Color.border,
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                    }}
                  />
                </View>
              </View>
            </View>
          </Container>

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

ModalBeaconPromo.defaultProps = defaultProps;
export default ModalBeaconPromo;

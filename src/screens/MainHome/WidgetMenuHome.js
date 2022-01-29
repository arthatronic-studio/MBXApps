import React from 'react';
import {
  View,
  Image,
} from 'react-native';
import Styled from 'styled-components';
import {useNavigation} from '@react-navigation/native';

import {
  Text,
  TouchableOpacity,
  useColor,
} from '@src/components';
import {shadowStyle} from '@src/styles';
import {Container} from '@src/styled';
import {
  iconBPJS,
  iconGames,
  iconInternet,
  iconIuran,
  iconPDAM,
  iconPLN,
  iconPulsa,
  iconSemua,
  iconLelang,
  iconMediaPlayer,
} from '@assets/images/home';

const SambatanMenuView = Styled(View)`
  width: 100%;
  borderRadius: 8px;
  marginTop: 16px;
  paddingTop: 30px;
  paddingHorizontal: 8px;
  flexDirection: row;
  flexWrap: wrap;
`;

const PerUserIcons = Styled(TouchableOpacity)`
  width: 25%;
  aspectRatio: 1.5;
  flexDirection: column;
  marginBottom: 12px;
`;

const UserIcon = Styled(View)`
  height: 100%;
  justifyContent: flex-start;
  alignItems: center;
`;

const ImageProperty = Styled(Image)`
  height: 40%;
  aspectRatio: 1;
  marginBottom: 8;
`;

const ComingSoonContainer = Styled(View)`
  width: 100%;
  justifyContent: center;
  alignItems: center;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: -24;
`;

const ComingSoonView = Styled(View)`
  borderRadius: 30;
  padding: 0px 5px 2px 5px;
  justifyContent: center;
  alignItems: center;
`;

const menuHome = [
  {
    id: 8,
    name: 'Media Player',
    images: iconMediaPlayer,
    nav: '',
    params: {},
    badge: true,
  },
  {
    id: 7,
    name: 'Lelang',
    images: iconLelang,
    nav: 'Lelang',
    params: {},
    badge: true,
  },
  {id: 0, name: 'Pulsa', images: iconPulsa, nav: 'PulsaScreen', params: {}},
  {id: 1, name: 'Listrik', images: iconPLN, nav: 'PlnScreen', params: {}},
  // {id: 2, name: 'Game', images: iconGames, nav: '', params: {}},
  {id: 3, name: 'PDAM', images: iconPDAM, nav: 'PdamScreen', params: {}},
  // {id: 4, name: 'BPJS', images: iconBPJS, nav: '', params: {}},
  // {
  //   id: 5,
  //   name: 'Internet',
  //   images: iconInternet,
  //   nav: '',
  //   params: {title: 'Iuran Non-wajib', type: 'ACTIVE', productType: 'SAMBATAN_O',}},
  {
    id: 6,
    name: 'Iuran',
    images: iconIuran,
    nav: 'OrderListPerProduct',
    params: {title: 'Iuran', type: 'ACTIVE', productType: 'ALL_SAMBATAN'},
  },
  // {
  //   id: 7,
  //   name: 'Semua',
  //   images: iconSemua,
  //   nav: '',
  //   params: {title: 'Iuran Non-wajib', type: 'ACTIVE', productType: 'SAMBATAN_O',}},
];

const WidgetMenuHome = (props) => {
  const {Color} = useColor();
  const navigation = useNavigation();

  const renderComingSoon = () => {
    return (
      <ComingSoonContainer>
        <ComingSoonView style={{backgroundColor: Color.border}}>
          <Text size={8}>Coming Soon</Text>
        </ComingSoonView>
      </ComingSoonContainer>
    );
  };

  const renderMenuBadge = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: -6,
          right: 16,
        }}>
        <ComingSoonView style={{backgroundColor: Color.red}}>
          <Text size={8} color={Color.textInput}>
            New
          </Text>
        </ComingSoonView>
      </View>
    );
  };

  return (
    <Container paddingHorizontal={16}>
      <SambatanMenuView
        style={{...shadowStyle, backgroundColor: Color.textInput}}>
        {menuHome.map((menu, idx) => {
          if (Platform.OS === 'ios' && menu.comingsoon) {
            return null;
          }

          return (
            <PerUserIcons
              key={idx}
              activeOpacity={0.75}
              disabled={menu.comingsoon}
              onPress={() => {
                if (menu.nav === '') return;
                navigation.navigate(menu.nav, menu.params);
              }}>
              <UserIcon>
                <ImageProperty
                  style={menu.comingsoon && {opacity: 0.3}}
                  resizeMode="contain"
                  source={menu.images}
                />
                <Text size={12} style={menu.comingsoon && {opacity: 0.3}}>
                  {menu.name}
                </Text>
                {/* {(menu.comingsoon || menu.nav === '') && renderComingSoon()} */}
                {menu.badge && renderMenuBadge()}
              </UserIcon>
            </PerUserIcons>
          );
        })}
      </SambatanMenuView>
    </Container>
  );
};

export default WidgetMenuHome;

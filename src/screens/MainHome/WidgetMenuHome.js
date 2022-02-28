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
  iconMenuArtikel,
  iconMenuEvent,
  iconMenuLoker,
  iconMenuTempat,
} from '@assets/images/home';
import { accessClient } from 'src/utils/access_client';
import { GALogEvent } from 'src/utils/analytics';

const SambatanMenuView = Styled(View)`
  width: 100%;
  borderRadius: 8px;
  paddingTop: 24px;
  paddingHorizontal: 8px;
  flexDirection: row;
  flexWrap: wrap;
`;

const CardMenu = Styled(TouchableOpacity)`
  flexDirection: column;
  marginBottom: 12px;
`;

const UserIcon = Styled(View)`
  height: 100%;
  justifyContent: flex-start;
  alignItems: center;
`;

const ImageProperty = Styled(Image)`
  height: 50%;
  aspectRatio: 1;
  marginBottom: 6;
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

const listMenuHome = [
  // menu komoto
  {
    id: 1,
    code: 'job',
    name: 'Loker',
    images: iconMenuLoker,
    nav: 'JobScreen',
    params: { title: 'Loker' },
    badge: false,
    show: accessClient.MenuHome.showJob,
  },
  {
    id: 2,
    code: 'place',
    name: 'Tempat',
    images: iconMenuTempat,
    nav: 'PlaceScreen',
    params: { title: 'Tempat' },
    badge: false,
    show: accessClient.MenuHome.showPlace,
  },
  {
    id: 3,
    code: 'event',
    name: 'Event',
    images: iconMenuEvent,
    nav: 'EventScreen',
    params: { title: 'Event' },
    badge: false,
    show: true,
  },
  {
    id: 4,
    code: 'news',
    name: 'Artikel',
    images: iconMenuArtikel,
    nav: 'NewsScreen',
    params: { title: 'Artikel' },
    badge: false,
    show: true,
  },

  // menu tribes
  // {
  //   id: 8,
  //   code: '',
  //   name: 'Media Player',
  //   images: iconMediaPlayer,
  //   nav: '',
  //   params: {},
  //   badge: true,
  //   show: true,
  // },
  // {
  //   id: 7,
  //   code: '',
  //   name: 'Lelang',
  //   images: iconLelang,
  //   nav: 'Lelang',
  //   params: {},
  //   badge: true,
  //   show: true,
  // },
  // {
  //   id: 10,
  //   code: 'post',
  //   name: 'Posting',
  //   images: iconIuran,
  //   nav: '',
  //   params: {},
  //   badge: true,
  //   show: true,
  // },
  // {id: 0, code: '', name: 'Pulsa', images: iconPulsa, nav: 'PulsaScreen', params: {}},
  // {id: 1, code: '', name: 'Listrik', images: iconPLN, nav: 'PlnScreen', params: {}},
  // // {id: 2, code: '', name: 'Game', images: iconGames, nav: '', params: {}},
  // {id: 3, code: '', name: 'PDAM', images: iconPDAM, nav: 'PdamScreen', params: {}},
  // // {id: 4, code: '', name: 'BPJS', images: iconBPJS, nav: '', params: {}},
  // // {
  // //   id: 5,
  // //   code: '',
  // //   name: 'Internet',
  // //   images: iconInternet,
  // //   nav: '',
  // //   params: {title: 'Iuran Non-wajib', type: 'ACTIVE', productType: 'SAMBATAN_O',}},
  // {
  //   id: 6,
  //   code: '',
  //   name: 'Iuran',
  //   images: iconIuran,
  //   nav: 'OrderListPerProduct',
  //   params: {title: 'Iuran', type: 'ACTIVE', productType: 'ALL_SAMBATAN'},
  // },
  // // {
  // //   id: 7,
  // //   code: '',
  // //   name: 'Semua',
  // //   images: iconSemua,
  // //   nav: '',
  // //   params: {title: 'Iuran Non-wajib', type: 'ACTIVE', productType: 'SAMBATAN_O',}},
  // // {
  // //   id: 9,
  // //   code: '',
  // //   name: 'Lainnya', // 'Tagihan &\n Isi Ulang',
  // //   images: iconIuran,
  // //   nav: '',
  // //   params: {},
  // // },
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

  let menuRealLength = 0;
  listMenuHome.map((e) => e.show ? menuRealLength +=1 : null);
  let widthMenu = menuRealLength < 4 ? 100 / menuRealLength : 25;

  return (
    <Container paddingHorizontal={16}>
      <SambatanMenuView
        style={{...shadowStyle, backgroundColor: Color.textInput}}>
        {listMenuHome.map((menu, idx) => {
          if (!menu.show || (Platform.OS === 'ios' && menu.comingsoon)) {
            return null;
          }

          return (
            <CardMenu
              key={idx}
              activeOpacity={0.75}
              disabled={menu.comingsoon}
              onPress={() => {
                props.onPress(menu);

                if (menu.nav === '') return;
                GALogEvent(menu.name, {menu});
                navigation.navigate(menu.nav, menu.params);
              }}
              style={{
                width: `${widthMenu}%`,
                aspectRatio: menuRealLength,
              }}
            >
              <UserIcon>
                <ImageProperty
                  style={menu.comingsoon ? {opacity: 0.3} : {} }
                  resizeMode="contain"
                  source={menu.images}
                />
                <Text size={12} style={menu.comingsoon && {opacity: 0.3}}>
                  {menu.name}
                </Text>
                {/* {(menu.comingsoon || menu.nav === '') && renderComingSoon()} */}
                {menu.badge && renderMenuBadge()}
              </UserIcon>
            </CardMenu>
          );
        })}
      </SambatanMenuView>
    </Container>
  );
};

export default WidgetMenuHome;

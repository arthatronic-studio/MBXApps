import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Linking,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { useSelector } from 'react-redux';

import {
  Text,
  TouchableOpacity,
  useColor,
} from '@src/components';
import {shadowStyle} from '@src/styles';
import {Container} from '@src/styled';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import client from 'src/lib/apollo';
import { queryMenuList } from 'src/lib/query';
import { accessClient } from 'src/utils/access_client';
import { initialItemState } from 'src/utils/constants';
import ModalMenuHome from 'src/components/Modal/ModalMenuHome';
import imageAssets from 'assets/images';
import { getAPI } from 'src/api-rest/httpService';

const defaultProps = {
  showMore: true,
};

const WidgetHomeMenuStatic = ({ showMore }) => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const user = useSelector(state => state['user.auth'].login.user);
  const {width} = useWindowDimensions();

  const [listMenuHome, setListMenuHome] = useState([
    // {name: 'Shop', nav: 'Ecommerce', param: {}, image: imageAssets.homeMenuShop, show: true },
    {name: 'Event', nav: 'EventScreen', param: {}, image: imageAssets.homeMenuEvent, show: true },
    // {name: 'Forum', nav: 'ForumScreen', param: {}, image: imageAssets.homeMenuForum, show: true },
    {name: 'Eats', nav: 'EatScreen', param: {}, image: imageAssets.homeMenuEats, show: true },
    {name: 'Fest', nav: 'https://tribesocial.asia', param: {}, image: imageAssets.homeMenuFest, show: true },
  ]);
  const [itemData, setItemData] = useState(initialItemState);
  const [modalMenuHome, setModalMenuHome] = useState(false);

  useEffect(() => {
    fetchMenuList();
  }, []);

  const fetchMenuList = async() => {
    const result = await getAPI('menu');
    console.log('result menu', result);
    if (result.status) {
      
    }
  }

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
        <View style={{
          backgroundColor: Color.error,
          borderRadius: 30,
          paddingBottom: 1,
          paddingHorizontal: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text size={8} color={Color.textInput}>
            New
          </Text>
        </View>
      </View>
    );
  };

  let menuRealLength = 0;
  const currentData = showMore ? listMenuHome : itemData.data;
  currentData.map((e) => e.show ? menuRealLength +=1 : null);
  const widthPerMenu = menuRealLength < 4 ? 100 / menuRealLength : 25;
  const widthIconMenu = (width / (menuRealLength < 4 ? menuRealLength : 4) - 16) / 1.8;
  const paddingInMenu = 16;

  if (currentData.length === 0) return <View />;

  const spaceContentSize = 8;

  return (
    <Container paddingHorizontal={paddingInMenu}>
      <Container
        style={{
          backgroundColor: Color.theme,
          width: '100%',
          paddingVertical: paddingInMenu,
          flexDirection: 'row',
          flexWrap: 'wrap',
          borderRadius: 8,
          ...shadowStyle,
        }}
      >
        {currentData.map((menu, idx) => {
          if (!menu.show || (Platform.OS === 'ios' && menu.comingsoon)) {
            return null;
          }

          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.75}
              disabled={menu.comingsoon}
              onPress={() => {
                if (!menu.nav) return;

                // GALogEvent(menu.name, {
                //   id: menu.code,
                //   product_name: menu.name,
                //   user_id: user.userId,
                //   method: analyticMethods.viewAll,
                // });

                if (menu.nav.includes('http://') || menu.nav.includes('https://')) {
                  navigation.navigate('WebviewGeneralScreen', { url: menu.nav });
                  return;
                }
                else if (menu.nav === 'modal') {
                  setModalMenuHome(true);
                  return;
                }

                navigation.navigate(menu.nav, { title: menu.name, ...menu.params });
              }}
              style={{
                width: `${widthPerMenu}%`,
                alignItems: 'center',
                // marginBottom: paddingInMenu,
              }}
            >
              <View
                style={{
                  height: widthIconMenu,
                  width: widthIconMenu,
                  marginBottom: 4,
                  borderRadius: widthIconMenu / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  style={[
                    {
                      height: '100%',
                      width: '100%'
                    },
                    menu.comingsoon ? {opacity: 0.3} : {}
                  ]}
                  resizeMode="contain"
                  source={menu.image}
                />
              </View>
              
              <Text size={10} type='medium' style={menu.comingsoon && {opacity: 0.3}}>
                {menu.name}
              </Text>

              {menu.badge && renderMenuBadge()}
            </TouchableOpacity>
          );
        })}
      </Container>

      <ModalMenuHome
        visible={modalMenuHome}
        onClose={() => {
          setModalMenuHome(false);
        }}
      />
    </Container>
  );
};

WidgetHomeMenuStatic.defaultProps = defaultProps;
export default WidgetHomeMenuStatic;

import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
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

const defaultProps = {
  onPress: () => {},
  showMore: true,
};

const WidgetHomeMenuStatic = ({ onPress, showMore }) => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const user = useSelector(state => state['user.auth'].login.user);
  const {width} = useWindowDimensions();

  const [listMenuHome, setListMenuHome] = useState([
    {name: 'Event', nav: '', param: {}, image: imageAssets.homeMenuEvent, show: true },
    {name: 'Promo', nav: '', param: {}, image: imageAssets.homeMenuPromo, show: true },
    {name: 'Eats', nav: '', param: {}, image: imageAssets.homeMenuEats, show: true },
    {name: 'Shop', nav: '', param: {}, image: imageAssets.homeMenuShop, show: true },
  ]);
  const [itemData, setItemData] = useState(initialItemState);
  const [modalMenuHome, setModalMenuHome] = useState(false);

  useEffect(() => {
    // fetchMenuList();
  }, []);

  // const fetchMenuList = () => {
  //   const variables = {
  //     page: showMore ? 1 : itemData.page + 1,
  //     itemPerPage: showMore ? 8 : 80,
  //     orderDir: 'ASC',
  //     type: accessClient.InitialCode,
  //     category: 'HOME',
  //   };

  //   client.query({
  //     query: queryMenuList,
  //     variables,
  //   })
  //   .then((res) => {
  //     console.log('res menu list', res);

  //     const data = res.data.menuList;
  //     let newData = [];

  //     if (Array.isArray(data)) {
  //       data.map((e) => {
  //         if (e.code === 'SHOW_ALL') {
  //           if (showMore) newData.push(e);
  //         } else {
  //           newData.push(e);
  //         }
  //       });
  //     }

  //     setListMenuHome(newData);

  //     setItemData({
  //       ...itemData,
  //       data: itemData.data.concat(newData),
  //       page: newData.length > 0 ? itemData.page + 1 : -1,
  //       loading: false,
  //       loadNext: false,
  //       refresh: false,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log('err menu list', err);
  //   });
  // }

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
    <Container paddingTop={8}>
      <Container
        style={{
          backgroundColor: Color.theme,
          width: '100%',
          // paddingTop: paddingInMenu,
          flexDirection: 'row',
          flexWrap: 'wrap',
          // ...shadowStyle,
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
                onPress(menu);

                if (!menu.nav) return;

                GALogEvent(menu.name, {
                  id: menu.code,
                  product_name: menu.name,
                  user_id: user.userId,
                  method: analyticMethods.viewAll,
                });

                if (menu.nav === 'modal') {
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
                  backgroundColor: Color.primarySoft,
                  marginBottom: 10,
                  borderRadius: widthIconMenu / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  style={[
                    {
                      height: '55%',
                      width: '55%'
                    },
                    menu.comingsoon ? {opacity: 0.3} : {}
                  ]}
                  resizeMode="contain"
                  source={menu.image}
                />
              </View>
              
              <Text size={12} style={menu.comingsoon && {opacity: 0.3}}>
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

import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Linking,
  useWindowDimensions,
  Touchable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {Text, TouchableOpacity, useColor} from '@src/components';
import {shadowStyle} from '@src/styles';
import {Container} from '@src/styled';
import {analyticMethods, GALogEvent} from 'src/utils/analytics';
import client from 'src/lib/apollo';
import {queryMenuList} from 'src/lib/query';
import {accessClient} from 'src/utils/access_client';
import {initialItemState} from 'src/utils/constants';
import ModalMenuHome from 'src/screens/MainHome/ModalMenuHome';
import imageAssets from 'assets/images';
import {getAPI} from 'src/api-rest/httpService';
import messaging from '@react-native-firebase/messaging';
import {redirectTo} from 'src/utils';

const defaultProps = {};

const WidgetHomeMenuStatic = () => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const user = useSelector(state => state['user.auth'].login.user);
  const {width} = useWindowDimensions();

  const [listMenuHome, setListMenuHome] = useState([]);
  const [numOfColumn, setNumOfColumn] = useState(3);
  const [modalMenuHome, setModalMenuHome] = useState(false);

  useEffect(() => {
    fetchMenuList();
  }, []);

  const fetchMenuList = async () => {
    const result = await getAPI('menu');
    // console.log('result menu', result);

    let newData = [];
    let newNumOfColumn = 3;

    if (result.status) {
      newNumOfColumn = result.num_of_column;

      result.data.map((e, idx) => {
        let obj;

        switch (e.code) {
          case 'shop':
            obj = {
              name: e.name,
              navigate: e.navigate || 'ShopScreen',
              imageAsset: imageAssets.homeMenuShop,
              imageUrl: e.file,
            };
            break;
          case 'event':
            obj = {
              name: e.name,
              navigate: e.navigate || 'EventScreen',
              imageAsset: imageAssets.homeMenuEvent,
              imageUrl: e.file,
            };
            break;
          case 'forum':
            obj = {
              name: e.name,
              navigate: e.navigate || 'ForumScreen',
              imageAsset: imageAssets.homeMenuForum,
              imageUrl: e.file,
            };
            break;
          case 'eats':
            obj = {
              name: e.name,
              navigate: e.navigate || 'EatScreen',
              imageAsset: imageAssets.homeMenuEats,
              imageUrl: e.file,
            };
            break;
          case 'artikel':
            obj = {
              name: e.name,
              navigate: e.navigate || 'NewsScreen',
              imageAsset: imageAssets.homeMenuFest,
              imageUrl: e.file,
            };
            break;
          case 'fest':
            obj = {
              name: e.name,
              navigate: e.navigate || 'FestScreen',
              imageAsset: imageAssets.homeMenuFest,
              imageUrl: e.file,
            };
            break;
          case 'group':
            obj = {
              name: e.name,
              navigate: e.navigate || 'GroupScreen',
              imageAsset: imageAssets.homeMenuFest,
              imageUrl: e.file,
            };
            break;
          default:
            obj = {
              name: e.name,
              navigate: e.navigate,
              imageAsset: imageAssets.homeMenuFest,
              imageUrl: e.file,
            };
            break;
        }

        if (obj) newData.push(obj);
      });
    }

    setListMenuHome(newData);
    setNumOfColumn(newNumOfColumn);
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
        <View
          style={{
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

  const menuPerColumn =
    listMenuHome.length < numOfColumn ? listMenuHome.length : numOfColumn;
  const widthPerMenu = 100 / menuPerColumn;
  const paddingInMenu = 16;

  if (listMenuHome.length === 0) return <View />;

  const handleNavigateWebView = async () => {
    let token = '';
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      token = fcmToken;
    }
    const body = {
      phone: '6283891122802',
      device_token: token,
    };
    redirectTo('WebViewScreen', {body, isGuest: true});
  };

  return (
    <Container padding={paddingInMenu - 2}>
      <Container
        style={{
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          borderRadius: 8,
        }}>
        {listMenuHome.map((menu, idx) => {
          if (Platform.OS === 'ios' && menu.comingsoon) {
            return null;
          }

          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.75}
              disabled={menu.comingsoon}
              onPress={() => {
                if (!menu.navigate) return;

                // GALogEvent(menu.name, {
                //   id: menu.code,
                //   product_name: menu.name,
                //   user_id: user.userId,
                //   method: analyticMethods.viewAll,
                // });

                if (
                  menu.navigate.includes('http://') ||
                  menu.navigate.includes('https://')
                ) {
                  navigation.navigate('WebviewGeneralScreen', {
                    url: menu.navigate,
                  });
                  return;
                } else if (menu.navigate === 'modal') {
                  setModalMenuHome(true);
                  return;
                }

                navigation.navigate(menu.navigate, {
                  title: menu.name,
                  ...menu.params,
                });
              }}
              style={{
                width: `${widthPerMenu}%`,
                aspectRatio: 1,
                padding: 2,
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Color.primary,
                }}>
                <View
                  style={{
                    width: '33%',
                    aspectRatio: 1,
                    marginBottom: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      menu.imageUrl ? {uri: menu.imageUrl} : menu.imageAsset
                    }
                    style={[
                      {
                        height: '100%',
                        width: '100%',
                      },
                      menu.comingsoon ? {opacity: 0.3} : {},
                    ]}
                    resizeMode="contain"
                  />
                </View>

                <Text
                  size={10}
                  type="medium"
                  style={menu.comingsoon && {opacity: 0.3}}
                  color={Color.textButtonInline}>
                  {menu.name}
                </Text>

                {menu.badge && renderMenuBadge()}
              </View>
            </TouchableOpacity>
          );
        })}
      </Container>
      <TouchableOpacity
        onPress={() => {
          handleNavigateWebView();
        }}
        style={{
          marginVertical: 16,
          borderWidth: 1,
          padding: 12,
          borderColor: '#000000',
          flex: 1,
          maxHeight: 53,
        }}>
        <Text
          style={{
            color: '#000000',
            textAlign: 'center',
            fontWeight: '500',
            fontSize: 17,
            lineHeight: 20,
          }}>
          Redirect To WebView
        </Text>
      </TouchableOpacity>
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

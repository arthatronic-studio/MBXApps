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

const defaultProps = {
  itemPerPage: 8,
  onPress: () => {},
};

const WidgetMenuHome = ({ itemPerPage, onPress }) => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const user = useSelector(state => state['user.auth'].login.user);
  const {width} = useWindowDimensions();

  const [listMenuHome, setListMenuHome] = useState([]);

  useEffect(() => {
    fetchMenuList();
  }, []);

  const fetchMenuList = () => {
    const variables = {
      page: 1,
      itemPerPage,
      orderDir: 'ASC',
      type: accessClient.InitialCode,
      category: 'HOME',
    };

    client.query({
      query: queryMenuList,
      variables,
    })
    .then((res) => {
      console.log('res menu list', res);

      const data = res.data.menuList;
      if (Array.isArray(data)) {
        setListMenuHome(data);
      }
    })
    .catch((err) => {
      console.log('err menu list', err);
    });
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
  listMenuHome.map((e) => e.show ? menuRealLength +=1 : null);
  const widthPerMenu = menuRealLength < 4 ? 100 / menuRealLength : 25;
  const widthIconMenu = (width / (menuRealLength < 4 ? menuRealLength : 4) - 16) / 2.5;

  if (listMenuHome.length === 0) return <View />;

  return (
    <Container padding={16}>
      <Container
        style={{
          ...shadowStyle,
          backgroundColor: Color.textInput,
          width: '100%',
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingTop: 24,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {listMenuHome.map((menu, idx) => {
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

                if (menu.nav === '') return;

                GALogEvent(menu.name, {
                  id: menu.code,
                  product_name: menu.name,
                  user_id: user.userId,
                  method: analyticMethods.viewAll,
                });

                if (menu.nav === 'modal') {
                  // ganti ke modal show menu all
                  navigation.navigate('MediaPlayerScreen', { title: menu.name, ...menu.params });
                  return;
                }

                navigation.navigate(menu.nav, { title: menu.name, ...menu.params });
              }}
              style={{
                width: `${widthPerMenu}%`,
                alignItems: 'center',
                paddingBottom: 24,
              }}
            >
              <View
                style={{
                  height: widthIconMenu,
                  width: widthIconMenu,
                  paddingBottom: 6,
                }}
              >
                <Image
                  style={[
                    {height: '100%', width: '100%'},
                    menu.comingsoon ? {opacity: 0.3} : {}
                  ]}
                  resizeMode="contain"
                  source={{ uri: menu.image }}
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
    </Container>
  );
};

WidgetMenuHome.defaultProps = defaultProps;
export default WidgetMenuHome;

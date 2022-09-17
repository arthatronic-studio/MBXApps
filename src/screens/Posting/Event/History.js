import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, ScrollView, Platform, Linking, Pressable, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import Header from '@src/components/Header';
import { useLoading, usePopup, useColor, Alert, Row, Col } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { TouchableOpacity, Button } from '@src/components/Button';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import ImagesPath from 'src/components/ImagesPath';
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { getHistory } from 'src/lib/query/event';
import { FormatMoney } from 'src/utils';
import { getAPI } from 'src/api-rest/httpService';
import { initialItemState } from 'src/utils/constants';
import HistoryRiwayat from './HistoryRiwayat';
import HistoryTiketku from './HistoryTiketku';

const Tab = createMaterialTopTabNavigator();

const CustomTabBar = (props) => {
  const { navigation, navigationState } = props;

  const { Color } = useColor();
  const { width } = useWindowDimensions();

  console.log(props);

  return (
    <Container paddingHorizontal={16}>
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {navigationState.routes.map((item, idx) => {
          const isActive = navigationState.index === idx;
          const isFirst = idx === 0;
          const isLast = idx === (navigationState.routes.length - 1);
          const label = item.name;

          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.65}
              onPress={() => {
                navigation.navigate(item.name);
              }}
            >
              <Container
                width={(width / navigationState.routes.length) - 16.5}
                color={isActive ? Color.primarySoft : 'transparent'}
                paddingVertical={12}
                style={
                  isFirst ? {
                    borderTopLeftRadius: 120,
                    borderBottomLeftRadius: 120,
                    borderWidth: 0.5,
                    borderRightWidth: 0.25,
                  } :
                    isLast ? {
                      borderTopRightRadius: 120,
                      borderBottomRightRadius: 120,
                      borderWidth: 0.5,
                      borderLeftWidth: 0.25,
                    } : {}
                }
              >
                <Text size={12} type='medium' letterSpacing={0.5}>{label}</Text>
              </Container>
            </TouchableOpacity>
          )
        })}
      </View>
    </Container>
  )
}

const History = ({ navigation, route }) => {

  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  const isFocused = useIsFocused();

  return (
    <Scaffold
      style={{ backgroundColor: '#F4F4F4' }}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          type="bold"
          centerTitle={false}
          title="Tiket"
        />
      }
    >
      <Divider />
      
      <Tab.Navigator
        initialRouteName={'HistoryTiketku'}
        tabBarOptions={{
            indicatorStyle: {
                backgroundColor: Color.theme,
                height: '100%'
            },
            activeTintColor: Color.text,
            inactiveTintColor: Color.secondary,
            labelStyle: {
                fontSize: 12,
            },
            indicatorStyle: {
                borderBottomColor: Color.primary,
                borderBottomWidth: 2,
            },
            style: {
                backgroundColor: Color.theme,
            }
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
    >
        <Tab.Screen
            name="Tiketku"
            component={HistoryTiketku}
            options={{tabBarLabel: 'Tiketku'}}
        />
        <Tab.Screen
            name="Riwayat"
            component={HistoryRiwayat}
            options={{tabBarLabel: 'Riwayat'}}
        />
    </Tab.Navigator>
    </Scaffold>
  )
}

export default History;
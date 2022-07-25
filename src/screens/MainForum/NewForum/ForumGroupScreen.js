import React, { useState, useEffect, useRef } from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  Text,
  Header,
  Scaffold,
  useColor
} from '@src/components';
import {
  iconPencil,
} from '@assets/images/home';
import { TouchableOpacity } from '@src/components/Button';
import TabForumNewPost from '../TabForumNewPost';
import TabForumMyPost from '../TabForumMyPost';
import { Container, Divider } from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import { queryproductGroupList } from 'src/lib/query';
import Client from '@src/lib/apollo';
import { fetchGroupMemberList } from 'src/api/forum/listmemberGroup';
import { shadowStyle } from 'src/styles';
import WidgetForumGroup from './WidgetForumGroup';
import Config from 'react-native-config';
import TabViewCollapsible from 'src/components/TabViewCollapsible';
import { statusBarHeight } from 'src/utils/constants';

const { Navigator, Screen } = createMaterialTopTabNavigator();
const itemPerPage = 100;

const ForumGroupScreen = ({ navigation, route }) => {
  const params = route.params.data;

  const { Color } = useColor();
  const { width, height } = useWindowDimensions();

  const [memberData, setMemberDataAll] = useState([]);
  const [memberDataReq, setMemberDataReq] = useState([]);

  const [itemData, setItemData] = useState({
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
  });

  // useEffect(() => {
  //   fetchGroupList();
  // }, []);

  useEffect(() => {
    fetchMemberAll();
    fetchMemberReq();
  }, []);

  const fetchMemberAll = async () => {
    const variables = {
      groupId: params.id,
      status: 1,
    };

    console.log('variables', variables);

    const result = await fetchGroupMemberList(variables);
    console.log(result, 'result all');
    if (result.status) {
      const data = result.data;

      let newArr = [];

      if (data) {
        newArr = itemData.data.concat(data);
      }

      setMemberDataAll(data);
    }
  }
  const fetchMemberReq = async () => {
    const variables = {
      groupId: params.id,
      status: 0,
    };

    console.log('dani hidayat,', variables);

    const result = await fetchGroupMemberList(variables);
    console.log(result, 'result req');
    if (result.status) {
      const data = result.data;

      let newArr = [];

      if (data) {
        newArr = itemData.data.concat(data);
      }

      setMemberDataReq(data);
    }
  }
  const fetchGroupList = () => {
    const variables = {

      page: itemData.page + 1,
      limit: itemPerPage,
      id: params.id
    };
    console.log('var', variables);

    Client.query({
      query: queryproductGroupList,
      variables,
    })
      .then(res => {
        console.log(res, 'res2');

        const data = res.data.productGroupList;

        let newArr = [];

        if (data) {
          newArr = itemData.data.concat(data); // compareData(itemData.data.concat(data));
        }

        console.log(data.length, 'dapet length');

        setItemData({
          ...itemData,
          data: newArr,
          loading: false,
          page: data.length > 0 ? itemData.page + 1 : -1,
          loadNext: false,
        });
      })
      .catch(err => {
        console.log(err, 'error');

        setItemData({
          ...itemData,
          loading: false,
          page: -1,
          loadNext: false,
        });
      });
  };

  return (
    <Scaffold
      showHeader={false}
      useSafeArea={false}
      floatingActionButton={
        <View
          style={{
            width: width / 6,
            aspectRatio: 1,
          }}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: Color.primary,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              ...shadowStyle,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForumBuatScreen', {
                  groupId: params.id
                });
              }}
              style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}
              activeOpacity={0.75}
            >
              <Image style={{ height: '50%', width: '50%' }}
                source={iconPencil}
              />
            </TouchableOpacity>
          </View>
        </View>
      }
    >
      <WidgetForumGroup
        item={params}
        isHighlight
      />

      <Navigator
        initialRouteName="TabNewPost"
        tabBarOptions={{
          activeTintColor: Color.text,
          inactiveColor: Color.border,
          labelStyle: { fontSize: 14, fontWeight: 'bold' },
          style: {
            backgroundColor: Color.textInput,
          },
          labelStyle: { textTransform: 'none' },
          indicatorStyle: { backgroundColor: Color.primary },
        }}
      >
        <Screen
          name="TabNewPost"
          component={TabForumNewPost}
          options={{ tabBarLabel: 'Thread' }}
          initialParams={{ groupId: params.id }}
        />
        <Screen
          name="TabMyPost"
          component={TabForumMyPost}
          options={{ tabBarLabel: 'Postinganku' }}
          initialParams={{ groupId: params.id }}
        />
      </Navigator>
    </Scaffold>
  );
}

export default ForumGroupScreen;
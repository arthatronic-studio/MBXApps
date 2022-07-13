import React, { useState, useEffect, useRef } from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

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
import { useNavigation } from '@react-navigation/native';

const { Navigator, Screen } = createMaterialTopTabNavigator();
const itemPerPage = 100;

const WidgetForumGroup = ({ item, isHighlight }) => {
  const params = item;

  const { Color } = useColor();
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const [memberData, setMemberDataAll] = useState([]);
  const [memberDataReq, setMemberDataReq] = useState([]);

  console.log('params', params);

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
    // fetchMemberAll();
    // fetchMemberReq();
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
          newArr = itemData.data.concat(data);
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

  let extraPropsDescription = { numberOfLines: 1 };
  if (!isHighlight) extraPropsDescription = {};

  return (
    <>
      <View
        style={{
          width: '100%',
          aspectRatio: 16 / 9,
          backgroundColor: Color.border,
        }}
      >
        <Image
          source={{ uri: params.imageCover || 'https://i.postimg.cc/Yq0XG2XF/Rectangle-96.png' }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        <Image
          source={{
            uri: params.image || 'https://i.postimg.cc/mr5FQWfb/unsplash-6-Hqv-Y1-E7-NI.png',
          }}
          style={{
            width: width / 6,
            height: width / 6,
            position: 'absolute',
            bottom: -(width / 12),
            left: 16,
            borderRadius: 50,
          }}
        />
      </View>

      <Divider height={(width / 12) + 16} />

      {/* <Container marginTop={0}>
        <SearchBar
          type='select'
          label='Cari postingan'
          onPress={() => {
            navigation.navigate('ForumSearch');
          }}
        />
      </Container> */}

      <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}>
        <Text size={18} type='bold'>{params.name}</Text>
        {params.status == 'PRIVASI' &&
          <Feather name='lock' size={18} color={Color.danger} />
        }
        <Divider height={4} />
        <Text size={12} color={Color.gray} type='bold'>
          19k Thread
        </Text>
        <Divider />
        <Text size={12} color={Color.gray} type='bold'>
          Deskripsi
        </Text>
        <Divider height={8} />
        <Text align='left' {...extraPropsDescription}>{params.description}</Text>
        <Divider height={8} />
        {isHighlight && <TouchableOpacity
          onPress={() => {
            const varData = {
              ...params,
              member: memberData,
              memberDataReq: memberDataReq,
            };
            navigation.navigate('ForumGroupDetailScreen', { data: varData });
          }}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text color={Color.primary} style={{ marginRight: 5 }}>Selengkapnya</Text>
          <FontAwesome name="angle-down" color={Color.primary} size={18} />
        </TouchableOpacity>}
      </View>
    </>
  );
}

export default WidgetForumGroup;
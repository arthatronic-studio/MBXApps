import React, { useState, useEffect, useRef } from 'react';
import { View, Image, useWindowDimensions, Animated } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';

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
import { Container, Divider } from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import { queryproductGroupList } from 'src/lib/query';
import Client from '@src/lib/apollo';
import { fetchGroupMemberList } from 'src/api/forum/listmemberGroup';
import { shadowStyle } from 'src/styles';
import { useNavigation } from '@react-navigation/native';
import { statusBarHeight } from 'src/utils/constants';

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
    <View>
      {isHighlight ?
        <>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'flex-end',
              height: (width / 6) + statusBarHeight + 16,
              backgroundColor: Color.primary,
            }}
          >
            {/* <Image
              source={{ uri: params.imageCover || 'https://i.postimg.cc/Yq0XG2XF/Rectangle-96.png' }}
              style={{
                width,
                height: '100%',
                position: 'absolute',
                opacity: 0.75
              }}
              blurRadius={1}
            /> */}

            <View
              style={{
                width,
                height: '100%',
                position: 'absolute',
                // backgroundColor: Color.primary,
                opacity: 0.1
              }}
            />

            <View style={{ width, height: width / 6, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 8,
                }}
              >
                <View style={{flex: 1}}>
                  <Fontisto
                    name='angle-left'
                    color={Color.textButtonInline}
                    size={18}
                  />
                </View>

                <View style={{flex: 2}}>
                  <View style={{width: '100%', aspectRatio: 1}}>
                    <Image
                      source={{
                        uri: params.image || 'https://i.postimg.cc/mr5FQWfb/unsplash-6-Hqv-Y1-E7-NI.png',
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 50,
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  const varData = {
                    ...params,
                    member: memberData,
                    memberDataReq: memberDataReq,
                  };
                  navigation.navigate('ForumGroupDetailScreen', { data: varData });
                }}
                style={{
                  flex: 4,
                  flexDirection: 'row',
                }}
              >
                <View style={{ justifyContent: 'center' }}>
                  <Text size={16} type='bold' color={Color.textButtonInline} numberOfLines={1}>
                    {params.name}
                  </Text>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text style={{ marginRight: 8 }} color={Color.textButtonInline}>Detail</Text>
                    <FontAwesome name="angle-right" color={Color.textButtonInline} size={18} />
                  </View>

                  {params.status == "PRIVATE" &&
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: -20,
                      }}
                    >
                      <Feather
                        name='lock'
                        size={16}
                        color={Color.danger}
                      />
                    </View>
                  }
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
        :
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
        </>
      }

      {/* <Container marginTop={0}>
        <SearchBar
          type='select'
          label='Cari postingan'
          onPress={() => {
            navigation.navigate('ForumSearch');
          }}
        />
      </Container> */}

      {!isHighlight && <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}>
        <Text size={18} type='bold' align='left'>
          {params.name} {params.status == "PRIVATE" &&
            <Feather name='lock' size={18} color={Color.danger} />
          }
        </Text>

        {!isHighlight && <>
          <Divider height={4} />
          <Text size={12} color={Color.gray} type='bold'>
            {params.threadCount} Thread
          </Text>

          <Divider />
          <Text size={12} color={Color.gray} type='bold'>
            Deskripsi
          </Text>

          <Divider height={8} />
          <Text align='left' {...extraPropsDescription}>{params.description}</Text>
        </>}

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
      </View>}

      {!isHighlight &&
        <>
          <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}>
          <Text style={{ color: Color.gray, fontSize: 12, fontWeight: 'bold' }}>Moderator</Text>

          <View style={{ flexDirection: 'row', marginVertical: 8 }}>
            <Image
              source={{ uri: params.moderatorInfo.photoProfile ? params.moderatorInfo.photoProfile : 'https://i.postimg.cc/y6RYmPvd/Sample-User-Icon.png' }}
              style={{
                borderRadius: 25,
                width: 35,
                height: 35,
                backgroundColor: Color.border,
                borderColor: Color.primary,
                marginRight: 5,
              }}
            />

            <Text style={{ color: Color.text, marginTop: 5 }} >{params.moderatorInfo.firstName} {params.moderatorInfo.lastName}</Text>
          </View>

          <Text style={{ color: Color.gray, fontWeight: "bold", marginVertical: 5 }}>Topic</Text>
          <Text size={15}>{params.topic.name}</Text>

          <Text style={{ color: Color.gray, fontWeight: "bold", marginVertical: 5 }}>History Forum</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text size={15}>Forum dibuat pada</Text>
            <Text style={{ fontWeight: "bold" }}> {Moment(parseInt(params.createdAt)).format('Do MMMM YYYY')}</Text>
          </View>

          {params.status !== 'PUBLISH' &&<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Text size={15}>{params.member.length} Anggota Forum</Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate('ForumGroupPermintaanScreen', { groupId: params.id })
            }}>
              <Text type='bold' color={Color.primary}>({params.memberDataReq.length} Permintaan) </Text>
            </TouchableOpacity>
          </View>}
        </View>
        </>
      }
    </View>
  );
}

export default WidgetForumGroup;
import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions, Platform } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';

import {
  Text,
  useColor
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import { Divider } from 'src/styled';
import { fetchGroupMemberList } from 'src/api/forum/listmemberGroup';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { statusBarHeight } from 'src/utils/constants';
import { useSelector } from 'react-redux';

const WidgetForumGroup = ({ item, isHighlight }) => {
  const user = useSelector(state => state['user.auth'].login.user);
  const { Color } = useColor();
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [memberData, setMemberDataAll] = useState([]);
  const [memberDataReq, setMemberDataReq] = useState([]);

  const [itemData, setItemData] = useState({
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
  });

  useEffect(() => {
    if (!isHighlight && isFocused) {
      fetchMemberAll();
      fetchMemberReq();
    }
  }, [isFocused]);

  const fetchMemberAll = async () => {
    const variables = {
      groupId: item.id,
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
      groupId: item.id,
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

  let extraPropsDescription = { numberOfLines: 1 };
  if (!isHighlight) extraPropsDescription = {};

  let isMeModerator = false;
  const isPrivateGroup = item.status === 'PRIVATE';

  if (user && item && Array.isArray(item.memberModerator)) {
    const isMeExist = item.memberModerator.filter((e) => e.userId == user.userId)[0];
    if (isMeExist) {
      isMeModerator = true;
    }
  }

  return (
    <View>
      {isHighlight ?
        <>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'flex-end',
              height: (width / 6) + 16 + (Platform.OS === 'android' ? 0 : statusBarHeight),
              backgroundColor: Color.primary,
            }}
          >
            {/* <Image
              source={{ uri: item.imageCover || 'https://i.postimg.cc/Yq0XG2XF/Rectangle-96.png' }}
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
                        uri: item.image || 'https://i.postimg.cc/mr5FQWfb/unsplash-6-Hqv-Y1-E7-NI.png',
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
                  navigation.navigate('ForumGroupDetailScreen', { groupId: item.id });
                }}
                style={{
                  flex: 4,
                  flexDirection: 'row',
                }}
              >
                <View style={{ justifyContent: 'center' }}>
                  <Text size={16} type='bold' color={Color.textButtonInline} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text style={{ marginRight: 8 }} color={Color.textButtonInline}>Detail</Text>
                    <FontAwesome name="angle-right" color={Color.textButtonInline} size={18} />
                  </View>

                  {isPrivateGroup &&
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
              source={{ uri: item.imageCover || 'https://i.postimg.cc/Yq0XG2XF/Rectangle-96.png' }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />

            <Image
              source={{
                uri: item.image || 'https://i.postimg.cc/mr5FQWfb/unsplash-6-Hqv-Y1-E7-NI.png',
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
          {item.name} {isPrivateGroup &&
            <Feather name='lock' size={18} color={Color.danger} />
          }
        </Text>

        {!isHighlight && <>
          <Divider height={4} />
          <Text size={12} color={Color.gray} type='bold'>
            {item.threadCount} Thread
          </Text>

          <Divider />
          <Text size={12} color={Color.gray} type='bold'>
            Deskripsi
          </Text>

          <Divider height={8} />
          <Text align='left' {...extraPropsDescription}>{item.description}</Text>
        </>}

        <Divider height={8} />

        {isHighlight && <TouchableOpacity
          onPress={() => {
            navigation.navigate('ForumGroupDetailScreen', { groupId: item.id });
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

          {item.memberModerator.map((item, idx) => {
            return (
              <View key={idx} style={{ flexDirection: 'row', marginVertical: 8 }}>
                <Image
                  source={{ uri: item.image ? item.image : 'https://i.postimg.cc/y6RYmPvd/Sample-User-Icon.png' }}
                  style={{
                    borderRadius: 25,
                    width: 35,
                    height: 35,
                    backgroundColor: Color.border,
                    borderColor: Color.primary,
                    marginRight: 5,
                  }}
                />

                <Text style={{ color: Color.text, marginTop: 5 }}>{item.fullname}</Text>
              </View>
            )
          })}

          <Text style={{ color: Color.gray, fontWeight: "bold", marginVertical: 5 }}>Topic</Text>
          <Text size={15}>{item.topic.name}</Text>

          <Text style={{ color: Color.gray, fontWeight: "bold", marginVertical: 5 }}>History Forum</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text size={15}>Forum dibuat pada</Text>
            <Text style={{ fontWeight: "bold" }}> {Moment(parseInt(item.createdAt)).format('Do MMMM YYYY')}</Text>
          </View>

          {isPrivateGroup && isMeModerator && <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Text size={15}>{memberData.length} Anggota Forum</Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate('ForumGroupPermintaanScreen', { groupId: item.id })
            }}>
              <Text type='bold' color={Color.primary}>({memberDataReq.length} Permintaan) </Text>
            </TouchableOpacity>
          </View>}
        </View>
        </>
      }
    </View>
  );
}

export default WidgetForumGroup;
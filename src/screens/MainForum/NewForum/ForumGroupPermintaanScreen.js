import React, { useEffect, useState } from 'react';
import { View, Image, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  Header,
  Text,
  Scaffold,
  useColor,
  Alert,
  usePopup
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import Config from 'react-native-config';
import { Container } from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import { fetchGroupMemberList } from 'src/api/forum/listmemberGroup';
import { initialItemState } from 'src/utils/constants';
import { fetchGroupMemberManage } from 'src/api/forum/group-member-manage';

const ForumGroupPermintaanScreen = ({ navigation, route }) => {
  const { params } = route;
  console.log('params', params);

  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();

  const [itemData, setItemData] = useState(initialItemState);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (itemData.refresh) {
      fetchData();
    }
  }, [itemData.refresh]);

  const fetchData = async() => {
    const result = await fetchGroupMemberList({ groupId: params.groupId, status: 0 });
    console.log('result', result);

    let newData = [];
    if (result.status) {
      if (itemData.refresh) {
        newData = result.data;
      } else {
        newData = itemData.data.concat(result.data);
      }
    }

    console.log('newData', newData);

    setItemData({
      ...itemData,
      data: newData,
      loading: false,
      loadNext: false,
      refresh: false,
    });
  }

  const onMemberManage = async(userId, groupId, status) => {
    const result = await fetchGroupMemberManage({
      userId,
      status,
      groupId,
    });

    console.log('result', result);

    if (result.status) {
      setItemData({ ...itemData, refresh: true });
      showPopup(result.data.message, 'success');
    } else {
      showPopup(result.message, 'error');
    }
  }

  const renderItem = ({ item }) => (
    <View
      style={{
        marginBottom: 16,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={{ uri: item.image }}
            style={{
              borderRadius: 25,
              width: 50,
              height: 50,
              backgroundColor: Color.border,
              borderColor: Color.primary,
              marginRight: 8
            }}
          />
          <View style={{ alignItems: 'flex-start' }}>
            <Text type="bold">{item.fullname}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => {
              Alert('Konfirmasi', 'Terima sebagai anggota forum group?', () => onMemberManage(item.userId, item.groupId, 1));
            }}
            style={{ alignItems: 'center', justifyContent: 'center', marginRight: 8 }}
          >
            <View
              style={{
                backgroundColor: Color.primary, borderWidth: 2, borderColor: Color.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 50
              }}
            >
              <Text size={12} style={{ color: Color.textInput }}>Terima</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert('Konfirmasi', 'Hapus permintaan anggota forum group?', () => onMemberManage(item.userId, item.groupId, 2));
            }}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <View
              style={{
                backgroundColor: Color.theme, borderWidth: 2, borderColor: Color.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 50
              }}
            >
              <Text size={12} style={{ color: Color.primary }}>Hapus</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Scaffold
      fallback={itemData.loading}
      popupProps={popupProps}
      header={
        <Header
          title='Permintaan Gabung'
          centerTitle={false}
        />
      }
      empty={!itemData.loading && itemData.data.length === 0}
    >
      <SearchBar
        type='input'
      />

      <FlatList
        keyExtractor={(item, index) => item.id + index.toString()}
        data={itemData.data}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 16,
        }}
      />
    </Scaffold>
  );
}

export default ForumGroupPermintaanScreen;
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
  Header,
  Text,
  Scaffold,
  useColor,
  ScreenEmptyData
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import Config from 'react-native-config';
import { Container } from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import ModalContentOptionsGroupForum from 'src/components/ModalContentOptionsGroupForum';
import { fetchGroupMemberList } from 'src/api/forum/listmemberGroup';
import { initialItemState } from 'src/utils/constants';
import moment from 'moment';

const ForumGroupAllMemberScreen = ({ navigation, route }) => {
  const { params } = route;
  console.log('params', params);

  const modalOptionsRef = useRef();
  const { Color } = useColor();

  const [itemData, setItemData] = useState(initialItemState);
  const [selectedMember, setSelectedMember] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async() => {
    const result = await fetchGroupMemberList({ groupId: params.groupId, status: 1 });
    console.log('result', result);
    if (result.status) {
      setItemData({
        ...itemData,
        data: result.data,
      })
    }
  }

  const renderItem = ({ item }) => (
    <View
      style={{
        marginBottom: 16,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
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
          <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
            <Text type="bold">{item.fullname}</Text>
            <Text size={10}>{moment(item.createdDate).format('DD MMM YYYY')}</Text>
          </View>
        </View>

        <Feather
          onPress={() => {
            setSelectedMember(item);
            modalOptionsRef.current.open();
          }}
          name='more-vertical'
          size={20}
        />
      </View>
    </View>
  );

  return (
    <Scaffold
      header={
        <Header
          title='Anggota'
          centerTitle={false}
        />
      }
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
        ListEmptyComponent={
          itemData.data.length === 0 && <Container>
            <ScreenEmptyData />
          </Container>
        }
      />

      <ModalContentOptionsGroupForum
        ref={modalOptionsRef}
        selectedMember={selectedMember}
        onClose={() => {
          setSelectedMember();
        }}
      />
    </Scaffold>
  );
}

export default ForumGroupAllMemberScreen;
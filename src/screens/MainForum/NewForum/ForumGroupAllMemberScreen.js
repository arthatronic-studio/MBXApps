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
import { Container } from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import ModalContentOptionsGroupForum from 'src/components/ModalContentOptionsGroupForum';
import { fetchGroupMemberList } from 'src/api/forum/listmemberGroup';
import { initialItemState } from 'src/utils/constants';
import moment from 'moment';
import { useSelector } from 'react-redux';
import CardGroupMember from './CardGroupMember';

const ForumGroupAllMemberScreen = ({ navigation, route }) => {
  const { params } = route;

  console.log('params mmmita', params);

  const modalOptionsRef = useRef();
  const { Color } = useColor();
  const user = useSelector(state => state['user.auth'].login.user);

  const [itemData, setItemData] = useState(initialItemState);
  const [selectedMember, setSelectedMember] = useState();
  const [isMeModerator, setIsMeModerator] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async() => {
    const result = await fetchGroupMemberList({ groupId: params.groupId, status: 1 });
    console.log('result', result);
    let newData = [];
    if (result.status) {
      const isMeExist = result.data.filter((e) => e.type === 'MODERATOR' && e.userId == user.userId)[0];
      setIsMeModerator(typeof isMeExist !== 'undefined');

      if (itemData.refresh) {
        newData = result.data;
      } else {
        newData = itemData.data.concat(result.data);
      }
    }

    setItemData({
      ...itemData,
      data: newData,
      loading: false,
      loadNext: false,
      refresh: false,
    });
  }

  return (
    <Scaffold
      fallback={itemData.loading}
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
        renderItem={({ item }) =>
          <CardGroupMember
            item={item}
            isMeModerator={isMeModerator}
            onPressOptions={() => {
              setSelectedMember(item);
              modalOptionsRef.current.open();
            }}
          />
        }
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
        callback={(result) => {
          if (result && result.status) {
            fetchData();
          }
        }}
        onClose={() => {
          setSelectedMember();
        }}
      />
    </Scaffold>
  );
}

export default ForumGroupAllMemberScreen;
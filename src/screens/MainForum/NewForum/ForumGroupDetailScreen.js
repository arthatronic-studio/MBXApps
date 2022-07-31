import React, { useState, useEffect, useRef } from 'react';
import { View, Image, FlatList, Animated } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ModalContentOptionsGroupForum from 'src/components/ModalContentOptionsGroupForum';
import {
  Header,
  Text,
  Scaffold,
  useColor
} from '@src/components';
import { Button } from '@src/components/Button';
import { Container } from 'src/styled';
import Moment from 'moment';
import WidgetForumGroup from './WidgetForumGroup';
import { statusBarHeight } from 'src/utils/constants';
import { useSelector } from 'react-redux';
import { fetchGroupMemberList } from 'src/api/forum/listmemberGroup';
import CardGroupMember from './CardGroupMember';

const ForumGroupDetailScreen = ({ navigation, route }) => {
  const params = route.params.data;

  console.log('route', route);

  const [memberData, setMemberDataAll] = useState([]);
  const [memberDataReq, setMemberDataReq] = useState([]);
  const [selectedMember, setSelectedMember] = useState();

  const { Color } = useColor();
  const modalOptionsRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);

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
      setMemberDataAll(result.data);
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
      setMemberDataReq(result.data);
    }
  }

  let isMeModerator = false;
  if (user && params && Array.isArray(params.memberModerator)) {
    const isMeExist = params.memberModerator.filter((e) => e.userId == user.userId)[0];
    if (isMeExist) {
      isMeModerator = true;
    }
  }

  console.log('memberData', memberData);

  return (
    <Scaffold
      showHeader={false}
      useSafeArea={false}
    >
      <FlatList
        keyExtractor={(item, index) => item.id}
        data={memberData}
        renderItem={({ item }) =>
          params.status !== 'PUBLISH' ?
            <Container paddingHorizontal={16}>
              <CardGroupMember
                item={item}
                isMeModerator={isMeModerator}
                onPressOptions={() => {
                  setSelectedMember(item);
                  modalOptionsRef.current.open();
                }}
              />
            </Container>
          :
            <View />
        }
        ListHeaderComponent={
          <Container paddingBottom={16}>
            <WidgetForumGroup
              item={params}
              isHighlight={false}
            />
          </Container>
        }
        contentContainerStyle={{
          paddingBottom: statusBarHeight,
        }}
      />

      {params.status !== 'PUBLISH' && <Container paddingHorizontal={16} paddingTop={16} paddingBottom={statusBarHeight}>
        <Button
          onPress={() => {
            navigation.navigate('ForumGroupAllMemberScreen', { groupId: params.id });
          }}
        >
          Lihat Semua Anggota
        </Button>
      </Container>}

      <View style={{ position: 'absolute', top: statusBarHeight }}>
        <Header transparentMode />
      </View>

      <ModalContentOptionsGroupForum
        ref={modalOptionsRef}
        selectedMember={selectedMember}
        callback={(result) => {
          if (result && result.status) {
            fetchMemberAll();
            fetchMemberReq();
          }
        }}
        onClose={() => {
          setSelectedMember();
        }}
      />
    </Scaffold>
  );
}

export default ForumGroupDetailScreen;
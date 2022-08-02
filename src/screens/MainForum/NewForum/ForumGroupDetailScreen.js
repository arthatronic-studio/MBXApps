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
import { queryproductGroupList } from 'src/lib/query';
import client from 'src/lib/apollo';

const ForumGroupDetailScreen = ({ navigation, route }) => {
  const { params } = route;

  const [memberData, setMemberDataAll] = useState([]);
  const [memberDataReq, setMemberDataReq] = useState([]);
  const [selectedMember, setSelectedMember] = useState();
  const [itemDetail, setItemDetail] = useState();
  const [itemLoading, setItemLoading] = useState(true);
  const [isMeModerator, setIsMeModerator] = useState(false);

  const { Color } = useColor();
  const modalOptionsRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);

  useEffect(() => {
    fetchGroupList();
    fetchMemberAll();
    // fetchMemberReq();
  }, []);

  const fetchMemberAll = async () => {
    const variables = {
      groupId: params.groupId,
      status: 1,
    };

    console.log('variables', variables);

    const result = await fetchGroupMemberList(variables);
    console.log(result, 'result all');
    if (result.status) {
      setMemberDataAll(result.data);

      const isMeExist = result.data.filter((e) => e.userId == user.userId && e.type === 'MODERATOR')[0];
      if (isMeExist) {
        setIsMeModerator(true);
      }
    }
  }

  const fetchMemberReq = async () => {
    const variables = {
      groupId: params.groupId,
      status: 0,
    };

    console.log('dani hidayat,', variables);

    const result = await fetchGroupMemberList(variables);
    console.log(result, 'result req');
    if (result.status) {
      setMemberDataReq(result.data);
    }
  }

  const fetchGroupList = () => {
    const variables = {
      page: 1,
      limit: 1,
      id: params.groupId,
    };
    
    console.log('var', variables);

    client.query({
      query: queryproductGroupList,
      variables,
    })
      .then(res => {
        console.log(res, 'res2');

        const data = res.data.productGroupList;

        let newItemDetail;

        if (Array.isArray(data) && data.length > 0) {
          newItemDetail = data[0];
        }

        setItemDetail(newItemDetail);
        setItemLoading(false);
      })
      .catch(err => {
        console.log(err, 'error');

        setItemLoading(false);
      });
  };

  return (
    <Scaffold
      showHeader={false}
      useSafeArea={false}
      fallback={itemLoading}
    >
      <FlatList
        keyExtractor={(item, index) => item.id}
        data={memberData}
        renderItem={({ item }) =>
          itemDetail && itemDetail.status !== 'PUBLISH' ?
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
          itemDetail && <Container paddingBottom={16}>
            <WidgetForumGroup
              item={itemDetail}
              isHighlight={false}
            />
          </Container>
        }
        contentContainerStyle={{
          paddingBottom: statusBarHeight,
        }}
      />

      {itemDetail && itemDetail.status !== 'PUBLISH' && <Container paddingHorizontal={16} paddingTop={16} paddingBottom={statusBarHeight}>
        <Button
          onPress={() => {
            navigation.navigate('ForumGroupAllMemberScreen', { groupId: params.groupId });
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
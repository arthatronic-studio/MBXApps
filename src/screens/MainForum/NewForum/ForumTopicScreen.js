import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, FlatList, Row, SectionList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import { ModalUnlock } from 'src/components';
import { useLoading, usePopup, useColor, Header } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Container, Divider } from '@src/styled';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { iconWarning, iconHeart, iconShare, iconBookmarks } from '@assets/images/home';
import { useSelector } from 'react-redux';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { queryproductTopicList } from 'src/lib/query';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { fetchTopicList } from 'src/api/forum/topiclist';
import { checkJoinMember } from 'src/api/forum/checkMemberjoinGroup';

const ForumTopicScreen = ({ navigation, route }) => {
  const { item } = route.params;
  const modalOptionsRef = useRef();
  const modalUnlockRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);
  const [showSection, setShowSection] = useState(true);




  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();
  const [search, setSearch] = useState('');
  const { Color } = useColor();
  const [filterData, setFilterData] = useState([]);
  // useEffect(() => {
  //     const timeout = trigger ? setTimeout(() => {
  //         fetchAddLike();
  //     }, 500) : null;

  //     return () => {
  //         clearTimeout(timeout);
  //     }
  // }, [trigger]);



  const itemPerPage = 100;

  const [itemData, setItemData] = useState({
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
  });

  console.log('itemdata', itemData.data);
  const [joinMember, setJoinMember] = useState();
  useEffect(() => {
    fetchTopic();
  }, []);

  const ChekJoin = async (varData) => {
    const variables = {
      groupId: varData.id
    };
    console.log('varibels id', variables);

    const result = await checkJoinMember(variables);
    console.log(result, 'result join');

    if (result.status) {
      navigation.navigate('ForumGroupScreen', { data: varData });
    } else {
      modalUnlockRef.current.open();
    }
  }

  const fetchTopic = async () => {
    const variables = {
      page: itemData.page + 1,
      limit: itemPerPage,
    };

    const result = await fetchTopicList(variables);
    console.log(result, 'result');

    let data = [];
    if (result.status) {
      data = result.data;
    }

    let newArr = itemData.data.concat(data);
    setItemData({
      ...itemData,
      data: newArr,
      loading: false,
      page: data.length > 0 ? itemData.page + 1 : -1,
      loadNext: false,
    });
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {


    }}>
      <View style={{ flexDirection: 'row', backgroundColor: Color.grayLight, marginHorizontal: 16, marginVertical: 8, padding: 10, borderRadius: 10, justifyContent: 'space-between' }}>

        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: item.image }}
            style={{
              borderRadius: 25,
              width: 50,
              height: 50,
              backgroundColor: Color.border,
              borderColor: Color.primary,
              marginHorizontal: 5
            }}
          />
          <View style={{ marginTop: 5, justifyContent: 'flex-start' }}>
            <Text type="bold">{item.title}</Text>
            <Text style={{ textAlign: 'left' }}>{item.sub}</Text>
          </View>
        </View>


        <Feather onPress={() => {
          modalUnlockRef.current.open();
        }} name='lock' size={20} color={Color.danger} />

      </View>
    </TouchableOpacity>
  );

  console.log('itemData', itemData);

  return (
    <Scaffold
      fallback={itemData.loading}
      empty={false}
      popupProps={popupProps}
      header={<Header title="Forum untuk kamu" centerTitle={false} />}
      loadingProps={loadingProps}>
      {/* <FlatList
        data={search !== '' ? filterData : itemData.data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      /> */}
      <SectionList
        sections={itemData.data}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              {
                ChekJoin(item);
                // item.status == 'PRIVASI'
                //   ? modalUnlockRef.current.open()
                //   : 
                //   ChekJoin(item.id);
                //   navigation.navigate('ForumGroupScreen', {data: varData});
              }
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: Color.semiwhite,
                marginHorizontal: 16,
                marginVertical: 4,
                padding: 8,
                borderRadius: 8,
                justifyContent: 'space-between',
              }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1.5 }}>
                  <View style={{ width: '100%', aspectRatio: 1 }}>
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        borderRadius: 50,
                        width: '100%',
                        height: '100%',
                        backgroundColor: Color.secondary,
                      }}
                    />
                  </View>
                </View>

                <View style={{ flex: 8, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Text numberOfLines={1} type="semibold">{item.name}</Text>
                  <Divider height={2} />
                  <Text numberOfLines={1} size={12}>{item.description}</Text>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                  {item.status === 'PRIVASI' &&
                    <Feather
                      name="lock"
                      size={16}
                      color={Color.danger}
                    />
                  }
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { name, imageIcon } }) => (
          <View style={{ flexDirection: 'row', marginHorizontal: 16, paddingVertical: 8, backgroundColor: Color.theme }}>
            <Image
              source={{ uri: imageIcon }}
              style={{
                borderRadius: 25,
                width: 22,
                height: 22,
                backgroundColor: Color.border,
                borderColor: Color.primary,
                marginHorizontal: 5,
              }}
            />
            <Text style={{ textAlign: 'left', fontSize: 17, fontWeight: 'bold' }}>
              {name}
            </Text>
          </View>
        )}
      />

      <Divider />
      <ModalContentOptions
        ref={modalOptionsRef}
        // isOwner={user && user.userId === item.ownerId}
        item={item}
      />
      <ModalUnlock
        onClose={() => setShowSection(!showSection)}
        ref={modalUnlockRef}
        data={[
          // hide options chat
          {
            id: 0,
            name: 'Minta Bergabung',
            color: Color.text,
            onPress: () => {
              navigation.navigate('ForumGroupScreen', {});
              showLoading(
                'wait',
                'Permintaan kamu sedang di tinjau oleh moderator',
              );
              setShowSection(!showSection);
            },
          },
        ]}
      />
    </Scaffold>
  );
};

export default ForumTopicScreen;
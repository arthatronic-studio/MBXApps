import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, FlatList, Row, SectionList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import { ModalUnlock, ScreenEmptyData } from 'src/components';
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
import ImagesPath from 'src/components/ImagesPath';

const initialCurrentData = {
  item: null,
  index: -1,
  section: null,
};

const itemPerPage = 100;

const ForumTopicScreen = ({ navigation, route }) => {
  const modalUnlockRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);
  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();

  const [showSection, setShowSection] = useState(true);
  const [currentData, setCurrentData] = useState(initialCurrentData);
  const [itemData, setItemData] = useState({
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
  });

  useEffect(() => {
    fetchTopic();
  }, []);

  const onCheckJoin = async (item, index, section) => {
    if (item.status !== "PRIVATE") {
      navigation.navigate('ForumGroupScreen', { groupId: item.id });
      return;
    }

    const variables = {
      groupId: item.id
    };

    console.log(variables, 'variables');

    const result = await checkJoinMember(variables);
    console.log(result, 'result checkJoinMember');

    if (result.status) {
      if (result.data.success) {
        if (result.data.status === 1) {
          navigation.navigate('ForumGroupScreen', { groupId: item.id });
        } else if (result.data.status === 2) {
          modalUnlockRef.current.open();
        } else {
          showPopup(result.data.message, 'info');
        }
      } else {
        modalUnlockRef.current.open();
      }

      onChangeItem('statusMe', result.data.status);
    } else {
      modalUnlockRef.current.open();
    }
  }

  const onChangeItem = (key, value) => {
    if (currentData.item && currentData.index !== -1 && currentData.section) {
      let newData = [...itemData.data];
      const idxOfSection = itemData.data.indexOf(currentData.section);
      if (idxOfSection !== -1) {
        newData[idxOfSection]['data'][currentData.index][key] = value;
        setItemData({
          ...itemData,
          data: newData,
        });
      }
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

  return (
    <Scaffold
      fallback={itemData.loading}
      empty={false}
      popupProps={popupProps}
      header={<Header title="Forum untuk kamu" centerTitle={false} />}
      loadingProps={loadingProps}
    >
      <SectionList
        sections={itemData.data}
        keyExtractor={(item, index) => item + index}
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
        renderItem={({ item, index, section }) => {
          const isWaitingApproval = item.statusMe === 0;
          const isRejected = item.statusMe === 2;
          const isPrivateGroup = item.status === 'PRIVATE';

          return (
            <TouchableOpacity
              onPress={() => {
                setCurrentData({
                  item,
                  index,
                  section,
                });

                if (isWaitingApproval) {
                  showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
                  return;
                }

                if (isRejected) {
                  modalUnlockRef.current.open();
                  return;
                }

                onCheckJoin(item, index, section);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: Color.border,
                  marginHorizontal: 16,
                  marginBottom: 10,
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
                    <Text numberOfLines={1} size={12}>{item.threadCount} Thread</Text>
                  </View>

                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                    {
                      isWaitingApproval ?
                        <MaterialIcons
                          name="history"
                          size={18}
                          color={Color.info}
                        />
                        : isPrivateGroup &&
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
          )
        }}
        renderSectionFooter={({ section }) => {
          if (section.data.length == 0) {
            return (
              <View style={{ padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={ImagesPath.productempty}
                  style={{
                    height: 45,
                    width: 45,
                    marginBottom: 8,
                  }}
                />
                <Text>Group Tidak Tersedia</Text>
              </View>
            )
          }

          return null
        }}
      />

      <ModalUnlock
        onClose={() => {
          setShowSection(!showSection);
        }}
        ref={modalUnlockRef}
        productId={currentData.item ? currentData.item.id : null}
        data={[
          {
            id: 0,
            name: 'Minta Bergabung',
            color: Color.text,
            onPress: (result) => {
              if (result.status && result.data.success) {
                onChangeItem('statusMe', 0);
                showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
              } else {
                showPopup('Gabung Group gagal, seilakan coba kembali', 'error');
              }
              
              modalUnlockRef.current.close();
              setShowSection(!showSection);
              setCurrentData(initialCurrentData);
            },
          },
        ]}
      />
    </Scaffold>
  );
};

export default ForumTopicScreen;
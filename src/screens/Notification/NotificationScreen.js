import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  Animated,
  Image,
  useWindowDimensions,
} from 'react-native';
import Moment from 'moment';

import {
  Scaffold,
  TouchableOpacity,
  Text,
  useColor,
  AlertModal,
} from 'src/components';
import {Container, Divider} from 'src/styled';
import client from 'src/lib/apollo';
import {
  queryGetNotification,
  queryNotificationManage,
  queryNotificationManageAll,
} from 'src/lib/query';
import Feather from 'react-native-vector-icons/Feather';
import {useIsFocused} from '@react-navigation/native';
import {ModalListAction} from 'src/components';
import imageAssets from 'assets/images';
import {getAPI} from 'src/api-rest/httpService';
const NotificationScreen = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const initialDataRooms = {
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
    refresh: false,
  };
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const modalListActionRef = useRef();
  const [showSection, setShowSection] = useState(true);
  const [modalBackConfirm, setModalBackConfirm] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const {width} = useWindowDimensions();

  const fetchData = async () => {
    const result = await getAPI('notification?type=general');
    console.log('result notif', result);
    if (result.status && Array.isArray(result.data)) {
      setHistory(result.data);
    }
    setLoading(false);
  };

  // console.log('hisrtory', history);

  useEffect(() => {
    // if (refreshing) {
    //   setRefreshing(false);
    fetchData();

    // const variables = {
    //   page: 0,
    //   itemPerPage: 10
    // }

    // client.query({
    //   query: queryGetNotification,
    //   variables,
    // })
    //   .then((res) => {
    //     const data = res.data.getNotification;
    //     console.log('ini scc', data);
    //     let newArr = [];

    //     if (data) {
    //       newArr = data;
    //     }

    //     setHistory(newArr);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log('ini err', err);
    //     setLoading(false);
    //   })
    // }
  }, []);

  const readNotfif = id => {
    console.log('ini id', id);

    const variables = {
      notificationId: id,
      status: 3,
    };
    console.log('ini id', variables);
    // return;

    client
      .mutate({
        mutation: queryNotificationManage,
        variables,
      })
      .then(res => {
        console.log('res ecomm ulasan', res);

        setRefreshing(true);
      })
      .catch(err => {
        console.log('err ecomm ulasan', err);
      });
  };
  const ManageNotfifAll = status => {
    const variables = {
      status: status,
    };
    console.log('ini id', variables);
    // return;

    client
      .mutate({
        mutation: queryNotificationManageAll,
        variables,
      })
      .then(res => {
        console.log('res Baca semua', res);

        setRefreshing(true);
      })
      .catch(err => {
        console.log('res Baca semua', err);
      });
  };

  const renderPopUpNavigation = () => {
    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 20,
            height: 36,
            width: '100%',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
          },
        ]}>
        <View
          style={{
            width: '100%',
            height: 36,
            backgroundColor: Color.primary,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#00000029',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('NotificationAll');
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
            activeOpacity={0.75}>
            <Text color={Color.textInput}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const onSelectNotif = item => {
    readNotfif(item.id);
    navigation.navigate('NotificationDetail', {item});
  };

  return (
    <Scaffold
      // headerTitle='Notifikasi'
      // fallback={loading}
      // empty={history.length === 0}
      // iconRightButton={modalListActionRef.current && <Feather name='more-vertical' size={20} color={Color.text} />}
      // onPressRightButton={() => {
      // if (modalListActionRef.current) modalListActionRef.current.open();
      // }
      // }
      // emptyTitle="Notifikasi belum tersedia"
      showHeader={false}
      fallback={loading}
      empty={!loading && history.length === 0}>
      <FlatList
        keyExtractor={(item, index) => item.id + index.toString()}
        data={history}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
        renderItem={({item}) => {
          // const isNotReaded = item.status !== 3;
          const isNotReaded = false;
          const validImage = typeof item.images === 'string' && (item.images.includes('.jpg') || item.images.includes('.jpeg') || item.images.includes('.png'));

          return (
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 16,
                borderColor: Color.border,
                backgroundColor: isNotReaded ? '#FFFCEB' : Color.white,
                marginTop: 16,
              }}>
              <Container width={width * 0.214} height={width * 0.214} color={validImage ? 'transparent' : Color.text} padding={validImage ? 0 : 8}>
                <Image
                  source={{uri: validImage ? item.images : 'https://www.citypng.com/public/uploads/preview/transparent-billing-invoice-white-icon-21635327771x1jcbbwfpa.png' }}
                  style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                />
              </Container>
              <Divider width={12} />
              <Container flex={1} flexDirection="column">
                <Text
                  size={14}
                  lineHeight={16.8}
                  type="medium"
                  color={Color.primary}
                  align="left">
                  {item.title}
                </Text>
                <Divider height={3} />
                <Text
                  size={11}
                  lineHeight={15}
                  color="#797979"
                  align="left"
                  numberOfLines={2}>
                  {item.description}
                </Text>
                <Divider height={2} />
                {/* <Text size={10} lineHeight={12} color="#797979" align="left">
                  2 Hours Ago
                </Text> */}
              </Container>
            </TouchableOpacity>
          );
        }}
      />

      {/* {history.length > 0 && renderPopUpNavigation()} */}
      <ModalListAction
        onClose={() => setShowSection(!showSection)}
        ref={modalListActionRef}
        data={[
          // hide options chat
          // {
          //   id: 0,
          //   name: 'Cari',
          //   color: Color.text,
          //   onPress: () => {
          //     setShowSection(!showSection);
          //     modalListActionRef.current.close();
          //   },
          // },
          {
            id: 1,
            name: 'Baca Semua',
            onPress: () => {
              ManageNotfifAll('READ');
              setShowSection(!showSection);
              modalListActionRef.current.close();
            },
          },

          {
            id: 5,
            name: 'Hapus Semua',
            color: Color.error,
            onPress: () => {
              setModalBackConfirm(true);
              setShowSection(!showSection);
              modalListActionRef.current.close();
            },
          },
        ]}
      />
      <AlertModal
        visible={modalBackConfirm}
        showDiscardButton
        title="Konfirmasi"
        message="Anda ingin menghapus semua notifikasi?"
        onSubmit={() => {
          setModalBackConfirm(false);
          ManageNotfifAll('DELETE');
        }}
        onDiscard={() => {
          setModalBackConfirm(false);
        }}
        onClose={() => {
          setModalBackConfirm(false);
        }}
      />
    </Scaffold>
  );
};

export default NotificationScreen;

import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, Animated, Image } from 'react-native';
import Moment from 'moment';

import { Scaffold, TouchableOpacity, Text, useColor, AlertModal } from "src/components";
import { Container, Divider } from "src/styled";
import client from "src/lib/apollo";
import { queryGetNotification, queryNotificationManage, queryNotificationManageAll } from "src/lib/query";
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import { ModalListAction } from 'src/components';
import imageAssets from "assets/images";
const NotificationScreen = ({ navigation, route }) => {
  const { Color } = useColor();
  const isFocused = useIsFocused();
  const initialDataRooms = {
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
    refresh: false,
  };
  const [history, setHistory] = useState([{id: 1}]);
  const [loading, setLoading] = useState(false);
  const modalListActionRef = useRef();
  const [showSection, setShowSection] = useState(true);
  const [modalBackConfirm, setModalBackConfirm] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    if (refreshing) {
      setRefreshing(false);

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
    }
  }, [refreshing]);

  const readNotfif = (id) => {

    console.log('ini id', id);

    const variables = {
      notificationId: id,
      status: 3,

    };
    console.log('ini id', variables);
    // return;

    client.mutate({
      mutation: queryNotificationManage,
      variables,
    })
      .then((res) => {
        console.log('res ecomm ulasan', res);

        setRefreshing(true);
      })
      .catch((err) => {
        console.log('err ecomm ulasan', err);

      });

  }
  const ManageNotfifAll = (status) => {
    const variables = {
      status: status,
    };
    console.log('ini id', variables);
    // return;

    client.mutate({
      mutation: queryNotificationManageAll,
      variables,
    })
      .then((res) => {
        console.log('res Baca semua', res);

        setRefreshing(true);
      })
      .catch((err) => {
        console.log('res Baca semua', err);

      });

  }

  const renderPopUpNavigation = () => {
    return (
      <Animated.View
        style={[
          { position: 'absolute', bottom: 20, height: 36, width: '100%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
        ]}
      >
        <View style={{
          width: '100%', height: 36, backgroundColor: Color.primary, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
          shadowColor: "#00000029",
          shadowOffset: { width: 0, height: 2, },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        >
          <TouchableOpacity
            onPress={() => { navigation.navigate('NotificationAll') }}
            style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}
            activeOpacity={0.75}
          >
            <Text color={Color.textInput}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }

  const onSelectNotif = (item) => {
    readNotfif(item.id);
    navigation.navigate('NotificationDetail', { item });
  }

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
    >
      <FlatList
        keyExtractor={(item, index) => item.id + index.toString()}
        data={history}
        contentContainerStyle={{
          paddingBottom: 16
        }}
        renderItem={({ item }) => {
          const isNotReaded = item.status !== 3;
          return (
            <TouchableOpacity 
              style={{
                flexDirection: 'row', 
                padding: 16, 
                borderColor: Color.border,
                backgroundColor: isNotReaded ? '#FFFCEB' : Color.white,
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
              <Container flex={1} flexDirection="row" align="center">
                <Container
                  padding={14}
                  backgroundColor="#FFFCEB"
                  borderRadius={24}
                >
                  <Image source={imageAssets.inbox} />
                </Container>
                <Divider width={10}/>
                <Container>
                  <Text color={Color.black} align="left" size={14} lineHeight={18}>
                    Kamu telah masuk ke area
                  </Text>
                  <Text color={Color.black} align="left" size={14} lineHeight={18} type="medium">
                    M Bloc Space
                  </Text>
                </Container>
              </Container>
              {/* <Text size={10} lineHeight={12} color={"#ACAAA5"}>
                  2 menit lalu
              </Text> */}
            </TouchableOpacity>
          )
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
        title='Konfirmasi'
        message='Anda ingin menghapus semua notifikasi?'
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
}

export default NotificationScreen;
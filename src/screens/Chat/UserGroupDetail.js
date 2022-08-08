import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, FlatList, Pressable, useWindowDimensions, AppState } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import ImagesPath from 'src/components/ImagesPath';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Scaffold from '@src/components/Scaffold';
import { Alert, Header, AlertModal } from 'src/components';
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import { ModalListAction } from 'src/components';
import {
  Row,
  Col,
} from '@src/components';
import ModalActions from 'src/components/Modal/ModalActions';
import { fetchContentChatRoomManage } from 'src/api/chat/chat';
import { Container } from 'src/styled';


function Anggota(props) {
  const params = props;
  const { is_admin_room, is_owner_room } = params;

  const { Color } = useColor();

  const [modalActions, setModalActions] = useState(false);
  const [selectedMember, setSelectedMember] = useState();

  const onRemove = async () => {
    let userIds = [parseInt(selectedMember.user_id)];

    const variables = {
      method: 'UPDATE',
      roomId: parseInt(params.roomId),
      userId: userIds,
      userManage: 'DELETE',
    };

    console.log('variables', variables);

    const result = await fetchContentChatRoomManage(variables);
    console.log('result', result);
    if (result.status) {
      props.navigation.navigate('Chat');
    }
  }

  const renderItem = ({ item }) => (
    <View style={{ backgroundColor: Color.theme }}>
      <Row
        style={{
          marginHorizontal: 0,
          marginVertical: 12,
          alignItems: 'center',
        }}>
        <View style={{ width: '10%', aspectRatio: 1 }}>
          <Image source={{ uri: item.photo_profile }} style={{ width: '100%', height: '100%', borderRadius: 20 }} />
        </View>
        <View style={{ width: '85%' }}>
          <Text
            style={{
              textAlign: 'left',
              fontSize: 14,
              fontWeight: 'bold',
              marginHorizontal: 8,
            }}>
            {item.first_name}
          </Text>
          <Text
            style={{
              fontSize: 8,
              color: Color.error,
              textAlign: 'left',
              marginHorizontal: 10,
            }}>
            {item.status}
          </Text>
        </View>
        {(is_admin_room || is_owner_room) &&
          <TouchableOpacity
            onPress={() => {
              setModalActions(true);
              setSelectedMember(item);
            }}>
            <Entypo name={'dots-three-horizontal'} size={16} color={Color.text} />
          </TouchableOpacity>
        }
      </Row>
    </View>
  );

  return (
    <Scaffold
      showHeader={false}
    >
      <View
        style={{
          backgroundColor: Color.theme,
          padding: 16,
          alignItems: 'flex-start',
        }}>
        <FlatList
          data={props.selected}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <ModalActions
        visible={modalActions}
        onClose={() => {
          setModalActions(false);
          setSelectedMember();
        }}
        data={[
          {
            id: 0,
            name: 'Keluarkan Dari Grup',
            color: Color.error,
            onPress: () => {
              setModalActions(false);
              Alert('Konfirmasi', 'Anda akan mengeluarkan anggota ini?', () => onRemove())
            },
          },
          // {
          //   id: 1,
          //   name: 'Jadikan Admin',
          //   onPress: () => {
          //     setModalActions(false);
          //   },
          // },
          // {
          //   id: 2,
          //   name: 'Report',
          //   onPress: () => {
          //     setModalActions(false);
          //   },
          // },
        ]}
      />
    </Scaffold>
  );
}

function Media(props) {
  const { Color } = useColor();
  const render = ({ item }) => (
    <View>
      <Text style={{ fontSize: 10, fontWeight: 'bold', color: Color.text, textAlign: 'left', marginVertical: 10 }}>{item.waktu}</Text>
      <Row>
        <Image source={item.gallery[0]} style={{ width: 60, height: 60, borderRadius: 5, marginRight: 8 }} />
        <Image source={item.gallery[1]} style={{ width: 60, height: 60, borderRadius: 5 }} />
      </Row>
    </View>
  );

  return (
    <Scaffold
      showHeader={false}
      style={{
        backgroundColor: Color.theme,
        padding: 16,
        alignItems: 'flex-start',
      }}
    >
      <FlatList
        data={[
          {
            waktu: 'Minggu ini',
            gallery: [ImagesPath.productImage, ImagesPath.produklelang]
          },
          {
            waktu: 'Minggu ini',
            gallery: [ImagesPath.productImage, ImagesPath.produklelang]
          },
          {
            waktu: 'Minggu ini',
            gallery: [ImagesPath.productImage, ImagesPath.produklelang]
          }
        ]}
        renderItem={render}
        keyExtractor={item => item.id}
      />
    </Scaffold>
  );
}

function Dokumen(props) {
  const { Color } = useColor();
  const tampil = ({ item }) => (
    <View>
      <Text style={{ fontSize: 10, fontWeight: 'bold', color: Color.text, textAlign: 'left', marginVertical: 10 }}>{item.waktu}</Text>
      <Image source={item.file} />
    </View>

  );

  return (
    <Scaffold
      showHeader={false}
      style={{
        backgroundColor: Color.theme,
        padding: 16,
        alignItems: 'flex-start',
      }}
    >
      <FlatList
        data={[
          {
            waktu: 'Minggu ini',
            file: ImagesPath.filedoc
          },
          {
            waktu: 'Bulan lalu',
            file: ImagesPath.filedoc
          },
          {
            waktu: 'Minggu ini',
            file: ImagesPath.filedoc
          },
        ]}
        renderItem={tampil}
        keyExtractor={item => item.id}
      />
    </Scaffold>
  );
}

const UserGroupDetail = ({ navigation, route }) => {
  const { params } = route;
  const { is_admin_room, is_owner_room } = route.params;
  const [modalHapus, setModalHapus] = useState(false);
  const [modalKeluar, setModalKeluar] = useState(false);

  const user = useSelector((state) => state['user.auth'].login.user);

  const modalListActionRef = useRef();
  const { Color } = useColor();

  const Tab = createMaterialTopTabNavigator();

  const [isLoading, setIsLoading] = useState(false);

  const onLeave = async () => {
    let userIds = [user.userId];

    const variables = {
      method: 'UPDATE',
      roomId: parseInt(params.roomId),
      userId: userIds,
      userManage: 'DELETE',
    };

    console.log('variables', variables);

    const result = await fetchContentChatRoomManage(variables);
    console.log('result', result);
    if (result.status) {
      navigation.navigate('Chat');
    }
  }

  const GroupDetailHeader = () => {
    return (
      <Container paddingVertical={16}>
        <Row>
          <Image
            source={{ uri: params.imageGroup }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              marginHorizontal: 10,
            }}
          />
          <Col>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left' }}>
              {params.nameGroup}
            </Text>
            <Text
              style={{
                fontSize: 8,
                color: Color.text,
                textAlign: 'left',
                marginVertical: 1,
              }}>
              {params.selected.length} Anggota
            </Text>
          </Col>

          {(is_admin_room || is_owner_room) &&
            <View style={{ width: '8%', marginVertical: 5 }}>
              <Pressable onPress={() => {
                navigation.navigate('ManageGroupScreen', {
                  ...params,
                });
              }}>
                <Feather name={'edit-2'} color={Color.text} size={16} />
              </Pressable>
            </View>
          }
        </Row>

        {(is_admin_room || is_owner_room) &&
          <Pressable
            onPress={() => {
              navigation.navigate('AddMember', {
                ...params,
              });
            }}
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              marginTop: 16,
            }}>
            <Ionicons
              name={'person-add-outline'}
              size={16}
              style={{ color: Color.text }}
            />
            <Text
              style={{ fontSize: 12, marginLeft: 8 }}>
              Tambahkan anggota grup
            </Text>
          </Pressable>
        }
      </Container>
    );
  };

  const onDeleteGrup = async () => {
    const variables = {
      method: 'DELETE',
      roomId: parseInt(params.roomId),
    };

    console.log('variables', variables);

    const result = await fetchContentChatRoomManage(variables);
    console.log('result', result);
    if (result.status) {
      navigation.navigate('Chat');
    }
  }

  return (
    <Scaffold
      isLoading={isLoading}
      header={
        <Header
          title="Detail Grup"
          iconRightButton={
            <TouchableOpacity
              onPress={() => {
                modalListActionRef.current.open();
              }}
              style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Entypo name="dots-three-vertical" color={Color.text} size={18} />
            </TouchableOpacity>
          }
        />
      }>

      <GroupDetailHeader />

      <Tab.Navigator
        initialRouteName={'Belanjaan'}
        tabBarOptions={{
          indicatorStyle: {
            backgroundColor: Color.theme,
            height: '100%'
          },
          activeTintColor: Color.text,
          inactiveTintColor: Color.secondary,
          labelStyle: {
            fontSize: 12,
          },
          indicatorStyle: {
            borderBottomColor: Color.primary,
            borderBottomWidth: 2,
          },
          style: {
            backgroundColor: Color.theme,
          }
        }}>
        <Tab.Screen
          name="Anggota"
          children={props => <Anggota {...props} {...params} />}
          options={{ tabBarLabel: 'Anggota' }}
        />
        {/* hide media */}
        {/* <Tab.Screen
          name="Media"
          component={Media}
          options={{tabBarLabel: 'Media'}}
        /> */}
        {/* hide dokumen */}
        {/* <Tab.Screen
          name="Dokumen"
          component={Dokumen}
          options={{tabBarLabel: 'Dokumen'}}
        /> */}
      </Tab.Navigator>

      <ModalListAction
        ref={modalListActionRef}
        data={[
          // hide options chat
          // {
          //   id: 0,
          //   name: 'Matikan pemberitahuan',
          //   onPress: () => {
          //     modalListActionRef.current.close();
          //   },
          // },
          {
            id: 1,
            name: 'Keluar dari grup',
            color: Color.error,
            onPress: () => {
              modalListActionRef.current.close();
              setModalKeluar(!modalKeluar);
            },
          },
          {
            id: 2,
            name: 'hapus grup',
            color: Color.error,
            show: is_admin_room,
            onPress: () => {
              modalListActionRef.current.close();
              setModalHapus(!modalHapus);
            },
          },
          // {
          //   id: 2,
          //   name: 'Report',
          //   onPress: () => {
          //     modalListActionRef.current.close();
          //   },
          // },
        ]}
      />

      <AlertModal
        visible={modalKeluar}
        title='Konfirmasi'
        message='Anda akan keluar dari grup?'
        showDiscardButton
        onSubmit={() => {
          onLeave();
          setModalKeluar(!modalKeluar);
        }}
        onClose={() => {
          setModalKeluar(!modalKeluar);
        }}
        onDiscard={() => {
          setModalKeluar(!modalKeluar);
        }}
      />

      <AlertModal
        visible={modalHapus}
        title='Konfirmasi'
        message='Anda akan menghapus grup?'
        showDiscardButton
        onSubmit={() => {
          onDeleteGrup();
          setModalHapus(!modalHapus);
        }}
        onClose={() => {
          setModalHapus(!modalHapus);
        }}
        onDiscard={() => {
          setModalHapus(!modalHapus);
        }}
      />
    </Scaffold>
  );
};

export default UserGroupDetail
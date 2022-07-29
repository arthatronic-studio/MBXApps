import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView,Image, FlatList,Pressable,useWindowDimensions, AppState } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import ImagesPath from 'src/components/ImagesPath';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Scaffold from '@src/components/Scaffold';
import { Alert, Header } from 'src/components';
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import {ModalListAction } from 'src/components';
import {
	Row,
	Col,
} from '@src/components';
import ModalActions from 'src/components/Modal/ModalActions';
import { fetchContentChatRoomManage } from 'src/api/chat/chat';

function Anggota(props) {
  const params = props;

  const {Color} = useColor();

  const [modalActions, setModalActions] = useState(false);
  const [selectedMember, setSelectedMember] = useState();

  const onRemove = async() => {
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
      setTimeout(() => {
        props.navigation.navigate('Chat');
      }, 2500);
    }
  }

  const renderItem = ({item}) => (
    <View style={{backgroundColor: Color.theme}}>
      <Row
        style={{
          marginHorizontal: 0,
          marginVertical: 12,
          alignItems: 'center',
        }}>
          <View style={{width: '10%', aspectRatio: 1}}>
            <Image source={{ uri: item.photo_profile }} style={{ width: '100%', height: '100%', borderRadius: 20}} />
          </View>
        <View style={{width: '85%'}}>
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
        <TouchableOpacity
          onPress={() => {
            setModalActions(true);
            setSelectedMember(item);
          }}>
          <Entypo name={'dots-three-horizontal'} size={15} />
        </TouchableOpacity>
      </Row>
    </View>
  );

  return (
    <View>
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
    </View>
  );
}


  function Media(props) {
    const {Color} = useColor();
    const render = ({ item }) => (
        <View>
            <Text style={{fontSize: 10, fontWeight: 'bold', color: Color.text, textAlign: 'left', marginVertical: 10}}>{item.waktu}</Text>
            <Row>
                <Image source={item.gallery[0]} style={{width: 60, height: 60, borderRadius: 5, marginRight: 8}}/>
                <Image source={item.gallery[1]} style={{width: 60, height: 60, borderRadius: 5}}/>
            </Row>
        </View>
       );
  
    return (
      <View
        style={{
          backgroundColor: Color.theme,
          padding: 16,
          alignItems: 'flex-start',
        }}>
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
      </View>
    );
  }

  function Dokumen(props) {
    const {Color} = useColor();
    const tampil = ({ item }) => (
        <View>
            <Text style={{fontSize: 10, fontWeight: 'bold', color: Color.text, textAlign: 'left', marginVertical: 10}}>{item.waktu}</Text>
            <Image source={item.file}/>
        </View>
        
       );
  
    return (
      <View
        style={{
          backgroundColor: Color.theme,
          padding: 16,
          alignItems: 'flex-start',
        }}>
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
      </View>
    );
  }

const UserGroupDetail = ({navigation, route}) => {
  const { params } = route;

  const user = useSelector((state) => state['user.auth'].login.user);

  const modalListActionRef = useRef();
  const {Color} = useColor();

  const Tab = createMaterialTopTabNavigator();

  const [isLoading, setIsLoading] = useState(false);

  const onLeave = async() => {
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
      setTimeout(() => {
        navigation.navigate('Chat');
      }, 2500);
    }
  }

  const GroupDetailHeader = () => {
    return (
      <>
        <Row>
          <Image
            source={{uri: params.imageGroup}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              marginHorizontal: 10,
            }}
          />
          <Col>
            <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'left'}}>
              {params.nameGroup}
            </Text>
            <Text
              style={{
                fontSize: 8,
                color: Color.secondary,
                textAlign: 'left',
                marginVertical: 1,
              }}>
              {params.selected.length} Anggota
            </Text>
          </Col>

          <View style={{width: '8%', marginVertical: 5}}>
            <Pressable onPress={() => { navigation.navigate('ManageGroupScreen', {
              ...params,
            });}}>
              <Feather name={'edit-2'} />
            </Pressable>
          </View>
        </Row>
        <Pressable
          onPress={() => {
            navigation.navigate('AddMember', {
              ...params,
            });
          }}
          style={{
            flexDirection: 'row',
            marginHorizontal: 15,
            marginVertical: 15,
          }}>
          <Ionicons
            name={'person-add-outline'}
            size={16}
            style={{color: Color.primary}}
          />
          <Text
            style={{color: Color.primary, fontSize: 12, marginHorizontal: 10}}>
            Tambahkan anggota grup
          </Text>
        </Pressable>
      </>
    );
  };

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
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Entypo name="dots-three-vertical" color={Color.text} size={20} />
            </TouchableOpacity>
          }
        />
      }>
      <GroupDetailHeader />
      <Tab.Navigator
        initialRouteName={'Belanjaan'}
        tabBarOptions={{
          indicatorStyle: {backgroundColor: Color.theme, height: '100%'},
          activeTintColor: Color.primary,
          activeBackgroundColor: Color.primary,
          inactiveTintColor: Color.secondary,
          labelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            color: Color.secondary,
          },
          indicatorStyle: {
            borderBottomColor: Color.primary,
            borderBottomWidth: 2,
          },
          labelStyle: {
            fontSize: 12,
          },
        }}>
        <Tab.Screen
          name="Anggota"
          children={props => <Anggota {...props} {...params} />}
          options={{tabBarLabel: 'Anggota'}}
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
              Alert('Konfirmasi', 'Anda akan keluar dari grop?', () => onLeave())
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
    </Scaffold>
  );
};

export default UserGroupDetail
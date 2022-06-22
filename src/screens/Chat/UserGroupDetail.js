import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView,Image, FlatList,Pressable,useWindowDimensions, AppState } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import ImagesPath from 'src/components/ImagesPath';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { usePopup } from '@src/components/Modal/Popup';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Scaffold from '@src/components/Scaffold';
import { Header } from 'src/components';
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import {ModalListAction } from 'src/components';
import {
	Row,
	Col,
} from '@src/components';

function Anggota(props, route) {
  const modalListActionRef = useRef();
  const { params } = route;
  
  const {Color} = useColor();
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
            modalListActionRef.current.open();
          }}>
          <Entypo name={'dots-three-horizontal'} size={15} />
        </TouchableOpacity>
      </Row>
    </View>
  );

  console.log(props.listAnggota);

  return (
    <View>
      <View
        style={{
          backgroundColor: Color.theme,
          padding: 16,
          alignItems: 'flex-start',
        }}>
        <FlatList
          data={props.listAnggota}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <ModalListAction
        ref={modalListActionRef}
        data={[
          {
            id: 0,
            name: 'Keluarkan dari grup',
            color: Color.text,
            onPress: () => {
              modalListActionRef.current.close();
            },
          },
          {
            id: 1,
            name: 'Jadikan Admin',
            color: Color.red,
            onPress: () => {
              modalListActionRef.current.close();
            },
          },
          {
            id: 2,
            name: 'Report',
            color: Color.red,
            onPress: () => {
              modalListActionRef.current.close();
            },
          },
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
  const modalListActionRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const {Color} = useColor();
  const Tab = createMaterialTopTabNavigator();
  const [backCover, setBackCover] = useState(true);
  // params
  const { params } = route;

  console.log('ini params', params);

  const GroupDetailHeader = () => {
    return (
      <>
        <Row>
          <Image
            source={{uri: params['params'].imageGroup}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              marginHorizontal: 10,
            }}
          />
          <Col>
            <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'left'}}>
              {params['params'].nameGroup}
            </Text>
            <Text
              style={{
                fontSize: 8,
                color: Color.secondary,
                textAlign: 'left',
                marginVertical: 1,
              }}>
              {params['params'].selected.length} Anggota
            </Text>
          </Col>

          <View style={{width: '8%', marginVertical: 5}}>
            <Pressable onPress={() => { navigation.navigate('ManageGroupScreen', {
              ...params['params'],
            });}}>
              <Feather name={'edit-2'} />
            </Pressable>
          </View>
        </Row>
        <Pressable
          onPress={() => {
            navigation.navigate('AddMember', {
              params,
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
          children={props => <Anggota listAnggota={params['params'].selected} {...props} />}
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
          //   color: Color.text,
          //   onPress: () => {
          //     modalListActionRef.current.close();
          //   },
          // },
          {
            id: 1,
            name: 'Keluar dari grup',
            color: Color.red,
            onPress: () => {
              modalListActionRef.current.close();
            },
          },
          // {
          //   id: 2,
          //   name: 'Report',
          //   color: Color.red,
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
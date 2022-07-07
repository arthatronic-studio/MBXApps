import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput,ScrollView,Image, FlatList,Pressable,useWindowDimensions, AppState } from 'react-native';
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
import { AlertModal, Header } from 'src/components';
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import {
	Row,
	Col,
} from '@src/components';
import Client from '@src/lib/apollo';
import { queryContentChatRoomManage, queryContentChatMessage } from '@src/lib/query';
import { Divider } from 'src/styled';
import {queryGetUserOrganizationRef} from 'src/lib/query';
import { fetchContentChatRoomManage } from 'src/api/chat/chat';
import { accessClient } from 'src/utils/access_client';

const itemPerPage = 100;

const AddMember = ({navigation, route}) => {
  const { params } = route;

  const {Color} = useColor();

  console.log('route', route);

  const [itemData, setItemData] = useState({
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
  });
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);

  useEffect(() => {
    fetchGetUserOrganizationRef();
  }, []);

  useEffect(() => {
    if (itemData.loadNext && itemData.page !== -1) {
      fetchGetUserOrganizationRef();
    }
  }, [itemData.loadNext]);

  useEffect(() => {
    const timeout =
      search !== ''
        ? setTimeout(() => {
            fetchSearchNameMember();
          }, 1000)
        : null;

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  const fetchSearchNameMember = () => {
    setFilterLoading(true);

    const variables = {
      name: search,
      initialCode: accessClient.InitialCode,
    };

    Client.query({
      query: queryGetUserOrganizationRef,
      variables,
    })
      .then(res => {
        console.log('res search', res);

        const data = res.data.getUserOrganizationRef;

        let newArr = [];

        if (data) {
          newArr = data;
        }

        setFilterData(newArr);
        setFilterLoading(false);
      })
      .catch(err => {
        console.log('err search', err);

        setFilterData([]);
        setFilterLoading(false);
      });
  };

  const fetchGetUserOrganizationRef = () => {
    const variables = {
      page: itemData.page + 1,
      limit: itemPerPage,
      initialCode: accessClient.InitialCode,
    };

    console.log('var', variables);

    Client.query({
      query: queryGetUserOrganizationRef,
      variables,
    })
      .then(res => {
        console.log(res, 'res2');

        const data = res.data.getUserOrganizationRef;

        let newArr = [];

        if (data) {
          if (Array.isArray(params.selected)) {
            let newData = [];

            data.map((item) => {
              const isExist = params.selected.filter((e) => e.user_id == item.userId)[0];
              if (!isExist) newData.push(item);
            })

            newArr = itemData.data.concat(newData);
          } else {
            newArr = itemData.data.concat(data);
          }
        }

        setItemData({
          ...itemData,
          data: newArr,
          loading: false,
          page: data.length > 0 ? itemData.page + 1 : -1,
          loadNext: false,
        });
      })
      .catch(err => {
        console.log(err, 'error');

        setItemData({
          ...itemData,
          loading: false,
          page: -1,
          loadNext: false,
        });
      });
  };

  const onSubmit = async() => {
    let userIds = [];

    selected.map((e) => {
      userIds.push(e.userId);
    });
    
    const variables = {
      method: 'UPDATE',
      roomId: parseInt(params.roomId),
      userId: userIds,
      userManage: 'ADD',
    };

    console.log(variables);

    const result = await fetchContentChatRoomManage(variables);
    console.log(result, 'result');
    if (result.status) {
      setTimeout(() => {
        navigation.navigate('Chat');
      }, 2500);
    }
  }

  const onSelected = (index, item) => {
    setItemData({...itemData, loading: true});

    const idxOf = selected.length > 0 ? selected.indexOf(item) : -1;
    console.log('indexof', idxOf);

    const newSelected = selected;
    if (idxOf === -1) {
      newSelected.push(item);
    } else {
      newSelected.splice(idxOf, 1);
    }

    setSelected(newSelected);
    setItemData({...itemData, loading: false});
  };

  const renderItem = ({item, index}) => (
    <Row
      style={{
        marginHorizontal: 15,
        marginVertical: 12,
        backgroundColor:
          selected.indexOf(item) !== -1 ? Color.primary : Color.white,
        borderRadius: selected.indexOf(item) !== -1 ? 14 : 0,
        paddingVertical: 5,
      }}>
      <Image
        source={{uri: item.photoProfile}}
        style={{
          borderRadius: 25,
          width: 50,
          height: 50,
          backgroundColor: Color.border,
          borderColor: Color.primary,
          marginLeft: 5,
        }}
      />
      <Text
        style={{
          fontSize: 14,
          width: '60%',
          fontWeight: 'bold',
          marginVertical: 10,
          marginHorizontal: 5,
          textAlign: 'left',
          justifyContent: 'center',
        }}>
        {item.firstName} {item.lastName}
      </Text>

      {selected.indexOf(item) !== -1 ? (
        <TouchableOpacity
          onPress={() => onSelected(index, item)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Color.secondary,
            height: 35,
            width: 75,
            borderRadius: 20,
            marginVertical: 10,
          }}>
          <Text style={{color: Color.textInput, fontSize: 12}}>x Batal</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => onSelected(index, item)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Color.primary,
            height: 35,
            width: 75,
            borderRadius: 20,
            marginVertical: 10,
          }}>
          <Text style={{color: Color.textInput, fontSize: 12}}>+Undang</Text>
        </TouchableOpacity>
      )}
    </Row>
  );

  return (
    <Scaffold
      fallback={itemData.loading}
      isLoading={filterLoading}
      header={<Header title="Undang Temanmu" />}>
      <View>
        <TextInput
          placeholder="Ayo cari temanmu"
          returnKeyType="done"
          returnKeyLabel="Done"
          blurOnSubmit={false}
          onBlur={() => {}}
          error={null}
          onChangeText={text => {
            setSearch(text);
          }}
          style={{
            fontSize: 12,
            paddingHorizontal: 28,
            backgroundColor: Color.border,
            width: '95%',
            alignSelf: 'center',
            borderRadius: 5,
            height: 40,
          }}></TextInput>
        <AntDesign
          name={'search1'}
          size={13}
          style={{
            position: 'absolute',
            color: Color.secondary,
            top: 13,
            left: 17,
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 8,
          color: Color.secondary,
          marginVertical: 8,
          textAlign: 'left',
          marginHorizontal: 10,
        }}>
        Anggota yang akan ditambahkan
      </Text>
      <View style={{flexDirection: 'row', marginHorizontal: 10}}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}>
          {selected.map(a => {
            return selected.length > 0 ? (
              <Image
                source={{uri: a.photoProfile}}
                style={{
                  borderRadius: 25,
                  width: 50,
                  height: 50,
                  backgroundColor: Color.border,
                  borderColor: Color.primary,
                  marginLeft: 5,
                }}
              />
            ) : (
              ''
            );
          })}
        </ScrollView>
      </View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: 'bold',
          textAlign: 'left',
          marginHorizontal: 10,
          marginVertical: 10,
        }}>
        Undang teman kamu
      </Text>
      <FlatList
        data={search !== '' ? filterData : itemData.data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        disabled={selected.length === 0}
        onPress={() => {
          setAlertModal(true);
        }}
        style={{
          backgroundColor: selected.length === 0 ? Color.disabled : Color.primary,
          height: 40,
          justifyContent: 'center',
          marginVertical: 12,
          width: '95%',
          borderRadius: 20,
          alignSelf: 'center',
        }}>
        <Text
          style={{fontSize: 12, color: Color.textInput, fontWeight: 'bold'}}>
          Tambahkan Anggota
        </Text>
      </TouchableOpacity>

      <AlertModal
        visible={alertModal}
        title='Konfirmasi'
        message='Tambahkan anggota yang dipilih ke grup?'
        showDiscardButton
        onSubmit={() => {
          onSubmit();
          setAlertModal(false);
        }}
        onClose={() => {
          setAlertModal(false);
        }}
        onDiscard={() => {
          setAlertModal(false);
        }}
      />
    </Scaffold>
  );
};

export default AddMember
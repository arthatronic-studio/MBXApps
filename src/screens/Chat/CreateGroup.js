import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, Image } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import { Button, usePopup } from '@src/components';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Entypo from 'react-native-vector-icons/Entypo'
import ImagesPath from 'src/components/ImagesPath';
import { Header, Scaffold, Alert } from 'src/components';
import {
  Row,
  Col,
} from '@src/components';
import { queryGetUserOrganizationRef } from 'src/lib/query';
import Client from '@src/lib/apollo';
import { initSocket } from 'src/api-socket/currentSocket';
import { Container } from 'src/styled';
import { accessClient } from 'src/utils/access_client';

const itemPerPage = 100;

const BottomSection = Styled(View)`
  width: 100%;
  padding: 16px;
  flexDirection: row;
  alignItems: center;
  borderTopWidth: 0.5px;
`;
const BoxInput = Styled(View)`
  width: 100%;
  padding: 4px 16px 4px 16px;
  borderRadius: 32px;
  borderWidth: 0.5px;
  flexDirection: row;
`;

const TextInputNumber = Styled(TextInput)`
  width: 90%;
  alignContent: flex-start;
  fontFamily: Inter-Regular;
  letterSpacing: 0.23;
  height: 40px;
`;

const CircleSend = Styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  borderRadius: 20px;
  justifyContent: center;
  alignItems: center;
`;
const CreateGroup = ({ navigation }) => {

  const [isLoading, setIsLoading] = useState(false);
  const { Color } = useColor();

  const currentSocket = initSocket();

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
  const [popupProps, showPopup] = usePopup();

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
        }, 500)
        : null;

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  const compareData = arr => {
    let obj = {};
    let newData = [];

    for (let i = 0; i < arr.length; i++) {
      obj[arr[i]['userId']] = arr[i];
    }

    for (let key in obj) {
      newData.push(obj[key]);
    }

    return newData;
  };

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
          newArr = itemData.data.concat(data); // compareData(itemData.data.concat(data));
        }

        console.log(data.length, 'dapet length');

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

  const onSubmit = () => {
    if (selected.length < 1) {
      showPopup('Minimal anggota group 1 anggota ', 'warning');
      return;
    } else {
      navigation.navigate('ManageGroupScreen', {
        roomId: null,
        selected: selected,
      });
    }
  }

  const onSelected = (index, item) => {
    setItemData({ ...itemData, loading: true });

    const idxOf = selected.length > 0 ? selected.indexOf(item) : -1;
    console.log('indexof', idxOf);

    const newSelected = selected;
    if (idxOf === -1) {

      newSelected.push(item);
    } else {
      newSelected.splice(idxOf, 1);
    }


    setSelected(newSelected);
    setItemData({ ...itemData, loading: false });
  };

  console.log('selected', selected);

  const onPress = item => {
    const args = {
      my_room_ids: params.myRoomIds,
      user_id_target: item.userId,
    };

    console.log('args', args);

    currentSocket.emit('room_id_target', args);
    currentSocket.on('room_id_target', res => {
      console.log('room_id_target', res);

      if (selected.length > 0) {
        onSelected(item);
      } else {
        navigation.navigate('ChatDetailScreen', {
          roomId: res,
          roomName: item.firstName,
          isDirector: item.isDirector === 1,
          selected: [item],
          targetIds: [item.userId],
        });
      }
    });
  };


  const renderItem = ({ item, index }) => (
    <Row
      style={{
        marginBottom: 12,
        backgroundColor:
          selected.indexOf(item.userId) !== -1 ? Color.primary : Color.theme,
        borderRadius: 8,
        padding: 8,
      }}>
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: item.photoProfile }}
          style={{
            width: '100%',
            aspectRatio: 1,
            borderRadius: 25,
            backgroundColor: Color.border,
            borderColor: Color.primary,
          }}
        />
      </View>
      <View style={{ flex: 7, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8 }}>
        <Text
          numberOfLines={2}
          style={{
            width: '60%',
            fontWeight: 'bold',
            textAlign: 'left',
            justifyContent: 'center',
          }}>
          {item.firstName} {item.lastName}
        </Text>

        {selected.indexOf(item.userId) !== -1 ? (
          <TouchableOpacity
            onPress={() => onSelected(index, item.userId)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Color.secondary,
              width: 75,
              borderRadius: 20,
              paddingVertical: 8,
            }}>
            <Text style={{ color: Color.textButtonInline, fontSize: 12 }}>x Batal</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onSelected(index, item.userId)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Color.primary,
              width: 75,
              borderRadius: 20,
              paddingVertical: 8,
            }}>
            <Text style={{ color: Color.textButtonInline, fontSize: 12 }}>+Undang</Text>
          </TouchableOpacity>
        )}
      </View>
    </Row>
  );

  return (
    <Scaffold
      fallback={itemData.loading}
      isLoading={filterLoading}
      popupProps={popupProps}
      header={<Header title="Buat Group" />}>
      <Row style={{ marginHorizontal: 15, marginVertical: 15 }}>
        <Image source={ImagesPath.firstChat} />
        <Col style={{ marginHorizontal: 10, paddingVertical: 5 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left' }}>
            Tambahkan Anggota
          </Text>
          <Text
            style={{ fontSize: 10, textAlign: 'left', color: Color.secondary }}>
            Pilih anggota grup setidaknya satu peserta
          </Text>
        </Col>
      </Row>

      {/* <Text
        style={{
          fontWeight: 'bold',
          textAlign: 'left',
          marginHorizontal: 15,
          marginVertical: 15,
        }}>
        Undang teman kamu
      </Text> */}

      <BottomSection style={{ borderColor: Color.border }}>
        <BoxInput style={{ backgroundColor: Color.textInput, borderColor: Color.border }}>
          <TextInputNumber
            name="text"
            placeholder='Cari anggota'
            placeholderTextColor={Color.placeholder}
            returnKeyType="done"
            returnKeyLabel="Done"
            blurOnSubmit={false}
            onBlur={() => { }}
            error={null}
            onChangeText={(text) => {
              setSearch(text);
            }}
            style={{
              backgroundColor: Color.textInput,
              color: Color.text,
            }}
          />
          <CircleSend style={{ backgroundColor: Color.primary }} onPress={() => { }}>
            <Ionicons name='search' size={16} color={Color.textButtonInline} />
          </CircleSend>
        </BoxInput>
      </BottomSection>

      <FlatList
        keyExtractor={(item, index) => item.toString() + index}
        data={search !== '' ? filterData : itemData.data}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
      />

      <Container padding={16}>
        <Button
          onPress={() => onSubmit()}
        >
          Lanjutkan
        </Button>
      </Container>
    </Scaffold>
  );
}

export default CreateGroup
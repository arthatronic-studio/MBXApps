import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, Image } from 'react-native';
import {
  Text,
  TouchableOpacity,
  useColor,
  usePopup,
  Scaffold,
  Alert,
} from '@src/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useIsFocused } from '@react-navigation/core';

import Client from '@src/lib/apollo';
import { queryJoinCommunityManage } from '@src/lib/query/joinCommunityManage';
import { joinCommunityMember } from 'src/lib/query/joinCommunityMember';
import { Divider } from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import ModalInputText from 'src/components/ModalInputText';
import Styled from 'styled-components';

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

const CardCommunityAdmin = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalInputText, setModalInputText] = useState(false);

  const [popupProps, showPopup] = usePopup();
  const { Color } = useColor();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLoading, setFilterLoading] = useState(false);
  const [sorting, setSorting] = useState(false);

  console.log('ini data',data);
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

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


  const dataSorting = () =>{
   
    if(sorting){
      const sort = data.sort((a, b) => a.userDetail.firstName.localeCompare(b.userDetail.firstName))
      setData(sort);

    }else{
      const sort = data.sort((a, b) => b.userDetail.firstName.localeCompare(a.userDetail.firstName))
      setData(sort);
    }
  }
  const fetchData = () => {
    let status = 2;
    if (props.type === 'newAnggota') {
      status = 0;
    } else if (props.type === 'Anggota') {
      status = 1;
    }


    Client.query({
      query: joinCommunityMember,
      variables: {
        status: status,
      },
    })
      .then((res) => {

        setData(res.data.joinCommunityMember);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const fetchJoinCommunityManage = (id, userId, status, reason_reject) => {
    setLoading(true);



    let resMessage =
      status === 1 ? 'Diterima' :
        status === 2 ? 'Ditolak' : 'Dihapus';

    Client.query({
      query: queryJoinCommunityManage,
      variables: {
        status,
        id,
        organizationInitialCode: accessClient.InitialCode,
        reason_reject,
      },
    })
      .then((res) => {
        console.log('res join', res);

        const data = res.data.joinCommunityManage;
        const success = data && data.id;

        if (success) {
          fetchData();
          showPopup(`Akun berhasil ${resMessage}`, 'success');
          setLoading(false);
        } else {
          showPopup(`Akun gagal ${resMessage}`, 'error');
          setLoading(false);
        }
      })
      .catch((err) => {
        showPopup(err.message, 'error');
        setLoading(false);
      });
  };

  const fetchUpdateMember = item => {
    setLoading(true);
    Client.query({
      query: queryJoinCommunityManage,
      variables: {
        status: 1,
        id: item.id,
        customIdNumber: item.userDetail.idNumber,
        organizationInitialCode: accessClient.InitialCode,
      },
    })
      .then((res) => {
        showPopup('Akun berhasil diubah', 'success');
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        showPopup('catch', 'error');
        setLoading(false);
      });
  };
  const fetchSearchNameMember = () => {
    setFilterLoading(true);
    let status = 2;
    if (props.type === 'newAnggota') {
      status = 0;
    } else if (props.type === 'Anggota') {
      status = 1;
    }
    const variables = {
      status: status,
      name: search
    };

    Client.query({
      query: joinCommunityMember,
      variables,
    })
      .then(res => {
        console.log('res search', res);

        const data = res.data.joinCommunityMember;

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
  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('CardDetail', { item, props, isAdminPage: true })}
        style={{
          borderWidth: 0.5,
          borderRadius: 8,
          borderColor: Color.placeholder,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          marginBottom: 16,
        }}>
        <Image
          source={{
            uri:
              item.userDetail.photoProfile ||
              item.userDetail.image ||
              item.car_photo_main,
          }}
          style={{
            backgroundColor: Color.disabled,
            width: '20%',
            aspectRatio: 1,
            borderRadius: 16,
          }}
        />

        <View
          style={{
            width: '80%',
            paddingLeft: 16,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text align="left">
              {item.userDetail.firstName} - {item.car_type}
            </Text>
          </View>

          <Divider height={12} />

          {props.type === 'Anggota' ? (
            <View style={{ flexDirection: 'row', width: '100%', height: 45 }}>
              <TextInput
                placeholder={item.userDetail.idNumber || 'Input Nomor ID'}
                placeholderTextColor={Color.gray}
                value={item.userDetail.idNumber}
                onChangeText={val => {
                  let newData = [...data];
                  newData[index].userDetail.idNumber = val;
                  setData(newData);
                }}
                style={{
                  color: Color.text,
                  fontSize: 14,
                  fontFamily: 'Inter-Regular',
                  width: '80%',
                  backgroundColor: Color.semiwhite,
                  borderRadius: 4,
                  includeFontPadding: false,
                  paddingLeft: 8,
                }}
              />

              <View
                style={{
                  width: '20%',
                  height: '100%',
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  style={{
                    height: '100%',
                    aspectRatio: 1,
                    borderRadius: 50,
                    backgroundColor: Color.info,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    Alert(
                      'Konfirmasi',
                      'Apakah Anda yakin akan mengubah data anggota ini?',
                      () => fetchUpdateMember(item),
                    );
                  }}
                >
                  <Ionicons
                    name="save"
                    color={Color.theme}
                    size={16}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', width: '100%', height: 33 }}>
              <TouchableOpacity
                onPress={() => {
                  Alert(
                    'Terima',
                    'Apakah Anda yakin akan menerima anggota ini?',
                    () => fetchJoinCommunityManage(item.id, item.user_id, 1),
                  );
                }}
                style={{
                  backgroundColor: Color.info,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                }}>
                <Text color={Color.textInput}>Approve</Text>
              </TouchableOpacity>
              {props.type !== 'notAnggota' && <Divider />}
              {props.type !== 'notAnggota' && (
                <TouchableOpacity
                  onPress={() => {
                    setModalInputText(true);
                  }}
                  style={{
                    backgroundColor: Color.error,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 4,
                  }}>
                  <Text color={Color.textInput}>Reject</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: Color.error,
            borderTopRightRadius: 8,
            borderBottomLeftRadius: 8,
          }}
          onPress={() => {
            Alert('Hapus', 'Apakah anda yakin akan menghapus member ini?', () => fetchJoinCommunityManage(item.id, item.user_id, 0))
          }}
        >
          <Ionicons
            name='close'
            color={Color.textInput}
            size={18}
            style={{
              padding: 2
            }}
          />
        </TouchableOpacity>

        <ModalInputText
          visible={modalInputText}
          headerLabel='Reject'
          placeholder='Masukan penjelasan Anda'
          isTextArea
          onClose={() => setModalInputText(false)}
          onSubmit={(text) => {
            Alert(
              'Tolak',
              'Apakah Anda yakin akan menolak anggota ini?',
              () => fetchJoinCommunityManage(item.id, item.user_id, 2, text),
            );
            setModalInputText(false);
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Scaffold
      header={<View />}
      fallback={loading}
      popupProps={popupProps}
      isLoading={filterLoading}
    >

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
            <Ionicons name='search' size={16} color={Color.text} />
          </CircleSend>
          <CircleSend style={{ backgroundColor: Color.primary }} onPress={() => { setSorting(!sorting);
            dataSorting()}}>
            <View style={{flexDirection:'row'}}>
            <Ionicons name='search' size={16} color={Color.text} />
            <Ionicons name='search' size={16} color={Color.text} />
            </View>
          </CircleSend>
        </BoxInput>
      </BottomSection>

      {data.length > 0 ? (
        <FlatList
          keyExtractor={(item, index) => item.id + index.toString()}
          // data={data}
          data={search !== '' ? filterData : data}
          renderItem={({ item, index }) => renderItem(item, index)}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Data belum tersedia</Text>
        </View>
      )}
    </Scaffold>
  );
};

export default CardCommunityAdmin;
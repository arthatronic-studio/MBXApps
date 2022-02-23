import React, {useState, useEffect} from 'react';
import {View, FlatList, TextInput, Image} from 'react-native';
import {
  Text,
  TouchableOpacity,
  useColor,
  usePopup,
  Scaffold,
  Alert,
} from '@src/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useIsFocused} from '@react-navigation/core';

import Client from '@src/lib/apollo';
import {joinCommunityManage} from '@src/lib/query/joinCommunityManage';
import {joinCommunityMember} from 'src/lib/query/joinCommunityMember';
import {Divider} from 'src/styled';
import { queryOrganizationMemberManage } from 'src/lib/query/organization';
import Config from 'react-native-config';

const CardCommunityAdmin = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [popupProps, showPopup] = usePopup();
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      fetchData();
      console.log('here');
    }
  }, [isFocused]);

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

  const fetchJoinCommunityManage = (id, userId, status) => {
    setLoading(true);

    let resMessage =
      status === 1 ? 'Diterima' :
      status === 2 ? 'Ditolak' : 'Dihapus';

    Client.query({
      query: joinCommunityManage,
      variables: {
        status,
        id,
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

  const fetchOrganizationMemberManage = (id, userId, status) => {
    let resMessage =
      status === 1 ? 'Diterima' :
      status === 2 ? 'Ditolak' : 'Dihapus';
    let method =
      status === 1 ? 'INSERT' :
      status === 2 ? 'REJECT' : 'DELETE';

    const variables = {
      "userId": userId,
      "organizationInitialCode": Config.INITIAL_CODE,
      "type": method,
    };

    console.log(variables);

    Client.mutate({
      mutation: queryOrganizationMemberManage,
      variables,
    }).then((res) => {
      console.log('res organization manage', res);

      const data = res.data.organizationMemberManage;
      const success = data;

      if (success) {
        fetchJoinCommunityManage(id, userId, status);
      } else {
        showPopup(`Sync gagal ${resMessage}`, 'error');
        setLoading(false);
      }
    }).catch((err) => {
      console.log('err organization manage', err);
      showPopup(err.message, 'error');
      setLoading(false);
    });
  }

  const fetchUpdateMember = item => {
    setLoading(true);

    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 1,
        id: item.id,
        customIdNumber: item.userDetail.idNumber,
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

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('CardDetail', {item, props})}
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
            <View style={{flexDirection: 'row', width: '100%', height: 45}}>
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
            <View style={{flexDirection: 'row', width: '100%', height: 33}}>
              <TouchableOpacity
                onPress={() => {
                  Alert(
                    'Terima',
                    'Apakah Anda yakin akan menerima anggota ini?',
                    () => fetchOrganizationMemberManage(item.id, item.user_id, 1),
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
                    Alert(
                      'Tolak',
                      'Apakah Anda yakin akan menolak anggota ini?',
                      () => fetchOrganizationMemberManage(item.id, item.user_id, 2),
                    );
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
            Alert('Hapus', 'Apakah anda yakin akan menghapus member ini?', () => fetchOrganizationMemberManage(item.id, item.user_id, 2))
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
      </TouchableOpacity>
    );
  };

  console.log(props);

  return (
    <Scaffold
      header={<View />}
      fallback={loading}
      popupProps={popupProps}
    >
      {data.length > 0 ? (
        <FlatList
          keyExtractor={(item, index) => item.id + index.toString()}
          data={data}
          renderItem={({item, index}) => renderItem(item, index)}
          contentContainerStyle={{
            padding: 16,
          }}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Data belum tersedia</Text>
        </View>
      )}
    </Scaffold>
  );
};

export default CardCommunityAdmin;
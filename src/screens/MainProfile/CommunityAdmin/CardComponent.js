import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import Styled from 'styled-components';
import {
  Text,
  TouchableOpacity,
  useColor,
  usePopup,
  Popup,
} from '@src/components';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {shadowStyle} from '@src/styles';
import {useSelector, useDispatch} from 'react-redux';

import Client from '@src/lib/apollo';
import {joinCommunityManage} from '@src/lib/query/joinCommunityManage';
import {joinCommunityMember} from 'src/lib/query/joinCommunityMember';
import { Divider } from 'src/styled';

const CardComponent = (props) => {
  const [data, setData] = useState([]);

  const [popupProps, showPopup] = usePopup();
  const {Color} = useColor();

  useEffect(() => {
    let status;
    if (props.type === 'newAnggota') {
      status = 0;
    } else if (props.type === 'Anggota') {
      status = 1;
    } else {
      status = 2;
    }

    Client.query({
      query: joinCommunityMember,
      variables: {
        status: status,
      },
    })
      .then((res) => {
        setData(res.data.joinCommunityMember);
      })
      .catch((err) => {
        showPopup('catch', 'warning');
      });
  }, []);

  const handleSuccess = (id) => {
    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 1,
        id: id,
      },
    })
      .then((res) => {
        showPopup('Akun selesai di Approve', 'success');
      })
      .catch((err) => {
        showPopup(err.message, 'warning');
      });
  };

  const handleRemove = (id) => {
    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 2,
        id: id,
      },
    })
      .then((res) => {
        showPopup('Akun berhasil ditolak', 'error');
      })
      .catch((err) => {
        showPopup('catch', 'warning');
      });
  };

  const fetchUpdateMember = (item) => {
    console.log(item);
  }

  const renderItem = (item, index) => {
    if (index === 0) {
      console.log(item);
    }

    return (
      <View
        style={{
          borderWidth: 0.5,
          borderRadius: 15,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          marginBottom: 16,
        }}>
        <Image
          source={{ uri: item.userDetail.photoProfile || item.userDetail.image || item.car_photo_main }}
          style={{
            backgroundColor: Color.disabled,
            width: '20%',
            aspectRatio: 1,
            borderRadius: 16,
          }}
        />
        
        <View style={{width: '80%', paddingLeft: 16, justifyContent: 'space-between'}}>
          <View>
            <Text align='left'>{item.userDetail.firstName} - {item.car_type}</Text>
          </View>

          <Divider height={12} />

          {props.type === 'Anggota' ? (
            <View style={{flexDirection: 'row', width: '100%', height: 33}}>
              <TextInput
                placeholder={item.userDetail.idNumber || "Input Nomor ID"}
                placeholderTextColor={Color.gray}
                onChangeText={(val) => {
                  item.userDetail.idNumber = val;
                }}
                style={{
                  color: Color.gray,
                  fontSize: 14,
                  fontFamily: 'Raleway-Regular',
                  width: '80%',
                  backgroundColor: '#fff',
                  padding: 12,
                  borderRadius: 4,
                }}
              />

              <View
                style={{
                  width: '20%',
                  height: '100%',
                  alignItems: 'flex-end',
                }}
              >
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
                    fetchUpdateMember(item);
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
                onPress={() => handleSuccess(item.id)}
                style={{
                  backgroundColor: Color.info,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                }}>
                <Text color={Color.textInput}>{props.handleSuccess}</Text>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity
                onPress={() => handleRemove(item.id)}
                style={{
                  backgroundColor: Color.error,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                }}>
                <Text color={Color.textInput}>{props.handleRemove}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      <FlatList
        keyExtractor={(item, index) => item.id + index.toString()}
        data={data}
        renderItem={({ item, index }) => renderItem(item, index)}
        contentContainerStyle={{
          padding: 16,
        }}
      />
      
      <Popup {...popupProps} />
    </View>
  );
};

export default CardComponent;
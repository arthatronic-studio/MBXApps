import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Image,
  useWindowDimensions,
} from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Feather from 'react-native-vector-icons/Feather'
import { usePopup } from '@src/components';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Entypo from 'react-native-vector-icons/Entypo'
import ImagesPath from 'src/components/ImagesPath';
import { Header, Scaffold, Alert } from 'src/components';
import {Divider} from 'src/styled';
import {launchImageLibrary} from 'react-native-image-picker';
import { currentSocket } from '@src/screens/MainHome/MainHome';
import Client from '@src/lib/apollo';
import {
    Row,
    Col,
  } from '@src/components';
import { ScrollView } from 'react-native-gesture-handler';
import { queryContentChatRoomManage } from 'src/lib/query';
import ChatGroupScreen from 'src/screens/Chat/ChatGroupScreen';

const AddInformationGroup = ({ navigation, route }) => {
    const { params } = route;
    console.log('params',params.selected);
    
  const [isLoading, setIsLoading] = useState(false);
  const {Color} = useColor();
  const [selected, setSelected] = useState(params.selected);
  const [nameGroup, setNameGroup] = useState('');
  const [popupProps, showPopup] = usePopup();
  const Tab = createMaterialTopTabNavigator();
  const user = useSelector(state => state['user.auth'].login.user);
  //Image
  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');
    const { height } = useWindowDimensions();
    
  const onSubmit = selected => {
    if (nameGroup === '') {
      showPopup('Nama group tidak boleh kosong', 'warning');
      return;
    } else if (thumbImage === '') {
        showPopup('Gambar tidak boleh kosong', 'warning');
        return;
    } 
    
    saveGroup(selected);
  };
    const saveGroup = selected => {
      selected.push(user.userId);
      setIsLoading(true);
    const variables = {
      method: 'INSERT',
      name: nameGroup,
      image: thumbImage === '' ? '' : 'data:image/png;base64,' + thumbImage,
      type: 'GROUP',
      userId: selected,
    };
    console.log('variables', variables);
    Client.query({
      query: queryContentChatRoomManage,
      variables,
    })
        .then(res => {
           
          console.log('succes group', res);
                setIsLoading(false);
          showPopup('Group berhasil dibuat!', 'success');
         
          navigation.navigate('Chat');
           
     
      })
      .catch(err => {
        console.log('gagal group', err);
           setIsLoading(false);
        showPopup('Group gagal dibuat!, silakan coba lagi', 'error');
      });
  };

  return (
    <Scaffold
      isLoading={isLoading}
      header={<Header title="Buat Grup" />}
      popupProps={popupProps}>
      <ScrollView>
        <Row style={{marginHorizontal: 15, marginVertical: 15}}>
          <Image source={ImagesPath.secondChat} />
          <Col style={{marginHorizontal: 10, paddingVertical: 5}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'left'}}>
              Tambahkan Informasi
            </Text>
            <Text
              style={{fontSize: 10, textAlign: 'left', color: Color.secondary}}>
              Tambahkan foto profile dan nama grup
            </Text>
          </Col>
        </Row>
        <View>
          {thumbImage !== '' ? (
            <View
              style={{
                width: '100%',
                height: height / 4,
                borderRadius: 5,
              }}>
              <Image
                style={{
                  height: '50%',
                  aspectRatio: 1,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  
                }}
                source={{uri: `data:${mimeImage};base64,${thumbImage}`}}
              />
            </View>
          ) : (
            <Image
              source={ImagesPath.userChat}
              style={{alignSelf: 'center', marginVertical: 15}}
            />
          )}

          <View
            style={{
              backgroundColor: Color.primary,
              width: 20,
              height: 20,
              borderRadius: 20,
              position: 'absolute',
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 75,
              right: 160,
              borderColor: Color.theme,
              borderWidth: 1,
            }}>
            <TouchableOpacity
              onPress={() => {
                const options = {
                  mediaType: 'photo',
                  maxWidth: 640,
                  maxHeight: 640,
                  quality: 1,
                  includeBase64: true,
                };

                launchImageLibrary(options, callback => {
                  setThumbImage(callback.base64);
                  setMimeImage(callback.type);
                });
              }}>
              <Feather
                size={10}
                name={'camera'}
                color={Color.theme}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text
            style={{
              marginTop: 5,
              left: 25,
              fontSize: 6,
              color: Color.secondary,
              position: 'absolute',
            }}>
            Nama Forum
          </Text>
          <TextInput
            placeholder="Masukkan Nama Grup"
            name="groupName"
            value={nameGroup}
            onChangeText={groupName => {
              setNameGroup(groupName);
            }}
            style={{
              borderWidth: 1,
              borderColor: Color.border,
              width: '95%',
              alignSelf: 'center',
              borderRadius: 5,
              height: 42,
              fontSize: 12,
              paddingHorizontal: 15,
              paddingTop: 17,
            }}></TextInput>
          <Text
            style={{
              fontSize: 8,
              color: Color.secondary,
              textAlign: 'right',
              marginRight: 10,
              marginTop: 5,
            }}>
            0/24
          </Text>
        </View>
        <View style={{marginVertical: 15}}>
          <Text
            style={{
              marginTop: 5,
              left: 25,
              fontSize: 6,
              color: Color.secondary,
              position: 'absolute',
            }}>
            Deskripsi Forum
          </Text>
          <TextInput
            placeholder="Tuliskan sesuatu tentang forum"
            style={{
              borderWidth: 1,
              borderColor: Color.border,
              width: '95%',
              alignSelf: 'center',
              borderRadius: 5,
              height: 80,
              fontSize: 12,
              paddingHorizontal: 15,
              paddingTop: 17,
            }}></TextInput>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => onSubmit(selected)}
        style={{
          marginVertical: 10,
          backgroundColor: Color.secondary,
          height: 40,
          width: '92%',
          alignSelf: 'center',
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 12, color: Color.textInput}}>Buat Grup</Text>
      </TouchableOpacity>
    </Scaffold>
  );
};

export default AddInformationGroup
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

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Feather from 'react-native-vector-icons/Feather'
import { Button, usePopup } from '@src/components';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Entypo from 'react-native-vector-icons/Entypo'
import ImagesPath from 'src/components/ImagesPath';
import { Header, Scaffold, Alert } from 'src/components';
import { Container, Divider } from 'src/styled';
import { launchImageLibrary } from 'react-native-image-picker';
import Client from '@src/lib/apollo';
import {
  Row,
  Col,
} from '@src/components';
import { ScrollView } from 'react-native-gesture-handler';
import { queryContentChatRoomManage } from 'src/lib/query';
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';

const ManageGroupScreen = ({ navigation, route }) => {
  const { params } = route;
  const { selected } = params;
  const isUpdatePage = params.roomId !== null;
  console.log('params', params);

  const user = useSelector(state => state['user.auth'].login.user);
  const { Color } = useColor();
  const { height, width } = useWindowDimensions();
  const [popupProps, showPopup] = usePopup();

  const [isLoading, setIsLoading] = useState(false);
  const [nameGroup, setNameGroup] = useState(isUpdatePage ? params.nameGroup : '');
  const [groupDeskripsi, setgroupDeskripsi] = useState(isUpdatePage ? params.description : '');
  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');
  const [modalImagePicker, setModalImagePicker] = useState(false);

  const onSubmit = (selected) => {
    if (nameGroup === '') {
      showPopup('Nama group tidak boleh kosong', 'warning');
      return;
    }

    selected.push(user.userId);

    setIsLoading(true);

    let variables = {
      method: 'INSERT',
      name: nameGroup,
      description: groupDeskripsi,
      image: thumbImage === '' ? '' : 'data:image/png;base64,' + thumbImage,
      type: 'GROUP',
      userId: selected,
    };

    if (isUpdatePage) {
      variables = {
        method: 'UPDATE',
        roomId: parseInt(params.roomId),
        name: nameGroup,
        description: groupDeskripsi,
        type: 'GROUP',
      }

      if (thumbImage !== '') {
        variables.image = 'data:image/png;base64,' + thumbImage;
      }
    }

    console.log('variables', variables);

    Client.query({
      query: queryContentChatRoomManage,
      variables,
    })
      .then(res => {

        console.log('succes group', res);
        setIsLoading(false);
        showPopup('Group berhasil dibuat!', 'success');

        setTimeout(() => {
          navigation.navigate('Chat');
        }, 2500);
      })
      .catch(err => {
        console.log('gagal group', JSON.stringify(err));
        setIsLoading(false);
        showPopup('Group gagal dibuat!, silakan coba lagi', 'error');
      });
  };

  console.log(params.imageGroup);

  return (
    <Scaffold
      isLoading={isLoading}
      header={<Header title={isUpdatePage ? 'Edit Grup' : 'Buat Grup'} />}
      popupProps={popupProps}>
      <ScrollView>
        <Row style={{ marginHorizontal: 15, marginVertical: 15 }}>
          <Image source={ImagesPath.secondChat} />
          <Col style={{ marginHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left' }}>
              Tambahkan Informasi
            </Text>
            <Text
              style={{ fontSize: 10, textAlign: 'left', color: Color.secondary }}>
              Tambahkan foto profile dan nama grup
            </Text>
          </Col>
        </Row>

        <View>
          <View
            style={{
              height: width / 2,
              aspectRatio: 1,
              alignSelf: 'center',
            }}
          >
            {thumbImage !== '' ? (
              <Image
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: width / 4,
                }}
                source={{ uri: `data:${mimeImage};base64,${thumbImage}` }}
              />
            ) :
              isUpdatePage && params.imageGroup !== '' && params.imageGroup !== null ?
                <Image
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: width / 4,
                  }}
                  source={{ uri: params.imageGroup }}
                />
                :
                (
                  <Image
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: width / 4,
                    }}
                    source={ImagesPath.userChat}
                  />
                )}

            <View
              style={{
                backgroundColor: Color.primary,
                width: width / 12,
                aspectRatio: 1,
                borderRadius: width / 24,
                position: 'absolute',
                justifyContent: 'center',
                alignSelf: 'center',
                borderColor: Color.theme,
                borderWidth: 1,
                bottom: 0,
                right: width / 12,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setModalImagePicker(true);
                }}>
                <Feather
                  size={16}
                  name={'camera'}
                  color={Color.textButtonInline}
                  style={{ alignSelf: 'center' }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Container paddingHorizontal={16} marginTop={16}>
          <Container marginBottom={8}>
            <Text
              align='left'
              size={12}
            >
              Nama Grup
            </Text>
          </Container>
          <TextInput
            placeholder="Masukkan Nama Grup"
            placeholderTextColor={Color.placeholder}
            name="groupName"
            value={nameGroup}
            onChangeText={groupName => {
              setNameGroup(groupName);
            }}
            maxLength={24}
            style={{
              borderWidth: 1,
              borderColor: Color.border,
              width: '100%',
              alignSelf: 'center',
              borderRadius: 5,
              height: 42,
              fontSize: 12,
              paddingHorizontal: 15,
              paddingTop: 17,
              color: Color.text,
              backgroundColor: Color.textInput,
            }}></TextInput>
          <Text
            style={{
              fontSize: 8,
              color: Color.secondary,
              textAlign: 'right',
              marginRight: 10,
              marginTop: 5,
            }}>
            {nameGroup.length}/24
          </Text>

          <Divider />

          <Container marginBottom={8}>
            <Text
              align='left'
              size={12}
            >
              Deskripsi Grup
            </Text>
          </Container>
          <TextInput
            placeholder="Tuliskan sesuatu tentang Group"
            placeholderTextColor={Color.placeholder}
            name="groupDeskripsi"
            value={groupDeskripsi}
            onChangeText={groupDeskripsi => {
              setgroupDeskripsi(groupDeskripsi);
            }}
            style={{
              borderWidth: 1,
              borderColor: Color.border,
              width: '100%',
              alignSelf: 'center',
              borderRadius: 5,
              height: 80,
              fontSize: 12,
              paddingHorizontal: 15,
              paddingTop: 17,
              color: Color.text,
              backgroundColor: Color.textInput,
            }}
          />
        </Container>
      </ScrollView>

      <Container padding={16}>
        <Button
          onPress={() => onSubmit(selected)}
        >
          {isUpdatePage ? 'Edit' : 'Buat'}
        </Button>
      </Container>

      <ModalImagePicker
        visible={modalImagePicker}
        onClose={() => setModalImagePicker(false)}
        onSelected={(callback) => {
          setThumbImage(callback.base64);
          setMimeImage(callback.type);
        }}
      />
    </Scaffold>
  );
};

export default ManageGroupScreen
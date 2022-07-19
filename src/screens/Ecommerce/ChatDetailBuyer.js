import React, {useState, useEffect} from 'react';
import {
  View,
  ImageBackground,
  useWindowDimensions,
  Image,
  TextInput,
} from 'react-native';
import {Header} from '@src/components';
import {Divider} from 'src/styled';
import {MainView} from '@src/styled';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Col, Scaffold, Text, TouchableOpacity, useColor} from '@src/components';
import {shadowStyle} from '@src/styles';
import {TabBar, TabView, SceneMap} from 'react-native-tab-view';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import CardChat from './CardChat';
import CardChatExist from './CardChatExist';
import ImagesPath from 'src/components/ImagesPath';
import Styled from 'styled-components';
import ChatEcommerceHeader from './ChatEcommerceHeader';
import {useSelector} from 'react-redux';
import Footer from 'src/components/Footer';
import {FormatMoney} from '@src/utils';
import moment from 'moment';
import { initSocket } from 'src/api-socket/currentSocket';

const BottomSection = Styled(View)`
  width: 100%;
  padding: 16px;
  borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  width: 85%;
  minHeight: 48px;
  padding: 0px 42px 0px 16px;
  borderRadius: 120px;
  borderWidth: 0.5px;
  justifyContent: center;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  fontFamily: Inter-Regular;
  letterSpacing: 0.23;
  fontSize: 12px;
`;

const CircleSend = Styled(TouchableOpacity)`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 50px;
  height: 50px;
  borderRadius: 25px;
  justifyContent: center;
  alignItems: center;
`;

const ChatDetailBuyer = ({navigation, route}) => {
  const {id, merchant, users, bodyTagged, bodyCreateRoom, bodyGetRoom} =
    route.params;

  const currentSocket = initSocket();
  
  const {Color} = useColor();
  const [roomId, setRoomId] = useState(id);
  const user = useSelector(state => state['user.auth'].login.user);
  const [userTarget, setUserTarget] = useState(
    users && users.find(item => item.user_id != user.userId),
  );
  const {width, height} = useWindowDimensions();
  const [message, setMessage] = useState('');
  const [dataChat, setDataChat] = useState([]);
  const [userImage, setUserImage] = useState(user.photoProfile);
  const [targetImage, setTargetImage] = useState(merchant.profile_img);
  const [tagged, setTagged] = useState(bodyTagged);

  const create_message = () => {
    if (roomId) {
      console.log("siniii room id");
      if (tagged) create_flag_item(tagged);
      const community_chat_user_params = [
        {user_id: user.userId, room_type: 'ECOMMERCE', room_user_type: 'USER'},
        {
          user_id: userTarget.user_id,
          room_type: 'ECOMMERCE',
          room_user_type: 'MERCHANT',
        },
      ];
      const body = {
        community_chat_user_params: community_chat_user_params,
        chat_room_id: roomId,
        chat_message: message,
        user_id: user.userId,
        chat_type: 'TEXT',
      };
      currentSocket.emit('create_community_chat_message', body);
      console.log(body, 'body');
    } else {
      console.log("siniii gaada id");
      currentSocket.on('get_community_chat_room_id', res => {
        console.log('get_community_chat_room_id detail', res);
        if (res.data.chat_room_id) {
          setUserTarget(
            res.data.users.find(item => item.user_id != user.userId),
          );
          setRoomId(res.data.chat_room_id);
          setTagged({...tagged, chat_room_id: res.data.chat_room_id});
          if (tagged) create_flag_item({...tagged, chat_room_id: res.data.chat_room_id});
          const community_chat_user_params = [
            {
              user_id: user.userId,
              room_type: 'ECOMMERCE',
              room_user_type: 'USER',
            },
            {
              user_id: res.data.users.find(item => item.user_id != user.userId).user_id,
              room_type: 'ECOMMERCE',
              room_user_type: 'MERCHANT',
            },
          ];
          const body = {
            community_chat_user_params: community_chat_user_params,
            chat_room_id: res.data.chat_room_id,
            chat_message: message,
            user_id: user.userId,
            chat_type: 'TEXT',
          };
          currentSocket.emit('community_chat_message', {chat_room_id: res.data.chat_room_id});
          currentSocket.emit('create_community_chat_message', body);
          console.log(body, 'body');
          currentSocket.off('get_community_chat_room_id');
        }
      });
      create_room();
    }
    setMessage('');
  };

  const create_room = () => {
    currentSocket.emit('create_community_chat_room', bodyCreateRoom);
    currentSocket.emit('get_community_chat_room_id', bodyGetRoom);
  };

  const create_flag_item = (tagged) => {
    currentSocket.emit('create_community_chat_message', tagged);
    setTagged(null);
  };

  useEffect(() => {
    if(roomId){
      currentSocket.emit('community_chat_message', {chat_room_id: roomId});
    }
    currentSocket.on('community_chat_message', res => {
      console.log('community_chat_message', res.data);
      if (Array.isArray(res.data)) {
        setDataChat(res.data);
      }
    });
  }, []);

  return (
    <Scaffold
      header={
        <ChatEcommerceHeader
          name={merchant.name}
          merchant={true}
          isOnline={userTarget && userTarget.is_online}
        />
      }>
      <FlatList
        key="Chat"
        keyExtractor={(item, index) => item.toString() + index}
        data={dataChat}
        numColumns={1}
        showsHorizontalScrollIndicator={false}
        style={{backgroundColor: Color.border}}
        contentContainerStyle={{
          marginHorizontal: 8,
          marginVertical: 8,
          paddingBottom: 8,
        }}
        inverted
        renderItem={({item, index}) => {
          if (item.tagged_id) {
            return (
              <>
                <TouchableOpacity
                  onPress={() => {
                    currentSocket.off('community_chat_message');
                    currentSocket.off('community_chat_room detail buyer');
                    navigation.navigate('DetailProduct', {
                      item: {id: +item.tagged_id},
                    });
                  }}
                  style={{
                    paddingHorizontal: 32,
                    paddingVertical: 16,
                    backgroundColor: Color.theme,
                    marginVertical: 8,
                    flexDirection: 'row',
                    borderRadius: 8,
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={{uri: item.tagged_image}}
                      style={{
                        width: 54,
                        aspectRatio: 1,
                        borderRadius: 5,
                        marginRight: 16,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'column',
                        maxWidth: width - 16 - 32 - 48 - 16,
                        justifyContent: 'space-between',
                      }}>
                      <Text size={14} align="left" numberOfLines={2}>
                        {item.tagged_name}
                      </Text>
                      <Divider height={5} />
                      <Text size={14} align="left" type="bold">
                        {FormatMoney.getFormattedMoney(item.tagged_price)}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View
                      style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                      <Ionicons
                        name={'checkmark-done'}
                        size={14}
                        color={Color.placeholder}
                      />
                      <Divider width={2} />
                      <Text
                        size={10}
                        type="medium"
                        color={Color.gray}
                        align="left">
                        {moment(item.created_date).format('HH:mm')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            );
          }

          return (
            <>
              {item.user_id == userTarget.user_id ? (
                <View
                  style={{
                    marginHorizontal: 8,
                    marginVertical: 8,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                  }}>
                  <Image
                    source={
                      targetImage ? {uri: targetImage} : ImagesPath.userChat
                    }
                    style={{
                      width: 36,
                      aspectRatio: 1,
                      borderRadius: 18,
                      marginRight: 8,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: '#FDE4D2',
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      maxWidth: width - 52,
                    }}>
                    <Text size={14} align="left">
                      {item.chat_message}
                    </Text>
                    <Text
                      size={10}
                      type="medium"
                      color={Color.gray}
                      style={{marginTop: 3}}
                      align="left">
                      {moment(item.created_date).format('HH:mm')}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    marginHorizontal: 8,
                    marginVertical: 8,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#FDE4D2',
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      maxWidth: width - 52,
                    }}>
                    <Text size={14} align="left">
                      {item.chat_message}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        marginTop: 3,
                      }}>
                      <Ionicons
                        name={'checkmark-done'}
                        size={14}
                        color={Color.placeholder}
                      />
                      <Divider width={2} />
                      <Text
                        size={10}
                        type="medium"
                        color={Color.gray}
                        align="left">
                        {moment(item.created_date).format('HH:mm')}
                      </Text>
                    </View>
                  </View>
                  <Image
                    source={userImage ? {uri: userImage} : ImagesPath.userChat}
                    style={{
                      width: 36,
                      aspectRatio: 1,
                      borderRadius: 18,
                      marginLeft: 8,
                    }}
                  />
                </View>
              )}
            </>
          );
        }}
      />

      {tagged && (
        <View style={{backgroundColor: Color.border}}>
          <View
            style={{
              paddingHorizontal: 32,
              paddingVertical: 16,
              backgroundColor: Color.theme,
              marginVertical: 8,
              marginHorizontal: 8,
              flexDirection: 'row',
              borderRadius: 8,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{uri: tagged.tagged_image}}
                style={{
                  width: 54,
                  aspectRatio: 1,
                  borderRadius: 5,
                  marginRight: 16,
                }}
              />
              <View
                style={{
                  flexDirection: 'column',
                  maxWidth: width - 16 - 32 - 48 - 16,
                  justifyContent: 'space-between',
                }}>
                <Text size={14} align="left" numberOfLines={2}>
                  {tagged.tagged_name}
                </Text>
                <Divider height={5} />
                <Text size={14} align="left" type="bold">
                  {FormatMoney.getFormattedMoney(tagged.tagged_price)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View>
        <BottomSection style={{borderColor: Color.theme}}>
          <BoxInput style={{borderColor: Color.text, flexDirection: 'row'}}>
            <CustomTextInput
              name="text"
              placeholder="Kirim Pesan.."
              placeholderTextColor={Color.text}
              selectionColor={Color.primary}
              returnKeyType="done"
              returnKeyLabel="Done"
              blurOnSubmit={false}
              error={null}
              multiline
              value={message}
              onChangeText={text => setMessage(text)}
              style={{color: Color.text, marginHorizontal: 20}}
            />
            {/* <Image source={ImagesPath.plusCircleGray} style={{ marginVertical: 12 }} /> */}
          </BoxInput>
          <CircleSend
            onPress={() => create_message()}
            style={{
              backgroundColor: Color.primary,
              marginRight: 5,
              marginBottom: 10,
            }}>
            <Ionicons name="send" color={Color.textInput} size={15} />
          </CircleSend>
        </BottomSection>
      </View>
    </Scaffold>
  );
};

export default ChatDetailBuyer;

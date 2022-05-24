import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, Image } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import { usePopup } from '@src/components';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Entypo from 'react-native-vector-icons/Entypo'

import { Header, ModalListAction, Scaffold, Alert } from 'src/components';
import {currentSocket} from '@src/screens/MainHome/MainHome';

import ChatRoomsScreen from './ChatRoomsScreen';
import ChatGroupScreen from './ChatGroupScreen';

const BottomSection = Styled(View)`
  width: 100%;
  paddingHorizontal: 16px;
  paddingTop: 8px;
  paddingBottom: 4px;
  flexDirection: row;
  alignItems: center;
  borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  width: 100%;
  backgroundColor: #FFFFFF;
  padding: 8px 16px 8px 16px;
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

const initialDataRooms = {
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
    refresh: false,
}
const Chat = ({navigation}) => {
    // state
    const [dataRooms, setDataRooms] = useState(initialDataRooms);
    const [myRoomIds, setMyRoomIds] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const Tab = createMaterialTopTabNavigator();
    const modalListActionRef = useRef();

    // selector
    const user = useSelector(
        state => state['user.auth'].login.user
    )

    // hooks
    const isFocused = useIsFocused();
    const { Color } = useColor();
    const [popupProps, showPopup] = usePopup();

    useEffect(() => {
        currentSocket.on('chat_rooms', (res) => {
          console.log('chat_rooms', res);
          if (Array.isArray(res)) {
            setDataRooms({
                ...dataRooms,
                data: res,
                loading: false,
            });

            let ids = [];
            res.forEach((e) => {
                ids.push(parseInt(e['room_id']));
            })
            setMyRoomIds(ids);
          } else {
            setDataRooms({
                ...dataRooms,
                loading: false,
            });
          }
        });
    }, []);

    useEffect(() => {
        if (isFocused) {
            currentSocket.emit('chat_rooms');
        }
    }, [isFocused]);

    const fetchRoomsDelete = async() => {
        // setIsLoading(true);

        console.log(selectedRoom);

        currentSocket.emit('chat_rooms_delete', { room_id: selectedRoom.room_id });
        currentSocket.on('chat_rooms_delete', (res) => {
            console.log('res rooms delete', res);

            // setIsLoading(false);
            setSelectedRoom();

            showPopup('Berhasil menghapus obrolan', 'success');
            // showPopup('Gagal menghapus obrolan', 'error');
        });
    }

    const getTitle = (member) => {
        let title = '';
        
        if (member.length === 2) {
            member.map((i) => {
                if (i.user_id != user.userId) title = i.first_name;
            });
        } else if (member.length > 2) {
            member.map((i) => {
                if (i.user_id != user.userId) title = '[Grup] ' + i.first_name + ' & ' + member.length + ' lainnya';
            });
        }

        return title;
    }

    const managedDateUTC = (origin) => {
        const date = Moment(origin).utc();
        const now = new Moment();
        const diff = now.diff(Moment(date), 'days');
        
        let title = '';

        if (diff === 0) {
            title = date.format('HH:mm');
        } else if (diff === 1) {
            title = 'Kemarin';
        } else {
            title = date.format('DD/MM/YYYY');
        }
        
        return title;
    }

    const isUserTyping = (typing) => {
        let result = false;
        if (Array.isArray(typing) && typing.length > 0) {
            const idxOf = typing.indexOf(user.userId.toString());
            if (idxOf === -1) result = true;
        }
        return result;
    }
  return (
    <Scaffold
            fallback={dataRooms.loading}
            isLoading={isLoading}
            popupProps={popupProps}
            header={
                <Header
                    title='Obrolan'
                    iconRightButton={
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('CreateGroup', { myRoomIds });
                            }}
                            style={{justifyContent: 'center', alignItems: 'center'}}
                        >
                            <Entypo name='dots-three-vertical' color={Color.text} size={20} />
                        </TouchableOpacity>
                    }
                />
            }
            empty={!dataRooms.loading && dataRooms.data.length === 0}
    >
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
                    
                }}
                
                >
                <Tab.Screen
                    name="Chat"
                    component={ChatRoomsScreen}
                    options={{tabBarLabel: 'Chat'}}
                />
                <Tab.Screen
                    name="Grup"
                    component={ChatGroupScreen}
                    options={{tabBarLabel: 'Grup'}}
                />
                </Tab.Navigator>
    </Scaffold>
  )
}

export default Chat
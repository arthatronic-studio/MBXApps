import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, Image, Pressable } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo'

import { useColor } from '@src/components/Color';
import { usePopup } from '@src/components';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { Header, ModalListAction, Scaffold } from 'src/components';
import ChatRoomsScreen from 'src/screens/Chat/ChatRoomsScreen';
import ChatGroupScreen from 'src/screens/Chat/ChatGroupScreen';
import { currentSocket } from '@src/screens/MainHome/MainHome';

const Chat = ({navigation}) => {
    // state
    const [myRoomIds, setMyRoomIds] = useState([]);
    const [loadingMyRooms, setLoadingMyRooms] = useState(true);

    const Tab = createMaterialTopTabNavigator();
    const modalListActionRef = useRef();

    // hooks
    const isFocused = useIsFocused();
    const { Color } = useColor();
    const [popupProps, showPopup] = usePopup();

    useEffect(() => {
        currentSocket.emit('list_my_room_ids');
        currentSocket.on('list_my_room_ids', (res) => {
            console.log('list_my_room_ids', res);
            setMyRoomIds(res);
            setLoadingMyRooms(false);
        });
    }, []);

    return (
        <Scaffold
            popupProps={popupProps}
            header={
                <Header
                    title='Obrolan'
                    // iconRightButton={
                    //     <TouchableOpacity
                    //         onPress={() => {}}
                    //         style={{justifyContent: 'center', alignItems: 'center'}}
                    //     >
                    //         <Entypo name='dots-three-vertical' color={Color.text} size={20} />
                    //     </TouchableOpacity>
                    // }
                />
            }
            floatingActionButton={
                <Pressable
                    onPress={() => !loadingMyRooms && modalListActionRef.current.open()}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: !loadingMyRooms ? Color.primary : Color.disabled,
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                    }}
                >
                    <AntDesign name={'message1'} size={27} style={{color: Color.textInput}} />
                </Pressable>
            }
        >
            <Tab.Navigator
                initialRouteName={'Chat'}
                tabBarOptions={{
                    indicatorStyle: {
                        backgroundColor: Color.theme,
                        height: '100%'
                    },
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
                    style: {
                        backgroundColor: Color.theme,
                    }
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

            <ModalListAction
                ref={modalListActionRef}
                data={[
                    {
                        id: 1,
                        name: 'Buat Chat Baru',
                        color: Color.text,
                        onPress: () => {
                            navigation.navigate('ChatUserListScreen', { myRoomIds });
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 2,
                        name: 'Buat Grup Baru',
                        color: Color.text,
                        onPress: () => {
                            navigation.navigate('CreateGroup');
                            modalListActionRef.current.close();
                        },
                    },
                ]}
            />
        </Scaffold>
    )
}

export default Chat;
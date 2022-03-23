import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, Image } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import { usePopup } from '@src/components';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { Circle } from '@src/styled';

import { Header, ModalListAction, Scaffold, Alert } from 'src/components';
import {currentSocket} from '@src/screens/MainHome/MainHome';

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

const ChatRoomsScreen = ({ navigation, route }) => {
    // state
    const [dataRooms, setDataRooms] = useState(initialDataRooms);
    const [myRoomIds, setMyRoomIds] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState();
    const [isLoading, setIsLoading] = useState(false);

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

    const isNotRead = (arr) => {
        let result = false;
        if (!arr) return result;
        
        const read = arr.filter((e) => e == user.userId)[0];
        if (read) result = false;
        else result = true;

        return result;
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
                                navigation.navigate('ChatUserListScreen', { myRoomIds });
                            }}
                            style={{justifyContent: 'center', alignItems: 'center'}}
                        >
                            <Ionicons name='add' color={Color.text} size={30} />
                        </TouchableOpacity>
                    }
                />
            }
            empty={!dataRooms.loading && dataRooms.data.length === 0}
        >
            {/* <BottomSection style={{borderColor: Color.border}}>
                <BoxInput style={true ? {borderColor: Color.border} : {borderColor: Color.error}}>
                    <TextInputNumber
                        name="text"
                        placeholder='Masukan teks..'
                        returnKeyType="done"
                        returnKeyLabel="Done"
                        blurOnSubmit={false}
                        onBlur={() => {}}
                        error={null}
                        onChangeText={(text) => {
                            // this.setState({ prepaidNumber }, () => this.validateTypingNumber(prepaidNumber, 'prepaid') );
                            // this.isValueErrorPrepaid('prepaidNumber')
                        }}
                    />
                    <CircleSend style={{backgroundColor: Color.primary}}>
                        <Ionicons name='search' size={16} color={Color.text} />
                    </CircleSend>
                </BoxInput>
            </BottomSection> */}

            <FlatList
                keyExtractor={(item, index) => item.id.toString() + index.toString()}
                data={dataRooms.data}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{paddingTop: 8}}
                onEndReachedThreshold={0.3}
                onEndReached={() => {}}
                renderItem={({ item }) => {
                    const isSelected = selectedRoom && selectedRoom.id === item.id;

                    // console.log('item', item);

                    return (
                        <TouchableOpacity
                            onPress={() => {
                                let targetIds = [];
                                item.member.map((e) => {
                                    if (e['user_id'] != user.userId) targetIds.push(e['user_id']);
                                });

                                navigation.navigate('ChatDetailScreen', {
                                    roomId: item.room_id,
                                    roomName: getTitle(item.member),
                                    selected: item.member,
                                    targetIds,
                                });
                            }}
                            onLongPress={() => {
                                modalListActionRef.current.open();
                                setSelectedRoom(item);
                            }}
                            style={{
                                height: 60,
                                paddingHorizontal: 16,
                                marginBottom: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: isSelected ? Color.primarySoft : Color.textInput,
                            }}
                        >
                            <View style={{width: '12%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                <Image
                                    source={{uri: item.image}}
                                    style={{width: '100%', aspectRatio: 1, borderRadius: 30, backgroundColor: Color.border}}
                                />
                            </View>
                            <View style={{width: '70%', height: '100%', alignItems: 'flex-start', justifyContent: 'space-around', paddingLeft: 8, paddingRight: 16, paddingVertical: 4}}>
                                <Text
                                    type='semibold'
                                    numberOfLines={1}
                                >
                                    {item.name || getTitle(item.member)}
                                </Text>
                                <Text
                                    type={isUserTyping(item.typing) ? 'italic' : isNotRead(item.read) ? 'bold' : 'regular'}
                                    numberOfLines={1}
                                    color={isUserTyping(item.typing) ? Color.success : Color.text}
                                    style={{opacity: 0.6}}
                                >
                                    {item.last_chat && item.last_chat.user_id == user.userId ? 'Terkirim: ' : 'Diterima: '}
                                    {isUserTyping(item.typing) ? 'Sedang mengetik...' : item.last_chat ? item.last_chat.message : ''}
                                </Text>
                            </View>
                            <View style={{width: '18%', height: '100%', alignItems: 'flex-end', justifyContent: 'space-around', paddingVertical: 4}}>
                                <Text
                                    size={8}
                                >
                                    {item.last_chat ? managedDateUTC(item.last_chat.created_unix_date) : ''}
                                </Text>
                                <Circle
                                    size={10}
                                    color={isNotRead(item.read) ? Color.error : 'transparent'}
                                >
                                    {/* {isNotRead(item.read) && item.lastChatCount > 0 && <Text size={8}>{item.lastChatCount}</Text>} */}
                                </Circle>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />

            <ModalListAction
                ref={modalListActionRef}
                onClose={() => {
                    setSelectedRoom();
                }}
                data={[
                    {
                        id: 0,
                        name: 'Hapus',
                        color: Color.red,
                        onPress: () => {
                            Alert('Hapus', 'Apakah Anda yakin menghapus konten?', () => {
                                fetchRoomsDelete();
                            });
                            modalListActionRef.current.close();
                            setSelectedRoom();
                        },
                    }
                ]}
            />
        </Scaffold>
    )
}

export default ChatRoomsScreen;
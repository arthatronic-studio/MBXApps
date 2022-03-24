import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, Image, useWindowDimensions, AppState } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Header from '@src/components/Header';
import { usePopup } from '@src/components/Modal/Popup';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Scaffold from '@src/components/Scaffold';

import Client from '@src/lib/apollo';
import { queryContentChatRoomManage, queryContentChatMessage } from '@src/lib/query';
import { Divider } from 'src/styled';
import { currentSocket } from '@src/screens/MainHome/MainHome';

const BottomSection = Styled(View)`
  width: 100%;
  padding: 16px;
  borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  width: 100%;
  minHeight: 48px;
  padding: 0px 42px 0px 16px;
  borderRadius: 8px;
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
  width: 30px;
  height: 30px;
  borderRadius: 15px;
  justifyContent: center;
  alignItems: center;
`;

const ChatDetailScreen = ({ navigation, route }) => {
    // params
    const { params } = route;

    // selector
    const user = useSelector(
        state => state['user.auth'].login.user
    )

    // state
    const [textComment, setTextComment] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [roomId, setRoomId] = useState(params.roomId);
    const [dataChat, setDataChat] = useState({
        data: [],
        loading: false,
        page: 0,
        loadNext: false,
    });
    const [userTyping, setUserTyping] = useState(false);

    let isInitial = useRef(true);
    let newDataIn = useRef([]);
    
    // hooks
    const [popupProps, showPopup] = usePopup();
    const { width } = useWindowDimensions();
    const { Color } = useColor();

    useEffect(() => {
        if (roomId) {
            currentSocket.emit('chat_messages', { room_id: roomId });
            currentSocket.on('chat_messages', (res) => {
                console.log('chat_messages', res);

                if (Array.isArray(res)) {
                    setDataChat({
                        ...dataChat,
                        data: res
                    });
                }
            });
        }
    }, [roomId]);

    // handle appstate
    useEffect(() => {
        const subAppState = AppState.addEventListener('change', handleChange);  

        return () => {
            if (typeof subAppState === 'function') subAppState();
        }
    }, []);

    const handleChange = (state) => {
        if (state !== 'active') {
            // UpdateTyping to false
        }
    }

    console.log('params', params);

    // handdle user is typing
    useEffect(() => {
        const typing = isTyping ?
            setTimeout(() => {
                setIsTyping(false);
                // UpdateTyping to false;
            }, 3000) : null;
        
        return () => {
            clearTimeout(typing);
        };
    }, [isTyping]);

    const fetchContentChatRoomManage = () => {
        let userId = [user.userId];

        params.selected.map((e) => {
            userId.push(e.userId);
        });

        const variables = {
            method: 'INSERT',
            type: params.selected.length > 1 ? 'GROUP' : 'PERSONAL',
            userId,
        };

        console.log(variables);
        
        Client.query({
            query: queryContentChatRoomManage,
            variables,
        })
        .then((res) => {
            console.log('res create room', res);

            const data = res.data.contentChatRoomManage;

            if (data) {
                setRoomId(data.id);
                onSendChat(data.id);
            }
        })
        .catch((err) => {
            console.log(err, 'err send chat');
        });
    }

    const onSubmit = () => {
        if (textComment === '') {
            showPopup('Teks tidak boleh kosong', 'warning');
            return;
        }

        if (!roomId) {
            fetchContentChatRoomManage();
        } else {
            onSendChat(roomId);
        }
    }
    
    const onSendChat = (room_id) => {
        const variables = {
            method: 'INSERT',
            message: textComment.trim(),
            roomId: parseInt(room_id)
        };

        console.log('variables', variables);

        Client.query({
            query: queryContentChatMessage,
            variables,
        })
        .then((res) => {
            console.log('res kirim chat', res);

            const data = res.data.contentChatMessage;
            if (data) {
                currentSocket.emit('chat_room_notifier', { room_id, users_ids: params.targetIds });
                currentSocket.on('chat_room_notifier', (res) => {
                    // console.log('chat_room_notifier', res);
                });

                currentSocket.emit('chat_messages', { room_id });
                currentSocket.emit('chat_rooms');
                setTextComment('');
            }
        })
        .catch((err) => {
            console.log('err kirim chat', err);
            showPopup('Chat gagal dikirim, silakan coba lagi', 'error');
        });
    }

    const managedDateUTC = (origin) => {
        const date = Moment(origin).utc();
        const now = new Moment();
        const diff = now.diff(Moment(date), 'days');

        let title = '';

        if (diff === 0) {
            title = 'Hari ini - ' + date.format('HH:mm');
        } else if (diff === 1) {
            title = 'Kemarin - ' + date.format('HH:mm');
        } else {
            title = date.format('dddd, DD/MM/YYYY - HH:mm');;
        }
        
        return title;
    }
    
    return (
        <Scaffold
            fallback={dataChat.loading}
            popupProps={popupProps}
            color={Color.semiwhite}
            header={
                <Header
                    title={params.roomName}
                    subTitle={userTyping && 'sedang mengetik...'}
                    subTitleColor={userTyping && Color.success}
                    centerTitle
                    iconRightButton={
                        <Ionicons
                            name='information-circle-outline'
                            size={22}
                            color={Color.text}
                            onPress={() => navigation.navigate('ChatInfoScreen', { member: params.selected })}
                        />
                    }
                />
            }
        >
            <FlatList
                keyExtractor={(item, index) => item.id + index.toString()}
                data={dataChat.data}
                inverted
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{paddingTop: 16}}
                onEndReachedThreshold={0.3}
                onEndReached={() => dataChat.page !== -1 && setDataChat({ ...dataChat, loadNext: true })}
                renderItem={({ item }) => {
                    // const isAdmin = user && user.userId === item.userId;
                    const isMe = user.userId == item.user_id;

                    if (isMe) {
                        return (
                            <View style={{width, marginTop: 16, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                <View style={{maxWidth: width - 70, paddingHorizontal: 8, paddingVertical: 8, backgroundColor: Color.textInput, borderRadius: 8, borderBottomRightRadius: 0, alignItems: 'flex-end'}}>
                                    <Text size={10} type='semibold' align='right' color={Color.secondary}>{item.name}</Text>
                                    <Divider height={4} />
                                    <Text align='right'>{item.message}</Text>
                                    <Divider height={4} />
                                    <Text size={8} align='right' style={{opacity: 0.6}}>{managedDateUTC(item.created_unix_date)}</Text>
                                </View>
                                <View style={{width: 30, height: 30, marginLeft: 8, borderRadius: 15, borderWidth: 2, borderColor: Color.disabled}}>
                                    <Image
                                        source={{uri: item.image}}
                                        style={{width: '100%', aspectRatio: 1, borderRadius: 30, backgroundColor: Color.disabled}}
                                    />
                                </View>
                            </View>
                        )
                    }

                    return (
                        <View style={{width, marginTop: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View style={{width: 30, height: 30, marginRight: 8, borderRadius: 15, borderWidth: 2, borderColor: Color.primary}}>
                            <Image
                                source={{uri: item.image}}
                                style={{width: '100%', aspectRatio: 1, borderRadius: 15, backgroundColor: Color.primary}}
                            />
                            </View>
                            <View style={{maxWidth: width - 70, paddingHorizontal: 8, paddingVertical: 8, backgroundColor: Color.primarySoft, borderRadius: 8, borderBottomLeftRadius: 0, alignItems: 'flex-start'}}>
                                <Text size={10} type='semibold' align='left' color={Color.primary}>{item.name}</Text>
                                <Divider height={4} />
                                <Text align='left' color={Color.text}>{item.message}</Text>
                                <Divider height={4} />
                                <Text size={8} align='left' color={Color.text} style={{opacity: 0.6}}>{managedDateUTC(item.created_unix_date)}</Text>
                            </View>
                        </View>
                    )
                }}
            />

            <BottomSection style={{borderColor: Color.theme}}>
                <BoxInput style={{borderColor: Color.text}}>
                    <CustomTextInput
                        name="text"
                        placeholder='Masukan teks...'
                        placeholderTextColor={Color.text}
                        selectionColor={Color.primary}
                        returnKeyType="done"
                        returnKeyLabel="Done"
                        blurOnSubmit={false}
                        onBlur={() => {}}
                        error={null}
                        multiline
                        value={textComment}
                        onChangeText={(text) => {
                            if (isTyping === false && text.length > textComment.length) {
                                setIsTyping(true);
                                // UpdateTyping to true
                            }

                            setTextComment(text);
                        }}
                        style={{color: Color.text}}
                    />

                    <CircleSend
                        onPress={() => onSubmit()}
                        style={{backgroundColor: Color.primary}}
                    >
                        <Ionicons name='send' color={Color.textInput} />
                    </CircleSend>
                </BoxInput>
            </BottomSection>
        </Scaffold>
    )
}

export default ChatDetailScreen;
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, Image, useWindowDimensions, AppState } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Header from '@src/components/Header';
import {ModalListAction } from 'src/components';
import { usePopup } from '@src/components/Modal/Popup';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Scaffold from '@src/components/Scaffold';
import Entypo from 'react-native-vector-icons/Entypo'
import Client from '@src/lib/apollo';
import { queryContentChatRoomManage, queryContentChatMessage } from '@src/lib/query';
import { Divider } from 'src/styled';
import { currentSocket } from '@src/screens/MainHome/MainHome';
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';

const BottomSection = Styled(View)`
  width: 100%;
  padding: 16px;
  borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  width: 88%;
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
  width: 40px;
  height: 40px;
  borderRadius: 25px;
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
    const [showSection, setShowSection] = useState(true);
    const [dataChat, setDataChat] = useState({
        data: [],
        loading: false,
        page: 0,
        loadNext: false,
    });
    const [userTyping, setUserTyping] = useState(false);
    const [modalImagePicker, setModalImagePicker] = useState(false);

    const modalListActionRef = useRef();
    
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

    const onSubmit = (imageBase64) => {
        if (!imageBase64 && textComment === '') {
            showPopup('Teks tidak boleh kosong', 'warning');
            return;
        }

        if (!roomId) {
            fetchContentChatRoomManage();
        } else {
            onSendChat(roomId, imageBase64);
        }
    }
    
    const DetailHeader = () => {
        return (
          <View style={{backgroundColor: Color.theme, alignItems: 'center',width: '100%', height: 60, flexDirection: 'row'}}>
              <AntDesign onPress={() => navigation.goBack()} name={"arrowleft"} size={20} style={{marginHorizontal: 15}}/>
              <View style={{width: '78%'}}>
                <Text style={{fontWeight: 'bold', fontSize: 16, textAlign: 'left', marginVertical: 1}}>{params.roomName}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{marginHorizontal: 3,backgroundColor: Color.green, width: 6, borderRadius: 20, height: 6}}/>
                    {userTyping ? userTyping && 'sedang mengetik . . .' : <Text style={{fontSize: 8, color: Color.secondary}}>Online</Text>}
                </View>
              </View>
              <Entypo onPress={() => {
                                setShowSection(!showSection)
                                modalListActionRef.current.open();
                            }} name={"dots-three-vertical"} size={18}/>
          </View>
        )
      }

    const onSendChat = (room_id, imageBase64) => {
        const variables = {
            method: 'INSERT',
            message: textComment.trim(),
            roomId: parseInt(room_id)
        };

        if (imageBase64) {
            variables.image = 'data:image/png;base64,' + imageBase64;
        }

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
            headerTitle={params.roomName}
            // hide online
            // header={
            //     <DetailHeader/> 
            // }
        >
            {/* hide tgl */}
            {/* <View style={{backgroundColor: Color.border, width: '35%', height: 25, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginVertical: 15, alignSelf: 'center'}}>
                <Text style={{fontSize: 10, color: Color.secondary, fontWeight: 'bold'}}>Senin, 03 Januari 2022</Text>
            </View> */}
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

                    //Sender Chat
                    if (isMe) {
                        return (
                            <View style={{width, marginTop: 16 ,paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                <View style={{maxWidth: width - 70, paddingHorizontal: 8, paddingVertical: 8, backgroundColor: Color.textInput, borderRadius: 8, borderBottomRightRadius: 0, alignItems: 'flex-end'}}>
                                    {/* <Text size={10} type='semibold' align='right' color={Color.secondary}>{item.name}</Text> */}
                                    <Image
                                        source={{uri: item.image}}
                                        style={{
                                            width: width / 2,
                                            height: width / 2,
                                        }}
                                    />
                                    <Divider height={4} />
                                    <Text align='right'>{item.message}</Text>
                                    <Divider height={4} />
                                    <View style={{flexDirection: 'row'}}>
                                        <Ionicons name={"md-checkmark-done-sharp"} size={12}/>
                                        <Text size={8} align='right' style={{opacity: 0.6}}>  {managedDateUTC(item.created_unix_date)}</Text>
                                    </View>
                                    
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

                    // Receiver Chat
                    return (
                        <View style={{width, marginTop: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View style={{width: 30, height: 30, marginRight: 8, borderRadius: 15, borderWidth: 2, borderColor: Color.disabled}}>
                                <Image
                                    source={{uri: item.image}}
                                    style={{width: '100%', aspectRatio: 1, borderRadius: 15, backgroundColor: Color.disabled}}
                                />
                            </View>
                            <View style={{maxWidth: width - 70, paddingHorizontal: 8, paddingVertical: 8, backgroundColor: Color.textInput, borderRadius: 8, borderBottomLeftRadius: 0, alignItems: 'flex-start'}}>
                                {/* <Text size={10} type='semibold' align='left' color={Color.primary}>{item.name}</Text> */}
                                <Divider height={4} />
                                <Text align='left' color={Color.text}>{item.message}</Text>
                                <Divider height={4} />
                                <Text size={8} align='left' color={Color.text} style={{opacity: 0.6}}>{managedDateUTC(item.created_unix_date)}</Text>
                            </View>
                        </View>
                    )
                }}
            />

            {showSection == true ? 
            <BottomSection style={{flexDirection: 'row', alignItems: 'center',backgroundColor: Color.theme, borderColor: Color.theme, elevation: 5}}>
                <BoxInput style={{alignItems: 'center',borderColor: Color.secondary, borderRadius: 30, flexDirection: 'row'}}>
                    <CustomTextInput
                        name="text"
                        placeholder='Kirim Pesan ...'
                        placeholderTextColor={Color.secondary}
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
                    
                    <AntDesign
                        name={"pluscircleo"}
                        size={18}
                        color={Color.secondary}
                        style={{right: -10}}
                        onPress={() => setModalImagePicker(true)}
                    />
                </BoxInput>
                <CircleSend
                        onPress={() => onSubmit()}
                        style={{backgroundColor: Color.primary, marginHorizontal: 8}}
                    >
                        <Ionicons name='send' color={Color.textInput} size={16}/>
                </CircleSend>
            </BottomSection>
            : null}

            <ModalImagePicker
                visible={modalImagePicker}
                onClose={() => setModalImagePicker(false)}
                onSelected={(callback) => {
                    onSubmit(callback.base64);
                    setModalImagePicker(false);
                }}
            />

            <ModalListAction
                onClose={() => setShowSection(!showSection)}
                ref={modalListActionRef}
                data={[
                    {
                        id: 0,
                        name: 'Cari',
                        color: Color.text,
                        onPress: () => {
                            setShowSection(!showSection)
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 1,
                        name: 'Matikan pemberitahuan',
                        color: Color.text,
                        onPress: () => {
                            setShowSection(!showSection)
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 2,
                        name: 'Bersihkan obrolan',
                        color: Color.text,
                        onPress: () => {
                            setShowSection(!showSection)
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 3,
                        name: 'Report',
                        color: Color.red,
                        onPress: () => {
                            setShowSection(!showSection)
                            modalListActionRef.current.close();
                        },
                    },
                ]}
            />
        </Scaffold>
    )
}

export default ChatDetailScreen;
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, Image, useWindowDimensions, AppState } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Header from '@src/components/Header';
import { usePopup } from '@src/components/Modal/Popup';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Scaffold from '@src/components/Scaffold';

import Client from '@src/lib/apollo';
import { queryContentChatRoomManage, queryContentChatRoomDetail, queryContentChatMessage } from '@src/lib/query';
import { Divider } from 'src/styled';

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
        loading: true,
        page: 0,
        loadNext: false,
    });
    const [firebaseData, setFirebaseData] = useState([]);
    const [firebaseChatDocId, setFirebaseChatDocId] = useState('');
    const [firebaseNotiferDocId, setFirebaseNotifierDocId] = useState('');
    const [firebaseNotiferLastChatCount, setFirebaseNotifierLastChatCount] = useState(0);
    const [userTyping, setUserTyping] = useState(false);

    let isInitial = useRef(true);
    let newDataIn = useRef([]);
    
    // hooks
    const [popupProps, showPopup] = usePopup();
    const { width } = useWindowDimensions();
    const { Color } = useColor();

    // handle appstate
    useEffect(() => {
        const subAppState = AppState.addEventListener('change', handleChange);  

        return () => {
            subAppState();
        }
    }, []);

    const handleChange = (state) => {
        if (state !== 'active') {
            firestoreUpdateTyping(false);
        }
    }

    // realtime chat
    useEffect(() => {
        const subscriber = firestore()
            .collection('contentChatRoomDetail')
            .orderBy('id', 'desc')
            .where('roomId', '==', roomId)
            .limit(1)
            .onSnapshot((res) => {
                if (res) {
                    let docID = '';
                    if (res.docs.length > 0) {
                        console.log('res contentChatRoomDetail',res.docs[0].data());
                        docID = res.docs[0].ref.path.split('/')[1];
                    } else {
                        console.log('res contentChatRoomDetail',res.docs);
                    }

                    setFirebaseChatDocId(docID);

                    if (isInitial.current === false && res.docs.length > 0) {
                        const item = res.docs[0].data();
                        const data = [item].concat(newDataIn.current);
                        
                        newDataIn.current = data;
                        setFirebaseData(data);
                    } else {
                        isInitial.current = false;
                    }
                }
            }, (error) => {
                console.log(error)
            });
    
        return () => subscriber();
    }, [roomId]);

    // realtime notifier
    useEffect(() => {
        const subscriber = firestore()
            .collection('contentChatNotifier')
            .orderBy('id', 'desc')
            .where('member', 'array-contains-any', [user.userId.toString()])
            .where('roomId', '==', roomId)
            .limit(1)
            .onSnapshot((res) => {
                if (res) {
                    let result = false;
                    let data = { typing: [] };
                    
                    if (res.docs.length > 0) {
                        console.log('res contentChatNotifier', res.docs[0].data());
                        data = res.docs[0].data();
                    } else {
                        console.log('res contentChatNotifier', res.docs);
                    }
                    
                    if (Array.isArray(data.typing) && data.typing.length > 0) {
                        const idxOf = data.typing.indexOf(user.userId.toString());
                        if (idxOf === -1) result = true;
                    }

                    setUserTyping(result);
                    
                    firestoreReadChat(res);
                }
            }, (error) => {
                console.log(error);
            });

        return () => subscriber();
    }, [roomId]);

    // handdle user is typing
    useEffect(() => {
        const typing = isTyping ?
            setTimeout(() => {
                setIsTyping(false);
                firestoreUpdateTyping(false);
            }, 3000) : null;
        
        return () => {
            clearTimeout(typing);
        };
    }, [isTyping]);

    // change user typing
    const firestoreUpdateTyping = (is) => {
        if (firebaseNotiferDocId !== '') {
            firestore()
                .collection('contentChatNotifier')
                .doc(firebaseNotiferDocId)
                .update({ typing: is ? [user.userId.toString()] : [] })
                .then((res) => {})
                .catch((err) => console.log(err, 'err'));
        }
    };

    // insert/update chat
    const firestoreSubmitChat = (item) => {
        const values = {
            id: item.id || '',
            message: item.message || '',
            messageDate: item.messageDate || '',
            name: item.name || '',
            roomId: item.roomId || '',
            userId: item.userId || '',
            isNewArrival: true,
        };

        if (firebaseChatDocId !== '') {
            firestore()
                .collection('contentChatRoomDetail')
                .doc(firebaseChatDocId)
                .update(values)
                .then((res) => {})
                .catch((err) => console.log(err, 'err'));
        } else {
            firestore()
                .collection('contentChatRoomDetail')
                .add(values)
                .then(() => {})
                .catch((err) => console.log(err, 'err'));
        }
    };

    // insert/update notifier
    const firestoreSubmitNotifier = (item, member, memberDetail) => {
        const values = {
            id: item.id || '',
            name: member.length > 1 ? '' : user.firstName + ' ' + user.lastName,
            type: item.type || '',
            roomId: item.roomId || '',
            roomDate: item.roomDate || '',
            member,
            memberDetail,
            read: [user.userId.toString()],
            lastChat: {
                message: item.message || '',
                messageDate: item.messageDate || '',
            },
            lastChatCount: firebaseNotiferLastChatCount + 1,
            typing: [],
            isNewArrival: true,
        };

        if (firebaseNotiferDocId !== '') {
            firestore()
            .collection('contentChatNotifier')
            .doc(firebaseNotiferDocId)
            .update(values)
            .catch((err) => console.log(err, 'err'));
        } else {
            firestore()
            .collection('contentChatNotifier')
            .add(values)
            .catch((err) => console.log(err, 'err'));
        }
    };

    const firestoreReadChat = (res) => {
        let docID = '';
        let lastChatCount = 0;
        let readArr = [];

        if (res && res.docs.length > 0) {
            docID = res.docs[0].ref.path.split('/')[1];
            lastChatCount = res.docs[0].data().lastChatCount;
            readArr = res.docs[0].data().read;
        }

        if (readArr && Array.isArray(readArr)) {
            const hasRead = readArr.indexOf(user.userId.toString());
            if (hasRead === -1) {
                readArr.push(user.userId.toString());
            }
        }

        setFirebaseNotifierDocId(docID);
        if (lastChatCount) setFirebaseNotifierLastChatCount(lastChatCount);

        if (docID !== '') {
            firestore()
                .collection('contentChatNotifier')
                .doc(docID)
                .update({ read: readArr })
                .catch((err) => console.log(err, 'err'));
        }
    }

    useEffect(() => {
        if (dataChat.page !== -1) {
            if (roomId) {
                fetchContentChatRoomDetail(roomId);
            } else {
                fetchContentChatRoomManage();
            }
        }
    }, [dataChat.loadNext]);

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
                fetchContentChatRoomDetail(data.id);
                setRoomId(data.id);
            }
        })
        .catch((err) => {
            console.log(err, 'err send chat');
        });
    }

    const fetchContentChatRoomDetail = (roomId) => {
        const variables = {
            roomId,
            page: 1 + dataChat.page,
            itemPerPage: 50,
        };

        console.log(variables);

        Client.query({
            query: queryContentChatRoomDetail,
            variables,
        })
        .then((res) => {
            const data = res.data.contentChatRoomDetail;

            const newData = dataChat.data.concat(data);
            
            if (data) {
                setDataChat({
                    ...dataChat,
                    loading: false,
                    data: newData,
                    page: data.length === 50 ? dataChat.page + 1 : -1,
                    loadNext: false,
                });
            }
        })
        .catch((err) => {
            console.log(err, 'chat room err');

            setDataChat({
                ...dataChat,
                loading: false,
                page: -1,
                loadNext: false,
            });
        })
    }
    
    const onSendChat = () => {
        if (textComment === '') {
            showPopup('Teks komentar tidak boleh kosong', 'warning');
            return;
        }

        if (!roomId) {
            showPopup('Silakan coba lagi', 'warning');
            return;
        }

        const variables = {
            method: 'INSERT',
            roomId,
            message: textComment.trim(),
        };

        let member = params.isNewArrival ? [] : [user.userId.toString()];
        let memberDetail = params.isNewArrival ? [] : [{ userId: user.userId.toString(), fullname: user.firstName + ' ' + user.lastName }];

        params.selected.map((iMember) => {
            member.push(iMember.userId.toString());
            memberDetail.push({
                userId: iMember.userId.toString(),
                fullname: iMember.fullname || iMember.firstName + ' ' + iMember.lastName,
            });
        });

        console.log('variables', variables);

        Client.query({
            query: queryContentChatMessage,
            variables,
        })
        .then((res) => {
            console.log('res kirim chat', res);

            const data = res.data.contentChatMessage;
            setTextComment('');

            firestoreSubmitChat(data);
            firestoreSubmitNotifier(data, member, memberDetail);
        })
        .catch((err) => {
            console.log('err kirim chat', err);
            showPopup('Chat gagal dikirim, silakan coba lagi', 'error');
        });
    }
    
    const getTitle = () => {
        let title = '';

        if (params.isNewArrival) {
            if (params.selected.length <= 2) {
                params.selected.map((i) => {
                    if (i.userId != user.userId) title = i.firstName || i.fullname;
                });
            } else if (params.selected.length > 2) {
                params.selected.map((i) => {
                    if (i.userId != user.userId) title = '[Grup] ' + (i.firstName || i.fullname) + ' & ' + (params.selected.length - 1) + ' lainnya'; 
                });
            }
        }
        else {
            if (params.selected.length === 1) {
                params.selected.map((i) => {
                    if (i.userId != user.userId) title = i.firstName || i.fullname;
                });
            } else if (params.selected.length > 1) {
                params.selected.map((i) => {
                    if (i.userId != user.userId) title = '[Grup] ' + i.firstName + ' & ' + params.selected.length + ' lainnya';
                });
            }
        }

        return title;
    }

    const getDate = (d) => {
        const origin = parseInt(d);
        const date = Moment(origin).format('YYYY-MM-DD');
        const now = new Moment();
        const diff = now.diff(Moment(date), 'days');
        let title = '';

        if (diff === 0) {
            title = 'Hari ini - ' + Moment(origin).format('HH:mm');
        } else if (diff === 1) {
            title = 'Kemarin - ' + Moment(origin).format('HH:mm');
        } else {
            title = Moment(origin).format('dddd, DD/MM/YYYY - HH:mm');;
        }
        
        return title;
    }

    const compareData = () => {
        const arr = firebaseData.concat(dataChat.data);
        let obj = {};
        let newData = [];

        for ( let i=0; i < arr.length; i++ ) {
            obj[arr[i]['id']] = arr[i];
        }
        
        for ( let key in obj ) {
            newData.push(obj[key]);
        }

        return newData;
    }
    
    return (
        <Scaffold
            fallback={dataChat.loading}
            popupProps={popupProps}
            color={Color.semiwhite}
            header={
                <Header
                    title={getTitle()}
                    subTitle={userTyping && 'sedang mengetik...'}
                    subTitleColor={userTyping && Color.success}
                    centerTitle
                    iconRightButton={
                        <Ionicons
                            name='information-circle-outline'
                            size={22}
                            color={Color.text}
                            onPress={() => navigation.navigate('ChatInfoScreen', { member: params.selected, isNewArrival: params.isNewArrival })}
                        />
                    }
                />
            }
        >
            <FlatList
                keyExtractor={(item, index) => item.id + index.toString()}
                data={compareData().reverse()}
                inverted
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{paddingTop: 16}}
                onEndReachedThreshold={0.3}
                onEndReached={() => dataChat.page !== -1 && setDataChat({ ...dataChat, loadNext: true })}
                renderItem={({ item }) => {
                    const isAdmin = user && user.userId === item.userId;

                    if (isAdmin) {
                        return (
                            <View style={{width, marginTop: 16, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                <View style={{maxWidth: width - 70, paddingHorizontal: 8, paddingVertical: 8, backgroundColor: Color.textInput, borderRadius: 8, borderBottomRightRadius: 0, alignItems: 'flex-end'}}>
                                    <Text size={10} type='semibold' align='right' color={Color.secondary}>{item.name}</Text>
                                    <Divider height={4} />
                                    <Text align='right'>{item.message}</Text>
                                    <Divider height={4} />
                                    <Text size={8} align='right' style={{opacity: 0.6}}>{getDate(item.messageDate)}</Text>
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
                                <Text size={8} align='left' color={Color.text} style={{opacity: 0.6}}>{getDate(item.messageDate)}</Text>
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
                                firestoreUpdateTyping(true);
                            }

                            setTextComment(text);
                        }}
                        style={{color: Color.text}}
                    />

                    <CircleSend
                        onPress={() => onSendChat()}
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
import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, Image } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import ScreenEmptyData from '@src/components/Modal/ScreenEmptyData';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { Circle } from '@src/styled';

import Client from '@src/lib/apollo';
import { queryContentChatRooms } from '@src/lib/query';
import { Scaffold } from 'src/components';

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

const ChatRoomsScreen = ({ navigation, route }) => {
    // state
    const [dataRooms, setDataRooms] = useState({
        data: [],
        loading: true,
        page: 0,
        loadNext: false,
    });
    const [firebaseData, setFirebaseData] = useState([]);

    // selector
    const user = useSelector(
        state => state['user.auth'].login.user
    )

    // hooks
    const isFocused = useIsFocused();
    const { Color } = useColor();

    useEffect(() => {
        if (!isFocused) {
        //   setFirebaseData([]);
        }
    }, [isFocused]);

    useEffect(() => {
        const subscriber = firestore()
            .collection('contentChatNotifier')
            .orderBy('id', 'desc')
            .where('member', 'array-contains-any', [user.userId.toString()])
            .where('isNewArrival', '==', true)
            // .limit(1)
            .onSnapshot((res) => {
                if (res) {
                    if (res.docs.length > 0) {
                        let newData = [];
                        res.docs.map((doc) => {
                            newData.push(doc.data());
                        });
                        console.log('newData chat notifier', newData);
                        setFirebaseData(newData);
                    }
                }
            }, (error) => {
                console.log(error);
            });
    
        return () => subscriber();
    }, []);

    useEffect(() => {
        if (dataRooms.page !== -1) {
            fetchContentChatRooms();
        }
    }, [dataRooms.loadNext]);

    const fetchContentChatRooms = () => {
        const variables = {
            page: dataRooms.page + 1,
            itemPerPage: 50,
        };

        Client.query({
            query: queryContentChatRooms,
            variables,
        })
        .then((res) => {
            console.log('res chat rooms', res);

            const data = res.data.contentChatRooms;
            
            let newData = dataRooms.data;
            let newPage = dataRooms.page;

            if (data && Array.isArray(data)) {
                newData = newData.concat(data);
                newPage = data.length === 50 ? dataRooms.page + 1 : -1;
            }
            
            setStateDataRooms({
                data: newData,
                loading: false,
                page: newPage,
                loadNext: false,
            });
        })
        .catch((err) => {
            console.log(err, 'err');
            setStateDataRooms({
                loading: false,
                page: -1,
                loadNext: false,
            });
        })
    }

    const setStateDataRooms = (obj) => {
        setDataRooms({ ...dataRooms, ...obj });
    }

    const getTitle = (member) => {
        let title = '';
        if (member.length === 1) {
            title = member[0].firstName;
        }
        else {
            if (member.length === 1) {
                member.map((i) => {
                    if (i.userId != user.userId) title = i.firstName || i.fullname;
                });
            } else if (member.length > 1) {
                member.map((i) => {
                    if (i.userId != user.userId) title = '[Grup] ' + i.firstName + ' & ' + member.length + ' lainnya';
                });
            }
        }

        return title;
    }

    const getTitleFirebaseData = (member) => {
        let title = '';
        
        if (member.length <= 2) {
            member.map((i) => {
                if (i.userId != user.userId) title = i.firstName || i.fullname;
            });
        }
        else if (member.length > 2) {
            member.map((i) => {
                if (i.userId != user.userId) title = '[Grup] ' + (i.firstName || i.fullname) + ' & ' + (member.length - 1) + ' lainnya'; 
            });
        }

        return title;
    }

    const managedDate = (d) => {
        const origin = parseInt(d);
        const date = Moment(origin).format('YYYY-MM-DD');
        const now = new Moment();
        const diff = now.diff(Moment(date), 'days');
        let title = '';

        if (diff === 0) {
            title = Moment(origin).format('HH:mm');
        } else if (diff === 1) {
            title = 'Kemarin';
        } else {
            title = Moment(origin).format('DD/MM/YYYY');;
        }
        
        return title;
    }

    const sortData = () => {
        let data = dataRooms.data;
        let newData = [];

        data.map((i) => {
            const selected = firebaseData.filter((e) => e.roomId === i.roomId)[0];
            if (selected) {
            } else {
                newData.push(i);
            }
        });
        return firebaseData.concat(newData);
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

    if (dataRooms.data.length === 0) {
        return (
            <Scaffold
                headerTitle='Chat'
                fallback={dataRooms.loading}
            >
                <ScreenEmptyData transparent message='Kamu belum memiliki riwayat chat' />
                <TouchableOpacity onPress={() => navigation.navigate('ChatUserListScreen')} style={{height: 50, width: 50, borderRadius: 25, position: 'absolute', bottom: 16, right: 16, backgroundColor: Color.secondary, justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons name='add' color={Color.text} size={30} />
                </TouchableOpacity>
            </Scaffold>
        )
    }

    return (
        <Scaffold
            headerTitle='Chat'
            fallback={dataRooms.loading}
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
                data={sortData()}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{paddingTop: 8}}
                onEndReachedThreshold={0.3}
                onEndReached={() => dataRooms.page !== -1 && setStateDataRooms({ loadNext: true })}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('ChatDetailScreen', {
                                    roomId: item.roomId,
                                    selected: item.isNewArrival ? item.memberDetail : item.member,
                                    isNewArrival: item.isNewArrival,
                                });
                            }}
                            style={{height: 60, paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center'}}
                        >
                            <View style={{width: '12%', height: '100%', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 0.5, borderColor: Color.text}}>
                                <Image
                                    source={{uri: item.image}}
                                    style={{width: '100%', aspectRatio: 1, borderRadius: 30, backgroundColor: Color.theme}}
                                />
                            </View>
                            <View style={{width: '70%', height: '100%', alignItems: 'flex-start', justifyContent: 'space-around', paddingHorizontal: 16, paddingVertical: 4, borderBottomWidth: 0.5, borderColor: Color.text}}>
                                <Text
                                    size={12}
                                    type='semibold'
                                    numberOfLines={1}
                                >
                                    {item.name !== '' ? item.name : typeof item.memberDetail !== 'undefined' ? getTitleFirebaseData(item.memberDetail) : getTitle(item.member)}
                                </Text>
                                <Text
                                    size={10}
                                    type={isUserTyping(item.typing) ? 'italic' : isNotRead(item.read) ? 'bold' : 'regular'}
                                    numberOfLines={1}
                                    color={isUserTyping(item.typing) ? Color.success : Color.text}
                                    style={{opacity: 0.6}}
                                >
                                    {isUserTyping(item.typing) ? 'Sedang mengetik...' : item.lastChat ? item.lastChat.message : ''}
                                </Text>
                            </View>
                            <View style={{width: '18%', height: '100%', alignItems: 'flex-end', justifyContent: 'space-around', paddingVertical: 4, borderBottomWidth: 0.5, borderColor: Color.text}}>
                                <Text
                                    size={8}
                                >
                                    {managedDate(item.lastChat.messageDate)}
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

            <TouchableOpacity onPress={() => navigation.navigate('ChatUserListScreen')} style={{height: 50, width: 50, borderRadius: 25, position: 'absolute', bottom: 16, right: 16, backgroundColor: Color.secondary, justifyContent: 'center', alignItems: 'center'}}>
                <Ionicons name='add' color={Color.text} size={30} />
            </TouchableOpacity>
        </Scaffold>
    )
}

export default ChatRoomsScreen;
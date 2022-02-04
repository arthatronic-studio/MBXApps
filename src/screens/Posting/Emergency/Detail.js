import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, Platform, Linking } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';

import {
    useLoading,
    usePopup,
    useColor
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { TouchableOpacity } from '@src/components/Button';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Divider, Row } from 'src/styled';
import { useSelector } from 'react-redux';

const Example = Styled(View)`
`;

export default ({ navigation, route }) => {
    const { item } = route.params;

    const user = useSelector(state => state['user.auth'].login.user);

    const [state, changeState] = useState({
        im_like: item.im_like,
    });

    const setState = (obj) => changeState({ ...state, ...obj });

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();

    const { Color } = useColor();

    // useEffect(() => {
    //     const timeout = trigger ? setTimeout(() => {
    //         fetchAddLike();
    //     }, 500) : null;

    //     return () => {
    //         clearTimeout(timeout);
    //     }
    // }, [trigger]);

    const fetchAddLike = () => {
        showLoading();

        Client.query({
          query: queryAddLike,
          variables: {
            productId: item.id
          }
        })
        .then((res) => {
          console.log(res, 'res add like');
          if (res.data.contentAddLike.id) {
            if (res.data.contentAddLike.status === 1) {
                showLoading('success', 'Kamu akan berangkat ke tkp');
                setState({ im_like: true });
            } else {
                showLoading('info', 'Kamu batal berangkat ke tkp');
                setState({ im_like: false });
            }
          }
        })
        .catch((err) => {
            console.log(err, 'err add like');
            hideLoading();
        })
    }

    console.log(item);

    return (
        <Scaffold
            headerTitle=''
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <ScrollView
                contentContainerStyle={{paddingBottom: 16}}
            >
                <Image
                    source={{uri: item.image}}
                    style={{width: '100%', aspectRatio: 1.5, backgroundColor: Color.border}}
                />

                <View style={{padding: 24, marginTop: -16, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.theme}}>
                    {user && user.userId === item.ownerId && <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('EditThreadScreen', {
                                ...item,
                                title: 'Edit',
                            });
                        }}
                        style={{height: 48, width: 48, borderRadius: 24, position: 'absolute', top: -24, right: 16, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Ionicons
                            name='pencil'
                            size={20}
                            color={Color.textInput}
                        />
                    </TouchableOpacity>}
                </View>

                <View style={{paddingHorizontal: 24}}>
                    <View>
                        <Text size={24} type='bold' align='left'>
                            {item.productName}
                        </Text>
                    </View>

                    <Divider height={8} />

                    <Row justify='space-between' align='center'>
                        <Text type='semibold'>{item.fullname}</Text>

                        {Moment(parseInt(item.created_date)).isValid() && <View style={{paddingBottom: 12}}>
                            <Text size={12} align='left' style={{opacity: 0.6}}>
                                {Moment(parseInt(item.created_date)).format('dddd, DD MMM YYYY')}
                            </Text>
                        </View>}
                    </Row>

                    <Divider />

                    <View>
                        <Text align='left'>
                            {item.productDescription}
                        </Text>
                    </View>
                </View>

                <Divider />

                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity
                            onPress={() => {
                                fetchAddLike();
                            }}
                            style={{height: 70, width: 70, flexDirection: 'row', borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
                        >
                            <Ionicons
                                name='rocket'
                                color={state.im_like ? Color.text : Color.error}
                                size={30}
                            />
                            {item.like > 0 && <Text color={state.im_like ? Color.primary : Color.text}>{item.like} </Text>}
                        </TouchableOpacity>
                        <Text
                            size={12}
                            color={state.im_like ? Color.text : Color.error}
                        >
                            {state.im_like ? 'Berangkat' : 'Batal berangkat'}
                        </Text>
                    </View>

                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('CommentListScreen', { item });
                            }}
                            style={{height: 70, width: 70, flexDirection: 'row', borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
                        >
                            <Ionicons name='chatbubble-ellipses-outline' color={Color.text} size={30} />
                            {item.comment > 0 && <Text>{item.comment} </Text>}
                        </TouchableOpacity>
                        <Text size={12}>Komentar</Text>
                    </View>

                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity
                            onPress={() => {
                                let daddr = `-6.311272,106.793541`;
                                if (!item.latitude || !item.longitude) {
                                    alert('Alamat tidak valid');
                                    return;
                                }

                                daddr = item.latitude + ',' + item.longitude;

                                if (Platform.OS === 'ios') {
                                    Linking.openURL('http://maps.apple.com/maps?daddr=' + daddr);
                                } else {
                                    Linking.openURL('http://maps.google.com/maps?daddr=' + daddr);
                                }
                            }}
                            style={{height: 70, width: 70, borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
                        >
                            <Ionicons name='location' size={30} color={Color.text} />
                        </TouchableOpacity>
                        <Text size={12}>Lokasi</Text>
                    </View>
                </View>
            </ScrollView>
        </Scaffold>
    )
}
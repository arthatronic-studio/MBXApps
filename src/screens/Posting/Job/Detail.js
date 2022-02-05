import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, Platform, Linking } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    useLoading,
    usePopup,
    useColor,
    Header,
    Submit,
    Alert,
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { TouchableOpacity } from '@src/components/Button';

import { shadowStyle } from '@src/styles';

import ImagesPath from 'src/components/ImagesPath';

import Moment from 'moment';

import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
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
                showLoading('success', 'Lamaran didaftarkan');
                setState({ im_like: true });
            } else {
                showLoading('info', 'Batal melamar');
                setState({ im_like: false });
            }
          }
        })
        .catch((err) => {
            console.log(err, 'err add like');
            showLoading('error', 'Terjadi kesalahan');
        })
    }

    return (
        <Scaffold
            header={
                <Header
                    title="Detail"
                />
            }
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 16}}
            >
                <View 
                    style={{width: '100%', height: 100, backgroundColor: Color.primarySoft}}
                />
                <View style={{width: '20%', marginHorizontal: 24, position: 'absolute', top: 70}}>
                    <Image
                        source={{uri: item.image}}
                        style={{width: '80%', aspectRatio: 1, borderRadius: 8, ...shadowStyle,}}
                        resizeMode='contain'
                    />
                </View>

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

                <View style={{paddingHorizontal: 24, paddingTop: 30}}>
                    <View style={{marginTop: 8, paddingBottom: 16, flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{marginRight: 12}}>
                            <Text size={18} type='bold' align='left'>{item.productName}</Text>
                        </View>
                        <View>
                            <Text size={10} align='left' color={Color.gray}>{Moment(parseInt(item.created_date)).fromNow()}</Text>
                        </View>
                    </View>
                    {/* <View style={{paddingBottom: 8, flexDirection: 'row', alignItems: 'center'}}>
                            <Image 
                                source={ImagesPath.buildings}
                                width={16}
                                height={16}
                                style={{marginRight: 5}}
                            />
                        <Text size={10} align='left'>
                            {item.productName}
                        </Text>
                    </View> */}
                    {/* <View style={{paddingBottom: 8, flexDirection: 'row', alignItems: 'center'}}>
                        <Image 
                            source={ImagesPath.mapPin}
                            width={16}
                            height={16}
                            style={{marginRight: 5}}
                        />
                        <Text size={10} align='left'>
                            Tangerang, Banten
                        </Text>
                    </View> */}
                    {/* <View style={{paddingBottom: 24, flexDirection: 'row', alignItems: 'center'}}>
                        <Image 
                            source={ImagesPath.briefCase}
                            width={16}
                            height={16}
                            style={{marginRight: 5}}
                        />
                        <Text size={10} align='left'>
                            Purna Waktu - Fresh Graduate
                        </Text>
                    </View> */}

                    <View style={{paddingBottom: 8}}>
                        <Text align='left' size={12}>Deskripsi</Text>
                    </View>

                    <View style={{paddingBottom: 24}}>
                        <Text align='left' size={14}>
                            {item.productDescription}
                        </Text>
                    </View>
                    
                    {/* <View style={{paddingBottom: 8}}>
                        <Text size={12} align='left'>
                            Jobdesk
                        </Text>
                    </View>

                    <View style={{paddingBottom: 32}}>
                        <Text align='left'>
                            Cotton candy tootsie roll jelly-o tiramisu jelly beans halvah.
                        </Text>
                        <Text align='left'>
                            Cotton candy icing candy canes chupa chups lollipop chocolate cake biscuit.
                        </Text>
                        <Text align='left'>
                            Icing pudding cheesecake jelly-o cake cheesecake.
                        </Text>
                        <Text align='left'>
                            Jelly oat cake marshmallow pastry tootsie roll jelly. Tiramisu chupa chups
                        </Text>
                        <Text align='left'>
                            Pudding cheesecake jelly-o cake cheesecake. Tart cheesecake biscuit candy canes toffee. Chocolate 
                        </Text>
                    </View> */}
                </View>
            </ScrollView>

            <Submit
                onPress={() => {
                    if (state.im_like) {
                        Alert(
                          'Konfirmasi',
                          'Apakah Anda yakin akan membatalkan?',
                          () => fetchAddLike()
                        );
                        return;
                    }

                    fetchAddLike();
                }}
                buttonLabel={state.im_like ? 'Batalkan' : 'Lamar Sekarang'}
                buttonColor={state.im_like ? Color.error : Color.primary}
                type='bottomSingleButton'
                buttonBorderTopWidth={0}
                style={{backgroundColor: Color.theme, paddingTop: 25, paddingBottom: 25}}
            />
        </Scaffold>
    )
}
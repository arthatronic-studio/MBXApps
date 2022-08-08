import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';

import {
    useLoading,
    usePopup,
    useColor,
    Submit,
    Alert,
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Button, TouchableOpacity } from '@src/components/Button';
import { shadowStyle } from '@src/styles';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { useSelector } from 'react-redux';
import { Container } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { useCurrentUser } from 'src/hooks/useCanGenerateContent';

const JobDetail = ({ navigation, route }) => {
    const { item } = route.params;
    const modalOptionsRef = useRef();

    const user = useSelector(state => state['user.auth'].login.user);

    const [state, changeState] = useState({
        im_like: item.im_like,
    });

    const setState = (obj) => changeState({ ...state, ...obj });

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();

    const { Color } = useColor();
    const {canGeneratedContent} = useCurrentUser();

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
            headerTitle='Detail'
            iconRightButton={<Feather name='more-vertical' size={20} color={Color.text} />}
            onPressRightButton={() => {
                modalOptionsRef.current.open();
            }}
            fallback={false}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 16}}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('GalleryDetailScreen', {
                        id: item.id,
                        image: item.image,
                        });
                    }}
                >
                    <Image
                        source={{uri: item.image}}
                        style={{width: '100%', aspectRatio: 4/3, backgroundColor: Color.border}}
                    />
                </TouchableOpacity>

                {item.like > 0 &&
                    <Container paddingHorizontal={16} paddingTop={16}>
                        <WidgetUserLikes id={item.id} title='Daftar Pelamar' />
                    </Container>
                }

                <View style={{paddingHorizontal: 24, paddingTop: 16}}>
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

                <View style={{width: '20%', marginHorizontal: 24, position: 'absolute', top: 55}}>
                    <Image
                        source={{uri: item.image}}
                        style={{width: '80%', aspectRatio: 1, borderRadius: 8, ...shadowStyle,}}
                        resizeMode='contain'
                    />
                </View>
            </ScrollView>

            <Container padding={16}>
                <Button
                    color={state.im_like ? Color.error : Color.primary}
                    onPress={() => {
                        if (!canGeneratedContent) {
                            alert('Silakan login terlebih dulu');
                            return;
                        }
    
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
                >
                    {state.im_like ? 'Batalkan' : 'Lamar Sekarang'}
                </Button>
            </Container>

            <ModalContentOptions
                ref={modalOptionsRef}
                isOwner={user && user.userId === item.ownerId}
                item={item}
            />
        </Scaffold>
    )
}

export default JobDetail;
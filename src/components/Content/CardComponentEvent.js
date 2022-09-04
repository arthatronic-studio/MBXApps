import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import {
    Text,
    TouchableOpacity,
    useColor,
    Button,
} from '@src/components';
import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';

import {
    iconLocation,
    iconCategory,
    iconComment,
    iconLiked,
    iconLike,
    iconverify,
    iconTempat
} from '@assets/images/home';
import { Container, Divider, Row } from 'src/styled';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { useSelector } from 'react-redux';
import CardComponentYoutube from './CardComponentYoutube';
import CardComponentVideo from './CardComponentVideo';
import { FormatMoney } from 'src/utils';
import { accessClient } from 'src/utils/access_client';
import imageAssets from 'assets/images';

const defaultProps = {
    productCategory: '',
    onPress: () => { },
    numColumns: 1,
    horizontal: false,
    style: {},
};

const CardComponentEvent = ({ productCategory, item, numColumns, onPress, horizontal, style }) => {
    const [like, setLike] = useState(item.like);
    const [im_like, setImLike] = useState(item.im_like);
    const [trigger, setTrigger] = useState(false);

    const { Color } = useColor();
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const user = useSelector(state => state['user.auth'].login.user);

    useEffect(() => {
        setLike(item.like);
        setImLike(item.im_like);
    }, [item]);

    useEffect(() => {
        const timeout = trigger ? setTimeout(() => {
            fetchAddLike();
        }, 500) : null;

        return () => {
            clearTimeout(timeout);
        }
    }, [trigger]);

    const fetchAddLike = () => {
        console.log('trigger emergency');

        Client.query({
            query: queryAddLike,
            variables: {
                productId: item.id
            }
        })
            .then((res) => {
                console.log(res, 'res add like');
                setTrigger(false);
            })
            .catch((err) => {
                console.log(err, 'err add like');
                setTrigger(false);
            });
    }

    const onSubmitLike = () => {
        setLike(!im_like ? like + 1 : like - 1);
        setImLike(!im_like);
        setTrigger(true);
    }

    const isPayProduct = typeof item.price && item.price > 0;
    // const isAdminPost;

    const renderCardEvent = () => {
        const onPress = () => {
            navigation.navigate('EventDetail', { item });

            // GALogEvent('Event', {
            //     id: item.id,
            //     product_name: item.title,
            //     user_id: user.userId,
            //     method: analyticMethods.view,
            // });
        }

        return (
            <TouchableOpacity
                onPress={() => {
                    onPress();
                }}
                style={{
                    width: width / numColumns - (horizontal ? 32 : 16),
                    paddingHorizontal: 8,
                    marginTop: 12,
                    borderRadius: 16,
                    ...style,
                }}
            >
                <View style={{ width: '100%', backgroundColor: Color.theme, borderRadius: 16, ...shadowStyle }}>
                    <Image
                        source={{ uri: item.image }}
                        style={{
                            width: '100%',
                            aspectRatio: 2 / 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            backgroundColor: Color.border,
                        }}
                    />

                    {/* <View style={{ backgroundColor: Color.theme, width: 40, aspectRatio: 1, borderRadius: 20, position: 'absolute', top: 10, right: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name='bookmark-outline' size={22} color={Color.primarySoft} />
                    </View> */}

                    <View style={{ width: '100%', padding: 10 }}>
                        <Text type='medium' align='left' numberOfLines={1}>{item.title}</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 8 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ height: 16, width: 16, tintColor: Color.placeholder }}
                                    source={imageAssets.location}
                                />
                                <Divider width={4} />
                                <Text type='medium' size={12} align='left' color={Color.placeholder} letterSpacing={0.5}>{item.location}</Text>
                            </View>
                            <Divider />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    style={{ height: 16, width: 16, tintColor: Color.placeholder }}
                                    source={imageAssets.calendar}
                                />
                                <Divider width={4} />
                                <>
                                    <Text type='medium' size={12} align='left' color={Color.placeholder} letterSpacing={0.5}>{item.formatted_date}</Text>
                                    <Divider height={8} />
                                </>
                            </View>
                        </View>

                        <View style={{width: '100%', flexDirection: 'row', paddingTop: 16}}>
                            <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Text size={11} type='medium' letterSpacing={0.5}>Mulai dari</Text>
                                <Text size={14} type='medium' letterSpacing={0.1}>{FormatMoney.getFormattedMoney(item.lowest_price ? item.lowest_price.price : 0)}</Text>
                            </View>
                            <View style={{flex: 0.8}}>
                                <Button
                                    onPress={() => {
                                        onPress();
                                    }}
                                    fontSize={12}
                                >
                                    Pesan Sekarang
                                    {/* <Ionicons name='arrow-forward' size={16} color={Color.textButtonInline} /> */}
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return renderCardEvent();
}

CardComponentEvent.defaultProps = defaultProps
export default CardComponentEvent;


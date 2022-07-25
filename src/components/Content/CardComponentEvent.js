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
        let eventDate = !isNaN(parseInt(item.eventDate)) ? parseInt(item.eventDate) : null;
        if (!eventDate) eventDate = !isNaN(parseInt(item.updated_date)) ? parseInt(item.updated_date) : null;

        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('EventDetail', { item });

                    GALogEvent('Event', {
                        id: item.id,
                        product_name: item.productName,
                        user_id: user.userId,
                        method: analyticMethods.view,
                    });
                }}
                style={{
                    width: width / numColumns - (horizontal ? 32 : 16),
                    paddingHorizontal: 8,
                    marginTop: 16,
                    borderRadius: 8,
                    ...style,
                }}
            >
                <View style={{ width: '100%', backgroundColor: Color.primaryMoreDark, borderRadius: 8 }}>
                    <Image
                        source={{ uri: item.image }}
                        style={{
                            width: '100%',
                            aspectRatio: 2 / 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}
                    />

                    <View style={{ backgroundColor: Color.theme, width: 40, aspectRatio: 1, borderRadius: 20, position: 'absolute', top: 10, right: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name='bookmark-outline' size={22} color={Color.primarySoft} />
                    </View>

                    <View style={{ width: '100%', padding: 10 }}>
                        <Text type='bold' align='left' numberOfLines={1}>{item.productName}</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 8 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ height: 16, width: 16 }}
                                    source={imageAssets.location}
                                />
                                <Divider width={4} />
                                <Text type='bold' size={12} align='left' color={Color.grey}>Bandung</Text>
                            </View>
                            <Divider />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    style={{ height: 16, width: 16 }}
                                    source={imageAssets.calendar}
                                />
                                <Divider width={4} />
                                {Moment(eventDate).isValid() && <>
                                    <Text type='bold' size={12} align='left' color={Color.grey}>{Moment(eventDate).format('DD MMM YYYY')}</Text>
                                    <Divider height={8} />
                                </>}
                            </View>
                        </View>

                        <View style={{width: '100%', flexDirection: 'row', paddingTop: 16}}>
                            <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Text size={12}>Start From</Text>
                                <Text size={16} type='medium'>{FormatMoney.getFormattedMoney(450000)}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Button>
                                    Check Now{' '}
                                    <Ionicons name='arrow-forward' size={16} color={Color.textButtonInline} />
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


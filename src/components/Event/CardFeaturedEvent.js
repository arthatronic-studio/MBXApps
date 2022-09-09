import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions, ImageBackground } from 'react-native';
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

const CardFeaturedEvent = ({ productCategory, item, numColumns, onPress, horizontal, style }) => {
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
                    width: width / numColumns - (horizontal ? 70 : 16),
                    paddingHorizontal: 8,
                    marginTop: 12,
                    borderRadius: 8,
                    ...style,
                }}
            >
                <View style={{ width: '100%', aspectRatio: 16/9, backgroundColor: Color.theme, borderRadius: 8, ...shadowStyle }}>
                    <ImageBackground
                        source={{ uri: item.image }}
                        style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            backgroundColor: Color.border,
                        }}
                        imageStyle={{
                            borderRadius: 8,
                        }}
                    >
                        <View
                            style={{
                                width: '100%',
                                padding: 10,
                                height: '35%',
                                borderBottomLeftRadius: 8,
                                borderBottomRightRadius: 8,
                                backgroundColor: Color.overflow,
                            }}
                        >
                            <Text type='medium' size={16} align='left' color={Color.textInput} numberOfLines={2} letterSpacing={0.15}>{item.title}</Text>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableOpacity>
        )
    }

    return renderCardEvent();
}

CardFeaturedEvent.defaultProps = defaultProps
export default CardFeaturedEvent;


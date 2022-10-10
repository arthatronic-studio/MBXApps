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
                    width: width / numColumns - (horizontal ? (width * 0.3) : 16),
                    paddingHorizontal: 8,
                    marginTop: 12,
                    borderRadius: 16,
                    ...style,
                }}
            >
                <View style={{ width: '100%', backgroundColor: Color.theme, borderWidth: 1, borderColor: Color.primary }}>
                    <View style={{ width: '100%', padding: 8, paddingVertical: 6, flexDirection: 'row', borderBottomWidth: 1, borderColor: Color.primary }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text size={11} type='medium' letterSpacing={0.04}>TICKET</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text size={11} type='medium' letterSpacing={0.04}>{FormatMoney.getFormattedMoney(item.lowest_price ? item.lowest_price.price : 0)}</Text>
                        </View>
                    </View>

                    <View style={{ width: '100%', minHeight: (27 * 3) + (8 * 2) + 24, padding: 8, borderBottomWidth: 1, borderColor: Color.primary }}>
                        <Text size={27} type='medium' align='left' numberOfLines={3}>{item.title}</Text>
                    </View>

                    <View style={{ width: '100%', minHeight: (9 * 3) + (8 * 1) + 8, padding: 8, paddingVertical: 4, borderBottomWidth: 1, borderColor: Color.primary }}>
                        {/* <Text type='medium' align='left' numberOfLines={1}>{item.description}</Text> */}
                        <Text size={9} type='medium' align='left' numberOfLines={3}>{item.description}</Text>
                    </View>

                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', aspectRatio: 1, borderRightWidth: 1, borderColor: Color.primary }}>
                            <Image
                                source={{ uri: item.image }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </View>

                        <View style={{ width: '50%', aspectRatio: 1 }}>
                            <View style={{ width: '100%', height: '50%', paddingHorizontal: 12, justifyContent: 'center', backgroundColor: Color.primary }}>
                                <Text type='medium' numberOfLines={3} size={11} align='left' color={Color.textInput}>{item.formatted_date}</Text>
                            </View>
                            <View style={{ width: '100%', height: '50%', paddingHorizontal: 12, justifyContent: 'center' }}>
                                <Text type='medium' numberOfLines={3} size={11} align='left' color={Color.placeholder} letterSpacing={0.5}>{item.location}</Text>
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


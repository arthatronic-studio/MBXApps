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
} from '@assets/images/home';
import { Container, Divider, Row } from 'src/styled';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { useSelector } from 'react-redux';
import CardComponentYoutube from './CardComponentYoutube';
import CardComponentVideo from './CardComponentVideo';

const defaultProps = {
    productCategory: '',
    onPress: () => { },
    numColumns: 1,
    horizontal: false,
    style: {},
};

const CardComponentArticle = ({ productCategory, item, numColumns, onPress, horizontal, style }) => {
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

    const renderCardArticle = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('NewsDetail', { item });

                    GALogEvent('Artikel', {
                        id: item.id,
                        product_name: item.productName,
                        user_id: user.userId,
                        method: analyticMethods.view,
                    })

                }}
                style={[
                    {
                        width: width / numColumns - 16,
                        paddingHorizontal: 8,
                        marginBottom: 16,
                        flexDirection: 'row',
                    },
                    style,
                ]}>
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        padding: 16,
                        borderRadius: 4,
                        backgroundColor: Color.textInput,
                        ...shadowStyle,
                    }}
                >
                    <View style={{ width: '25%' }}>
                        <Image
                            source={{ uri: item.image }}
                            style={{
                                width: '100%',
                                aspectRatio: 1,
                                borderRadius: 8,
                            }}
                            resizeMode="cover"
                        />
                    </View>

                    <View style={{ width: '75%', paddingLeft: 16 }}>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <Text type="bold" align="left" numberOfLines={2}>
                                {item.productName}
                            </Text>
                            {/* <Ionicons name='bookmark-outline' size={20} color={Color.primary} /> */}
                        </View>

                        <View style={{ paddingTop: 4, flexDirection: 'row' }}>
                            <Text size={12} align='left'>Oleh:&nbsp;</Text>
                            <Text size={12} align='left'>{item.fullname}</Text>
                        </View>

                        <View style={{ paddingTop: 4 }}>
                            <Text size={12} align="left" numberOfLines={2} style={{ width: '80%' }}>
                                {item.productDescription}
                            </Text>
                        </View>

                        {/* <View style={{paddingTop: 12, flexDirection: 'row'}}>
                                    <Ionicons name='location' color={Color.error} style={{marginRight: 8}} />
                                    <Text size={12} align='left'>Jakarta Selatan</Text>
                                </View> */}
                        <View
                            style={{
                                paddingTop: 14,
                                alignItems: 'flex-end',
                                flexDirection: 'row',
                            }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text
                                    style={{
                                        color: Color.gray,
                                        fontSize: 13,
                                        fontSize: 11,
                                        paddingTop: 10,
                                        paddingEnd: 23,
                                    }}>
                                    {Moment(parseInt(item.created_date)).format('DD MMMM YYYY')}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    size={11}
                                    style={{
                                        color: Color.primary,
                                        paddingHorizontal: 4,
                                    }}>
                                    Selengkapnya
                                </Text>
                                <Ionicons
                                    name={'arrow-forward'}
                                    size={12}
                                    style={{ color: Color.primary }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return renderCardArticle();
}

CardComponentArticle.defaultProps = defaultProps
export default CardComponentArticle;


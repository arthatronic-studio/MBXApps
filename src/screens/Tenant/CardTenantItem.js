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
import CardComponentYoutube from '../../components/Content/CardComponentYoutube';
import CardComponentVideo from '../../components/Content/CardComponentVideo';
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

const CardTenantItem = ({ productCategory, item, numColumns, onPress, horizontal, style }) => {
    const [like, setLike] = useState(false);
    const [im_like, setImLike] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const { Color } = useColor();
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const user = useSelector(state => state['user.auth'].login.user);

    // useEffect(() => {
    //     setLike(item.like);
    //     setImLike(item.im_like);
    // }, [item]);

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

    const renderCardEvent = () => {
        const onPress = () => {
            navigation.navigate('TenantDetailScreen', { item });

            // GALogEvent('Event', {
            //     id: item.id,
            //     product_name: item.title,
            //     user_id: user.userId,
            //     method: analyticMethods.view,
            // });
        }

        console.log('horizontal', horizontal);

        if (horizontal) {
            return (
                <View style={{paddingHorizontal: 16}}>
                    <TouchableOpacity
                        onPress={() => {
                            onPress();
                        }}
                        style={{
                            width: width - 32,
                            aspectRatio: 16 / 9,
                            marginTop: 12,
                            borderRadius: 16,
                            ...style,
                        }}
                    >
                        <ImageBackground
                            source={{ uri: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '' }}
                            style={{
                                width: '100%',
                                height: '100%',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-start',
                            }}
                            imageStyle={{
                                borderRadius: 16,
                            }}
                        >
                            <Container width='100%' paddingHorizontal={12} paddingVertical={26} color={Color.overflow} style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                                <Text size={17} color={Color.textInput} align='left' type='bold'>Titik temu Coffee</Text>
                                <Divider height={6} />
                                <Text size={10} color={Color.textInput} align='left' type='medium'>Cafe</Text>
                            </Container>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <TouchableOpacity
                onPress={() => {
                    onPress();
                }}
                style={{
                    width: width / numColumns - (horizontal ? 32 : 0),
                    paddingHorizontal: 16,
                    marginTop: 12,
                    borderRadius: 8,
                    ...style,
                }}
            >
                <View style={{ width: '100%', backgroundColor: Color.theme, borderRadius: 8, ...shadowStyle }}>
                    <Image
                        source={{ uri: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '' }}
                        style={{
                            width: '100%',
                            aspectRatio: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                            backgroundColor: Color.border,
                        }}
                    />

                    {/* <View style={{ backgroundColor: Color.theme, width: 40, aspectRatio: 1, borderRadius: 20, position: 'absolute', top: 10, right: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name='bookmark-outline' size={22} color={Color.primarySoft} />
                    </View> */}

                    <View style={{ width: '100%', padding: 10 }}>
                        <Text type='medium' align='left' numberOfLines={1}>{item.name}</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ height: 16, width: 16, tintColor: Color.placeholder }}
                                    source={imageAssets.location}
                                />
                                <Divider width={4} />
                                <Text type='medium' size={12} align='left' color={Color.placeholder} letterSpacing={0.5}>{item.category.name || "Kafe"}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return renderCardEvent();
}

CardTenantItem.defaultProps = defaultProps
export default CardTenantItem;


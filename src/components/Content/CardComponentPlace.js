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

const CardComponentPlace = ({ productCategory, item, numColumns, onPress, horizontal, style }) => {
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

    const renderCardPlace = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('PlaceDetail', { item });

                    GALogEvent('Tempat', {
                        id: item.id,
                        product_name: item.productName,
                        user_id: user.userId,
                        method: analyticMethods.view,
                    });
                }}
                style={{
                    width: width / numColumns - (horizontal ? 16 : 8),
                    paddingHorizontal: 8,
                    marginBottom: 16,
                    ...style,
                }}
            >
                <View style={{
                    backgroundColor: Color.textInput,
                    ...shadowStyle,
                }}>
                    <Image
                        source={{ uri: item.image }}
                        style={{
                            width: '100%',
                            aspectRatio: 3 / 2,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                            backgroundColor: Color.border,
                        }}
                    />

                    <View style={{ width: '100%', padding: 16, backgroundColor: Color.textInput, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}>
                        <Text size={12} type='bold' align='left' numberOfLines={2}>{item.productName}</Text>
                        <Divider height={4} />
                        <Row>
                            <View style={{ width: 16 }}>
                                <Ionicons name='person' color={Color.text} />
                            </View>
                            <Text size={12} align='left' numberOfLines={2}>{item.fullname}</Text>
                        </Row>
                        <Divider />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text size={12}>{item.like}&nbsp;</Text>
                                <Ionicons
                                    name={item.im_like ? 'heart' : 'heart-outline'}
                                    color={Color.primary}
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text size={12}>{item.comment > 0 ? item.comment + ' Komentar' : 'Beri Komentar'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    
    return renderCardPlace();
}

CardComponentPlace.defaultProps = defaultProps
export default CardComponentPlace;


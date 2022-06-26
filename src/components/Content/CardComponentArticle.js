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
                    });
                }}
                style={{
                    width: width / numColumns - 16,
                    paddingHorizontal: 8,
                    flexDirection: 'row',
                    marginBottom: 16,
                    ...style,
                }}
            >
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{ flex: 1}}>
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
                    <View style={{ flex: 3, paddingHorizontal: 8, paddingVertical: 4, justifyContent: 'space-between'}}>
                        <View>
                            <Text align={'left'}
                                numberOfLines={2}
                                type='bold'
                            >
                                {item.productName}
                            </Text>
                            <Divider height={2} />
                            <Text align={'left'}
                                size={12}
                                numberOfLines={2}
                            >
                                {item.productDescription}
                            </Text>
                        </View>

                        <View style={{flexDirection: 'row'}}>
                            <Text align={'left'} style={{fontSize: 10, color: Color.secondary}}>{typeof item.fullname === 'string' ? item.fullname.split(' ')[0] : ''} • </Text>
                            <View style={{width: 3, height: 3, borderRadius: 20, backgroundColor: Color.secondary}}/>
                            <Text align={'left'} style={{fontSize: 10, color: Color.secondary}}>{Moment(parseInt(item.created_date)).format('DD MMM YYYY')}</Text>
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


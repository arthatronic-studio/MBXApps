import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
    iconStar
    
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

const CardComponentPlaceV2 = ({ productCategory, item, numColumns, onPress, horizontal, style }) => {
    const [like, setLike] = useState(item.like);
    const [im_like, setImLike] = useState(item.im_like);
    const [trigger, setTrigger] = useState(false);

    const { Color } = useColor();
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const user = useSelector(state => state['user.auth'].login.user);

    console.log('item place3',item);

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

    const iconSIze = 20;

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
                    width: width / 2 - (horizontal ? 16 : 8),
                    paddingHorizontal: 8,
                    marginTop: 12,
                    ...style,
                }}
            >
                <View style={{
                    // backgroundColor: Color.textInput,
                    // ...shadowStyle,
                }}>
                    <View
                        style={{
                            width: '100%',
                            aspectRatio: 6/5,
                        }}
                    >
                        <Image
                            source={{ uri: item.image }}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 4,
                                backgroundColor: Color.border,
                            }}
                        />
                    </View>
                    {/* rating  */}
                    <View style={{
                    position: 'absolute', backgroundColor: Color.textInput,
                    top: 5,
                    right: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 7,
                    borderRadius: 24
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Image
                        source={iconStar}
                        style={{ height: 20, width: 20 }}
                        resizeMode='contain'
                      />
                      <Text type='bold'>4.3</Text>
                    </View>
                  </View>

                    <View style={{ width: '100%', paddingTop: 8, backgroundColor: Color.textInput, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}>

                    <Row align='center'>
                            <View style={{ width: 16 }}>
                                <Ionicons name='cafe-outline' color={Color.text} size={16} />
                            </View>
                            <Text size={12} color={Color.text} align='left' numberOfLines={1}>Kafe</Text>
                        </Row>

                        <Text size={12} type='bold' align='left' numberOfLines={2}>{item.productName}</Text>
                        <Divider height={2} />

                     
                        <Row align='center'>
                            {/* <View style={{ width: 16 }}>
                                <Ionicons name='person' color={Color.text} />
                            </View> */}
                            <Text size={12} color={Color.gray} align='left' numberOfLines={1}>{item.fullname}</Text>
                        </Row>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 4 }}>

                            <Row>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Ionicons
                                        name={item.im_like ? 'heart' : 'heart-outline'}
                                        color={item.im_like ? Color.primary : Color.text}
                                        size={iconSIze}
                                    />
                                    <Divider width={2} />
                                    <Text size={12}>{item.like}</Text>
                                  
                                </View>

                                <Divider width={12} />
                            
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={{ height: iconSIze, width: iconSIze, tintColor: Color.text }}
                                        source={iconComment}
                                    />
                                    <Divider width={2} />
                                    <Text size={12}>{item.comment > 0 ? item.comment : '0'}</Text>
                                </View>
                            </Row>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons
                                    name={'eye-outline'}
                                    color={Color.text}
                                    size={iconSIze}
                                />
                                <Divider width={2} />
                                <Text size={12}>{item.comment > 0 ? item.comment : '0'}</Text>
                            </View>
                           
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    
    return renderCardPlace();
}

CardComponentPlaceV2.defaultProps = defaultProps
export default CardComponentPlaceV2;


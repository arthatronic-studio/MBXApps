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

const CardComponentEmergency = ({ productCategory, item, numColumns, onPress, horizontal, style }) => {
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

    const renderCardEmergency = () => {
        return (
            <View
                style={[
                    {
                        width: width / numColumns - (horizontal ? 32 : 16),
                        paddingHorizontal: 8,
                        marginBottom: 16,
                        ...shadowStyle,
                    },
                    style
                ]}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('EmergencyDetail', { item });
                        GALogEvent('Tempat', {
                            id: item.id,
                            product_name: item.productName,
                            user_id: user.
                                Id,
                            method: analyticMethods.view,
                          });
                    }}
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        padding: 16,
                        backgroundColor: Color.textInput,
                        borderRadius: 8,
                        aspectRatio: 16 / 9,
                    }}
                >
                    <Image
                        source={{ uri: item.image }}
                        style={{ height: '100%', width: '25%', aspectRatio: 1, borderRadius: 8, backgroundColor: Color.border }}
                    />

                    <View style={{ height: '100%', width: '75%', justifyContent: 'space-between', paddingLeft: 16 }}>
                        <Container>
                            <Text size={14} type='bold' align='left' numberOfLines={2}>{item.productName}</Text>
                            <Divider height={4} />
                            <Row>
                                <Container width={16}>
                                    <Ionicons name='person' color={Color.text} />
                                </Container>
                                <Text size={12} align='left' numberOfLines={1}>{item.fullname}</Text>
                            </Row>
                            <Divider height={4} />
                            <Row>
                                <Container width={16}>
                                    <Image
                                        style={{ height: 10, width: 10 }}
                                        source={iconCategory}
                                    />
                                </Container>
                                {/* <Text size={12}>{item.productCategory}</Text> */}
                                <Text size={12}>HELP ME</Text>
                            </Row>
                            {/* <Row>
                                <Image
                                    style={{ height: 10, width: 10}}
                                    source={iconLocation}
                                />
                                <Text size={12}>Kebon Jeruk, Jakarta</Text>
                            </Row> */}

                            <View style={{ marginTop: 8 }}>
                                <Text size={11} align='left' numberOfLines={3} >
                                    {item.productDescription}
                                </Text>
                            </View>
                        </Container>

                        <Container>
                            <View style={{ width: '100%', flexDirection: 'row', marginTop: 16 }}>
                                <TouchableOpacity onPress={() => onSubmitLike(item)} style={{ width: '50%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderColor: Color.border }}>
                                    {/* <Image
                                        style={{ height:20, width:20 }}
                                        source={im_like ? iconLiked : iconLike}
                                    /> */}
                                    <MaterialCommunityIcons
                                        name={im_like ? 'rocket-launch' : 'rocket-launch-outline'}
                                        color={im_like ? Color.success : Color.text}
                                        size={17}
                                    />
                                    <Text style={{ marginLeft: 4, marginBottom: 4 }} size={14}>{like} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('CommentListScreen', { item })} style={{ width: '50%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={{ height: 17, width: 17, tintColor: Color.text }}
                                        source={iconComment}
                                    />
                                    <Text style={{ marginLeft: 4, marginBottom: 4 }} size={14}>{item.comment} </Text>
                                </TouchableOpacity>
                            </View>
                        </Container>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return renderCardEmergency();
}

CardComponentEmergency.defaultProps = defaultProps
export default CardComponentEmergency;


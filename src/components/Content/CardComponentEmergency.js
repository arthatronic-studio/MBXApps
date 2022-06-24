import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import ImagesPath from '../ImagesPath';

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
import Entypo from 'react-native-vector-icons/Entypo'
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
                        backgroundColor: Color.textInput,
                        borderRadius: 8,
                        aspectRatio: 11 / 9,
                        elevation: 2
                    }}
                >
                    <View style={{ width: '100%', borderRadius: 10, height: 240}}>
                    <Image
                        source={{ uri: item.image }}
                        style={{ height: '65%', width: '100%', borderRadius: 8, backgroundColor: Color.border }}
                    />
                    <View style={{position: 'absolute', flexDirection: 'row', alignItems: 'center', backgroundColor: Color.theme, width: 70, top: 10, left: 10, height: 25, borderRadius: 30, paddingLeft: 5}}>
                        <View style={{width: 10, height: 10, backgroundColor: Color.yellow, borderRadius: 20}}/>
                        <Text style={{marginLeft: 5,fontSize: 10, fontWeight: 'bold'}}>Medium</Text>
                    </View>
                    <Text numberOfLines={1} align={'left'} style={{fontWeight: 'bold', padding:10}}>{item.productName}</Text>
                    <Row style={{paddingHorizontal: 10}}>
                        <Entypo name={'location-pin'} color={Color.red}/>
                        <Text style={{fontSize: 10, color: Color.secondary, paddingLeft: 5, paddingRight: 15}}>Jakarta Barat (Core)</Text>
                        <MaterialCommunityIcons color={Color.secondary} name='comment-processing'/>
                        <Text style={{fontSize: 10, color: Color.secondary, paddingLeft: 5, paddingRight: 15}}>{item.comment} Komentar</Text>
                    </Row>
                    <Divider height={22}/>
                    <Row style={{paddingHorizontal: 10}}>
                        <View style={{width: '65%'}}>
                            <View style={{width: 25, height:25, borderRadius: 30, backgroundColor: Color.secondary}}>

                            </View>
                            <Text style={{textAlign: 'left',fontSize: 8, color: Color.secondary, marginTop: 5}}>Adang Susanto dan 25 lainnya meluncur</Text>
                        </View>
                        <TouchableOpacity style={{width:'35%', flexDirection: 'row',alignItems: 'center', justifyContent: 'center',backgroundColor: Color.red, height: '100%', borderRadius: 8}}>
                            <Ionicons name={'rocket-outline'} size={20} style={{color: Color.textInput}}/>
                            <Text style={{fontSize: 12, color: Color.textInput, marginLeft: 8 }}>Meluncur</Text>
                        </TouchableOpacity>
                    </Row>
                    </View>
                    
                </TouchableOpacity>
            </View>
        )
    }

    return renderCardEmergency();
}

CardComponentEmergency.defaultProps = defaultProps
export default CardComponentEmergency;


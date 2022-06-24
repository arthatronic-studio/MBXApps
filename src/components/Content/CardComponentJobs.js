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

const CardComponentJobs = ({ productCategory, item, numColumns, onPress, horizontal, style }) => {
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

    const renderCardJobs = () => {
        return (

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('JobDetail', { item });

                    GALogEvent('Job', {
                        id: item.id,
                        product_name: item.productName,
                        user_id: user.userId,
                        method: analyticMethods.view,
                    });
                }}
                style={[
                    {
                        width: width / numColumns - 16,
                        paddingHorizontal: 8,
                        marginBottom: 16
                    },
                    style,
                ]}
            >
               
                <View style={{width: '100%',  padding: 16, borderRadius: 4, backgroundColor: Color.textInput, ...shadowStyle}}>
                    <View style={{flexDirection:'row'}}>
                    <View style={{width: '20%'}}>
                        <Image
                            source={{uri: item.image}}
                            style={{
                                width: '80%',
                                aspectRatio: 1,
                                borderRadius: 8,
                            }}
                            resizeMode='contain'
                        />
                    </View>
    
                    <View style={{width: '80%'}}>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text type='bold' size={16} align='left' numberOfLines={2}>{item.productName}</Text>
                            {/* <Ionicons name='bookmark-outline' size={20} color={Color.primary} /> */}
                        </View>
    
                        <View style={{paddingTop: 4, flexDirection: 'row'}}>
                            <Text size={12} align='left'>Post:&nbsp;</Text>
                            <Text size={12} align='left'>{item.fullname}</Text>
                        </View>
    
                      
                    </View>
                    </View>
                   <View style={{flexDirection:'row',marginVertical:10}}>
                   <Ionicons name="briefcase-outline" size={18}color={Color.gray}/>
                 <Text  size={12}color={Color.gray} style={{marginHorizontal:5}}>Fresh Graduate </Text>
                <Ionicons name="time-outline" size={18}color={Color.gray}/>
                       <Text size={12}color={Color.gray} style={{marginHorizontal:5}}>FullTime</Text>
                   </View>
                   <View style={{flexDirection:'row'}}>
                   <Ionicons name="cash-outline" size={18}color={Color.gray}/>
                       <Text size={12} color={Color.gray}style={{marginHorizontal:10}}>Rp10.000.000 - Rp15.000.000</Text>
                   </View>

                   <View style={{borderBottomColor:Color.border,borderBottomWidth:1,marginVertical:10}}/>

                   
                   <View style={{paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between'}}>
                            {/* <Text size={12} color={Color.info}>{item.like} Pelamar</Text> */}
                            <Text size={12} align='left'>Jakarta Selatan</Text>
                            <Text size={12}>{Moment(parseInt(item.created_date)).fromNow()}</Text>
                        </View>
                </View>
               
                
            </TouchableOpacity>
        )
    }

    return renderCardJobs();
}

CardComponentJobs.defaultProps = defaultProps
export default CardComponentJobs;


import React, { useState, useEffect } from 'react';
import { View, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import Moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { Divider } from 'src/styled';

const { width } = Dimensions.get('window');

const defaultProps = {
    onPress: () => {},
    numColumns: 1,
    horizontal: false,
    style: {},
};

const CardEvent = (props) => {
    const { item, numColumns, onPress, horizontal, style } = props;

    const [like, setLike] = useState(item.like);
    const [im_like, setImLike] = useState(item.im_like);
    const [trigger, setTrigger] = useState(false);

    const { Color } = useColor();
    const navigation = useNavigation();

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
        console.log('trigger article');

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
        })
    }

    const onSubmitLike = () => {
        setLike(!im_like ? like + 1 : like - 1);
        setImLike(!im_like);
        setTrigger(true);
    }

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={[
                {
                    width: width / numColumns - (horizontal ? 32 : 16),
                    paddingHorizontal: 8,
                    marginBottom: 16,
                    borderRadius: 4
                },
                style,
            ]}
        >
            <View style={{flexDirection: 'row', width: '100%', backgroundColor: Color.textInput, borderRadius: 4, ...shadowStyle}}>
                <Image
                    source={{uri: item.image}}
                    style={{width: '35%', aspectRatio: 9/16, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, backgroundColor: Color.border}}
                />

                <View style={{width: '65%', padding: 16, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: Color.textInput}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{width: 70, paddingVertical: 4, paddingHorizontal: 16, borderWidth: 0.5, borderRadius: 8, borderColor: Color.primary}}>
                            <Text size={10} color={Color.primary}>{item.productCategory}</Text>
                        </View>

                        {/* <Ionicons name='bookmark-outline' size={20} color={Color.primary} /> */}
                    </View>

                    <View style={{paddingTop: 8}}>
                        <Text type='bold' align='left' numberOfLines={2}>{item.productName}</Text>
                        <Divider height={6} />
                        <Text size={12} align='left' numberOfLines={2}>{item.fullname}</Text>
                        {Moment(parseInt(item.created_date)).isValid() && <>
                            <Text type='bold' size={12} align='left' color={Color.primary}>{Moment(parseInt(item.created_date)).format('DD MMM YYYY')}</Text>
                            <Divider height={8} />
                        </>}
                        <Text size={12} align='left' numberOfLines={4}>{item.productDescription}</Text>
                    </View>

                    {/* <View style={{paddingTop: 24, flexDirection: 'row'}}>
                        <Foundation name='calendar' color={Color.yellow} style={{marginRight: 8}} />
                        <Text size={10} align='left'>3 Bulan</Text>
                    </View> */}

                    {/* <View style={{paddingTop: 6, flexDirection: 'row'}}>
                        <Ionicons name='location' color={Color.error} style={{marginRight: 8}} />
                        <Text size={10} align='left'>Cilandak, Jakarta Selatan</Text>
                    </View> */}

                    {/* <View style={{paddingTop: 6, flexDirection: 'row'}}>
                        <Ionicons name='information-circle-outline' color={Color.error} style={{marginRight: 8}} />
                        <Text size={10} align='left'>3 Hari lagi Pendaftaran Ditutup</Text>
                    </View> */}
                </View>
            </View>
        </TouchableOpacity>
    )
}

CardEvent.defaultProps = defaultProps;
export default CardEvent;
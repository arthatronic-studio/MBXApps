import React, { useState, useEffect } from 'react';
import { View, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryMaudiAddLike } from '@src/lib/query';

const { width } = Dimensions.get('window');

const defaultProps = {
    onPress: () => {},
    numColumns: 1,
    horizontal: false,
    style: {},
};

const CardNews = (props) => {
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
            maudiAddLike();
        }, 500) : null;

        return () => {
            clearTimeout(timeout);
        }
    }, [trigger]);

    const maudiAddLike = () => {
        console.log('trigger article');

        Client.query({
          query: queryMaudiAddLike,
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
        <View
            style={[
                {
                    width: width / numColumns - (horizontal ? 32 : 16),
                    paddingHorizontal: 8,
                    marginBottom: 16,
                    borderRadius: 4,
                },
                style
            ]}
        >
            <View
                style={{
                    width: '100%',
                    aspectRatio: 1.2,
                    borderRadius: 4,
                    paddingTop: 16,
                    paddingHorizontal: 16,
                    backgroundColor: Color.textInput,
                    ...shadowStyle,
                }}
            >
                <View style={{flexDirection: 'row', height: '20%', width: '100%', paddingBottom: 16}}>
                    <View style={{width: '80%', height: '100%', flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={{uri: item.avatar}} style={{height: '100%', aspectRatio: 1, borderRadius: 50, backgroundColor: Color.border}} />
                        <View style={{paddingLeft: 16, alignItems: 'flex-start'}}>
                            <Text type='bold' style={{marginBottom: 4}}>{item.fullname}</Text>
                            <Text size={10}>Post {Moment(parseInt(item.created_date)).fromNow()}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{width: '20%', justifyContent: 'center', alignItems: 'flex-end'}}>
                        <View style={{height: 20, width: '100%', paddingHorizontal: 4, marginBottom: 2, borderWidth: 0.5, borderRadius: 4, borderColor: Color.primary, justifyContent: 'center'}}>
                            <Text size={10} color={Color.primary} numberOfLines={1}>{item.productCategory}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => onPress(item)}
                    style={{flexDirection: 'row', width: '100%', height: '60%', paddingTop: 16, borderTopWidth: 0.5}}
                >
                    <View style={{width: '60%', paddingRight: 8}}>
                        <Text type='bold' align='left' numberOfLines={1}>
                            {item.productName}
                        </Text>
                        <View style={{paddingTop: 12}}>
                            <Text size={12} align='left' numberOfLines={4}>
                                {item.productDescription}
                            </Text>
                        </View>
                    </View>
                    <Image source={{uri: item.image}} style={{width: '40%', height: '100%', borderRadius: 4, backgroundColor: Color.border}} />
                </TouchableOpacity>
                    
                <View style={{width: '100%', height: '20%', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => onPress(item)} style={{width: '33.33%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name='eye-outline' color={Color.text} size={18} />
                        <Text style={{marginBottom: 4}}>{item.view} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('CommentListScreen', { item })} style={{width: '33.33%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name='chatbubble-ellipses-outline' color={Color.text} size={18} />
                        <Text style={{marginBottom: 4}}>{item.comment} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onSubmitLike(item)} style={{width: '33.33%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name={im_like ? 'heart' : 'heart-outline'} color={im_like ? Color.primary : Color.text} size={18} />
                        <Text style={{marginBottom: 4}}>{like} </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

CardNews.defaultProps = defaultProps;

export default CardNews;
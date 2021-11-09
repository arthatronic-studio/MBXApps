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
import { usePreviousState } from '@src/hooks';
import { Item } from 'native-base';

import {
    iconLocation,
    iconCategory,
    iconComment,
    iconLiked,
    iconLike,
} from '@assets/images/home';

const { width } = Dimensions.get('window');

const defaultProps = {
    onPress: () => {},
    numColumns: 1,
    horizontal: false,
    style: {},
};

const CardEmergency = (props) => {
    const { item, numColumns, onPress, horizontal, style, index } = props;
    
    const [like, setLike] = useState(item.like);
    const [im_like, setImLike] = useState(item.im_like);

    const prevImLike = usePreviousState(im_like);
    const { Color } = useColor();
    const navigation = useNavigation();

    useEffect(() => {
        setLike(item.like);
        setImLike(item.im_like);
    }, [item.like, item.im_like]);

    useEffect(() => {
        const valid = prevImLike !== im_like;

        const timeout = valid ? setTimeout(() => {
            maudiAddLike();
        }, 500) : null;

        return () => {
            clearTimeout(timeout);
        }
    }, [im_like]);

    const maudiAddLike = () => {
        Client.query({
            query: queryMaudiAddLike,
            variables: {
                productId: item.id
            }
        })
        .then((res) => {
        //   console.log(res, 'res add like');
        
        //   if (res.data.maudiAddLike.id) {
        //     if (res.data.maudiAddLike.status === 1) {
        //     }
        //   }
        })
        .catch((err) => {
            console.log(err, 'err add like');
        });
    }

    const onSubmitLike = () => {
        setLike(!im_like ? like + 1 : like - 1);
        setImLike(!im_like);
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
            <TouchableOpacity onPress={() => onPress(item)} style={{flexDirection: 'row', height: (index !== 5) ? 169 : 144, width: 323, paddingBottom: 16, borderBottomWidth: (index !== 5) ? 0.5 : 0}}>
                <Image source={{uri: item.image}} style={{marginTop:6, width: 73, height: 73, borderRadius: 8, backgroundColor: Color.border}} />
                <View style={{flexDirection: 'column', height: 144, width: 240, paddingLeft: 10 }}>
                    <Text size={16} type='bold' align='left' numberOfLines={1}>{item.productName}</Text>
                    <View style={{alignItems:'center', flexDirection: 'row', width: 240, paddingTop: 8}}>
                        <Image 
                            style={{ height: 10, width: 10, aspectRatio: 1 }}
                            source={iconCategory}
                        />
                        <Text style={{ marginLeft:4 }} size={12}>{item.productCategory}</Text>
                        <Image
                            style={{ height: 10, width: 10, marginLeft: 9 }}
                            source={iconLocation}
                        />
                        <Text style={{ marginLeft:6 }} size={12}>Kebon Jeruk, Jakarta</Text>
                    </View>
                    <View style={{paddingTop: 16, height:60}}>
                        <Text size={12} align='left' numberOfLines={3} >
                            {item.productDescription}
                        </Text>
                    </View>
                    <View style={{width: '100%', height: '20%', flexDirection: 'row', paddingTop: 16}}>
                        <TouchableOpacity onPress={() => onSubmitLike(item)} style={{width: 119, height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRightWidth:0.5}}>
                            <Image
                                style={{ height:20, width:20 }}
                                source={im_like ? iconLiked : iconLike}
                            />
                            <Text style={{ paddingLeft: 4, marginBottom: 4}}>{like} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('CommentListScreen', { item })} style={{width: 119, height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderLeftWidth:0.5}}>
                            <Image
                                style={{ height:20, width:20 }}
                                source={iconComment}
                            />
                            <Text style={{paddingLeft:4, marginBottom: 4}}>{item.comment} </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

CardEmergency.defaultProps = defaultProps

export default CardEmergency;


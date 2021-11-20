import React, { useState, useEffect } from 'react';
import { View, Dimensions, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
        console.log('trigger emergency');

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
        });
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
                    marginBottom: horizontal ? 0 : 16,
                },
                style
            ]}
        >
            <TouchableOpacity
                onPress={() => onPress(item)}
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    padding: 16,
                    backgroundColor: Color.textInput,
                    borderRadius: 8,
                }}
            >
                <Image
                    source={{uri: item.image}}
                    style={{marginTop:6, width: '25%', height: '50%', borderRadius: 8, backgroundColor: Color.border}}
                />

                <View style={{height: '100%', width: '75%', paddingLeft: 16}}>
                    <Text size={16} type='bold' align='left' numberOfLines={1}>{item.productName}</Text>
                    <View style={{alignItems: 'center', flexDirection: 'row', width: '100%', paddingTop: 8}}>
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

                    <View style={{width: '100%', flexDirection: 'row', paddingTop: 16}}>
                        <TouchableOpacity onPress={() => onSubmitLike(item)} style={{width: '50%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRightWidth:0.5}}>
                            {/* <Image
                                style={{ height:20, width:20 }}
                                source={im_like ? iconLiked : iconLike}
                            /> */}
                            <MaterialCommunityIcons
                                name={im_like ? 'rocket-launch' : 'rocket-launch-outline'}
                                color={im_like ? Color.success : Color.text}
                                size={18}
                            />
                            <Text style={{ paddingLeft: 4, marginBottom: 4}}>{like} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('CommentListScreen', { item })} style={{width: '50%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderLeftWidth:0.5}}>
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


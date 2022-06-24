import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Dimensions, Image } from 'react-native';
import Moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';

import ImagesPath from '../../components/ImagesPath';
import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';
import { queryAddLike } from 'src/lib/query';
import client from 'src/lib/apollo';

const { width } = Dimensions.get('window');

const defaultProps = {
    onPress: () => {},
    numColumns: 1,
    style: {},
    showAllText: false,
};

const CardForumVertical = ({ item, numColumns, onPress, onPressDot, showAllText, style }) => {
    const [like, setLike] = useState(item.like);
    const [im_like, setImLike] = useState(item.im_like);
    const [trigger, setTrigger] = useState(false);

    const { Color } = useColor();
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

        client.query({
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

    const extraPropsText = showAllText ? {} : { numberOfLines: 3 };
    
    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={[
                {
                    width: width - 32,
                    padding: 8,
                    marginBottom: 16,
                    borderRadius: 8,
                    backgroundColor: Color.textInput,
                    ...shadowStyle,
                },
                style,
            ]}
        >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                <View
                    style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}
                >
                    <View style={{ width: '10%', aspectRatio: 1, justifyContent: 'center' }}>
                        <Image 
                            source={{uri: item.avatar}}
                            style={{
                                width: '100%',
                                aspectRatio: 1,
                                borderRadius: 50,
                                backgroundColor: Color.primary,
                            }}
                        />
                    </View>

                    <View style={{ width: '80%', paddingHorizontal: 8 }}>
                        <Text type='bold' align='left' numberOfLines={2}>{item.fullname}</Text>
                        <View style={{flexDirection: 'row', marginTop: 4}}>
                            <Text size={8} align='left'>{Moment(parseInt(item.created_date, 10)).format('DD MMM YYYY, HH:mm')}</Text>
                        </View>
                    </View>

                    {typeof onPressDot === 'function' && <TouchableOpacity
                        onPress={() => onPressDot()}
                        style={{ width: '10%', aspectRatio: 1, alignItems: 'flex-end', justifyContent: 'center' }}
                    >
                        <MaterialCommunityIcons
                            name='dots-vertical'
                            color={Color.text}
                            size={18}
                        />
                    </TouchableOpacity>}
                </View>
            </View>

            <View style={{ marginBottom: 8}}>
                <Text size={14} align='left' type='medium' numberOfLines={2}>{item.productName}</Text>
            </View>

            <ImageBackground
                source={{uri: item.image}}
                style={{
                    width: '100%',
                    aspectRatio: 16/9,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginBottom: 8,
                }}
                imageStyle={{borderRadius: 8}}
            >
                <View style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 8}} />    
            </ImageBackground>

            <Text align='left' size={12} {...extraPropsText}>{item.productDescription}...</Text>

            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 16}}>
                <TouchableOpacity
                    onPress={() => onSubmitLike()}
                    style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                >
                    <AntDesign 
                        name={im_like ? 'heart' : 'hearto'}
                        size={22}
                        color={im_like ? Color.error : Color.gray}
                    />
                    <Text size={14} align='left' color={Color.gray} style={{marginLeft: 10}}>{like}</Text>
                </TouchableOpacity>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <MaterialCommunityIcons
                        name='comment-outline'
                        size={22}
                        color={Color.gray}
                    />
                    <Text size={14} align='left' color={Color.gray} style={{marginLeft: 10}}>{item.comment}</Text>
                </View>
                
                <TouchableOpacity
                    disabled
                    style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                >
                    <AntDesign 
                        name='eye'
                        size={22}
                        color={Color.gray}
                    />
                    <Text size={14} align='left' color={Color.gray} style={{marginLeft: 10}}>{item.view}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async() => {
                        await Share.open({
                            url: item.share_link,
                        });
                    }}
                    style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                >
                    <AntDesign 
                        name='sharealt'
                        size={22}
                        color={Color.gray}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

CardForumVertical.defaultProps = defaultProps;
export default CardForumVertical;
import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Dimensions, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Share from 'react-native-share';

import ImagesPath from '../../components/ImagesPath';
import {
    Col,
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';
import { queryAddLike } from 'src/lib/query';
import client from 'src/lib/apollo';

const { width } = Dimensions.get('window');

const defaultProps = {
    componentType: 'GENERAL',
    onPress: () => {},
    numColumns: 1,
    style: {},
};

const CardForumVertical = ({ componentType, item, numColumns, onPress, style }) => {
    const [like, setLike] = useState(item.like);
    const [im_like, setImLike] = useState(item.im_like);
    const [trigger, setTrigger] = useState(false);

    const { Color } = useColor();
    // const navigation = useNavigation();

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
                    style={{flexDirection: 'row', alignItems: 'center'}}
                >
                    <View style={{backgroundColor: Color.grayLight, width: 40, height: 40, borderRadius: 20, marginRight: 10}}>
                        <Image 
                            source={{uri: item.avatar}}
                            style={{
                                aspectRatio: 1,
                                borderRadius: 50,
                            }}
                        />
                    </View>
                    <View>
                        <Text size={14} type='bold' align='left'>{item.productName}</Text>
                        <View style={{flexDirection: 'row', marginTop: 4}}>
                            <Text size={8} align='left'>{item.fullname} - </Text>
                            <Text size={8} align='left'>{Moment(parseInt(item.created_date, 10)).fromNow()}</Text>
                        </View>
                    </View>
                </View>
                {/* <View style={{backgroundColor: Color.primary, paddingHorizontal: 16, paddingVertical: 6, marginTop: 8, borderRadius: 120, alignSelf: 'flex-start'}}>
                    <Text size={8} align='left' color={'#ffffff'}>+ Gabung</Text>
                </View> */}
            </View>

            <View style={{ marginBottom: 16}}>
                <Text size={14} align='left' numberOfLines={3}>{item.productDescription}...</Text>
            </View>

            <ImageBackground
                source={{uri: item.image}}
                style={{
                    width: '100%',
                    aspectRatio: 4/3,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginBottom: 16
                }}
                imageStyle={{borderRadius:10}}
            >
                <View style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 8}} />    
            </ImageBackground>

            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={() => onSubmitLike()}
                    style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                >
                    <AntDesign 
                        name='like2'
                        size={24}
                        color={im_like ? Color.info : Color.gray}
                    />
                    <Text size={14} align='left' color={Color.gray} style={{marginLeft: 10}}>{like}</Text>
                </TouchableOpacity>
                <View>
                    <Text align='left' size={16} color={Color.gray}>|</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Image 
                        source={ImagesPath.chat}
                    />
                    <Text size={14} align='left' color={Color.gray} style={{marginLeft: 10}}>{item.comment}</Text>
                </View>
                <View>
                    <Text align='left' size={16} color={Color.gray}>|</Text>
                </View>
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
                        size={24}
                        color={Color.gray}
                    />
                    <Text size={14} align='left' color={Color.gray} style={{marginLeft: 10}}>Share</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

CardForumVertical.defaultProps = defaultProps;
export default CardForumVertical;
import React, {useState} from 'react';
import { View, ImageBackground, Dimensions, Image,TextInput } from 'react-native';
import { Header } from '@src/components';
import {Divider} from 'src/styled';
import {useWindowDimensions} from 'react-native';
import { MainView } from '@src/styled';
import Octicons from 'react-native-vector-icons/Octicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
    Col,
    Scaffold,
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import ImagesPath from 'src/components/ImagesPath';
import moment from 'moment';
import { useSelector } from 'react-redux';

const CardChatEcommerce = ({item, type}) => { 
    const{Color} = useColor();
    const user = useSelector(state => state['user.auth'].login.user);
	const [userTarget, setUserTarget] = useState(item.users.find(item => item.user_id != user.userId));

    const onClick = () => {
        navigation.navigate('ChatDetail', {id: res.data.chat_room_id, merchant: detail.merchant});
    }

    var time = moment(item.created_unix_date).fromNow()
    if(item.last_chat){
        time = moment(item.last_chat.created_unix_date).fromNow();
    }

    if(time.includes("hari")){
        if(item.last_chat){
            time = moment(item.last_chat.created_unix_date).format("DD/MM HH:mm");
        }else{
            time = moment(item.created_unix_date).format("DD/MM HH:mm");
        }
    }else{
        if(item.last_chat){
            time = moment(item.last_chat.created_unix_date).format("HH:mm");
        }else{
            time = moment(item.created_unix_date).format("HH:mm");
        }
    }

    return(    
        <View style={{ flexDirection: 'row', marginVertical: 8, marginHorizontal: 16, justifyContent: 'space-between', }}>
            <View style={{ flexDirection: 'row'}}>
                <Image source={{uri: item.merchant.profile_img}} style={{ width: 48, aspectRatio: 1, borderRadius: 24 }}/>
                <View style={{ flexDirection: 'column', marginLeft: 8, width: '73%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Entypo name={'controller-record'} style={{ marginRight: 5 }} color={userTarget.is_online ? '#B8E271' : '#9CA3A5'}/>
                        <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: "bold" }}>{type === 'buyer' ? item.merchant.name : userTarget.first_name}</Text>
                        {type === 'buyer' &&
                            <Image source={ImagesPath.toko} style={{marginLeft: 8}}/>       
                        }
                    </View>
                    <Divider height={3}/>
                    {item.last_chat && 
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons name={'checkmark-done'} style={{ marginRight: 5 }} size={16} color={item.last_chat.is_readed ? '#80A9FA' : Color.placeholder}/>
                            <Text numberOfLines={1} align="left">{item.last_chat.chat_message}</Text>
                        </View>
                    }
                </View>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                <Text size={10}>{time}</Text>
                <Divider height={3}/>
                {item.unread_count > 0 && 
                    <View
                        style={{
                            width: 18,
                            height: 18,
                            backgroundColor: Color.error,
                            borderRadius: 9
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 10,
                                color: Color.textInput,
                                alignSelf: 'center',
                                paddingVertical: 1
                            }}
                        >
                            {item.unread_count}
                        </Text>
                    </View>
                }
            </View>
        </View>
    )
}

export default CardChatEcommerce;
import React from 'react';
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
import { shadowStyle } from '@src/styles';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import CardChat from './CardChat';
import CardChatExist from './CardChatExist';
import ImagesPath from 'src/components/ImagesPath';
import moment from 'moment';

const CardChatEcommerce = ({item}) => { 
    const{Color} = useColor();
    console.log(item, "iteeem");

    const onClick = () => {
        navigation.navigate('ChatDetail', {id: res.data.chat_room_id, merchant: detail.merchant});
    }

    var time = moment(item.created_unix_date).fromNow()
    if(item.last_chat){
        time = moment(item.last_chat.created_unix_date).fromNow();
    }

    if(time.length > 8){
        if(item.last_chat){
            time = moment(item.last_chat.created_unix_date).format("DD/MM HH:mm");
        }else{
            time = moment(item.created_unix_date).format("DD/MM HH:mm");
        }
    }

    return(    
        <View style={{ flexDirection: 'row', paddingVertical: 16.5, marginHorizontal: 16, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
                <Image source={{uri: item.merchant.profile_img}} style={{ width: 48, aspectRatio: 1, borderRadius: 24 }}/>
                <View style={{ flexDirection: 'column', marginLeft: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Entypo name={'controller-record'} style={{ marginRight: 5 }} />
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>{item.merchant.name}</Text>
                        <Image source={ImagesPath.toko} style={{marginLeft: 8}}/>       
                    </View>
                    {item.last_chat && 
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name={'checkmark-done'} style={{ marginRight: 5 }} size={16} color={item.last_chat.is_readed ? '#80A9FA' : Color.placeholder}/>
                            <Text>{item.last_chat.chat_message}</Text>
                        </View>
                    }
                </View>
            </View>
            <View>
                <Text size={10}>{time}</Text>
            </View>
        </View>
    )
}

export default CardChatEcommerce;
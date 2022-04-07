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

const CardChatEcommerce = ({ navigation, route }) => { 
    const{Color} = useColor();

    return(    
        <View>
            <View style={{ flexDirection: 'row', marginVertical: 16.5, marginHorizontal: 32.5 }}
             
            >
                    <Image source={ImagesPath.chatimage} />
                    <View style={{marginLeft:8,marginTop:4}}>
                        <Entypo name={'controller-record'} />
                        <Ionicons name={'checkmark-done'} style={{marginTop:10}}/>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Sumber Makmur  </Text>
                            <Image source={ImagesPath.toko}/>
                            
                        </View>
                        <View style={{ alignItems:'flex-start' }}>
                            <Text>Sip sip</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft:80}}>
                        <Text>10 jam</Text>
                    </View>
                </View>
        </View>
    )
}

export default CardChatEcommerce;
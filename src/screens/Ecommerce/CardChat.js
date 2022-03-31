import React from 'react';
import { View, ImageBackground, Dimensions, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagesPath from '../../components/ImagesPath'

import {
    Col,
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';

const CardChat = ({ }) => { 
    const {Color} = useColor();
    return(
         <View style={{width: '70%', height: '100%', alignItems: 'center', justifyContent: 'center',alignSelf:'center'}}>
            <Image
                source={ImagesPath.mail}
                style={{width: '100%', aspectRatio: 1, borderRadius: 30}}
            />
            <Text style={{ color: "#6A7479" }} >Kamu Belum Melakukan Chat Dengan Siapapun</Text>
         </View>
    )
}

export default CardChat;
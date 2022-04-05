import React from 'react';
import { View, ImageBackground, Dimensions, Image, Pressable } from 'react-native';
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

const { width } = Dimensions.get('window');

const defaultProps = {
    componentType: 'GENERAL',
    onPress: () => {},
    style: {},
};

const CardMerchant = (props) => {
    const {componentType, item, onPress, style} = props
    const {Color} = useColor()

    return (
        <Pressable
            style={{
                marginHorizontal: 16,
                backgroundColor: '#ffffff',
                marginBottom: 10,
                paddingVertical: 16,
                paddingHorizontal: 10,
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={{uri: item.profileImg}} style={{resizeMode: 'contain', width: 40, height: 40, marginVertical: 8}} />
                <View style={{marginLeft: 10}}>
                    <Text align='left' type='bold' style={{marginBottom: 6}}>{item.name}</Text>
                    <Text align='left' size={10} color={Color.placeholder}>{item.alamat}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text align='left' type='bold' color={Color.primary} size={12} style={{marginRight: 4}}>Lihat Toko</Text>
                <MaterialIcons 
                    name={'keyboard-arrow-right'}
                    size={16}
                    color={Color.primary}
                />
            </View>
        </Pressable>
    )
}

CardMerchant.defaultProps = defaultProps;

export default CardMerchant
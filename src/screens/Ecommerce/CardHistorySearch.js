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

const { width } = Dimensions.get('window');

const defaultProps = {
    componentType: 'GENERAL',
    onPress: () => {},
    style: {},
};

const CardHistorySearch = (props) => {
    const {componentType, item, onPress, style} = props
    const {Color} = useColor()
    
    return (
        <View 
            style={{
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingHorizontal: 16, 
                paddingVertical: 20, 
                borderTopWidth: 0.7,
                borderBottomWidth: 0.7,
                borderColor: Color.grayLight
            }}
        >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons
                    name={'history'}
                    color={Color.placeholder}
                    size={20}
                />
                <Text align='left' color={Color.placeholder} style={{marginLeft: 8}}>{item.name}</Text>
            </View>
            <Feather
                name={'arrow-up-right'}
                color={Color.primary}
                size={16}
            />
        </View>
    )
}

CardHistorySearch.defaultProps = defaultProps;

export default CardHistorySearch
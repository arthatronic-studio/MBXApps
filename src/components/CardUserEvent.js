import React from 'react';
import { View, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';

import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';

import ImagesPath from 'src/components/ImagesPath';

const { width } = Dimensions.get('window');

const defaultProps = {
    item: {},
    numColumns: 1,
    onPress: () => {},
    style: {},
};

const CardUserEvent = (props) => {

    const {item, numColumns, onPress, style} = props

    const {Color} = useColor()
    
    return (
        <TouchableOpacity
            style={[
                {
                    width: width / numColumns - 16,
                    marginBottom: 16
                },
                style,
            ]}
        >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={item.src} width={36} height={36} style={{marginRight: 16}} />
                <Text align= 'left' size={14}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )
}

CardUserEvent.defaultProps = defaultProps;

export default CardUserEvent
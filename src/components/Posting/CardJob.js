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

const { width } = Dimensions.get('window');

const defaultProps = {
    item: {},
    numColumns: 1,
    onPress: () => {},
    style: {},
};

const CardJob = (props) => {
    const { item, numColumns, onPress, style } = props;

    const { Color } = useColor();

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={[
                {
                    width: width / numColumns - 16,
                    paddingHorizontal: 8,
                    marginBottom: 16
                },
                style,
            ]}
        >
            <View style={{width: '100%', flexDirection: 'row', padding: 16, borderRadius: 4, backgroundColor: Color.textInput, ...shadowStyle}}>
                <View style={{width: '20%'}}>
                    <Image source={{uri: item.image}} style={{width: '80%', aspectRatio: 1, borderRadius: 50}} />
                </View>

                <View style={{width: '80%'}}>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text type='bold' size={16} align='left' numberOfLines={2}>{item.productName}</Text>
                        {/* <Ionicons name='bookmark-outline' size={20} color={Color.primary} /> */}
                    </View>

                    <View style={{paddingTop: 2}}>
                        <Text size={12} align='left' numberOfLines={2}>{item.productDescription}</Text>
                    </View>

                    {/* <View style={{paddingTop: 12, flexDirection: 'row'}}>
                        <Ionicons name='location' color={Color.error} style={{marginRight: 8}} />
                        <Text size={12} align='left'>Jakarta Selatan</Text>
                    </View> */}

                    <View style={{paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text size={12} color={Color.info}>{item.like} Pelamar</Text>
                        <Text size={12}>{Moment(parseInt(item.created_date)).fromNow()}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

CardJob.defaultProps = defaultProps;
export default CardJob;
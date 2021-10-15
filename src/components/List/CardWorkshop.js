import React from 'react';
import { View, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';

import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';
import { Divider } from '@src/styled';

const { width } = Dimensions.get('window');

const defaultProps = {
    onPress: () => {},
    numColumns: 1,
    horizontal: false,
    style: {},
};

const CardWorkshop = (props) => {
    const { item, numColumns, onPress, horizontal, style } = props;

    const { Color } = useColor();

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={[{width: width / numColumns - (horizontal ? 32 : 16), paddingHorizontal: 8, marginBottom: 16, borderRadius: 4}, style]}
        >
            <View style={{flexDirection: 'row', width: '100%', backgroundColor: Color.textInput, borderRadius: 4, ...shadowStyle}}>
                <Image
                    source={{uri: item.image}}
                    style={{width: '35%', aspectRatio: 9/16, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, backgroundColor: Color.border}}
                />

                <View style={{width: '65%', padding: 16, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: Color.textInput}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{width: 70, paddingVertical: 4, paddingHorizontal: 16, borderWidth: 0.5, borderRadius: 8, borderColor: Color.primary}}>
                            <Text size={10} color={Color.primary}>{item.productCategory}</Text>
                        </View>

                        {/* <Ionicons name='bookmark-outline' size={20} color={Color.primary} /> */}
                    </View>

                    <View style={{paddingTop: 8}}>
                        <Text type='bold' align='left' numberOfLines={2}>{item.productName}</Text>
                        <Divider height={6} />
                        <Text type='bold' size={12} align='left' color={Color.primary}>15 Juni 2021</Text>
                        <Divider height={6} />
                        <Text size={12} align='left' numberOfLines={2}>{item.productDescription}</Text>
                    </View>

                    <View style={{paddingTop: 24, flexDirection: 'row'}}>
                        <Foundation name='calendar' color={Color.yellow} style={{marginRight: 8}} />
                        <Text size={10} align='left'>3 Bulan</Text>
                    </View>

                    <View style={{paddingTop: 6, flexDirection: 'row'}}>
                        <Ionicons name='location' color={Color.error} style={{marginRight: 8}} />
                        <Text size={10} align='left'>Cilandak, Jakarta Selatan</Text>
                    </View>

                    <View style={{paddingTop: 6, flexDirection: 'row'}}>
                        <Ionicons name='information-circle-outline' color={Color.error} style={{marginRight: 8}} />
                        <Text size={10} align='left'>3 Hari lagi Pendaftaran Ditutup</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

CardWorkshop.defaultProps = defaultProps;

export default CardWorkshop;
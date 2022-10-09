import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';

const defaultProps = {
    numColumns: 2,
};

const CardTenantList = ({ item, index, numColumns }) => {
    const { Color } = useColor();
    const navigation = useNavigation();

    let orderNumber = (index + 1).toString();
    if (orderNumber.length <= 1) orderNumber = '0'+orderNumber;
    
    return (
        <View
            key={index}
            style={{ width: `${100/numColumns}%`, padding: 8 }}
        >
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('TenantDetailScreen', { item })
                }}
                style={{ width: '100%', flexDirection: 'row', borderBottomWidth: 1, paddingBottom: 12, paddingHorizontal: 16, borderColor: Color.primary }}
            >
                <View style={{justifyContent: 'center'}}>
                    <Text size={11} type='medium' color={Color.textSoft}>{orderNumber}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-start', paddingHorizontal: 32}}>
                    <Text size={18} type='medium' align='left'>{item.name}</Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                    <Text size={11} type='medium' color={Color.textSoft}>View</Text>
                    <View style={{ borderBottomWidth: 1, borderColor: Color.textSoft }} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

CardTenantList.defaultProps = defaultProps;
export default CardTenantList;
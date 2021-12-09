import React, { useState, useEffect } from 'react';
import { View, Dimensions, Image, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormatMoney, FormatDuration } from 'src/utils';

import {
    iconClock,
    iconScale,
  } from '@assets/images/home';

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

const CardSoonAuction = (props) => {
    const { item, numColumns, onPress, horizontal, style } = props;

    const { Color } = useColor();
    const navigation = useNavigation();

    return (
        <View
            style={[
                {
                    width: width / numColumns,
                    height: width / 4 + 12,
                    paddingHorizontal: 16,
                    marginBottom: 8,
                    // flex:1,
                    ...style,
                },
                style
            ]}>
            <View
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    width: '100%',
                    height: '100%',
                    flexDirection: 'row',
                    padding: 10,
                    alignItems: 'center',
                    borderColor: Color.border,
                }}>
                <Image source={{uri: item.image}} style={{marginBottom: 12, width: '20%', height: '85%', borderRadius: 4}} />
                <View style={{ flexDirection: 'column', marginLeft: 16, marginRight: 10, alignSelf: 'flex-start', width: '75%' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                        <Text style={{ width:'60%' }} size={16} color={Color.text} type='bold' align='left' numberOfLines={1}>{item.productName}</Text>
                        <View style={{ borderWidth: 0.7, borderColor: Color.timer, borderRadius: 120, paddingHorizontal: 6, paddingBottom: 2, justifyContent: 'center'}}>
                            <Text>2 Menit Lagi</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingTop: 2}}>
                        <Image source={iconScale} style={{ width: '6%', height: '100%', tintColor: Color.icon}}/>
                        <Text size={10} style={{ paddingLeft: 3, marginBottom: 2}}>kilogram</Text>
                        <Divider width={10} />
                        <Image source={iconClock} style={{ width: '6%', height: '100%', tintColor: Color.icon}}/>
                        <Text size={10} style={{ paddingLeft: 3, marginBottom: 2}}>13:05</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingTop: 8, justifyContent: 'space-between'}}>
                        <View style={{ flexDirection: 'column', marginVertical: 3, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                            <Text style={{ color: Color.text, opacity: 1 }} size={10}>Harga Permulaan</Text>
                            <Text style={{ color: Color.text, fontWeight: 'bold' }} size={18}>{FormatMoney.getFormattedMoney(50000)}</Text>
                        </View>
                        <TouchableOpacity onPress={() => onPress(item)}
                            style={{ 
                                backgroundColor: Color.primary,
                                borderRadius: 4,
                                paddingHorizontal: 30,
                                paddingVertical: 8
                             }}>
                                <Text color={Color.textInput} type='bold' size={16}>Lihat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

CardSoonAuction.defaultProps = defaultProps;

export default CardSoonAuction;
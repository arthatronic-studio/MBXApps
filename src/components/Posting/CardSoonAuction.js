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
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={[
                {
                    width: width / numColumns + 72,
                    marginHorizontal: 8,
                    marginBottom: 8,
                    borderWidth: 0.5,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: Color.border,
                    // flex:1,
                    ...style,
                }
            ]}>
            <Image source={{ uri: item.image }} style={{width: '25%', aspectRatio: 9/13, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: Color.border}} />
            <View style={{ flexDirection: 'column', marginVertical: 5, marginHorizontal: 6, alignSelf: 'flex-start', width: '70%'}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%'}}>
                    <Text style={{ width:'60%' }} size={12} color={Color.text} type='bold' align='left' numberOfLines={2}>{item.productName}</Text>
                    <View style={{width: '35%', borderWidth: 0.5, borderColor: Color.timer, borderRadius: 120, padding: 2, justifyContent: 'center'}}>
                        <Text size={9} numberOfLines={1}>13 Menit Lagi</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'flex-start'}}>
                    <Image source={iconScale} style={{ width: '6%', aspectRatio:4/5, tintColor: Color.icon}}/>
                    <View style={{ marginLeft: 3}}>
                        <Text size={8}>kilogram</Text>
                    </View>
                    <Divider width={10} />
                    <Image source={iconClock} style={{ width: '6%', aspectRatio:4/5, tintColor: Color.icon}}/>
                    <View style={{ marginLeft: 3}}>
                        <Text size={8}>13:05</Text>
                    </View>
                </View>
                <Divider height={10} />
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                        <Text style={{ color: Color.text, opacity: 1 }} size={8}>Harga Permulaan</Text>
                        <Text style={{ color: Color.text, fontWeight: 'bold' }} size={12}>{FormatMoney.getFormattedMoney(50000)}</Text>
                    </View>
                    {/* <TouchableOpacity onPress={() => onPress(item)}
                        style={{ 
                            backgroundColor: Color.primary,
                            borderRadius: 4,
                            paddingHorizontal: 15,
                            paddingVertical: 2
                            }}>
                            <Text color={Color.textInput} type='bold' size={16}>Lihat</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </TouchableOpacity>
    )
}

CardSoonAuction.defaultProps = defaultProps;

export default CardSoonAuction;
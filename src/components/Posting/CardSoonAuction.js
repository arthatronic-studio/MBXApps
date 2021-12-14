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
                    width: width / numColumns + 56,
                    height: width / 4,
                    marginHorizontal: 8,
                    marginBottom: 8,
                    borderWidth: 0.5,
                    borderRadius: 8,
                    flexDirection: 'row',
                    padding: 6,
                    alignItems: 'center',
                    borderColor: Color.border,
                    // flex:1,
                    ...style,
                }
            ]}>
            <Image source={{ uri: item.Image }} style={{width: '20%', aspectRatio: 3/4, borderRadius: 4}} />
            <View style={{ flexDirection: 'column', marginLeft: 8, marginRight: 10, alignSelf: 'flex-start', width: '75%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <Text style={{ width:'55%' }} size={16} color={Color.text} type='bold' align='left' numberOfLines={1}>testing 1 2 3 4 5</Text>
                    <View style={{width: '40%', borderWidth: 0.7, borderColor: Color.timer, borderRadius: 120, paddingHorizontal: 3, justifyContent: 'center'}}>
                        <Text size={10} numberOfLines={1}>13 Menit Lagi</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingTop: 2, justifyContent: 'flex-start'}}>
                    <Image source={iconScale} style={{ width: '6%', aspectRatio:3/4, tintColor: Color.icon}}/>
                    <Text size={10} style={{ paddingLeft: 3}}>kilogram</Text>
                    <Divider width={10} />
                    <Image source={iconClock} style={{ width: '6%', aspectRatio:3/4, tintColor: Color.icon}}/>
                    <Text size={10} style={{ paddingLeft: 3}}>13:05</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 6, justifyContent: 'space-between'}}>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                        <Text style={{ color: Color.text, opacity: 1 }} size={10}>Harga Permulaan</Text>
                        <Text style={{ color: Color.text, fontWeight: 'bold' }} size={16}>{FormatMoney.getFormattedMoney(50000)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => onPress(item)}
                        style={{ 
                            backgroundColor: Color.primary,
                            borderRadius: 4,
                            paddingHorizontal: 15,
                            paddingVertical: 2
                            }}>
                            <Text color={Color.textInput} type='bold' size={16}>Lihat</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

CardSoonAuction.defaultProps = defaultProps;

export default CardSoonAuction;
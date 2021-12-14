import React, { useState, useEffect } from 'react';
import { View, Dimensions, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormatMoney, FormatDuration } from 'src/utils';
import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';

const { width } = Dimensions.get('window');

const defaultProps = {
    onPress: () => {},
    numColumns: 1,
    horizontal: false,
    style: {},
};

const CardAuction = (props) => {
    const { item, numColumns, onPress, horizontal, style } = props;

    const { Color } = useColor();
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={[
                {
                    width: width / numColumns + 18,
                    paddingHorizontal: 8,
                    marginBottom: 1,
                    ...style,
                },
                style
            ]}
        >
            <ImageBackground 
                source={{ uri: item.image }} 
                resizeMode="cover" 
                style={{ 
                    justifyContent: "center",
                    width: '100%',
                    aspectRatio: 3/4,
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}
                imageStyle={{ borderRadius: 10}}
                >
                    <View 
                        style={{ 
                            flexDirection:'column',
                            justifyContent: 'space-between',
                            width: '100%',
                            aspectRatio: 3/4,
                            alignItems: 'flex-start',
                            borderRadius: 10, 
                            backgroundColor: Color.overflow
                        }}>
                        <View
                        style={{ flexDirection: 'row', paddingTop: 10, width: '100%', aspectRatio:7, justifyContent:'flex-end'}}>
                            <View
                                style={{
                                    marginHorizontal: 10,
                                    justifyContent: 'center',
                                    backgroundColor: Color.timer,
                                    width: '60%',
                                    height: '100%',
                                    alignItems:'center',
                                    borderRadius: 120,
                            }}>
                                <Text style={{ color: Color.textInput}} size={12} numberOfLines={1}>Tersisa {FormatDuration.getMinutesFromSeconds(10920)}</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10, flexDirection: 'column', justifyContent: 'space-between', alignItems:'flex-start' }}>
                            <View
                            style={{ flexDirection: 'row', paddingHorizontal: 15, width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Text size={14} color={Color.textInput} type='bold' align='left' numberOfLines={2}>testing 1 2 3 4 5 6 8 9 10 11 12 13 14 15 16 17 18</Text>
                            </View>
                            <View
                            style={{ flexDirection: 'row', paddingTop: 8, paddingHorizontal: 15, width: '100%', alignItems:'center', justifyContent:'space-between'}}>
                                <View
                                style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%'}}>
                                    <Text style={{ color: Color.textInput, opacity: 0.7}} size={10}>Harga Permulaan</Text>
                                    <Text style={{ color: Color.textInput, fontWeight: 'bold', marginTop: 2}} size={14}>{FormatMoney.getFormattedMoney(500000000000)}</Text>
                                </View>
                                {/* <TouchableOpacity onPress={() => onPress(item)}
                                style={{ 
                                    backgroundColor: Color.primary,
                                    width: '35%',
                                    height: '60%',
                                    borderRadius: 4, 
                                }}>
                                    <Text color={Color.textInput} size={16}>Lihat</Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}

CardAuction.defaultProps = defaultProps;

export default CardAuction;
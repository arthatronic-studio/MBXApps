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
        <View
            style={[
                {
                    width: width / numColumns + 18,
                    paddingHorizontal: 8,
                    marginBottom: 1,
                    // flex:1,
                    ...style,
                },
                style
            ]}
        >
            <View style={{ flex: 1 }}>
                <ImageBackground 
                    source={{ uri: item.image }} 
                    resizeMode="cover" 
                    style={{ 
                        justifyContent: "center",
                        width: '100%',
                        aspectRatio: 3/4,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                    }}
                    imageStyle={{ borderRadius: 10}}
                    >
                        <View 
                            style={{ 
                                justifyContent: "center",
                                width: '100%',
                                aspectRatio: 3/4,
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                borderRadius: 10, 
                                backgroundColor: Color.overflow
                            }}>
                            <View
                            style={{ flexDirection: 'row', paddingTop: 10, width: '100%', height:30, paddingRight: 10, justifyContent:'flex-end'}}>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        backgroundColor: Color.timer,
                                        width: '60%',
                                        height: '100%',
                                        borderRadius: 120,
                                }}>
                                    <Text style={{ color: Color.textInput, paddingBottom: 4, paddingleft: 6}} size={12}>Tersisa {FormatDuration.getMinutesFromSeconds(10920)}</Text>
                                </View>
                            </View>
                            <View
                            style={{ flexDirection: 'row', paddingTop: 135, paddingHorizontal: 15, width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Text size={18} color={Color.textInput} type='bold' align='left' numberOfLines={1}>{item.productName}</Text>
                            </View>
                            <View
                            style={{ flexDirection: 'row', paddingTop: 10, paddingHorizontal: 15, width: '100%', alignItems:'flex-end'}}>
                                <View
                                style={{ flexDirection: 'column', alignItems: 'flex-start'}}>
                                    <Text style={{ color: Color.textInput, opacity: 0.7}} size={10}>Harga Permulaan</Text>
                                    <Text style={{ color: Color.textInput, fontWeight: 'bold', marginTop: 2}} size={18}>{FormatMoney.getFormattedMoney(50000)}</Text>
                                </View>
                                <TouchableOpacity onPress={() => onPress(item)}
                                style={{ 
                                    backgroundColor: Color.primary,
                                    width: '40%',
                                    height: '80%',
                                    borderRadius: 4,
                                    marginLeft: 23 
                                }}>
                                    <Text style={{ color: Color.textInput, marginVertical: 2, marginHorizonal: 5}} size={16}>Lihat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </ImageBackground>
            </View>
        </View>
    )
}

CardAuction.defaultProps = defaultProps;

export default CardAuction;
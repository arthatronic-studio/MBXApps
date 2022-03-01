import React from 'react';
import { View, Dimensions, Image } from 'react-native';
import {
    Text,
    useColor
} from '@src/components';
import { FormatMoney } from 'src/utils';

const { width } = Dimensions.get('window');

const defaultProps = {
    item: {},
    style: {},
};

const CardBidder = (props) => {
    const { item, numColumns, horizontal, onPress, style, index } = props;

    const { Color } = useColor();

    return (
        <View
            style={{
                width: '100%',
                ...style,
                borderBottomWidth: 1,
                backgroundColor: Color.theme,
                borderColor: Color.border
            }}
        >
            <View 
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 26, paddingVertical: 24, width:'100%', alignItems: 'center' }}>
                <View
                    style={{ flexDirection:'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text size={14} style={{ color: Color.text }}>{index+1}</Text>
                    <View
                        style={{ flexDirection:'row', justifyContent: 'flex-start', marginLeft: 20, alignItems:'center' }}>
                        <Image source={{uri: ''}}
                        style={{ width: '30%', aspectRatio: 1, borderRadius: 50, backgroundColor: Color.border }}
                        />
                        <View
                        style={{ flexDirection:'column', justifyContent: 'flex-start', marginLeft: 10, alignItems: 'flex-start' }}>
                            <Text size={8} style={{ color: Color.text }}>Nama Penawar</Text>
                            <Text size={14} lineHeight={20} style={{ color: Color.text}}>{item.name}.</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{ flexDirection:'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <Text size={8} style={{ color: Color.text }}>Jumlah Penawaran</Text>
                    <Text size={14} type='bold' style={{ color: Color.text}}>{FormatMoney.getFormattedMoney(item.bid)}</Text>
                </View>
            </View>
        </View>
    )
}

CardBidder.defaultProps = defaultProps;

export default CardBidder;
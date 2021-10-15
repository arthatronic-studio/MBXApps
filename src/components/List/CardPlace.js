import React from 'react';
import { View, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';
import { Divider } from '@src/styled';

const { width } = Dimensions.get('window');

const defaultProps = {
    item: {},
    numColumns: 1,
    horizontal: false,
    onPress: () => {},
    style: {},
};

const CardPlace = (props) => {
    const { item, numColumns, horizontal, onPress, style } = props;

    const { Color } = useColor();

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={{
                width: width / numColumns - (horizontal ? 16 : 8),
                paddingHorizontal: 8,
                marginBottom: 16,
                ...style,
            }}
        >
            <View style={{
                backgroundColor: Color.textInput,
                ...shadowStyle,
            }}>
                <Image
                    source={{uri: item.image}}
                    style={{
                        width: '100%',
                        aspectRatio: 3/2,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        backgroundColor: Color.border,
                    }}
                />

                <View style={{width: '100%', padding: 16, backgroundColor: Color.textInput, borderBottomLeftRadius: 4, borderBottomRightRadius: 4}}>
                    <Text type='bold' align='left' numberOfLines={2}>{item.productName}</Text>
                    <Divider height={4} />
                    <Text size={12} align='left' numberOfLines={2} lineHeight={16}>{item.productDescription}</Text>
                    <Divider />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Ionicons name='star' color={Color.yellow} />
                            <Text size={12}>{item.like}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text size={12} color={Color.primary}>Lihat Tempat</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

CardPlace.defaultProps = defaultProps;

export default CardPlace;
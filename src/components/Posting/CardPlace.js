import React from 'react';
import { View, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';
import { Divider, Row } from '@src/styled';

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
                    <Text size={12} type='bold' align='left' numberOfLines={2}>{item.productName}</Text>
                    <Divider height={4} />
                    <Row>
                        <View style={{width: 16}}>
                            <Ionicons name='person' color={Color.text} />
                        </View>
                        <Text size={12} align='left' numberOfLines={2}>{item.fullname}</Text>
                    </Row>
                    <Divider />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text size={12}>{item.like}&nbsp;</Text>
                            <Ionicons
                                name={item.im_like ? 'heart' : 'heart-outline'}
                                color={Color.primary}
                            />
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text size={12}>{item.comment > 0 ? item.comment + ' Komentar' : 'Beri Komentar'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

CardPlace.defaultProps = defaultProps;
export default CardPlace;
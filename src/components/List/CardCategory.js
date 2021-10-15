import React from 'react';
import { View, ImageBackground, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';

const { width } = Dimensions.get('window');

const defaultProps = {
    item: {},
    onPress: () => {},
    numColumns: 1,
    style: {},
};

const CardCategory = (props) => {
    const { item, numColumns, onPress, style } = props;

    const { Color } = useColor();

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={[{width: width / numColumns - 6, paddingHorizontal: 8, marginBottom: 16, borderRadius: 4}, style]}
        >
            <ImageBackground
                source={{uri: item.image}}
                style={{
                    width: '100%',
                    aspectRatio: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    borderRadius: 16,
                    backgroundColor: Color.border,
                    ...shadowStyle,
                }}
                imageStyle={{borderRadius: 16}}
            >
                <View style={{height: 40, width: '100%', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}>
                    <Text size={12}>{item.productName}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}

CardCategory.defaultProps = defaultProps;

export default CardCategory;
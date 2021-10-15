import React from 'react';
import { View, ImageBackground, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';

const { width } = Dimensions.get('window');

const defaultProps = {
    onPress: () => {},
    numColumns: 1,
    style: {},
};

const CardGrowCategory = (props) => {
    const { item, numColumns, onPress, style } = props;

    const { Color } = useColor();

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={[{width: width / numColumns - 16, marginRight: 16, marginBottom: 16, borderRadius: 4}, style]}
        >
            <ImageBackground
                source={{uri: item.image}}
                style={{
                    width: '100%',
                    aspectRatio: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 16,
                    backgroundColor: Color.textInput,
                    ...shadowStyle,
                }}
                blurRadius={2}
                imageStyle={{borderRadius: 16}}
            >
                <MaterialIcons name='computer' size={30} color={Color.primary} />
                <Text size={10} type='semibold' color={Color.primary} style={{marginTop: 4}}>{item.productName}</Text>
            </ImageBackground>
        </TouchableOpacity>
    )
}

CardGrowCategory.defaultProps = defaultProps;

export default CardGrowCategory;
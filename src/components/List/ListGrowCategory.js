import React from 'react';
import { View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useColor } from '@src/components';
import Text from '@src/components/Text';
import CardGrowCategory from '@src/components/List/CardGrowCategory';

const defaultProps = {
    data: [],
    title: '',
    // additional
    showAll: true,
    onPress: () => {},
    onPressShowAll: () => {},
    showHeader: true,
}

const ListGrowCategory = (props) => {
    const {
        data, title,
        showAll, onPressShowAll, onPress, showHeader,
    } = props;

    const { Color } = useColor();

    return (
        <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 8}}>
            <FlatList
                key='ListGrowthCategory'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingLeft: 8}}
                renderItem={({ item, index }) => {
                    return (
                        <CardGrowCategory
                            item={item}
                            numColumns={4}
                            onPress={() => onPress(item)}
                        />
                    )
                }}
            />
        </View>
    )
}

ListGrowCategory.defaultProps = defaultProps;

export default ListGrowCategory;
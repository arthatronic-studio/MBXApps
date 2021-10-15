import React from 'react';
import { View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useColor } from '@src/components';
import Text from '@src/components/Text';
import CardCategory from '@src/components/List/CardCategory';

const defaultProps = {
    data: [],
    title: '',
    // additional
    showAll: true,
    onPress: () => {},
    onPressShowAll: () => {},
    showHeader: true,
}

const ListCategory = (props) => {
    const {
        data, title,
        showAll, onPressShowAll, onPress, showHeader,
    } = props;

    const { Color } = useColor();

    return (
        <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 8}}>
            {showHeader && <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, paddingTop: 24, paddingHorizontal: 8}}>
                <Text type='semibold' size={12}>{title}</Text>
                {showAll && <Text onPress={() => onPressShowAll()} size={12} color={Color.primary}>Lihat Semua <Ionicons name='chevron-forward' size={12} color={Color.primary} /></Text>}
            </View>}
            <FlatList
                key='ListCategory'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{}}
                renderItem={({ item, index }) => {
                    return (
                        <CardCategory
                            item={item}
                            numColumns={3}
                            onPress={() => onPress(item)}
                        />
                    )
                }}
            />
        </View>
    )
}

ListCategory.defaultProps = defaultProps;

export default ListCategory;
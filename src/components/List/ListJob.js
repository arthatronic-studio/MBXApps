import React from 'react';
import { View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useColor } from '@src/components';
import Text from '@src/components/Text';
import CardJob from 'src/components/List/CardJob';

const defaultProps = {
    data: [],
    horizontal: false,
    showAll: true,
    onPress: () => {},
    style: {},
    // additional
    onPressShowAll: () => {},
    showHeader: true,
};

const ListJob = (props) => {
    const {
        data, title, showAll, horizontal, style,
        onPress, onPressShowAll, showHeader,
    } = props;

    const { Color } = useColor();

    return (
        <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 8}}>
            <FlatList
                key='ListJob'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                numColumns={1}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 8, paddingBottom: 136, ...style}}
                renderItem={({ item, index }) => {
                    if (index === 0) {
                        return (
                            <>
                                {showHeader && <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, paddingHorizontal: 16}}>
                                    <Text type='bold' size={12}>{title}</Text>
                                    {showAll && <Text onPress={() => onPressShowAll()} size={12} color={Color.primary}>Lihat Semua <Ionicons name='arrow-forward' size={12} color={Color.primary} /></Text>}
                                </View>}

                                <CardJob
                                    item={item}
                                    numColumns={1}
                                    onPress={() => onPress(item)}
                                />
                            </>
                        )
                    }

                    return (
                        <CardJob
                            item={item}
                            numColumns={1}
                            onPress={() => onPress(item)}
                        />
                    )
                }}
            />
        </View>
    )
}

ListJob.defaultProps = defaultProps;

export default ListJob;
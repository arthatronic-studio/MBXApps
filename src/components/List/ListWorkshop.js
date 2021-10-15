import React from 'react';
import { View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useColor } from '@src/components';
import Text from '@src/components/Text';
import CardWorkshop from 'src/components/List/CardWorkshop';
import ListGrowCategory from '@src/components/List/ListGrowCategory';

const defaultProps = {
    data: [],
    subData: [],
    horizontal: false,
    onPress: () => {},
    style: {},
    // additional
    showAll: true,
    onPressShowAll: () => {},
    showHeader: true,
}

const ListWorkshop = (props) => {
    const {
        data, subData, horizontal, onPress, style,
        showAll, onPressShowAll, showHeader,
    } = props;

    const { Color } = useColor();

    return (
        <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 8}}>
            <FlatList
                key='ListWorkshop'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                numColumns={1}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingLeft: 8, paddingBottom: 136, ...style}}
                renderItem={({ item, index }) => {
                    if (index === 0) {
                        return (
                            <>
                                {/* <ListGrowCategory
                                    title='Kategori Favorit Kamu'
                                    data={subData}
                                /> */}

                                {showHeader && <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, paddingHorizontal: 16}}>
                                    <Text type='bold' size={12}>{item.title}</Text>
                                    {showAll && <Text onPress={() => onPressShowAll()} size={12} color={Color.primary}>Lihat Semua <Ionicons name='arrow-forward' size={12} color={Color.primary} /></Text>}
                                </View>}

                                <CardWorkshop
                                    item={item}
                                    numColumns={1}
                                    horizontal={horizontal}
                                    onPress={() => onPress(item)}
                                />
                            </>
                        )
                    }

                    return (
                        <CardWorkshop
                            item={item}
                            numColumns={1}
                            horizontal={horizontal}
                            onPress={() => onPress(item)}
                        />
                    )
                }}
            />
        </View>
    )
}

ListWorkshop.defaultProps = defaultProps;

export default ListWorkshop;
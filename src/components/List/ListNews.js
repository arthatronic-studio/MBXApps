import React from 'react';
import { View, FlatList } from 'react-native';

import CardNews from 'src/components/List/CardNews';
import ListCategory from '@src/components/List/ListCategory';

const defaultProps = {
    data: [],
    subData: [],
    horizontal: false,
    style: {},
    // additinal
    showAll: true,
    onPress: () => {},
    onPressShowAll: () => {},
    showHeader: true,
}

const ListNews = (props) => {
    const {
        data, subData, horizontal, style,
        title, showAll, onPressShowAll, onPress, showHeader,
    } = props;

    return (
        <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 8}}>
            <FlatList
                key='ListNews'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                numColumns={1}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingTop: 16, paddingHorizontal: 8, ...style}}
                renderItem={({ item, index }) => {
                    if (index === 0 && horizontal === false) {
                        return (
                            <>
                                <ListCategory
                                    title='Kategori Favorit Kamu'
                                    data={subData}
                                />

                                <CardNews
                                    item={item}
                                    numColumns={1}
                                    horizontal={horizontal}
                                    onPress={() => onPress(item)}
                                />
                            </>
                        )
                    }

                    return (
                        <CardNews
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

ListNews.defaultProps = defaultProps;

export default ListNews;
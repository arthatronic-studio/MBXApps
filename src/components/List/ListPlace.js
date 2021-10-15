import React from 'react';
import { View, FlatList } from 'react-native';

import CardPlace from 'src/components/List/CardPlace';
import ListCategory from '@src/components/List/ListCategory';

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

const ListPlace = (props) => {
    const {
        data, subData, horizontal, style, onPress,
        showAll, onPressShowAll, showHeader,
    } = props;

    let extraProps = { numColumns: 2 };
    if (horizontal) extraProps = {};

    return (
        <View style={{flex: 1, paddingBottom: 8, paddingTop: showHeader ? 0 : 8}}>
            <FlatList
                key='ListPlace'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                {...extraProps}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                // ListHeaderComponent={
                //     <ListCategory
                //         title='Kategori Favorit Kamu'
                //         data={subData}
                //     />
                // }
                contentContainerStyle={{paddingTop: 16, paddingHorizontal: 8, ...style}}
                renderItem={({ item, index }) => {
                    // if (index === 0) {
                    //     return (
                    //         <>
                    //             <ListCategory
                    //                 title='Kategori Favorit Kamu'
                    //                 data={subData}
                    //             />

                    //             <CardPlace
                    //                 item={item}
                    //                 numColumns={2}
                    //                 horizontal={horizontal}
                    //                 onPress={() => onPress(item)}
                    //             />
                    //         </>
                    //     )
                    // }

                    return (
                        <CardPlace
                            item={item}
                            numColumns={2}
                            horizontal={horizontal}
                            onPress={() => onPress(item)}
                        />
                    )
                }}
            />
        </View>
    )
}

ListPlace.defaultProps = defaultProps;

export default ListPlace;
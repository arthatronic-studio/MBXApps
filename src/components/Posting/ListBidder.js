import React from 'react';
import { View, FlatList, Text} from 'react-native';

import CardBidder from './CardBidder';
import HeaderBid from './HeaderBid';

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

const ListBidder = (props) => {
    const {
        data, subData, horizontal, style, onPress,
        showAll, onPressShowAll, showHeader, item
    } = props;

    return (
        <View style={{flex: 1, paddingTop: showHeader ? 0 : 8}}>
            <FlatList
                key='ListBidder'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{...style}}
                ListHeaderComponent={<HeaderBid item={item}/>}
                renderItem={({ item, index }) => {
                    return (
                        <CardBidder
                            item={item}
                            index={index}
                            // numColumns={2}
                            // horizontal={horizontal}
                            // onPress={() => onPress(item)}
                        />
                    )
                }}
            />
        </View>
    )
}

ListBidder.defaultProps = defaultProps;

export default ListBidder;
import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';

import CardNews from 'src/components/Posting/CardNews';
import { useColor } from '@src/components';
import { useNavigation } from '@react-navigation/core';
import HeaderPost from './HeaderPost';

const propTypes = {
    data: PropTypes.array,
    horizontal: PropTypes.bool,
    style: PropTypes.object,
    onPress: PropTypes.func,
    showHeader: PropTypes.bool,
}

const defaultProps = {
    data: [],
    horizontal: false,
    style: {},
    onPress: () => {},
    showHeader: true,
}

const ListNews = (props) => {
    const {
        data, horizontal, style, onPress, showHeader,
    } = props;

    const {Color} = useColor();
    const navigation = useNavigation();

    const renderHeader = () => {
        return (
            <HeaderPost
                title='Postingan Artikel'
                onSeeAllPress={() => {
                    navigation.navigate('NewsScreen', {title: 'Postingan Artikel'})
                }}
            />
        )
    }

    return (
        <View style={{paddingBottom: 8}}>
            {showHeader && renderHeader()}

            <FlatList
                key='ListNews'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                numColumns={1}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingTop: 16, paddingHorizontal: 8, ...style}}
                renderItem={({ item, index }) => {
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

ListNews.propTypes = propTypes;
ListNews.defaultProps = defaultProps;
export default ListNews;
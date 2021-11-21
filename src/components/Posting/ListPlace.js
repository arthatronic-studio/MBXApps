import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';

import CardPlace from 'src/components/Posting/CardPlace';
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
    onPress: () => {},
    style: {},
    showHeader: true,
}

const ListPlace = (props) => {
    const {
        data, horizontal, style, onPress, showHeader,
    } = props;

    const {Color} = useColor();
    const navigation = useNavigation();

    let extraProps = { numColumns: 2 };
    if (horizontal) extraProps = {};

    const renderHeader = () => {
        return (
            <HeaderPost
                title='Tempat Terdekat'
                onSeeAllPress={() => {
                    navigation.navigate('PlaceScreen', {title: 'Tempat Terdekat'})
                }}
            />
        )
    }

    return (
        <View style={{paddingBottom: 8}}>
            {showHeader && renderHeader()}

            <FlatList
                key='ListPlace'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                {...extraProps}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingTop: 16, paddingHorizontal: 8, ...style}}
                renderItem={({ item, index }) => {
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

ListPlace.propTypes = propTypes;
ListPlace.defaultProps = defaultProps;
export default ListPlace;
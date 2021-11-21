import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';

import { useColor } from '@src/components';
import CardEmergency from './CardEmergency';
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

const ListEmergency = (props) => {
    const {
        data, horizontal, style, onPress, showHeader,
    } = props;

    const { Color } = useColor();
    const navigation = useNavigation();

    const renderHeader = () => {
        return (
            <HeaderPost
                title='Emergency Area'
                onSeeAllPress={() => {
                    navigation.navigate('EmergencyScreen', {title: 'Emergency Area'})
                }}
            />
        )
    }

    return (
        <View style={{paddingBottom: 8}}>
            {showHeader && renderHeader()}

            <FlatList
                key='ListEmergency'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                numColumns={1}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingTop: 16, paddingHorizontal: 8, ...style}}
                renderItem={({ item, index }) => {
                    return (
                        <CardEmergency
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

ListEmergency.propTypes = propTypes;
ListEmergency.defaultProps = defaultProps;
export default ListEmergency;
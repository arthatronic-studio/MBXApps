import React from 'react';
import { View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CardPlace from 'src/components/List/CardPlace';
import {
    Text,
    TouchableOpacity,
    HeaderBig,
    Loading,
    useLoading,
    useColor,
} from '@src/components';
import { useNavigation } from '@react-navigation/core';

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
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                }}>
                <Text type="bold">Tempat Terdekat</Text>
                <Text
                    onPress={() => navigation.navigate('PlaceScreen')}
                    size={12}
                    color={Color.primary}>
                    Lihat Semua{' '}
                    <Ionicons name="arrow-forward" size={12} color={Color.primary} />
                </Text>
            </View>
        )
    }

    return (
        <View style={{flex: 1, paddingBottom: 8, paddingTop: showHeader ? 0 : 0}}>
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

ListPlace.defaultProps = defaultProps;
export default ListPlace;
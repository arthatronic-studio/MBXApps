import React from 'react';
import { View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useColor } from '@src/components';
import Text from '@src/components/Text';
import CardWorkshop from 'src/components/List/CardWorkshop';
import { useNavigation } from '@react-navigation/core';

const defaultProps = {
    data: [],
    horizontal: false,
    onPress: () => {},
    style: {},
    showHeader: true,
}

const ListWorkshop = (props) => {
    const {
        data, horizontal, onPress, style, showHeader,
    } = props;

    const { Color } = useColor();
    const navigation = useNavigation();

    const renderHeader = () => {
        return (
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingBottom: 8,
                }}>
                <Text type="bold">Event Terbaru</Text>
                <Text
                    onPress={() => navigation.navigate('WorkshopScreen')}
                    size={12}
                    color={Color.primary}>
                    Lihat Semua{' '}
                    <Ionicons name="arrow-forward" size={12} color={Color.primary} />
                </Text>
            </View>
        )
    }

    return (
        <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 16}}>
            {showHeader && renderHeader()}

            <FlatList
                key='ListWorkshop'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                numColumns={1}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingTop: 8, paddingLeft: 8, paddingBottom: 136, ...style}}
                renderItem={({ item, index }) => {
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
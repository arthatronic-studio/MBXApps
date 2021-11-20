import React from 'react';
import { View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useColor } from '@src/components';
import Text from '@src/components/Text';
import CardEmergency from './CardEmergency';
import { useNavigation } from '@react-navigation/core';

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
            <View
                style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                marginBottom: 8,
            }}>
                <Text type="bold">Emergency Area</Text>
                <Text
                    onPress={() => {
                        navigation.navigate('EmergencyScreen', {title: 'Emergency Area'})
                    }}
                    size={12}
                    color={Color.primary}
                >
                    Lihat Semua{' '}
                    <Ionicons name="arrow-forward" size={12} color={Color.primary} />
                </Text>
            </View>
        )
    }

    return (
        <View style={{paddingBottom: 8, paddingTop: showHeader ? 8 : 8}}>
            {showHeader && renderHeader()}

            <FlatList
                key='ListEmergency'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                numColumns={1}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingTop: 8, paddingHorizontal: 8, alignItems: 'center', ...style}}
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

ListEmergency.defaultProps = defaultProps;

export default ListEmergency;
import React from 'react';
import { View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CardNews from 'src/components/List/CardNews';
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
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    marginTop: 30,
                }}>
                <Text type="bold">Postingan Artikel</Text>
                <Text
                    onPress={() => {
                        navigation.navigate('NewsScreen', {title: 'Postingan Artikel'})
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
        <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 0}}>
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

ListNews.defaultProps = defaultProps;
export default ListNews;
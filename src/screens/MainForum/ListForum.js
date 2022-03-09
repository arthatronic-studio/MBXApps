import React from 'react';
import { View, FlatList } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useColor } from '@src/components';
import Text from '@src/components/Text';
import CardForum from '@src/screens/MainForum/CardForum';

const MainView = Styled(View)`
    width: 100%;
    height: 100%;
`;

const defaultProps = {
    componentType: 'GENERAL', // GENERAL | LIST | GRID
    showAll: false,
    onPress: () => {},
    onPressShowAll: () => {},
    showHeader: true,
}

const ListForum = (props) => {
    const { componentType, data, title, showAll, onPressShowAll, onPress, showHeader } = props;

    const { Color } = useColor();

    if (componentType === 'LIST') {
        return (
            <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 8}}>
                {showHeader && <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, paddingTop: 24, paddingHorizontal: 16}}>
                    <Text type='semibold' size={12}>{title}</Text>
                    {showAll && <Text onPress={() => onPressShowAll()} size={12} color={Color.primary}>Lihat Semua <Ionicons name='arrow-forward' size={12} color={Color.primary} /></Text>}
                </View>}
                <View style={{marginLeft: 16}}>
                    <FlatList
                        key={componentType}
                        keyExtractor={(item, index) => item.toString() + index}
                        data={data}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{}}
                        renderItem={({ item, index }) => {
                            return (
                                <CardForum
                                    componentType={componentType}
                                    item={item}
                                    onPress={() => onPress(item)}
                                />
                            )
                        }}
                    />
                </View>
            </View>
        )
    }

    if (componentType === 'GRID') {
        return (
            <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 8}}>
                {showHeader && <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, paddingTop: 24, paddingHorizontal: 16}}>
                    <Text type='semibold' size={12}>{title}</Text>
                    {showAll && <Text onPress={() => onPressShowAll()} size={12} color={Color.primary}>Lihat Semua <Ionicons name='arrow-forward' size={12} color={Color.primary} /></Text>}
                </View>}
                <View style={{marginLeft: 8}}>
                    <FlatList
                        key={componentType}
                        keyExtractor={(item, index) => item.toString() + index}
                        data={data}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{paddingHorizontal: 8}}
                        renderItem={({ item, index }) => {
                            if (index === (data.length - 1) && data.length > 5) {
                                return (
                                    <CardForum
                                        componentType='SHOW_ALL'
                                        item={item}
                                        numColumns={2}
                                        onPress={() => onPressShowAll(item)}
                                    />
                                )
                            }

                            return (
                                <CardForum
                                    componentType={componentType}
                                    item={item}
                                    numColumns={2}
                                    onPress={() => onPress(item)}
                                />
                            )
                        }}
                    />
                </View>
            </View>
        )
    }

    return (
        <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 8}}>
            {showHeader && <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, paddingTop: 24, paddingHorizontal: 16}}>
                <Text type='semibold' size={12}>{title}</Text>
                {showAll && <Text onPress={() => onPressShowAll()} size={12} color={Color.primary}>Lihat Semua <Ionicons name='arrow-forward' size={12} color={Color.primary} /></Text>}
            </View>}
            <View style={{marginLeft: 8}}>
                <FlatList
                    key={componentType}
                    keyExtractor={(item, index) => item.toString() + index}
                    data={data}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 8}}
                    renderItem={({ item, index }) => {
                        return (
                            <CardForum
                                componentType={componentType}
                                item={item}
                                numColumns={2}
                                onPress={() => onPress(item)}
                            />
                        )
                    }}
                />
            </View>
        </View>
    )
}

ListForum.defaultProps = defaultProps;

export default ListForum;
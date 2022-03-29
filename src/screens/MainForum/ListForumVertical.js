import React from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ScreenEmptyData, ScreenIndicator, useColor } from '@src/components';
import Text from '@src/components/Text';
import CardForumVertical from '@src/screens/MainForum/CardForumVertical';
import { Container } from 'src/styled';

const defaultProps = {
    componentType: 'GENERAL', // GENERAL | LIST | GRID
    showAll: false,
    onPress: () => {},
    onPressShowAll: () => {},
    showHeader: true,
    data: [],
    loading: false,
}

const ListForumVertical = ({ componentType, data, loading, title, showAll, onPressShowAll, onPress, showHeader }) => {
    const { Color } = useColor();
    const { height } = useWindowDimensions();

    return (
        <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 8}}>
            {showHeader && <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, paddingTop: 24, paddingHorizontal: 16}}>
                <Text type='semibold' size={12}>{title}</Text>
                {showAll && <Text onPress={() => onPressShowAll()} size={12} color={Color.primary}>Lihat Semua <Ionicons name='arrow-forward' size={12} color={Color.primary} /></Text>}
            </View>}
            
            {loading ?
                <Container paddingTop={height / 3}>
                    <ScreenIndicator transparent />
                </Container>
            :
                <FlatList
                    key={componentType}
                    keyExtractor={(item, index) => item.toString() + index}
                    data={data}
                    contentContainerStyle={{paddingHorizontal: 16, paddingTop: 16}}
                    renderItem={({ item, index }) => {
                        return (
                            <CardForumVertical
                                componentType={componentType}
                                item={item}
                                numColumns={2}
                                onPress={() => onPress(item)}
                            />
                        )
                    }}
                    ListEmptyComponent={() => {
                        return <ScreenEmptyData style={{marginTop: height / 6}} message='Belum ada postingan, Tekan tombol + untuk menambahkan' />
                    }}
                />
            }
        </View>
    )
}

ListForumVertical.defaultProps = defaultProps;
export default ListForumVertical;
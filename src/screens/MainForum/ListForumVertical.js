import React from 'react';
import { View, FlatList } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useColor } from '@src/components';
import Text from '@src/components/Text';
import CardForumVertical from '@src/screens/MainForum/CardForumVertical';

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

const ListForumVertical = ({ componentType, data, title, showAll, onPressShowAll, onPress, showHeader }) => {
    const { Color } = useColor();

    return (
        <View style={{paddingBottom: 8, paddingTop: showHeader ? 0 : 8}}>
            {showHeader && <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, paddingTop: 24, paddingHorizontal: 16}}>
                <Text type='semibold' size={12}>{title}</Text>
                {showAll && <Text onPress={() => onPressShowAll()} size={12} color={Color.primary}>Lihat Semua <Ionicons name='arrow-forward' size={12} color={Color.primary} /></Text>}
            </View>}
            
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
            />
        </View>
    )
}

ListForumVertical.defaultProps = defaultProps;
export default ListForumVertical;
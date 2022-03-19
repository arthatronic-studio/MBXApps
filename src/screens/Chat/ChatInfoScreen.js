
import React from 'react';
import { View, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { Scaffold } from 'src/components';

const ChatInfoScreen = ({ navigation, route }) => {
    // params
    const { params } = route;

    // selector
    const user = useSelector(
        state => state['user.auth'].login.user
    );

    const { Color } = useColor();

    return (
        <Scaffold
            headerTitle='Info Chat'
        >
            <FlatList
                keyExtractor={(item, index) => item.id + index.toString()}
                data={params.member}
                contentContainerStyle={{paddingHorizontal: 16, paddingTop: 8}}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity disabled style={{height: 70, width: '100%', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={{width: 50, height: 50, marginRight: 8, borderRadius: 25, backgroundColor: Color.border}}
                                />
                                <View style={{height: 60, alignItems: 'flex-start', justifyContent: 'space-around'}}>
                                    <Text size={12} type='semibold' numberOfLines={1}>{user.userId == item.user_id ? item.first_name + ' (Kamu)' : item.first_name}</Text>
                                    {/* <Text size={10}>Available</Text> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </Scaffold>
    )
}

export default ChatInfoScreen;
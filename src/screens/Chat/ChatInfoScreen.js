
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

    const rawData = params.isNewArrival ? [] : [{ id: 0, firstName: 'Kamu' }];
    
    return (
        <Scaffold
            headerTitle='Info Chat'
        >
            <FlatList
                keyExtractor={(item, index) => item.toString() + index}
                data={rawData.concat(params.member)}
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
                                    <Text size={12} type='semibold' color={user.userId == item.userId ? Color.secondary : Color.text} numberOfLines={1}>{user.userId == item.userId ? 'Kamu' : item.firstName || item.fullname} {item.lastName}</Text>
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
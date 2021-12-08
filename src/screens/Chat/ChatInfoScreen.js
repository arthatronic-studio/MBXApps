
import React from 'react';
import { View, FlatList, Image } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';

import Text from '@src/components/Text';
import Color from '@src/components/Color';
import Header from '@src/components/Header';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';

const MainView = Styled(View)`
    width: 100%;
    height: 100%;
    backgroundColor: ${Color.dark};
`;

const ChatInfoScreen = ({ navigation, route }) => {
    // params
    const { params } = route;

    // selector
    const user = useSelector(
        state => state['user.auth'].login.user
    );

    const rawData = params.isNewArrival ? [] : [{ id: 0, firstName: 'Kamu' }];
    
    return (
        <MainView>
            <Header
              title='Info Chat'
              color={Color.white}
            />
            
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
                                    <Text size={12} type='semibold' color={user.userId == item.userId ? Color.secondary : Color.white} numberOfLines={1}>{user.userId == item.userId ? 'Kamu' : item.firstName || item.fullname} {item.lastName}</Text>
                                    {/* <Text size={10} color={Color.white}>Available</Text> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </MainView>
    )
}

export default ChatInfoScreen;
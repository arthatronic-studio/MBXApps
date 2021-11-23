import React from 'react';
import { View, TextInput, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import Scaffold from '@src/components/Scaffold';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { useColor } from '@src/components/Color';

import { shadowStyle } from '@src/styles';
import { Container } from '@src/styled';

export default ({ navigation, route }) => {
    // hooks
    const { Color } = useColor();

    return (
        <Scaffold
            header={
                <View style={{width: '100%', flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16, backgroundColor: Color.textInput, borderTopWidth: 4, borderColor: Color.theme}}>
                    <TouchableOpacity onPress={() => navigation.pop()} style={{width: '10%', height: 46, justifyContent: 'center'}}>
                        <Fontisto name='angle-left' color={Color.primary} size={18} />
                    </TouchableOpacity>
                    <View style={{width: '90%', height: 46, borderRadius: 22.5, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: Color.textInput, ...shadowStyle}}>
                        <Ionicons name='search' size={22} color={Color.primary} />
                        <TextInput
                            placeholder='Cari sesuatu..'
                            autoFocus
                            placeholderTextColor={Color.gray}
                            style={{height: 50, color: Color.gray, fontSize: 14, fontFamily: 'Inter-Regular', marginLeft: 8}}
                        />
                    </View>
                </View>
            }
            emptyTitle='Kamu belum mencari apapun'
        >
            <ScrollView>
                <Container>

                </Container>
            </ScrollView>
        </Scaffold>
    )
}
import React from 'react';
import { View, FlatList, ScrollView, TextInput, SafeAreaView, TouchableOpacity, Image, Keyboard, BackHandler, useWindowDimensions } from 'react-native';
import {
    Header,
    Popup, usePopup,
    Loading, useLoading,
    Submit,
    useColor,
    ScreenEmptyData,
} from '@src/components';

import Text from '@src/components/Text';
import CardUserEvent from 'src/components/CardUserEvent'

import Feather from 'react-native-vector-icons/Feather';

import ImagesPath from 'src/components/ImagesPath';

const ListUserEvent = () => {
    const { Color } = useColor()
    const data = [
        {src: ImagesPath.avatar1, name: 'Adang Susanyo'},
        {src: ImagesPath.avatar2, name: 'Eren Sutarjo'},
        {src: ImagesPath.avatar3, name: 'Rahma Yanti A.'},
        {src: ImagesPath.avatar4, name: 'Hendra Helinsky'},
    ]
    return (
        <View style={{backgroundColor: '#fff', padding: 16}}>
            <Text align='left' size={11} type='bold'>Peserta Event</Text>

            <FlatList
                key='ListUserEvent'
                keyExtractor={(item, index) => item.toString() + index}
                data={data}
                numColumns={1}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingTop: 16}}
                renderItem={({ item, index }) => {
                    return (
                        <CardUserEvent
                            item={item}
                            numColumns={1}
                        />
                    )
                }}
                ListEmptyComponent={() => {
                    return (
                        <ScreenEmptyData
                            message='Loker belum tersedia'
                            style={{width: width - 16}}
                        />
                    )
                }}
            />
        </View>
    )
}

export default ListUserEvent
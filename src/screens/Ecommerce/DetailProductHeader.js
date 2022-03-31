import { View, Text, TextInput, Pressable, 
    SafeAreaView, } from 'react-native'
import React from 'react'
import Styled from 'styled-components';
import { useNavigation } from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
	useColor,
	Header
} from '@src/components';
const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const DetailProductHeader = () => {
    const { Color } = useColor();

    const navigation = useNavigation();
  return (
    <View style={{borderBottomColor: Color.border,borderBottomWidth: 1,width: '100%',justifyContent: 'center', alignItems: 'center', height: '7%', flexDirection: 'row'}}>
        <Pressable onPress={() => navigation.goBack()} style={{ width: '8%'}}>
            <AntDesign name={'arrowleft'} size={20}/>
        </Pressable>
        <View style={{width: '70%', justifyContent: 'center'}} onTouchStart={() => navigation.navigate('SearchScreen')}>
            <TextInput placeholder='Cari apa hari ini . . .' style={{backgroundColor: Color.textInput, width: '95%',
            borderRadius: 7, borderWidth: 1, borderColor: Color.border,height: 40, paddingHorizontal: 10}}></TextInput>
            <AntDesign name={'search1'} size={15} style={{color: Color.secondary,position: 'absolute', alignSelf: 'flex-end', paddingHorizontal: 25}}/>
        </View>
        <MaterialIcons name={'favorite-border'} size={22} style={{marginHorizontal: 5}}/>
        <MaterialCommunityIcons name={'shopping-outline'} size={22} style={{marginHorizontal: 5}}/>
    </View>
  )
}

export default DetailProductHeader
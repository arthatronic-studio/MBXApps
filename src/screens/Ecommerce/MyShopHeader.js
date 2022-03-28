import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IonIcons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';

const MyShopHeader = () => {

  const navigation = useNavigation();
  return (
    <View style={{height: 50, flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{width: '10%', alignItems: 'center', justifyContent: 'center'}}>
        <AntDesign name={'arrowleft'} size={20}/>
      </TouchableOpacity>
      <View style={{width: '72%',paddingHorizontal: 10, justifyContent: 'center'}}>
        <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'left'}}>Toko Saya</Text>
      </View>
      <View style={{width: '8%', alignItems: 'center', justifyContent: 'center'}}>
        <IonIcons name={'chatbubbles-outline'} size={20}/>
      </View>
      <View style={{width: '8%', alignItems: 'center', justifyContent: 'center'}}>
        <IonIcons name={'notifications-outline'} size={20}/>
      </View>
    </View>
  )
}

export default MyShopHeader
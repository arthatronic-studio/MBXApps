import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList,Image, TextInput} from 'react-native';
import { useSelector } from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Row, Col,
  useColor,
  Header
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ImagesPath from 'src/components/ImagesPath';
import { Divider } from 'src/styled';

const SplashCreateShop = () => {
    const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const navigation = useNavigation();
  const { Color } = useColor();
  
  useEffect(() => {
  }, []);

  return (
    <Scaffold
        style={{backgroundColor: Color.theme}}
          header={
            <Header 
              customIcon
              type='regular'
              centerTitle={false}
            />
          }
          onPressLeftButton={() => navigation.pop()}
    >
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Divider height={20}/>
            <Image source={ImagesPath.createshop}/>
            <Divider height={60}/>
            <Text style={{fontSize: 18, fontSize: 18, fontWeight: 'bold'}}>Buat Peluang Kamu Di Sini</Text>
            <Text style={{marginVertical: 20, fontSize: 10, width: '85%', lineHeight: 18}}>Tribes Social adalah platform komunitas cerdas yang memberikan rekomendasi 
                konten yang 
                dipersonalisasi kepada setiap pengguna berdasarkan minat mereka. </Text>
            <Divider/>
            <TouchableOpacity onPress={() => navigation.navigate('CreateShop')} style={{justifyContent: 'center',width: '90%', height: 40, backgroundColor: Color.primary, borderRadius: 20}}>
                <Text style={{color: Color.textInput, fontWeight: 'bold'}}>Lanjut</Text>
            </TouchableOpacity>
        </View>
    </Scaffold>
  )
}

export default SplashCreateShop
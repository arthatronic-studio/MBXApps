import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList,Image, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
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
import { onBoardingEvent } from 'src/state/actions/user/auth';

const OnBoardEvent = () => {
    const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const dispatch = useDispatch();
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
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'flex-end'}}>
            <Divider height={20}/>
            <Image source={ImagesPath.createEvent}/>
            <Divider height={60}/>
            <Text style={{fontSize: 18, fontSize: 18, fontWeight: 'bold'}}>Ayo Buat Acara Untuk Komunitas</Text>
            <Text style={{marginVertical: 20, fontSize: 13, width: '85%', lineHeight: 18}}>Seni adalah sebuah ledakan merupakan ungkapan asli dari seniman abstrak terkenal Jepang Taro Okamoto. Ungkapan tersebut diucapkan oleh Deidara Akatsuki (tokoh dari novel manga terkenal asal jepang “Naruto).</Text>
            <Divider/>
            <TouchableOpacity onPress={() => { dispatch({ type: 'USER.CREATE_EVENT' }); navigation.replace('CreateEvent')}} style={{justifyContent: 'center',width: '90%', height: 40, marginBottom: 20, backgroundColor: Color.primary, borderRadius: 20}}>
                <Text style={{color: Color.textInput, fontWeight: 'bold'}}>Ayo Buat Event</Text>
            </TouchableOpacity>
        </View>
    </Scaffold>
  )
}

export default OnBoardEvent
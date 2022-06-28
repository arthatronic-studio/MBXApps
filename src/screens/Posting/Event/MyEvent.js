import React, {useState, useEffect, useRef} from 'react';
import {View, TouchableOpacity,Image, FlatList,ScrollView, Platform, Linking, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert, Row, Col} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import Client from '@src/lib/apollo';
import MyEventBar from './MyEventBar'
import {queryAddLike} from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import ImagesPath from 'src/components/ImagesPath';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const MyEvent = ({route, navigation}) => {

    const {Color} = useColor();

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          type="bold"
          centerTitle={false}
          title="Eventku"
          actions={
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('CreateEvent')} style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row', backgroundColor: Color.primary, height: 30, width: 110,borderRadius: 25}}>  
                <Entypo name='plus' size={13} color={Color.textInput} style={{marginRight: 5}} />
                <Text style={{color: Color.textInput, fontSize: 11, fontWeight: 'bold'}}>Buat Event</Text>
              </TouchableOpacity>
            </View>
          }
        />
      }
    >
    <MyEventBar/>
    </Scaffold>
  )
}

export default MyEvent
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
import {queryAddLike} from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import ImagesPath from 'src/components/ImagesPath';
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const CommunityEvent = ({route}) => {

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
          title="Community Event"
          actions={
            <View>
              <TouchableOpacity>
                <Ionicons name='search' size={22} color={Color.text} style={{marginHorizontal: 15}} />
              </TouchableOpacity>
            </View>
          }
        />
      }
    >
      <TouchableOpacity style={{marginHorizontal: 15,alignSelf: 'flex-end',backgroundColor: Color.theme, marginVertical: 20,alignItems: 'center', justifyContent: 'center',flexDirection: 'row', borderWidth: 1, borderColor: Color.text, width: '25%', borderRadius: 30, height: 30}}>
        <Text style={{fontSize: 10}}>Terbaru</Text>
        <MaterialIcons name={"keyboard-arrow-down"} size={18}/>
      </TouchableOpacity>

    <HighlightContentProduct
        productCategory='EVENT'
        name='Event'
        nav='EventScreen'
        showHeader={false}
    />
    <Divider height={20}/>
    </Scaffold>
  )
}

export default CommunityEvent
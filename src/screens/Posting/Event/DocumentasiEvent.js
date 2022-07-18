import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Pressable, Image, SafeAreaView, TextInput, TouchableOpacity, Switch, ImageBackground,FlatList } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import Moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import { initialLatitude, initialLongitude } from 'src/utils/constants';

import {
	Text,
	// TouchableOpacity,
	
	useLoading,
	Scaffold,
	Row,
	Col,
	HeaderBig,
	useColor,
	Header
} from '@src/components';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct,queyGetDokumentasiEnventList } from '@src/lib/query';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import moment from 'moment';
import FormSelect from 'src/components/FormSelect';
import client from '@src/lib/apollo';
import { mutatuinEventManage } from 'src/lib/query/event';
import { FormatMoney } from 'src/utils';
import ModalPassanger from './ModalPassanger';
var crypto = require('crypto-js')

function sha1(data) {
}

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;



const DocumentasiEvent = ({navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);
    const route = useRoute();
    const [itemData, setItemData] = useState([]);
   

    console.log('halo dani',itemData);
	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const { Color } = useColor();
	useEffect( () => {
        // submit()
        fetchDocumentasiEvent();
    }, []);


    const fetchDocumentasiEvent = () => {
        // const variables = {
        //   page: 0,
        //   itemPerPage: 6,
        //   productType: Config.PRODUCT_TYPE,
        //   productCategory: 'YOUTUBE_VIDEO'
        // };
    
        Client.query({
          query: queyGetDokumentasiEnventList,
        
        })
        .then((res) => {
         
            console.log('ini res',res);
          const data = res.data.eventDocumentationList;
          
    
          if (data) {
            setItemData(data);
          }
         
        })
        .catch((err) => {
          console.log('err YOUTUBE_VIDEO', err);
        });
      }
    const SearchEvent = () => {
		return (

        <Pressable onPress={()=> navigation.navigate('DocumentasiSearchEvent')}>
          <TextInput
          editable={false}
          placeholder='Cari dokumentasi event . . .'
          style={{paddingHorizontal: 10, fontSize: 12,backgroundColor: Color.theme,  height: 40, borderRadius: 8, borderWidth: 1, borderColor: Color.border}}>
          
          </TextInput>
          <IonIcons
          name='search'
          color={Color.border}
          size={18}
          onPress={() => navigation.navigate('')}
          style={{position: 'absolute', alignSelf: 'flex-end', right: 25, top: 10}}
        />
        </Pressable>
        )
    }

   

      const renderItem = ({ item }) => (
    
       
        <View style={{
            flex: 1,
            width: '48%', 
            minHeight: 225,
            padding: 10, 
            
          }}>
             <Pressable onPress={()=> navigation.navigate('DocumentasiEventDetail',{id: item.id,cImage: item.mediaCounts.image,cVideo: item.mediaCounts.video})}>
        <ImageBackground source={{uri: item.latestMedia !== null ? item.latestMedia : item.images[0]}} resizeMode="cover"  imageStyle={{ borderRadius: 6}} style={{
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 4,
    minHeight: 225,
    marginBottom: 0, 
    padding: 10,
    borderRadius: 9, 
    // borderWidth: 1,
    backgroundColor: 'grey'
  }}> 
    

     <View style={{position: 'absolute',left:88,top:0,flexDirection:'row',marginVertical:5,}}>
     <Text size={10} align='center'  type="bold" color={Color.border}>{item.mediaCounts.image}</Text>
     <IonIcons
          name='image-outline'
          color={Color.border}
          size={15}
          style={{marginHorizontal: 3}}
         
        />
        <Text size={10} align='center'  type="bold" color={Color.border}>{item.mediaCounts.video}</Text>
     <IonIcons
          name='play-outline'
          color={Color.border}
          size={15}
          style={{marginHorizontal: 3}}
         
        />
     </View>
          <Text color={Color.border} align='left' style={{ marginBottom: 4,  }} type={'bold'}>{item.name}</Text>
          <Text size={9} align='left' color={Color.border}>{item.category} • {Moment(item.date).format('DD MMM YYYY')}</Text>
        </ImageBackground>
        </Pressable>
      </View>
    
      );
  return (
    <Scaffold
		header={<Header customIcon title="Dokumentasi Event" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ScrollView>
            <View style={{ padding: 16 }}>
                <SearchEvent/>
                <View>
                    <Text type='bold' align='left' size={12} style={{ marginVertical: 13 }}>Event Terbaru</Text>
                 
                       <View style={{flex: 1,}}>
                        <FlatList
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            data={itemData}
                            numColumns={2}
                            renderItem={renderItem}
                        />
                </View>
                </View>
            </View>
        </ScrollView>
       
    </Scaffold>
  )
}

export default DocumentasiEvent
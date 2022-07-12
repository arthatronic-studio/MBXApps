import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Pressable, Image, SafeAreaView, TextInput, TouchableOpacity, Switch, ImageBackground } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';

import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons'
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
import { queryContentProduct } from '@src/lib/query';
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

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
   
	const { Color } = useColor();
	useEffect( () => {
        // submit()
    }, []);

    const SearchEvent = () => {
		return (

        <Pressable onPress={()=> navigation.navigate('SearchEvent')}>
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
                    <Row style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <ImageBackground style={{ width: '48%', minHeight: 225, marginBottom: 13, padding: 10, borderRadius: 4, justifyContent: 'flex-end', backgroundColor: 'grey' }}>
                            <Text color={'#fff'} align='left' style={{ marginBottom: 4,  }} type={'bold'}>Konser Sejuta Doa Untuk Indonesia</Text>
                            <Text size={9} align='left' color='#fff'>Official Sabyan • 23 Maret 2022</Text>
                        </ImageBackground>
                        <ImageBackground style={{ width: '48%', minHeight: 225, marginBottom: 13, padding: 10, borderRadius: 4, justifyContent: 'flex-end', backgroundColor: 'grey' }}>
                            <Text color={'#fff'} align='left' style={{ marginBottom: 4,  }} type={'bold'}>Konser Sejuta Doa Untuk Indonesia</Text>
                            <Text size={9} align='left' color='#fff'>Official Sabyan • 23 Maret 2022</Text>
                        </ImageBackground>
                        <ImageBackground style={{ width: '48%', minHeight: 225, marginBottom: 13, padding: 10, borderRadius: 4, justifyContent: 'flex-end', backgroundColor: 'grey' }}>
                            <Text color={'#fff'} align='left' style={{ marginBottom: 4,  }} type={'bold'}>Konser Sejuta Doa Untuk Indonesia</Text>
                            <Text size={9} align='left' color='#fff'>Official Sabyan • 23 Maret 2022</Text>
                        </ImageBackground>
                        <ImageBackground style={{ width: '48%', minHeight: 225, marginBottom: 13, padding: 10, borderRadius: 4, justifyContent: 'flex-end', backgroundColor: 'grey' }}>
                            <Text color={'#fff'} align='left' style={{ marginBottom: 4,  }} type={'bold'}>Konser Sejuta Doa Untuk Indonesia</Text>
                            <Text size={9} align='left' color='#fff'>Official Sabyan • 23 Maret 2022</Text>
                        </ImageBackground>
                        <ImageBackground style={{ width: '48%', minHeight: 225, marginBottom: 13, padding: 10, borderRadius: 4, justifyContent: 'flex-end', backgroundColor: 'grey' }}>
                            <Text color={'#fff'} align='left' style={{ marginBottom: 4,  }} type={'bold'}>Konser Sejuta Doa Untuk Indonesia</Text>
                            <Text size={9} align='left' color='#fff'>Official Sabyan • 23 Maret 2022</Text>
                        </ImageBackground>
                        <ImageBackground style={{ width: '48%', minHeight: 225, marginBottom: 13, padding: 10, borderRadius: 4, justifyContent: 'flex-end', backgroundColor: 'grey' }}>
                            <Text color={'#fff'} align='left' style={{ marginBottom: 4,  }} type={'bold'}>Konser Sejuta Doa Untuk Indonesia</Text>
                            <Text size={9} align='left' color='#fff'>Official Sabyan • 23 Maret 2022</Text>
                        </ImageBackground>
                    </Row>
                </View>
            </View>
        </ScrollView>
       
    </Scaffold>
  )
}

export default DocumentasiEvent
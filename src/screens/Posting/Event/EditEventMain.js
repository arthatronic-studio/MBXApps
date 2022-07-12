import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Switch } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import {Calendar} from 'react-native-calendars';
import AntDesign from 'react-native-vector-icons/AntDesign';
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

const EditEvent = ({navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);
    const route = useRoute();

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const { Color } = useColor();
  return (
    <Scaffold
		header={<Header customIcon title="Edit Event" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <View style={{ padding: 19 }}>
            <Row style={{ borderColor: '#CDD1D2', marginBottom: 26, borderWidth: 1, padding: 10, borderRadius: 8 }}>
                <View style={{ height: 48, width: 48, backgroundColor: '#bcbcbc', borderRadius: 8 }} />
                <Col style={{ paddingLeft: 10, justifyContent: 'center' }}>
                    <Text size={9} color='#558617' type='semibold' style={{ marginBottom: 4 }} align='left'>KOMUNITAS</Text>
                    <Text size={13} type='bold' align='left'>Workshop Mengenai Seni Pahat Kayu</Text>
                </Col>
            </Row>
            <Row style={{ marginBottom: 20, alignItems: 'center' }}>
                <Image source={ImagesPath.editevent} style={{ height: 20, width: 20, marginRight: 10 }} resizeMode='contain' />
                <Col size={9} style={{ alignItems: 'flex-start' }}>
                    <Text type='semibold' color={Color.black}>Informasi Dasar</Text>
                    <Text size={10} color='#6A7479' align='left'>Pengaturan seputar nama event, lokasi, dan lainnya</Text>
                </Col>
                <Col style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Image source={ImagesPath.arrowRight} />
                </Col>
            </Row>
            <Row style={{ marginBottom: 20, alignItems: 'center' }}>
                <Image source={ImagesPath.ticket} style={{ height: 20, width: 20, marginRight: 10 }} resizeMode='contain' />
                <Col size={9} style={{ alignItems: 'flex-start' }}>
                    <Text type='semibold' color={Color.black}>Seputar Tiket</Text>
                    <Text size={10} color='#6A7479'>Edit informasi seputar harga, tipe, dan stok tiket</Text>
                </Col>
                <Col style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Image source={ImagesPath.arrowRight} />
                </Col>
            </Row>
        </View>
    </Scaffold>
  )
}

export default EditEvent
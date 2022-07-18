import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Switch } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation,useIsFocused, useRoute } from '@react-navigation/native';
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
import { getDetailEvent, mutationAddEvent } from 'src/lib/query/event';
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

const EditEvent = ({navigation, route}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);
    // const route = useRoute();
    const isFocused = useIsFocused();
    // const items = route.params.item;
    const [data, setData] = useState(null);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
	const { Color } = useColor();

    useEffect(() => {
        getDetail();
      }, [isFocused]);
    
    const getDetail = () => {
        showLoading();
        // console.log(items)
        let variables = {
            id: route.params.item.id,
        };
        console.log(variables);
        Client.query({query: getDetailEvent, variables})
        .then(res => {
            hideLoading()
            if(res.data.eventDetail){
                setData(res.data.eventDetail)
            }
            console.log(res);

        })
        .catch(reject => {
            hideLoading()
            alert(reject.message)
            console.log(reject.message, 'reject');
        });
    };

    if(data == null) return <View />

  return (
    <Scaffold
        loadingProps={loadingProps}
		header={<Header customIcon title="Edit Event" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <View style={{ padding: 19 }}>
            <Row style={{ borderColor: '#CDD1D2', marginBottom: 26, borderWidth: 1, padding: 10, borderRadius: 8 }}>
                <Image source={{ uri: data.images.length == 0 ? '' : data.images[0] }} style={{ height: 48, width: 48, backgroundColor: '#bcbcbc', borderRadius: 8 }} />
                <Col style={{ paddingLeft: 10, justifyContent: 'center' }}>
                    <Text size={9} color='#558617' type='semibold' style={{ marginBottom: 4 }} align='left'>{data.category}</Text>
                    <Text size={13} type='bold' align='left'>{data.name}</Text>
                </Col>
            </Row>
            <TouchableOpacity onPress={() => navigation.navigate('EditEvent',{item: data})}>
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
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('EditEventSecond',{item: data})}>
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
            </TouchableOpacity>
        </View>
    </Scaffold>
  )
}

export default EditEvent
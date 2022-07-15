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
import ModalChangeTicket from './ModalChangeTicket';
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

const PemesananTiket = ({navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);
    const route = useRoute();
    const {params} = route
    console.log(route, 'route')

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [name, setName] = useState(user ? user.firstName+' '+user.lastName : '');
    const [isTicket, setSwitch] = useState();
    const [qty, setQty] = useState();
    const [passangerInput, setPassangerInput] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [tnc, setTnc] = useState(0);
    const [refundPolicy, setRefundPolicy] = useState(0);
    const modalChangeTicketRef = useRef();
    const [ticketSelected, setSelected] = useState(params.item)
    const [tickets, setTickets] = useState([{
            name: '',
            quota: 1,
            refund: true,
            reservation: true,
        }
    ])
	const { Color } = useColor();
    const [coords, setCoords] = useState({
      latitude: initialLatitude,
      longitude: initialLongitude,
    });


  const [modalSelectMap, setModalSelectMap] = useState(false);
  const [isPinnedMap, setIsPinnedMap] = useState(false);
  const [locationPinnedMap, setLocationPinnedMap] = useState('');

	useEffect( () => {
        // submit()
    }, []);

    const addTicket = () => {
        const temp = tickets;
        temp.push({
            name: '',
            quota: 1,
            refund: true,
            reservation: true,
        })
        setTickets(temp)
        setRefresh(refresh + 1);
    }
    const onClose = () => {
        modalChangeTicketRef.current.close()
    }

      const workout = {key: 'workout', color: 'green'};
  return (
    <Scaffold
		header={<Header customIcon title="Pemesanan Tiket" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ScrollView>
            <View style={{ borderColor: '#CDD1D2', margin: 16, borderWidth: 1, padding: 10, borderRadius: 10 }}>
                <Row style={{ marginBottom: 5 }}>
                    {console.log(ticketSelected, 'ticketSelected')}
                    <Text color='#111' type='bold' size={11}>{ticketSelected.name}</Text>
                    <Col>
                        <Text size={11} color={Color.text} type='medium' align='right'>{moment(params.dataEvent.date).format('DD MMM YYYY')}</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: 12, }}>
                    <Row style={{ marginRight: 10,  alignItems: 'center' }}>
                        <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 3, borderRadius: 14 }}>
                            <Image source={ImagesPath.refund} style={{ width: 15, height: 15, borderRadius: 7 }} />
                        </View>
                        <Text color={Color.text} size={11}>{ticketSelected.refund ? 'Bisa Refund' : 'Tidak Bisa Refund'}</Text>
                    </Row>
                    <Row style={{ marginRight: 10, alignItems: 'center' }}>
                        <View style={{  width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 3, borderRadius: 14 }}>
                            <Image source={ImagesPath.calendar} style={{  width: 16, height: 16, borderRadius: 7 }} />
                        </View>
                        <Text color={Color.text} size={11}>{ticketSelected.reservation ? 'Bisa Reservasi' : 'Tidak Bisa Reservasi'}</Text>
                    </Row>
                </Row>
                <View style={{ height: 1,  marginVertical: 12 }} />
                <Row style={{  alignItems: 'center' }}>
                    <Col size={8} style={{   alignItems: 'flex-start', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                        <Text color={Color.text} size={9}>Harga</Text>
                        <Text color={Color.text} size={14} type='semibold'>{FormatMoney.getFormattedMoney(ticketSelected.price)}/pax</Text>
                    </Col>
                    <Col style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => modalChangeTicketRef.current.open()} style={{ borderColor: Color.primary, borderWidth: 1, borderRadius: 30, paddingVertical: 8, paddingHorizontal: 10 }}>
                            <Text color={Color.primary} type='medium' size={11}>Ganti Tiket</Text>
                        </TouchableOpacity>
                    </Col>
                </Row>
            </View>
            <View style={{ height: 8, backgroundColor: '#eee', marginVertical: 10 }} />
            <View style={{ borderColor: '#bcbcbc', borderWidth: 1, borderRadius: 10, overflow: 'hidden', margin: 16 }}>
                <Calendar
                    markingType={'custom'}
                    onDayPress={day => {
                        console.log('selected day', day);
                    }}
                    enableSwipeMonths={true}
                    markedDates={{
                        '2022-06-28': {
                            customStyles: {
                              container: {
                                backgroundColor: '#D8DEF3'
                              },
                              text: {
                                color: '#3C58C1',
                                fontWeight: 'bold'
                              }
                            }
                        },
                    }}
                    />
            </View>
            <Row style={{ alignItems: 'center', marginLeft: 16 }}>
                <View style={{ backgroundColor: '#3C58C1', marginRight: 4, height: 9, width: 9, borderRadius: 5 }} />
                <Text type='bold' size={9} style={{ marginRight: 10 }}>Dipilih</Text>
                <View style={{ backgroundColor: '#07181F', marginRight: 4, height: 9, width: 9, borderRadius: 5 }} />
                <Text type='bold' size={9} style={{ marginRight: 10 }}>Tersedia</Text>
                <View style={{ backgroundColor: '#9CA3A5', marginRight: 4, height: 9, width: 9, borderRadius: 5 }} />
                <Text type='bold' size={9} style={{ marginRight: 10 }}>Tidak Tersedia</Text>
            </Row>
            <View style={{ height: 8, backgroundColor: '#eee', marginVertical: 10 }} />
            <View style={{ marginHorizontal: 16 }}>
                <Text color={Color.black} type='bold' align='left' size={11}>Jumlah Tiket</Text>
                <Text color='#9CA3A5' align='left' size={10}>Min. Pembelian 1 dan maks. pembelian 10 tiket dalam 1 kali order</Text>
            </View>
            <Row style={{ margin: 16 }}>
                <Col>
                    <Text color='#6A7479' align='left' size={10}>PAX</Text>
                    <Text type='bold' align='left' size={14}>{FormatMoney.getFormattedMoney(ticketSelected.price)}</Text>
                </Col>
                <Col style={{ justifyContent: 'center' }}>
                    <Row style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => setQty(qty-1 < 1  ? 1 : qty-1)} style={{marginLeft: 24}}>
                            <AntDesign name="minuscircleo" color={Color.disabled} size={19} />
                        </TouchableOpacity>
                        <View>
                            <Text color={Color.text} type='bold' size={18} style={{marginHorizontal: 8}}>{qty}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setQty(qty+1)}>
                            <AntDesign  name="pluscircleo" color={'#F3771D'} size={19}/>
                        </TouchableOpacity>
                    </Row>
                </Col>
            </Row>
        </ScrollView>
        <ModalChangeTicket
            ref={modalChangeTicketRef}
            data={{name: 'riyan'}}
            adjust={true}
            onClose={onClose}
        />
        <View style={{width: '100%',  height: 70, alignItems: 'center', borderRadius: 10}}>
            <TouchableOpacity onPress={() => navigation.navigate('CheckoutEvent',{ticket: {...ticketSelected, nameEvent: params.dataEvent.name, date: params.dataEvent.date, image: params.dataEvent.images ? params.dataEvent.images[0] : '', eventId: params.dataEvent.id, ticketId: ticketSelected.id, userOrderEmail: params.itemRoute.userOrderEmail, userOrderName: params.itemRoute.userOrderName, userOrderPhone: params.itemRoute.userOrderPhone}})} style={{backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
                <Text style={{color: Color.textInput}}>Pesan Tiket</Text>
            </TouchableOpacity>
        </View>

    </Scaffold>
  )
}

export default PemesananTiket
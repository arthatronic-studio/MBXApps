import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Switch } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {connect, useDispatch, useStore} from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';

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
import { mutatuinEventManage, mutationOrderEvent } from 'src/lib/query/event';
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

const CheckoutEvent = ({navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);
	const loading = useSelector((state) => state['user.auth'].loading);

  const dispatch = useDispatch();
    const route = useRoute();
    const {params} = route
    console.log(params, user, 'paramsss')

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [name, setName] = useState(user ? user.firstName+' '+user.lastName : '');
    const [passanger, setPassanger] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const modalPassangerRef = useRef();
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

    const submit = async () => {
        showLoading()
        const variables = {
            type: 'BOOKING',
            newOrder: {
                userId: user.userId,
                eventId: params.ticket.eventId,
                ticketId: params.ticket.ticketId,
                userOrderName:params.ticket.userOrderName,
                userOrderPhone:params.ticket.userOrderPhone,
                userOrderEmail:params.ticket.userOrderEmail,
                orderItems: passanger,
              }
        }
        console.log(variables)
        client.mutate({mutation: mutationOrderEvent, variables})
        .then(res => {
            hideLoading();
            console.log(res.data);
            if (res.data.eventTicketOrderManage.success) {
                console.log('manage')
                if(res.data.eventTicketOrderManage.data.status === 'PAID'){
                    navigation.navigate('OrderEventDetail',{item: res.data.eventTicketOrderManage.data});
                }else{
                    dispatch({
                        type: 'BOOKING.ADD_BOOKING',
                        data: {
                        ...res.data.eventTicketOrderManage.data,
                          id: res.data.eventTicketOrderManage.data.bookingId,
                          invoiceNumber: res.data.eventTicketOrderManage.data.orderNumber,
                          vestaBiller: true,
                          finalAmount: res.data.eventTicketOrderManage.data.totalAmount,
                        },
                      });
                    setTimeout(() => {
                        navigation.navigate('PaymentScreen', {back: true});
                        // navigation.popToTop()
                    }, 1000);
                }
            }
        })
        .catch(reject => {
            hideLoading();
            console.log(reject.message, 'reject');
        });
      };

      const onChange = (value,name, id) => {
        const tempx = tickets
        tickets[id][name] = value
        setTickets(tempx)
        setRefresh(refresh + 1);
        
      }

      const getDocument = async(name) => {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
            allowMultiSelection: false,
        });

        console.log(res, 'res get document');

        let objOrigin;
        let uri;

        if (Array.isArray(res) && res.length > 0) {
           
            RNFetchBlob.fs
            .readFile(res[0].uri, 'base64')
            .then((data) => {
                if(name == 'tnc') setTnc(data)
                else setRefundPolicy(data)
            })
            .catch((err) => {});
        }
    }

    const onClose = () => {
        modalPassangerRef.current.close();
    }

    const onSave = (data) => {
        console.log(data)
        setPassanger(data)
        onClose()
    }

  return (
    <Scaffold
		header={<Header customIcon title="Detail Pemesanan" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
        loadingProps={loadingProps}
	>
        {console.log(user)}
        <ScrollView>
            <View style={{ borderColor: '#CDD1D2', margin: 16, borderWidth: 1, padding: 10, borderRadius: 10 }}>
                <Row>
                    <Image source={{ uri:params.ticket.image  }} style={{ height: 48, width: 48, borderRadius: 8, marginRight: 8, backgroundColor: '#ddd' }} />
                    <Text type='semibold' align='left' color='#111'>{params.ticket.nameEvent}</Text>
                </Row>
                <View style={{ height: 1, backgroundColor: '#DDDDDD', marginVertical: 16 }} />
                <Row style={{ marginBottom: 5 }}>
                    <Text color='#111' type='bold' size={11}>{params.ticket.name}</Text>
                    <Col>
                        <Text size={11} color={Color.text} type='medium'>{moment(params.ticket.date).format('DD MMM YYYY')}</Text>
                    </Col>
                </Row>
                <Text size={10} align='left' color='#6A7479'>1 Tiket • 1 Pax</Text>
                <View style={{ height: 1, backgroundColor: '#DDDDDD', marginVertical: 16 }} />
                <Row style={{ marginBottom: 10 }}>
                    <Row style={{ marginRight: 10, alignItems: 'center' }}>
                        <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                            <Image source={ImagesPath.refund} style={{ width: 15, height: 15, borderRadius: 7 }} />
                        </View>
                        <Text color={Color.text} size={11}>{params.ticket.refund ? 'Bisa Refund' : 'Tidak Bisa Refund'}</Text>
                    </Row>
                    <Row style={{ marginRight: 10, alignItems: 'center' }}>
                        <View style={{  width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                            <Image source={ImagesPath.calendar} style={{  width: 16, height: 16, borderRadius: 7 }} />
                        </View>
                        <Text color={Color.text} size={11}>{params.ticket.reservation ? 'Bisa Reservasi' : 'Tidak Bisa Reservasi'}</Text>
                    </Row>
                </Row>
            </View>
            <View style={{ height: 8, backgroundColor: '#eee', marginVertical: 10 }} />
            <Text type='bold' size={12} align='left' style={{ marginLeft: 16 }}>Detail Pemesan</Text>
            <View style={{ borderColor: '#CDD1D2', margin: 16, borderWidth: 1, padding: 10, borderRadius: 10 }}>
                <Row>
                    <Col>
                        <Text size={11} type='bold' align='left'>{user.firstName} {user.lastName}</Text>
                        <Row style={{ marginRight: 10, alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                                <Image source={ImagesPath.phone} resizeMode='contain' style={{ width: 14,  borderRadius: 7 }} />
                            </View>
                            <Text color={Color.text} size={11}>+{user.phoneCountryCode}{user.phoneNumber}</Text>
                        </Row>
                        <Row style={{ marginRight: 10, alignItems: 'center' }}>
                            <View style={{  width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                                <Image source={ImagesPath.mail} style={{  width: 16, height: 16, borderRadius: 7 }} />
                            </View>
                            <Text color={Color.text} size={11}>{user.email}</Text>
                        </Row>
                    </Col>
                    <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                        <AntDesign name='right' size={18} />
                    </Col>
                </Row>
            </View>
            <View style={{ height: 8, backgroundColor: '#eee', marginVertical: 10 }} />
            <Text type='bold' size={12} align='left' style={{ marginLeft: 16 }}>Detail Pengunjung</Text>
            <TouchableOpacity onPress={() => modalPassangerRef.current.open()} style={{ borderColor: '#CDD1D2', margin: 16, borderWidth: 1, padding: 10, borderRadius: 10 }}>
                <Row>
                    <Col>
                        <Text color={Color.text} type='bold' align='left'>{passanger.length > 0 ? passanger[0].title + ' ' + passanger[0].name : 'Tiket 1 (Pax)'}</Text>
                    </Col>
                    <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                        <AntDesign name='right' size={18} />
                    </Col>
                </Row>
            </TouchableOpacity>
            <View style={{ height: 8, backgroundColor: '#eee', marginVertical: 10 }} />
            <Text type='bold' size={12} align='left' style={{ marginLeft: 16 }}>Detail Harga</Text>
            <View style={{ backgroundColor: '#F4F5F9', margin: 16, padding: 10, borderRadius: 10 }}>
                <Row style={{ marginBottom: 8 }}>
                    <Col>
                        <Text color={Color.text}  size={11} align='left'>Subtotal</Text>
                    </Col>
                    <Col size={4} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Text color={Color.text}  size={11} align='left'>{FormatMoney.getFormattedMoney(params.ticket.price)}</Text>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 8 }}>
                    <Col>
                        <Text color={Color.text}  size={11} align='left'>Ppn 10%</Text>
                    </Col>
                    <Col size={4} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Text color={Color.text}  size={11} align='left'>{FormatMoney.getFormattedMoney(params.ticket.price*0.1)}</Text>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 8 }}>
                    <Col>
                        <Text color={Color.text}  size={11} align='left'>Total</Text>
                    </Col>
                    <Col size={4} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Text color={Color.text}  size={11} type='bold' align='left'>{params.ticket.type === 'FREE' ? 'GRATIS' : FormatMoney.getFormattedMoney(params.ticket.price+params.ticket.price*0.1)}</Text>
                    </Col>
                </Row>
            </View>
        </ScrollView>
        <View style={{width: '100%',  height: 70, alignItems: 'center', borderRadius: 10}}>
            <TouchableOpacity onPress={() => submit()} style={{backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
                <Text style={{color: Color.textInput}}>Pesan Tiket</Text>
            </TouchableOpacity>
        </View>

        <ModalPassanger
            ref={modalPassangerRef}
            data={passanger}
            onSave={onSave}
            onClose={() => {
                onClose();
            }}
        />
    </Scaffold>
  )
}

export default CheckoutEvent
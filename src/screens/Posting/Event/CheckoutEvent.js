import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Switch } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
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
import { mutationAddEvent } from 'src/lib/query/event';
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
    const route = useRoute();

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [name, setName] = useState(user ? user.firstName+' '+user.lastName : '');
    const [isTicket, setSwitch] = useState();
    const [passanger, setPassanger] = useState();
    const [passangerInput, setPassangerInput] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [tnc, setTnc] = useState(0);
    const [refundPolicy, setRefundPolicy] = useState(0);
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
        console.log(route.params)
        const variables = {
            type: 'CREATE',
            newEvent: {
                ...route.params.item,
                category: "OFFICIAL",
                refundPolicy: refundPolicy,
                tnc: tnc,
                image: [],
                tickets
                // tickets: [{
                //     name: 'Regular',
                //     quota: 10,
                //     type: 'FREE',
                //     refund: true,
                //     reservation: true,
                // }]
            }
        }
        console.log(variables)
        client.mutate({mutation: mutationAddEvent, variables})
        .then(res => {
            // hideLoading();
            console.log(res);
            if (res.data.eventManage) {
           
            }
        })
        .catch(reject => {
            // hideLoading();
            console.log(reject.message, 'reject');
        });

        navigation.navigate('CreateEventSecond',{item: tempData})
       
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

    const onSave = () => {
        modalPassangerRef.current.close();
      }

  return (
    <Scaffold
		header={<Header customIcon title="Detail Pemesanan" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ScrollView>
            <View style={{ borderColor: '#CDD1D2', margin: 16, borderWidth: 1, padding: 10, borderRadius: 10 }}>
                <Row>
                    <View style={{ height: 48, width: 48, borderRadius: 8, marginRight: 8, backgroundColor: '#ddd' }} />
                    <Text type='semibold' align='left' color='#111'>Geek Con by TRIBESOCIAL at Kota Kasablanka</Text>
                </Row>
                <View style={{ height: 1, backgroundColor: '#DDDDDD', marginVertical: 16 }} />
                <Row style={{ marginBottom: 5 }}>
                    <Text color='#111' type='bold' size={11}>PRESALE - Regular (A)</Text>
                    <Col>
                        <Text size={11} color={Color.text} type='medium'>08 Feb 2022</Text>
                    </Col>
                </Row>
                <Text size={10} align='left' color='#6A7479'>1 Tiket • 1 Pax</Text>
                <View style={{ height: 1, backgroundColor: '#DDDDDD', marginVertical: 16 }} />
                <Row style={{ marginBottom: 10 }}>
                    <Row style={{ marginRight: 10, alignItems: 'center' }}>
                        <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                            <Image source={ImagesPath.refund} style={{ width: 15, height: 15, borderRadius: 7 }} />
                        </View>
                        <Text color={Color.text} size={11}>Bisa Refund</Text>
                    </Row>
                    <Row style={{ marginRight: 10, alignItems: 'center' }}>
                        <View style={{  width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                            <Image source={ImagesPath.calendar} style={{  width: 16, height: 16, borderRadius: 7 }} />
                        </View>
                        <Text color={Color.text} size={11}>Tidak Perlu Reservasi</Text>
                    </Row>
                </Row>
            </View>
            <View style={{ height: 8, backgroundColor: '#eee', marginVertical: 10 }} />
            <Text type='bold' size={12} align='left' style={{ marginLeft: 16 }}>Detail Pemesan</Text>
            <View style={{ borderColor: '#CDD1D2', margin: 16, borderWidth: 1, padding: 10, borderRadius: 10 }}>
                <Row>
                    <Col>
                        <Text size={11} type='bold' align='left'>Adang Susanyo</Text>
                        <Row style={{ marginRight: 10, alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                                <Image source={ImagesPath.phone} resizeMode='contain' style={{ width: 14,  borderRadius: 7 }} />
                            </View>
                            <Text color={Color.text} size={11}>+6281312345678</Text>
                        </Row>
                        <Row style={{ marginRight: 10, alignItems: 'center' }}>
                            <View style={{  width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                                <Image source={ImagesPath.mail} style={{  width: 16, height: 16, borderRadius: 7 }} />
                            </View>
                            <Text color={Color.text} size={11}>Adang@email.com</Text>
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
                        <Text color={Color.text} type='bold' align='left'>Tiket 1 (Pax)</Text>
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
                    <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Text color={Color.text}  size={11} align='left'>{FormatMoney.getFormattedMoney(0)}</Text>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 8 }}>
                    <Col>
                        <Text color={Color.text}  size={11} align='left'>Ppn 10%</Text>
                    </Col>
                    <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Text color={Color.text}  size={11} align='left'>{FormatMoney.getFormattedMoney(0)}</Text>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 8 }}>
                    <Col>
                        <Text color={Color.text}  size={11} align='left'>Total</Text>
                    </Col>
                    <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Text color={Color.text}  size={11} type='bold' align='left'>GRATIS</Text>
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
            data={{name: 'riyan'}}
            onClose={() => {
                onSave();
            }}
        />
    </Scaffold>
  )
}

export default CheckoutEvent
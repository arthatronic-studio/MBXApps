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
import Ecommerce from '../Ecommerce/Ecommerce';
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

const PemesananTiket = ({navigation}) => {
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
		header={<Header customIcon title="Pemesanan Tiket" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ScrollView>
            <View style={{ borderColor: '#CDD1D2', margin: 16, borderWidth: 1, padding: 10, borderRadius: 10 }}>
                <Row style={{ marginBottom: 5 }}>
                    <Text color='#111' type='bold' size={11}>PRESALE - Regular (A)</Text>
                    <Col>
                        <Text size={11} color={Color.text} type='medium' align='right'>08 Feb 2022</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: 12, }}>
                    <Row style={{ marginRight: 10,  alignItems: 'center' }}>
                        <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 3, borderRadius: 14 }}>
                            <Image source={ImagesPath.refund} style={{ width: 15, height: 15, borderRadius: 7 }} />
                        </View>
                        <Text color={Color.text} size={11}>Bisa Refund</Text>
                    </Row>
                    <Row style={{ marginRight: 10, alignItems: 'center' }}>
                        <View style={{  width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 3, borderRadius: 14 }}>
                            <Image source={ImagesPath.calendar} style={{  width: 16, height: 16, borderRadius: 7 }} />
                        </View>
                        <Text color={Color.text} size={11}>Tidak Perlu Reservasi</Text>
                    </Row>
                </Row>
                <View style={{ height: 1,  marginVertical: 12 }} />
                <Row style={{  alignItems: 'center' }}>
                    <Col size={8} style={{   alignItems: 'flex-start', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                        <Text color={Color.text} size={9}>Harga</Text>
                        <Text color={Color.text} size={14} type='semibold'>{FormatMoney.getFormattedMoney(100000)}/pax</Text>
                    </Col>
                    <Col style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity style={{ borderColor: Color.primary, borderWidth: 1, borderRadius: 30, paddingVertical: 8, paddingHorizontal: 10 }}>
                            <Text color={Color.primary} type='medium' size={11}>Ganti Tiket</Text>
                        </TouchableOpacity>
                    </Col>
                </Row>
            </View>
            <View style={{ height: 8, backgroundColor: '#eee', marginVertical: 10 }} />
            
            
        </ScrollView>
        <View style={{width: '100%',  height: 70, alignItems: 'center', borderRadius: 10}}>
            <TouchableOpacity onPress={() => submit()} style={{backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
                <Text style={{color: Color.textInput}}>Pesan Tiket</Text>
            </TouchableOpacity>
        </View>

        {passangerInput && <ModalPassanger
            ref={modalPassangerRef}
            data={{name: 'riyan'}}
            onClose={() => {
                onSave();
            }}
        />}
    </Scaffold>
  )
}

export default PemesananTiket
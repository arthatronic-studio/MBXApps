import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Switch } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNFetchBlob from 'react-native-blob-util';
import { Calendar } from 'react-native-calendars';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DocumentPicker from 'react-native-document-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import { initialLatitude, initialLongitude, statusBarHeight } from 'src/utils/constants';

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
import { Container, Divider } from 'src/styled';
import imageAssets from 'assets/images';
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

const PemesananTiket = ({ navigation }) => {
    const user = useSelector((state) => state['user.auth'].login.user);
    const loading = useSelector((state) => state['user.auth'].loading);
    const route = useRoute();
    const { params } = route;

    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [name, setName] = useState(user ? user.firstName + ' ' + user.lastName : '');
    const [isTicket, setSwitch] = useState();
    const [qty, setQty] = useState(1);
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

    useEffect(() => {
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

    const disabledDecrease = qty < 2;
    const disabledIncrease = qty > 9;
    
    return (
        <Scaffold
            header={<Header customIcon title="Pemesanan Tiket" type="regular" centerTitle={false} />}
            onPressLeftButton={() => navigation.pop()}
        >
            <ScrollView>
                <Container paddingHorizontal={16} paddingTop={8} paddingBottom={statusBarHeight}>
                    <Text size={11} type='bold' align='left'>Tiket Dipilih</Text>

                    <View style={{ marginTop: 8, padding: 10, borderRadius: 8, backgroundColor: Color.primaryMoreDark }}>
                        <Row style={{justifyContent: 'space-between'}}>
                            <Text type='bold' size={11}>{ticketSelected.name}</Text>
                            <Text size={11} color={Color.text} type='medium' align='right'>{moment(params.date).format('DD MMM YYYY')}</Text>
                        </Row>
                        <Row style={{ paddingVertical: 16 }}>
                            <Row style={{ marginRight: 10, alignItems: 'center' }}>
                                <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 3, borderRadius: 14 }}>
                                    <Image source={ImagesPath.refund} style={{ width: 15, height: 15, borderRadius: 7, tintColor: Color.text }} />
                                </View>
                                <Text color={Color.text} size={11}>{ticketSelected.refund ? 'Bisa Refund' : 'Tidak Bisa Refund'}</Text>
                            </Row>
                            <Row style={{ marginRight: 10, alignItems: 'center' }}>
                                <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 3, borderRadius: 14 }}>
                                    <Image source={imageAssets.calendarRemove} style={{ width: 16, height: 16, borderRadius: 7 }} />
                                </View>
                                <Text color={Color.text} size={11}>{ticketSelected.reservation ? 'Bisa Reservasi' : 'Tidak Bisa Reservasi'}</Text>
                            </Row>
                        </Row>
                        
                        <Row style={{ alignItems: 'center' }}>
                            <Col size={8} style={{ alignItems: 'flex-start', justifyContent: 'center', marginRight: 6, borderRadius: 14 }}>
                                <Text color={Color.text} size={9}>Harga</Text>
                                <Text color={Color.text} size={14} type='semibold'>{ticketSelected.type === 'FREE' ? 'GRATIS' : FormatMoney.getFormattedMoney(ticketSelected.price)}/pax</Text>
                            </Col>
                            <Col style={{ alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => modalChangeTicketRef.current.open()} style={{ borderColor: Color.primary, borderWidth: 1, borderRadius: 30, paddingVertical: 8, paddingHorizontal: 10 }}>
                                    <Text color={Color.primary} type='medium' size={11}>Ganti Tiket</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </View>

                    <Divider />

                    <Text size={11} type='bold' align='left'>Pilih Tanggal</Text>

                    <Divider height={8} />

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
                                        backgroundColor: Color.tertiary,
                                    },
                                    text: {
                                        color: Color.textButtonInline,
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                        }}
                        theme={{
                            calendarBackground: Color.primaryMoreDark,
                            textSectionTitleColor: '#b6c1cd',
                            textSectionTitleDisabledColor: '#d9e1e8',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#00adf5',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e1e8',
                            dotColor: '#00adf5',
                            selectedDotColor: '#ffffff',
                            arrowColor: Color.primary,
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: Color.text,
                            indicatorColor: 'blue',
                            textDayFontFamily: 'Inter',
                            textMonthFontFamily: 'Inter',
                            textDayHeaderFontFamily: 'Inter',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 14,
                            textMonthFontSize: 14,
                            textDayHeaderFontSize: 14
                        }}
                        style={{
                            borderRadius: 8,
                        }}
                    />

                    <Row style={{ alignItems: 'center', marginTop: 16}}>
                        <View style={{ backgroundColor: Color.tertiary, marginRight: 4, height: 9, width: 9, borderRadius: 5 }} />
                        <Text type='bold' color={Color.tertiary} size={9} style={{ marginRight: 10 }}>Dipilih</Text>
                        <View style={{ backgroundColor: Color.text, marginRight: 4, height: 9, width: 9, borderRadius: 5 }} />
                        <Text type='bold' size={9} style={{ marginRight: 10 }}>Tersedia</Text>
                        <View style={{ backgroundColor: Color.disabled, marginRight: 4, height: 9, width: 9, borderRadius: 5 }} />
                        <Text type='bold' color={Color.disabled} size={9} style={{ marginRight: 10 }}>Tidak Tersedia</Text>
                    </Row>

                    <View style={{ marginTop: 48 }}>
                        <Text type='bold' align='left' size={11}>Jumlah Tiket</Text>
                        <Text align='left' size={10}>Min. Pembelian 1 dan maks. pembelian 10 tiket dalam 1 kali order</Text>
                    </View>

                    <Row style={{ marginTop: 16 }}>
                        <Col>
                            <Text color={Color.disabled} align='left' size={10}>PAX</Text>
                            <Text type='semibold' align='left' size={14}>{ticketSelected.type === 'FREE' ? 'GRATIS' : FormatMoney.getFormattedMoney(ticketSelected.price)}</Text>
                        </Col>
                        <Col style={{ justifyContent: 'center' }}>
                            <Row style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (disabledDecrease) return;
                                        setQty(qty - 1);
                                    }}
                                    style={{ marginLeft: 24 }}
                                >
                                    <AntDesign
                                        name="minuscircleo"
                                        color={Color.primary}
                                        size={20}
                                        style={{
                                            opacity: disabledDecrease ? 0.5 : 1,
                                        }}
                                    />
                                </TouchableOpacity>
                                <View style={{minWidth: 40}}>
                                    <Text color={Color.text} type='bold' size={18} style={{ marginHorizontal: 8 }}>{qty}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (disabledIncrease) return;
                                        setQty(qty + 1);
                                    }}
                                >
                                    <AntDesign
                                        name="pluscircleo"
                                        color={Color.primary}
                                        size={20}
                                        style={{
                                            opacity: disabledIncrease ? 0.5 : 1,
                                        }}
                                    />
                                </TouchableOpacity>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </ScrollView>

            <View style={{ width: '100%', height: 70, alignItems: 'center', borderRadius: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('CheckoutEvent', {
                            ticket: {
                                ...ticketSelected,
                                nameEvent: params.name,
                                date: params.date,
                                image: '',
                                eventId: params.id,
                                ticketId: ticketSelected.id,
                                userOrderEmail: 'muhlis@gmail.com',
                                userOrderName: 'Muhlis',
                                userOrderPhone: '0888888888',
                                qty,
                            }
                        });
                    }}
                    style={{ backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center' }}
                >
                    <Text type='semibold' style={{ color: Color.textButtonInline }}>Pesan Tiket</Text>
                </TouchableOpacity>
            </View>

            <ModalChangeTicket
                ref={modalChangeTicketRef}
                data={{ name: 'riyan' }}
                adjust={true}
                onClose={onClose}
            />
        </Scaffold>
    )
}

export default PemesananTiket
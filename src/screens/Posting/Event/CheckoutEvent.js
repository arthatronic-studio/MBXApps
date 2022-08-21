import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Switch } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import { connect, useDispatch, useStore } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNFetchBlob from 'react-native-blob-util';

import AntDesign from 'react-native-vector-icons/AntDesign';
import DocumentPicker from 'react-native-document-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import { initialLatitude, initialLongitude } from 'src/utils/constants';

import {
    Text,
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
import { Container, Divider } from 'src/styled';
import imageAssets from 'assets/images';

const CheckoutEvent = ({ navigation, route }) => {
    const user = useSelector((state) => state['user.auth'].login.user);
    const auth = useSelector((state) => state['auth']);

    const dispatch = useDispatch();
    const { params } = route;
    console.log(params, 'paramsss');

    const dummyArrPengunjung = new Array(params.ticket.qty).fill({});
    console.log('dummyArrPengunjung', dummyArrPengunjung);

    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [name, setName] = useState(auth && auth.user ? auth.user.name : '');
    const [passanger, setPassanger] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const modalPassangerRef = useRef();
    const [tickets, setTickets] = useState([{
        name: '',
        quota: 1,
        refund: true,
        reservation: true,
    }]);
    const [isSamaDgPemesan, setIsSamaDgPemesan] = useState(false);
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

    const submit = async () => {
        navigation.navigate('PaymentScreen', { back: true });
        return;
        showLoading()
        const variables = {
            type: 'BOOKING',
            newOrder: {
                userId: user.userId,
                eventId: params.ticket.eventId,
                ticketId: params.ticket.ticketId,
                userOrderName: params.ticket.userOrderName,
                userOrderPhone: params.ticket.userOrderPhone,
                userOrderEmail: params.ticket.userOrderEmail,
                orderItems: passanger,
            }
        }
        console.log(variables)
        client.mutate({ mutation: mutationOrderEvent, variables })
            .then(res => {
                hideLoading();
                console.log(res.data);
                if (res.data.eventTicketOrderManage.success) {
                    console.log('manage')
                    if (res.data.eventTicketOrderManage.data.status === 'PAID') {
                        navigation.navigate('OrderEventDetail', { item: res.data.eventTicketOrderManage.data });
                    } else {
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
                            navigation.navigate('PaymentScreen', { back: true });
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

    const onChange = (value, name, id) => {
        const tempx = tickets
        tickets[id][name] = value
        setTickets(tempx)
        setRefresh(refresh + 1);

    }

    const getDocument = async (name) => {
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
                    if (name == 'tnc') setTnc(data)
                    else setRefundPolicy(data)
                })
                .catch((err) => { });
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
            header={<Header customIcon title="Detail Pemesanan" centerTitle={false} />}
            onPressLeftButton={() => navigation.pop()}
            loadingProps={loadingProps}
        >
            <ScrollView>
                <Container paddingHorizontal={16} paddingBottom={16}>
                    <View style={{ backgroundColor: Color.theme, borderWidth: 1, padding: 10, borderRadius: 8 }}>
                        <Container align='center' style={{ flexDirection: 'row' }}>
                            <Image source={{ uri: '' }} style={{ height: 48, width: 48, borderRadius: 8, marginRight: 8, backgroundColor: Color.border }} />
                            <Text type='semibold' align='left'>Pestapora 2022</Text>
                        </Container>

                        <View style={{ height: 1, backgroundColor: Color.border, marginVertical: 16 }} />

                        <Row style={{ marginBottom: 4, justifyContent: 'space-between' }}>
                            <Text type='bold' size={11}>{params.ticket.name}</Text>
                            <Text size={11} color={Color.disabled} type='medium'>{moment(params.ticket.date).format('DD MMM YYYY')}</Text>
                        </Row>

                        <Text size={10} align='left' color={Color.disabled}>1 Tiket • 1 Pax</Text>

                        <View style={{ height: 1, backgroundColor: Color.border, marginVertical: 16 }} />

                        <Row>
                            <Row style={{ marginRight: 10, alignItems: 'center' }}>
                                <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
                                    <Image
                                        source={ImagesPath.refund}
                                        style={{ width: 15, height: 15, tintColor: Color.text }}
                                    />
                                </View>
                                <Text color={Color.text} size={11}>{params.ticket.refund ? 'Bisa Refund' : 'Tidak Bisa Refund'}</Text>
                            </Row>
                            <Row style={{ marginRight: 10, alignItems: 'center' }}>
                                <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
                                    <Image source={imageAssets.calendar} style={{ width: 16, height: 16, borderRadius: 7 }} />
                                </View>
                                <Text color={Color.text} size={11}>{params.ticket.reservation ? 'Bisa Reservasi' : 'Tidak Bisa Reservasi'}</Text>
                            </Row>
                        </Row>
                    </View>

                    <Divider />
                    <Text type='bold' align='left'>Detail Pemesan</Text>

                    <View style={{ marginTop: 8, padding: 10, borderRadius: 8, backgroundColor: Color.theme }}>
                        <Row>
                            <Col>
                                <Text type='bold' align='left'>{auth.user.name}</Text>
                                <Divider height={8} />
                                <Row style={{ alignItems: 'center' }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                                        <Image
                                            source={imageAssets.call}
                                            resizeMode='contain'
                                            style={{ width: 14, height: 14, tintColor: Color.text }}
                                        />
                                    </View>
                                    <Text color={Color.text} size={12}>+{auth.user.phone}</Text>
                                </Row>
                                <Divider height={4} />
                                <Row style={{ alignItems: 'center' }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                                        <Image
                                            source={imageAssets.mail}
                                            style={{ width: 14, height: 14, tintColor: Color.text }} />
                                    </View>
                                    <Text color={Color.text} size={12}>{auth.user.email}</Text>
                                </Row>
                            </Col>
                            <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <AntDesign name='right' size={18} color={Color.text} />
                            </Col>
                        </Row>
                    </View>

                    <Divider />
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type='bold' align='left'>Detail Pengunjung</Text>
                        <Row style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text size={12} color={Color.disabled}>Sama dengan pemesan</Text>
                            <Switch
                                value={isSamaDgPemesan}
                                onValueChange={(val) => setIsSamaDgPemesan(val)}
                                thumbColor={isSamaDgPemesan ? Color.primary : Color.text}
                                trackColor={{
                                    true: Color.border,
                                    false: Color.border,
                                }}
                                style={{
                                    marginLeft: 8,
                                    transform: [{ scaleX: .8 }, { scaleY: .8 }]
                                }}
                            />
                        </Row>
                    </Row>

                    {dummyArrPengunjung.map((_, idx) => {
                        return (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => modalPassangerRef.current.open()}
                                style={{ marginTop: 8, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 8, backgroundColor: Color.theme }}
                            >
                                <Row>
                                    <Col>
                                        <Text color={Color.text} type='bold' align='left'>{passanger.length > 0 ? passanger[0].title + ' ' + passanger[0].name : 'Tiket 1 (Pax)'}</Text>
                                    </Col>
                                    <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <AntDesign name='right' size={18} color={Color.text} />
                                    </Col>
                                </Row>
                            </TouchableOpacity>
                        )
                    })}

                    <Divider />

                    <Text type='bold' align='left'>Detail Harga</Text>
                    <View style={{ backgroundColor: Color.primaryDark, marginTop: 8, padding: 10, borderRadius: 8 }}>
                        <Row style={{ marginBottom: 8 }}>
                            <Col>
                                <Text color={Color.primarySoft} size={12} align='left'>Subtotal</Text>
                            </Col>
                            <Col size={4} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text color={Color.primarySoft} size={12} align='left'>{FormatMoney.getFormattedMoney(params.ticket.price)}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 8 }}>
                            <Col>
                                <Text color={Color.primarySoft} size={12} align='left'>Ppn 10%</Text>
                            </Col>
                            <Col size={4} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text color={Color.primarySoft} size={12} align='left'>{FormatMoney.getFormattedMoney(params.ticket.price * 0.1)}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 0 }}>
                            <Col>
                                <Text color={Color.primarySoft} size={12} align='left'>Total</Text>
                            </Col>
                            <Col size={4} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text color={Color.primarySoft} size={12} align='left'>{params.ticket.type === 'FREE' ? 'GRATIS' : FormatMoney.getFormattedMoney(params.ticket.price + params.ticket.price * 0.1)}</Text>
                            </Col>
                        </Row>
                    </View>

                    <Divider />
                    <Text type='bold' align='left'>Kode Promo</Text>
                    <TouchableOpacity
                        onPress={() => { }}
                        style={{ marginTop: 8, borderWidth: 0.5, borderColor: Color.border, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 8 }}
                    >
                        <Row>
                            <Image
                                source={imageAssets.discount}
                                style={{
                                    width: 20,
                                    height: 16,
                                    marginRight: 12,
                                }}
                            />
                            <Col>
                                <Text color={Color.text} type='bold' align='left' letterSpacing={0.25}>QWERTY</Text>
                            </Col>
                            <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text size={12} color={Color.primary} type='medium'>Gunakan</Text>
                            </Col>
                        </Row>
                    </TouchableOpacity>
                </Container>
            </ScrollView>

            <View style={{ width: '100%', height: 70, alignItems: 'center', borderRadius: 10 }}>
                <TouchableOpacity onPress={() => submit()} style={{ backgroundColor: Color.primary, width: '90%', height: 45, borderRadius: 50, justifyContent: 'center' }}>
                    <Text style={{ color: Color.textInput }}>Pesan Tiket</Text>
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
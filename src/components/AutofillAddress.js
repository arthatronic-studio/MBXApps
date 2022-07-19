import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    Text,
    // TouchableOpacity,
    Loading,
    useLoading,
    Scaffold,
    useColor,
    Header
} from '@src/components';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import FormSelect from '@src/components/FormSelect';
import ModalSelectMap from '@src/components/ModalSelectMap';
import { initialLatitude, initialLongitude } from 'src/utils/constants';
import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DropDownPicker from 'react-native-dropdown-picker';

const AutofillAddress = ({ }) => {
    const user = useSelector((state) => state['user.auth'].login.user);
    const loading = useSelector((state) => state['user.auth'].loading);

    const [loadingProps, showLoading, hideLoading] = useLoading();
    const { Color } = useColor();

    const [open, setOpen] = useState(false);

    const [address, setAddress] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [kecamatan, setKecamatan] = useState('');
    const [kelurahan, setKelurahan] = useState('');

    const [coords, setCoords] = useState({
        latitude: initialLatitude,
        longitude: initialLongitude,
    });

    const [modalSelectMap, setModalSelectMap] = useState(false);
    const [locationPinnedMap, setLocationPinnedMap] = useState('');

    useEffect(() => {
        console.log('first')
    }, []);

    return (
        <View>
            <FormSelect
                type='select'
                hideErrorHint
                label='Pin Lokasi'
                value={locationPinnedMap}
                placeholder='Pilih di Peta'
                onPress={() => {
                    setModalSelectMap(true);
                }}
                labelContainerStyle={{
                    paddingTop: 0,
                    marginBottom: 4,
                }}
            />

            <View style={{paddingHorizontal: 16, marginTop: 8}}>
                <View style={{ alignItems: 'flex-start', marginBottom: 8 }}>
                    <View style={{ width: '100%' }}>
                        <TextInput placeholder='Masukkan alamat lengkap . . .' style={{
                            borderWidth: 1, borderColor: Color.border,
                            color: Color.text,
                            width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, minHeight: 40
                        }}
                            onChangeText={(value) => setAddress(value)}
                            multiline
                            value={address}
                        />
                        <Text style={{ fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5 }}>Alamat lengkap</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', marginBottom: 8 }}>
                    <View style={{ width: '100%' }}>
                        <TextInput placeholder='Banten' style={{
                            borderWidth: 1, borderColor: Color.border,
                            color: Color.text,
                            width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                        }}
                            onChangeText={(value) => setProvince(value)}
                            value={province}
                        />
                        <Text style={{ fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5 }}>Provinsi</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', marginBottom: 8}}>
                    <View style={{ width: '100%' }}>
                        <TextInput placeholder='Tangerang' style={{
                            borderWidth: 1, borderColor: Color.border,
                            color: Color.text,
                            width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                        }}
                            onChangeText={(value) => setCity(value)}
                            value={city}
                        />
                        <Text style={{ fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5 }}>Kota/Kabupaten</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', marginBottom: 8}}>
                    <View style={{ width: '100%' }}>
                        <TextInput placeholder='Jatiuwung' style={{
                            borderWidth: 1, borderColor: Color.border,
                            color: Color.text,
                            width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                        }}
                            onChangeText={(value) => setKecamatan(value)}
                            value={kecamatan}
                        />
                        <Text style={{ fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5 }}>Kecamatan</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', marginBottom: 8 }}>
                    <View style={{ width: '100%' }}>
                        <TextInput placeholder='Keroncong' style={{
                            borderWidth: 1, borderColor: Color.border,
                            color: Color.text,
                            width: '100%', borderRadius: 5, paddingHorizontal: 10, paddingTop: 20, height: 47
                        }}
                            onChangeText={(value) => setKelurahan(value)}
                            value={kelurahan}
                        />
                        <Text style={{ fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5 }}>Kelurahan</Text>
                    </View>
                </View>

                <ModalSelectMap
                    visible={modalSelectMap}
                    extraProps={{
                        title: 'Alamat Saya',
                        fullAddress: '',
                        ...coords,
                    }}
                    onSelect={(item) => {
                        // const name = item.name;
                        const spl = item.fullAddress.split(",");
                        const fullAddress = item.fullAddress;
                        const latitude = item.latitude;
                        const longitude = item.longitude;

                        const provinceName = item.provinceName
                        const cityName = item.cityName
                        const postCode = item.postCode
                        const kecName = spl[3]
                        const kelName = spl[2]

                        setProvince(provinceName)
                        setCity(cityName)
                        setKecamatan(kecName)
                        setKelurahan(kelName)
                        setAddress(fullAddress)

                        setLocationPinnedMap(fullAddress);
                        setCoords({
                            latitude,
                            longitude,
                        });
                    }}
                    onClose={() => setModalSelectMap(false)}
                />
            </View>
        </View>
    )
}

export default AutofillAddress
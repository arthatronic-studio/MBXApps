import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView, TextInput as TextInputs } from 'react-native';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Row, Col,
  useColor,
  Header,
  ModalListAction,
  usePopup,
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';
import FormSelect from '@src/components/FormSelect';
import ModalSelectMap from '@src/components/ModalSelectMap';
import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { TextInput } from 'src/components/Form';
import ModalProvince from 'src/components/Modal/ModalProvince';
import { queryAddAddress, queryEditAddress, queryGetArea, queryGetCity, queryGetProvince, queryGetSub } from 'src/lib/query/ecommerce';
import { initialLatitude, initialLongitude } from 'src/utils/constants';
import FormInput from 'src/components/FormInput';
import { Container } from 'src/styled';
import { fetchShipperGetAreaList, fetchShipperGetCityList, fetchShipperGetProvinceList, fetchShipperGetSuburbList } from 'src/api/shipper';

const ManageAddressScreen = ({ route, navigation }) => {
  const { params } = route;
  const itemAddress = params && params.item;
  
  console.log(itemAddress);
  
  const [label, setLabel] = useState(itemAddress ? itemAddress.labelAddress : '');
  const [name, setName] = useState(itemAddress ? itemAddress.penerimaName : '');
  const [phone, setPhone] = useState(itemAddress ? itemAddress.noTelp : '');
  const [address, setAddress] = useState(itemAddress ? itemAddress.address : '');
  const [postalCode, setCode] = useState(itemAddress ? itemAddress.postalCode : '');
  const [prov, setProv] = useState(itemAddress ? itemAddress.province : null);
  const [kota, setKota] = useState(itemAddress ? itemAddress.city : null);
  const [kec, setKec] = useState(itemAddress ? itemAddress.suburb : null);
  const [area, setArea] = useState(itemAddress ? itemAddress.area : null);
  const [coords, setCoords] = useState({
    latitude: itemAddress ? itemAddress.latitude : initialLatitude,
    longitude: itemAddress ? itemAddress.longitude : initialLongitude,
  });
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [dataSub, setDataSub] = useState([]);
  const [nameModal, setnameModal] = useState(null);
  const [modalSelectMap, setModalSelectMap] = useState(false);
  const [locationPinnedMap, setLocationPinnedMap] = useState(itemAddress ? 'Lokasi sudah di pin' : '');

  // selector
  const user = useSelector(state => state['user.auth'].login.user);

  const modalListActionRef = useRef();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();
  const { Color } = useColor();

  useEffect(() => {
    const fetchProvince = async() => {
      const result = await fetchShipperGetProvinceList();
      if (result.status) {
        setDataProvince(result.data);
      }
    }

    fetchProvince();
  }, []);

  useEffect(() => {
    const fetchCity = async() => {
      const result = await fetchShipperGetCityList({ provinceId: prov.id });
      if (result.status) {
        setDataCity(result.data);
      }
    }

    if (prov) {
      fetchCity();
    } else {
      setKota();
      setDataCity([]);
    }
  }, [prov]);

  useEffect(() => {
    const fetchSub = async() => {
      const result = await fetchShipperGetSuburbList({ cityId: kota.id });
      if (result.status) {
        setDataSub(result.data);
      }
    }

    if (kota) {
      fetchSub();
    } else {
      setKec();
      setDataSub([]);
    }
  }, [kota]);

  useEffect(() => {
    const fetchArea = async() => {
      const result = await fetchShipperGetAreaList({ suburbId: kec.id });
      if (result.status) {
        setDataArea(result.data);
      }
    }

    if (kec) {
      fetchArea();
    }
    else {
      setArea();
      setDataArea([]);
    }
  }, [kec]);

  const onSubmit = () => {
    if (!label) {
      showPopup('Nama alamat wajib diisi', 'error');
      return;
    }

    if (!name) {
      showPopup('Nama penerima wajib diisi', 'error');
      return;
    }

    if (!phone) {
      showPopup('No. telepon wajib diisi', 'error');
      return;
    }

    if (!locationPinnedMap) {
      showPopup('Pin pada peta terlebih dulu', 'error');
      return;
    }

    if (!address) {
      showPopup('Alamat lengkap wajib diisi', 'error');
      return;
    }

    if (!prov) {
      showPopup('Provinsi wajib diisi', 'error');
      return;
    }

    if (!kota) {
      showPopup('Kota wajib diisi', 'error');
      return;
    }

    if (!kec) {
      showPopup('Kecamatan wajib diisi', 'error');
      return;
    }

    if (!area) {
      showPopup('Area wajib diisi', 'error');
      return;
    }

    if (!postalCode) {
      showPopup('Kode pos wajib diisi', 'error');
      return;
    }

    let variables = {
      addresses: {
        countryId: 228,
        userId: user.userId,
        labelAddress: label,
        penerimaName: name,
        noTelp: phone,
        latitude: coords.latitude.toString(),
        longitude: coords.longitude.toString(),
        address: address,
        provinceId: prov ? prov.id : prov,
        cityId: kota ? kota.id : kota,
        suburbId: kec ? kec.id : kec,
        areaId: area ? area.id : area,
        postalCode: postalCode,
      }
    };

    let quer = queryAddAddress;

    if (itemAddress) {
      quer = queryEditAddress;
      variables.addresses['id'] = itemAddress.id;
    }

    console.log(variables);

    showLoading();

    Client.mutate({ mutation: quer, variables })
      .then(res => {
        hideLoading()
        console.log(res)
        let success = false;

        if (Array.isArray(res.data.userAddressAdd) && res.data.userAddressAdd.length > 0) {
          success = true;
          alert('Success Add Address');
        }

        if (Array.isArray(res.data.userAddressEdit) && res.data.userAddressEdit.length > 0) {
          success = true;
          alert('Success Edit Address');
        }

        if (success) {
          setTimeout(() => {
            if (params.prevScreen) {
              navigation.navigate(params.prevScreen, { refresh: true });
            } else {
              navigation.pop();
            }
          }, 2500);
        }
      })
      .catch(reject => {
        hideLoading()
        alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };

  const onSelected = (item, name) => {
    if (name == 'prov') {
      setProv(item);
      setKota(null);
      setKec(null);
      setArea(null);
    }
    else if (name == 'city') {
      setKota(item);
      setKec(null);
      setArea(null);
    }
    else if (name == 'sub') {
      setKec(item);
      setArea(null);
    }
    else {
      setArea(item);
    }
    
    modalListActionRef.current.close();
  }

  return (
    <Scaffold
      loadingProps={loadingProps}
      popupProps={popupProps}
      headerTitle={`${itemAddress ? 'Ubah' : 'Tambah'} Alamat`}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 16 }}>
          <Container paddingHorizontal={16} paddingTop={16}>
            <FormInput
              label='Nama Alamat'
              placeholder='Masukan nama alamat'
              hideErrorHint
              value={label}
              onChangeText={(text) => setLabel(text)}
            />
          
          </Container>

          <TextInput
            title='Nama Penerima'
            placeholder='Masukan nama penerima'
            color={Color.text}
            onChangeText={(e) => setName(e)}
            value={name}
            placeholderTextColor={Color.border}
            textInputStyle={{ borderWidth: 2, borderColor: Color.border, borderRadius: 5, paddingLeft: 10 }}
            style={{ height: 50, color: Color.gray, fontSize: 14, borderWidth: 1, fontFamily: 'Inter-Regular', marginLeft: 8 }}
          />

          <TextInput
            placeholder='813-1234-5678'
            title='No. Telepon'
            keyboardType='numeric'
            color={Color.text}
            onChangeText={(e) => setPhone(e)}
            value={phone}
            placeholderTextColor={Color.border}
            textInputStyle={{ borderWidth: 2, borderColor: Color.border, borderRadius: 5, paddingLeft: 10 }}
            style={{ height: 50, color: Color.gray, fontSize: 14, borderWidth: 1, fontFamily: 'Inter-Regular', marginLeft: 8 }}
          />

          <FormSelect
            type='select'
            label='Pin Lokasi'
            value={locationPinnedMap}
            placeholder='Pilih di Peta'
            onPress={() => {
              setModalSelectMap(true);
            }}
          />

          <Text align='left' style={{ marginLeft: 16, color: Color.gray }} size={13}>Alamat Lengkap</Text>
          <TextInputs
            numberOfLines={3}
            placeholder='Tuliskan Alamat'
            title='Alamat Lengkap'
            color={Color.text}
            onChangeText={(e) => setAddress(e)}
            value={address}
            multiline
            placeholderTextColor={Color.border}
            style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, borderRadius: 5, paddingLeft: 10, minHeight: 100 }}
          />

          <View>
            <Text align='left' style={{ marginTop: 15, marginLeft: 16, color: Color.gray }} size={13}>Provinsi</Text>
            <TouchableOpacity onPress={() => { setnameModal('prov'); modalListActionRef.current.open() }} style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, paddingVertical: 15, borderRadius: 5, paddingHorizontal: 10 }}>
              <Row>
                <Col size={8}>
                  <Text align='left'>{prov ? prov.name : 'Pilih Provinsi'}</Text>
                </Col>
                <Col alignItems='flex-end' justifyContent='center'>
                  <AntDesign name='down' color={Color.text} size={15} />
                </Col>
              </Row>
            </TouchableOpacity>
          </View>

          <View>
            <Text align='left' style={{ marginTop: 15, marginLeft: 16, color: Color.gray }} size={13}>Kota / Kabupaten</Text>
            <TouchableOpacity onPress={() => { setnameModal('city'); modalListActionRef.current.open() }} style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, paddingVertical: 15, borderRadius: 5, paddingHorizontal: 10 }}>
              <Row>
                <Col size={8}>
                  <Text align='left'>{kota ? kota.name : 'Pilih Kota / Kabupaten'}</Text>
                </Col>
                <Col alignItems='flex-end' justifyContent='center'>
                  <AntDesign name='down' color={Color.text} size={15} />
                </Col>
              </Row>
            </TouchableOpacity>
          </View>

          <View>
            <Text align='left' style={{ marginTop: 15, marginLeft: 16, color: Color.gray }} size={13}>Kecamatan</Text>
            <TouchableOpacity onPress={() => { setnameModal('sub'); modalListActionRef.current.open() }} style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, paddingVertical: 15, borderRadius: 5, paddingHorizontal: 10 }}>
              <Row>
                <Col size={8}>
                  <Text align='left'>{kec ? kec.name : 'Pilih Kecamatan'}</Text>
                </Col>
                <Col alignItems='flex-end' justifyContent='center'>
                  <AntDesign name='down' color={Color.text} size={15} />
                </Col>
              </Row>
            </TouchableOpacity>
          </View>

          <View>
            <Text align='left' style={{ marginTop: 15, marginLeft: 16, color: Color.gray }} size={13}>Area</Text>
            <TouchableOpacity onPress={() => { setnameModal('area'); modalListActionRef.current.open() }} style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, paddingVertical: 15, borderRadius: 5, paddingHorizontal: 10 }}>
              <Row>
                <Col size={8}>
                  <Text align='left'>{area ? area.name : 'Pilih Area'}</Text>
                </Col>
                <Col alignItems='flex-end' justifyContent='center'>
                  <AntDesign name='down' color={Color.text} size={15} />
                </Col>
              </Row>
            </TouchableOpacity>
          </View>

          <TextInput
            title='Kode Pos'
            placeholder='Masukan kode pos'
            keyboardType='numeric'
            color={Color.text}
            onChangeText={(e) => setCode(e)}
            value={postalCode}
            placeholderTextColor={Color.border}
            textInputStyle={{ borderWidth: 2, borderColor: Color.border, borderRadius: 5, paddingLeft: 10 }}
            style={{ height: 50, color: Color.gray, fontSize: 14, borderWidth: 1, fontFamily: 'Inter-Regular', marginLeft: 8 }}
          />
        </View>
      </ScrollView>

      <View style={{ backgroundColor: Color.theme }}>
        <TouchableOpacity onPress={() => onSubmit()} style={{ backgroundColor: Color.info, borderRadius: 30, margin: 15, paddingVertical: 10 }}>
          <Text type='semibold' color={Color.textInput}>Lanjutkan</Text>
        </TouchableOpacity>
      </View>

      <ModalListAction
        ref={modalListActionRef}
        adjust={false}
        name={nameModal}
        onPress={(item, name) => { onSelected(item, name); }}
        data={nameModal == 'prov' ? dataProvince : nameModal == 'city' ? dataCity : nameModal == 'sub' ? dataSub : nameModal == 'area' ? dataArea : []}
      />

      <ModalSelectMap
        visible={modalSelectMap}
        extraProps={{
          title: 'Alamat Saya',
          fullAddress: '',
          ...coords,
        }}
        onSelect={(item) => {
          // const name = item.name;
          const fullAddress = item.fullAddress;
          const latitude = item.latitude;
          const longitude = item.longitude;

          // const provinceName = item.provinceName ? item.provinceName : state.userData.provinceName;
          // const cityName = item.cityName ? item.cityName : state.userData.cityName;
          // const postCode = item.postCode ? item.postCode : state.userData.postCode;

          setLocationPinnedMap(fullAddress);
          setCoords({
            latitude,
            longitude,
          });

          // setState({
          //   userData: {
          //     ...state.userData,
          //     fullAddress,
          //     latitude,
          //     longitude,
          //     provinceName,
          //     cityName,
          //     postCode,
          //   }
          // });
        }}
        onClose={() => setModalSelectMap(false)}
      />
    </Scaffold>
  );
}

export default ManageAddressScreen;
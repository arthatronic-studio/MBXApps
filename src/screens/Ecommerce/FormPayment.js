import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView, TextInput as TextInputs } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MapView, {Marker} from 'react-native-maps'
import Fontisto from 'react-native-vector-icons/Fontisto';
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

const FormPayment = ({ route, navigation }) => {
  const routeAddress = route.params.address.address;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [nameModal, setnameModal] = useState(null);
  const [postalCode, setCode] = useState('');
  const [prov, setProv] = useState(null);
  const [kota, setKota] = useState(null);
  const [kec, setKec] = useState(null);
  const [area, setArea] = useState(null);
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [dataSub, setDataSub] = useState([]);
  const [coords, setCoords] = useState({
    latitude: !isNaN(parseFloat(route.params.address.latitude)) ? parseFloat(route.params.address.latitude) : initialLatitude,
    longitude: !isNaN(parseFloat(route.params.address.longitude)) ? parseFloat(route.params.address.longitude) : initialLongitude,
  });

  console.log('coords', coords);

  const [modalSelectMap, setModalSelectMap] = useState(false);
  const [isPinnedMap, setIsPinnedMap] = useState(
    route.params.address.latitude && route.params.address.longitude ? true : false
  );
  const [locationPinnedMap, setLocationPinnedMap] = useState('');

  console.log(isPinnedMap, 'routeng', route);

  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const modalListActionRef = useRef();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();
  
  useEffect(() => {
    firstGet();
  }, [])

  const getData = (name, value) => {
    showLoading();
    let variables = {
      countryCode: 228,
      provinceId: value ? value.id : null,
      cityId:  value ? value.id : null,
      suburbId:  value ? value.id : null,
      areaId:  value ? value.id : null,
    }
    console.log(variables)
    const queryx = name == 'prov' ? queryGetCity : name == 'city' ? queryGetSub : name == 'sub' ? queryGetArea : queryGetProvince
    Client.query({query: queryx, variables})
      .then(res => {
        hideLoading()
        console.log(res)
        if (res.data.shipperGetProvinceList) {
          setDataProvince(res.data.shipperGetProvinceList)
        }

        if (res.data.shipperGetCitiesList) {
          setDataCity(res.data.shipperGetCitiesList)
        }

        if (res.data.shipperGetSuburbList) {
          setDataSub(res.data.shipperGetSuburbList)
        }
        if (res.data.shipperGetAreaList) {
          setDataArea(res.data.shipperGetAreaList)
        }
      })
      .catch(reject => {
        hideLoading()
        alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };

  const firstGet = (name, value) => {
    showLoading();
    let variables = {
      countryCode: 228,
      provinceId: value ? value.id : null,
      cityId:  value ? value.id : null,
      suburbId:  value ? value.id : null,
      areaId:  value ? value.id : null,
    }
    console.log(variables)
    const queryx = name == 'prov' ? queryGetCity : name == 'city' ? queryGetSub : name == 'sub' ? queryGetArea : queryGetProvince
    Client.query({query: queryx, variables})
      .then(res => {
        hideLoading()
        console.log(res, name)
        if(res.data.shipperGetProvinceList){
          if (res.data.shipperGetProvinceList.length > 0) {
            setDataProvince(res.data.shipperGetProvinceList);

            if (routeAddress) {
              getData('prov', {id: route.params.address.provinceId})
              // const idx = res.data.shipperGetProvinceList.findIndex(val => val.id == route.params.address.provinceId)
              // setProv(res.data.shipperGetProvinceList[idx])

              setProv({...route.params.address.province})
              setKota({...route.params.address.city})
              setKec({...route.params.address.suburb})
              setArea({...route.params.address.area})
              
              getData('city', {id: route.params.address.cityId})
              getData('sub', {id: route.params.address.suburb.id})
              setCode(route.params.address.postalCode)
              setAddress(routeAddress);
              setName(route.params.address.penerimaName)
              setPhone(route.params.address.noTelp)
            }
          }
        }

        // if(res.data.shipperGetCitiesList){
        //   console.log('city')
        //   if (res.data.shipperGetCitiesList.length > 0) {
        //     setDataCity(res.data.shipperGetCitiesList)
        //     if (routeAddress) {
        //       const idx = res.data.shipperGetCitiesList.findIndex(val => val.id == route.params.address.cityId)
        //       setKota(res.data.shipperGetCitiesList[idx])
        //     }
        //   }
        // }
        
        // if (res.data.shipperGetSuburbList){
        //   if (res.data.shipperGetSuburbList.length > 0) {
        //     if (routeAddress) {
        //       const idx = res.data.shipperGetSuburbList.findIndex(val => val.id == route.params.address.suburbId)
        //       setKec(res.data.shipperGetSuburbList[idx])
        //     }
        //     setDataSub(res.data.shipperGetSuburbList)
        //   }
        // }

        // if (res.data.shipperGetAreaList){
        //   if (res.data.shipperGetAreaList.length > 0) {
        //     if (routeAddress) {
        //       const idx = res.data.shipperGetAreaList.findIndex(val => val.id == route.params.address.areaId)
        //       setArea(res.data.shipperGetAreaList[idx])
        //     }
        //     setDataArea(res.data.shipperGetAreaList)
        //   }
        // }
        
      })
      .catch(reject => {
        hideLoading()
        // alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };


  const submit = () => {
    const quer = routeAddress ? queryEditAddress : queryAddAddress
    
    showLoading();

    let variables = {
      addresses: {
        userId: user.userId,
        countryId: 228,
        provinceId: prov ? prov.id : prov,
        cityId: kota ? kota.id : kota,
        suburbId: kec ? kec.id : kec,
        areaId: area ? area.id : area,
        // province: prov ? prov.name : prov,
        // city: kota ? kota.name : kota,
        // suburb: kec ? kec.name : kec,
        address: address,
        postalCode: postalCode,
        penerimaName: name,
        noTelp: phone,
        latitude: isPinnedMap ? coords.latitude.toString() : null,
        longitude: isPinnedMap ? coords.longitude.toString() : null,
      }
    };

    if (routeAddress) {
      variables.addresses.id = route.params.address.id;
    }

    console.log(variables);

    Client.mutate({mutation: quer, variables})
      .then(res => {
        hideLoading()
        console.log(res)
        if(res.data.userAddressAdd){
          if (res.data.userAddressAdd.length > 0) {
            alert('Success Add Address')
            const data = {
              name,
              phone,
              address,
              postalCode,
              prov,
              kota,
              kec,
              area,
              userAddressIdDestination: res.data.userAddressAdd[0].id
            }
            navigation.navigate('CheckoutScreen',{saveAddress: { ...data, ...res.data.userAddressAdd[0] } })
          }
        }else{
          if (res.data.userAddressEdit.length > 0) {
            alert('Success Edit Address')
            const data = {
              name,
              phone,
              address,
              postalCode,
              prov,
              kota,
              kec,
              area,
              userAddressIdDestination: res.data.userAddressEdit[0].id
            }
            navigation.navigate('CheckoutScreen',{saveAddress: { ...data, ...res.data.userAddressEdit[0] } })
          }
        }
        
      })
      .catch(reject => {
        hideLoading()
        alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };

  const onSelected = (item, name) => {
    console.log(item, name)
    if(name == 'prov'){
      setProv(item)
      setKota(null)
      setKec(null)
      getData(name, item)
    }else if(name == 'city'){
      setKota(item)
      setKec(null)
      setArea(null)
      getData(name, item)
    }
    else if(name == 'sub'){
      setKec(item)
      setArea(null)
      getData(name, item)
    }else{
      setArea(item)
    }
    modalListActionRef.current.close();
  }

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header 
          customIcon 
          title='Ubah Alamat' 
          type='regular' 
          centerTitle={false}
        />
      }
    >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 40 }}>
            <TextInput
              placeholder='Adang Susanyo'
              title='Nama Penerima'
              color={Color.text}
              onChangeText={(e) => setName(e)}
              value={name}
              placeholderTextColor={Color.gray}
              textInputStyle={{ borderWidth: 2, borderColor: Color.border, borderRadius: 5, paddingLeft: 10 }}
              style={{height: 50, color: Color.gray, fontSize: 14, borderWidth: 1, fontFamily: 'Inter-Regular', marginLeft: 8}}
            />

            <TextInput
              placeholder='813-1234-5678'
              title='No Telpon'
              keyboardType='numeric'
              color={Color.text}
              onChangeText={(e) => setPhone(e)}
              value={phone}
              placeholderTextColor={Color.gray}
              textInputStyle={{ borderWidth: 2, borderColor: Color.border, borderRadius: 5, paddingLeft: 10 }}
              style={{height: 50, color: Color.gray, fontSize: 14, borderWidth: 1, fontFamily: 'Inter-Regular', marginLeft: 8}}
            />

            <FormSelect
              type='select'
              label='Pin Lokasi'
              value={isPinnedMap ? locationPinnedMap || 'Lokasi di Pin' : ''}
              placeholder='Pilih di Peta'
              onPress={() => {
                setModalSelectMap(true);
              }}
            />

            <Text align='left' style={{ marginLeft: 16, color: Color.gray }} size={13}>Alamat Lengkap</Text>
            <TextInputs
              placeholder='Tuliskan Alamat . . . '
              numberOfLines={3}
              title='Alamat Lengkap'
              color={Color.text}
              onChangeText={(e) => setAddress(e)}
              value={address}
              multiline
              placeholderTextColor={Color.gray}
              style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, borderRadius: 5, paddingLeft: 10, minHeight: 100 }}
            />

            <View>
              <Text align='left' style={{ marginTop: 15, marginLeft: 16, color: Color.gray }} size={13}>Provinsi</Text>
              <TouchableOpacity onPress={() => {setnameModal('prov'); modalListActionRef.current.open()}} style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, paddingVertical: 15, borderRadius: 5, paddingHorizontal: 10 }}>
                <Row>
                  <Col size={8}>
                    <Text align='left'>{prov ? prov.name : '- PILIH PROVINSI -'}</Text>
                  </Col>
                  <Col alignItems='flex-end' justifyContent='center'>
                    <AntDesign name='down' color={Color.text} size={15} />
                  </Col>
                </Row>
              </TouchableOpacity>
            </View>

            <View>
              <Text align='left' style={{ marginTop: 15, marginLeft: 16, color: Color.gray }} size={13}>Kota / Kabupaten</Text>
              <TouchableOpacity  onPress={() => {setnameModal('city'); modalListActionRef.current.open()}} style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, paddingVertical: 15, borderRadius: 5, paddingHorizontal: 10 }}>
                <Row>
                  <Col size={8}>
                    <Text align='left'>{kota ? kota.name : '- PILIH KOTA/KABUPATEN -'}</Text>
                  </Col>
                  <Col alignItems='flex-end' justifyContent='center'>
                    <AntDesign name='down' color={Color.text} size={15} />
                  </Col>
                </Row>
              </TouchableOpacity>
            </View>

            <View>
              <Text align='left' style={{ marginTop: 15, marginLeft: 16, color: Color.gray }} size={13}>Kecamatan</Text>
              <TouchableOpacity  onPress={() => {setnameModal('sub'); modalListActionRef.current.open()}} style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, paddingVertical: 15, borderRadius: 5, paddingHorizontal: 10 }}>
                <Row>
                  <Col size={8}>
                    <Text align='left'>{kec ? kec.name : '- PILIH KECAMATAN -'}</Text>
                  </Col>
                  <Col alignItems='flex-end' justifyContent='center'>
                    <AntDesign name='down' color={Color.text} size={15} />
                  </Col>
                </Row>
              </TouchableOpacity>
            </View>

            <View>
              <Text align='left' style={{ marginTop: 15, marginLeft: 16, color: Color.gray }} size={13}>Area</Text>
              <TouchableOpacity  onPress={() => {setnameModal('area'); modalListActionRef.current.open()}} style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, paddingVertical: 15, borderRadius: 5, paddingHorizontal: 10 }}>
                <Row>
                  <Col size={8}>
                    <Text align='left'>{area ? area.name : '- PILIH Area -'}</Text>
                  </Col>
                  <Col alignItems='flex-end' justifyContent='center'>
                    <AntDesign name='down' color={Color.text} size={15} />
                  </Col>
                </Row>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder='12345'
              title='Kode Pos'
              keyboardType='numeric'
              color={Color.text}
              onChangeText={(e) => setCode(e)}
              value={postalCode}
              placeholderTextColor={Color.gray}
              textInputStyle={{ borderWidth: 2, borderColor: Color.border, borderRadius: 5, paddingLeft: 10 }}
              style={{height: 50, color: Color.gray, fontSize: 14, borderWidth: 1, fontFamily: 'Inter-Regular', marginLeft: 8}}
            />
          </View>
        </ScrollView>

        <View style={{ backgroundColor: Color.theme }}>
          <TouchableOpacity onPress={() => submit()} style={{ backgroundColor: Color.info, borderRadius: 30, margin: 15, paddingVertical: 10 }}>
              <Text type='semibold' color={Color.textInput}>Lanjutkan</Text>
          </TouchableOpacity>
        </View>

        <ModalListAction
          ref={modalListActionRef}
          name={nameModal}
          onPress={(item, name) => {onSelected(item,name); }}
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

            setIsPinnedMap(true);
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

export default FormPayment;
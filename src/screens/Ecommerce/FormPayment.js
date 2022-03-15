import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView, TextInput as TextInputs } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  Loading, useLoading,
  Scaffold,
  Row, Col,
  HeaderBig,
  useColor,
  Header,
  ModalListAction
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { TextInput } from 'src/components/Form';
import ModalProvince from 'src/components/Modal/ModalProvince';
import { queryAddAddress, queryEditAddress, queryGetCity, queryGetProvince, queryGetSub } from 'src/lib/query/ecommerce';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;

const FormPayment = ({ route, navigation  }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [nameModal, setnameModal] = useState(null);
  const [postalCode, setCode] = useState('');
  const [prov, setProv] = useState(null);
  const [kota, setKota] = useState(null);
  const [kec, setKec] = useState(null);
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataSub, setDataSub] = useState([]);
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const modalListActionRef = useRef();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const { Color } = useColor();

  
  useEffect(() => {
   
    console.log(route.params)
    firstGet()
    return () => {
    }
  }, [])

  const getData = (name, value) => {
    showLoading();
    let variables = {
      countryCode: 228,
      provinceId: value ? value.id : null,
      cityId:  value ? value.id : null,
      suburbId:  value ? value.id : null,
    }
    console.log(variables)
    const queryx = name == 'prov' ? queryGetCity : name == 'city' ? queryGetSub : queryGetProvince
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
    }
    console.log(variables)
    const queryx = name == 'prov' ? queryGetCity : name == 'city' ? queryGetSub : queryGetProvince
    Client.query({query: queryx, variables})
      .then(res => {
        hideLoading()
        console.log(res)
        if(res.data.shipperGetProvinceList){
          if (res.data.shipperGetProvinceList.length > 0) {
            setDataProvince(res.data.shipperGetProvinceList)
            if(route.params.address.address){
              firstGet('prov', {id: route.params.address.provinceId})
              const idx = res.data.shipperGetProvinceList.findIndex(val => val.id == route.params.address.provinceId)
              setProv(res.data.shipperGetProvinceList[idx])
              firstGet('city', {id: route.params.address.cityId})
              setCode(route.params.address.postalCode)
              setAddress(route.params.address.address)
            }
          }
        }

        if(res.data.shipperGetCitiesList){
          console.log('city')
          if (res.data.shipperGetCitiesList.length > 0) {
            setDataCity(res.data.shipperGetCitiesList)
            if(route.params.address.address){
              const idx = res.data.shipperGetCitiesList.findIndex(val => val.id == route.params.address.cityId)
              setKota(res.data.shipperGetCitiesList[idx])
            }
          }
        }
        
        if (res.data.shipperGetSuburbList){
          if (res.data.shipperGetSuburbList.length > 0) {
            if(route.params.address.address){
              const idx = res.data.shipperGetSuburbList.findIndex(val => val.id == route.params.address.suburbId)
              setKec(res.data.shipperGetSuburbList[idx])
            }
            setDataSub(res.data.shipperGetSuburbList)
          }
        }
        
      })
      .catch(reject => {
        hideLoading()
        alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };


  const submit = () => {
    console.log(user)
    const quer = route.params.address.address ? queryEditAddress : queryAddAddress
    showLoading();
    let variables = {
      addresses:route.params.address.address ? {
        id: route.params.address.id,
        userId: user.userId,
        countryId: 228,
        provinceId: prov ? prov.id : prov,
        cityId: kota ? kota.id : kota,
        suburbId: kec ? kec.id : kec,
        areaId: 1,
        address: address,
        postalCode: postalCode
      } :
      {
        userId: user.userId,
        countryId: 228,
        provinceId: prov ? prov.id : prov,
        cityId: kota ? kota.id : kota,
        suburbId: kec ? kec.id : kec,
        areaId: 1,
        address: address
      }
    }
    console.log(variables)
    Client.mutate({mutation: quer, variables})
      .then(res => {
        hideLoading()
        console.log(res)
        if (res.data.userAddressAdd.length > 0) {
          alert(route.params.address.address ? 'Success Edit Address' : 'Success Add Address')
          const data = {
            name,
            phone,
            address,
            postalCode,
            prov,
            kota,
            kec,
            userAddressIdDestination: res.data.userAddressAdd[0].userId
          }
          navigation.navigate('CheckoutScreen',{saveAddress: { ...data, ...res.data.userAddressAdd[0] } })
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
      getData(name, item)
    }
    else{
      setKec(item)
    }
    modalListActionRef.current.close();
  }

  return (
    <Scaffold
          header={
            <Header 
              customIcon 
              title='Ubah Alamat' 
              type='regular' 
              centerTitle={false}
            />
          }
        >
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, }}>
          <View style={{ marginBottom: 40 }}>
            <Text align='left' style={{ paddingLeft: 16, marginTop: 15 }} type='bold'>Detail Alamat</Text>
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
            <Text align='left' style={{ marginTop: 15,  marginLeft: 16, color: Color.gray }} size={13}>Alamat Lengkap</Text>
            <TextInputs
              placeholder='Tuliskan Alamat . . . '
              numberOfLines={3}
              title='Alamat Lengkap'
              color={Color.text}
              onChangeText={(e) => setAddress(e)}
              value={address}
              multiline
              placeholderTextColor={Color.gray}
              style={{ borderWidth: 2, borderColor: Color.border, marginHorizontal: 16, borderRadius: 5, paddingLeft: 10 }}
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
            data={nameModal == 'prov' ? dataProvince : nameModal == 'city' ? dataCity : nameModal == 'sub' ? dataSub : []}
          />
      <Loading {...loadingProps} />
    </Scaffold>
  );
}

export default FormPayment;
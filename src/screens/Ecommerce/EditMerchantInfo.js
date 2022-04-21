import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  Dimensions,
  SafeAreaView,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused, useRoute} from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import {
  queryAddAddress,
  queryEditAddress,
  queryGetArea,
  queryGetCity,
  queryGetProvince,
  queryGetSub,
} from 'src/lib/query/ecommerce';

import ImagesPath from '../../components/ImagesPath';

const {width} = Dimensions.get('window');

import {
  Text,
  Loading,
  useLoading,
  Row,
  Col,
  HeaderBig,
  Header,
  Scaffold,
  useColor,
  ModalListAction,
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import Client from 'src/lib/apollo';
import { mutationMerchant } from 'src/lib/query/ecommerce';
import FormSelect from 'src/components/FormSelect';
import ModalSelectMap from 'src/components/ModalSelectMap';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const ContentView = Styled(View)`
    width: 100%;
    marginTop: 16px;
    paddingHorizontal: 16px;
`;

const MainMenuView = Styled(View)`
    width: 100%;
    borderRadius: 8px;
    marginTop: 12px;
    padding: 20px 0px;
    flexDirection: row;
    flexWrap: wrap;
`;

const PerUserIcons = Styled(TouchableOpacity)`
    width: 33.33%;
    aspectRatio: 1.3;
    flexDirection: column;
    paddingHorizontal: 8px;
`;

const UserIcon = Styled(View)`
    height: 100%;
    justifyContent: center;
    alignItems: center;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 40px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  fontSize: 14px;
`;

const EditMerchantInfo = ({navigation}) => {
  const route = useRoute();
  const [userData, setUserData] = useState({
    ...route.params.item,
    instagram: route.params.item.socialMedia.instagram,
  });
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [nameModal, setnameModal] = useState(null);
  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [dataSub, setDataSub] = useState([]);

  const modalListActionRef = useRef();

  const onChangeUserData = (key, val) => {
    setUserData({...userData, [key]: val});
  };

  const onListChangeUserData = (keys, values) => {
    const temp = Object.fromEntries(keys.map((_, i) => [keys[i], values[i]]))  
    setUserData({...userData, ...temp})
  }

  const getData = (name, value) => {
    showLoading();
    let variables = {
      countryCode: 228,
      provinceId: value ? value.id : null,
      cityId: value ? value.id : null,
      suburbId: value ? value.id : null,
      areaId: value ? value.id : null,
    };
    console.log(variables);
    const queryx =
      name == 'prov'
        ? queryGetCity
        : name == 'city'
        ? queryGetSub
        : name == 'sub'
        ? queryGetArea
        : queryGetProvince;
    Client.query({query: queryx, variables})
      .then(res => {
        hideLoading();
        console.log(res);
        if (res.data.shipperGetProvinceList) {
          setDataProvince(res.data.shipperGetProvinceList);
        }

        if (res.data.shipperGetCitiesList) {
          setDataCity(res.data.shipperGetCitiesList);
        }

        if (res.data.shipperGetSuburbList) {
          setDataSub(res.data.shipperGetSuburbList);
        }
        if (res.data.shipperGetAreaList) {
          setDataArea(res.data.shipperGetAreaList);
        }
      })
      .catch(reject => {
        hideLoading();
        alert(reject.message);
        console.log(reject.message, 'reject getdata');
      });
    }
    
  const [coords, setCoords] = useState({
    latitude: !isNaN(parseFloat(route.params.item.lat)) ? parseFloat(route.params.item.lat) : initialLatitude,
    longitude: !isNaN(parseFloat(route.params.item.long)) ? parseFloat(route.params.item.long) : initialLongitude,
  });

  const [modalSelectMap, setModalSelectMap] = useState(false);
  const [isPinnedMap, setIsPinnedMap] = useState(
    route.params.item.lat && route.params.item.long ? true : false
  );
  const [locationPinnedMap, setLocationPinnedMap] = useState('');

  const firstGet = (name, value) => {
    showLoading();
    let variables = {
      countryCode: 228,
      provinceId: value ? value.id : null,
      cityId: value ? value.id : null,
      suburbId: value ? value.id : null,
      areaId: value ? value.id : null,
    };
    console.log(variables);
    const queryx =
      name == 'prov'
        ? queryGetCity
        : name == 'city'
        ? queryGetSub
        : name == 'sub'
        ? queryGetArea
        : queryGetProvince;
    Client.query({query: queryx, variables})
      .then(res => {
        console.log(res, name, 'berhasil');
        if (res.data.shipperGetProvinceList) {
          if (res.data.shipperGetProvinceList.length > 0) {
            setDataProvince(res.data.shipperGetProvinceList);
            if (userData.provinceId) {
              getData('prov', {id: userData.provinceId});
              if(userData.cityId){
                getData('city', {id: userData.cityId});
              }
              if(userData.suburbId){
                getData('sub', {id: userData.suburbId});
              }
            }
          }
        }
        hideLoading();
      })
      .catch(reject => {
        hideLoading();
        console.log(reject.message, 'reject');
      });
  };

  const submit = (id, index) => {
    console.log(route, 'props');
    showLoading();
    let variables = {
      body: {
        userId: userData.userId,
        name: userData.name,
        noTelp: userData.noTelp,
        alamat: userData.alamat,
        socialMedia: {
          instagram: userData.instagram,
        },
        profileImg: thumbImage
          ? 'data:image/png;base64,' + thumbImage
          : undefined,
        isVerified: userData.isVerified,
        isOfficial: userData.isOfficial,
        countryId: 228,
        countryName: 'Indonesia',
        provinceId: userData.provinceId,
        provinceName: userData.provinceName,
        cityId: userData.cityId,
        cityName: userData.cityName,
        suburbId: userData.suburbId,
        suburbName: userData.suburbName,
        areaId: userData.areaId,
        areaName: userData.areaName,
        postalCode: userData.postalCode,
        lat: String(userData.lat),
        long: String(userData.long),
      },
      merchantId: route.params.item.id,
      type: 'UPDATED',
    };
    console.log(variables);
    Client.mutate({mutation: mutationMerchant, variables})
      .then(res => {
        hideLoading();
        console.log(res, "res edit toko");
        if (res.data.ecommerceMerchantManage) {
          alert('Success edit toko');
          navigation.pop();
        }
      })
      .catch(reject => {
        hideLoading();
        alert(reject.message);
        console.log(reject.message, 'reject');
      });
  };

  const onSelected = (item, name) => {
    console.log(item, name, "onselecetd");
    if(name === 'prov'){
      console.log("masuk prov");
      onListChangeUserData(
        ['provinceId', 'provinceName', 'cityId', 'cityName', 'suburbId', 'suburbName', 'areaId', 'areaName'],
        [item.id, item.name, null, null, null, null, null, null]
      );
      getData(name, item);
    } else if (name === 'city') {
      console.log("masuk city");
      onListChangeUserData(
        ['cityId', 'cityName', 'suburbId', 'suburbName', 'areaId', 'areaName'],
        [item.id, item.name, null, null, null, null]
      );
      getData(name, item);
    } else if (name === 'sub'){
      console.log("masuk sub");
      onListChangeUserData(
        ['suburbId', 'suburbName', 'areaId', 'areaName'],
        [item.id, item.name, null, null]
      );
      getData(name, item);
    }else {
      console.log("masuk area");
      onListChangeUserData(
        ['areaId', 'areaName'],
        [item.id, item.name]
      );
    }
    modalListActionRef.current.close();
  };

  useEffect(() => {
    firstGet();
  }, []);

  const {Color} = useColor();
  console.log(coords)
  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Scaffold
          header={
            <Header
              customIcon
              title="Edit Profil Toko"
              type="bold"
              style={{paddingTop: 17, marginBottom: 10}}
              centerTitle={false}
            />
          }
          onPressLeftButton={() => navigation.pop()}
        />

        <View style={{padding: 16}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                const options = {
                  mediaType: 'photo',
                  maxWidth: 640,
                  maxHeight: 640,
                  quality: 1,
                  includeBase64: true,
                };

                launchImageLibrary(options, callback => {
                  setThumbImage(callback.base64);
                  setMimeImage(callback.type);
                });
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                marginVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Color.grayLight,
                marginRight: 10,
              }}>
              <Image
                source={{
                  uri: thumbImage
                    ? `data:${mimeImage};base64,${thumbImage}`
                    : userData.profileImg,
                }}
                style={{height: 48, width: 48, borderRadius: 24}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const options = {
                  mediaType: 'photo',
                  maxWidth: 640,
                  maxHeight: 640,
                  quality: 1,
                  includeBase64: true,
                };

                launchImageLibrary(options, callback => {
                  setThumbImage(callback.base64);
                  setMimeImage(callback.type);
                });
              }}>
              <Text align="left" type="bold" size={11}>
                Unggah Foto Profile Toko
              </Text>
              <Text
                align="left"
                type="bold"
                size={8}
                color={Color.gray}
                style={{marginVertical: 4}}>
                Ukuran foto maks. 1MB dengan format JPEG, PNG, atau JPG
              </Text>
              <Text align="left" type="bold" size={8} color={Color.primary}>
                Unggah Foto
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            align="left"
            type="bold"
            size={11}
            style={{marginTop: 24, marginBottom: 16}}>
            Informasi Toko
          </Text>

          <View style={{marginBottom: 16}}>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 4,
                borderColor: Color.border,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}>
              <LabelInput>
                <Text size={8} letterSpacing={0.08} style={{color: Color.gray}}>
                  Nama Toko
                </Text>
              </LabelInput>
              <EmailRoundedView>
                <CustomTextInput
                  placeholder="Toko Sumber Daya Abadi..."
                  keyboardType="default"
                  placeholderTextColor={Color.gray}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  selectionColor={Color.text}
                  style={{color: Color.text}}
                  value={userData.name}
                  onChangeText={text => onChangeUserData('name', text)}
                />
              </EmailRoundedView>
            </View>
          </View>

          <View style={{marginBottom: 16}}>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 4,
                borderColor: Color.border,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}>
              <LabelInput>
                <Text size={8} letterSpacing={0.08} style={{color: Color.gray}}>
                  No. Telpon Toko
                </Text>
              </LabelInput>
              <EmailRoundedView>
                <CustomTextInput
                  placeholder="+62 813-1234-5678"
                  keyboardType="numeric"
                  placeholderTextColor={Color.gray}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  selectionColor={Color.text}
                  style={{color: Color.text}}
                  value={userData.noTelp}
                  onChangeText={text => onChangeUserData('noTelp', text)}
                />
              </EmailRoundedView>
            </View>
          </View>

          <View style={{marginBottom: 16}}>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 4,
                borderColor: Color.border,
                paddingVertical: 8,
                paddingHorizontal: 12,
                height: 120,
              }}>
              <LabelInput>
                <Text size={8} letterSpacing={0.08} style={{color: Color.gray}}>
                  Alamat
                </Text>
              </LabelInput>
              <EmailRoundedView>
                <CustomTextInput
                  placeholder="Masukkan Alamat Toko"
                  keyboardType="default"
                  placeholderTextColor={Color.gray}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  multiline={true}
                  selectionColor={Color.text}
                  style={{color: Color.text, height: 80}}
                  value={userData.alamat}
                  onChangeText={text => onChangeUserData('alamat', text)}
                />
              </EmailRoundedView>
            </View>
          </View>

          <View style={{marginBottom: 16}}>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 4,
                borderColor: Color.border,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}>
              <LabelInput>
                <Text size={8} letterSpacing={0.08} style={{color: Color.gray}}>
                  Instagram Toko (opsional)
                </Text>
              </LabelInput>
              <EmailRoundedView>
                <CustomTextInput
                  placeholder="@ tokojayaabadi"
                  keyboardType="numeric"
                  placeholderTextColor={Color.gray}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  selectionColor={Color.text}
                  style={{color: Color.text}}
                  value={userData.instagram}
                  onChangeText={text => onChangeUserData('instagram', text)}
                />
              </EmailRoundedView>
            </View>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => {
                setnameModal('prov');
                modalListActionRef.current.open();
              }}
              style={{
                marginTop: 6,
                borderWidth: 1,
                borderColor: Color.border,
                paddingVertical: 8,
                borderRadius: 5,
                paddingHorizontal: 10,
              }}>
              <Text
                align="left"
                style={{fontSize: 8, color: Color.gray, marginBottom: 4}}>
                Provinsi
              </Text>
              <Row>
                <Col size={8}>
                  <Text align="left" style={{fontSize: 14}}>
                    {userData.provinceName ? userData.provinceName : 'Pilih Provinsi'}
                  </Text>
                </Col>
                <Col alignItems="flex-end" justifyContent="center">
                  <AntDesign name="down" color={Color.text} size={15} />
                </Col>
              </Row>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => {
                setnameModal('city');
                modalListActionRef.current.open();
              }}
              style={{
                marginTop: 16,
                borderWidth: 1,
                borderColor: Color.border,
                paddingVertical: 8,
                borderRadius: 5,
                paddingHorizontal: 10,
              }}>
              <Text
                align="left"
                style={{fontSize: 8, color: Color.gray, marginBottom: 4}}>
                Kota / Kabupaten
              </Text>
              <Row>
                <Col size={8}>
                  <Text align="left">
                    {userData.cityName ? userData.cityName : 'Pilih Kota/Kabupaten'}
                  </Text>
                </Col>
                <Col alignItems="flex-end" justifyContent="center">
                  <AntDesign name="down" color={Color.text} size={15} />
                </Col>
              </Row>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => {
                setnameModal('sub');
                modalListActionRef.current.open();
              }}
              style={{
                marginTop: 16,
                borderWidth: 1,
                borderColor: Color.border,
                paddingVertical: 8,
                borderRadius: 5,
                paddingHorizontal: 10,
              }}>
              <Text
                align="left"
                style={{fontSize: 8, color: Color.gray, marginBottom: 4}}>
                Kecamatan
              </Text>
              <Row>
                <Col size={8}>
                  <Text align="left">{userData.suburbName ? userData.suburbName : 'Pilih Kecamatan'}</Text>
                </Col>
                <Col alignItems="flex-end" justifyContent="center">
                  <AntDesign name="down" color={Color.text} size={15} />
                </Col>
              </Row>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => {
                setnameModal('area');
                modalListActionRef.current.open();
              }}
              style={{
                marginTop: 16,
                marginBottom: 6,
                borderWidth: 1,
                borderColor: Color.border,
                paddingVertical: 8,
                borderRadius: 5,
                paddingHorizontal: 10,
              }}>
              <Text
                align="left"
                style={{fontSize: 8, color: Color.gray, marginBottom: 4}}>
                Area
              </Text>
              <Row>
                <Col size={8}>
                  <Text align="left">{userData.areaName ? userData.areaName : 'Pilih Area'}</Text>
                </Col>
                <Col alignItems="flex-end" justifyContent="center">
                  <AntDesign name="down" color={Color.text} size={15} />
                </Col>
              </Row>
            </TouchableOpacity>
          </View>

          <View>
            <TextInput
              placeholder="Masukkan Kode Pos . . ."
              style={{
                marginTop: 8,
                width: '100%',
                borderWidth: 1,
                borderColor: Color.border,
                height: 45,
                borderRadius: 5,
                alignSelf: 'center',
                fontSize: 12,
                paddingHorizontal: 10,
                paddingTop: 22,
                color: Color.text,
              }}
              autoCorrect={false}
              onChangeText={text => onChangeUserData('postalCode', text)}
              selectionColor={Color.text}
              value={userData.postalCode}
              keyboardType="numeric"
            />
            <Text
              style={{
                fontSize: 8,
                color: Color.secondary,
                textAlign: 'left',
                position: 'absolute',
                marginVertical: 13,
                marginHorizontal: 10,
              }}>
              Kode Pos
            </Text>
          </View>

          <View style={{ marginHorizontal: -16, marginTop: -10 }}>
            <FormSelect
                type='select'
                label='Pin Lokasi'
                value={isPinnedMap ? locationPinnedMap || 'Lokasi di Pin' : ''}
                placeholder='Pilih di Peta'
                onPress={() => {
                  setModalSelectMap(true);
                }}
              />
          </View>
          <View style={{backgroundColor: Color.theme, marginBottom: 16}}>
            <TouchableOpacity
              onPress={() => submit()}
              style={{
                backgroundColor: Color.primary,
                borderRadius: 30,
                paddingVertical: 12,
              }}>
              <Text type="semibold" color={Color.textInput}>
                Lanjut
              </Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </ScrollView>
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
            onChangeUserData('lat', latitude)
            onChangeUserData('long', longitude)

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

       
      <ModalListAction
        ref={modalListActionRef}
        name={nameModal}
        onPress={(item, name) => {
          onSelected(item, name);
        }}
        data={
          nameModal == 'prov'
            ? dataProvince
            : nameModal == 'city'
            ? dataCity
            : nameModal == 'sub'
            ? dataSub
            : nameModal == 'area'
            ? dataArea
            : []
        }
      />
      <Loading {...loadingProps} />
    </MainView>
  );
};

export default EditMerchantInfo;

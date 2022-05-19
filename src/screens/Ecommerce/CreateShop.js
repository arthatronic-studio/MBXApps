import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Pressable,
  FlatList,
  Image,
  TextInput,
  Keyboard,
} from 'react-native';
import {useSelector} from 'react-redux';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MapView, {Marker} from 'react-native-maps';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import { initialLatitude, initialLongitude } from 'src/utils/constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {
  queryAddAddress,
  queryEditAddress,
  queryGetArea,
  queryGetCity,
  queryGetProvince,
  queryGetSub,
} from 'src/lib/query/ecommerce';

import {
  Text,
  // TouchableOpacity,
  Loading,
  useLoading,
  Scaffold,
  Row,
  Col,
  Submit,
  useColor,
  Header,
  ModalListAction,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import ImagesPath from 'src/components/ImagesPath';
import {Divider, Padding} from 'src/styled';
import {ScrollView} from 'react-native-gesture-handler';

import Client from '@src/lib/apollo';

import {queryCreateMerchant} from 'src/lib/query/ecommerce';
import ModalSelectMap from 'src/components/ModalSelectMap';
import FormSelect from 'src/components/FormSelect';

const CreateShop = () => {
  const navigation = useNavigation();
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
  const user = useSelector(state => state['user.auth'].login.user);

  const modalListActionRef = useRef();

  const [userData, setUserData] = useState({
    userId: user.userId,
    name: '',
    noTelp: '',
    alamat: '',
    instagram: '',
    profileImg: '',
    isVerified: false,
    isOfficial: false,
    countryId: 228,
    provinceId: null,
    cityId: null,
    suburbId: null,
    areaId: null,
    postalCode: '',
    latitude: '-6.173696',
    longitude: '106.824707',
  });

  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');

  const [error, setError] = useState({
    userId: null,
    name: null,
    noTelp: null,
    alamat: null,
    instagram: null,
    profileImg: '',
    isVerified: null,
    isOfficial: null,
    latitude: null,
    longitude: null,
  });

  const isValueError = name => {
    const newError = validate(name, userData[name]);
    setError({...error, [name]: newError});
  };

  const onChangeUserData = (key, val) => {
    setUserData({...userData, [key]: val});
  };

  const onChangeValue = () => {
    setShopName(1)
  }

  const loading = useSelector(state => state['user.auth'].loading);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const {Color} = useColor();
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  const [coords, setCoords] = useState({
    latitude:  initialLatitude,
    longitude: initialLongitude,
  });

  console.log('coords', coords);

  const [modalSelectMap, setModalSelectMap] = useState(false);
  const [isPinnedMap, setIsPinnedMap] = useState(
     false
  );
  const [locationPinnedMap, setLocationPinnedMap] = useState('');


  const onSubmit = () => {
    Keyboard.dismiss();

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
        profileImg: 'data:image/png;base64,' + thumbImage,
        isVerified: userData.isVerified,
        isOfficial: userData.isOfficial,
        countryId: 228,
        countryName: "Indonseia",
        provinceId: userData.provinceId,
        provinceName: prov.name,
        cityId: userData.cityId,
        cityName: kota.name,
        suburbId: userData.suburbId,
        suburbName: kec.name,
        areaId: userData.areaId,
        areaName: area.name,
        postalCode: userData.postalCode,
        lat: String(userData.latitude),
        long: String(userData.longitude),
      },
    };

    console.log(variables, 'body');
    Client.mutate({mutation: queryCreateMerchant, variables})
      .then(res => {
        const data = res.data;
        if (data) {
          showLoading('success', 'Berhasil Membuat Toko');

          setTimeout(() => {
            navigation.popToTop();
          }, 2500);
        } else {
          showLoading('error', 'Gagal Membuat Toko');
        }
      })
      .catch(err => {
        showLoading('error', 'Gagal membuat toko, Harap ulangi kembali');
      });
  };

  useEffect(() => {
    firstGet();
  }, []);

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
        console.log(reject.message, 'reject');
      });
  };

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
        hideLoading();
        console.log(res, name);
        if (res.data.shipperGetProvinceList) {
          if (res.data.shipperGetProvinceList.length > 0) {
            setDataProvince(res.data.shipperGetProvinceList);
            if (route.params.address.address) {
              getData('prov', {id: route.params.address.provinceId});
              // const idx = res.data.shipperGetProvinceList.findIndex(val => val.id == route.params.address.provinceId)
              // setProv(res.data.shipperGetProvinceList[idx])

              setProv({...route.params.address.province});
              setKota({...route.params.address.city});
              setKec({...route.params.address.suburb});
              setArea({...route.params.address.area});

              getData('city', {id: route.params.address.cityId});
              getData('sub', {id: route.params.address.suburb.id});
              setCode(route.params.address.postalCode);
              setAddress(route.params.address.address);
              setName(route.params.address.penerimaName);
              setPhone(route.params.address.noTelp);
            }
          }
        }

        // if(res.data.shipperGetCitiesList){
        //   console.log('city')
        //   if (res.data.shipperGetCitiesList.length > 0) {
        //     setDataCity(res.data.shipperGetCitiesList)
        //     if(route.params.address.address){
        //       const idx = res.data.shipperGetCitiesList.findIndex(val => val.id == route.params.address.cityId)
        //       setKota(res.data.shipperGetCitiesList[idx])
        //     }
        //   }
        // }

        // if (res.data.shipperGetSuburbList){
        //   if (res.data.shipperGetSuburbList.length > 0) {
        //     if(route.params.address.address){
        //       const idx = res.data.shipperGetSuburbList.findIndex(val => val.id == route.params.address.suburbId)
        //       setKec(res.data.shipperGetSuburbList[idx])
        //     }
        //     setDataSub(res.data.shipperGetSuburbList)
        //   }
        // }

        // if (res.data.shipperGetAreaList){
        //   if (res.data.shipperGetAreaList.length > 0) {
        //     if(route.params.address.address){
        //       const idx = res.data.shipperGetAreaList.findIndex(val => val.id == route.params.address.areaId)
        //       setArea(res.data.shipperGetAreaList[idx])
        //     }
        //     setDataArea(res.data.shipperGetAreaList)
        //   }
        // }
      })
      .catch(reject => {
        hideLoading();
        // alert(reject.message)
        console.log(reject.message, 'reject');
      });
  };

  const onSelected = (item, name) => {
    console.log(item, name);
    if (name == 'prov') {
      setProv(item);
      onChangeUserData('provinceId', item.id);
      setKota(null);
      setKec(null);
      getData(name, item);
    } else if (name == 'city') {
      setKota(item);
      onChangeUserData('cityId', item.id);
      setKec(null);
      setArea(null);
      getData(name, item);
    } else if (name == 'sub') {
      setKec(item);
      onChangeUserData('suburbId', item.id);
      setArea(null);
      getData(name, item);
    } else {
      setArea(item);
      onChangeUserData('areaId', item.id);
    }
    modalListActionRef.current.close();
  };

  const shop = 0
  return (
    <Scaffold
      style={{backgroundColor: Color.theme}}
      header={
        <Header
          customIcon
          title="Buat Toko"
          type="regular"
          centerTitle={false}
        />
      }
      onPressLeftButton={() => navigation.pop()}>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationIn="slideInDown"
        animationOut="slideOutDown"
        style={{borderRadius: 16}}>
        <View
          style={{
            backgroundColor: '#ffffff',
            padding: 30,
            borderRadius: 8,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: Color.primary,
              alignSelf: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginBottom: 16,
              borderRadius: 6,
            }}
            onPress={() => {
              const options = {
                mediaType: 'photo',
                maxWidth: 640,
                maxHeight: 640,
                quality: 1,
                includeBase64: true,
              };

              toggleModal();

              launchCamera(options, callback => {
                setThumbImage(callback.base64);
                setMimeImage(callback.type);
              });
            }}>
            <Text style={{color: Color.semiwhite}}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: Color.primary,
              alignSelf: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginBottom: 16,
              borderRadius: 6,
            }}
            onPress={() => {
              const options = {
                mediaType: 'photo',
                maxWidth: 640,
                maxHeight: 640,
                quality: 1,
                includeBase64: true,
              };

              toggleModal();

              launchImageLibrary(options, callback => {
                setThumbImage(callback.base64);
                setMimeImage(callback.type);
              });
            }}>
            <Text style={{color: Color.semiwhite}}>Choose From Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: Color.warning,
              alignSelf: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 6,
            }}
            onPress={() => toggleModal()}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <ScrollView>
        <View style={{flexDirection: 'row', marginHorizontal: 10}}>
          <TouchableOpacity
            onPress={() => {
              // const options = {
              //     mediaType: 'photo',
              //     maxWidth: 640,
              //     maxHeight: 640,
              //     quality: 1,
              //     includeBase64: true,
              // }

              setModalVisible(true);

              // launchImageLibrary(options, (callback) => {
              //     setThumbImage(callback.base64);
              //     setMimeImage(callback.type);
              // })
            }}>
            {thumbImage !== '' && (
              <Image
                source={{uri: `data:${mimeImage};base64,${thumbImage}`}}
                style={{
                  resizeMode: 'contain',
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                }}
              />
            )}
            {thumbImage == '' && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Color.border,
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                }}>
                <IonIcons name={'camera-outline'} size={17} />
              </View>
            )}
          </TouchableOpacity>
          <View style={{marginHorizontal: 10}}>
            <Text
              style={{
                fontSize: 11,
                color: Color.text,
                fontWeight: 'bold',
                textAlign: 'left',
              }}>
              Unggah Foto Profile Toko
            </Text>
            <Text style={{fontSize: 8, color: Color.secondary}}>
              Ukuran foto maks. 1MB dengan format JPEG, PNG, atau JPG
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
                // const options = {
                //     mediaType: 'photo',
                //     maxWidth: 640,
                //     maxHeight: 640,
                //     quality: 1,
                //     includeBase64: true,
                // }

                // launchImageLibrary(options, (callback) => {
                //     setThumbImage(callback.base64);
                //     setMimeImage(callback.type);
                // })
              }}>
              <Text
                style={{fontSize: 8, color: Color.primary, textAlign: 'left'}}>
                Unggah Foto
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Divider />
        <Text
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            marginHorizontal: 10,
            textAlign: 'left',
          }}>
          Informasi Toko
        </Text>
        <View>
          <TextInput
            placeholder="Toko Sumber Daya Abadi . . ."
            style={{
              marginTop: 8,
              width: '95%',
              borderWidth: 1,
              borderColor: Color.border,
              height: 45,
              borderRadius: 5,
              alignSelf: 'center',
              fontSize: 12,
              paddingHorizontal: 10,
              paddingTop: 22,
            }}
            autoCorrect={false}
            onChangeText={text => onChangeUserData('name', text)}
            selectionColor={Color.text}
            value={userData.name}
          />
          <Text
            style={{
              fontSize: 8,
              color: Color.secondary,
              textAlign: 'left',
              position: 'absolute',
              marginVertical: 13,
              marginHorizontal: 20,
            }}>
            Nama Toko
          </Text>
          <Text
            style={{
              fontSize: 8,
              color: Color.secondary,
              textAlign: 'right',
              marginHorizontal: 15,
              marginVertical: 2,
              maxLength: 200
            }}>
            {userData.name.length}/200
          </Text>
        </View>
        <View>
          <TextInput
            placeholder="813-1234-5678"
            style={{
              marginVertical: 8,
              width: '95%',
              borderWidth: 1,
              borderColor: Color.border,
              height: 45,
              borderRadius: 5,
              alignSelf: 'center',
              fontSize: 12,
              paddingHorizontal: 32,
              paddingTop: 22,
            }}
            autoCorrect={false}
            onChangeText={text => onChangeUserData('noTelp', text)}
            selectionColor={Color.text}
            value={userData.noTelp}
            keyboardType="numeric"
          />
          <Text
            style={{
              fontSize: 8,
              color: Color.secondary,
              textAlign: 'left',
              position: 'absolute',
              marginVertical: 13,
              marginHorizontal: 20,
            }}>
            No. Telpon Toko
          </Text>
          <Text
            style={{
              fontSize: 12,
              position: 'absolute',
              marginVertical: 25.8,
              marginHorizontal: 15,
            }}>
            +62
          </Text>
        </View>
        <View>
          <TextInput
            placeholder="Masukkan Alamat Toko"
            style={{
              marginVertical: 8,
              width: '95%',
              borderWidth: 1,
              borderColor: Color.border,
              height: 85,
              borderRadius: 5,
              alignSelf: 'center',
              fontSize: 12,
              paddingHorizontal: 10,
              paddingTop: 22,
            }}
            autoCorrect={false}
            onChangeText={text => onChangeUserData('alamat', text)}
            selectionColor={Color.text}
            value={userData.alamat}
          />
          <Text
            style={{
              fontSize: 8,
              color: Color.secondary,
              textAlign: 'left',
              position: 'absolute',
              marginVertical: 13,
              marginHorizontal: 20,
            }}>
            Alamat Toko
          </Text>
        </View>
        <View>
          <TextInput
            placeholder="tokojayaabadi"
            style={{
              marginVertical: 8,
              width: '95%',
              borderWidth: 1,
              borderColor: Color.border,
              height: 45,
              borderRadius: 5,
              alignSelf: 'center',
              fontSize: 12,
              paddingHorizontal: 25,
              paddingTop: 22,
            }}
            autoCorrect={false}
            onChangeText={text => onChangeUserData('instagram', text)}
            selectionColor={Color.text}
            value={userData.instagram}
          />
          <Text
            style={{
              fontSize: 8,
              color: Color.secondary,
              textAlign: 'left',
              position: 'absolute',
              marginVertical: 13,
              marginHorizontal: 20,
            }}>
            Instagram Toko
          </Text>
          <Text
            style={{
              fontSize: 12,
              position: 'absolute',
              marginVertical: 25,
              marginHorizontal: 20,
            }}>
            @
          </Text>
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
              marginHorizontal: 10,
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
                  {prov ? prov.name : 'Pilih Provinsi'}
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
              marginHorizontal: 10,
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
                  {kota ? kota.name : 'Pilih Kota/Kabupaten'}
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
              marginHorizontal: 10,
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
                <Text align="left">{kec ? kec.name : 'Pilih Kecamatan'}</Text>
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
              marginHorizontal: 10,
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
                <Text align="left">{area ? area.name : 'Pilih Area'}</Text>
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
              width: '95%',
              borderWidth: 1,
              borderColor: Color.border,
              height: 45,
              borderRadius: 5,
              alignSelf: 'center',
              fontSize: 12,
              paddingHorizontal: 10,
              paddingTop: 22,
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
              marginHorizontal: 20,
            }}>
            Kode Pos
          </Text>
        </View>

        <Divider />
        <View style={{ marginHorizontal: -8, marginTop: -25 }}>
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
      </ScrollView>
      <Submit
        buttonLabel="Lanjut"
        buttonColor={Color.primary}
        type="bottomSingleButton"
        buttonBorderTopWidth={0}
        style={{
          backgroundColor: Color.theme,
          paddingTop: 25,
          paddingBottom: 25,
        }}
        onPress={() => {
          onSubmit();
        }}
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
        onChangeUserData('longitude', longitude)
        onChangeUserData('latitude', latitude)
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

      {/* Ini Modal */}
      {/* <Modal isVisible={isModalVisible}>
        <View style={{width: '100%', height: 495, backgroundColor: Color.theme, borderRadius: 5}}>
          <Text style={{marginVertical: 15,fontSize: 24, fontWeight: 'bold'}}>Syarat & Ketentuan</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{textAlign: 'left', paddingHorizontal: 20,fontSize: 18, fontWeight: 'bold'}}>1. Disclaimer</Text>
            <Text style={{fontSize: 14, textAlign: 'justify', paddingHorizontal: 20, lineHeight: 22, marginVertical: 10}}>
            Gingerbread cake jelly cupcake donut. Wafer dragée dragée sweet 
            ice cream gummies icing sweet. Cheesecake chupa chups chocolate 
            cake cheesecake cake. Candy fruitcake gummies candy canes powder 
            tart cake. {'\n'}{'\n'}Cupcake caramels gummies topping marshmallow 
            marshmallow sweet gingerbread. Sesame snaps tart apple pie 
            chupa chups ice cream sugar plum jelly bonbon. Pudding 
            fruitcake toffee biscuit oat cake soufflé oat cake sesame snaps. 
            Jelly bonbon cake chupa chups pudding. {'\n'}{'\n'}Gummies soufflé 
            marshmallow wafer candy canes sesame snaps jelly powder jelly 
            beans. Pie liquorice brownie macaroon halvah pastry cotton candy.
            Marshmallow bonbon bonbon icing tart candy sesame snaps. Chocolate bar pastry 
            muffin chocolate cake pastry. Pastry tiramisu liquorice chocolate cake macaroon 
            tootsie roll brownie jujubes. Chocolate bar macaroon danish donut gummies halvah. Liquorice cotton candy tiramisu muffin 
            cookie gingerbread pie bonbon. {'\n'}{'\n'}Lemon drops chocolate cake pudding topping icing cake jelly shortbread. Wafer tiramisu powder 
            jelly-o liquorice shortbread marshmallow jelly beans. Carrot cake fruitcake brownie gingerbread jelly beans.
            Chocolate cake bonbon toffee jelly candy brownie jujubes. Cotton candy dragée tiramisu chocolate bar candy danish lollipop 
            chocolate cake candy canes. {'\n'}{'\n'}Oat cake danish tart chupa chups marshmallow cheesecake. Lollipop muffin jujubes pie jujubes marzipan cupcake gummies. 
            Jujubes gingerbread cookie pastry brownie. Lollipop lemon drops jelly beans fruitcake macaroon.
              </Text>
              <Text style={{textAlign: 'left', paddingHorizontal: 20,fontSize: 18, fontWeight: 'bold'}}>2. Disclaimer</Text>
            <Text style={{fontSize: 14, textAlign: 'justify', paddingHorizontal: 20, lineHeight: 22, marginVertical: 10}}>Cookie donut dessert dessert bonbon. 
              Tiramisu sweet dessert icing candy canes dessert. 
              Pudding sweet chocolate cake chocolate topping sweet 
              chocolate bar cotton candy. Wafer wafer candy lemon drops 
              cheesecake gingerbread gingerbread brownie. Powder chocolate 
              shortbread chocolate pudding jelly-o jujubes chocolate bar. 
              Croissant lollipop powder cupcake pudding chocolate cake sweet 
              roll ice cream. Brownie tiramisu 
              cotton candy chocolate cake jelly beans marzipan pie.</Text>
              <Text style={{textAlign: 'left', paddingHorizontal: 20,fontSize: 18, fontWeight: 'bold'}}>1. Disclaimer</Text>
            <Text style={{fontSize: 14, textAlign: 'justify', paddingHorizontal: 20, lineHeight: 22, marginVertical: 10}}>Cookie donut dessert dessert bonbon. 
              Tiramisu sweet dessert icing candy canes dessert. 
              Pudding sweet chocolate cake chocolate topping sweet 
              chocolate bar cotton candy. Wafer wafer candy lemon drops 
              cheesecake gingerbread gingerbread brownie. Powder chocolate 
              shortbread chocolate pudding jelly-o jujubes chocolate bar. 
              Croissant lollipop powder cupcake pudding chocolate cake sweet 
              roll ice cream. Brownie tiramisu 
              cotton candy chocolate cake jelly beans marzipan pie.</Text>
          </ScrollView>
          <View style={{width: '100%', height: 60, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={toggleModal} style={{backgroundColor: Color.primary, width: '95%', height: 42, borderRadius: 20, justifyContent: 'center'}}>
              <Text style={{fontSize: 12, fontWeight: 'bold', color: Color.textInput}}>Saya Setuju</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
      {/* End Modal */}
    </Scaffold>
  );
};

export default CreateShop;

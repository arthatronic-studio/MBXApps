import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  useWindowDimensions,
} from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

import {
  Text,
  usePopup,
  useLoading,
  Submit,
  useColor,
  Scaffold,
} from '@src/components';
import { queryJoinCommunity } from 'src/lib/query';
import validate from '@src/lib/validate';
import Client from '@src/lib/apollo';
import ModalActions from 'src/components/Modal/ModalActions';
import { accessClient } from 'src/utils/access_client';
import { Card, Container, Divider, Row, } from 'src/styled';
import Clipboard from '@react-native-community/clipboard';
import { fetchCarTypeListing, fetchJoinCommunityUpdate } from 'src/api/community';
import FormSelect from 'src/components/FormSelect';
import ModalActionScroll from 'src/components/Modal/ModalActionScroll';
import { rridSticker, rridUniform } from 'assets/images/rrid';
import { fetchLocationCity, fetchLocationProvince } from 'src/api/location';
import CircularProgress from 'src/components/CircularProgress';
import { fetchUserAddressList } from 'src/api/user-address';
import { useSelector } from 'react-redux';

const merchandiseHead = [
  'UKURAN',
  'LEBAR',
  'PANJANG',
  'BAHU',
  'L.PANJANG',
  'L.PENDEK',
];
const merchandiseSize = [
  { id: 1, name: 'S', ukuran: 'S', lebar: '50', panjang: '68', bahu: '14', l_panjang: '24', l_pendek: '58' },
  { id: 2, name: 'M', ukuran: 'M', lebar: '52', panjang: '70', bahu: '15', l_panjang: '25', l_pendek: '60' },
  { id: 3, name: 'L', ukuran: 'L', lebar: '54', panjang: '72', bahu: '16', l_panjang: '26', l_pendek: '62' },
  { id: 4, name: 'XL', ukuran: 'XL', lebar: '56', panjang: '74', bahu: '17', l_panjang: '27', l_pendek: '64' },
  { id: 5, name: 'XXL', ukuran: 'XXL', lebar: '58', panjang: '76', bahu: '18', l_panjang: '28', l_pendek: '66' },
  { id: 6, name: 'XXXL', ukuran: 'XXXL', lebar: '60', panjang: '78', bahu: '19', l_panjang: '29', l_pendek: '68' },
];

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

const options = {
  mediaType: 'photo',
  maxWidth: 640,
  maxHeight: 640,
  quality: 1,
  includeBase64: true,
};

const initModalActionScrollProps = {
  name: '',
  visible: false,
  selected: null,
  data: [],
  onPress: (val) => { },
  onClose: () => { },
  renderItem: null,
};

const JoinCommunity = ({ navigation, route }) => {
  const { params } = route;
  const isUpdatePage = params && typeof params.item !== 'undefined' && params.item.id !== null;

  const user = useSelector((state) => state['user.auth'].login.user);
  const { height, width } = useWindowDimensions();
  const { Color } = useColor();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();

  const [userData, setUserData] = useState({
    carColor: isUpdatePage ? params.item.car_color : '',
    carYear: isUpdatePage ? params.item.car_year : '',
    carIdentity: isUpdatePage ? params.item.car_identity : '',
    reason: isUpdatePage ? params.item.reason : '',
    note: isUpdatePage ? params.item.note : '',
    selfiePhoto: isUpdatePage ? params.item.selfie_photo : '',
    carPhotoMain: isUpdatePage ? params.item.car_photo_main : '',
    carPhotoFront: isUpdatePage ? params.item.car_photo_front : '',
    carPhotoSide: isUpdatePage ? params.item.car_photo_side : '',
    carPhotoBack: isUpdatePage ? params.item.car_photo_back : '',
    simPhoto: isUpdatePage ? params.item.sim_photo : '',
    stnkPhoto: isUpdatePage ? params.item.stnk_photo : '',
    transactionProof: isUpdatePage ? params.item.transaction_proof : '',
  });

  const [error, setError] = useState({
    carColor: null,
    carYear: null,
    carIdentity: null,
    reason: null,
    note: null,
  });

  const isValueError = (name) => {
    const newError = validate(name, userData[name]);
    setError({ ...error, [name]: newError });
  }

  const onChangeUserData = (key, val) => {
    setUserData({ ...userData, [key]: val });
  };

  const [modalAddPhoto, setModalAddPhoto] = useState(false);
  const [modalNumberPhoto, setModalNumberPhoto] = useState(0);

  const [modalActionScrollProps, setModalActionScrollProps] = useState(initModalActionScrollProps);

  const [listUserAddress, setListUserAddress] = useState([]);
  const [selectedUserAddress, setSelectedUserAddress] = useState();

  const [listCarType, setListCarType] = useState([]);
  const [selectedCarType, setSelectedCarType] = useState();

  const [selectedMerchandiseSize, setSelectedMerchandiseSize] = useState(isUpdatePage && params.item.sizeShirt && merchandiseSize.filter((e) => e.ukuran === params.item.sizeShirt)[0] ? merchandiseSize.filter((e) => e.ukuran === params.item.sizeShirt.toUpperCase())[0] : merchandiseSize[0]);
  const [modalMerchandiseSize, setModalMerchandiseSize] = useState(false);

  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');

  const [thumbImage2, setThumbImage2] = useState('');
  const [mimeImage2, setMimeImage2] = useState('image/jpeg');

  const [thumbImage3, setThumbImage3] = useState('');
  const [mimeImage3, setMimeImage3] = useState('image/jpeg');

  const [thumbImage4, setThumbImage4] = useState('');
  const [mimeImage4, setMimeImage4] = useState('image/jpeg');

  const [thumbImage5, setThumbImage5] = useState('');
  const [mimeImage5, setMimeImage5] = useState('image/jpeg');

  const [thumbImage6, setThumbImage6] = useState('');
  const [mimeImage6, setMimeImage6] = useState('image/jpeg');

  const [thumbImage7, setThumbImage7] = useState('');
  const [mimeImage7, setMimeImage7] = useState('image/jpeg');

  const [thumbImage8, setThumbImage8] = useState('');
  const [mimeImage8, setMimeImage8] = useState('image/jpeg');

  const [fallback, setFallback] = useState(true);

  useEffect(() => {
    console.log('params', params);
    fetchData();
  }, []);

  const fetchData = async () => {
    const resultUserAddress = await fetchUserAddressList({ userId: user.userId });
    if (resultUserAddress.status) {
      setListUserAddress(resultUserAddress.data);
      console.log('resultUserAddress', resultUserAddress);
      
      if (isUpdatePage && params.item.userAddress && params.item.userAddress.id) {
        const selected = resultUserAddress.data.filter((e) => e.id === params.item.userAddress.id)[0];
        setSelectedUserAddress(selected);
      }
    }

    const resultCar = await fetchCarTypeListing();
    // console.log('resultCar', resultCar);

    if (resultCar.status) {
      setListCarType(resultCar.data);
      
      if (isUpdatePage && params.item.car_type) {
        const selected = resultCar.data.filter((e) => e.name.toLowerCase() === params.item.car_type.toLowerCase())[0];
        setSelectedCarType(selected);
      }
    }

    setFallback(false);
  }

  const copyToClipboard = (item) => {
    Clipboard.setString(item);
    showPopup('Nomor berhasil disalin', 'info');
  }

  const onUpdate = async() => {
    Keyboard.dismiss();

    setFallback(true);

    let body = {
      // photoProfile
      // chapterId
      initialCode: accessClient.InitialCode,
    }

    if (selectedCarType) body.carType = selectedCarType.name;
    if (userData.carColor) body.carColor = userData.carColor;
    if (userData.carYear) body.carYear = userData.carYear;
    if (userData.carIdentity) body.carIdentity = userData.carIdentity;
    if (userData.reason) body.reason = userData.reason;
    if (userData.note) body.note = userData.note;
    if (thumbImage) body.carPhotoMain = 'data:image/png;base64,' + thumbImage;
    if (thumbImage2) body.carPhotoFront = 'data:image/png;base64,' + thumbImage2;
    if (thumbImage3) body.carPhotoSide = 'data:image/png;base64,' + thumbImage3;
    if (thumbImage4) body.carPhotoBack = 'data:image/png;base64,' + thumbImage4;
    if (thumbImage6) body.selfiePhoto = 'data:image/png;base64,' + thumbImage6;
    if (thumbImage7) body.simPhoto = 'data:image/png;base64,' + thumbImage7;
    if (thumbImage8) body.stnkPhoto = 'data:image/png;base64,' + thumbImage8;
    if (thumbImage5) body.transactionProof = 'data:image/png;base64,' + thumbImage5;
    if (selectedUserAddress) body.userAddressId = selectedUserAddress.id;
    if (selectedMerchandiseSize) body.sizeShirt = selectedMerchandiseSize.ukuran;

    let variables = {
      joinCommunityId: params.item.id,
      body,
    }

    console.log(variables);

    const result = await fetchJoinCommunityUpdate(variables);
    console.log('result', result);
    if (result.status) {
      if (result.data.success) {
        showPopup('Formulir berhasil di perbarui', 'success');
        setTimeout(() => {
          if (isUpdatePage && params.prevScreen) {
            navigation.navigate(params.prevScreen, { item: params.item, refresh: true });
          } else {
            navigation.pop();
          }
        }, 2500);
      } else {
        showPopup('Formulir gagal di perbarui', 'error');
      }
    } else {
      showPopup('Formulir gagal di perbarui', 'error');
    }

    setFallback(false);
  }

  const onSubmit = () => {
    Keyboard.dismiss();

    if (!selectedUserAddress) {
      showPopup('Silahkan pilih domisili terlebih dulu', 'warning');
      return;
    }

    if (!selectedCarType) {
      showPopup('Silahkan isi tipe mobil terlebih dulu', 'warning');
      return;
    }

    if (userData.carColor === '') {
      showPopup('Silahkan isi warna mobil terlebih dulu', 'warning');
      return;
    }

    if (userData.carYear === '') {
      showPopup('Silahkan isi tahun mobil terlebih dulu', 'warning');
      return;
    }

    if (userData.carIdentity === '') {
      showPopup('Silahkan isi plat nomor terlebih dulu', 'warning');
      return;
    }

    if (userData.reason === '') {
      showPopup('Silahkan isi alasan gabung terlebih dulu', 'warning');
      return;
    }

    if (userData.note === '') {
      showPopup('Silahkan isi deskripsi terlebih dulu', 'warning');
      return;
    }

    if (thumbImage === '' || thumbImage2 === '' || thumbImage3 === '' || thumbImage4 === '' || thumbImage5 === '' || thumbImage6 === '' || thumbImage7 === '' || thumbImage8 === '') {
      showPopup('Silahkan pilih gambar terlebih dulu', 'warning');
      return;
    }

    let variables = {
      body: {
        // photoProfile
        // chapterId
        carType: selectedCarType.name,
        carColor: userData.carColor,
        carYear: userData.carYear,
        carIdentity: userData.carIdentity,
        reason: userData.reason,
        note: userData.note,
        carPhotoMain: 'data:image/png;base64,' + thumbImage,
        carPhotoFront: 'data:image/png;base64,' + thumbImage2,
        carPhotoSide: 'data:image/png;base64,' + thumbImage3,
        carPhotoBack: 'data:image/png;base64,' + thumbImage4,
        selfiePhoto: 'data:image/png;base64,' + thumbImage6,
        simPhoto: 'data:image/png;base64,' + thumbImage7,
        stnkPhoto: 'data:image/png;base64,' + thumbImage8,
        transactionProof: 'data:image/png;base64,' + thumbImage5,
        userAddressId: selectedUserAddress.id,
        sizeShirt: selectedMerchandiseSize.ukuran,
        initialCode: accessClient.InitialCode,
      },
    };

    console.log('variables', variables);

    // return;

    showLoading();

    Client.query({
      query: queryJoinCommunity,
      variables,
    })
      .then((res) => {
        console.log(res, '=== Berhsail ===');

        const data = res.data.joinCommunity;

        if (data) {
          showLoading('success', 'Berhasil Join Komunitas');

          setTimeout(() => {
            navigation.popToTop();
          }, 2500);
        } else {
          showLoading('error', 'Gagal Join Komunitas');
        }
      })
      .catch((err) => {
        console.log(err, 'errrrr');
        showLoading('error', 'Gagal join komunitas, Harap ulangi kembali');
      });
  }

  const onPhotoSelected = ({ base64, type }) => {
    switch (modalNumberPhoto) {
      case 1:
        setThumbImage(base64);
        setMimeImage(type);
        setModalNumberPhoto(0);
        break;
      case 2:
        setThumbImage2(base64);
        setMimeImage2(type);
        setModalNumberPhoto(0);
        break;
      case 3:
        setThumbImage3(base64);
        setMimeImage3(type);
        setModalNumberPhoto(0);
        break;
      case 4:
        setThumbImage4(base64);
        setMimeImage4(type);
        setModalNumberPhoto(0);
        break;
      case 5:
        setThumbImage5(base64);
        setMimeImage5(type);
        setModalNumberPhoto(0);
        break;
      case 6:
        setThumbImage6(base64);
        setMimeImage6(type);
        setModalNumberPhoto(0);
        break;
      case 7:
        setThumbImage7(base64);
        setMimeImage7(type);
        setModalNumberPhoto(0);
        break;
      case 8:
        setThumbImage8(base64);
        setMimeImage8(type);
        setModalNumberPhoto(0);
        break;
      default:
        break;
    }
  }

  const renderCardDomisili = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setSelectedUserAddress(item);
          setModalActionScrollProps(initModalActionScrollProps);
        }}
      >
        <Card radius={8} color={Color.theme}>
          <Container padding={16}>
            <Row justify='space-between'>
              <Container>
                {item.name !== '' && item.name !== null && <Text align='left'>{item.name}</Text>}
                {item.caption !== '' && item.caption !== null && <Text align='left' size={10}>{item.caption}</Text>}
              </Container>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ManageAddressScreen', { item, prevScreen: 'JoinCommunity' });
                  setModalActionScrollProps(initModalActionScrollProps);
                }}
              >
                <Container align='center'>
                  <Text color={Color.info} align='right'>Edit</Text>
                </Container>
              </TouchableOpacity>
            </Row>
          </Container>
        </Card>

        <Divider />
      </TouchableOpacity>
    )
  }

  const renderFormSelectImage = ({ onPress = () => { }, uri, label, caption }) => {
    let renderCardUri = (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          width: width / 3,
          aspectRatio: 1,
          borderRadius: 8,
          marginVertical: 12,
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: Color.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Feather
          name="camera"
          size={32}
          style={{ marginBottom: 4 }}
          color={Color.border}
        />
        <Text size={10} color={Color.border}>
          Tambah Foto
        </Text>
      </TouchableOpacity>
    );

    if (uri) {
      renderCardUri = (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          style={{
            width: '100%',
            aspectRatio: 4 / 3,
            marginVertical: 12,
            alignItems: 'center',
          }}>
          <Image
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 4,
            }}
            source={{ uri }}
          />
          <View style={{ position: 'absolute', bottom: 4, padding: 4, backgroundColor: Color.overflow }}>
            <Text size={12}>Klik untuk memilih ulang</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={{ paddingHorizontal: 16, marginVertical: 16 }}>
        <Text size={12} color={Color.text} align="left">
          {label}
        </Text>

        {renderCardUri}

        <Text size={12} color={Color.gray} align="left">
          {caption}
        </Text>
      </View>
    )
  }

  return (
    <Scaffold
      headerTitle="Gabung Komunitas"
      loadingProps={loadingProps}
      popupProps={popupProps}
      fallback={fallback}
    >
      <ScrollView>
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16 }}>
          <CircularProgress
            progress={50}
            color={Color.primary}
            textComponent={<Text size={28} color={Color.primary} type='bold'>1</Text>}
          />
          <View style={{ alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Informasi Data Diri</Text>
            <Text style={{ fontSize: 10, color: Color.secondary }}>Masukan informasi untuk gabung ke komunitas</Text>
          </View>
        </View>

        {accessClient.isRRID && (
          <Container paddingHorizontal={16}>
            <Text size={12} align="left">
              Form registrasi untuk member RR-ID
            </Text>
            <Text size={12} align="left">
              Untuk starter pack yang didapat:
            </Text>
            <Divider height={8} />
            <Text size={12} align="left">
              - 3 sticker (Logo rrid, nopung, Raize Rocky Indonesia)
            </Text>
            <Text size={12} align="left">
              - 1 kemeja
            </Text>
            <Text size={12} align="left">
              - 1 KTA (E-money saldo Rp0)
            </Text>
            <Divider height={8} />
            <Text size={12} align="left">
              Note: Ongkir akan dikabari setelah starter pack siap kirim
            </Text>
            <Divider />
            <Text size={12} align="left">
              Untuk detail CP:
            </Text>
            <Divider height={4} />
            <TouchableOpacity onPress={() => copyToClipboard('082111057057')}>
              <Text size={12} align="left">
                Vico 082 111 057 057{'    '}
                <Ionicons name="copy-outline" size={14} color={Color.info} />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard('081320476999')}>
              <Text size={12} align="left">
                Marco 081 320 476 999{'  '}
                <Ionicons name="copy-outline" size={14} color={Color.info} />
              </Text>
            </TouchableOpacity>
          </Container>
        )}

        <View style={{ backgroundColor: Color.theme, paddingVertical: 16 }}>
          <FormSelect
            label="Domisili"
            placeholder="Pilih Domisili"
            hideErrorHint
            value={selectedUserAddress ? selectedUserAddress.name : null}
            onPress={() => {
              setModalActionScrollProps({
                ...modalActionScrollProps,
                name: 'domisili',
                visible: true,
                selected: selectedUserAddress,
                data: listUserAddress,
                onPress: (val) => {
                  setSelectedUserAddress(val);
                  setModalActionScrollProps(initModalActionScrollProps);
                },
                onClose: () => setModalActionScrollProps(initModalActionScrollProps),
                renderItem: (item, index) => renderCardDomisili(item, index),
              });
            }}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ManageAddressScreen', { prevScreen: 'JoinCommunity' })}
            style={{ paddingVertical: 8 }}
          >
            <Text color={Color.info}>Tambah Domisili</Text>
          </TouchableOpacity>

          <FormSelect
            label="Tipe Mobil"
            placeholder="Pilih Tipe"
            hideErrorHint
            value={selectedCarType ? selectedCarType.name : null}
            onPress={() => {
              setModalActionScrollProps({
                ...modalActionScrollProps,
                name: 'carType',
                visible: true,
                selected: selectedCarType,
                data: listCarType,
                onPress: (val) => {
                  setSelectedCarType(val);
                  setModalActionScrollProps(initModalActionScrollProps);
                },
                onClose: () => setModalActionScrollProps(initModalActionScrollProps),
              });
            }}
          />

          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <View
              style={{
                marginTop: 6,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: Color.border,
              }}>
              <LabelInput>
                <Text size={10} letterSpacing={0.08} style={{ opacity: 0.6 }}>
                  Warna Mobil
                </Text>
              </LabelInput>
              <EmailRoundedView>
                <CustomTextInput
                  placeholder="Merah"
                  keyboardType="default"
                  placeholderTextColor={Color.border}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  onChangeText={text => onChangeUserData('carColor', text)}
                  selectionColor={Color.text}
                  value={userData.carColor}
                  onBlur={() => isValueError('carColor')}
                  style={{ color: Color.text }}
                />
              </EmailRoundedView>
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View
              style={{
                marginTop: 6,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: Color.border,
              }}>
              <LabelInput>
                <Text size={10} letterSpacing={0.08} style={{ opacity: 0.6 }}>
                  Tahun Mobil
                </Text>
              </LabelInput>
              <EmailRoundedView>
                <CustomTextInput
                  placeholder="1990"
                  keyboardType="numeric"
                  placeholderTextColor={Color.border}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  onChangeText={text => onChangeUserData('carYear', text)}
                  selectionColor={Color.text}
                  value={userData.carYear}
                  onBlur={() => isValueError('carYear')}
                  style={{ color: Color.text }}
                />
              </EmailRoundedView>
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View
              style={{
                marginTop: 6,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: Color.border,
              }}>
              <LabelInput>
                <Text size={10} letterSpacing={0.08} style={{ opacity: 0.6 }}>
                  Plat Nomor
                </Text>
              </LabelInput>
              <EmailRoundedView>
                <CustomTextInput
                  placeholder="B 1234 ABC"
                  keyboardType="default"
                  placeholderTextColor={Color.border}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  onChangeText={text => onChangeUserData('carIdentity', text)}
                  selectionColor={Color.text}
                  value={userData.carIdentity}
                  onBlur={() => isValueError('carIdentity')}
                  style={{ color: Color.text }}
                />
              </EmailRoundedView>
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View
              style={{
                marginTop: 6,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: Color.border,
                height: 90,
              }}>
              <LabelInput>
                <Text size={10} letterSpacing={0.08} style={{ opacity: 0.6 }}>
                  Alasan Gabung
                </Text>
              </LabelInput>
              <EmailRoundedView>
                <CustomTextInput
                  placeholder="Tuliskan sesuatu..."
                  keyboardType="default"
                  placeholderTextColor={Color.border}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  onChangeText={text => onChangeUserData('reason', text)}
                  selectionColor={Color.text}
                  value={userData.reason}
                  onBlur={() => isValueError('reason')}
                  style={{ color: Color.text }}
                />
              </EmailRoundedView>
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View
              style={{
                marginTop: 6,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: Color.border,
                height: 90,
              }}>
              <LabelInput>
                <Text size={10} letterSpacing={0.08} style={{ opacity: 0.6 }}>
                  Deskripsi
                </Text>
              </LabelInput>
              <EmailRoundedView>
                <CustomTextInput
                  placeholder="Tuliskan sesuatu..."
                  keyboardType="default"
                  placeholderTextColor={Color.border}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  onChangeText={text => onChangeUserData('note', text)}
                  selectionColor={Color.text}
                  value={userData.note}
                  onBlur={() => isValueError('note')}
                  style={{ color: Color.text }}
                />
              </EmailRoundedView>
            </View>
          </View>

          <FormSelect
            label="Ukuran Kemeja"
            placeholder="Pilih ukuran"
            value={
              selectedMerchandiseSize ? selectedMerchandiseSize.name : null
            }
            onPress={() => setModalMerchandiseSize(true)}
          />

          <View
            style={{
              paddingHorizontal: 16
            }}>
            <View
              style={{
                paddingVertical: 10,
                borderRadius: 4,
                backgroundColor: Color.primary,
              }}>
              <Text size={12} type="bold" color={Color.textInput}>
                DETAIL UKURAN
              </Text>
            </View>

            <View style={{ flex: 1, marginVertical: 8, borderWidth: 0.25 }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                {merchandiseHead.map((item, idx) => {
                  return <Text key={idx} size={10} style={{ flex: 1, borderWidth: 0.25, paddingVertical: 4 }}>{item}</Text>;
                })}
              </View>

              {merchandiseSize.map((item, idx) => {
                return (
                  <View key={idx} style={{ flex: 1, flexDirection: 'row' }}>
                    <Text size={10} style={{ flex: 1, borderWidth: 0.25, paddingVertical: 4 }}>{item.ukuran}</Text>
                    <Text size={10} style={{ flex: 1, borderWidth: 0.25, paddingVertical: 4 }}>{item.lebar}</Text>
                    <Text size={10} style={{ flex: 1, borderWidth: 0.25, paddingVertical: 4 }}>{item.panjang}</Text>
                    <Text size={10} style={{ flex: 1, borderWidth: 0.25, paddingVertical: 4 }}>{item.bahu}</Text>
                    <Text size={10} style={{ flex: 1, borderWidth: 0.25, paddingVertical: 4 }}>{item.l_panjang}</Text>
                    <Text size={10} style={{ flex: 1, borderWidth: 0.25, paddingVertical: 4 }}>{item.l_pendek}</Text>
                  </View>
                )
              })}
            </View>
          </View>

          <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16 }}>
            <CircularProgress
              progress={100}
              color={Color.primary}
              textComponent={<Text size={28} color={Color.primary} type='bold'>2</Text>}
            />
            <View style={{ alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 8 }}>
              <Text type='bold'>Unggah Foto</Text>
              <Text size={10} color={Color.secondary}>Unggah foto untuk memenuhi persyaratan</Text>
            </View>
          </View>

          {renderFormSelectImage({
            onPress: () => {
              setModalAddPhoto(true);
              setModalNumberPhoto(6);
            },
            uri: thumbImage6 ? `data:${mimeImage6};base64,${thumbImage6}` : userData.selfiePhoto || '',
            label: 'Foto Selfie',
            caption: 'Foto selfie dengan jelas dan tidak blur',
          })}

          {renderFormSelectImage({
            onPress: () => {
              setModalAddPhoto(true);
              setModalNumberPhoto(1);
            },
            uri: thumbImage ? `data:${mimeImage};base64,${thumbImage}` : userData.carPhotoMain || '',
            label: 'Foto Mobil',
            caption: 'Foto mobil dengan jelas dan tidak blur',
          })}

          {renderFormSelectImage({
            onPress: () => {
              setModalAddPhoto(true);
              setModalNumberPhoto(2);
            },
            uri: thumbImage2 ? `data:${mimeImage2};base64,${thumbImage2}` : userData.carPhotoFront || '',
            label: 'Foto Bagian Depan Mobil',
            caption: 'Foto bagian depan mobil dengan jelas dan tidak blur',
          })}

          {renderFormSelectImage({
            onPress: () => {
              setModalAddPhoto(true);
              setModalNumberPhoto(3);
            },
            uri: thumbImage3 ? `data:${mimeImage3};base64,${thumbImage3}` : userData.carPhotoSide || '',
            label: 'Foto Bagian Samping Mobil',
            caption: 'Foto tampak samping mobilmu dengan jelas',
          })}

          {renderFormSelectImage({
            onPress: () => {
              setModalAddPhoto(true);
              setModalNumberPhoto(4);
            },
            uri: thumbImage4 ? `data:${mimeImage4};base64,${thumbImage4}` : userData.carPhotoBack || '',
            label: 'Foto Bagian Belakang Mobil',
            caption: 'Foto tampak belakang mobilmu dengan jelas',
          })}

          {renderFormSelectImage({
            onPress: () => {
              setModalAddPhoto(true);
              setModalNumberPhoto(7);
            },
            uri: thumbImage7 ? `data:${mimeImage7};base64,${thumbImage7}` : userData.simPhoto || '',
            label: 'Foto SIM',
            caption: 'Foto SIM Anda dengan jelas',
          })}

          {renderFormSelectImage({
            onPress: () => {
              setModalAddPhoto(true);
              setModalNumberPhoto(8);
            },
            uri: thumbImage8 ? `data:${mimeImage8};base64,${thumbImage8}` : userData.stnkPhoto || '',
            label: 'Foto STNK',
            caption: 'Foto STNK Anda dengan jelas',
          })}

          {renderFormSelectImage({
            onPress: () => {
              setModalAddPhoto(true);
              setModalNumberPhoto(5);
            },
            uri: thumbImage5 ? `data:${mimeImage5};base64,${thumbImage5}` : userData.transactionProof || '',
            label: 'Foto Bukti Pembayaran',
            caption: 'Foto Bukti Pembayaran Anda dengan jelas',
          })}

          {/* nomor rek khusus rrid */}
          {accessClient.isRRID && <View style={{ paddingHorizontal: 16 }}>
            <Text size={11} color={Color.gray} align="left">
              Mohon agar ditransfer ke bank{' <'}
              <Text size={11} color={Color.gray} type="bold">
                BCA DIGITAL
              </Text>
              {'> '}
              <Text size={11} color={Color.gray} type="bold">
                001120211113 an Yokhanan Adi Prasetya
              </Text>{' '}
              sebesar Rp255.000.
            </Text>
            <Divider height={8} />
            <TouchableOpacity
              onPress={() => {
                copyToClipboard('001120211113');
              }}>
              <Text size={12} color={Color.gray}>
                Salin Rekening{' '}
                <Ionicons
                  name="copy-outline"
                  size={14}
                  color={Color.info}
                />
              </Text>
            </TouchableOpacity>
            <Divider height={8} />
          </View>}
        </View>

        {accessClient.isRRID && <>
          <View style={{ width: '100%', aspectRatio: 4 / 3 }}>
            <Image
              source={rridUniform}
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            />
          </View>

          <View style={{ width: '100%', aspectRatio: 4 / 3 }}>
            <Image
              source={rridSticker}
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            />
          </View>
        </>}
      </ScrollView>

      <Submit
        buttonLabel={isUpdatePage ? 'Update' : 'Gabung'}
        buttonColor={Color.primary}
        type="bottomSingleButton"
        buttonBorderTopWidth={0}
        onPress={() => {
          if (isUpdatePage) {
            onUpdate();
            return;
          }
          onSubmit();
        }}
      />

      <ModalActionScroll {...modalActionScrollProps} />

      <ModalActions
        visible={modalMerchandiseSize}
        onClose={() => {
          setModalMerchandiseSize(false);
        }}
        data={merchandiseSize}
        onPress={val => {
          setSelectedMerchandiseSize(val);
          setModalMerchandiseSize(false);
        }}
      />

      <ModalActions
        visible={modalAddPhoto}
        onClose={() => {
          setModalAddPhoto(false);
          setModalNumberPhoto(0);
        }}
        data={[
          {
            id: 1,
            name: 'Buka Kamera',
            onPress: () => {
              launchCamera(options, callback => {
                if (callback.didCancel) {
                } else if (callback.errorCode) {
                } else {
                  onPhotoSelected({
                    base64: callback.base64,
                    type: callback.type,
                  });
                }

                setModalAddPhoto(false);
              });
            },
          },
          {
            id: 2,
            name: 'Buka Galeri',
            onPress: () => {
              launchImageLibrary(options, callback => {
                if (callback.didCancel) {
                } else if (callback.errorCode) {
                } else {
                  onPhotoSelected({
                    base64: callback.base64,
                    type: callback.type,
                  });
                }

                setModalAddPhoto(false);
              });
            },
          },
        ]}
      />
    </Scaffold>
  );
}

export default JoinCommunity;
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  ImageBackground,
  Keyboard,
  BackHandler,
  useWindowDimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Styled from 'styled-components';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';

import {
  Header,
  Text,
  Popup,
  usePopup,
  Loading,
  useLoading,
  Submit,
  TouchableOpacity,
  useColor,
  Row,
  Scaffold,
} from '@src/components';
import {TouchSelect} from '@src/components/Form';
import ModalSelectStatus from '@src/components/Modal/ModalSelectStatus';
import validate from '@src/lib/validate';
import Client from '@src/lib/apollo';
import {queryProductManage} from '@src/lib/query';
import {geoCurrentPosition, geoLocationPermission} from 'src/utils/geolocation';
import {accessClient} from 'src/utils/access_client';
import FormSelect from 'src/components/FormSelect';
import DatePicker from 'react-native-date-picker';
import Moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Container, Divider} from 'src/styled';
import FormInput from 'src/components/FormInput';
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';
import ModalDropDown from 'src/components/Modal/ModalDropDown';
import {queryProductManageV2, queryGetEnumList} from 'src/lib/query';

const CreateNews = props => {
  const {navigation, route} = props;
  const {params} = route;
  const {Color} = useColor();

  // state
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [kategori, setKategori] = useState('');
  const [sumberGambar, setSumberGambar] = useState('');
  const [modalImagePicker, setModalImagePicker] = useState(false);
  const [image, setImage] = useState('');
  const [mime, setMime] = useState('image/jpeg');
  const [tag, setTag] = useState('');
  const [listTag, setListTag] = useState([]);
  const modalDropDownRef = useRef();
  const [kategoriList, setKategoriList] = useState();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // hooks
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();

  const getKategori = () => {
    const variables = {
      enumType: 'ARTIKEL SUB CATEGORY',
    };

    Client.query({
      query: queryGetEnumList,
      variables,
    })
      .then(res => {
        const data = res.data.enumList;
        for (const o of data) {
          Object.defineProperty(
            o,
            'value',
            Object.getOwnPropertyDescriptor(o, 'enumContent'),
          );
          Object.defineProperty(
            o,
            'name',
            Object.getOwnPropertyDescriptor(o, 'enumLabel'),
          );
          delete o['enumContent'];
          delete o['enumLabel'];
        }
        setKategoriList(data);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    requestLocationPermission();
    getKategori();
  }, []);

  const requestLocationPermission = async () => {
    const isGranted = await geoLocationPermission();

    console.log('isGranted', isGranted);

    geoCurrentPosition(
      res => {
        console.log(res, 'res location');
        if (res.coords) {
          setLatitude(res.coords.latitude.toString());
          setLongitude(res.coords.longitude.toString());
        }
      },
      err => {
        console.log(err, 'err location');
      },
    );
  };

  const onSubmit = () => {
    Keyboard.dismiss();

    if (image === '') {
      showPopup('Silahkan pilih gambar terlebih dulu', 'warning');
      return;
    }

    if (judul === '') {
      showPopup('Silahkan isi judul terlebih dulu', 'warning');
      return;
    }

    if (isi === '') {
      showPopup('Silahkan isi deskripsi terlebih dulu', 'warning');
      return;
    }

    if (kategori === '') {
      showPopup('Silahkan isi kategori terlebih dulu', 'warning');
      return;
    }

    showLoading();

    let variables = {
      products: [
        {
          name: judul,
          status: 'PUBLISH', // PUBLISH | DRAFT | PRIVATE | REMOVE
          method: 'INSERT', // UPDATE | DELETE
          type: params.productType,
          category: params.productCategory,
          categorySub: kategori.value,
          description: isi,
          latitude: latitude,
          longitude: longitude,
          image: image,
          eventDate: Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          tag: listTag,
          imageSource: sumberGambar,
        },
      ],
    };

    console.log(variables);

    Client.mutate({
      mutation: queryProductManageV2,
      variables,
    })
      .then(res => {
        console.log(res, '=== Berhsail ===');
        const data = res.data.contentProductManageV2;

        if (Array.isArray(data) && data.length > 0 && data[0]['id']) {
          showLoading('success', 'Thread berhasil dibuat!');

          setTimeout(() => {
            navigation.goBack();
            navigation.navigate('NewsDetailV2', {code: data[0].code});
          }, 2500);
        } else {
          showLoading('error', 'Thread gagal dibuat!');
        }
      })
      .catch(err => {
        console.log(err, 'errrrr');
        showLoading('error', 'Gagal membuat thread, Harap ulangi kembali');
      });
  };

  const onDeleteTag = index => {
    const temp = [...listTag];
    temp.splice(index, 1);
    setListTag(temp);
  };

  return (
    <Scaffold
      headerTitle={'Buat ' + params.title}
      loadingProps={loadingProps}
      popupProps={popupProps}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Container paddingHorizontal={16} paddingVertical={8}>
          <FormInput
            label="Judul"
            placeholder="Masukkan judul artikel..."
            hideErrorHint
            keyboardType="default"
            value={judul}
            onChangeText={value => {
              setJudul(value);
            }}
          />
        </Container>

        <Container paddingHorizontal={16} paddingVertical={8}>
          <FormInput
            label="Isi Artikel"
            placeholder="Masukkan isi artikel..."
            hideErrorHint
            keyboardType="default"
            value={isi}
            onChangeText={value => {
              setIsi(value);
            }}
            multiline={true}
          />
        </Container>

        <Container style={{paddingVertical: 8}}>
          <FormSelect
            type="select"
            hideErrorHint
            label="Kategori"
            value={kategori.name}
            placeholder="- Kategori Artikel -"
            onPress={() => {
              modalDropDownRef.current.open();
            }}
            labelContainerStyle={{
              paddingTop: 0,
              marginBottom: 4,
            }}
          />
        </Container>

        <Container
          paddingHorizontal={16}
          paddingVertical={8}
          align="flex-start">
          <Text size={14} type="bold">
            Gambar Cover
          </Text>
          <Divider height={8} />

          {image ? (
            <ImageBackground
              style={{
                width: '100%',
                height: 190,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              imageStyle={{borderRadius: 8}}
              source={{uri: `data:${mime};base64,${image}`}}
              resizeMode="cover">
              <TouchableOpacity
                onPress={() => {
                  setImage('');
                }}
                style={{
                  backgroundColor: 'rgba(18, 18, 18, 0.4)',
                  borderRadius: 120,
                  paddingHorizontal: 4,
                  paddingVertical: 4,
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}>
                <Ionicons name="trash" color={Color.textInput} size={12} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalImagePicker(true);
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#fff',
                }}>
                <Text size={10} color={Color.textInput}>
                  Ganti Gambar
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setModalImagePicker(true);
              }}
              style={{
                width: '100%',
                height: 190,
                borderRadius: 8,
                borderWidth: 1,
                borderStyle: 'dashed',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AntDesign name={'picture'} size={36} color={Color.disabled} />
              <Divider height={3} />
              <Text color={Color.disabled} size={14}>
                Upload Foto
              </Text>
              <Divider height={3} />
              <Text size={8} color={Color.disabled}>
                Upload ukuran gambar maksimal 2Mb
              </Text>
              <Text size={8} color={Color.disabled}>
                Resolusi gambar adalah 16:9 (1920 x 1080)
              </Text>
              <Text size={8} color={Color.disabled}>
                Gambar harus berformat JPG, JPEG, atau PNG
              </Text>
            </TouchableOpacity>
          )}
        </Container>

        <Container paddingHorizontal={16} paddingVertical={8}>
          <FormInput
            label="Sumber Gambar"
            placeholder="Masukkan sumber gambar..."
            hideErrorHint
            keyboardType="default"
            value={sumberGambar}
            onChangeText={value => {
              setSumberGambar(value);
            }}
          />
        </Container>

        <Container paddingHorizontal={16} paddingVertical={8}>
          <Container width="100%">
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                borderRadius: 6,
                borderWidth: 0.5,
                borderColor: Color.disabled,
                paddingVertical: Platform.OS === 'ios' ? 12 : 6,
                paddingHorizontal: 12,
                backgroundColor: Color.textInput,
              }}>
              <Row align="flex-end">
                <View style={{flex: 1}}>
                  <View
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      marginBottom: Platform.OS === 'ios' ? 4 : 2,
                    }}>
                    <Text size={12} color={Color.placeholder}>
                      Tag
                    </Text>
                  </View>
                  <Row align="center">
                    {listTag.length != 0 &&
                      listTag.map((item, index) => {
                        return (
                          <Container
                            paddingHorizontal={16}
                            paddingVertical={6}
                            justifyContent="space-between"
                            backgroundColor="#F2F2F2"
                            borderRadius={120}
                            flexDirection="row"
                            align="center"
                            key={index}
                            marginBottom={8}
                            marginRight={8}>
                            <Text size={12} color="#07181F">
                              {item}
                            </Text>
                            <Divider width={12} />
                            <TouchableOpacity
                              onPress={() => onDeleteTag(index)}>
                              <Ionicons
                                name="close"
                                color={Color.text}
                                size={14}
                              />
                            </TouchableOpacity>
                          </Container>
                        );
                      })}
                    <TextInput
                      placeholder={
                        listTag.length != 0 ? '' : 'Bandung, Lifestyle, Bike...'
                      }
                      placeholderTextColor={Color.border}
                      underlineColorAndroid="transparent"
                      autoCorrect={false}
                      onChangeText={val => {
                        if (val[val.length - 1] === ' ') {
                          setListTag([...listTag, val.slice(0, -1)]);
                          setTag('');
                        } else {
                          setTag(val);
                        }
                      }}
                      selectionColor={Color.text}
                      value={tag}
                      // returnKeyType={returnKeyType}
                      // onSubmitEditing={() => onSubmitEditing()}
                      blurOnSubmit={false}
                      multiline={true}
                      style={{
                        // width: '100%',
                        // height: '100%',
                        textAlignVertical: 'center',
                        flex: 1,
                        fontSize: 14,
                        fontFamily: 'Inter-Regular',
                        color: Color.text,
                        includeFontPadding: false,
                        padding: 0,
                        backgroundColor: Color.textInput,
                      }}
                    />
                  </Row>
                </View>
              </Row>
            </View>
          </Container>
        </Container>
      </KeyboardAwareScrollView>

      <Submit
        buttonLabel="Buat"
        buttonColor={Color.primary}
        type="bottomSingleButton"
        buttonBorderTopWidth={0.5}
        onPress={() => {
          onSubmit();
        }}
      />

      <ModalDropDown
        ref={modalDropDownRef}
        data={kategoriList}
        selectedValue={kategori}
        onPress={value => {
          setKategori(value);
          modalDropDownRef.current.close();
        }}
        label={'Kategori'}
        name="name"
      />

      <ModalImagePicker
        visible={modalImagePicker}
        onClose={() => {
          setModalImagePicker(false);
        }}
        onSelected={callback => {
          if (callback.base64) {
            setImage(callback.base64);
            setMime(callback.type);
          }
          setModalImagePicker(false);
        }}
      />
    </Scaffold>
  );
};

export default CreateNews;

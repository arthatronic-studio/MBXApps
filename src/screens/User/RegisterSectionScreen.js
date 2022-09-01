import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  KeyboardAvoidingView,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  Keyboard,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  Text,
  // TouchableOpacity,
  useLoading,
  Scaffold,
  useColor,
  Header,
  usePopup,
  Alert,
} from '@src/components';
import moment from 'moment';
import IonIcons from 'react-native-vector-icons/Ionicons';
import CircularProgress from 'src/components/CircularProgress';
import {Column, Row, Container, Divider} from 'src/styled';
import FormSelect from 'src/components/FormSelect';
import ModalSelectMap from 'src/components/ModalSelectMap';
import {initialLatitude, initialLongitude} from 'src/utils/constants';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  fetchShipperGetAreaList,
  fetchShipperGetCityList,
  fetchShipperGetProvinceList,
  fetchShipperGetSuburbList,
} from 'src/api/shipper';
import ModalActionScroll from 'src/components/Modal/ModalActionScroll';
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';
import FormInput from 'src/components/FormInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { queryCreateBusiness } from 'src/lib/query/thisable';
import Client from 'src/lib/apollo';
import {register as onRegister} from '@src/state/actions/user/auth';
import {useSelector, useDispatch} from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import ModalActions from 'src/components/Modal/ModalActions';
import { fetchGetCompanionTypeList, fetchGetDisabilityTypeList } from 'src/api/thisable/companion';
import { queryUserCompanionManage, queryUserSkillManage } from 'src/lib/query/thisable';
// import { fetchAddAddress } from 'src/api/addAddress';

const initSkillAndEducation = [
  {
    type: 'INPUT',
    label: 'Nama Pelatihan',
    placeholder: 'Masukkan Nama Pelatihan',
    keyboardType: 'default',
    key: 'trainingName',
    value: '',
    ref: null,
    onSubmit: () => {},
    returnKeyType: 'next',
  },
  {
    type: 'INPUT',
    label: 'Lembaga Pelaksana',
    placeholder: 'Masukkan Lembaga Pelaksana',
    keyboardType: 'default',
    key: 'institution',
    value: '',
    ref: null,
    onSubmit: () => {},
    returnKeyType: 'next',
  },
  {
    key: 'certificatePhoto',
    type: 'UPLOAD_FOTO',
    label: 'Upload Foto',
    placeholder: 'Belum ada gambar',
    hint_label1: 'Ukuran maks. File adalah 2MB',
    hint_label2: 'Format file berupa PNG, JPEG, atau JPG',
    imageBase64: '',
    mime: '',
  },
];

const educationLevels = [
  { code: 'SD', name: 'SD Sederajat' },
  { code: 'SMP', name: 'SMP Sederajat' },
  { code: 'SMA', name: 'SMA Sederajat' },
  { code: 'UNIERSITY', name: 'Akademi/Institut/Politeknik/Universitas Sederajat' },
];

const RegisterSectionScreen = ({navigation, route}) => {
  const { typeRegister } = route.params;

  const [popupProps, showPopup] = usePopup();
  const dispatch = useDispatch();
  const {Color} = useColor();
  const {width} = useWindowDimensions();
  const isFocused = useIsFocused();

  const isBusinessType = typeRegister.id === 0;
  const isUserType = typeRegister.id === 1;

  const [totalStep, setTotalStep] = useState(isBusinessType ? 2 : 1);
  const [step, setStep] = useState(1);

  // state register toko
  const [thumbImageBusiness, setThumbImageBusiness] = useState('');
  const [mimeImageBusiness, setMimeImageBusiness] = useState('image/jpeg');

  const [thumbImageProfile, setThumbImageProfile] = useState('');
  const [mimeImageProfile, setMimeImageProfile] = useState('image/jpeg');

  const [namaToko, setNamaToko] = useState('');
  const namaTokoRef = useRef();
  const [nomorToko, setNomorToko] = useState('');
  const nomorTokoRef = useRef();
  const [alamatToko, setAlamatToko] = useState('');
  const alamatTokoRef = useRef();
  const [prov, setProv] = useState({});
  const [city, setCity] = useState({});
  const [sub, setSub] = useState({});
  const [area, setArea] = useState({});
  const [kodePos, setKodePos] = useState('');
  const kodePosRef = useRef();
  const [fullAddress, setFullAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [npwp, setNpwp] = useState('');
  const npwpRef = useRef();
  const [npwpImage, setNpwpImage] = useState('');
  const [npwpMimeImage, setNpwpMimeImage] = useState('image/jpeg');
  const [nibImage, setNibImage] = useState('');
  const [nibMimeImage, setNibMimeImage] = useState('image/jpeg');
  const [siupImage, setSiupImage] = useState('');
  const [siupMimeImage, setSiupMimeImage] = useState('image/jpeg');

  const [modalImagePickerType, setModalImagePickerType] = useState('');

  // state register user
  const [nama, setNama] = useState('');
  const namaRef = useRef();
  const [lastName, setLastName] = useState('');
  const lastNameRef = useRef();
  const [email, setEmail] = useState('');
  const emailRef = useRef();
  const [nomorUser, setNomorUser] = useState('');
  const nomorUserRef = useRef();
  const [selectedDisability, setSelectedDisability] = useState();
  const [alamatUser, setAlamatUser] = useState('');
  const alamatUserRef = useRef();

  const [companionName, setCompanionName] = useState('');
  const [companionPhone, setCompanionPhone] = useState('');
  const [companionStatus, setCompanionStatus] = useState();

  const [provUser, setProvUser] = useState({});
  const [cityUser, setCityUser] = useState({});
  const [subUser, setSubUser] = useState({});
  const [areaUser, setAreaUser] = useState({});
  const [kodePosUser, setKodePosUser] = useState('');
  const kodePosUserRef = useRef();
  const [password1, setPassword1] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const password1Ref = useRef();
  const [password2, setPassword2] = useState('');
  const password2Ref = useRef();
  const [showPassword2, setShowPassword2] = useState(false);

  const [educationLevel, setEducationLevel] = useState();
  const [modalEducationLevel, setModalEducationLevel] = useState(false);
  const [skillAndEducations, setSkillAndEducations] = useState([initSkillAndEducation, ]);

  const {register, error} = useSelector(state => state['user.auth']);

  useEffect(() => {
    if (isFocused) {
      if (register.status) {
        const addresses = [{
          userId: register ? register.id : null,
          noTelp: nomorUser,
          countryId: 228,
          provinceId: provUser.id,
          cityId: cityUser.id,
          suburbId: subUser.id,
          areaId: areaUser.id,
          postalCode: kodePosUser,
          address: alamatUser
        }];

        console.log('register', register);
        // console.log('addresses', addresses);

        // fetchAddAddress({addresses});

        if (isBusinessType) {
          onCreateBusiness();
        } else if (isUserType) {
          onCreateCompanionAndSkill();
        }
      } else if (!register.status && error) {
        showPopup(error.trim(), 'error');
        dispatch({type: 'USER.LOGOUT'});
      }
    }
  }, [register, error, isFocused]);

  const onSubmit = () => {
    if (isBusinessType) {
      if (step === 1) {
        setStep(step + 1);
      } else {
        onCreateUser();
      }
    } else {
      onCreateUser();
    }
  };

  const validation = (value, title, type) => {
    if (value === '') {
      showPopup(`Silahkan ${title} terlebih dulu`, 'warning');
      return true;
    }
    if (type === 'email') {
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (value.match(validRegex)) {
        return false;
      } else {
        showPopup(`Mohon isi email Anda dengan benar`, 'warning');
        return true;
      }
    }
    if (type === 'password') {
      if (value.length < 6) {
        showPopup(`Kata sandi minimal 6 karakter`, 'warning');
        return true;
      }
    
    }
    // if (type === 'nomor') {
    //   if (value.length < 11) {
    //     showPopup(`Nomor telepon minimal 11 karakter`, 'warning');
    //     return true;
    //   }
    // }
    return false;
  };

  const onCreateUser = () => {
    if (validation(nama, 'isi nama')) return;
    if (validation(email, 'isi email', 'email')) return;
    if (validation(nomorUser, 'isi nomor', 'nomor')) return;
    if (validation(alamatUser, 'isi alamat')) return;
    if (validation(provUser, 'pilih provinsi')) return;
    if (validation(cityUser, 'pilih kota')) return;
    if (validation(subUser, 'pilih kecematan')) return;
    if (validation(areaUser, 'pilih kelurahan')) return;
    if (validation(kodePosUser, 'isi kode pos')) return;
    if (validation(password1, 'isi password anda', 'password')) return;
    if (validation(password2, 'isi konfirmasi password', 'password')) return;
    if (password1 !== password2) {
      showPopup(`Konfirmasi password tidak sama`, 'warning');
      return;
    }

    if (isUserType && !companionStatus) {
      showPopup(`Mohon pilih status pendamping`, 'warning');
      return;
    }

    if (isUserType && !selectedDisability) {
      showPopup(`Mohon pilih jenis disabilitas`, 'warning');
      return;
    }

    if (isUserType && !educationLevel) {
      showPopup(`Mohon pilih tingkat pendidikan`, 'warning');
      return;
    }

    const newUserData = {
      username: nomorUser,
      firstName: nama,
      lastName: lastName,
      email,
      phoneNumber: nomorUser,
      password: password1,
      phoneCountryCode: "+62",
      postalCode: kodePosUser,
      address: alamatUser,
      role: typeRegister.id,
    };

    dispatch(onRegister(newUserData));
  };

  const onCreateBusiness = () => {
    if (validation(thumbImageBusiness, 'pilih gambar bisnis')) return;
    if (validation(namaToko, 'isi nama toko')) return;
    if (validation(nomorToko, 'isi nomor toko', 'nomor')) return;
    if (validation(alamatToko, 'isi alamat toko')) return;
    if (validation(prov, 'pilih provinsi toko')) return;
    if (validation(city, 'pilih kota toko')) return;
    if (validation(sub, 'pilih kecematan toko')) return;
    if (validation(area, 'pilih kelurahan toko')) return;
    if (validation(kodePos, 'isi kode pos toko')) return;
    if (validation(fullAddress, 'pilih pin lokasi toko')) return;
    if (validation(npwp, 'isi nomor npwp toko')) return;
    if (validation(npwpImage, 'pilih gambar npwp toko')) return;

    const variables = {
      body: {
        userId: register.id,
        name: namaToko,
        noTelp: nomorToko,
        alamat: alamatToko,
        socialMedia: {
          instagram: '',
        },
        profileImg: 'data:image/png;base64,' + thumbImageBusiness,
        isVerified: false,
        isOfficial: false,
        countryId: 228,
        countryName: 'Indonseia',
        provinceId: prov.id,
        provinceName: prov.name,
        cityId: city.id,
        cityName: city.name,
        suburbId: sub.id,
        suburbName: sub.name,
        areaId: area.id,
        areaName: area.name,
        postalCode: kodePos,
        lat: String(latitude),
        long: String(longitude),
        taxpayerNumber: npwp,
        taxpayerNumberPhoto: 'data:image/png;base64,' + npwpImage,
        "categoryId": 1,
        "volumeId": 1
      },
    };

    console.log(variables);

    Client.mutate({mutation: queryCreateBusiness, variables})
      .then(res => {
        const data = res.data;
        console.log(data, "dataa");
        if (data) {

          setTimeout(() => {
            navigation.navigate('LoginScreen');
          }, 2500);
        } else {
          showPopup('Error create business', 'warning');
        }
      })
      .catch(err => {
        showPopup('error create business', 'warning');
      });
  };

  const onCreateCompanionAndSkill = () => {
    const companionObj = {
      type: 'CREATE',
      companionId: companionStatus.id,
      body: {
        disabilityTypeId: selectedDisability.id,
        name: companionName,
        phoneNumber: companionPhone,
        status: '1'
      }
    }

    Client.mutate({mutation: queryUserCompanionManage, variables: companionObj})
      .then(res => {
        const data = res.data;
        console.log(data, "dataa");
        if (data) {

          setTimeout(() => {
            navigation.navigate('LoginScreen');
          }, 2500);
        } else {
          showPopup('Error create company', 'warning');
        }
      })
      .catch(err => {
        showPopup('Terjadi kesalahan', 'warning');
      });

    const educationObj = {
      type: 'CREATE',
      skillId: 0,
      body: {
        educationLevel: educationLevel.id,
        trainingName: skillAndEducations[0][0].value,
        institution: skillAndEducations[0][1].value,
        certificatePhoto: `data:${skillAndEducations[0][2].mime};base64,` + skillAndEducations[0][2].imageBase64,
      },
    }

    Client.mutate({mutation: queryUserSkillManage, variables: educationObj})
      .then(res => {
        const data = res.data;
        console.log(data, "dataa");
        if (data) {

          // setTimeout(() => {
          //   navigation.navigate('LoginScreen');
          // }, 2500);
        } else {
          showPopup('Error create skill & education', 'warning');
        }
      })
      .catch(err => {
        showPopup('Terjadi kesalahan', 'warning');
      });
  }

  const renderLabel = item => {
    return (
      <Container padding={16} paddingBottom={8}>
        <Text type="bold" align="left">
          {item.label}
        </Text>
      </Container>
    );
  };

  const renderTextInput = item => {
    return (
      <Container paddingHorizontal={16} paddingVertical={8}>
        <FormInput
          ref={item.ref}
          label={item.label}
          placeholder={item.placeholder}
          hideErrorHint
          keyboardType={item.keyboardType ? item.keyboardType : 'default'}
          value={item.value}
          onChangeText={value => {
            item.setValue(value);
          }}
          multiline={item.type === 'TEXT_AREA'}
          prefixText={item.prefixText ? item.prefixText : ''}
          returnKeyType={item.returnKeyType}
          onSubmitEditing={() => item.onSubmit()}
        />
      </Container>
    );
  };

  const renderPasswordInput = item => {
    return (
      <Container paddingHorizontal={16} paddingVertical={8}>
        <FormInput
          label={item.label}
          placeholder={item.placeholder}
          ref={item.passwordRef}
          secureTextEntry={!item.showPassword}
          value={item.value}
          hideErrorHint
          onChangeText={value => {
            item.setValue(value);
          }}
          keyboardType={item.keyboardType ? item.keyboardType : 'default'}
          returnKeyType={item.returnKeyType}
          onSubmitEditing={() => item.onSubmit()}
          suffixIcon={
            <View
              style={{
                width: '10%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => item.setShowPassword(!item.showPassword)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <Ionicons
                  size={16}
                  name={item.showPassword ? 'eye-off' : 'eye'}
                  color={Color.gray}
                />
              </TouchableOpacity>
            </View>
          }
        />
      </Container>
    );
  };

  const [modalSelectMap, setModalSelectMap] = useState(false);
  const renderMapView = item => {
    return (
      <View style={{paddingVertical: 8}}>
        <FormSelect
          type="select"
          hideErrorHint
          label={item.label}
          value={item.value}
          placeholder={item.placeholder}
          onPress={() => {
            setModalSelectMap(true);
          }}
          labelContainerStyle={{
            paddingTop: 0,
            marginBottom: 4,
          }}
        />

        <ModalSelectMap
          visible={modalSelectMap}
          extraProps={{
            fullAddress: item.fullAddress ? item.fullAddress : '',
            latitude: item.latitude ? item.latitude : initialLatitude,
            longitude: item.longitude ? item.longitude : initialLongitude,
          }}
          onSelect={item => {
            // const name = item.name;
            setFullAddress(item.fullAddress);
            setLatitude(item.latitude);
            setLongitude(item.longitude);
          }}
          onClose={() => setModalSelectMap(false)}
        />
      </View>
    );
  };
  const renderUploadImage = (item) => {
    return (
      <Container
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 8,
          alignItems: 'center',
        }}>
        {item.imageBase64 ? (
          <Image
            style={{
              width: '32%',
              aspectRatio: 1,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            source={{uri: `data:${item.mime};base64,${item.imageBase64}`}}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (item.type) setModalImagePickerType(item.type);
            }}
            style={{
              width: '32%',
              borderWidth: 1,
              borderColor: Color.text,
              aspectRatio: 1,
              borderStyle: 'dashed',
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign
              name={'camerao'}
              size={22}
              style={{color: Color.secondary, paddingVertical: 5}}
            />
            <Text style={{color: Color.secondary, fontSize: 10}}>
              {item.placeholder}
            </Text>
          </TouchableOpacity>
        )}
        <Container marginLeft={16} alignItems={'flex-start'}>
          <Text align="left" size={12} color={Color.text} type="bold">
            {item.label}
          </Text>
          <Divider height={4} />
          <Text size={10} align="left" color={Color.secondary}>
            {item.hint_label1}
          </Text>
          <Text size={10} align="left" color={Color.secondary}>
            {item.hint_label2}
          </Text>
          <Divider height={8} />
          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              paddingVertical: 7,
              borderWidth: 1,
              borderColor: '#F3771D',
              borderRadius: 120,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => {
              if (item.type) setModalImagePickerType(item.type);
            }}>
            <Feather size={16} name={'upload'} color="#F3771D" />
            <Divider width={8} />
            <Text color="#F3771D" size={10}>
              Upload Gambar
            </Text>
          </TouchableOpacity>
        </Container>
      </Container>
    );
  };

  const [modalSelectBox, setModalSelectBox] = useState(false);
  const [currentData, setCurrentData] = useState([]);

  const fetchSelectBox = async item => {
    console.log('item', item);

    if (item.shema === 'queryGetProvince') {
      const result = await fetchShipperGetProvinceList({countryCode: 228});
      if (result.status) {
        setCurrentData(result.data);
      }
    } else if (item.shema === 'queryGetCity') {
      // ambil value yg jadi brancing parent
      const result = await fetchShipperGetCityList({
        provinceId:
          isBusinessType && step === 1
            ? prov.id
              ? prov.id
              : null
            : provUser.id
            ? provUser.id
            : null,
      });
      if (result.status) {
        setCurrentData(result.data);
      }
    } else if (item.shema === 'queryGetSub') {
      // ambil value yg jadi brancing parent
      const result = await fetchShipperGetSuburbList({
        cityId:
        isBusinessType && step === 1
            ? city.id
              ? city.id
              : null
            : cityUser.id
            ? cityUser.id
            : null,
      });
      if (result.status) {
        setCurrentData(result.data);
      }
    } else if (item.shema === 'queryGetArea') {
      // ambil value yg jadi brancing parent
      const result = await fetchShipperGetAreaList({
        suburbId:
        isBusinessType && step === 1
            ? sub.id
              ? sub.id
              : null
            : subUser.id
            ? subUser.id
            : null,
      });
      if (result.status) {
        setCurrentData(result.data);
      }
    }
    else if (item.shema === "getDisabilityTypeList") {
      const result = await fetchGetDisabilityTypeList();
      console.log('result disabilitas', result);
      if (result.status) {
        setCurrentData(result.data);
      }
    }
    else if (item.shema === "fetchGetCompanionTypeList") {
      const result = await fetchGetCompanionTypeList();
      console.log('result disabilitas', result);
      if (result.status) {
        setCurrentData(result.data);
      }
    }
  };
  const renderSelectBox = item => {
    return (
      <View style={{paddingVertical: 8}}>
        <FormSelect
          type="select"
          hideErrorHint
          label={item.label}
          value={item.value}
          placeholder={item.placeholder}
          onPress={() => {
            if (typeof item.onPress === 'function') {
              item.onPress();
              return;
            }
            setModalSelectBox(true);
            setCurrentData([]);
            fetchSelectBox(item);
          }}
          labelContainerStyle={{
            paddingTop: 0,
            marginBottom: 4,
          }}
          disabled={item.disabled}
        />
      </View>
    );
  };

  const renderRegisterBusiness = (progress, count) => (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}>
        <CircularProgress
          progress={progress}
          color={Color.error}
          textComponent={
            <Text size={28} color={Color.error} type="bold">
              {count}
            </Text>
          }
        />
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingLeft: 8,
          }}>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>
            Informasi Perusahaan
          </Text>
          <Text style={{fontSize: 10, color: Color.secondary}}>
            Masukkan informasi seputar bisnis Anda
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setModalImagePickerType('PROFILE_BUSINESS');
          }}>
          {thumbImageBusiness !== '' && (
            <Image
              source={{uri: `data:${mimeImageBusiness};base64,${thumbImageBusiness}`}}
              style={{
                resizeMode: 'cover',
                width: 48,
                height: 48,
                borderRadius: 50,
              }}
            />
          )}
          {thumbImageBusiness === '' && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Color.border,
                width: 48,
                height: 48,
                borderRadius: 50,
              }}>
              <IonIcons name={'camera-outline'} size={17} />
            </View>
          )}
        </TouchableOpacity>

        <Divider width={10} />

        <View>
          <Text
            style={{
              fontSize: 11,
              color: Color.text,
              fontWeight: 'bold',
              textAlign: 'left',
            }}>
            Unggah Foto Profile Bisnis
          </Text>
          <Divider height={4} />
          <Text style={{fontSize: 8, color: Color.gray}}>
            Ukuran foto maks. 1MB dengan format JPEG, PNG, atau JPG
          </Text>
          <Divider height={3} />
          <TouchableOpacity
            onPress={() => {
              setModalImagePickerType('PROFILE_BUSINESS');
            }}>
            <Text
              style={{
                fontSize: 8,
                color: thumbImageBusiness !== '' ? Color.error : Color.primary,
                textAlign: 'left',
                fontWeight: 'bold',
              }}>
              {thumbImageBusiness !== '' ? 'Ganti Foto' : 'Unggah Foto'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderLabel({
        label: 'Informasi',
      })}

      {renderTextInput({
        label: 'Nama Perusahaan/Bisnis',
        placeholder: 'PT. Tribes Integra Asia',
        keyboardType: 'default',
        value: namaToko,
        ref: namaTokoRef,
        setValue: value => setNamaToko(value),
        onSubmit: () => nomorTokoRef.current.focus(),
        returnKeyType: 'next',
      })}

      {renderTextInput({
        label: 'No. Telpon Perusahaan/Bisnis',
        placeholder: '0813-1234-5678',
        keyboardType: 'numeric',
        value: nomorToko,
        ref: nomorTokoRef,
        setValue: value => setNomorToko(value),
        onSubmit: () => alamatTokoRef.current.focus(),
        returnKeyType: 'next',
      })}

      {renderTextInput({
        label: 'Alamat Perusahaan/Bisnis',
        placeholder: 'Masukkan Alamat Bisnis',
        keyboardType: 'default',
        value: alamatToko,
        type: 'TEXT_AREA',
        ref: alamatTokoRef,
        setValue: value => setAlamatToko(value),
        onSubmit: () => kodePosRef.current.focus(),
        returnKeyType: 'next',
      })}

      {renderSelectBox({
        label: 'Provinsi',
        value: prov.name,
        placeholder: 'Pilih Provinsi',
        shema: 'queryGetProvince',
      })}

      {renderSelectBox({
        label: 'Kota/Kabupaten',
        value: city.name,
        placeholder: 'Pilih Kota/Kabupaten',
        shema: 'queryGetCity',
        disabled: prov.id === undefined,
      })}

      {renderSelectBox({
        label: 'Kecamatan',
        value: sub.name,
        placeholder: 'Pilih Kecamatan',
        shema: 'queryGetSub',
        disabled: city.id === undefined,
      })}

      {renderSelectBox({
        label: 'Kelurahan',
        value: area.name,
        placeholder: 'Pilih Kelurahan',
        shema: 'queryGetArea',
        disabled: sub.id === undefined,
      })}

      <Divider height={8} />

      {renderTextInput({
        label: 'Kode Pos',
        placeholder: 'Masukkan Kode Pos',
        keyboardType: 'numeric',
        value: kodePos,
        ref: kodePosRef,
        setValue: value => setKodePos(value),
        onSubmit: () => npwpRef.current.focus(),
        returnKeyType: 'next',
      })}

      {renderMapView({
        label: 'Pin Lokasi',
        placeholder: 'Belum diatur',
        value: fullAddress,
      })}

      {renderLabel({
        label: 'NPWP Perusahaan/Bisnis',
      })}

      {renderTextInput({
        label: 'No. NPWP Perusahaan/Bisnis',
        placeholder: 'Masukkan No. NPWP',
        keyboardType: 'numeric',
        value: npwp,
        ref: npwpRef,
        setValue: value => setNpwp(value),
        onSubmit: () => Keyboard.dismiss(),
      })}

      {renderUploadImage({
        type: 'NPWP',
        label: 'Upload Foto NPWP',
        placeholder: 'Belum ada gambar',
        hint_label1: 'Ukuran maks. File adalah 2MB',
        hint_label2: 'Format file berupa PNG, JPEG, atau JPG',
        imageBase64: npwpImage,
        mime: npwpMimeImage,
      })}

      {renderUploadImage({
        type: 'NIB',
        label: 'Upload Foto NIB',
        placeholder: 'Belum ada gambar',
        hint_label1: 'Ukuran maks. File adalah 2MB',
        hint_label2: 'Format file berupa PNG, JPEG, atau JPG',
        imageBase64: nibImage,
        mime: nibMimeImage,
      })}

      {renderUploadImage({
        type: 'SIUP',
        label: 'Upload Foto SIUP',
        placeholder: 'Belum ada gambar',
        hint_label1: 'Ukuran maks. File adalah 2MB',
        hint_label2: 'Format file berupa PNG, JPEG, atau JPG',
        imageBase64: siupImage,
        mime: siupMimeImage,
      })}
    </KeyboardAwareScrollView>
  );

  const renderRegisterUser = (progress, count) => (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}>
        <CircularProgress
          progress={progress}
          color={Color.error}
          textComponent={
            <Text size={28} color={Color.error} type="bold">
              {count}
            </Text>
          }
        />
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingLeft: 8,
          }}>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>
            Informasi Diri
          </Text>
          <Text style={{fontSize: 10, color: Color.secondary}}>
            Masukkan informasi seputar data diri
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setModalImagePickerType('PROFILE_USER');
          }}>
          {thumbImageProfile !== '' && (
            <Image
              source={{uri: `data:${mimeImageProfile};base64,${thumbImageProfile}`}}
              style={{
                resizeMode: 'cover',
                width: 48,
                height: 48,
                borderRadius: 50,
              }}
            />
          )}
          {thumbImageProfile === '' && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Color.border,
                width: 48,
                height: 48,
                borderRadius: 50,
              }}>
              <IonIcons name={'camera-outline'} size={17} />
            </View>
          )}
        </TouchableOpacity>

        <Divider width={10} />

        <View>
          <Text
            style={{
              fontSize: 11,
              color: Color.text,
              fontWeight: 'bold',
              textAlign: 'left',
            }}>
            Unggah Foto Profile
          </Text>
          <Divider height={4} />
          <Text style={{fontSize: 8, color: Color.gray}}>
            Ukuran foto maks. 1MB dengan format JPEG, PNG, atau JPG
          </Text>
          <Divider height={3} />
          <TouchableOpacity
            onPress={() => {
              setModalImagePickerType('PROFILE_USER');
            }}>
            <Text
              style={{
                fontSize: 8,
                color: thumbImageProfile !== '' ? Color.error : Color.primary,
                textAlign: 'left',
                fontWeight: 'bold',
              }}>
              {thumbImageProfile !== '' ? 'Ganti Foto' : 'Unggah Foto'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderLabel({
        label: 'Informasi',
      })}

      {renderTextInput({
        label: 'Nama Depan',
        placeholder: 'Adang',
        keyboardType: 'default',
        value: nama,
        ref: namaRef,
        setValue: value => setNama(value),
        onSubmit: () => lastNameRef.current.focus(),
        returnKeyType: 'next',
      })}

      {renderTextInput({
        label: 'Nama Belakang',
        placeholder: 'Susanyo',
        keyboardType: 'default',
        value: lastName,
        ref: lastNameRef,
        setValue: value => setLastName(value),
        onSubmit: () => emailRef.current.focus(),
        returnKeyType: 'next',
      })}

      {renderTextInput({
        label: 'Email',
        placeholder: 'contoh@email.com',
        keyboardType: 'default',
        value: email,
        ref: emailRef,
        setValue: value => setEmail(value),
        onSubmit: () => nomorUserRef.current.focus(),
        returnKeyType: 'next',
      })}

      {renderTextInput({
        label: 'No. Telpon',
        placeholder: '0813-1234-5678',
        keyboardType: 'numeric',
        value: nomorUser,
        ref: nomorUserRef,
        setValue: value => setNomorUser(value),
        onSubmit: () => alamatUserRef.current.focus(),
        returnKeyType: 'next'
      })}

      {isUserType && renderSelectBox({
        label: 'Jenis Disabilitas',
        value: selectedDisability ? selectedDisability.name : null,
        placeholder: 'Pilih Jenis Disabilitas',
        shema: 'getDisabilityTypeList',
      })}

      {isUserType && renderLabel({
        label: 'Informasi Pendamping',
      })}

      {isUserType && renderTextInput({
        label: 'Nama Pendamping',
        placeholder: 'Masukan nama pendamping',
        keyboardType: 'default',
        value: companionName,
        // ref: ,
        setValue: value => setCompanionName(value),
        // onSubmit: () => alamatUserRef.current.focus(),
        returnKeyType: 'next'
      })}

      {isUserType && renderTextInput({
        label: 'No. Telepon',
        placeholder: 'Masukan no. telepon',
        keyboardType: 'numeric',
        value: companionPhone,
        // ref: ,
        setValue: value => setCompanionPhone(value),
        // onSubmit: () => alamatUserRef.current.focus(),
        returnKeyType: 'next'
      })}

      {isUserType && renderSelectBox({
        label: 'Status Pendamping',
        value: companionStatus ? companionStatus.name : null,
        placeholder: 'Pilih Status Pendamping',
        shema: 'fetchGetCompanionTypeList',
      })}

      {renderLabel({
        label: 'Alamat',
      })}

      {renderTextInput({
        label: 'Alamat',
        placeholder: 'Masukkan Alamat',
        keyboardType: 'default',
        value: alamatUser,
        type: 'TEXT_AREA',
        ref: alamatUserRef,
        setValue: value => setAlamatUser(value),
        onSubmit: () => kodePosUserRef.current.focus(),
        returnKeyType: 'next'
      })}

      {renderSelectBox({
        label: 'Provinsi',
        value: provUser.name,
        placeholder: 'Pilih Provinsi',
        shema: 'queryGetProvince',
      })}

      {renderSelectBox({
        label: 'Kota/Kabupaten',
        value: cityUser.name,
        placeholder: 'Pilih Kota/Kabupaten',
        shema: 'queryGetCity',
        disabled: provUser.id === undefined,
      })}

      {renderSelectBox({
        label: 'Kecamatan',
        value: subUser.name,
        placeholder: 'Pilih Kecamatan',
        shema: 'queryGetSub',
        disabled: cityUser.id === undefined,
      })}

      {renderSelectBox({
        label: 'Kelurahan',
        value: areaUser.name,
        placeholder: 'Pilih Kelurahan',
        shema: 'queryGetArea',
        disabled: subUser.id === undefined,
      })}

      <Divider height={8} />

      {renderTextInput({
        label: 'Kode Pos',
        placeholder: 'Masukkan Kode Pos',
        keyboardType: 'numeric',
        value: kodePosUser,
        ref: kodePosUserRef,
        setValue: value => setKodePosUser(value),
        onSubmit: () => password1Ref.current.focus(),
        returnKeyType: 'next',
      })}

      {renderLabel({
        label: 'Informasi Akun',
      })}

      {renderPasswordInput({
        label: 'Kata Sandi',
        placeholder: '••••••••••••',
        passwordRef: password1Ref,
        showPassword: showPassword1,
        setShowPassword: value => setShowPassword1(value),
        value: password1,
        setValue: value => setPassword1(value),
        onSubmit: () => password2Ref.current.focus(),
        returnKeyType: 'next',
      })}

      {renderPasswordInput({
        label: 'Ulangi Kata Sandi',
        placeholder: '••••••••••••',
        passwordRef: password2Ref,
        showPassword: showPassword2,
        setShowPassword: value => setShowPassword2(value),
        value: password2,
        setValue: value => setPassword2(value),
        onSubmit: () => onSubmit(),
        returnKeyType: 'send',
      })}

      {isUserType && renderLabel({
        label: 'Keahlian dan Pendidikan',
      })}

      {isUserType && renderSelectBox({
        label: 'Tingkat Pendidikan',
        value: educationLevel ? educationLevel.name : null,
        placeholder: 'Pilih Tingkat Pendidikan',
        onPress: () => setModalEducationLevel(true),
      })}

      {isUserType && skillAndEducations.map((itemFill, idxFill) =>
        itemFill.map((itemSkill, idxSkill) => {
          if (itemSkill.type === 'UPLOAD_FOTO') {
            return renderUploadImage({
              ...itemSkill,
              type: idxSkill
            });
          }

          return renderTextInput({
            ...itemSkill,
            setValue: (value) => {
              let newSkill = [...skillAndEducations];
              newSkill[idxFill][idxSkill].value = value;
              setSkillAndEducations(newSkill);
            }
          });
        })
      )}
    </KeyboardAwareScrollView>
  );

  const ButtonView = Platform.OS === 'ios' ? View : View;

  return (
    <Scaffold
      header={
        <Header
          customIcon
          title="Daftar"
          type="regular"
          centerTitle={false}
          onPressLeftButton={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              Alert('Konfirmasi', 'Apakah Anda akan membatalkan pendaftaran?', () => navigation.pop());
            }
          }}
        />
      }
      popupProps={popupProps}
    >
      {isBusinessType && step === 1 && renderRegisterBusiness(50, 1)}
      {isBusinessType && step === 2 && renderRegisterUser(100, 2)}
      {isUserType && step === 1 && renderRegisterUser(100, 1)}

      <ButtonView behavior="padding">
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            borderRadius: 10,
            paddingVertical: 16,
          }}>
          <TouchableOpacity
            onPress={() => onSubmit()}
            style={{
              backgroundColor: Color.primary,
              width: '90%',
              height: 45,
              borderRadius: 50,
              justifyContent: 'center',
            }}>
            <Text style={{color: Color.textInput}}>Daftar</Text>
          </TouchableOpacity>
        </View>
      </ButtonView>

      {/* modal for select box */}
      <ModalActionScroll
        data={currentData}
        visible={modalSelectBox}
        onPress={val => {
          console.log(val.__typename);

          if (val.__typename === 'ShipperGetLocationProvinceListType') {
            if (isBusinessType && step === 1) {
              setProv(val);
              setCity({});
              setSub({});
              setArea({});
            } else {
              setProvUser(val);
              setCityUser({});
              setSubUser({});
              setArea({});
            }
          }
          if (val.__typename === 'ShipperGetLocationCitiesListType') {
            if (isBusinessType && step === 1) {
              setCity(val);
              setSub({});
              setArea({});
            } else {
              setCityUser(val);
              setSubUser({});
              setArea({});
            }
          }
          if (val.__typename === 'ShipperGetLocationSuburbListType') {
            if (isBusinessType && step === 1) {
              setSub(val);
              setArea({});
            } else {
              setSubUser(val);
              setArea({});
            }
          }
          if (val.__typename === 'ShipperGetLocationAreaListType') {
            if (isBusinessType && step === 1) {
              setArea(val);
            } else {
              setAreaUser(val);
            }
          }
          else if (val.__typename === 'DisabilityType') {
            setSelectedDisability(val);
          }
          else if (val.__typename === 'CompanionType') {
            setCompanionStatus(val);
          }
          
          setModalSelectBox(false);
        }}
        onClose={() => {
          setModalSelectBox(false);
        }}
      />

      <ModalImagePicker
        visible={modalImagePickerType}
        onClose={() => {
          setModalImagePickerType('');
        }}
        onSelected={callback => {
          if (callback.base64) {
            if (typeof modalImagePickerType === 'number') {
              let newSkill = [...skillAndEducations];
              newSkill[0][modalImagePickerType].imageBase64 = callback.base64;
              newSkill[0][modalImagePickerType].mime = callback.type;
              setSkillAndEducations(newSkill);
            }

            switch (modalImagePickerType) {
              case 'NPWP':
                setNpwpImage(callback.base64);
                setNpwpMimeImage(callback.type);
                break;
              case 'PROFILE_BUSINESS':
                setThumbImageBusiness(callback.base64);
                setMimeImageBusiness(callback.type);
                break;
              case 'PROFILE_USER':
                setThumbImageProfile(callback.base64);
                setMimeImageProfile(callback.type);
                break;
              case 'SIUP':
                setSiupImage(callback.base64);
                setSiupMimeImage(callback.type);
                break;
              case 'NIB':
                setNibImage(callback.base64);
                setNibMimeImage(callback.type);
                break;
            }
          }

          setModalImagePickerType('');
        }}
      />

      <ModalActions
        visible={modalEducationLevel}
        data={educationLevels}
        onPress={(val) => {
          setEducationLevel(val);
          setModalEducationLevel(false);
        }}
        onClose={() => {
          setModalEducationLevel(false);
        }}
      />
    </Scaffold>
  );
};

export default RegisterSectionScreen;
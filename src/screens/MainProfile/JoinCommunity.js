import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, SafeAreaView, TouchableOpacity, Image, Keyboard, BackHandler, useWindowDimensions } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import {
    Header,
    Text,
    Popup, usePopup,
    Loading, useLoading,
    Submit,
    useColor,
    Scaffold
} from '@src/components';

import { queryJoinCommunity } from 'src/lib/query';
import ModalSelectChapter from 'src/components/Modal/ModalSelectChapter'
import validate from '@src/lib/validate';
import Client from '@src/lib/apollo';
import ModalActions from 'src/components/Modal/ModalActions';
import { accessClient } from 'src/utils/access_client';
import { Container, Divider } from 'src/styled';
import Clipboard from '@react-native-community/clipboard';
import { fetchCarTypeListing } from 'src/api/community';
import FormSelect from 'src/components/FormSelect';
import ModalActionScroll from 'src/components/Modal/ModalActionScroll';

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

const CustomTouch = Styled(TouchableOpacity)`
    backgroundColor: transparent;
`;

const options = {
    mediaType: 'photo',
    maxWidth: 640,
    maxHeight: 640,
    quality: 1,
    includeBase64: true,
}

const JoinCommunity = ({ navigation, route }) => {
    const { height } = useWindowDimensions();
    const { Color } = useColor();

    const modalSelectChapterRef = useRef();

    const [loadingProps, showLoading, hideLoading] = useLoading();
    const [popupProps, showPopup] = usePopup();

    const [userData, setUserData] = useState({
        carColor: '',
        carYear: "",
        carIdentity: '',
        reason: '',
        note: '',
        chapterId: "",
        selfiePhoto: '',
        carPhotoMain: '',
        carPhotoFront: '',
        carPhotoSide: '',
        carPhotoBack: '',
        simPhoto: '',
        stnkPhoto: '',
        transactionProof: '',
    });

    const [error, setError] = useState({
        carColor: null,
        carYear: null,
        carIdentity: null,
        reason: null,
        note: null,
        selfiePhoto: '',
        carPhotoMain: '',
        carPhotoFront: '',
        carPhotoSide: '',
        carPhotoBack: '',
        simPhoto: '',
        stnkPhoto: '',
        transactionProof: '',
    });

    const isValueError = (name) => {
        const newError = validate(name, userData[name]);
        setError({ ...error, [name]: newError });
    }

    const onChangeUserData = (key, val) => {
        setUserData({ ...userData, [key]: val });
    };

    const [selectedChapter, setSelectedChapter] = useState();
    const [modalAddPhoto, setModalAddPhoto] = useState(false);
    const [modalNumberPhoto, setModalNumberPhoto] = useState(0);

    const [listCarType, setListCarType] = useState([]);
    const [selectedCarType, setSelectedCarType] = useState();
    const [modalCarType, setModalCarType] = useState(false);

    const [selectedMerchandiseSize, setSelectedMerchandiseSize] = useState(merchandiseSize[0]);
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async() => {
        const resultCar = await fetchCarTypeListing();
        if (resultCar.status) {
            setListCarType(resultCar.data)
        }
    }

    const copyToClipboard = (item) => {
        Clipboard.setString(item);
        showPopup('Nomor berhasil disalin', 'info');
    }

    const onSubmit = () => {
        Keyboard.dismiss();

        if (userData.chapterId === '') {
            showPopup('Silahkan isi domisili terlebih dulu', 'warning');
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

        showLoading();

        let variables = {
            body: {
                carType: selectedCarType.name,
                carColor: userData.carColor,
                carYear: userData.carYear,
                carIdentity: userData.carIdentity,
                reason: userData.reason,
                chapterId: selectedChapter.community_id,
                selfiePhoto: 'data:image/png;base64,' + thumbImage6,
                carPhotoMain: 'data:image/png;base64,' + thumbImage,
                carPhotoFront: 'data:image/png;base64,' + thumbImage2,
                carPhotoSide: 'data:image/png;base64,' + thumbImage3,
                carPhotoBack: 'data:image/png;base64,' + thumbImage4,
                simPhoto: 'data:image/png;base64,' + thumbImage7,
                stnkPhoto: 'data:image/png;base64,' + thumbImage8,
                transactionProof: 'data:image/png;base64,' + thumbImage5,
                note: userData.note,
            },
        };

        console.log('variables', variables);

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

    return (
        <Scaffold
            headerTitle='Gabung Komunitas'
            loadingProps={loadingProps}
            popupProps={popupProps}
        >
            <ScrollView>
                <View style={{paddingTop: 35, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: Color.grayLight, marginRight: 8}}>
                        <Text type='bold' size={24} align='left' color={Color.primary}>1</Text>
                    </View>
                    <View>
                        <Text size={14} color={Color.text} align='left'>Informasi Data Diri</Text>
                        <Text size={10} color={Color.gray} align='left'>Masukan informasi untuk gabung ke komunitas</Text>
                    </View>
                </View>

                {accessClient.isRRID && <Container paddingHorizontal={16}>
                    <Text size={12} align='left'>
                        Form registrasi untuk member RR-ID
                    </Text>
                    <Text size={12} align='left'>
                        Untuk starter pack yang didapat:
                    </Text>
                    <Divider height={8} />
                    <Text size={12} align='left'>
                        - 3 sticker (Logo rrid, nopung, Raize Rocky Indonesia)
                    </Text>
                    <Text size={12} align='left'>
                        - 1 kemeja
                    </Text>
                    <Text size={12} align='left'>
                        - 1 KTA (e-money saldo Rp. 0)
                    </Text>
                    <Divider height={8} />
                    <Text size={12} align='left'>
                        Note: Ongkir akan dikabari setelah starter pack siap kirim
                    </Text>
                    <Divider />
                    <Text size={12} align='left'>
                        Untuk detail CP:
                    </Text>
                    <Divider height={4} />
                    <TouchableOpacity
                        onPress={() => copyToClipboard('082111057057')}
                    >
                        <Text size={12} align='left'>
                            Vico       082 111 057 057{'    '}
                            <Ionicons name='copy-outline' size={14} color={Color.info} />
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => copyToClipboard('081320476999')}
                    >
                        <Text size={12} align='left'>
                            Marco    081 320 476 999{'  '}
                            <Ionicons name='copy-outline' size={14} color={Color.info} />
                        </Text>
                    </TouchableOpacity>
                </Container>}

                <View style={{backgroundColor: Color.theme, paddingBottom: 16}}>
                    <View style={{paddingHorizontal: 16, paddingTop: 16}}>
                        <CustomTouch onPress={() => modalSelectChapterRef.current.open()}>
                            <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border}}>
                                <LabelInput>
                                    <Text size={12} letterSpacing={0.08} style={{opacity: 0.6}}>Domisili</Text>
                                </LabelInput>
                                <View style={{height: 34, paddingRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Text size={14} style={{marginTop: 2}}>{userData.chapterId || 'Pilih Domisili'}</Text>
                                    <Ionicons name='chevron-down-outline' color={Color.text} />
                                </View>
                            </View>
                        </CustomTouch>
                    </View>

                    <FormSelect
                        label='Tipe Mobil'
                        placeholder='Pilih Tipe'
                        value={selectedCarType ? selectedCarType.name : null}
                        onPress={() => setModalCarType(true)}
                    />

                    <View style={{paddingHorizontal: 16}}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border}}>
                            <LabelInput>
                                <Text size={10} letterSpacing={0.08} style={{opacity: 0.6}}>Warna Mobil</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput 
                                    placeholder='Merah'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('carColor', text)}
                                    selectionColor={Color.text}
                                    value={userData.carColor}
                                    onBlur={() => isValueError('carColor')}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingTop: 16}}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border}}>
                            <LabelInput>
                                <Text size={10} letterSpacing={0.08} style={{opacity: 0.6}}>Tahun Mobil</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput 
                                    placeholder='1990'
                                    keyboardType='numeric'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('carYear', text)}
                                    selectionColor={Color.text}
                                    value={userData.carYear}
                                    onBlur={() => isValueError('carYear')}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingTop: 16}}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border}}>
                            <LabelInput>
                                <Text size={10} letterSpacing={0.08} style={{opacity: 0.6}}>Plat Nomor</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput 
                                    placeholder='B 1234 ABC'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('carIdentity', text)}
                                    selectionColor={Color.text}
                                    value={userData.carIdentity}
                                    onBlur={() => isValueError('carIdentity')}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingTop: 16}}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border, height: 90}}>
                            <LabelInput>
                                <Text size={10} letterSpacing={0.08} style={{opacity: 0.6}}>Alasan Gabung</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput
                                    placeholder='Tuliskan sesuatu...'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('reason', text)}
                                    selectionColor={Color.text}
                                    value={userData.reason}
                                    onBlur={() => isValueError('reason')}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, paddingTop: 16}}>
                        <View style={{marginTop: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, borderColor: Color.border, height: 90}}>
                            <LabelInput>
                                <Text size={10} letterSpacing={0.08} style={{opacity: 0.6}}>Deskripsi</Text>
                            </LabelInput>
                            <EmailRoundedView>
                                <CustomTextInput
                                    placeholder='Tuliskan sesuatu...'
                                    keyboardType='default'
                                    placeholderTextColor={Color.gray}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={false}
                                    onChangeText={(text) => onChangeUserData('note', text)}
                                    selectionColor={Color.text}
                                    value={userData.note}
                                    onBlur={() => isValueError('note')}
                                    style={{color: Color.text}}
                                />
                            </EmailRoundedView>
                        </View>
                    </View>

                    <FormSelect
                        label='Ukuran Kaos'
                        placeholder='Pilih ukuran'
                        value={selectedMerchandiseSize ? selectedMerchandiseSize.name : null}
                        onPress={() => setModalMerchandiseSize(true)}
                    />

                    <View style={{paddingTop: 16, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: Color.grayLight, marginRight: 8}}>
                            <Text type='bold' size={24} align='left' color={Color.primary}>2</Text>
                        </View>
                        <View>
                            <Text size={14} color={Color.text} align='left'>Unggah Foto</Text>
                            <Text size={10} color={Color.gray} align='left'>Unggah foto untuk memenuhi persyaratan</Text>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: 16, marginTop: 16}}>
                        <Text size={11} color={Color.text} align='left' >Foto Selfie</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalAddPhoto(true);
                                setModalNumberPhoto(6);
                            }}
                            style={{width: 120, height: 120, borderRadius: 16, marginVertical: 10, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={32} style={{marginBottom: 4}} color={Color.gray} />
                            <Text size={10} color={Color.gray}>Tambah Foto</Text>
                        </TouchableOpacity>
                        <Text size={11} color={Color.gray} align='left'>Foto selfie dengan jelas dan tidak blur</Text>
                    </View>


                    {thumbImage6 !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, paddingHorizontal: 16, marginTop: 10}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage6};base64,${thumbImage6}` }}
                        />
                    </TouchableOpacity>}

                    <View style={{paddingHorizontal: 16, marginTop: 16}}>
                        <Text size={11} color={Color.text} align='left' >Foto Mobil</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalAddPhoto(true);
                                setModalNumberPhoto(1);
                            }}
                            style={{width: 120, height: 120, borderRadius: 16, marginVertical: 10, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={32} style={{marginBottom: 4}} color={Color.gray} />
                            <Text size={10} color={Color.gray}>Tambah Foto</Text>
                        </TouchableOpacity>
                        <Text size={11} color={Color.gray} align='left' >Foto mobil dengan jelas dan tidak blur</Text>
                    </View>


                    {thumbImage !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, paddingHorizontal: 16, marginTop: 10}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage};base64,${thumbImage}` }}
                        />
                    </TouchableOpacity>}

                    <View style={{paddingHorizontal: 16, marginTop: 16}}>
                        <Text size={11} color={Color.text} align='left' >Foto Bagian Depan Mobil</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalAddPhoto(true);
                                setModalNumberPhoto(2);
                            }}
                            style={{width: 120, height: 120, borderRadius: 16, marginVertical: 10, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={32} style={{marginBottom: 4}} color={Color.gray} />
                            <Text size={10} color={Color.gray}>Tambah Foto</Text>
                        </TouchableOpacity>
                        <Text size={11} color={Color.gray} align='left' >Foto tampak depan mobilmu dengan jelas</Text>
                    </View>

                    {thumbImage2 !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, paddingHorizontal: 16, marginTop: 10}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage2};base64,${thumbImage2}` }}
                        />
                    </TouchableOpacity>}

                    <View style={{paddingHorizontal: 16, marginTop: 16}}>
                        <Text size={11} color={Color.text} align='left' >Foto Bagian Samping Mobil</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalAddPhoto(true);
                                setModalNumberPhoto(3);
                            }}
                            style={{width: 120, height: 120, borderRadius: 16, marginVertical: 10, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={32} style={{marginBottom: 4}} color={Color.gray} />
                            <Text size={10} color={Color.gray}>Tambah Foto</Text>
                        </TouchableOpacity>
                        <Text size={11} color={Color.gray} align='left' >Foto tampak samping mobilmu dengan jelas</Text>
                    </View>

                    {thumbImage3 !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, paddingHorizontal: 16, marginTop: 10}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage3};base64,${thumbImage3}` }}
                        />
                    </TouchableOpacity>}

                    <View style={{paddingHorizontal: 16, marginTop: 16}}>
                        <Text size={11} color={Color.text} align='left' >Foto Bagian Belakang Mobil</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalAddPhoto(true);
                                setModalNumberPhoto(4);
                            }}
                            style={{width: 120, height: 120, borderRadius: 16, marginVertical: 10, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={32} style={{marginBottom: 4}} color={Color.gray} />
                            <Text size={10} color={Color.gray}>Tambah Foto</Text>
                        </TouchableOpacity>
                        <Text size={11} color={Color.gray} align='left' >Foto tampak belakang mobilmu dengan jelas</Text>
                    </View>

                    {thumbImage4 !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, paddingHorizontal: 16, marginTop: 10}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage4};base64,${thumbImage4}` }}
                        />
                    </TouchableOpacity>}

                    <View style={{paddingHorizontal: 16, marginTop: 16}}>
                        <Text size={11} color={Color.text} align='left' >Foto SIM</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalAddPhoto(true);
                                setModalNumberPhoto(7);
                            }}
                            style={{width: 120, height: 120, borderRadius: 16, marginVertical: 10, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={32} style={{marginBottom: 4}} color={Color.gray} />
                            <Text size={10} color={Color.gray}>Tambah Foto</Text>
                        </TouchableOpacity>
                        <Text size={11} color={Color.gray} align='left' >Foto SIM anda dengan jelas</Text>
                    </View>


                    {thumbImage7 !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, paddingHorizontal: 16, marginTop: 10}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage7};base64,${thumbImage7}` }}
                        />
                    </TouchableOpacity>}

                    <View style={{paddingHorizontal: 16, marginTop: 16}}>
                        <Text size={11} color={Color.text} align='left' >Foto STNK</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalAddPhoto(true);
                                setModalNumberPhoto(8);
                            }}
                            style={{width: 120, height: 120, borderRadius: 16, marginVertical: 10, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={32} style={{marginBottom: 4}} color={Color.gray} />
                            <Text size={10} color={Color.gray}>Tambah Foto</Text>
                        </TouchableOpacity>
                        <Text size={11} color={Color.gray} align='left' >Foto STNK anda dengan jelas</Text>
                    </View>


                    {thumbImage8 !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, paddingHorizontal: 16, marginTop: 10}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage8};base64,${thumbImage8}` }}
                        />
                    </TouchableOpacity>}

                    <View style={{paddingHorizontal: 16, marginTop: 16}}>
                        <Text size={11} color={Color.text} align='left'>Foto Bukti Pembayaran</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalAddPhoto(true);
                                setModalNumberPhoto(5);
                            }}
                            style={{width: 120, height: 120, borderRadius: 16, marginVertical: 10, borderWidth: 3, borderStyle: "dashed", borderColor: Color.border, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <Feather name='camera' size={32} style={{marginBottom: 4}} color={Color.gray} />
                            <Text size={10} color={Color.gray}>Tambah Foto</Text>
                        </TouchableOpacity>
                        <Text size={11} color={Color.gray} align='left'>Foto bukti pembayaranmu dengan jelas</Text>
                        {/* nomor rek khusus rrid */}
                        {accessClient.isRRID && <View>
                            <Divider height={10} />
                            <Text size={11} color={Color.gray} align='left'>Mohon agar ditransfer ke bank{' <'}
                            <Text size={11} color={Color.gray} type='bold'>BCA DIGITAL</Text>{'> '}
                            <Text size={11} color={Color.gray} type='bold'>001120211113 an Yokhanan Adi Prasetya</Text>{' '}sebesar Rp255.000.</Text>
                            <Divider height={8} />
                            <TouchableOpacity
                                onPress={() => {
                                    copyToClipboard('001120211113');
                                }}
                            >
                                <Text size={12} color={Color.gray}>
                                    Salin Rekening{' '}
                                    <Ionicons name='copy-outline' size={14} color={Color.info} />
                                </Text>
                            </TouchableOpacity>
                            <Divider height={8} />
                        </View>}
                    </View>

                    {thumbImage5 !== '' && <TouchableOpacity
                        onPress={() => {}}
                        style={{width: '100%', height: height / 3, borderRadius: 4, paddingHorizontal: 16, marginTop: 10}}
                    >
                        <Image
                            style={{height: '100%', aspectRatio: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                            source={{ uri: `data:${mimeImage5};base64,${thumbImage5}` }}
                        />
                    </TouchableOpacity>}
                </View>
            </ScrollView>

            <Submit
                buttonLabel='Gabung'
                buttonColor={Color.primary}
                type='bottomSingleButton'
                buttonBorderTopWidth={0}
                onPress={()=>{
                    onSubmit();
                }}
            />

            <ModalSelectChapter
                ref={modalSelectChapterRef}
                selected={selectedChapter}
                onPress={(e) => {
                    onChangeUserData('chapterId', e.name);
                    setSelectedChapter(e);
                    modalSelectChapterRef.current.close();
                }}
            />

            <ModalActionScroll
                visible={modalCarType}
                onClose={() => {
                    setModalCarType(false);
                }}
                data={listCarType}
                onPress={(val) => {
                    setSelectedCarType(val);
                    setModalCarType(false);
                }}
            />

            <ModalActions
                visible={modalMerchandiseSize}
                onClose={() => {
                    setModalMerchandiseSize(false);
                }}
                data={merchandiseSize}
                onPress={(val) => {
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
                            launchCamera(options, (callback) => {
                                if (callback.didCancel) {}
                                else if (callback.errorCode) {}
                                else {
                                    onPhotoSelected({
                                        base64: callback.base64,
                                        type: callback.type
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
                            launchImageLibrary(options, (callback) => {
                                if (callback.didCancel) {}
                                else if (callback.errorCode) {}
                                else {
                                    onPhotoSelected({
                                        base64: callback.base64,
                                        type: callback.type
                                    });
                                }

                                setModalAddPhoto(false);
                            });
                        },
                    }
                ]}
            />
        </Scaffold>
    )
}

export default JoinCommunity;
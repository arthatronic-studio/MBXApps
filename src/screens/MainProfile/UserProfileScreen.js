import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, ImageBackground, ActivityIndicator, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { useDispatch, useSelector } from 'react-redux';
// import Orientation from 'react-native-orientation-locker';

import Text from '@src/components/Text';
import Color from '@src/components/Color';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Header from '@src/components/Header';
// import CardEbook from '@src/components/Card/CardEbook';
// import YoutubeVideoPlayer from '@src/components/Modal/YoutubeVideoPlayer';
// import { MusicPlayer } from '@src/components/Modal/MusicPlayer';
import ModalListAction from '@src/components/Modal/ModalListAction';
import { Alert } from '@src/components/Modal/Alert';
import Popup, { usePopup } from '@src/components/Modal/Popup';
import Loading, { useLoading } from '@src/components/Modal/Loading';
// import { getObjSubCategoryByCode } from '../../utils/rawSubCategory';
// import { trackPlayerPlugAndPlay } from '../../utils/track-player-plug-and-play';
import Client from '@src/lib/apollo';
import { queryProductManage, queryContentUserProfile, queryContentUserProduct } from '@src/lib/query';
import { Scaffold } from 'src/components';
import { ScrollView } from 'react-native-gesture-handler';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import { Container } from 'src/styled';

const UserProfileScreen = ({ navigation, route }) => {
    // params
    const { params } = route;

    // state
    const [userContent, setUserContent] = useState();
    
    // const dispatch = useDispatch();

    const user = useSelector(
        state => state['user.auth'].login.user
    )
    const playNow = useSelector(
        state => state['playNow']
    );

    const [itemCasting, setItemCasting] = useState({
        data: [],
        loading: true,
        page: 0,
        loadNext: true,
    });
    const [selectedCasting, setSelectedCasting] = useState();
    const [modalYoutubeVideoPlayer, setModalYoutubeVideoPlayer] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const musicPlayerRef = useRef();
    const modalListActionRef = useRef();

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();

    // variable
    const isDirector = user && !user.guest && user.isDirector === 1;

    const setStateItemCasting = (obj) => {
        setItemCasting({
            ...itemCasting,
            ...obj,
        });
    }

    useEffect(() => {
        getContentUserProfile();
    }, []);

    // useEffect(() => {
    //     if (!selectedCasting) {
    //         Orientation.lockToPortrait();
    //     }
    // }, [selectedCasting])

    useEffect(() => {
        if (itemCasting.data.length > 0) {
            setStateItemCasting({
                data: [],
                loading: true,
                page: 0,
                loadNext: true,
            })
        }
    }, [route]);

    useEffect(() => {
        if (itemCasting.page !== -1) {
            getContentMyProduct();
        }
    }, [itemCasting.loadNext])

    const getContentMyProduct = () => {
        const variables = {
            page: itemCasting.page + 1,
            itemPerPage: 10,
            userProfileId: params.userId,
        };

        Client.query({
            query: queryContentUserProduct,
            variables,
        })
        .then((res) => {
            const data = res.data.contentUserProduct;
            console.log(res, 'ressss');

            setStateItemCasting({
                loading: false,
                data: itemCasting.data.concat(data),
                page: data.length === 10 ? itemCasting.page + 1 : -1,
                loadNext: false,
            });
        })
        .catch((err) => {
            console.log(err, 'errrrr');
            setStateItemCasting({
                loading: false,
                page: -1,
                loadNext: false,
            });
        })
    }

    const getContentUserProfile = async() => {
        const variables = {
            userProfileId: params.userId,
        };

        const res = await Client.query({
            query: queryContentUserProfile,
            variables,
        });

        const data = res.data.contentUserProfile;
        console.log(data, 'data user');
        
        if (data) {
            setUserContent(data);
        }
    }

    const onSubmitProductUpdate = (item, status) => {
        if (!item) return;

        showLoading();

        const labelPopup =
            status === 'REMOVE' ? ' menghapus konten' :
            status === 'PRIVATE' ? ' mengubah ke Privasi' : ' mengubah ke Publik';

        const variables = {
            products: [{
                code: item.code,
                method: 'UPDATE',
                status,
            }]
        };

        Client.query({
            query: queryProductManage,
            variables,
        })
        .then((res) => {
            const successDelete = res.data.contentProductManage.length > 0;

            hideLoading();
            showPopup(`${successDelete ? 'Berhasil' : 'Gagal'} ${labelPopup}`, `${successDelete ? 'success' : 'error'}`);

            setItemCasting({
                data: [],
                loading: true,
                page: 0,
                loadNext: true,
            });
        })
        .catch((err) => {
            console.log(err, 'errrrr delete');
            hideLoading();
            showPopup(`Terjadi kesalahan saat ${labelPopup}`, 'error');
        });
    }

    const onChangeRootData = (id, type) => {
        const selected = itemCasting.data.filter((e) => e.id === id)[0];

        if (selected) {
            const idx = itemCasting.data.indexOf(selectedCasting);
            if (idx !== -1) {
                if (type === 'like') {
                    selected.im_like = !selected.im_like;
                    selected.like = selected.im_like ? selected.like + 1 : selected.like - 1;
                } else {
                    selected.comment = selected.comment + 1;
                }

                const newItemCasting = itemCasting;
                newItemCasting.data[idx] = selected;
                setItemCasting(newItemCasting);
            }
        }
    }

    const renderImageView = (item, index) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedCasting(item);
                    setModalYoutubeVideoPlayer(true);
                }}
                style={{paddingHorizontal: 6, paddingBottom: 12, width: '50%'}}
            >
                <ImageBackground
                    source={item.image ? {uri: item.image} : noImage}
                    style={{width: '100%', aspectRatio: 1, justifyContent: 'flex-end', alignItems: 'flex-start', borderRadius: 4}}
                    imageStyle={{borderRadius: 8}}
                >
                    {item.status === 'PRIVATE' && <View style={{position: 'absolute', top: 4, left: 4, height: 16, width: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.theme}}>
                        <SimpleLineIcons
                            size={12}
                            name='lock'
                            color={Color.text}
                            style={{marginBottom: 1.5}}
                        />
                    </View>}

                    {/* <View style={{position: 'absolute', top: 4, right: 4, height: 16, width: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.theme}}>
                        <MaterialCommunityIcons
                            size={16}
                            name={getObjSubCategoryByCode(item.productSubCategory).emoticon}
                            color={getObjSubCategoryByCode(item.productSubCategory).color}
                        />
                    </View> */}

                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCasting(item);
                            modalListActionRef.current.open();
                        }}
                        style={{position: 'absolute', bottom: 4, right: 4, height: 20, width: 20, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.overflow}}
                    >
                        <MaterialCommunityIcons
                            size={16}
                            name='dots-vertical'
                            color={Color.semiwhite}
                        />
                    </TouchableOpacity>
                </ImageBackground>

                <View style={{width: '100%', marginTop: 4}}>
                    <Text size={12} type='semibold' align='left' numberOfLines={2}>{item ? item.productName : ''}</Text>
                </View>

                <View style={{width: '100%', marginTop: 2, flexDirection: 'row', alignItems: 'center'}}>
                    <SimpleLineIcons name='emotsmile' size={8} color={Color.border} />
                    <Text size={8} color={Color.border} style={{marginLeft: 2}}>{item.like ? item.like : 0}</Text>
                        <View style={{width: 4}} />
                    <MaterialIcons name='comment' size={8} color={Color.border} />
                    <Text size={8} color={Color.border} style={{marginLeft: 2}}>{item.comment ? item.comment : 0}</Text>
                        <View style={{width: 4}} />
                    <AntDesign name='notification' size={8} color={Color.border} style={{transform: [{ rotateY: '180deg' }]}} />
                    <Text size={8} color={Color.border} style={{marginLeft: 2}}>{item.director_like ? item.director_like : 0}</Text>
                        <View style={{width: 4}} />
                    <Ionicons name='eye' size={8} color={Color.border} />
                    <Text size={8} color={Color.border} style={{marginLeft: 2}}>{item.view ? item.view : 0}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const header1 = () => {
        if (!userContent) return <View />;

        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16}}>
                <View style={{flex: 4, flexDirection: 'row', alignItems: 'center'}}>
                    <View>
                        <Ionicons name='person-circle' color={Color.primary} size={56} />
                    </View>
                    <View style={{marginLeft: 8}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text size={12} align='left' letterSpacing={0.18}>
                                {userContent.firstName} {userContent.lastName}
                            </Text>
                            {userContent.isDirector === 1 &&
                                <Octicons
                                    name='verified'
                                    color={Color.info}
                                    size={14}
                                    style={{transform: [{ rotateY: '0deg' }]}}
                                />
                            }
                        </View>
                        <Text size={10} align='left' letterSpacing={0.18} style={{marginTop: 2, opacity: 0.6}}>
                            {userContent.userName || userContent.email}
                        </Text>
                    </View>
                </View>
                {/* hide chat */}
                {/* <View style={{flex: 1.5, paddingLeft: 8}}>
                    <TouchableOpacity
                        onPress={() => {

                        }}
                        style={{width: '100%', height: 35, borderWidth: 1, borderColor: Color.secondary, borderRadius: 4, justifyContent: 'center'}}
                    >
                        <Text size={10} color={Color.secondary}>Chat</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        )
    }

    const header2 = () => {
        return (
            <View style={{width: '100%', height: 30, flexDirection: 'row', backgroundColor: Color.theme, marginBottom: 8}}>
                <TouchableOpacity onPress={() => setActiveTab(0)} style={{width: '33.33%', height: '100%', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderColor: activeTab === 0 ? Color.secondary : Color.gray, paddingBottom: 8}}>
                    {/* <Text size={12} color={activeTab === 0 ? Color.secondary : Color.bordered}>Video</Text> */}
                    <MaterialCommunityIcons name='movie-open' color={activeTab === 0 ? Color.secondary : Color.gray} size={16} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab(1)} style={{width: '33.33%', height: '100%', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderColor: activeTab === 1 ? Color.secondary : Color.gray, paddingBottom: 8}}>
                    {/* <Text size={12} color={activeTab === 1 ? Color.secondary : Color.bordered}>Suara</Text> */}
                    <Ionicons name='ios-musical-notes-outline' color={activeTab === 1 ? Color.secondary : Color.gray} size={16} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab(2)} style={{width: '33.33%', height: '100%', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderColor: activeTab === 2 ? Color.secondary : Color.gray, paddingBottom: 8}}>
                    {/* <Text size={12} color={activeTab === 2 ? Color.secondary : Color.bordered}>Buku</Text> */}
                    <Ionicons name='ios-book-outline' color={activeTab === 2 ? Color.secondary : Color.gray} size={16} />
                </TouchableOpacity>
            </View>
        )
    }

    if (itemCasting.data.length > 0) {
        // itemCasting.data.forEach((e) => {
        //     if (e.videoFilename.includes('.mp4')) {
        //         dataVideo.push(e);
        //     } else if (e.videoFilename.includes('.mp3')) {
        //         dataMusic.push(e);
        //     } else {
        //         dataBook.push(e);
        //     }
        // })
    }

    console.log(userContent, 'userContent');
    
    return (
        <Scaffold
            fallback={!userContent}
            header={
                <Header
                    title='Profile'
                    centerTitle={false}
                />
            }
        >
            <ScrollView>
                {userContent &&
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16}}>
                        <View style={{flex: 4, flexDirection: 'row', alignItems: 'center'}}>
                            <View>
                                <Ionicons name='person-circle' color={Color.primary} size={56} />
                            </View>
                            <View style={{marginLeft: 8}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text size={12} align='left' letterSpacing={0.18}>
                                        {userContent.firstName} {userContent.lastName}
                                    </Text>
                                    {userContent.isDirector === 1 &&
                                        <Octicons
                                            name='verified'
                                            color={Color.info}
                                            size={14}
                                            style={{transform: [{ rotateY: '0deg' }]}}
                                        />
                                    }
                                </View>
                                <Text size={10} align='left' letterSpacing={0.18} style={{marginTop: 2, opacity: 0.6}}>
                                    {userContent.organizationId ? 'Anggota ' + userContent.organizationName : 'Belum Terdaftar'}
                                </Text>
                            </View>
                        </View>
                        {/* hide chat */}
                        {/* <View style={{flex: 1.5, paddingLeft: 8}}>
                            <TouchableOpacity
                                onPress={() => {

                                }}
                                style={{width: '100%', height: 35, borderWidth: 1, borderColor: Color.secondary, borderRadius: 4, justifyContent: 'center'}}
                            >
                                <Text size={10} color={Color.secondary}>Chat</Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                }

                <Container paddingHorizontal={16} marginBottom={16}>
                    <Text align='left' size={18} type='semibold'>Konten</Text>
                </Container>

                <HighlightContentProduct
                    userProfileId={params.userId}
                    productCategory='EMERGENCY'
                    name='Help Me'
                    title='Help Me'
                    nav='EmergencyScreen'
                    refresh={false}
                />

                <HighlightContentProduct
                    userProfileId={params.userId}
                    productCategory='POSTING'
                    name='Artikel'
                    title='Postingan Artikel'
                    nav='NewsScreen'
                    refresh={false}
                />

                <HighlightContentProduct
                    userProfileId={params.userId}
                    productCategory='NEARBY_PLACE'
                    name='Tempat'
                    title='Tempat Favorit'
                    nav='PlaceScreen'
                    refresh={false}
                />

                <HighlightContentProduct
                    userProfileId={params.userId}
                    productCategory='EVENT'
                    name='Event'
                    title='Event Terbaru'
                    nav='EventScreen'
                    refresh={false}
                />
                
                <HighlightContentProduct
                    userProfileId={params.userId}
                    productCategory='JOBS'
                    name='Loker'
                    title='Lowongan Pekerjaan'
                    nav='JobScreen'
                    refresh={false}
                />

                <HighlightContentProduct
                    userProfileId={params.userId}
                    productCategory='YOUTUBE_VIDEO'
                    name='Live'
                    title='Sedang Berlangsung'
                    nav='YoutubeScreen'
                    refresh={false}
                />

                <HighlightContentProduct
                    userProfileId={params.userId}
                    productCategory='NEWEST_VIDEO'
                    name='Video'
                    title='Video Terbaru'
                    nav='VideoScreen'
                    refresh={false}
                />
            </ScrollView>

            <Popup {...popupProps} />

            <Loading { ...loadingProps } />

            {/* hide options */}
            {/* <ModalListAction
                ref={modalListActionRef}
                data={[
                    {
                        id: 'edit',
                        name: 'Edit',
                        onPress: () => {
                            navigation.navigate('EditContentScreen', { item: selectedCasting, prevScreen: 'Profile' });
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 'change',
                        name: `Ubah ke ${selectedCasting && selectedCasting.status === 'PUBLISH' ? 'Privasi' : 'Publik'}`,
                        onPress: () => {
                            Alert(
                                'Ubah',
                                `Apakah Anda yakin mengubah ke ${selectedCasting && selectedCasting.status === 'PUBLISH' ? 'Privasi' : 'Publik'}?`,
                                () => onSubmitProductUpdate(selectedCasting, selectedCasting.status === 'PUBLISH' ? 'PRIVATE' : 'PUBLISH')
                            );
                            modalListActionRef.current.close();
                        },
                    },
                    {
                        id: 'delete',
                        name: 'Hapus',
                        color: Color.error,
                        onPress: () => {
                            Alert(
                                'Hapus',
                                'Apakah Anda yakin menghapus konten?',
                                () => onSubmitProductUpdate(selectedCasting, 'REMOVE')
                            );
                            modalListActionRef.current.close();
                        },
                    }
                ]}
            /> */}
        </Scaffold>
    )
}

export default UserProfileScreen;
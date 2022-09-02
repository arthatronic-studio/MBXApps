import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Image,
  useWindowDimensions,
  Linking,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {useDispatch, useSelector} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import messaging from '@react-native-firebase/messaging';

import {
  Alert,
  Text,
  Row,
  Col,
  HeaderBig,
  useColor,
  Scaffold,
  useLoading,
  Button,
} from '@src/components';
import {redirectTo} from '@src/utils';
import {shadowStyle} from '@src/styles';
import {iconSplash, imageCardOrnament} from '@assets/images';
import {Box, Circle, Container, Divider, Line} from 'src/styled';
import Clipboard from '@react-native-community/clipboard';
import ModalinputCode from 'src/components/ModalInputCode';
import ModalCardMember from 'src/components/ModalCardMember';
import Client from '@src/lib/apollo';
import { queryOrganizationMemberManage } from '@src/lib/query/organization';
import { getCurrentUserProfile } from 'src/state/actions/user/auth';
import { accessClient } from 'src/utils/access_client';
import { fetchCommunityMemberCheck } from 'src/api/community';
import ModalActions from 'src/components/Modal/ModalActions';
import Axios from 'axios';
import { initSocket } from 'src/api-socket/currentSocket';

const MainProfile = ({navigation, route}) => {
  const currentSocket = initSocket();

  const [modalVirtual, setModalVirtual] = useState(false);
  const [modalInputCode, setModalInputCode] = useState(false);
  const [modalCardMember, setModalCardMember] = useState(false);
  const [modalJoinCommunity, setModalJoinCommunity] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [responseMemberManage, setResponseMemberManage] = useState({
    data: null,
    success: false,
    message: '',
  });
  const [memberCheck, setMemberCheck] = useState({
    status: true,
    message: '',
  })
  const [myRoomIds, setMyRoomIds] = useState([]);

  const dispatch = useDispatch();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const user = useSelector(state => state['user.auth'].login.user);
  const userToken = useSelector(state => state['user.auth'].data);
  const auth = useSelector(state => state['auth']);
  const localStoragSetting = useSelector(state => state['setting']);

  const showDebug = localStoragSetting && localStoragSetting.showDebug ? true : false;

  console.log('user', useSelector(state => state['user.auth']));

  const {Color} = useColor();
  const {width} = useWindowDimensions();

  useEffect(() => {
    if (refreshing) {
      setRefreshing(false);
      dispatch(getCurrentUserProfile());
    }
  }, [refreshing]);

  useEffect(() => {
    // hit cuurent user profile
    dispatch(getCurrentUserProfile());

    fetchData();

    // currentSocket.emit('list_my_room_ids');
    //   currentSocket.on('list_my_room_ids', (res) => {
    //     setMyRoomIds(res);
    //   });
  }, []);

  useEffect(() => {
    if (route.params && route.params.refresh) {
      navigation.setParams({refresh: false});
    }
  }, [route]);

  const fetchData = async() => {
    const result = await fetchCommunityMemberCheck();
    if (result.status) {
      setMemberCheck({ ...memberCheck, ...result.data });
    }
  }

  const onPressExit = () => {
    Alert('Logout', 'Apakah Anda yakin akan logout?', () => onPressLogout(false));
  };

  const onPressLogout = () => {
    dispatch({ type: 'AUTH.CLEAR' });
    dispatch({type: 'USER.LOGOUT'});
    redirectTo('LoginScreen');

    // dispatch({type: 'ARTICLE.CLEAR_HISTORY'});
    // currentSocket.disconnect();
  };

  const fetchOrganizationMemberManage = () => {
    // const variables = {
    //   "userId": user.userId,
    //   "organizationInitialCode": accessClient.InitialCode,
    //   "type": "INSERT"
    // };

    // console.log(variables);

    Client.mutate({
      mutation: queryOrganizationMemberManage,
      // variables,
    }).then((res) => {
      console.log('test', res);

      setModalInputCode(false);

      const data = res.data.organizationMemberManage;

      setResponseMemberManage({
        data: data,
        success: data ? true : false,
        message: '',
      });

      showLoading(
        data ? 'success' : 'error',
        data ? 'Berhasil bergaung ke komunitas ' + data.organization.name : 'Gagal untuk bergabung'
      );

      // hit cuurent user profile
      dispatch(getCurrentUserProfile());
    }).catch((err) => {
      console.log('err', err);

      setResponseMemberManage({
        data: null,
        success: false,
        message: Array.isArray(err.graphQLErrors) && err.graphQLErrors[0].message ? err.graphQLErrors[0].message : 'Terjadi kesalahan'
      });
    });
  }

  const menuList = [
    // {
    //   code: 'pinned_product',
    //   title: 'Konten di Pin',
    //   badgeTitle: '',
    //   show: true,
    //   icon: (
    //     <Ionicons
    //       name="pricetags-outline"
    //       size={20}
    //       color={Color.text}
    //     />
    //   ),
    //   onPress: () => {
    //     navigation.navigate('ContentProductSaveScreen', {
    //       title: 'Konten di Pin'
    //     });
    //   },
    // },
    // {
    //   code: 'history',
    //   title: 'Riwayat',
    //   badgeTitle: '',
    //   show: accessClient.MainProfile.showMenuHistory && user && !user.guest,
    //   icon: (
    //     <Ionicons
    //       name="receipt-outline"
    //       size={20}
    //       color={Color.text}
    //       style={{}}
    //     />
    //   ),
    //   onPress: () => {},
    // },
    // {
    //   code: 'coupon',
    //   title: 'Kuponku',
    //   badgeTitle: '',
    //   show: accessClient.MainProfile.showMenuCoupon && user && !user.guest,
    //   icon: (
    //     <MaterialCommunityIcons
    //       name="ticket-confirmation-outline"
    //       size={20}
    //       color={Color.text}
    //       style={{}}
    //     />
    //   ),
    //   onPress: () => {},
    // },
    // {
    //   code: 'myshop',
    //   title: 'Toko Saya',
    //   badgeTitle: '',
    //   show: accessClient.MainProfile.showMenuMyStore && user && !user.guest,
    //   icon: (
    //     <MaterialCommunityIcons
    //       name="storefront-outline"
    //       size={20}
    //       color={Color.text}
    //       style={{}}
    //     />
    //   ),
    //   onPress: () => navigation.navigate('MyShopHomepage'),
    // },
    // {
    //   code: 'auction',
    //   title: 'Bid Auction',
    //   badgeTitle: '',
    //   show: accessClient.MainProfile.showMenuBidAuction && user && !user.guest,
    //   icon: (
    //     <MaterialCommunityIcons
    //       name="ticket-confirmation-outline"
    //       size={20}
    //       color={Color.text}
    //       style={{}}
    //     />
    //   ),
    //   onPress: () => navigation.navigate('Lelang'),
    // },
    {
      code: 'change_profile',
      title: 'Ubah Profil',
      badgeTitle: '',
      show: user && !user.guest,
      icon: <FontAwesome name="edit" size={20} color={Color.text} style={{}} />,
      onPress: () => navigation.navigate('ChangeProfile'),
    },
    {
      code: 'setting',
      title: 'Pengaturan',
      badgeTitle: '',
      show: user && !user.guest,
      icon: (
        <AntDesign name="setting" size={20} color={Color.text} style={{}} />
      ),
      onPress: () => navigation.navigate('SettingScreen'),
    },
    // {
    //   code: 'critics_opinion',
    //   title: 'Kritik & Saran',
    //   badgeTitle: '',
    //   show: true,
    //   icon: <AntDesign name="carryout" size={20} color={Color.text} style={{}} />,
    //   onPress: () =>
    //   accessClient.isKomoto || accessClient.isRRID ?
    //     Linking.openURL('mailto:wahyu@komoto.id?subject=Kritik dan saran&Body')
    //   :
    //     Linking.openURL('mailto:bummitbs@gmail.com?subject=Kritik dan saran&Body'),
    // },
    // {
    //   code: 'survey',
    //   title: 'Survei',
    //   badgeTitle: '',
    //   show: accessClient.MainProfile.showMenuSurvey,
    //   icon: (
    //     <Ionicons
    //       name={'ios-receipt' || 'ios-reader'}
    //       size={20}
    //       color={Color.text}
    //       style={{}}
    //     />
    //   ),
    //   onPress: () => navigation.navigate('SurveyPasarScreen'),
    // },
    // {
    //   code: 'help',
    //   title: 'Bantuan',
    //   badgeTitle: '',
    //   show: true,
    //   icon: (
    //     <MaterialCommunityIcons
    //       name="headphones"
    //       size={20}
    //       color={Color.text}
    //       style={{}}
    //     />
    //   ),
    //   onPress: () => {
    //     navigation.navigate('ChatUserListScreen', { myRoomIds, screenType: 'help' })
    //     // Linking.openURL(
    //     //   'mailto:bummitbs@gmail.com?subject=Kritik dan saran&Body',
    //     // )
    //   },
    // },
    // {
    //   code: 'termandcondition',
    //   title: 'Ketentuan Aplikasi',
    //   badgeTitle: '',
    //   show: true,
    //   icon: <Ionicons name="md-information-circle-outline" size={20} color={Color.text} style={{}} />,
    //   onPress: () => Linking.openURL('mailto:bummitbs@gmail.com?subject=Kritik dan saran&Body'),
    // },
    // {
    //   code: 'terms_condition',
    //   title: 'Syarat & Ketentuan',
    //   show: true,
    //   icon: <Ionicons name="newspaper-outline" size={20} color={Color.text} style={{}} />,
    //   onPress: () => navigation.navigate('TermsCondition'),
    // },
    {
      code: 'join_community',
      title: 'Gabung Komunitas',
      badgeTitle: memberCheck.message,
      show: !accessClient.isMobility && accessClient.MainProfile.showMenuJoinCommunity,
      icon: <AntDesign name="form" size={20} color={Color.text} style={{}} />,
      onPress: () => setModalJoinCommunity(true),
    },
    {
      code: 'community_admin',
      title: 'Community Admin',
      badgeTitle: '',
      show:
        accessClient.MainProfile.showMenuCommunityAdmin &&
        user &&
        user.isDirector === 1,
      icon: <AntDesign name="form" size={20} color={Color.text} style={{}} />,
      onPress: () => navigation.navigate('CommunityAdminPage'),
    },
    {
      code: 'ref_code',
      title: 'Kode Referal',
      badgeTitle: '',
      show: false,
      icon: <AntDesign name="user" size={20} color={Color.text} style={{}} />,
      onPress: () => navigation.navigate('ReferralCodeScreen'),
    },
    {
      code: 'device_token',
      title: 'Device Token',
      badgeTitle: '',
      show: user && user.isDirector === 1,
      icon: <AntDesign name="form" size={20} color={Color.text} style={{}} />,
      onPress: async () => {
        const token = await messaging().getToken();
        Clipboard.setString(token);
        Alert('Berhasil disalin', token);
      },
    },
    {
      code: 'Syarat',
      title: 'Syarat & Ketentuan',
      badgeTitle: '',
      show: user && user.isDirector === 1,
      icon: <AntDesign name="form" size={20} color={Color.text} style={{}} />,
      onPress: () => navigation.navigate('SyaratdanKetentuan'),
    },
    {
      code: 'logout',
      title: 'Keluar',
      badgeTitle: '',
      show: user && !user.guest,
      icon: (
        <Ionicons
          name="exit-outline"
          size={20}
          color={Color.error}
          style={{}}
        />
      ),
      onPress: () => onPressExit(),
    },
    {
      code: 'login',
      title: 'Masuk',
      badgeTitle: '',
      show: user && user.guest,
      icon: (
        <Ionicons name="exit-outline" size={20} color={Color.info} style={{}} />
      ),
      onPress: () => onPressLogout(false),
    },
    {
      code: 'signup',
      title: 'Daftar',
      badgeTitle: '',
      show: user && user.guest,
      icon: (
        <Ionicons name="exit-outline" size={20} color={Color.primary} style={{}} />
      ),
      onPress: () => onPressLogout(true),
    },
  ];

  console.log('auth', auth);

  return (
    <Scaffold
      loadingProps={loadingProps}
      // header={<HeaderBig title="Profile" style={{paddingTop: 16}} />}
      showHeader={false}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setModalVirtual(true)}>
            <View
              style={{
                padding: 8,
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor: Color.textInput,
                justifyContent: 'center',
                alignItems: 'center',
                ...shadowStyle,
              }}>
              {user && <QRCode value={user.code} />}
              <View
                style={{
                  position: 'absolute',
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  backgroundColor: Color.textInput,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="person" color={Color.primary} size={35} />
              </View>
            </View>

            {user && !user.guest ? (
              <>
                <Text type="bold" letterSpacing={0.18}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text size={12} letterSpacing={0.18}>
                  {user.userName || '082216981621'}
                </Text>
              </>
            ) : (
              <Text type="bold" letterSpacing={0.18}>
                Halo Tamu, Silakan Login
              </Text>
            )}
          </TouchableOpacity>
        </View> */}

        {/* user fast info */}
        <Container padding={16} marginTop={16}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {user && (
              <Image
                source={{uri: user.photoProfile}}
                style={{
                  width: width * 0.16,
                  height: width * 0.16,
                  backgroundColor: Color.border,
                  borderRadius: 50,
                }}
              />
            )}

            <View
              style={{
                flex: 1,
                paddingHorizontal: 12,
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
              {auth && auth.user ? (
                <Text size={22} align='left' type="bold" letterSpacing={0.18} numberOfLines={2}>
                  {auth.user.name}
                </Text>
              ) : (
                <Text size={22} align='left' type="bold" letterSpacing={0.18} numberOfLines={2}>
                  Tamu, Silakan Login
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChangeProfile');
              }}
              style={{flexDirection: 'row', padding: 10, backgroundColor: Color.primarySoft, borderRadius: 120, justifyContent: 'center', alignItems: 'center' }}
            >
              <Circle color={Color.border} size={16} />
              <Divider width={8} />
              <Text size={12} type="semibold">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </Container>

        <Line height={8} width='100%' color='#F4F4F4' />

        <Container padding={16}>
          <View>
            <Text align='left' size={12} type='medium'>Transaksi</Text>
          </View>
          <View style={{}}>
            <View style={{flexDirection: 'row', paddingTop: 24}}>
              <Circle color={Color.border} size={16} />
              <Divider width={8} />
              <Text align='left'>Keranjang</Text>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 24}}>
              <Circle color={Color.border} size={16} />
              <Divider width={8} />
              <Text align='left'>Riwayat</Text>
            </View>
          </View>
        </Container>

        <Line height={8} width='100%' color='#F4F4F4' />

        <Container padding={16}>
          <View>
            <Text align='left' size={12} type='medium'>Seputar Aplikasi</Text>
          </View>
          <View style={{}}>
            <View style={{flexDirection: 'row', paddingTop: 24}}>
              <Circle color={Color.border} size={16} />
              <Divider width={8} />
              <Text align='left'>Pengaturan</Text>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 24}}>
              <Circle color={Color.border} size={16} />
              <Divider width={8} />
              <Text align='left'>Syarat & Ketentuan</Text>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 24}}>
              <Circle color={Color.border} size={16} />
              <Divider width={8} />
              <Text align='left'>Bantuan</Text>
            </View>
            <View style={{flexDirection: 'row', paddingTop: 24}}>
              <Circle color={Color.border} size={16} />
              <Divider width={8} />
              <Text align='left'>FAQ</Text>
            </View>
          </View>
        </Container>

        <Line height={8} width='100%' color='#F4F4F4' />

        <Container padding={16}>
          <TouchableOpacity
            onPress={() => {
              dispatch({ type: 'SETTING.SET_SHOW_DEBUG', data: !showDebug });
            }}
            style={{
              flexDirection: 'row',
            }}
          >
            <Circle color={Color.success} size={16} />
            <Divider width={8} />
            <Text color={Color.success} align='left'>
              Show Debug {showDebug ? '✅' : '❌'}
            </Text>
          </TouchableOpacity>
        </Container>

        <Container padding={16}>
          <TouchableOpacity
            onPress={() => {
              onPressExit();
            }}
            style={{
              flexDirection: 'row',
            }}
          >
            <Circle color={Color.error} size={16} />
            <Divider width={8} />
            <Text color={Color.error} align='left'>
              Logout
            </Text>
          </TouchableOpacity>
        </Container>

        {/* card */}
        {/* <Container paddingHorizontal={16} marginTop={16}>
          <View
            style={{
              width: '100%',
              aspectRatio: 16 / 9,
              justifyContent: 'space-between',
              backgroundColor: Color.textInput,
              borderRadius: 8,
              padding: 16,
              ...shadowStyle,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'flex-start',
              }}>
              <Image
                source={iconSplash}
                resizeMode="contain"
                style={{
                  width: width / 6,
                  height: width / 6,
                }}
              />
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                }}>
                {user && !user.guest ? (
                  <>
                    <Text size={12} letterSpacing={0.18}>
                      {user.firstName} {user.lastName}
                    </Text>
                    {user.idCardNumber !== '' && user.idCardNumber !== null && (
                      <Text
                        type="bold"
                        letterSpacing={0.9}
                        style={{marginTop: 2}}>
                        {user.idCardNumber}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text type="bold" letterSpacing={0.18}>
                    Halo Tamu, Silakan Login
                  </Text>
                )}
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setModalVirtual(true);
                }}>
                <View
                  style={{
                    backgroundColor: Color.textInput,
                    borderWidth: 1,
                    borderColor: Color.text,
                    width: width / 6 + 16,
                    height: width / 6 + 16,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...shadowStyle,
                  }}>
                  {user && <QRCode value={user.userCode} size={width / 6} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Container> */}

        {/* <Container paddingHorizontal={16}>
          <View
            style={{
              ...shadowStyle,
              backgroundColor: Color.textInput,
              marginHorizontal: 1,
              borderRadius: 8,
              marginBottom: 16,
              marginTop: 16,
              paddingTop: 16,
            }}>
            {menuList.map((item, idx) => {
              if (!item.show) return <View key={idx} />;

              return (
                <Container
                  key={idx}
                  paddingHorizontal={16}
                  marginTop={8}
                  marginBottom={16}>
                  <TouchableOpacity onPress={() => item.onPress()}>
                    <Row
                      style={{
                        borderBottomWidth: 0.5,
                        borderColor: Color.placeholder,
                        paddingBottom: 16,
                      }}>
                      <Col justify="center" size={0.75}>
                        {item.icon}
                      </Col>
                      <Col size={0.25}>
                        <View />
                      </Col>
                      <Col align="flex-start" size={9} justify="center">
                        <Text
                          color={
                            item.code === 'logout'
                              ? Color.error
                              : item.code === 'login' || item.code === 'signup'
                              ? Color.info
                              : Color.text
                          }>
                          {item.title}
                        </Text>
                      </Col>
                      <Col align="flex-end" size={2} justify="center">
                        <FontAwesome
                          name="angle-right"
                          color={Color.text}
                          size={20}
                        />
                      </Col>
                    </Row>
                  </TouchableOpacity>
                </Container>
              );
            })}
          </View>
        </Container> */}

        {/* <Container paddingHorizontal={16} paddingTop={32}>
          <TouchableOpacity
            onPress={() => {
              onPressExit();
            }}
          >
            <Text color={Color.error} size={12} type='medium'>
              Logout
            </Text>
          </TouchableOpacity>
        </Container> */}

        {/* <Divider /> */}
      </ScrollView>

      {/* android - untuk mencegah klik laundry bag yang belakang ikut ter klik */}
      <Box size={70} style={{position: 'absolute', bottom: -40}} />

      <ModalinputCode
        visible={modalInputCode}
        onClose={() => setModalInputCode(false)}
        onSubmit={text => {
          fetchOrganizationMemberManage(text);
        }}
        errorMessage={responseMemberManage.message}
      />
       <ModalCardMember
        visible={modalCardMember}
        onClose={() => setModalCardMember(false)}
        onSubmit={text => {
          fetchOrganizationMemberManage(text);
        }}
        errorMessage={responseMemberManage.message}
      />

      <ModalActions
        visible={modalJoinCommunity}
        data={[
          { id: 1, name: 'Buat Formulir', show: !memberCheck.status, onPress: () => { setModalJoinCommunity(false); navigation.navigate('JoinCommunity'); } },
          { id: 2, name: 'Lihat Formulir', show: memberCheck.status, onPress: () => { setModalJoinCommunity(false); navigation.navigate('CardDetail') } },
        ]}
        onClose={() => {
          setModalJoinCommunity(false);
        }}
      />

      <Modal
        visible={modalVirtual}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVirtual(false)}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backgroundColor: Color.overflow,
          }}>
          <View
            style={{
              width: '100%',
              aspectRatio: 1,
              padding: 16,
              backgroundColor: Color.theme,
              borderWidth: 4,
              borderColor: Color.text,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <QRCode value={user ? user.userCode : ''} size={width - 70} />
          </View>

          <Divider height={32} />

          <TouchableOpacity
            onPress={() => setModalVirtual(false)}
            style={{
              padding: 12,
              backgroundColor: Color.error,
              borderRadius: 50,
            }}>
            <AntDesign name="close" color={Color.textInput} size={24} />
          </TouchableOpacity>
        </View>
      </Modal>
    </Scaffold>
  );
};

export default MainProfile;
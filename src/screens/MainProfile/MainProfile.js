import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Image,
  useWindowDimensions,
  Linking,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import Feather from 'react-native-vector-icons/Feather';

import {
  Alert,
  Text,
  Row,
  Col,
  useColor,
  Scaffold,
  useLoading,
  Button,
  Header,
} from '@src/components';
import {redirectTo} from '@src/utils';
import {shadowStyle} from '@src/styles';
import imageAssets, {iconSplash, imageCardOrnament} from '@assets/images';
import ImagesPath from 'src/components/ImagesPath';
import {Box, Circle, Container, Divider, Line} from 'src/styled';
import Clipboard from '@react-native-community/clipboard';
import ModalinputCode from 'src/components/ModalInputCode';
import ModalCardMember from 'src/components/ModalCardMember';
import Client from '@src/lib/apollo';
import {queryOrganizationMemberManage} from '@src/lib/query/organization';
import {accessClient} from 'src/utils/access_client';
import {fetchCommunityMemberCheck} from 'src/api/community';
import ModalActions from 'src/components/Modal/ModalActions';
import Axios from 'axios';
import {initSocket} from 'src/api-socket/currentSocket';
import {assetImageProfile} from 'assets/images/profile';
import { stateUpdateProfile } from 'src/api-rest/stateUpdateProfile';

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
  });
  const [devMode, setDevMode] = useState(0);

  const dispatch = useDispatch();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const auth = useSelector(state => state['auth']);
  const localStoragSetting = useSelector(state => state['setting']);

  const showDebug =
    localStoragSetting && localStoragSetting.showDebug ? true : false;

  const {Color} = useColor();
  const {width} = useWindowDimensions();

  useEffect(() => {
    if (refreshing) {
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (route.params && route.params.refresh) {
      navigation.setParams({refresh: false});
    }
  }, [route]);

  const fetchData = async () => {
    await stateUpdateProfile();

    const result = await fetchCommunityMemberCheck();
    if (result.status) {
      setMemberCheck({...memberCheck, ...result.data});
    }
  };

  const onPressExit = () => {
    Alert('Logout', 'Apakah Anda yakin akan logout?', () =>
      onPressLogout(false),
    );
  };

  const onPressLogout = () => {
    dispatch({type: 'AUTH.CLEAR'});
    dispatch({type: 'USER.LOGOUT'});
    redirectTo('LoginScreenV2');

    // dispatch({type: 'ARTICLE.CLEAR_HISTORY'});
    // currentSocket.disconnect();
  };

  const cardMenu = (item, index) => (
    <TouchableOpacity
      key={index}
      onPress={item.onPress ? item.onPress : () => {
        navigation.navigate(item.nav);
      }}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
      }}
    >
      <Text size={17} type="medium" lineHeight={20} color={Color.black}>
        {item.name}
      </Text>
      <Image
        source={imageAssets.arrowRight}
        style={{
        height: 16,
        width: 16,
        resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  )

  console.log('auth', auth);

  return (
    <Scaffold loadingProps={loadingProps} showHeader={false} statusBarColor="#F2D376" barStyleColor="light-content">
      <ScrollView showsVerticalScrollIndicator={false}>
        {auth.user && !auth.user.isRegistered && <Container
          marginTop={16}
          paddingVertical={10}
          paddingHorizontal={12}
          marginHorizontal={16}
          backgroundColor="#FDF2F1"
          borderRadius={16}
          justify="space-between"
          flex={1}
          flexDirection="row"
        >
          <Container flex={1} flexDirection="row" align="center" justify='center'>
            <View
              style={{
                width: 24,
                height: 24,
              }}>
              <Image
                source={imageAssets.infoCircle}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }}
              />
            </View>
            <Divider width={10} />
            <Container flex={1} flexDirection="column">
              <Text align="left" size={12} color={Color.black} type="medium">
                Profil belum lengkap
              </Text>
              <Text size={10} align="left" color={Color.textSoft}>
                Kamu tidak akan bisa masuk kedalam area jika profile kamu belum
                lengkap
              </Text>
            </Container>
          </Container>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChangeProfile');
            }}
            style={{
              marginLeft: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text size={12} color={Color.error}>
              Lengkapi
            </Text>
            <Divider width={5} />
            <AntDesign name="arrowright" color={Color.error} size={12} />
          </TouchableOpacity>
        </Container>}

        {/* user fast info */}
        {/* <TouchableOpacity
          disabled
          style={{ padding: 16 }}
          onPress={() => navigation.navigate('ProfileDetail')}
        >
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {auth && auth.user && (
              <Image
                source={auth.user.foto ? {uri: auth.user.foto} : ImagesPath.userChat}
                style={{
                  width: width * 0.16,
                  height: width * 0.16,
                  backgroundColor: Color.border,
                  borderRadius: 50,
                }}
              />
            )}

            {auth.user && (
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 12,
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}>
                <Text size={22} align="left" lineHeight={28} numberOfLines={1} type="bold">
                  {auth.user.name}
                </Text>
                {!auth.user.isGuest && <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ChangeProfileV2', { canGoBack: true });
                  }}>
                  <Text size={12} type="medium" color={Color.black} underline>
                    EDIT PROFILE
                  </Text>
                </TouchableOpacity>}
              </View>
            )}
          </View>
        </TouchableOpacity> */}

        <Container
          style={{ 
            backgroundColor: Color.primary,
            width: width,
            paddingVertical: 42,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
           }}
        >
          <Container
            style={{ 
              width: width*0.427,
              height: width*0.427,
             }}
          >
            <ImageBackground 
              source={imageAssets.profileBackground} 
              style={{
                width: '100%', 
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              imageStyle={{ resizeMode: 'contain' }}>
                {auth && auth.user && (
                  <Image
                    source={
                      typeof auth.user.foto === 'string'
                      && (auth.user.foto.startsWith('http://') || auth.user.foto.startsWith('https://')) ?
                      {uri: auth.user.foto} : ImagesPath.userChat}
                    style={{
                      width: '50%',
                      height: '50%',
                      backgroundColor: Color.border,
                      borderRadius: 50,
                    }}
                  />
                )}
            </ImageBackground>
          </Container>
          {auth.user && (
            <>
            <Divider height={32}/>
            <Text size={22} align="center" lineHeight={28} type="bold" numberOfLines={2} color="#EEEEEE">
              {auth.user.name}
            </Text>
            </>)
          }
          <Divider height={16}/>
          <Container
            flexDirection="row"
            // borderWidth={1}
            borderColor="#ffffff"
          >
            <TouchableOpacity 
              style={{
                flexDirection:"row", 
                flex: 3, 
                justifyContent: 'flex-end'
              }}
              onPress={() => setModalVirtual(true)}
              >
              <AntDesign name="scan1" color={"#EEFF00"} size={16} />
              <Divider width={8}/>
              <Text type="medium" size={12} lineHeight={13.2} color="#EEFF00" underline>
                My QR
              </Text>
            </TouchableOpacity>
            <Container flex={1}/>
            <TouchableOpacity 
              style={{
                flexDirection:"row", 
                flex: 3
              }}
              onPress={() => {
                navigation.navigate('ChangeProfileV2', { canGoBack: true });
              }}
            >
              <Text type="medium" size={12} lineHeight={13.2} color="#EEFF00" underline>
                Edit Profil
              </Text>
            </TouchableOpacity>
          </Container>
        </Container>
        
        {/* qr code */}
        {/* <TouchableOpacity
          onPress={() => setModalVirtual(true)}
          style={{ 
            borderWidth: 1.5,
            borderColor:'#242424',
            paddingVertical: 12,
            marginHorizontal: 16
           }}
        >
          <Text size={14} type="medium" lineHeight={17}>
            Show QR Code
          </Text>
        </TouchableOpacity> */}

        {/* <Line height={8} width="100%" color="#F4F4F4" /> */}
        <Divider height={16}/>

        <Container 
          padding={16}
          flexDirection="row"
          justify="space-between"
        >
          <View style={{ flex: 2 }}>
            <Text align="left" size={10} type="semibold" color={Color.primary}>
              ● TRANSACTION
            </Text>
          </View>
          {/* <Divider height={12}/> */}
          <View style={{ flex: 5 }}>
            {[
                {name: 'History', nav: 'EventHistory'},
            ].map((item, index) => {
                return cardMenu(item, index);
              })
            }
          </View>

          {/* <View style={{}}> */}
            {/* <View style={{ flexDirection: 'row', paddingTop: 24 }}>
              <Image
                source={assetImageProfile.cart}
                style={{
                  height: 16,
                  width: 16,
                  resizeMode: 'contain',
                }}
              />
              <Divider width={8} />
              <Text align='left'>Keranjang</Text>
            </View> */}
            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('EventHistory');
              }}
              style={{flexDirection: 'row', paddingTop: 24}}>
              <Text align="left">History</Text>
            </TouchableOpacity> */}
          {/* </View> */}
        </Container>

        {/* <Line height={8} width="100%" color="#F4F4F4" /> */}

        <Divider height={16}/>

        <Container 
          padding={16}
          flexDirection="row"
          justify="space-between"
        >
          <View style={{ flex: 2 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setDevMode(devMode+1)}
            >
              <Text align="left" size={10} type="semibold" color={Color.primary}>
                ● About
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 5 }}>
            {[
                {name: 'Setting', nav: 'SettingScreen'},
                {name: 'Terms & Condition', nav: 'SyaratdanKetentuan'},
                {
                  name: 'Support', 
                  onPress: () => {
                    const phoneNumber = '02123456789';
                    Linking.openURL(`tel:${phoneNumber}`);
                  }
                },
                {name: 'FAQ', nav: 'FAQScreen'},
              ].map((item, index) => {
                return cardMenu(item, index);
              })}
          </View>
          {/* <View style={{}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SettingScreen');
              }}
              style={{flexDirection: 'row', paddingTop: 24}}>
              <Image
                source={assetImageProfile.setting}
                style={{
                  height: 16,
                  width: 16,
                  resizeMode: 'contain',
                }}
              />
              <Divider width={8} />
              <Text align="left">Pengaturan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SyaratdanKetentuan');
              }}
              style={{flexDirection: 'row', paddingTop: 24}}>
              <Image
                source={assetImageProfile.term}
                style={{
                  height: 16,
                  width: 16,
                  resizeMode: 'contain',
                }}
              />
              <Divider width={8} />
              <Text align="left">Syarat & Ketentuan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const phoneNumber = '02123456789';
                Linking.openURL(`tel:${phoneNumber}`);
              }}
              style={{flexDirection: 'row', paddingTop: 24}}>
              <Image
                source={assetImageProfile.help}
                style={{
                  height: 16,
                  width: 16,
                  resizeMode: 'contain',
                }}
              />
              <Divider width={8} />
              <Text align="left">Bantuan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('FAQScreen');
              }}
              style={{flexDirection: 'row', paddingTop: 24}}>
              <Image
                source={assetImageProfile.faq}
                style={{
                  height: 16,
                  width: 16,
                  resizeMode: 'contain',
                }}
              />
              <Divider width={8} />
              <Text align="left">FAQ</Text>
            </TouchableOpacity>
          </View> */}
        </Container>

        {/* <Line height={8} width="100%" color="#F4F4F4" /> */}

        <Divider height={16}/>
        <Container 
          flexDirection="row"
          justify="space-between"
        >
          <View style={{ flex: 2 }}/>
          <View style={{ flex: 5, alignItems:'flex-start' }}>
            {auth.user && !auth.user.isGuest && (
              <TouchableOpacity
                onPress={() => {
                  onPressExit();
                }}
                style={{ 
                  paddingHorizontal: 56,
                  paddingVertical: 10,
                  backgroundColor: Color.black
                }}
              >
                <Text color={Color.theme} size={12} lineHeight={14.8}>
                  Logout
                </Text>
              </TouchableOpacity>
            )}
            {auth.user && auth.user.isGuest && (
              <TouchableOpacity
                onPress={() => {
                  redirectTo('LoginScreenV2');
                }}
                style={{ 
                  paddingHorizontal: 56,
                  paddingVertical: 10,
                  backgroundColor: Color.black
                }}
              >
              <Text color={Color.theme} size={12} lineHeight={14.8}>
                Login
              </Text>
            </TouchableOpacity>
            )}
          </View>
        </Container>
        <Divider height={16}/>

        {(devMode >= 5 || (auth.user && auth.user.member_right === 1)) && (
          <Container padding={16}>
            <TouchableOpacity
              onPress={() => {
                dispatch({type: 'SETTING.SET_SHOW_DEBUG', data: !showDebug});
              }}
              style={{
                flexDirection: 'row',
              }}>
              <Circle color={Color.success} size={16} />
              <Divider width={8} />
              <Text color={Color.success} align="left">
                Show Menu
              </Text>
              <Divider width={8} />
              <Text color={Color.success} align="left" size={10}>
                {showDebug ? '✅' : '❌'}
              </Text>
            </TouchableOpacity>
          </Container>
        )}

        {(devMode >= 5 || (auth.user && auth.user.member_right === 1)) && (
          <Container padding={16}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TestScreen');
              }}
              style={{
                flexDirection: 'row',
              }}>
              <Circle color="orange" size={16} />
              <Divider width={8} />
              <Text color="orange" align="left">
                Radar
              </Text>
            </TouchableOpacity>
          </Container>
        )}

        {/* {auth.user && !auth.user.isGuest && <Container padding={16}> */}
          {/* <TouchableOpacity
            onPress={() => {
              onPressExit();
            }}
            style={{
              flexDirection: 'row',
            }}>
            <Image
              source={assetImageProfile.logout}
              style={{
                height: 16,
                width: 16,
                resizeMode: 'contain',
              }}
            />
            <Divider width={8} />
            <Text color={Color.error} align="left">
              Logout
            </Text>
          </TouchableOpacity> */}
        {/* </Container>} */}

        {/* {auth.user && auth.user.isGuest && <Container paddingHorizontal={16}>
          {cardMenu(
            {
              name: 'Login',
              onPress: () => {
                redirectTo('LoginScreenV2');
              }
            }
          )}
        </Container>} */}
      </ScrollView>

      {/* android - untuk mencegah klik laundry bag yang belakang ikut ter klik */}
      <Box size={70} style={{position: 'absolute', bottom: -40}} />

      <ModalinputCode
        visible={modalInputCode}
        onClose={() => setModalInputCode(false)}
        onSubmit={text => {}}
        errorMessage={responseMemberManage.message}
      />
      <ModalCardMember
        visible={modalCardMember}
        onClose={() => setModalCardMember(false)}
        onSubmit={text => {}}
        errorMessage={responseMemberManage.message}
      />

      <ModalActions
        visible={modalJoinCommunity}
        data={[
          {
            id: 1,
            name: 'Buat Formulir',
            show: !memberCheck.status,
            onPress: () => {
              setModalJoinCommunity(false);
              navigation.navigate('JoinCommunity');
            },
          },
          {
            id: 2,
            name: 'Lihat Formulir',
            show: memberCheck.status,
            onPress: () => {
              setModalJoinCommunity(false);
              navigation.navigate('CardDetail');
            },
          },
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
            backgroundColor: 'rgba(20, 20, 20, 0.7)',
          }}>
          <View
            style={{ 
              borderRadius: 24,
              width: width*0.587,
              backgroundColor: "rgba(238, 238, 238, 0.47)",
              paddingVertical: 24,
              paddingHorizontal: 30,
             }}
          >
            <QRCode value={auth.user && auth.user.user_uuid ? auth.user.user_uuid : 'blocX'} size={(width*0.587)-60} />

            <Divider height={16} />

            <Text size={18} type="medium" lineHeight={21.6} color={Color.theme}>
              {auth && auth.user && auth.user.name}
            </Text>

            <Divider height={12}/>

            <TouchableOpacity
              onPress={() => setModalVirtual(false)}
              style={{ 
                borderWidth: 1,
                borderColor:'#EEEEEE',
                paddingVertical: 8,
              }}
            >
              <Text size={10} type="medium" lineHeight={10.8} color={Color.theme}>
                CLOSE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Scaffold>
  );
};

export default MainProfile;

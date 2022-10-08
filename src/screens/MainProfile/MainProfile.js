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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';

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
  const [myRoomIds, setMyRoomIds] = useState([]);

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

  const fetchData = async () => {
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

  console.log('auth', auth);

  return (
    <Scaffold loadingProps={loadingProps} showHeader={false}>
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
        <TouchableOpacity
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

            {auth && auth.user && (
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 12,
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}>
                <Text size={22} align="left" lineHeight={28} numberOfLines={2}>
                  {auth.user.name}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChangeProfile');
              }}
              style={{
                flexDirection: 'row',
                padding: 10,
                borderColor: Color.text,
                borderWidth: 0.5,
                borderRadius: 120,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 16,
                  height: 16,
                }}>
                <Image
                  source={imageAssets.edit}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <Divider width={8} />
              <Text size={12} type="medium" color={Color.primaryDark}>
                Edit Profil
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <Line height={8} width="100%" color="#F4F4F4" />

        <Container padding={16}>
          <View>
            <Text align="left" size={12} type="medium">
              Transaksi
            </Text>
          </View>
          <View style={{}}>
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
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EventHistory');
              }}
              style={{flexDirection: 'row', paddingTop: 24}}>
              <Image
                source={assetImageProfile.history}
                style={{
                  height: 16,
                  width: 16,
                  resizeMode: 'contain',
                }}
              />
              <Divider width={8} />
              <Text align="left">Riwayat</Text>
            </TouchableOpacity>
          </View>
        </Container>

        <Line height={8} width="100%" color="#F4F4F4" />

        <Container padding={16}>
          <View>
            <Text align="left" size={12} type="medium">
              Seputar Aplikasi
            </Text>
          </View>
          <View style={{}}>
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
          </View>
        </Container>

        <Line height={8} width="100%" color="#F4F4F4" />

        {auth.user && auth.user.member_right === 1 && (
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

        {auth.user && auth.user.member_right === 1 && (
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

        <Container padding={16}>
          <TouchableOpacity
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
          </TouchableOpacity>
        </Container>
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
            <QRCode value={'dummy'} size={width - 70} />
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

import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
  useWindowDimensions,
  Linking,
  ImageBackground,
  ScrollView,
} from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';

import {
  Alert,
  Text,
  Grid,
  Row,
  Col,
  // TouchableOpacity,
  HeaderBig,
  useColor,
} from '@src/components';

import {redirectTo, loginRequired} from '@src/utils';
import {shadowStyle} from '@src/styles';

import {iconSplash, bannerCard, qrCode} from '@assets/images';
import {Box, Divider} from 'src/styled';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const BottomView = Styled(View)`
    width: 100%;
    padding: 0px 16px;
`;

const ExitButton = Styled(TouchableOpacity)`
    width: 100%;
    height: 40px;
    justifyContent: flex-start;
    alignItems: center;
    flexDirection: row;
`;

const ContentView = Styled(View)`
  width: 100%;
  paddingHorizontal: 16px;
`;

const MainProfile = ({navigation, route}) => {
  const [modalVirtual, setModalVirtual] = useState(false);

  const dispatch = useDispatch();

  const user = useSelector(state => state['user.auth'].login.user);

  console.log('user', user);

  const {Color} = useColor();
  const {width} = useWindowDimensions();

  useEffect(() => {
    if (route.params && route.params.refresh) {
      navigation.setParams({refresh: false});
    }
  }, [route]);

  const onPressExit = () => {
    Alert('Logout', 'Apakah Anda yakin akan logout?', () => onPressLogout());
  };

  const onPressLogout = () => {
    dispatch({type: 'USER.LOGOUT'});
    redirectTo('LoginScreen');
  };

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <HeaderBig title="Profile" style={{paddingTop: 16}} />

      <ScrollView>
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
        
        <ContentView>
          <View>
            <ImageBackground
              source={bannerCard}
              resizeMode="cover"
              style={{
                marginTop: 12,
                height: 162,
              }}
              imageStyle={{borderRadius: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  aspectRatio: 7,
                  justifyContent: 'flex-start',
                }}>
                <Image
                  style={{width: '20%', height: '50%', marginLeft: 16, marginTop: 16}}
                  source={iconSplash}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  aspectRatio: 7,
                  justifyContent: 'space-between',
                  marginTop: 43,
                  Color: Color.text,
                }}>
                <View
                  style={{
                    alignItems: 'flex-start'
                  }}
                  >
                  {user && !user.guest ? (
                    <>
                      <Text
                        style={{marginLeft: 16}}
                        color={Color.textInput}
                        type="bold"
                        letterSpacing={0.18}>
                        {user.idCardNumber || '1000078964512'}
                      </Text>

                      <Text 
                        style={{marginLeft: 16}}
                        color={Color.textInput} 
                        size={12} 
                        letterSpacing={0.18}>
                        {user.firstName} {user.lastName}
                      </Text>
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
                    //setModalVirtual(true);
                  }}
                >
                  <View
                    style={{
                      backgroundColor: Color.textInput,
                      width: 55,
                      height: 55,
                      marginRight: 16,
                      borderRadius: 8,
                      alignItems: 'center',
                      alignContent: 'center',
                    }}>
                    <View style={{alignContent: 'center', marginTop: 5}}>
                      {user && <QRCode value={user.code} size={45} />}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </ContentView>
        <ContentView>
          <View
            style={{
              ...shadowStyle,
              backgroundColor: Color.textInput,
              marginHorizontal: 1,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              marginBottom: 20,
              marginTop: 20,
            }}>
            <Grid
              style={{
                backgroundColor: Color.theme,
                borderTopWidth: 0.5,
                borderColor: Color.border,
              }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  // setModalVirtual(true);
                }}
              >
                <Row>
                  <Col justify="center" size={0.75}>
                    <FontAwesome
                      name="credit-card"
                      color={Color.text}
                      style={{marginTop: 2}}
                    />
                  </Col>
                  <Col align="flex-start" size={8} justify="center">
                    <Text size={12} type="medium">
                      Virtual Card
                    </Text>
                  </Col>
                  <Col align="flex-end" size={3.25} justify="center">
                    <FontAwesome
                      name="angle-right"
                      color={Color.text}
                      size={20}
                    />
                  </Col>
                </Row>
              </TouchableOpacity>
            </Grid>
            {user && !user.guest && (
              <Grid
                style={{
                  backgroundColor: Color.theme,
                  borderTopWidth: 0.5,
                  borderColor: Color.border,
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ChangeProfile')}>
                  <Row>
                    <Col justify="center" size={0.75}>
                      <FontAwesome
                        name="edit"
                        color={Color.text}
                        style={{marginTop: 2}}
                      />
                    </Col>
                    <Col align="flex-start" size={8} justify="center">
                      <Text size={12} type="medium">
                        Ubah Profil
                      </Text>
                    </Col>
                    <Col align="flex-end" size={3.25} justify="center">
                      <FontAwesome
                        name="angle-right"
                        color={Color.text}
                        size={20}
                      />
                    </Col>
                  </Row>
                </TouchableOpacity>
              </Grid>
            )}

            <Grid
              style={{
                backgroundColor: Color.theme,
                borderTopWidth: 0.5,
                borderColor: Color.border,
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SettingScreen')}>
                <Row>
                  <Col size={0.75} justify="center">
                    <AntDesign
                      name="setting"
                      color={Color.text}
                      style={{marginTop: 2}}
                    />
                  </Col>
                  <Col align="flex-start" size={8} justify="center">
                    <Text size={12} type="medium">
                      Setting
                    </Text>
                  </Col>
                  <Col align="flex-end" size={3.25} justify="center">
                    <FontAwesome
                      name="angle-right"
                      color={Color.text}
                      size={20}
                    />
                  </Col>
                </Row>
              </TouchableOpacity>
            </Grid>

            <Grid
              style={{
                backgroundColor: Color.theme,
                borderTopWidth: 0.5,
                borderColor: Color.border,
              }}>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    'mailto:bummitbs@gmail.com?subject=Kritik dan saran&Body',
                  )
                }>
                <Row>
                  <Col size={0.75} justify="center">
                    <AntDesign
                      name="carryout"
                      color={Color.text}
                      style={{marginTop: 2}}
                    />
                  </Col>
                  <Col align="flex-start" size={8} justify="center">
                    <Text size={12} type="medium">
                      Kritik dan saran
                    </Text>
                  </Col>
                  <Col align="flex-end" size={3.25} justify="center">
                    <FontAwesome
                      name="angle-right"
                      color={Color.text}
                      size={20}
                    />
                  </Col>
                </Row>
              </TouchableOpacity>
            </Grid>

            <Grid
              style={{
                backgroundColor: Color.theme,
                borderTopWidth: 0.5,
                borderColor: Color.border,
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('JoinCommunity')}>
                <Row>
                  <Col size={0.75} justify="center">
                    <AntDesign
                      name="form"
                      color={Color.text}
                      style={{marginTop: 2}}
                    />
                  </Col>
                  <Col align="flex-start" size={8} justify="center">
                    <Text size={12} type="medium">
                      Gabung Komunitas
                    </Text>
                  </Col>
                  <Col align="flex-end" size={3.25} justify="center">
                    <FontAwesome
                      name="angle-right"
                      color={Color.text}
                      size={20}
                    />
                  </Col>
                </Row>
              </TouchableOpacity>
            </Grid>

            <Grid
              style={{
                backgroundColor: Color.theme,
                borderTopWidth: 0.5,
                borderColor: Color.border,
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('CommunityAdminPage')}>
                <Row>
                  <Col size={0.75} justify="center">
                    <AntDesign
                      name="form"
                      color={Color.text}
                      style={{marginTop: 2}}
                    />
                  </Col>
                  <Col align="flex-start" size={8} justify="center">
                    <Text size={12} type="medium">
                      Community Admin
                    </Text>
                  </Col>
                  <Col align="flex-end" size={3.25} justify="center">
                    <FontAwesome
                      name="angle-right"
                      color={Color.text}
                      size={20}
                    />
                  </Col>
                </Row>
              </TouchableOpacity>
            </Grid>

            {/* <Grid
          style={{
            backgroundColor: Color.theme,
            borderTopWidth: 0.5,
            borderColor: Color.border,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ReferralCodeScreen')}>
            <Row>
              <Col size={0.75} justify="center">
                <AntDesign
                  name="user"
                  color={Color.text}
                  style={{marginTop: 2}}
                />
              </Col>
              <Col align="flex-start" size={8} justify="center">
                <Text size={12} type="medium">
                  Masuk Komunitas
                </Text>
              </Col>
              <Col align="flex-end" size={3.25} justify="center">
                <FontAwesome name="angle-right" color={Color.text} size={20} />
              </Col>
            </Row>
          </TouchableOpacity>
        </Grid> */}

            {user && !user.guest && (
              <Grid
                style={{
                  backgroundColor: Color.theme,
                  borderTopWidth: 0.5,
                  borderColor: Color.border,
                }}>
                <TouchableOpacity onPress={() => onPressExit()}>
                  <Row>
                    <Col justify="center" size={0.75}>
                      <Ionicons
                        name="exit-outline"
                        color={Color.error}
                        style={{marginTop: 2}}
                      />
                    </Col>
                    <Col align="flex-start" size={8} justify="center">
                      <Text size={12} type="medium" color={Color.error}>
                        Logout
                      </Text>
                    </Col>
                    <Col align="flex-end" size={3.25} justify="center">
                      <FontAwesome
                        name="angle-right"
                        color={Color.text}
                        size={20}
                      />
                    </Col>
                  </Row>
                </TouchableOpacity>
              </Grid>
            )}

            {user && user.guest && (
              <Grid
                style={{
                  backgroundColor: Color.theme,
                  borderTopWidth: 0.5,
                  borderColor: Color.border,
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('LoginScreen')}>
                  <Row>
                    <Col justify="center" size={0.75}>
                      <Ionicons
                        name="exit-outline"
                        color={Color.info}
                        style={{marginTop: 2}}
                      />
                    </Col>
                    <Col align="flex-start" size={8} justify="center">
                      <Text size={12} type="medium" color={Color.info}>
                        Login
                      </Text>
                    </Col>
                    <Col align="flex-end" size={3.25} justify="center">
                      <FontAwesome
                        name="angle-right"
                        color={Color.text}
                        size={20}
                      />
                    </Col>
                  </Row>
                </TouchableOpacity>
              </Grid>
            )}
          </View>
        </ContentView>

        <Divider />
      </ScrollView>

      {/* android - untuk mencegah klik laundry bag yang belakang ikut ter klik */}
      <Box size={70} style={{position: 'absolute', bottom: -40}} />
      {/*  */}

      <Modal
        visible={modalVirtual}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVirtual(false)}>
        <View
          style={{flex: 1, padding: 16, backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 16,
              borderRadius: 8,
              alignItems: 'flex-start',
              backgroundColor: Color.primary,
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                borderRadius: 16,
                marginBottom: 16,
                padding: 4,
                backgroundColor: Color.textInput,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image source={iconSplash} style={{width: 100, height: 32}} />
              <AntDesign
                name="close"
                color={Color.textInput}
                size={20}
                onPress={() => setModalVirtual(false)}
                style={{
                  position: 'absolute',
                  right: 6,
                  backgroundColor: Color.error,
                  borderRadius: 50,
                }}
              />
            </View>

            <View
              style={{
                width: width - 90 - 64,
                height: 90,
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  align="left"
                  type="bold"
                  size={20}
                  color={Color.textInput}>
                  {user && user.firstName} {user && user.lastName}
                </Text>
                <Text align="left" size={18} color={Color.textInput}>
                  {(user && user.userName) || '082216981621'}
                </Text>
              </View>
            </View>
            <View style={{width: 20, height: 90}}>
              {user && <QRCode value={user.code} />}
            </View>
          </View>
        </View>
      </Modal>
    </MainView>
  );
};

export default MainProfile;

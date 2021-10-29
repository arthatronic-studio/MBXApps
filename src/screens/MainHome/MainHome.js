import React, {useState, useEffect} from 'react';
import {View, ScrollView, Image, useWindowDimensions} from 'react-native';
import Styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import {useIsFocused} from '@react-navigation/native';

import {
  Text,
  TouchableOpacity,
  HeaderBig,
  Loading,
  useLoading,
  useColor,
} from '@src/components';
import {FormatMoney} from '@src/utils';
import ListNews from 'src/components/List/ListNews';
import ListPlace from 'src/components/List/ListPlace';
import ListWorkshop from 'src/components/List/ListWorkshop';
import ListJob from 'src/components/List/ListJob';
import CarouselView from 'src/components/CarouselView';
import {shadowStyle} from '@src/styles';
import {MainView} from '@src/styled';

import Client from '@src/lib/apollo';
import {queryMaudiProduct} from '@src/lib/query';
import {queryVestaBalance, queryVestaOpenBalance} from '@src/lib/query/payment';

import {
  iconBPJS,
  iconGames,
  iconInternet,
  iconIuran,
  iconPDAM,
  iconPLN,
  iconPulsa,
  iconSemua,
} from '@assets/images/home';

const ContentView = Styled(View)`
  width: 100%;
  paddingHorizontal: 16px;
`;

const BalanceView = Styled(View)`
  width: 100%;
  borderRadius: 4px;
  flexDirection: row;
  justifyContent: space-between;
  padding: 18px 16px 16px;
`;

const SambatanMenuView = Styled(View)`
  width: 100%;
  borderRadius: 4px;
  marginTop: 16px;
  paddingTop: 30px;
  paddingHorizontal: 8px;
  flexDirection: row;
  flexWrap: wrap;
`;

const PerUserIcons = Styled(TouchableOpacity)`
  width: 25%;
  aspectRatio: 1.5;
  flexDirection: column;
  marginBottom: 12px;
`;

const UserIcon = Styled(View)`
  height: 100%;
  justifyContent: flex-start;
  alignItems: center;
`;

const ImageProperty = Styled(Image)`
  height: 40%;
  aspectRatio: 1;
  marginBottom: 8;
`;

const ComingSoonContainer = Styled(View)`
  width: 100%;
  justifyContent: center;
  alignItems: center;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: -33;
`;

const ComingSoonView = Styled(View)`
  borderRadius: 30;
  padding: 0px 5px 2px 5px;
  justifyContent: center;
  alignItems: center;
`;

const sambatanMenus = [
  {
    id: 6,
    name: 'Iuran',
    images: iconIuran,
    nav: 'OrderListPerProduct',
    params: {title: 'Iuran', type: 'ACTIVE', productType: 'ALL_SAMBATAN'},
  },
  {id: 0, name: 'Pulsa', images: iconPulsa, nav: 'PulsaScreen', params: {}},
  {id: 1, name: 'Listrik', images: iconPLN, nav: 'PlnScreen', params: {}},
  {id: 2, name: 'PDAM', images: iconPDAM, nav: 'PdamScreen', params: {}},
  // {id: 3, name: 'Game', images: iconGames, nav: '', params: {}},
  // {id: 4, name: 'BPJS', images: iconBPJS, nav: '', params: {}},
  // {
  //   id: 5,
  //   name: 'Internet',
  //   images: iconInternet,
  //   nav: '',
  //   params: {
  //     title: 'Iuran Non-wajib',
  //     type: 'ACTIVE',
  //     productType: 'SAMBATAN_O',
  //   },
  // },
  // {
  //   id: 7,
  //   name: 'Semua',
  //   images: iconSemua,
  //   nav: '',
  //   params: {
  //     title: 'Iuran Non-wajib',
  //     type: 'ACTIVE',
  //     productType: 'SAMBATAN_O',
  //   },
  // },
];

const MainHome = ({navigation, route}) => {
  // state
  const [vestaAmount, setVestaAmount] = useState(0);
  const [wallet, setWallet] = useState('CLOSE');
  const [listTampil, setListTampil] = useState([]);
  const [listJalanJalan, setListJalanJalan] = useState([]);
  const [listBelajar, setListBelajar] = useState([]);
  const [listKerja, setListKerja] = useState([]);
  const [listPanicButton, setListPanicButton] = useState([]);

  const user = useSelector((state) => state['user.auth'].login.user);
  const dispatch = useDispatch();

  const {Color} = useColor();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const {width} = useWindowDimensions();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      dispatch({type: 'BOOKING.CLEAR_BOOKING'});
      componentWillFocus();
      fetchData();
    }
  }, [isFocused]);

  const componentWillFocus = () => {
    if (user && !user.guest) {
      getVestaBalance();
    }
  };

  const getVestaBalance = () => {
    // showLoading();

    Client.query({query: queryVestaBalance})
      .then((res) => {
        // hideLoading();
        setVestaAmount(res.data.vestaBalance.amount || 0);
        setWallet(res.data.vestaBalance.wallet);
      })
      .catch((reject) => {
        console.log(reject, 'err get vesta balance');
        // hideLoading();
      });
  };

  const fetchData = async () => {
    // showLoading();

    const result = await Promise.all([
      await getMaudiProduct('TRIBES', 'SCENE', ''),
      await getMaudiProduct('TRIBES', '', 'TRIBES_TAMPIL'),
      await getMaudiProduct('TRIBES', '', 'TRIBES_JALAN_JALAN'),
      await getMaudiProduct('TRIBES', '', 'TRIBES_BELAJAR'),
      await getMaudiProduct('TRIBES', '', 'TRIBES_KERJA'),
    ]);

    setListPanicButton(result[0]);
    setListTampil(result[1]);
    setListJalanJalan(result[2]);
    setListBelajar(result[3]);
    setListKerja(result[4]);

    // hideLoading();
  };

  const getMaudiProduct = async (
    productType,
    productCategory,
    productSubCategory,
  ) => {
    const variables = {
      page: 0,
      itemPerPage: 6,
    };

    if (productType) {
      variables.productType = productType;
    }

    if (productCategory) {
      variables.productCategory = productCategory;
    }

    if (productSubCategory) {
      variables.productSubCategory = productSubCategory;
    }

    const result = await Client.query({
      query: queryMaudiProduct,
      variables,
    });

    if (
      result &&
      result.data &&
      result.data.maudiProduct &&
      Array.isArray(result.data.maudiProduct)
    ) {
      return result.data.maudiProduct;
    } else {
      return [];
    }
  };

  const getIconMenu = (iconType, iconName, isRouteActive) => {
    switch (iconType) {
      case 'Ionicons':
        return (
          <Ionicons
            name={iconName}
            size={50}
            color={isRouteActive ? Color.primary : Color.gray}
            style={{marginBottom: 8}}
          />
        );
      case 'FontAwesome5':
        return (
          <FontAwesome5
            name={iconName}
            size={50}
            color={isRouteActive ? Color.primary : Color.gray}
            style={{marginBottom: 8}}
          />
        );
    }
  };

  const openVesta = () => {
    showLoading();

    Client.query({query: queryVestaOpenBalance})
      .then((res) => {
        if (res.data.vestaOpenBalance.success) {
          setWallet('OPEN');
        }

        hideLoading();
        navigation.navigate('TopUpScreen');
      })
      .catch((reject) => {
        console.log(reject);
        hideLoading();
      });
  };

  const renderComingSoon = () => {
    return (
      <ComingSoonContainer>
        <ComingSoonView style={{backgroundColor: Color.border}}>
          <Text size={8}>Coming Soon</Text>
        </ComingSoonView>
      </ComingSoonContainer>
    );
  };

  const isWalletClose = wallet === 'CLOSE';

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <HeaderBig
        style={{paddingTop: 8}}
        actions={
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                width: '20%',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
              }}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Color.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                width: '20%',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
              }}>
              <Ionicons name="chatbox-outline" size={22} color={Color.text} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 20,
          }}>
          <Image
            source={{uri: ''}}
            style={{
              width: '14%',
              aspectRatio: 1,
              borderRadius: 50,
              backgroundColor: Color.border,
            }}
          />
          <View style={{paddingLeft: 16, alignItems: 'flex-start'}}>
            <Text lineHeight={18} letterSpacing={0.45}>
              Halo,
            </Text>
            <Text size={18} type="bold" lineHeight={22} letterSpacing={0.45}>
              {user && !user.guest
                ? user.firstName + ' ' + user.lastName
                : 'Tamu'}
            </Text>
          </View>
        </View>

        <ContentView>
          <BalanceView
            style={{...shadowStyle, backgroundColor: Color.textInput}}>
            <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text size={10}>Saldo</Text>
              <Text size={18} type="semibold" style={{marginTop: 2}}>
                {FormatMoney.getFormattedMoney(vestaAmount)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              {/* <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  style={{aspectRatio: 1, height: 30, borderRadius: 4, backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 4}}
                  onPress={() => {}}
                >
                    <Feather name='upload' color={Color.textInput} size={22} />
                </TouchableOpacity>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text size={9} type='medium' color={Color.text}>Tarik</Text>
                </View>
              </View> */}

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 16,
                }}>
                <TouchableOpacity
                  style={{
                    aspectRatio: 1,
                    height: 30,
                    borderRadius: 4,
                    backgroundColor: Color.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                  }}
                  onPress={() =>
                    isWalletClose
                      ? openVesta()
                      : navigation.navigate('TopUpScreen')
                  }>
                  <Ionicons
                    name="add"
                    color={Color.textInput}
                    size={26}
                    style={{marginLeft: 2, marginTop: 2}}
                  />
                </TouchableOpacity>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text size={9} type="medium" color={Color.text}>
                    Saldo
                  </Text>
                </View>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 16,
                }}>
                <TouchableOpacity
                  style={{
                    aspectRatio: 1,
                    height: 30,
                    borderRadius: 4,
                    backgroundColor: Color.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                  }}
                  onPress={() =>
                    navigation.navigate('CreatePanicScreen', {
                      title: 'Panic Button',
                      productType: 'TRIBES',
                      productCategory: 'SCENE',
                      productSubCategory: 'SURPRISE',
                    })
                  }>
                  <Ionicons
                    name="information"
                    color={Color.textInput}
                    size={22}
                    style={{marginLeft: 2, marginTop: 2}}
                  />
                </TouchableOpacity>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text size={9} type="medium" color={Color.text}>
                    Panic!
                  </Text>
                </View>
              </View>
            </View>
          </BalanceView>
        </ContentView>

        <ContentView>
          <SambatanMenuView
            style={{...shadowStyle, backgroundColor: Color.textInput}}>
            {sambatanMenus.map((menu, idx) => {
              if (Platform.OS === 'ios' && menu.comingsoon) {
                return null;
              }

              return (
                <PerUserIcons
                  key={idx}
                  activeOpacity={0.75}
                  disabled={menu.comingsoon}
                  onPress={() => navigation.navigate(menu.nav, menu.params)}>
                  <UserIcon>
                    <ImageProperty
                      style={menu.comingsoon && {opacity: 0.3}}
                      resizeMode="contain"
                      source={menu.images}
                    />
                    <Text size={12} style={menu.comingsoon && {opacity: 0.3}}>
                      {menu.name}
                    </Text>
                    {(menu.comingsoon || menu.nav === '') && renderComingSoon()}
                  </UserIcon>
                </PerUserIcons>
              );
            })}
          </SambatanMenuView>
        </ContentView>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginTop: 16,
          }}>
          {/* <Text type='bold'>Acara Terbaru</Text> */}
          {/* {showAll && <Text onPress={() => onPressShowAll()} size={12} color={Color.primary}>Lihat Semua <Ionicons name='arrow-forward' size={12} color={Color.primary} /></Text>} */}
        </View>
        <CarouselView
          delay={5000}
          showIndicator
          style={{width, aspectRatio: 3 / 1}}>
          {listTampil.map((e, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {}}
              style={{width: width - 32, height: '100%'}}>
              <Image
                source={{uri: e.image}}
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'cover',
                  borderRadius: 8,
                  backgroundColor: Color.borderSoft,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </CarouselView>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginTop: 30,
          }}>
          <Text type="bold">Panic Button</Text>
          <Text
            onPress={() =>
              navigation.navigate('NewsScreen', {title: 'Panic Button'})
            }
            size={12}
            color={Color.primary}>
            Lihat Semua{' '}
            <Ionicons name="arrow-forward" size={12} color={Color.primary} />
          </Text>
        </View>
        <ListNews
          data={listPanicButton}
          horizontal
          onPress={(item) => {
            navigation.navigate('NewsDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginTop: 30,
          }}>
          <Text type="bold">Postingan Saat Ini</Text>
          <Text
            onPress={() =>
              navigation.navigate('NewsScreen', {title: 'Postingan Saat Ini'})
            }
            size={12}
            color={Color.primary}>
            Lihat Semua{' '}
            <Ionicons name="arrow-forward" size={12} color={Color.primary} />
          </Text>
        </View>
        <ListNews
          data={listTampil}
          horizontal
          onPress={(item) => {
            navigation.navigate('NewsDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}>
          <Text type="bold">Tempat Terdekat</Text>
          <Text
            onPress={() => navigation.navigate('PlaceScreen')}
            size={12}
            color={Color.primary}>
            Lihat Semua{' '}
            <Ionicons name="arrow-forward" size={12} color={Color.primary} />
          </Text>
        </View>
        <ListPlace
          data={listJalanJalan}
          horizontal
          onPress={(item) => {
            navigation.navigate('PlaceDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: 8,
          }}>
          <Text type="bold">Event Terbaru</Text>
          <Text
            onPress={() => navigation.navigate('WorkshopScreen')}
            size={12}
            color={Color.primary}>
            Lihat Semua{' '}
            <Ionicons name="arrow-forward" size={12} color={Color.primary} />
          </Text>
        </View>
        <ListWorkshop
          data={listBelajar}
          horizontal
          showHeader={false}
          onPress={(item) => {
            navigation.navigate('WorkshopDetail', {item});
          }}
          style={{paddingBottom: 8}}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: 8,
          }}>
          <Text type="bold">Lowongan Pekerjaan</Text>
          <Text
            onPress={() => navigation.navigate('JobScreen')}
            size={12}
            color={Color.primary}>
            Lihat Semua{' '}
            <Ionicons name="arrow-forward" size={12} color={Color.primary} />
          </Text>
        </View>
        <ListJob
          data={listKerja}
          horizontal={false}
          showHeader={false}
          onPress={(item) => {
            navigation.navigate('JobDetail', {item});
          }}
          style={{paddingBottom: 8}}
        />
      </ScrollView>

      <Loading {...loadingProps} />
    </MainView>
  );
};

export default MainHome;

import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Image, useWindowDimensions} from 'react-native';
import Styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';

import {
  Text,
  TouchableOpacity,
  HeaderBig,
  Loading,
  useLoading,
  useColor,
  Scaffold,
} from '@src/components';
import {FormatMoney} from '@src/utils';
import ListNews from 'src/components/Posting/ListNews';
import ListPlace from 'src/components/Posting/ListPlace';
import ListWorkshop from 'src/components/Posting/ListWorkshop';
import ListJob from 'src/components/Posting/ListJob';
import {shadowStyle} from '@src/styles';
import {Box, Divider, MainView} from '@src/styled';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
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
import ModalPosting from './ModalPosting';
import ListEmergency from 'src/components/Posting/ListEmergency';

const ContentView = Styled(View)`
  width: 100%;
  paddingHorizontal: 16px;
`;

const BalanceView = Styled(View)`
  width: 100%;
  borderRadius: 8px;
  flexDirection: row;
  justifyContent: space-between;
  padding: 18px 16px 16px;
`;

const SambatanMenuView = Styled(View)`
  width: 100%;
  borderRadius: 8px;
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
  
  {id: 0, name: 'Pulsa', images: iconPulsa, nav: 'PulsaScreen', params: {}},
  {id: 1, name: 'Listrik', images: iconPLN, nav: 'PlnScreen', params: {}},
  // {id: 2, name: 'Game', images: iconGames, nav: '', params: {}},
  {id: 3, name: 'PDAM', images: iconPDAM, nav: 'PdamScreen', params: {}},
  // {id: 4, name: 'BPJS', images: iconBPJS, nav: '', params: {}},
  // {
  //   id: 5, 
  //   name: 'Internet', 
  //   images: iconInternet, 
  //   nav: '', 
  //   params: {title: 'Iuran Non-wajib', type: 'ACTIVE', productType: 'SAMBATAN_O',}},
  {
    id: 6,
    name: 'Iuran',
    images: iconIuran,
    nav: 'OrderListPerProduct',
    params: {title: 'Iuran', type: 'ACTIVE', productType: 'ALL_SAMBATAN'},
  },
  // {
  //   id: 7, 
  //   name: 'Semua', 
  //   images: iconSemua, 
  //   nav: '', 
  //   params: {title: 'Iuran Non-wajib', type: 'ACTIVE', productType: 'SAMBATAN_O',}},
];

const MainHome = ({navigation, route}) => {
  // state
  const [vestaAmount, setVestaAmount] = useState(0);
  const [wallet, setWallet] = useState('CLOSE');

  const [loadingEmergency, setLoadingEmergency] = useState(true);
  const [listEmergencyArea, setListEmergencyArea] = useState([]);

  const [loadingTampil, setLoadingTampil] = useState(true);
  const [listTampil, setListTampil] = useState([]);

  const [loadingJalanJalan, setLoadingJalanJalan] = useState(true);
  const [listJalanJalan, setListJalanJalan] = useState([]);

  const [loadingBelajar, setLoadingBelajar] = useState(true);
  const [listBelajar, setListBelajar] = useState([]);

  const [loadingKerja, setLoadingKerja] = useState(true);
  const [listKerja, setListKerja] = useState([]);

  const user = useSelector((state) => state['user.auth'].login.user);
  const dispatch = useDispatch();

  const {Color} = useColor();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const {width} = useWindowDimensions();
  const isFocused = useIsFocused();
  const modalPostingRef = useRef();

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
    const result = await Promise.all([
      await fetchContentProduct('TRIBES', 'SCENE', ''),
      await fetchContentProduct('TRIBES', '', 'TRIBES_TAMPIL'),
      await fetchContentProduct('TRIBES', '', 'TRIBES_JALAN_JALAN'),
      await fetchContentProduct('TRIBES', '', 'TRIBES_BELAJAR'),
      await fetchContentProduct('TRIBES', '', 'TRIBES_KERJA'),
    ]);

    setLoadingEmergency(false);
    setListEmergencyArea(result[0]);

    setLoadingTampil(false);
    setListTampil(result[1]);

    setLoadingJalanJalan(false);
    setListJalanJalan(result[2]);

    setLoadingBelajar(false);
    setListBelajar(result[3]);

    setLoadingKerja(false);
    setListKerja(result[4]);
  };
  

  const fetchContentProduct = async (
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
      query: queryContentProduct,
      variables,
    });

    if (
      result &&
      result.data &&
      result.data.contentProduct &&
      Array.isArray(result.data.contentProduct)
    ) {
      return result.data.contentProduct;
    } else {
      return [];
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
    <Scaffold
      loadingProps={loadingProps}
      header={
        <HeaderBig
          style={{paddingTop: 8}}
          actions={
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('NotificationScreen');
                }}
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
              {/* <TouchableOpacity
                onPress={() => {}}
                style={{
                  width: '20%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                }}>
                <Ionicons name="chatbox-outline" size={22} color={Color.text} />
              </TouchableOpacity> */}
            </View>
          }
        />
      }
    >
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
            source={{uri: user ? user.image : ''}}
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
              <Text size={10}>Saldoku</Text>
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
                    backgroundColor: Color.info,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                  }}
                  onPress={() => {
                    modalPostingRef.current.open();
                  }}>
                  <MaterialIcons
                    name="post-add"
                    color={Color.textInput}
                    size={20}
                  />
                </TouchableOpacity>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text size={9} type="medium" color={Color.text}>
                    Posting
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
                    backgroundColor: Color.green,
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
                    size={24}
                  />
                </TouchableOpacity>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <Text size={9} type="medium" color={Color.text}>
                    Top Up
                  </Text>
                </View>
              </View>
            </View>
          </BalanceView>
        </ContentView>

        <Divider height={8} />

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

        <Divider height={24} />

        <ListEmergency
          data={listEmergencyArea}
          loading={loadingEmergency}
          horizontal
          showHeader
          onPress={(item) => {
            navigation.navigate('EmergencyDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <ListNews
          data={listTampil}
          loading={loadingTampil}
          horizontal
          showHeader
          onPress={(item) => {
            navigation.navigate('NewsDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <ListPlace
          data={listJalanJalan}
          loading={loadingJalanJalan}
          horizontal
          showHeader
          onPress={(item) => {
            navigation.navigate('PlaceDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <ListWorkshop
          data={listBelajar}
          loading={loadingBelajar}
          horizontal
          showHeader
          onPress={(item) => {
            navigation.navigate('WorkshopDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />

        <ListJob
          data={listKerja}
          loading={loadingKerja}
          horizontal
          showHeader
          onPress={(item) => {
            navigation.navigate('JobDetail', {item});
          }}
          style={{paddingLeft: 8}}
        />
      </ScrollView>

      {/* android - untuk mencegah klik laundry bag yang belakang ikut ter klik */}
      <Box
          size={70}
          style={{position: 'absolute', bottom: -40}}
      />
      {/*  */}

      <ModalPosting
          ref={modalPostingRef}
          selected={null}
          onPress={(e) => {
            navigation.navigate(e.nav, e.params);
            modalPostingRef.current.close();
          }}
      />
    </Scaffold>
  );
};

export default MainHome;

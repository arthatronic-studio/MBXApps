import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, SafeAreaView, Platform, Image } from 'react-native';
import Styled from 'styled-components';
import Moment from 'moment';
import { useDispatch } from 'react-redux';
import { Portal } from 'react-native-portalize';

import { useColor } from '@src/components/Color';
import Text from '@src/components/Text';
import { TouchableOpacity } from '@src/components/Button';
import TabScreenPerProduct from './TabScreenPerProduct';

import graphClient from '@src/lib/apollo';
import { queryCurrentUserBookings } from '@src/lib/query';

import {
  iconApp,
} from '@assets/images';

const MainView = Styled(View)`
  flex: 1;
`;

const SafeModalView = Styled(SafeAreaView)`
  flex: 1;
  alignItems: center;
  justifyContent: flex-end;
  backgroundColor: rgba(0, 0, 0, 0.4);
`;

const OptionsContainerModalView = Styled(View)`
  width: 94%;
  minHeight: 1;
  paddingHorizontal: 12;
  borderRadius: 5;
`;

const BottomOptionsContainerModalView = Styled(OptionsContainerModalView)`
  marginVertical: 8px;
`;

const OptionModalView = Styled(TouchableOpacity)`
  width: 100%;
  height: 60;
  justifyContent: center;
  alignItems: center;
  borderBottomWidth: 0.5;
  borderColor: #DDDDDD;
`;

const ContainerIndicator = Styled(View)`
  borderWidth: ${Platform.OS === 'android' ? '5px' : '0px'};
  borderRadius: 25px;
  height: 50px;
  width: 50px;
  justifyContent: center;
  alignItems: center;
`;

let pureState = {
  page: 0,
  data: [],
  loading: true,
  loadNext: false,
};

const DontForgetYourBilling = (props) => {
  const {
    productType,
    type,
    reload,
    limit,
    stopNextFetch,
    navigation,
  } = props;

  const [modalOptions, setModalOptions] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState();
  const [dataUserBookings, setDataUserBookings] = useState(pureState);

  const dispatch = useDispatch();
  const { Color } = useColor();

  useEffect(() => {
    getUserBookings();
  }, []);

  useEffect(() => {
    if (reload) {
      console.log('reload');
      pullRefresh();
    }
  }, [reload]);

  const getUserBookings = () => {
    const { page } = dataUserBookings;

    console.log('heheheheh');

    const variables = {
      page: page + 1,
      itemPerPage: 10,
    };

    if (productType) {
      variables.productType = productType;
    }

    if (type) {
      variables.type = type;
    }

    console.log(variables, 'variables');
    
    graphClient.query({
      query: queryCurrentUserBookings,
      variables
    })
    .then(res => {
      let response = res.data.currentUserBookings;
      refresher(dataUserBookings.data.concat(response));
    })
    .catch((err) => {
      setDataUserBookings({ ...dataUserBookings, page: -1, loading: false });
    });
  }

  const pullRefresh = () => {
    setDataUserBookings(pureState);
    getUserBookings();
  }

  const refresher = (data) => {
    let remapUserBooking = [];

    if (data.length > 0) {
      for (const resp of data) {
        if (resp.vestaBiller) {
          remapUserBooking.push(resp);
        } else {
          if (Moment(resp.expiresAt).diff(Moment(), 'seconds') > 0) remapUserBooking.push(resp);
        }
      }
    }

    if (limit) {
      remapUserBooking.splice(limit, remapUserBooking.length - limit);
    }

    setDataUserBookings({ ...dataUserBookings, data: remapUserBooking, loading: false });
  }

  const getMoreResult = () => {
    const { page } = dataUserBookings;
    let newData = { ...dataUserBookings, page: page + 1 };
    
    if (stopNextFetch) {
      return;
    } else {
      setDataUserBookings(newData);
      getUserBookings();
    }
  }

  const payBooking = () => {
    closeModal();
    dispatch({ type: 'BOOKING.ADD_BOOKING', data: selectedBooking });
    navigation.navigate('PaymentScreen');
  }

  const detailBooking = () => {
    closeModal();
    const { prepaidTransaction } = selectedBooking;
    let navigateScreen = null;

    let prepaidCategory = null;
    if (prepaidTransaction) prepaidCategory = prepaidTransaction.category;

    if (selectedBooking.flights.length > 0) navigateScreen = 'FlightOrderDetail';
    else if (selectedBooking.tours.length > 0) navigateScreen = 'TourOrderDetail';
    else if (selectedBooking.attractions) navigateScreen = 'AttractionOrderDetail';
    else if (selectedBooking.buses) navigateScreen = 'BusOrderDetail';
    else if (selectedBooking.vestabalance) navigateScreen = 'TopUpOrderDetail';
    else if (selectedBooking.hotels && selectedBooking.contact) navigateScreen = 'HotelOrderDetail';
    else if (prepaidCategory == 'PULSA_HP') navigateScreen = 'PulsaPrabayarOrderDetail';
    else if (prepaidCategory == 'TOKEN_LISTRIK') navigateScreen = 'PlnPrabayarOrderDetail';

    if (navigateScreen) navigation.navigate(navigateScreen, { booking: selectedBooking });
    else alert('Order not available');
  }

  const openModal = (item) => {
    setModalOptions(true);
    setSelectedBooking(item);
  }

  const closeModal = () => {
    setModalOptions(false);
    setSelectedBooking();
  }

  const renderModal = () => {
    const bookingStatusId = selectedBooking && selectedBooking.bookingStatus.id;

    let activeBooking = false;

    if (selectedBooking && (bookingStatusId === 1 || bookingStatusId === 2) && Moment(selectedBooking.expiresAt).diff(Moment(), 'seconds') > 0) {
      activeBooking = true;
    }

    return (
      <SafeModalView>
        <TouchableOpacity
          onPress={() => closeModal()}
          style={{height: '80%', width: '100%' }}
        />

        <OptionsContainerModalView style={{backgroundColor: Color.theme}}>
          {activeBooking && <OptionModalView onPress={() => payBooking()}>
            <Text type='medium'>Lanjutkan Pembayaran</Text>
          </OptionModalView>}
          <OptionModalView onPress={() => detailBooking()}>
            <Text type='medium'>Detail Pesanan</Text>
          </OptionModalView>
        </OptionsContainerModalView>

        <BottomOptionsContainerModalView style={{backgroundColor: Color.theme}}>
          <OptionModalView onPress={() => closeModal()}>
            <Text type='medium'>Cancel</Text>
          </OptionModalView>
        </BottomOptionsContainerModalView>
      </SafeModalView>
    );
  }

  if (dataUserBookings.loading) {
    return (
      <View style={{paddingTop: 16, paddingBottom: 32, alignItems: 'center'}}>
        <ContainerIndicator style={{
          borderColor: Color.primary
        }}>
          {Platform.OS === 'android' && <Image
            source={iconApp}
            style={{height: 30, width: 30}}
            resizeMode='contain'
          />}
          <ActivityIndicator
            size={Platform.OS === 'android' ? 60 : 'large'}
            color={Platform.OS === 'android' ? Color.border : Color.primary}
            style={{position: 'absolute'}}
          />
        </ContainerIndicator>
      </View>
    )
  }

  console.log('variables', 'variables');

  return (
    <MainView>
      <TabScreenPerProduct
        getMoreResult={() => getMoreResult()}
        bookings={dataUserBookings.data}
        onRefresh={() => pullRefresh()}
        onExpired={() => refresher(dataUserBookings.data)}
        openModal={(_, booking) => openModal(booking)}
        loading={dataUserBookings.loading}
        navigation={navigation}
        isComponent
        detail={false}
        style={{
          paddingHorizontal: 16,
          backgroundColor: Color.theme,
        }}
      />

      {modalOptions && <Portal>
        {renderModal()}
      </Portal>}
    </MainView>
  )
}

export default DontForgetYourBilling;
import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import Moment from 'moment';
import { useDispatch } from 'react-redux';
import { Modalize } from 'react-native-modalize';
import { useIsFocused } from '@react-navigation/native';

import { useColor } from '@src/components/Color';
import Text from '@src/components/Text';
import HeaderBig from '@src/components/HeaderBig';
import Scaffold from '@src/components/Scaffold';
import { TouchableOpacity } from '@src/components/Button';
import TabScreenPerProduct from '@src/screens/MyBooking/TabScreenPerProduct';

import graphClient from '@src/lib/apollo';
import { getOptionsProduct } from '@src/utils/getOptionsProduct';
import { queryCurrentUserBookings } from '@src/lib/query/booking';

const SafeModalView = Styled(SafeAreaView)`
    flex: 1;
    alignItems: center;
    justifyContent: flex-end;
    marginBottom: 8px;
`;

const OptionsContainerModalView = Styled(View)`
    width: 94%;
    minHeight: 1;
    backgroundColor: #FFFFFF;
    paddingHorizontal: 12;
    borderRadius: 5;
`;

const BottomOptionsContainerModalView = Styled(OptionsContainerModalView)`
    marginTop: 10;
`;

const OptionModalView = Styled(TouchableOpacity)`
    width: 100%;
    height: 60;
    justifyContent: center;
    alignItems: center;
    borderBottomWidth: 0.5;
    borderColor: #DDDDDD;
`;

const NormalText = Styled(Text)`
    fontSize: 14;
`;

let pureState = {
  page: 1,
  itemPerPage: 15,
  currentUserBookings: [],
  lengthData: 0,
  loading: true,
};

const MainHistory = ({ navigation, route }) => {
  const [selectedBooking, setSelectedBooking] = useState();
  const [dataUserBookings, setDataUserBookings] = useState(pureState);

  const dispatch = useDispatch();
  const { Color } = useColor();
  const isFocused = useIsFocused();

  const modalRef = useRef();

  useEffect(() => {
    getUserBookings();
  }, [isFocused]);

  const getUserBookings = () => {
    const {
      currentUserBookings,
      page,
      itemPerPage,
    } = dataUserBookings;

    const variables = {
      page,
      itemPerPage,
    };

    if (route.params.type) {
      variables.type = route.params.type;
    }

    if (route.params.productType) {
      variables.productType = route.params.productType;
    }

    let newData = {
      ...dataUserBookings,
      loading: true,
    };

    setDataUserBookings(newData);

    graphClient
      .query({
        query: queryCurrentUserBookings,
        variables
      })
      .then(res => {
        console.log(res, 'res booking', variables);
        
        let response = res.data.currentUserBookings;
        let tempArray = currentUserBookings;

        if (response.length > 0) {
          tempArray = currentUserBookings.concat(response);
        }

        onCheckData(tempArray, response.length);
      })
      .catch((reject) => {
        console.log(reject, 'reject booking');
        onCheckData();
      });
  }

  const pullToRefresh = () => {
    setDataUserBookings(pureState);
    getUserBookings();
  }

  const onCheckData = (arr, length) => {
    let remapUserBooking = [];

    if (arr) {
        if (arr.length > 0) {
            for (const resp of arr) {
              // if (resp.vestaBiller) {
                remapUserBooking.push(resp);
              // } else {
              //   if (Moment(resp.expiresAt).diff(Moment(), 'seconds') > 0) remapUserBooking.push(resp);
              // }
            }
        }

        setDataUserBookings({
            ...dataUserBookings,
            currentUserBookings: remapUserBooking,
            lengthData: length,
            loading: false,
        });
    } else {
        if (dataUserBookings.currentUserBookings.length > 0) {
            for (const resp of dataUserBookings.currentUserBookings) {
              // if (resp.vestaBiller) {
                remapUserBooking.push(resp);
              // } else {
              //   if (Moment(resp.expiresAt).diff(Moment(), 'seconds') > 0) remapUserBooking.push(resp);
              // }
            }
        }

        setDataUserBookings({
            ...dataUserBookings,
            currentUserBookings: remapUserBooking,
            loading: false,
        });
    }
  }

  const getMoreResult = () => {
    const { page, lengthData, itemPerPage } = dataUserBookings;
    let newData = { ...dataUserBookings, page: page + 1 };
    
    if (lengthData < itemPerPage) {
      return;
    } else {
      setDataUserBookings(newData);
      getUserBookings();
    }
  }

  const payBooking = () => {
    if (!selectedBooking) return;

    closeModal();

    dispatch({ type: 'BOOKING.ADD_BOOKING', data: selectedBooking.booking });

    navigation.navigate('PaymentScreen', { canGoBack: true });
  }

  const detailBooking = () => {
    if (!selectedBooking) return;

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
    else if (prepaidCategory == 'PULSA_HP') navigateScreen = 'PrepaidOrderDetail';
    else if (prepaidCategory == 'PAKET_DATA') navigateScreen = 'PrepaidOrderDetail';
    else if (prepaidCategory == 'TOKEN_LISTRIK') navigateScreen = 'PrepaidOrderDetail';
    else if (getOptionsProduct(selectedBooking).productType === 'PULSAPOSTPAID') navigateScreen = 'PostpaidOrderDetail';
    else if (getOptionsProduct(selectedBooking).productType === 'PLNPOSTPAID') navigateScreen = 'PostpaidOrderDetail';
    else if (getOptionsProduct(selectedBooking).productType === 'PDAMPOSTPAID') navigateScreen = 'PostpaidOrderDetail';

    if (navigateScreen) navigation.navigate(navigateScreen, { booking: selectedBooking });
    else alert('Order not available');
  }

  const openModal = (item) => {
    setSelectedBooking(item);
    modalRef.current.open();
  }

  const closeModal = () => {
    setSelectedBooking();
    modalRef.current.close();
  }

  const renderModal = () => {
    const bookingStatusId = selectedBooking && selectedBooking.bookingStatus.id;

    let activeBooking = false;

    if (selectedBooking && (bookingStatusId === 1 || bookingStatusId === 2) && Moment(selectedBooking.expiresAt).diff(Moment(), 'seconds') > 0) {
      activeBooking = true;
    }

    return (
      <SafeModalView>
        <OptionsContainerModalView>
          {activeBooking && <OptionModalView onPress={() => payBooking()}>
            <NormalText type='medium'>Lanjutkan Pembayaran</NormalText>
          </OptionModalView>}
          <OptionModalView onPress={() => detailBooking()}>
            <NormalText type='medium'>Detail Pesanan</NormalText>
          </OptionModalView>
        </OptionsContainerModalView>

        <BottomOptionsContainerModalView>
          <OptionModalView onPress={() => closeModal()}>
            <NormalText type='medium'>Cancel</NormalText>
          </OptionModalView>
        </BottomOptionsContainerModalView>
      </SafeModalView>
    );
  }

  const loading = (dataUserBookings.currentUserBookings.length === 0 && dataUserBookings.loading);

  console.log(dataUserBookings, 'dataUserBookings');
  
  return (
    <Scaffold
      fallback={loading}
      header={<HeaderBig title='Riwayat Pesanan' color={Color.textInput} />}
    >
      {!loading && <TabScreenPerProduct
        bookings={dataUserBookings.currentUserBookings}
        getMoreResult={() => getMoreResult()}
        onRefresh={() => pullToRefresh()}
        // onExpired={() => onCheckData()}
        openModal={(_, booking) => openModal(booking)}
        loading={loading}
        navigation={navigation}
        style={{
          paddingHorizontal: 16,
          paddingTop: dataUserBookings.currentUserBookings.length > 0 ? 16 : 0,
        }}
      />}

      <Modalize
        ref={modalRef}
        adjustToContentHeight
        handleStyle={{height: 0}}
        overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
        modalStyle={{
          backgroundColor: Color.theme
        }}
      >
        {renderModal()}
      </Modalize>
    </Scaffold>
  );
}

export default MainHistory;
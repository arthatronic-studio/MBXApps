import React, { Component } from 'react';
import { View, ActivityIndicator, SafeAreaView } from 'react-native';
import Moment from 'moment';
import { connect } from 'react-redux';
import { Modalize } from 'react-native-modalize';

import Color from '@src/components/Color';
import Text from '@src/components/Text';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';

import TabScreenPerProduct from './TabScreenPerProduct';

import graphClient from '@src/lib/apollo';
import { getOptionsProduct } from '@src/utils/getOptionsProduct';
import { queryCurrentUserBookings } from '@src/lib/query/booking';
import { Scaffold } from 'src/components';

const initialBookingState = {
  requestId: 0,
  page: 1,
  itemPerPage: 15,
  currentUserBookings: [],
  lengthData: 0,
  loading: true,
};

class OrderListPerProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      modal: false,
      selectedBooking: null,
      tabs: [
        { title: 'Aktif', children: <View /> },
        { title: 'Selesai', children: <View /> },
        { title: 'Dibatalkan', children: <View /> },
      ],
      dataUserBookings: { ...initialBookingState },
    };
  }

  componentDidMount() {
    this.getUserBookings();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.reload !== nextProps.reload && nextProps.reload) {
      this.pullToRefresh();
    }
  }

  getUserBookings() {
    const {
      currentUserBookings,
      requestId,
      page,
      itemPerPage,
    } = this.state.dataUserBookings;

    const reqId = requestId + 1;
    const variables = {
      page,
      itemPerPage,
    };

    if (this.props.route.params.type) {
      variables.type = this.props.route.params.type;
    }

    if (this.props.route.params.productType) {
      variables.productType = this.props.route.params.productType;
    }

    let newData = {
      ...this.state.dataUserBookings,
      requestId: reqId,
      loading: true
    };

    console.log('variables', variables);

    this.setState({ dataUserBookings: newData }, () => {
      graphClient
      .query({
        query: queryCurrentUserBookings,
        variables
      })
      .then(res => {
        console.log(res, 'res booking');
        
        let response = res.data.currentUserBookings;
        let tempArray = currentUserBookings;

        if (response.length > 0 && reqId == this.state.dataUserBookings.requestId) {
          tempArray = currentUserBookings.concat(response);
        }

        newData = {
          ...this.state.dataUserBookings,
          lengthData: response.length,
          currentUserBookings: tempArray,
        }

        this.setState({ dataUserBookings: newData }, () => this.onChackData());
      })
      .catch((reject) => {
        console.log(reject, 'reject booking');
        this.setState({
          dataUserBookings: { ...this.state.dataUserBookings },
        }, () => this.onChackData());
      });
    });
  }

  pullToRefresh() {
    this.setState({
      dataUserBookings: { ...initialBookingState }
    }, () => {
      this.getUserBookings();
    });
  }

  onChackData() {
    const { dataUserBookings } = this.state;
    let remapUserBooking = [];

    if (dataUserBookings.currentUserBookings.length > 0) {
      for(const resp of dataUserBookings.currentUserBookings) {
        // if (resp.vestaBiller) {
          remapUserBooking.push(resp);
        // } else {
        //   if (Moment(resp.expiresAt).diff(Moment(), 'seconds') > 0) remapUserBooking.push(resp);
        // }
      }
    }

    // const onRefresh = () => this.pullToRefresh();
    // const onExpired = () => this.onChackData();
    // const getMoreActiveBookings = () => this.getMoreResult();

    this.setState({
      dataUserBookings: { ...this.state.dataUserBookings, currentUserBookings: remapUserBooking, loading: false },
      // tabs: [
      //   { title: 'Aktif', children: <TabScreenPerProduct getMoreResult={getMoreActiveBookings} bookings={remapUserBooking} status={1} onRefresh={onRefresh} onExpired={onExpired} openModal={(booking) => this.openModal(1, booking)} /> },
      //   { title: 'Selesai', children: <TabScreenPerProduct getMoreResult={getMoreActiveBookings} bookings={remapUserBooking} status={2} onRefresh={onRefresh} onExpired={onExpired} openModal={(booking) => this.openModal(2, booking)} /> },
      //   { title: 'Dibatalkan', children: <TabScreenPerProduct getMoreResult={getMoreActiveBookings} bookings={remapUserBooking} status={3} onRefresh={onRefresh} onExpired={onExpired} openModal={(booking) => this.openModal(3, booking)} /> },
      // ]
    });
  }

  getMoreResult() {
    const { page, lengthData, itemPerPage } = this.state.dataUserBookings;
    let newData = { ...this.state.dataUserBookings, page: page + 1 };
    
    if (lengthData < itemPerPage) {
      return;
    } else {
      this.setState({ dataUserBookings: newData }, () => {
        this.getUserBookings();
      })
    }
  }

  payBooking() {
    const booking = this.state.selectedBooking;
    this.closeModal();
    this.props.addBooking(booking);
    this.props.navigation.navigate('PaymentScreen', { canGoBack: true });
  }

  detailBooking() {
    this.closeModal();

    const { prepaidTransaction } = this.state.selectedBooking;
    let navigateScreen = null;

    let prepaidCategory = null;
    if (prepaidTransaction) prepaidCategory = prepaidTransaction.category;

    if (this.state.selectedBooking.flights.length > 0) navigateScreen = 'FlightOrderDetail';
    else if (this.state.selectedBooking.tours.length > 0) navigateScreen = 'TourOrderDetail';
    else if (this.state.selectedBooking.attractions) navigateScreen = 'AttractionOrderDetail';
    else if (this.state.selectedBooking.buses) navigateScreen = 'BusOrderDetail';
    else if (this.state.selectedBooking.vestabalance) navigateScreen = 'TopUpOrderDetail';
    else if (this.state.selectedBooking.hotels && this.state.selectedBooking.contact) navigateScreen = 'HotelOrderDetail';
    else if (prepaidCategory == 'PULSA_HP') navigateScreen = 'PrepaidOrderDetail';
    else if (prepaidCategory == 'PAKET_DATA') navigateScreen = 'PrepaidOrderDetail';
    else if (prepaidCategory == 'TOKEN_LISTRIK') navigateScreen = 'PrepaidOrderDetail';
    else if (getOptionsProduct(this.state.selectedBooking).productType === 'PULSAPOSTPAID') navigateScreen = 'PostpaidOrderDetail';
    else if (getOptionsProduct(this.state.selectedBooking).productType === 'PLNPOSTPAID') navigateScreen = 'PostpaidOrderDetail';
    else if (getOptionsProduct(this.state.selectedBooking).productType === 'PDAMPOSTPAID') navigateScreen = 'PostpaidOrderDetail';

    if (navigateScreen) this.props.navigation.navigate(navigateScreen, { booking: this.state.selectedBooking });
    else alert('Order not available');
  }

  openModal(selectedBooking) {
    this.setState({ selectedBooking }, () => {
      this.modalRef.open();
    });
  }

  closeModal() {
    this.setState({ selectedBooking: null }, () => {
      this.modalRef.close();
    });
  }

  renderModal() {
    const { selectedBooking } = this.state;
    const bookingStatusId = selectedBooking && selectedBooking.bookingStatus.id;

    let activeBooking = false;

    if (selectedBooking && (bookingStatusId === 1 || bookingStatusId === 2) && Moment(selectedBooking.expiresAt).diff(Moment(), 'seconds') > 0) {
      activeBooking = true;
    }

    const buttonStyle = {
      borderBottomWidth: 0.5,
      borderColor: Color.border,
      paddingVertical: 16,
    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: 8,
        }}
      >
        <View
          style={{
            width: '100%',
            paddingHorizontal: 12,
            borderRadius: 5,
          }}
        >
          {activeBooking && (
            <TouchableOpacity
              onPress={() => this.payBooking()}
              style={buttonStyle}
            >
              <Text type='medium'>Lanjutkan Pembayaran</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => this.detailBooking()}
            style={buttonStyle}
          >
            <Text type='medium'>Detail Pesanan</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '100%',
            paddingHorizontal: 12,
            borderRadius: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => this.closeModal()}
            style={buttonStyle}
          >
            <Text type='medium'>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  renderLoading() {
    const { dataUserBookings } = this.state;
    if (dataUserBookings.currentUserBookings.length > 4 && dataUserBookings.loading) {
      return <ActivityIndicator color={Color.text} style={{paddingBottom: 4}} />
    }
  }

  navigateTo(nav, item) {
    this.props.navigation.navigate(nav, item);
  }

  modalRef;

  render() {
    const { dataUserBookings } = this.state;
    const { route, navigation } = this.props;

    const title = route.params.title || '';
    const showCreateBilllingButton = route.params.productType === 'SAMBATAN' || route.params.productType === 'SAMBATAN_O';

    const loading = (dataUserBookings.currentUserBookings.length === 0 && dataUserBookings.loading);

    return (
      <Scaffold
        headerTitle={title}
        fallback={loading}
      >
        {!loading && <TabScreenPerProduct
          getMoreResult={() => this.getMoreResult()}
          bookings={dataUserBookings.currentUserBookings}
          onRefresh={() => this.pullToRefresh()}
          onExpired={() => this.onChackData()}
          openModal={(n, booking) => this.openModal(booking)}
          loading={loading}
          navigation={this.props.navigation}
          style={{
            paddingHorizontal: 16,
            backgroundColor: Color.theme,
            paddingTop: dataUserBookings.currentUserBookings.length > 0 ? 16 : 0,
          }}
        />}

        {this.renderLoading()}

        <Modalize
          ref={(refs) => this.modalRef = refs}
          adjustToContentHeight
          handleStyle={{height: 0}}
          overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
          modalStyle={{
            backgroundColor: Color.theme
          }}
        >
          {this.renderModal()}
        </Modalize>
      </Scaffold>
    );
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch, props) => ({
  addBooking: (data) => dispatch({ type: 'BOOKING.ADD_BOOKING', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderListPerProduct);

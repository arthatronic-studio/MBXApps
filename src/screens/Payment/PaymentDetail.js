import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, ScrollView, Modal, Platform } from 'react-native';
import Styled from 'styled-components';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FormatMoney from '@src/utils/FormatMoney';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Button from '@src/components/Button/Button';
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Header from '@src/components/Header';
import Footer from '@src/components/Footer';
import Popup, { usePopup } from '@src/components/Modal/Popup';
import Loading, { useLoading } from '@src/components/Modal/Loading';
import WebViewScreen from '@src/components/WebViewScreen';

import Client from '@src/lib/apollo';
import { queryCheckBookingStatus } from '@src/lib/query/booking';
import { queryVoucherCheck, queryPay } from '@src/lib/query/payment';
import { MainView } from '@src/styled';

const ContainerVoucherView = Styled(TouchableOpacity)`
  width: 340;
  minHeight: 1;
  flexDirection: column;
  justifyContent: center;
  alignItems: center;
  paddingHorizontal: 20;
  borderRadius: 3;
`;

const MainVoucherView = Styled(TouchableOpacity)`
  width: 100%;
  height: 100%;
  justifyContent: center;
  alignItems: center;
  backgroundColor: rgba(0, 0, 0, 0.4);
`;

const AbsoluteView = Styled(View)`
  position: absolute
  top: 50;
  width: 100%;
  zIndex: 1;
`;

const HeaderView = Styled(View)`
  height: 92px
  margin: 0px 15px
  elevation: 5px
  justifyContent: center
  borderWidth: ${Platform.OS === 'ios' ? 1 : 0 };
  borderColor: #DDDDDD;
  borderBottomWidth: ${Platform.OS === 'ios' ? 2 : 0 };
`;

const PriceView = Styled(View)`
  flexDirection: row
  padding: 0px 15px
  height: 73px
  width: 100% 
`;

const PriceViewWithBackground = Styled(PriceView)`
  flexDirection: column
  alignItems: flex-start;
  height: 60%;
`;

const VoucherBackground = Styled(View)`
  flexDirection: row;
  alignItems: flex-start;
`;

const LeftHeaderView = Styled(View)`
  minWidth: 1;
  minHeight: 1;
  alignItems: flex-start
`;

const RightHeaderView = Styled(TouchableOpacity)`
  flex: 1;
  minHeight: 1;
  flexDirection: row;
  alignItems: flex-start;
  justifyContent: flex-end;
`;

const DetailPriceView = Styled(View)`
  flexDirection: row;
  margin: 15px 0px 15px 0px;
`;

const VoucherRoundedView = Styled(View)`
  width: 300;
  height: 50;
  flexDirection: row;
  alignItems: center;
  justifyContent: flex-start;
  marginTop: 10;
  padding: 0px 15px 0px 15px;
  backgroundColor: white;
`;
const HeaderVoucher = Styled(View)`
  minWidth: 1;
  height: 50;
  justifyContent: center;
  alignItems: center;
`;

const ErrorView = Styled(View)`
  width: 100%;
  minHeight: 1;
  paddingVertical: 6;
  alignItems: flex-start;
`;

const CloseVoucherView = Styled(TouchableOpacity)`
  width: 50;
  height: 50;
  justifyContent: center;
  alignItems: center;
  position: absolute;
  top: 0;
  right: 0;
`;

const VoucherView = Styled(TouchableOpacity)`
  minWidth: 30;
  minHeight: 1;
  padding: 15px 0px;
  paddingLeft: 15;
  paddingRight: 15;
  justifyContent: flex-start;
  alignItems: flex-end;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: SourceSansPro-Regular;
`;

const ResetTextVoucher = Styled(TouchableOpacity)`
  width: 12%;
  height: 100%;
  justifyContent: center;
  alignItems: flex-end;
`;

const VoucherButton = Styled(Button)`
  width: 163;
  height: 50;
  marginVertical: 20;
`;

const MainContentView = Styled(View)`
  width: 100%;
  height: 100%;
`;

const MainInfoContainer = Styled(View)`
  width: 100%;
  minHeight: 1;
  paddingHorizontal: 16px;
`;

const MainInfoView = Styled(View)`
  width: 100%;
  minHeight: 1;
  alignItems: center;
  marginVertical: 20;
  padding: 16px;
  borderRadius: 3;
`;

export default ({ navigation, route }) => {
  const { booking } = useSelector(
    state => state['booking']
  );
  
  const [batchPayment] = useState(route.params ? route.params.batchPayment : null);
  const [sourceURL, setSourceURL] = useState('');
  const [expiresAt, setExpiresAt] = useState(booking.expiresAt);
  const [countdown, setCountdown] = useState();
  const [modalWebView, setModalWebView] = useState(false);
  const [modalVoucher, setModalVoucher] = useState(false);
  const [voucherFailed, setVoucherFailed] = useState('');
  const [kdVoucher, setKdVoucher] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState();
  
  // hooks
  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  useEffect(() => {
    startCountdown();
  }, []);

  function startCountdown() {
    const newCountdown = setInterval(() => {
      isBookingExpired(expiresAt);
    }, 1000);
    
    setCountdown(newCountdown);
  }

  function isPaid() {
    const variables = {
      bookingId: booking.id
    };

    Client
      .query({
          query: queryCheckBookingStatus,
          variables
      })
      .then(res => {
        if (res.data.bookingDetail) {
          if (res.data.bookingDetail.bookingStatus.id === 4) {
            navigation.navigate('PaymentSucceed');
          } else {
            navigation.popToTop();
          }
        }
      }).catch(reject => {
        navigation.popToTop();
      });
  }

  const isBookingExpired = (expiresAt) => {
    if (Moment(expiresAt).diff(Moment(), 'seconds') <= 0) {
      setExpiresAt(expiresAt);
      setKdVoucher('');
      clearCountdown();
      return true;
    }

    setExpiresAt(expiresAt);
    return false;
  }

  function clearCountdown() {
    if (countdown) {
      clearInterval(countdown);
    }
  }

  function voucherCheck() {
    if (kdVoucher === '') {
      setVoucherFailed('Masukkan kode voucher');
      return;
    }

    if (voucherFailed !== '') {
      return;
    }

    const voucherCode = kdVoucher.toUpperCase();
      Client.query({
        query: queryVoucherCheck,
        variables: {
          voucherCode,
          bookingId: booking.id,
          paymentId: route.params.payment.id
        }
      })
      .then(res => {
         if (res.data.voucherCheck) {
          onCloseVoucher();
          setAppliedVoucher({ ...res.data.voucherCheck, voucherCode });
         } else {
          onCloseVoucher();
          setAppliedVoucher();
         }
      })
      .catch(reject => { 
        setVoucherFailed(reject.graphQLErrors[0].message || 'Voucher Tidak Valid');
        setAppliedVoucher();
      });
  }

  function submit() {
    const { params } = route;

    showLoading();

    const variables = {
      bookingId: booking.id,
      paymentId: params.payment.id
    };

    if (appliedVoucher) {
      variables.voucherCode = appliedVoucher.voucherCode;
    }

    if (params.paymentPhoneNumber) {
      variables.paymentPhoneNumber = params.paymentPhoneNumber;
    }

    if (batchPayment) {
      variables.batchBookingId = batchPayment.batchId;
    }

    console.log(variables, 'variables');

    Client
      .mutate({
        mutation: queryPay,
        variables
      })
        .then(res => {
          console.log(res, 'res pay');
            
          if (res.data.pay.redirectUrl === 'CONFIRMED') {
            hideLoading();
            navigation.navigate('PaymentSucceed', { bookingId: booking.id });
          }
          else {
            hideLoading();
            setSourceURL(res.data.pay.redirectUrl);

            if (res.data.pay.transferAccountNumber) {
              navigation.navigate('PaymentInstruction', { booking: booking, payment: route.params.payment, payInfo: res.data.pay });
            } else {
              setModalWebView(true);
            }
          }
        })
        .catch(reject => {
          console.log(JSON.stringify(reject), 'reject');
          let message = 'Transaksi Gagal';
          if (reject && reject['graphQLErrors'] && reject['graphQLErrors'].length > 0) {
            message = reject['graphQLErrors'][0].message;
          }

          showLoading('error', message);
        });
  }

  const onCloseWebview = (status) => {
    setModalWebView(false);
    if (status === 'paymentPaid') isPaid();
    else navigation.pop();
  }

  function onCloseVoucher() {
    setModalVoucher(false);
    setVoucherFailed('');
  }

  function renderVoucher() {
    return (
      <MainVoucherView onPress={() => onCloseVoucher()}>
        <ContainerVoucherView style={{backgroundColor: Color.primary}}>
          <CloseVoucherView onPress={() => onCloseVoucher()}>
            <MaterialIcons name='clear' size={24} color={Color.text} />
          </CloseVoucherView>
          <HeaderVoucher>
            <Text type='bold'>Tambahkan Kode Voucher</Text>
          </HeaderVoucher>
          <VoucherRoundedView>
            <CustomTextInput
              style={{ width: '88%' }}
              placeholder='Kode voucher'
              placeholderTextColor='#DDDDDD'
              underlineColorAndroid='transparent'
              autoCorrect={false}
              value={kdVoucher}
              onChangeText={(text) => {
                setKdVoucher(text);
                setVoucherFailed('');
              }}
              selectionColor={Color.text}
              style={{
                color: Color.text
              }}
            />
            {kdVoucher.length > 0 && <ResetTextVoucher
              onPress={() => {
                setVoucherFailed('');
                setKdVoucher('');
              }}
            >
              <MaterialIcons name='clear' size={24} color={Color.text} />
            </ResetTextVoucher>}
          </VoucherRoundedView>

          {voucherFailed !== '' && <ErrorView>
            <Text
              size={12}
              align='left'
              color={Color.error}
              type='medium'>{voucherFailed}</Text>
          </ErrorView>}
          <VoucherButton onPress={() => voucherCheck()}>Gunakan</VoucherButton>
        </ContainerVoucherView>
      </MainVoucherView>
    );
  }
  
  const upperAppliedVoucher = appliedVoucher ? appliedVoucher.voucherCode.toUpperCase() : '';
  const discount = -Math.abs(appliedVoucher ? appliedVoucher.discountAmount : booking.discount);
  const finalAmount = appliedVoucher ? appliedVoucher.finalAmount : booking.finalAmount;

  let title = 'Pembayaran dengan ';
  if (route.params.payment.class === 'vestaPoint') {
    title += 'Saldo Sambatan';
  } else {
    title += route.params.payment.name;
  }

  // console.log(state, 'payment detail', props);

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <Header title={title} />
      <ScrollView>
        <View style={{ height: 60, width: '100%', paddingTop: 16}}>
          <Text size={16} type='bold'>ORDER ID : {booking.invoiceNumber}</Text>
        </View>
        <MainContentView>
          {/* <AbsoluteView>
            <HeaderView>
              <Text type='bold'>Selesaikan pembayaran sebelum</Text>
              <Text type='bold'>{Moment(expiresAt).format('h[:]mm A DD MMM YYYY')}{'\n'}</Text>
              <Text type='bold'>{Moment.duration(Moment(expiresAt).diff(Moment(), 'seconds'), 'seconds').format('h[ Jam : ] m[ Menit : ] s[ Detik]')}</Text>
            </HeaderView>
          </AbsoluteView>
          <PriceView /> */}

          {/* <MainInfoContainer>
            <MainInfoView>
              <Text size={12}>Selesaikan pembayaran sebelum</Text>
              <Text size={24} type='bold' letterSpacing={0.36} lineHeight={31} style={{color: Color.red}}>{Moment.duration(Moment(expiresAt).diff(Moment(), 'seconds'), 'seconds').format('h[ : ] m[ : ] s')}</Text>
            </MainInfoView>
          </MainInfoContainer> */}

          {/* <VoucherBackground>
            <VoucherView>
              <Text size={16} type='semibold'>Voucher</Text>
            </VoucherView>
            
            <RightHeaderView>
              <VoucherView style={appliedVoucher && { paddingRight: 0 }} onPress={() => {
                setKdVoucher(appliedVoucher ? upperAppliedVoucher : '');
                setModalVoucher(true)
              }}
              >
                <Text size={16} type='semibold' style={{ textDecorationLine: 'underline' }}>{appliedVoucher ? upperAppliedVoucher : 'Gunakan'}</Text>
              </VoucherView>
              {appliedVoucher && <VoucherView onPress={() => {
                setAppliedVoucher();
                setKdVoucher('');
              }}>
                <MaterialIcons name='clear' size={18} color={Color.text} />
              </VoucherView>}
            </RightHeaderView>
          </VoucherBackground> */}

          <PriceViewWithBackground>
              <DetailPriceView>
                <Text size={16} type='semibold'>Rincian Harga</Text>
              </DetailPriceView>
              <DetailPriceView>
                <LeftHeaderView>
                  <Text type='medium'>Sub Total</Text>
                </LeftHeaderView>
                <RightHeaderView>
                  <Text type='medium'>{FormatMoney.getFormattedMoney(batchPayment ? batchPayment.amount : booking.amount)}</Text>
                </RightHeaderView>
              </DetailPriceView>
              <DetailPriceView>
                <LeftHeaderView>
                  <Text type='medium'>Diskon</Text>
                </LeftHeaderView>
                <RightHeaderView>
                  <Text type='medium'>{FormatMoney.getFormattedMoney(batchPayment ? batchPayment.discount + discount : discount)}</Text>
                </RightHeaderView>
              </DetailPriceView>
              <DetailPriceView>
                <LeftHeaderView>
                  <Text type='medium'>Ppn</Text>
                </LeftHeaderView>
                <RightHeaderView>
                  <Text type='medium'>{FormatMoney.getFormattedMoney(booking.vat)}</Text>
                </RightHeaderView>
              </DetailPriceView>
              <DetailPriceView>
                <LeftHeaderView>
                  <Text type='medium'>Biaya Admin</Text>
                </LeftHeaderView>
                <RightHeaderView>
                  <Text type='medium'>{FormatMoney.getFormattedMoney(booking.adminFee)}</Text>
                </RightHeaderView>
              </DetailPriceView>
              
              <DetailPriceView>
                <LeftHeaderView>
                  <Text size={16} type='semibold'>Total</Text>
                </LeftHeaderView>
                <RightHeaderView>
                  <Text size={16} type='semibold' color={Color.error}>{FormatMoney.getFormattedMoney(batchPayment ? batchPayment.final_amount : finalAmount)}</Text>
                </RightHeaderView>
              </DetailPriceView>
            </PriceViewWithBackground>
        </MainContentView>
      </ScrollView>
      
      <Footer
        footerType='button'
        buttonColor={Color.primary}
        onPress={() => submit()}
      />

      <Loading { ...loadingProps } />

      <Popup { ...popupProps } />

      <Modal
        transparent
        animationType='fade'
        visible={modalVoucher}
        onRequestClose={() => onCloseVoucher()}
      >
        {renderVoucher()}
      </Modal>

      <Modal
          transparent
          animationType="fade"
          onRequestClose={onCloseWebview}
          visible={modalWebView}
      >
          <WebViewScreen
            url={sourceURL}
            onClose={onCloseWebview}
          />
      </Modal>
    </MainView>
  );
}

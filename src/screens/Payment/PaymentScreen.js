import React, { useState, useEffect } from 'react';
import { Image, View, ScrollView, Toast, BackHandler, ImageBackground, ActivityIndicator } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Accordion from 'react-native-collapsible/Accordion';
import Moment from 'moment';

import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Text from '@src/components/Text';
import FormatMoney from '@src/utils/FormatMoney';
import { useColor } from '@src/components/Color';
import Header from '@src/components/Header';
import Popup, { usePopup } from '@src/components/Modal/Popup';
import Footer from '@src/components/Footer';

import { getOptionsProduct } from '@src/utils/getOptionsProduct';
import Client from '@src/lib/apollo';
import { queryVestaBalance, queryPaymentMethods } from '@src/lib/query/payment';
import { MainView } from '@src/styled';

import {
  imagePaymentBanner,
} from '@assets/images';

const Container = Styled(View)`
  padding: 16px;
`;

const LeftHeaderView = Styled(View)`
  alignItems: flex-start;
  justifyContent: center;
  width: 70%;
  height: 100%;
`;

const RightHeaderView = Styled(View)`
  alignItems: flex-end;
  justifyContent: center;
  width: 30%;
  height: 100%;
`;

const SectionView = Styled(TouchableOpacity)`
  minHeight: 1px;
  paddingBottom: 8px;
`;

const SectionContainerWithBorder = Styled(View)`
  flexDirection: row
  borderBottomWidth: 1
  paddingBottom: 8px;
  height: 35px;
`;

const ImageDetail = Styled(Image)`
  height: 35px;
  width: 70px;
`;

const AbsoluteView = Styled(View)`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const BackgroundView = Styled(View)`
  width: 100%;
  height: 38px;
  borderTopLeftRadius: 12px;
  borderTopRightRadius: 12px;
  marginTop: 16px;
`;

const MiniLoadingActivityView = Styled(View)`
  width: 100%;
  height: 110;
  justifyContent: center;
  alignItems: center;
`;

export default ({ navigation, route }) => {
  // state
  const [batchPayment] = useState(route.params && route.params.batchPayment);
  const [vestaAmount, setVestaAmount] = useState(0);
  const [activeSections, setActiveSections] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [readyPayment, setReadyPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState();

  // hooks
  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();
  const { booking } = useSelector(
    state => state['booking'],
  );

  useEffect(() => {
    getPaymentMethods();
    getVesta();

    if (route.params === undefined) {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    }

    return () => {
      if (route.params === undefined) {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }
  }, []);

  const handleBackPress = () => {
    navigation.popToTop();
    return true;
  }

  function getVesta() {
    Client.query({query: queryVestaBalance})
    .then(res => {
      // console.log(res, 'res vesta balance');
      setVestaAmount(res.data.vestaBalance.amount);
    }).catch(reject => {
      // console.log(reject, 'err vesta balance');
      setVestaAmount(0);
    })
  }

  function getPaymentMethods() {
    const variables = {
      bookingId: booking.id //16
    };

    if (batchPayment) {
      variables.batchBookingId = batchPayment.batchId;
    }

    Client.query({
      query: queryPaymentMethods,
      variables
    })
    .then(res => {
      console.log(res, 'res payment method');
      let newActiveSections = [];
      let newPaymentMethods = [];
      
      if (res.data.paymentMethods) {
        res.data.paymentMethods.map((item) => {
          const isTopupPayment = booking.vestabalance;
          const isMustSambatanPay = booking.prepaidTransaction || booking.postpaidTransaction;
          const isUsedAllPayment = booking.vestaBiller;

          if (isTopupPayment && item.id !== 8) {
            newActiveSections.push(0);
            newPaymentMethods.push(item);
          }
          
          if (isMustSambatanPay && item.id === 8) {
            newActiveSections.push(0);
            newPaymentMethods.push(item);
          }

          if (isUsedAllPayment) {
            newActiveSections.push(0);
            newPaymentMethods.push(item);
          }
        })

        setActiveSections(newActiveSections);
        setPaymentMethods(newPaymentMethods);
        setReadyPayment(true);

        // if (booking.prepaidTransaction) submit(res.data.paymentMethods[0]);
      }
    }).catch(reject => {
      console.log(reject, 'err payment method');
      let errorMessage = 'Terjadi kesalahan server';
      if (reject.graphQLErrors[0].code.indexOf('CLIENT_') === 0) errorMessage = reject.graphQLErrors[0].message;
      Toast.info(errorMessage, 1.5, null, false);
    });
  }

  function submit(pay) {
    if (pay) {
      // pembayaran vesta
      if (pay.id === 23 && pay.finalAmount > vestaAmount) {
        showPopup('Saldo Anda tidak cukup', 'error');
        return;
      }
      
      navigation.navigate('PaymentDetail', {
        payment: pay,
        batchPayment,
      })
    }
  }

  const onChangeSectionsActive = (index, method, i) => {
    let newArr = activeSections.map((arr, idx) => {
      if (idx === i) {
        return index;
      }
      return arr;
    });
    setActiveSections(newArr);
  }

  const renderAccordionHeader = (method, index, isActive) => {
    return (
      <View style={{}}>
        <Container>
          <SectionContainerWithBorder style={{borderBottomColor: Color.border}}>
            <LeftHeaderView>
              <Text size={17} type='semibold' letterSpacing={0.26} lineHeight={22}>{method.id === 8 ? 'Saldo Sambatan' : method.name}</Text>
            </LeftHeaderView>
            <RightHeaderView>
              <Ionicons size={14} name={isActive ? 'chevron-back' : 'chevron-down'} />
            </RightHeaderView>
          </SectionContainerWithBorder>
        </Container>
      </View>
    );
  }

  const renderAccordionContent = (section) => {
    const amountTotal = booking ? booking.amount : 0;
    
    return section.items.map((pay, id) => {
      const isSelected = selectedPayment && selectedPayment.id === pay.id;

      return (
        <View key={id}>
          <SectionView
            activeOpacity={0.7}
            onPress={() => setSelectedPayment(pay)}
          >
            {pay.class === 'vestaPoint' && amountTotal > vestaAmount && <View style={{paddingHorizontal: 16}}>
              <Text color={Color.error}>Saldo Anda tidak mencukupi untuk membayar transaksi ini.</Text>
            </View>}
  
            <View style={{paddingHorizontal: 16, flexDirection: 'row', width: '100%'}}>
              <View style={{width: '70%', flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons size={11} name={isSelected ? 'radio-button-on' : 'radio-button-off'} />
                <Text size={15} letterSpacing={0.23} align='left' style={{marginLeft: 8}}>{pay.class === 'vestaPoint' ? 'Saldo' : pay.name}</Text>
              </View>

              <View style={{width: '30%', alignItems: 'flex-end'}}>
                {pay.class !== 'vestaPoint' ?
                  <ImageDetail resizeMode='contain' source={{uri: pay.logo}} />
                :
                  <Text size={15} type='semibold' letterSpacing={0.23}>{FormatMoney.getFormattedMoney(vestaAmount)}</Text>
                }
              </View>
            </View>
          </SectionView>
        </View>
        )
      }
    )
  }

  function renderLoadingIndicator() {
    return (
      <MiniLoadingActivityView>
        <ActivityIndicator size='large' color={Color.theme} />
      </MiniLoadingActivityView>
    );
  }

  let paymentData = [];
  paymentMethods.map((item) => {
    paymentData.push([item]);
  })

  const productType = getOptionsProduct(booking).productType;
  const productName = getOptionsProduct(booking).productName;

  const labelDate = productType === 'SAMBATAN' || productType === 'SAMBATAN_O' ? booking.vestaBiller.due_date_label : Moment(booking.createdAt).format('DD MMM YYYY');

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <Header
        title='Metode Pembayaran'
        onPressLeftButton={() => {
          if (route.params && route.params.canGoBack) navigation.pop();
          else navigation.popToTop();
        }}
      />

      <ScrollView contentContainerStyle={{paddingBottom: 16}}>
        <ImageBackground source={imagePaymentBanner} style={{width: '100%', height: 289}}>
            <AbsoluteView>
                <View style={{paddingLeft: 16, alignItems: 'flex-start'}}>
                    <Text size={20} type='semibold' align='left' color={Color.text}>{productName} <Text>{batchPayment && batchPayment.name}</Text></Text>
                    <Text size={15} color={Color.text}>{labelDate}</Text>
                </View>
                <BackgroundView style={{backgroundColor: Color.theme}} />
            </AbsoluteView>
        </ImageBackground>

        {readyPayment && paymentData.map((item, idx) => 
          <Accordion
            key={idx}
            activeSection={activeSections[idx]}
            sections={item}
            touchableComponent={(props) => <TouchableOpacity {...props} />}
            renderHeader={renderAccordionHeader}
            renderContent={renderAccordionContent}
            onChange={(index) => onChangeSectionsActive(index, item, idx)}
          />
        )}

        {!readyPayment && renderLoadingIndicator()}

      </ScrollView>

      <Footer
        buttonColor={selectedPayment ? Color.primary : Color.disabledButton}
        detail={FormatMoney.getFormattedMoney(batchPayment ? batchPayment.final_amount : booking.finalAmount)}
        onPress={() => submit(selectedPayment)}
      />

      <Popup {...popupProps} />
    </MainView>
  );
}

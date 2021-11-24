import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, TouchableOpacity, View, Platform, FlatList } from 'react-native';
import { Tab, Tabs, TabHeading } from 'native-base';
import Styled from 'styled-components';
import Moment from 'moment';
import { TextInputMask } from 'react-native-masked-text';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Modalize } from 'react-native-modalize';

import { useColor } from '@src/components/Color';
import Text from '@src/components/Text';
import Header from '@src/components/Header';
import Footer from '@src/components/Footer';
import FormatMoney from '@src/utils/FormatMoney';
import Loading, { useLoading } from '@src/components/Modal/Loading';
import Popup, { usePopup } from '@src/components/Modal/Popup';
import ScreenIndicator from '@src/components/Modal/ScreenIndicator';
import ScreenEmptyData from '@src/components/Modal/ScreenEmptyData';

import Client from '@src/lib/apollo';
import { queryPlnPrepaidSubs, queryPlnPrepaidList, queryInquiryPascaBayarPLN } from '@src/lib/query/pln';

import { plnPrepaid } from '@src/state/actions/Prepaid';
import { plnPostpaid } from '@src/state/actions/Postpaid';
import { shadowStyle } from '@src/styles';
import { MainView } from '@src/styled';

const TextInputSubsriber = Styled(TextInputMask)`
  width: 100%;
  height: 45;
  fontFamily: Inter-Regular;
  alignContent: flex-start;
  letterSpacing: 0.36;
  borderWidth: 0.5px;
  marginTop: 12;
  paddingHorizontal: 10;
  borderRadius: 4px;
`;

const SusbcriberView = Styled(View)`
  paddingHorizontal: 8px;
  marginBottom: 8px;
`;

const RowSubscriberView = Styled(View)`
  flexDirection: row;
  borderRadius: 8px;
`;

const ColSubscriberLeftView = Styled(View)`
  width: 50%;
  paddingHorizontal: 16px;
  paddingVertical: 8px;
  alignItems: flex-start;
`;

const ColSubscriberRightView = Styled(ColSubscriberLeftView)`
  alignItems: flex-end;
`;

const SubscriberText = Styled(Text)`
  lineHeight: 24;
  fontSize: 12;
`;

const ButtonPrepaidList = Styled(TouchableOpacity)`
  width: 100%;
  aspectRatio: 2;
  alignItems: center;
  justifyContent: center;
  borderWidth: 0.5;
  borderRadius: 8px;
`;

export default ({ navigation, route }) => {
  // state
  const [state, changeState] = useState({
    activeTab: 0,
    dataConfirm: [],

    // prepaid
    selectedPlnPrepaid: null,
    prepaidText: '', //'14388059660'
    plnPriceList: [],
    plnPrepaidSubs: null,
    loadingPrepaid: false,
    isEmptySubs: false,

    // postpaid
    inquiryPostpaid: null,
    loadingPostpaid: false,
    postpaidText: '', //'543400329323',
    isEmptyBill: false,
  });

  const setState = (obj) => {
    changeState({ ...state, ...obj });
  }

  // ref
  const modalConfirmRef = useRef();

  // hooks
  const dispatch = useDispatch();
  const {
    fetching,
    error,
    booking,
  } = useSelector(state => state['booking']);

  const [loadingProps, showLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();
  const { Color } = useColor();

  useEffect(() => {
    getQuerymobilePulsaPrepaidPriceList();
  }, []);

  useEffect(() => {
    const timeout = state.prepaidText !== '' ? setTimeout(() => {
      getPlnPrabayar(state.prepaidText);
    }, 3000) : null;

    return () => {
      clearTimeout(timeout);
    };
  }, [state.prepaidText]);

  useEffect(() => {
    const timeout = state.postpaidText !== '' ? setTimeout(() => {
      getQueryPascaBayarPLN(state.postpaidText);
    }, 3000) : null;

    return () => {
      clearTimeout(timeout);
    };
  }, [state.postpaidText]);

  useEffect(() => {
    if (fetching) {
      showLoading();
    } else {
      if (error === null && typeof booking.id !== 'undefined') {
        showLoading('success', 'Berhasil');
        setTimeout(() => {
          navigation.navigate('PaymentScreen');
        }, 2500);
      } else if (error) {
        showLoading('error', error);
        console.log(error);
      }
    }
  }, [fetching, booking, error]);

  function onSelectPrice(selectedPlnPrepaid) {
    setState({ selectedPlnPrepaid });
  }

  function getPlnPrabayar(customerID) {
    if (customerID.length > 9) {
      setState({ loadingPrepaid: true });

      let variables = {
        customerID
      }

      Client.query({
        query: queryPlnPrepaidSubs,
        variables
      }).then(res => {
        let data = res.data.mobilePulsaCheck_PLN_Prabayar_Subcriber;
        console.log(data, 'entaskan list');

        if (data && data.subscriber_id) {
          setState({ plnPrepaidSubs: data, isEmptySubs: false, loadingPrepaid: false });
        } else {
          setState({ plnPrepaidSubs: null, isEmptySubs: true, loadingPrepaid: false });
        }
      }).catch((err) => {
        console.log('Error', err);
        setState({ plnPrepaidSubs: null, isEmptySubs: true, loadingPrepaid: false });
      })
    } else {
      setState({ plnPrepaidSubs: null, isEmptySubs: false, loadingPrepaid: false });
    }
  }

  function getQuerymobilePulsaPrepaidPriceList(){
    let variables = {
      param: {
        SegmentType: 'TOKEN_LISTRIK',
        ServiceItem: {
          OperatorItemProvided: {
            Provider_Token_Listrik: 'pln'
          }
        }
      }
    }

    Client.query({
      query: queryPlnPrepaidList,
      variables
    }).then(res => {
      let data = res.data.mobilePulsaPrepaidPriceList;
      let plnPriceList = []

      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (data[i] !== null) plnPriceList.push(data[i])
        }
      }

      setState({ plnPriceList });
    })
    .catch(err => console.log(err, 'err'))
  }

  function getQueryPascaBayarPLN(nopel) {
    if (nopel.length > 9) {
      setState({ loadingPostpaid: true });

      let variables = {
        nomor_pelanggan: nopel
      }
  
      Client.query({
        query: queryInquiryPascaBayarPLN,
        variables
      })
      .then(res => {
        console.log(res, 'res pelanggan');
        const data = res.data.Inquiry_PascaBayar_PLN;

        if (data && data.tr_id !== null) {
          setState({ inquiryPostpaid: data, loadingPostpaid: false, isEmptyBill: false });
        } else {
          setState({ inquiryPostpaid: null, loadingPostpaid: false, isEmptyBill: true });
        }
      })
      .catch(err => {
        console.log(err, 'err')
        setState({ inquiryPostpaid: null, loadingPostpaid: false, isEmptyBill: true });
      })
    } else {
      setState({ inquiryPostpaid: null, loadingPostpaid: false, isEmptyBill: false });
    }
  }

  function onSubmitPrepaid() {
    const { selectedPlnPrepaid, plnPrepaidSubs } = state;

    if (!selectedPlnPrepaid) {
      showPopup('Silakan pilih saldo terlebih dulu', 'warning');
      return;
    }
    
    if (!plnPrepaidSubs) {
      showPopup('Silakan masukan id pelanggan yang valid', 'warning');
      return;
    }

    const variables = {
      PhoneNumber: plnPrepaidSubs.meter_no,
      PulsaPrice: selectedPlnPrepaid.pulsa_price,
      AutoDetect: false,
      PulsaCode: selectedPlnPrepaid.pulsa_code,
      Category: 'TOKEN_LISTRIK',
    }

    dispatch(plnPrepaid(variables))
  }

  function onSubmitPostpaid() {
    const { postpaidText } = state;

    if (postpaidText === '') return;

    const variables = { NomorPelanggan: postpaidText };

    dispatch(plnPostpaid(variables))
  }

  function renderTabHeading(label, index, activeTab) {
    return (
      <TabHeading style={{ backgroundColor: Color.theme }}>
        <Text type={activeTab !== index ? 'semibold' : 'bold'} style={activeTab !== index ? {color: Color.text} : {color: Color.primary}}>{label}</Text>
      </TabHeading>
    );
  }

  function renderPrabayar() {
    const { plnPriceList, selectedPlnPrepaid, plnPrepaidSubs, isEmptySubs, loadingPrepaid } = state;

    return (
      <>
        <View style={{paddingHorizontal: 16, paddingVertical: 16, paddingTop: 24, backgroundColor: Color.theme}}>
          <Text type='medium' align='left' size={12} style={{color: '#A8A699'}}>No. Meter</Text>
          <TextInputSubsriber
            name="text"
            returnKeyType="done"
            returnKeyLabel="Done"
            type={'only-numbers'}
            blurOnSubmit={false}
            error={null}
            value={state.prepaidText}
            onChangeText={(prepaidText) => {
              setState({ prepaidText, plnPrepaidSubs: null });
            }}
            style={{
              color: Color.text,
              borderColor: Color.border,
              backgroundColor: Color.textInput
            }}
          />
        </View>

        <FlatList
          ListHeaderComponent={() => loadingPrepaid ?
            <ScreenIndicator visible />
          : isEmptySubs ?
            <ScreenEmptyData type='large' message='Pelanggan tidak tersedia' />
          :
            <SusbcriberView>
              <RowSubscriberView style={{backgroundColor: Color.secondary}}>
                <ColSubscriberLeftView>
                  <SubscriberText color={Color.textInput} type='medium'>No Meter</SubscriberText>
                  <SubscriberText color={Color.textInput} type='medium'>Nama Pelanggan</SubscriberText>
                  <SubscriberText color={Color.textInput} type='medium'>Power</SubscriberText>
                </ColSubscriberLeftView>

                <ColSubscriberRightView>
                  <SubscriberText color={Color.textInput} type='medium'>{plnPrepaidSubs ? plnPrepaidSubs.meter_no : '-'}</SubscriberText>
                  <SubscriberText color={Color.textInput} type='medium'>{plnPrepaidSubs ? plnPrepaidSubs.name : '-'}</SubscriberText>
                  <SubscriberText color={Color.textInput} type='medium'>{plnPrepaidSubs ? plnPrepaidSubs.segment_power : '-'}</SubscriberText>
                </ColSubscriberRightView>
              </RowSubscriberView>
            </SusbcriberView>
          }
          keyExtractor={(item, index) => item.id+index.toString()}
          data={plnPriceList}
          numColumns={2}
          style={{backgroundColor: Color.theme}}
          contentContainerStyle={{paddingTop: 8, paddingHorizontal: 8, height: '100%', backgroundColor: Color.theme}}
          renderItem={({ item }) => {
            const isSelected = selectedPlnPrepaid && selectedPlnPrepaid.pulsa_code === item.pulsa_code;
            return (
              <View style={{width: '50%', paddingHorizontal: 8, paddingVertical: 8}}>
                <ButtonPrepaidList
                  activeOpacity={1}
                  onPress={() => onSelectPrice(item)}
                  style={[
                    { borderColor: Color.border, backgroundColor: Color.textInput },
                    shadowStyle, isSelected && {borderColor: Color.primary, borderWidth: 2},
                  ]}
                >
                  <Text type='semibold' size={15}>{item.pulsa_nominal}</Text>
                  <Text>Harga <Text style={{marginTop: 6, color: '#FF425E'}}>{FormatMoney.getFormattedMoney(item.pulsa_price)}</Text></Text>
                </ButtonPrepaidList>
              </View>
            )
          }}
        />

        <Footer
          buttonLabel='Beli'
          buttonColor={selectedPlnPrepaid && plnPrepaidSubs ? Color.primary : Color.disabledButton}
          detail={FormatMoney.getFormattedMoney(selectedPlnPrepaid ? selectedPlnPrepaid.pulsa_price : 0)}
          onPress={() => selectedPlnPrepaid && plnPrepaidSubs && onConfirm()}
        />
      </>
    )
  }

  function renderPascaBayar() {
    const { inquiryPostpaid, loadingPostpaid, isEmptyBill } = state;

    return (
      <>
        <View style={{paddingHorizontal: 16, paddingVertical: 16, paddingTop: 24, backgroundColor: Color.theme}}>
          <Text align= 'left' type='medium' size={12} style={{color: '#A8A699'}}>No. Pelanggan</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInputSubsriber
              name="text"
              returnKeyType="done"
              returnKeyLabel="Done"
              type={'only-numbers'}
              blurOnSubmit={false}
              error={null}
              value={state.postpaidText}
              onChangeText={(text) => {
                setState({ postpaidText: text, inquiryPostpaid: null });
              }}
              style={{
                borderColor: Color.border,
                backgroundColor: Color.textInput
              }}
            />
          </View>
        </View>

        <ScrollView
          style={{backgroundColor: Color.theme}}
          contentContainerStyle={{backgroundColor: Color.theme}}
        >
          <View style={{marginTop: 16, paddingHorizontal: 8}}>
            { loadingPostpaid ?
              <ScreenIndicator visible />
            : isEmptyBill ?
              <ScreenEmptyData type='large' message='Tagihan tidak tersedia' />
            :
              <SusbcriberView>
                <RowSubscriberView style={{backgroundColor: Color.secondary}}>
                  <ColSubscriberLeftView>
                    <SubscriberText color={Color.textInput} type='medium'>ID Pelanggan</SubscriberText>
                    <SubscriberText color={Color.textInput} type='medium'>Nama Pelanggan</SubscriberText>
                    <SubscriberText color={Color.textInput} type='medium'>Tagihan</SubscriberText>
                    <SubscriberText color={Color.textInput} type='medium'>Periode</SubscriberText>
                    <SubscriberText color={Color.textInput} type='medium'>Admin</SubscriberText>
                  </ColSubscriberLeftView>

                  <ColSubscriberRightView>
                    <SubscriberText color={Color.textInput} type='medium'>{inquiryPostpaid ? inquiryPostpaid.tr_id : '-'}</SubscriberText>
                    <SubscriberText color={Color.textInput} type='medium'>{inquiryPostpaid ? inquiryPostpaid.tr_name : '-'}</SubscriberText>
                    <SubscriberText color={Color.textInput} type='medium'>{inquiryPostpaid ? FormatMoney.getFormattedMoney(inquiryPostpaid.nominal) : '-'}</SubscriberText>
                    <SubscriberText color={Color.textInput} type='medium'>{inquiryPostpaid ? getPeriodText(inquiryPostpaid.period) : '-'}</SubscriberText>
                    <SubscriberText color={Color.textInput} type='medium'>{inquiryPostpaid ? FormatMoney.getFormattedMoney(inquiryPostpaid.admin) : '-'}</SubscriberText>
                  </ColSubscriberRightView>
                </RowSubscriberView>
              </SusbcriberView>
            }
          </View>
        </ScrollView>

        <Footer
          buttonLabel='Beli'
          buttonColor={inquiryPostpaid ? Color.primary : Color.disabledButton}
          detail={FormatMoney.getFormattedMoney(inquiryPostpaid ? inquiryPostpaid.price : 0)}
          onPress={() => onConfirm()}
        />
      </>
    )
  }

  function getPeriodText(period) {
    let tahun = period.length >= 4 ? period.substring(0, 4) : '';
    let bulan = period.length >= 6 ? Moment(period.substring(4, 6)).format('MMM') : '';
    return bulan + ' ' + tahun;
  }

  function onPressRightButton(productType) {
    navigation.navigate('OrderListPerProduct', {
      title: 'PLN',
      type: 'ALL',
      productType,
      // category: 'TOKEN_LISTRIK', nextime
    })
  }

  function onConfirm() {
    const { activeTab, selectedPlnPrepaid, plnPrepaidSubs, inquiryPostpaid } = state;
    let dataConfirm = [];

    if (activeTab === 0) {
      dataConfirm.push(
        { name: 'Nomor Meter', value: plnPrepaidSubs.meter_no },
        { name: 'Nama Pelanggan', value: plnPrepaidSubs.name },
        { name: `Token Listrik ${selectedPlnPrepaid.pulsa_nominal}`, value: FormatMoney.getFormattedMoney(selectedPlnPrepaid.pulsa_price) },
      )
    } else {
      dataConfirm.push(
        { name: 'ID Pelanggan', value: inquiryPostpaid.tr_id },
        { name: inquiryPostpaid.tr_name, value: FormatMoney.getFormattedMoney(inquiryPostpaid.nominal) },
        { name: 'Periode', value: getPeriodText(inquiryPostpaid.period) },
        { name: 'Biaya Admnin', value: FormatMoney.getFormattedMoney(inquiryPostpaid.admin) },
        { name: 'Harga Pulsa', value: FormatMoney.getFormattedMoney(inquiryPostpaid.price) },
      )
    }

    setState({ dataConfirm });
    modalConfirmRef.current.open();
  }

  const { activeTab, dataConfirm, selectedPlnPrepaid, inquiryPostpaid } = state;

  const tabs = [
    { label: 'Token Listrik', children: renderPrabayar() },
    { label: 'PLN Pascabayar', children: renderPascaBayar() }
  ];

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <Header
        title= 'PLN'
        onPressRightButton={() => onPressRightButton(activeTab === 0 ? 'PREPAID' : 'POSTPAID')}
        iconRightButton={<MaterialIcons name='history' size={22} color={Color.gray} />}
      />

      <Tabs
        prerenderingSiblingsNumber={Infinity}
        tabStyle={{backgroundColor: Color.theme}}
        tabContainerStyle={{elevation: 0}}
        tabBarUnderlineStyle={{backgroundColor: Color.primary, height: 2}}
        onChangeTab={({ i }) => setState({ activeTab: i })}
        locked={Platform.OS == 'android'}
        initialPage={activeTab}
      >
        {tabs.map((item, index) =>
          <Tab key={index} heading={renderTabHeading(item.label, index, activeTab)}>
            {index === activeTab && item.children}
          </Tab>
        )}
      </Tabs>

      <Modalize
        ref={modalConfirmRef}
        overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
        adjustToContentHeight
        handlePosition='inside'
        handleStyle={{width: '30%', height: 4, marginTop: 8, backgroundColor: Color.border}}
        modalStyle={{
          backgroundColor: Color.theme
        }}
      >
        <View style={{paddingTop: 36, paddingHorizontal: 16, paddingBottom: 16}}>
          <View style={{paddingTop: 8, paddingBottom: 8, alignItems: 'flex-start'}}>
            <Text size={15} letterSpacing={0.23}>Informasi Pesanan</Text>
          </View>
          
          {dataConfirm.map((item, idx) =>
            <RowSubscriberView key={idx} style={{backgroundColor: Color.secondary}}>
              <ColSubscriberLeftView style={{paddingHorizontal: 0, paddingBottom: 0, backgroundColor: Color.textInput}}>
                <Text type='medium' align='left' color={Color.bordered}>{item.name}</Text>
              </ColSubscriberLeftView>
              <ColSubscriberRightView style={{paddingHorizontal: 0, paddingBottom: 0, backgroundColor: Color.textInput}}>
                <Text type='medium' align='right' color={Color.bordered}>{item.value}</Text>
              </ColSubscriberRightView>
            </RowSubscriberView>
          )}

          <View style={{width: '100%', height: 1, backgroundColor: Color.border, marginTop: 16}} />
        </View>

        <View style={{paddingHorizontal: 16, paddingBottom: 16, width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text type='semibold' letterSpacing={0.18}>Total</Text>
          <Text type='semibold' letterSpacing={0.18}>{activeTab === 0 ? FormatMoney.getFormattedMoney(selectedPlnPrepaid ? selectedPlnPrepaid.pulsa_price : 0) : FormatMoney.getFormattedMoney(inquiryPostpaid ? inquiryPostpaid.price : 0)}</Text>
        </View>

        <Footer
          footerType='button'
          buttonLabel='Konfirmasi'
          buttonColor={Color.primary}
          buttonBorderTopWidth={0}
          onPress={() => activeTab === 0 ? onSubmitPrepaid() : onSubmitPostpaid()}
        />
      </Modalize>

      <Loading {...loadingProps} />

      <Popup {...popupProps} />
    </MainView>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { View, Keyboard, Modal, FlatList, Platform, SafeAreaView, ScrollView } from 'react-native';
import Styled from 'styled-components';
import { TextInputMask } from 'react-native-masked-text';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Tabs, Tab, TabHeading } from 'native-base';
import Moment from 'moment';
import { Modalize } from 'react-native-modalize';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Header from '@src/components/Header';
import Footer from '@src/components/Footer';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Popup, { usePopup } from '@src/components/Modal/Popup';
import Loading, { useLoading } from '@src/components/Modal/Loading';
import FormatMoney from '@src/utils/FormatMoney';
import validate from './validatePPOB';
import ScreenIndicator from '@src/components/Modal/ScreenIndicator';
import ScreenEmptyData from '@src/components/Modal/ScreenEmptyData';
import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryCheckOperator, queryCheckSubscriber, queryPrepaidPriceList } from '@src/lib/query/pulsa';
import { pulsaPrepaid, paketDataPrepaid } from '@src/state/actions/Prepaid';
import { pulsaPostpaid } from '@src/state/actions/Postpaid';

import {
  iconIndosat,
  iconSmartfren,
  iconTelkom,
  iconTelkomsel,
  iconThree,
  iconXL,
} from '@assets/images/operator';

const MainView = Styled(View)`
  flex: 1;
`;

const TopView = Styled(View)`
  paddingHorizontal: 16;
  justifyContent: center;
  paddingBottom: 8px;
`;

const InputNumberView = Styled(View)`
  marginTop: 8;
  paddingHorizontal: 8;
  borderRadius: 8px;
  borderWidth: 0.5px;
`;

const InfoNumberView = Styled(View)`
  flexDirection: row;
  justifyContent: space-between;
  paddingTop: 16px;
`;

const TextInputNumber = Styled(TextInputMask)`
  width: 90%;
  alignContent: flex-start;
  fontFamily: Inter-Regular;
  letterSpacing: 0.6;
  fontSize: 14;
  height: 45;
`;

const SelectProvider = Styled(TouchableOpacity)`
  width: 100%;
  alignContent: flex-start;
  height: 45;
  flexDirection: row;
  justifyContent: space-between;
  alignItems: center;
`;

const ErrorView = Styled(View)`
  width: 100%;
  minHeight: 1;
  padding: 2px 0px 2px 0px;
  alignItems: flex-start;
`;

const ErrorMessage = Styled(Text)`
  fontSize: 12;
  textAlign: left;
`;

const PrepaidContainer = Styled(View)`
  width: 50%;
  padding: 8px;
`;

const ButtonPrepaidList = Styled(TouchableOpacity)`
  width: 100%;
  aspectRatio: 2;
  alignItems: center;
  justifyContent: center;
  borderRadius: 4px;
  padding: 8px;
`;

const SusbcriberView = Styled(View)`
  paddingHorizontal: 16px;
  marginBottom: 8px;
  paddingTop: 16px;
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
  color: #FFFFFF;
  lineHeight: 24;
  fontSize: 12;
`;

const ButtonListProvider = Styled(TouchableOpacity)`
  width: 100%;
  height: 100%;
  flexDirection: row;
  alignItems: center;
  justifyContent: space-between;
  borderWidth: 0.5px;
  borderRadius: 8px;
  paddingHorizontal: 8px;
`;

const PulsaPostpaidProvider = [
  { id: 'TELKOMPSTN', name: 'Telkom', images: iconTelkom },
  { id: 'HPTSEL', name: 'Kartu Halo', images: iconTelkomsel },
  { id: 'HPTHREE', name: 'Three (3) Pascabayar', images: iconThree },
  { id: 'HPXL', name: 'XL Pascabayar', images: iconXL },
  { id: 'HPMTRIX', name: 'Indosat Matrix', images: iconIndosat },
  { id: 'HPSMART', name: 'Smartfren Pascabayar', images: iconSmartfren },
];

const errorInputPrepaid = ['prepaidNumber'];
const errorInputPostpaid = ['selectedProvider', 'subscriberNumber'];

export default ({ navigation, route }) => {
  const [state, changeState] = useState({
    activeTab: 0,
    dataConfirm: [],
    // prepaid
    pulsaList: [],
    paketDataList: [],
    selectedPulsa: null,
    selectedPaketData: null,
    errorPrepaid: {
      prepaidNumber: null,
    },
    prepaidActiveTab: 0,
    // postpaid
    selectedProvider: null, // { id: 'HPTSEL', name: 'Kartu Halo'},
    modalProvider: false,
    inquiryPostpaid: null,
    isEmptyBill: false,
    loadingInquiry: false,
    errorPostpaid: {
      selectedProvider: null,
      subscriberNumber: null,
    },
  });

  const [prepaidNumber, setPrepaidNumber] = useState('');
  const [prepaidOperator, setPrepaidOperator] = useState('');
  const [loadingPulsaList, setLoadingPulsaList] = useState(false);
  const [loadingPaketDataList, setLoadingPaketDataList] = useState(false);
  const [subscriberNumber, setSubscriberNumber] = useState(''); // '08112343434', //'0817413488', //halo & bobby

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
    if (prepaidNumber !== '') {
      getPulsaOperator(prepaidNumber);
    }
  }, []);

  useEffect(() => {
    console.log(prepaidOperator);
    
    if (prepaidOperator !== '') {
      if (state.prepaidActiveTab === 0) {
        getPrepaidList('PULSA_HP');
      } else {
        getPrepaidList('PAKET_DATA');
      }
    }
  }, [prepaidOperator, state.prepaidActiveTab]);

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

  useEffect(() => {
    const timeout = prepaidNumber !== '' ? setTimeout(() => {
      validateTypingNumber(prepaidNumber, 'prepaid');
    }, 500) : null;

    return () => {
      clearTimeout(timeout);
    };
  }, [prepaidNumber]);

  useEffect(() => {
    const timeout = subscriberNumber !== '' ? setTimeout(() => {
      validateTypingNumber(subscriberNumber, 'postpaid');
    }, 500) : null;

    return () => {
      clearTimeout(timeout);
    };
  }, [subscriberNumber]);

  const isValueErrorPrepaid = (name) => {
    const errorPrepaid = validate(name, state[name]);
    setState({ errorPrepaid: { ...state.errorPrepaid, [name]: errorPrepaid } });
  }

  const isValueErrorPostpaid = (name) => {
    const errorPostpaid = validate(name, state[name]);
    setState({ errorPostpaid: { ...state.errorPostpaid, [name]: errorPostpaid } });
  }

  function submitPrepaid() {
    const { prepaidActiveTab, selectedPulsa, selectedPaketData } = state;

    if (prepaidActiveTab === 0) {
      if (!selectedPulsa) {
        showPopup('Silakan pilih nominal pulsa terlebih dahulu', 'warning');
        return;
      }

      const data = {
        code: selectedPulsa.pulsa_code,
        number: prepaidNumber,
        price: selectedPulsa.pulsa_price
      };

      dispatch(pulsaPrepaid(data));
    }
    else {
      if (!selectedPaketData) {
        showPopup('Silakan pilih nominal paket data terlebih dahulu', 'warning');
        return;
      }

      const data = {
        code: selectedPaketData.pulsa_code,
        number: prepaidNumber,
        price: selectedPaketData.pulsa_price
      };

      dispatch(paketDataPrepaid(data));
    }
  }

  function submitPostpaid() {
    const { selectedProvider, inquiryPostpaid } = state;

    if (!selectedProvider || !inquiryPostpaid) {
      return;
    }

    const variables = {
      OperatorType: selectedProvider.id,
      NomorPelanggan: inquiryPostpaid.hp
    };
    
    dispatch(pulsaPostpaid(variables))
  }

  function getPulsaOperator(mobileNumber) {
    if (mobileNumber.length > 9) {
      setLoadingPulsaList(true);
      setLoadingPaketDataList(true);

      Keyboard.dismiss();

      let variables = { mobileNumber };

      Client.query({
        query: queryCheckOperator,
        variables
      }).then(res => {
        console.log('res queryCheckOperator', res);

        let data = res.data;
        
        if (data && data.mobilePulsaCheckOperator) {
          setPrepaidOperator(data.mobilePulsaCheckOperator);
        } else {
          setPrepaidOperator('');
        }
      }).catch((err) => {
        console.log('Error', err);
      })
    } else {
      setState({
        pulsaList: [],
        paketDataList: [],
        selectedPulsa: null,
      });
      setLoadingPulsaList(false);
      setLoadingPaketDataList(false);
      setPrepaidOperator('');
    }
  };

  function getPrepaidList(segmentType) {
    let variables = {
      param: {
        SegmentType: segmentType,
        ServiceItem: {
          OperatorItemProvided: {
            Operator_Pulsa: prepaidOperator
          }
        }
      }
    }

    if (segmentType === 'PAKET_DATA') {
      variables.param.ServiceItem.OperatorItemProvided = {
        Operator_Paket_Data: prepaidOperator
      };
    }

    console.log(variables);

    Client.query({
      query: queryPrepaidPriceList,
      variables
    }).then(res => {
      let data = res.data.mobilePulsaPrepaidPriceList;

      let pulsaList = [];
      let paketDataList = [];

      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (data[i] !== null) {
            if (segmentType === 'PULSA_HP') pulsaList.push(data[i]);
            else paketDataList.push(data[i]);
          }
        }
      }

      if (segmentType === 'PULSA_HP') {
        setState({ pulsaList });
        setLoadingPulsaList(false);
      } else {
        setState({ paketDataList });
        setLoadingPaketDataList(false);
      }
    })
    .catch((err) => {
      console.log(err, 'err prepaid list');
      
      if (segmentType === 'PULSA_HP') {
        setState({ pulsaList: [], loadingPulsaList: false });
      } else {
        setState({ paketDataList: [], loadingPaketDataList: false });
      }
    })
  }

  function getPulsaSubscriber(nomor_pelanggan) {
    if (nomor_pelanggan.length > 9) {
      setState({ loadingInquiry: true });

      Keyboard.dismiss();
  
      const variables = {
        operator_pascabayar: state.selectedProvider.id,
        nomor_pelanggan,
      };
  
      Client.query({
        query: queryCheckSubscriber,
        variables
      })
      .then(res => {
        const data = res.data.Inquiry_PascaBayar_TELEPON;
  
        if (data && data.tr_id !== null) {
          setState({ inquiryPostpaid: data, loadingInquiry: false, isEmptyBill: false });
        } else {
          setState({ inquiryPostpaid: null, loadingInquiry: false, isEmptyBill: true, })
        }
      })
      .catch(err => {
        setState({ inquiryPostpaid: null, loadingInquiry: false, isEmptyBill: true, });
        console.log(err, 'err')
      })
    } else {
      setState({
        inquiryPostpaid: null,
        loadingInquiry: false,
        isEmptyBill: false,
      })
    }
  }

  function validateTypingNumber(number, type) {
    if (type === 'prepaid') {
      getPulsaOperator(number);
    } else {
      getPulsaSubscriber(number);
    }
  }

  function renderError(error) {
    return (
      <ErrorView>
        <ErrorMessage
          type='medium'
          color={Color.error}
        >
          {error}
        </ErrorMessage>
      </ErrorView>
    );
  }

  function renderTabHeading(label, index, activeTab) {
    return (
      <TabHeading style={{backgroundColor: Color.textInput}}>
        <Text type={activeTab !== index ? 'semibold' : 'bold'} style={activeTab !== index ? {color: Color.text} : {color: Color.secondary}}>{label}</Text>
      </TabHeading>
    );
  }

  function renderPulsaPrepaidList(data, selected) {
    const selectedItem = state[selected];

    if (selected === 'selectedPulsa' && loadingPulsaList) return <ScreenIndicator visible />;

    if (selected === 'selectedPaketData' && loadingPaketDataList) return <ScreenIndicator visible />;

    return (
      <>
        <FlatList
          keyExtractor={(item, index) => item.id+index.toString()}
          keyboardShouldPersistTaps='handled'
          data={prepaidOperator !== '' ? data : []}
          renderItem={({ item }) => {
            const isSelected = selectedItem && selectedItem.pulsa_code === item.pulsa_code;
            return (
              <PrepaidContainer>
                <ButtonPrepaidList
                  activeOpacity={0.75}
                  onPress={() => {
                    setState({ [selected]: item });
                    Keyboard.dismiss();
                  }}
                  style={[
                    shadowStyle,
                    { backgroundColor: Color.theme, borderWidth: isSelected ? 2 : 1, borderColor: isSelected ? Color.primary : Color.border}
                  ]}
                >
                  <Text type='semibold' size={15}>{item.pulsa_nominal}</Text>
                  <Text>Harga <Text style={{marginTop: 8, color: Color.error}}>{FormatMoney.getFormattedMoney(item.pulsa_price)}</Text></Text>
                </ButtonPrepaidList>
              </PrepaidContainer>
            )
          }}
          numColumns={2}
          style={{backgroundColor: Color.theme}}
          contentContainerStyle={data.length > 0 && {paddingTop: 8, paddingHorizontal: 8}}
          ListEmptyComponent={() => prepaidOperator !== '' && <ScreenEmptyData type='large' message='Produk tidak tersedia' />}
        />

        <Footer
          detail={FormatMoney.getFormattedMoney(selectedItem ? selectedItem.pulsa_price : 0)}
          buttonLabel='Beli'
          buttonColor={selectedItem ? Color.primary : Color.disabled}
          onPress={() => selectedItem && onConfirm(selected)}
        />
      </>
    )
  }

  function renderPulsaPrepaid() {
    const { prepaidActiveTab, pulsaList, paketDataList, errorPrepaid } = state;

    const tabs = [
      { label: 'Pulsa', children: renderPulsaPrepaidList(pulsaList, 'selectedPulsa') },
      { label: 'Paket Data', children: renderPulsaPrepaidList(paketDataList, 'selectedPaketData') }
    ];

    return (
      <>
        <TopView style={{backgroundColor: Color.textInput}}>
          <InfoNumberView>
            <Text size={12} color={Color.bordered}>No. Telepon</Text>
            <Text size={12} color={Color.secondary} onPress={() => navigation.navigate('TeleponScreen')}>No. Pascabayar?</Text>
          </InfoNumberView>
          <InputNumberView
            style={[
              { backgroundColor: Color.textInput },
              { borderColor: errorPrepaid.prepaidNumber ? Color.error : Color.border }
            ]}
          >
            <TextInputNumber
              name="prepaidNumber"
              returnKeyType="done"
              returnKeyLabel="Done"
              type={'only-numbers'}
              blurOnSubmit={false}
              onBlur={() => isValueErrorPrepaid('prepaidNumber')}
              error={null}
              onChangeText={(val) => {
                setPrepaidNumber(val);
                setState({ selectedPulsa: null, selectedPaketData: null });
              }}
              value={prepaidNumber}
              onSubmitEditing={Keyboard.dismiss}
              style={{color: Color.text}}
            />
          </InputNumberView>
          {renderError(errorPrepaid.prepaidNumber)}
        </TopView>

        <Tabs
          prerenderingSiblingsNumber={Infinity}
          tabContainerStyle={{elevation: 0}}
          tabBarUnderlineStyle={{backgroundColor: Color.secondary, height: 2}}
          onChangeTab={({ i }) => setState({ prepaidActiveTab: i })}
          locked={Platform.OS == 'android'}
          initialPage={prepaidActiveTab}
        >
          {tabs.map((item, index) =>
            <Tab
              key={index}
              style={{backgroundColor: Color.primary}}
              heading={renderTabHeading(item.label, index, prepaidActiveTab)}
            >
              <View style={{paddingTop: 16, paddingBottom: 8}}>
                <Text>{prepaidOperator === 'unkown prefix' ? 'Operator tidak dikenal' : prepaidOperator}</Text>
              </View>
              {index === prepaidActiveTab && item.children}
            </Tab>
          )}
        </Tabs>
      </>
    )
  }

  function renderPulsaPostpaid() {
    const { inquiryPostpaid, selectedProvider, loadingInquiry, errorPostpaid, isEmptyBill } = state;

    return (
      <>
        <TopView style={{backgroundColor: Color.textInput}}>
          <InfoNumberView>
            <Text type='semibold' align='left'>Provider</Text>
          </InfoNumberView>
          <InputNumberView
            style={[
              { backgroundColor: Color.textInput },
              { borderColor: errorPostpaid.selectedProvider ? Color.error : Color.border }
            ]}
          >
            <SelectProvider onPress={() => setState({ modalProvider: true })}>
              <Text type='medium' align='left' style={{color: Color.button}}>{selectedProvider ? selectedProvider.name : 'Pilih Provider'}</Text>
              <MaterialIcons name='arrow-forward-ios' color={Color.gray} />
            </SelectProvider>
          </InputNumberView>
          {renderError(errorPostpaid.selectedProvider)}

          <InfoNumberView style={{paddingTop: 4}}>
            <Text type='semibold' align='left'>Nomor Telepon</Text>
          </InfoNumberView>
          <InputNumberView
            style={[
              { backgroundColor: Color.textInput },
              { borderColor: errorPostpaid.subscriberNumber ? Color.error : Color.border }
            ]}
          >
            <TextInputNumber
              name="prepaidNumber"
              returnKeyType="done"
              returnKeyLabel="Done"
              type='only-numbers'
              blurOnSubmit={false}
              onBlur={() => isValueErrorPostpaid('subscriberNumber')}
              error={null}
              onChangeText={(val) => {
                if (!selectedProvider) {
                  isValueErrorPostpaid('selectedProvider')
                  return;
                }

                setState({ inquiryPostpaid: null });
                setSubscriberNumber(val);
              }}
              value={subscriberNumber}
              onSubmitEditing={Keyboard.dismiss}
              style={{color: Color.text}}
            />
          </InputNumberView>
          {renderError(errorPostpaid.subscriberNumber)}
        </TopView>

        <ScrollView>
          { loadingInquiry ?
            <ScreenIndicator visible />
          : isEmptyBill ?
            <ScreenEmptyData type='large' message='Tagihan tidak tersedia' />
          :
            <SusbcriberView>
              <RowSubscriberView style={{backgroundColor: Color.secondary}}>
                <ColSubscriberLeftView>
                  <SubscriberText type='medium'>ID Pelanggan</SubscriberText>
                  <SubscriberText type='medium'>Nama Pelanggan</SubscriberText>
                  <SubscriberText type='medium'>Tagihan</SubscriberText>
                  <SubscriberText type='medium'>Periode</SubscriberText>
                  <SubscriberText type='medium'>Admin</SubscriberText>
                </ColSubscriberLeftView>

                <ColSubscriberRightView>
                  <SubscriberText type='medium'>{inquiryPostpaid ? inquiryPostpaid.tr_id : '-'}</SubscriberText>
                  <SubscriberText type='medium' numberOfLines={1}>{inquiryPostpaid ? inquiryPostpaid.tr_name : '-'}</SubscriberText>
                  <SubscriberText type='medium'>{inquiryPostpaid ? FormatMoney.getFormattedMoney(inquiryPostpaid.nominal) : '-'}</SubscriberText>
                  <SubscriberText type='medium'>{inquiryPostpaid ? getPeriodText(inquiryPostpaid.period) : '-'}</SubscriberText>
                  <SubscriberText type='medium'>{inquiryPostpaid ? FormatMoney.getFormattedMoney(inquiryPostpaid.admin) : '-'}</SubscriberText>
                </ColSubscriberRightView>
              </RowSubscriberView>
            </SusbcriberView>
          }
        </ScrollView>

        <Footer
          detail={FormatMoney.getFormattedMoney(inquiryPostpaid ? inquiryPostpaid.price : 0)}
          buttonLabel='Beli'
          buttonColor={inquiryPostpaid ? Color.primary : Color.disabled}
          onPress={() => inquiryPostpaid && onConfirm()}
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
      title: 'Pulsa',
      type: 'ALL',
      productType,
      // category: 'PULSA_HP', nexttime
    })
  }

  function onConfirm(selected) {
    const { activeTab, prepaidActiveTab, inquiryPostpaid } = state;
    const selectedItem = state[selected];
    let dataConfirm = [];
    const productName = prepaidActiveTab === 0 ? 'Pulsa' : 'Paket Data';

    if (activeTab === 0) {
      dataConfirm.push(
        { name: 'Nomor Ponsel', value: prepaidNumber },
        { name: `${productName} ${prepaidOperator}`, value: prepaidActiveTab === 0 ? FormatMoney.getFormattedMoney(selectedItem.pulsa_nominal) : selectedItem.pulsa_nominal },
        { name: `Harga ${productName}`, value: FormatMoney.getFormattedMoney(selectedItem.pulsa_price) },
      )
    } else {
      dataConfirm.push(
        { name: 'Nomor Telepon', value: inquiryPostpaid.hp },
        { name: inquiryPostpaid.tr_name, value: FormatMoney.getFormattedMoney(inquiryPostpaid.nominal) },
        { name: 'Periode', value: getPeriodText(inquiryPostpaid.period) },
        { name: 'Biaya Admnin', value: FormatMoney.getFormattedMoney(inquiryPostpaid.admin) },
        { name: 'Harga Pulsa', value: FormatMoney.getFormattedMoney(inquiryPostpaid.price) },
      )
    }

    setState({
      dataConfirm,
    });

    modalConfirmRef.current.open();
  }

  function onSelectedProvider(item) {
    setState({
      selectedProvider: item,
      modalProvider: false
    });

    if (subscriberNumber !== '') {
      getPulsaSubscriber(subscriberNumber);
    }

    isValueErrorPostpaid('selectedProvider');
  }

  const { activeTab, prepaidActiveTab, dataConfirm, selectedPulsa, selectedPaketData } = state;

  const { selectedProvider, modalProvider, inquiryPostpaid } = state;

  return (
    <MainView>
      <Header
        title='Pulsa'
        onPressRightButton={() => onPressRightButton(activeTab === 0 ? 'PREPAID' : 'POSTPAID')}
        iconRightButton={<MaterialIcons name='history' size={22} color={Color.gray} />}
      />

      {renderPulsaPrepaid()}

      <Modal
        visible={modalProvider}
        onRequestClose={() => {
          setState({ modalProvider: false });
          isValueErrorPostpaid('selectedProvider');
        }}
        animationType='slide'
      >
        <SafeAreaView>
          <Header
            title='Pilih Provider'
            onPressLeftButton={() => {
              setState({ modalProvider: false });
              isValueErrorPostpaid('selectedProvider');
            }}
          />
          <FlatList
            keyExtractor={(item, index) => item.id+index.toString()}
            data={PulsaPostpaidProvider}
            renderItem={({ item }) => {
              const isSelected = selectedProvider && selectedProvider.id === item.id;
              return (
                <View style={{width: '100%', height: 45, marginBottom: 8}}>
                  <ButtonListProvider
                    activeOpacity={0.75}
                    onPress={() => onSelectedProvider(item)}
                    style={[
                      { borderColor: Color.border },
                      isSelected && {borderWidth: 2, borderColor: Color.primary}
                    ]}
                  >
                    <Text>{item.name}</Text>
                  </ButtonListProvider>
                </View>
              )
            }}
            contentContainerStyle={{paddingTop: 8, paddingHorizontal: 16}}
          />
        </SafeAreaView>
      </Modal>

      <Modalize
        ref={modalConfirmRef}
        overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
        adjustToContentHeight
        handlePosition='inside'
        handleStyle={{width: '30%', height: 4, marginTop: 8, backgroundColor: Color.primary}}
        modalStyle={{
          backgroundColor: Color.theme
        }}
      >
        <View style={{paddingTop: 36, paddingHorizontal: 16, paddingBottom: 16}}>
          <View style={{paddingTop: 8, paddingBottom: 8, alignItems: 'flex-start'}}>
            <Text size={15} letterSpacing={0.23}>Informasi Pesanan</Text>
          </View>
          
          {dataConfirm.map((item, idx) =>
            <RowSubscriberView key={idx}>
              <ColSubscriberLeftView style={{paddingHorizontal: 0, paddingBottom: 0}}>
                <Text type='medium' align='left' color={Color.bordered}>{item.name}</Text>
              </ColSubscriberLeftView>
              <ColSubscriberRightView style={{paddingHorizontal: 0, paddingBottom: 0}}>
                <Text type='medium' align='right' color={Color.bordered}>{item.value}</Text>
              </ColSubscriberRightView>
            </RowSubscriberView>
          )}

          <View style={{width: '100%', height: 1, backgroundColor: Color.border, marginTop: 16}} />
        </View>

        <View style={{paddingHorizontal: 16, paddingBottom: 16, width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text type='semibold' letterSpacing={0.18}>Total</Text>
          <Text type='semibold' letterSpacing={0.18}>{activeTab === 0 ? FormatMoney.getFormattedMoney(prepaidActiveTab === 0 ? (selectedPulsa ? selectedPulsa.pulsa_price : 0) : (selectedPaketData ? selectedPaketData.pulsa_price : 0)) : FormatMoney.getFormattedMoney(inquiryPostpaid ? inquiryPostpaid.price : 0)}</Text>
        </View>

        <Footer
          footerType='button'
          buttonLabel='Konfirmasi'
          buttonColor={Color.primary}
          buttonBorderTopWidth={0}
          onPress={() => activeTab === 0 ? submitPrepaid() : submitPostpaid()}
        />
      </Modalize>

      <Loading {...loadingProps} />

      <Popup {...popupProps} />

    </MainView>
  )
}
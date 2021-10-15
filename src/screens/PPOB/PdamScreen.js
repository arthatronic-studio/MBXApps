import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, Modal, FlatList, ScrollView, TextInput } from 'react-native';
import Styled from 'styled-components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TextInputMask } from 'react-native-masked-text';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import { Modalize } from 'react-native-modalize';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Header from '@src/components/Header';
import Footer from '@src/components/Footer';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import FormatMoney from '@src/utils/FormatMoney';
import Popup, { usePopup } from '@src/components/Modal/Popup';
import Loading, { useLoading } from '@src/components/Modal/Loading';
import ScreenEmptyData from '@src/components/Modal/ScreenEmptyData';
import ScreenIndicator from '@src/components/Modal/ScreenIndicator';

import { pdamPostpaid } from '@src/state/actions/Postpaid/pdam';
import { shadowStyle } from '@src/styles';
import { MainView, Container } from '@src/styled';

import Client from '@src/lib/apollo';
import { queryListArea, queryInquiryPascaBayarPDAM } from '@src/lib/query/pdam';

const InputNumberView = Styled(View)`
  marginTop: 8;
  paddingHorizontal: 8;
  borderRadius: 8px;
  borderWidth: 0.5px;
`;

const SelectArea = Styled(TouchableOpacity)`
  width: 100%;
  alignContent: flex-start;
  height: 45;
  flexDirection: row;
  justifyContent: space-between;
  alignItems: center;
`;

const InfoNumberView = Styled(View)`
  flexDirection: row;
  justifyContent: space-between;
  paddingTop: 16px;
`;

const TextInputSubsriber = Styled(TextInputMask)`
  width: 100%;
  height: 45;
  fontFamily: OpenSans-Regular;
  alignContent: flex-start;
  letterSpacing: 0.36;
  borderWidth: 0.5px;
  marginTop: 12;
  paddingHorizontal: 10;
  borderRadius: 4px;
`;

const TextInputSearch= Styled(TextInput)`
  width: 100%;
  height: 45;
  fontFamily: OpenSans-Regular;
  alignContent: flex-start;
  letterSpacing: 0.36;
  borderWidth: 0.5px;
  marginTop: 12;
  paddingHorizontal: 10;
  borderRadius: 4px;
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

const SusbcriberView = Styled(View)`
  padding: 16px;
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

export default ({ navigation, route }) => {
  const [state, changeState] = useState({
    inquiryPostpaid: null,
    isEmptyBill: false,
    loadingPascabayar: false,
    selectedArea: null, // { id: "PDAMKAB_BOGOR", name: "PDAMKAB BOGOR" },
    pdamNumber: '', // '08068813', //kab bogor
    modalArea: false,
    listArea: [],
    dataConfirm: [],
    tempListArea: [],
    tempTextSearch: '',
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
    getListArea();
  }, []);

  useEffect(() => {
    const timeout = state.pdamNumber !== '' && state.selectedArea ?
      setTimeout(() => {
        getInquiryPdamPascabayar(state.pdamNumber);
      }, 1000) : null;

    return () => {
      clearTimeout(timeout);
    }
  }, [state.pdamNumber, state.selectedArea]);

  useEffect(() => {
    const timeout = state.tempTextSearch !== '' ? setTimeout(() => {
      searchFilter(state.tempTextSearch);
    }, 3000) : null;

    return () => {
      clearTimeout(timeout);
    }
  }, [state.tempTextSearch]);

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

  function getListArea() {
    Client.query({
      query: queryListArea,
    })
    .then(res => {
      const data = res.data.GET_LIST_PDAM_AREA;
      let listArea = [];
      
      if (data && Array.isArray(data)) {
        data.map((item) => listArea.push({ id: item, name: item.replace(/_/g, ' ') }));
      }
      
      setState({ listArea });
    })
    .catch(err => {
      console.log(err, 'err');
    })
  }

  function getInquiryPdamPascabayar(nomor_pelanggan) {
    if (nomor_pelanggan.length > 5 && state.selectedArea) {
      setState({ loadingPascabayar: true });

      let variables = {
        area_pelayanan: state.selectedArea.id,
        nomor_pelanggan
      }
  
      Client.query({
        query: queryInquiryPascaBayarPDAM,
        variables
      })
      .then(res => {
        const data = res.data.Inquiry_PascaBayar_PDAM;

        if (data && data.tr_id) {
          setState({ inquiryPostpaid: data, loadingPascabayar: false });
        } else {
          setState({ isEmptyBill: true, loadingPascabayar: false });
        }
      })
      .catch(err => {
        console.log(err, 'err');
        setState({ inquiryPostpaid: null, loadingPascabayar: false, isEmptyBill: true });
      })
    } else {
      setState({ inquiryPostpaid: null, loadingPascabayar: false, isEmptyBill: false });
    }
  }

  function openModal(modal) {
    // let timeout = setTimeout(() => {
    //   clearTimeout(timeout);
      setState({ [modal]: true });
    // }, 500)
  }

  function closeModal(modal) {
    // let timeout = setTimeout(() => {
    //   clearTimeout(timeout);
      setState({ [modal]: false });
    // }, 500);
  }

  function searchFilter(searchText) {
    const text = searchText.toLowerCase();
    let data = state.listArea;

    let tempListArea = data.filter((item) => (
      item.name.toLowerCase().indexOf(text) > -1
    ));

    setState({ tempListArea });
  }

  function onSelectedArea(item) {
    setState({
      selectedArea: item,
      modalArea: false
    });
  }

  function getPeriodText(period) {
    let tahun = period.length >= 4 ? period.substring(0, 4) : '';
    let bulan = period.length >= 6 ? Moment(period.substring(4, 6)).format('MMM') : '';
    return bulan + ' ' + tahun;
  }

  function onPressRightButton() {
    navigation.navigate('OrderListPerProduct', {
      title: 'PDAM',
      type: 'ALL',
      productType: 'POSTPAID',
      // category: 'PULSA_HP', nexttime
    })
  }

  function onConfirm() {
    const { selectedArea, inquiryPostpaid } = state;
    if (selectedArea === null || inquiryPostpaid === null) return;

    const dataConfirm = [
      { name: 'Nomor PDAM', value: inquiryPostpaid.hp },
      { name: selectedArea.name + ' - ' + inquiryPostpaid.tr_name, value: FormatMoney.getFormattedMoney(inquiryPostpaid.nominal) },
      { name: 'Periode', value: getPeriodText(inquiryPostpaid.period) },
      { name: 'Biaya Admin', value: FormatMoney.getFormattedMoney(inquiryPostpaid.admin) },
      { name: 'Harga Pulsa', value: FormatMoney.getFormattedMoney(inquiryPostpaid.price) },
    ];

    setState({ dataConfirm });
    modalConfirmRef.current.open();
  }

  function submitPostpaid() {
    const { selectedArea, inquiryPostpaid } = state;

    if (!selectedArea || !inquiryPostpaid) {
      return;
    }

    const variables = {
      Kode_Area: selectedArea.id,
      NomorPelanggan: inquiryPostpaid.hp
    };
    
    dispatch(pdamPostpaid(variables));
  }

  function renderModalListArea() {
    const { listArea, selectedArea, tempTextSearch, tempListArea } = state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Color.theme}}>
        <Header
          title='Pilih Area'
          onPressLeftButton={() => closeModal('modalArea')}
        />

        <View style={{paddingHorizontal: 16, paddingBottom: 8}}>
          <TextInputSearch
            value={tempTextSearch}
            placeholder='Masukan kata kunci'
            placeholderTextColor={Color.border}
            onChangeText={(text) => {
              setState({ tempTextSearch: text });
            }}
            blurOnSubmit={false}
            error={null}
            style={{color: Color.text, backgroundColor: Color.textInput, borderColor: Color.border}}
          />
        </View>

        <FlatList
          keyExtractor={(item, index) => item.id+index.toString()}
          data={tempTextSearch.length > 0 ? tempListArea : listArea}
          style={{backgroundColor: Color.theme}}
          contentContainerStyle={{paddingTop: 8, paddingHorizontal: 16, paddingBottom: 110, backgroundColor: Color.themr}}
          renderItem={({ item }) => {
            const isSelected = selectedArea && selectedArea.id === item.id;
            return (
              <View style={{width: '100%', height: 45, marginBottom: 8}}>
                <ButtonListProvider
                  activeOpacity={0.75}
                  onPress={() => onSelectedArea(item)}
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
        />
      </SafeAreaView>
    )
  }

  function renderModalConfirm() {
    const { inquiryPostpaid, dataConfirm } = state;

    return (
      <>
        <View style={{paddingTop: 36, paddingHorizontal: 16, paddingBottom: 16}}>
          <View style={{paddingTop: 8, paddingBottom: 8, alignItems: 'flex-start'}}>
            <Text size={15} letterSpacing={0.23}>Informasi Pesanan</Text>
          </View>
          
          {dataConfirm.map((item, idx) =>
            <RowSubscriberView key={idx} style={{backgroundColor: Color.secondary}}>
              <ColSubscriberLeftView style={{paddingHorizontal: 0, paddingBottom: 0, backgroundColor: '#FFFFFF'}}>
                <Text type='medium' align='left' color={Color.bordered}>{item.name}</Text>
              </ColSubscriberLeftView>
              <ColSubscriberRightView style={{paddingHorizontal: 0, paddingBottom: 0, backgroundColor: '#FFFFFF'}}>
                <Text type='medium' align='right' color={Color.bordered}>{item.value}</Text>
              </ColSubscriberRightView>
            </RowSubscriberView>
          )}

          <View style={{width: '100%', height: 1, backgroundColor: Color.border, marginTop: 16}} />
        </View>

        <View style={{paddingHorizontal: 16, paddingBottom: 16, width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text type='semibold' letterSpacing={0.18}>Total</Text>
          <Text type='semibold' letterSpacing={0.18}>{FormatMoney.getFormattedMoney(inquiryPostpaid ? inquiryPostpaid.price : 0)}</Text>
        </View>

        <Footer
          footerType='button'
          buttonLabel='Konfirmasi'
          buttonColor={Color.primary}
          buttonBorderTopWidth={0}
          onPress={() => submitPostpaid()}
        />
      </>
    )
  }

  const { selectedArea, inquiryPostpaid, modalArea, isEmptyBill, loadingPascabayar } = state;
  
  return(
    <MainView style={{backgroundColor: Color.theme}}>
      <Header
        title='PDAM'
        onPressRightButton={() => onPressRightButton()}
        iconRightButton={<MaterialIcons name='history' size={22} color={Color.gray} />}
      />
      <ScrollView>
        <Container>
          <InfoNumberView>
            <Text>Area</Text>
          </InfoNumberView>
          <InputNumberView
            style={{backgroundColor: Color.textInput, borderColor: Color.border}}
          >
            <SelectArea
              activeOpacity={0.5}
              onPress={() => openModal('modalArea')}
            >
              <Text>{selectedArea ? selectedArea.name : 'Pilih Area'}</Text>
              <MaterialIcons name='keyboard-arrow-right' />
            </SelectArea>
          </InputNumberView>

          <InfoNumberView>
            <Text>ID Pelanggan</Text>
          </InfoNumberView>
          <TextInputSubsriber
            name="text"
            returnKeyType="done"
            returnKeyLabel="Done"
            type='only-numbers'
            value={state.pdamNumber}
            onChangeText={(text) => setState({ pdamNumber: text, inquiryPostpaid: null })}
            blurOnSubmit={false}
            error={null}
            style={{color: Color.text, backgroundColor: Color.textInput, borderColor: Color.border}}
          />
        </Container>

        {loadingPascabayar ?
          <ScreenIndicator visible />
        : isEmptyBill ?
          <ScreenEmptyData
            type='large'
            message='Tagihan tidak tersedia'
          />
        :
          <SusbcriberView>
            <RowSubscriberView style={{backgroundColor: Color.secondary, marginTop: 16}}>
              <ColSubscriberLeftView>
                <SubscriberText color={Color.textInput} type='medium'>ID Pelanggan</SubscriberText>
                <SubscriberText color={Color.textInput} type='medium'>Nama Pelanggan</SubscriberText>
                <SubscriberText color={Color.textInput} type='medium'>Tagihan</SubscriberText>
                <SubscriberText color={Color.textInput} type='medium'>Periode</SubscriberText>
                <SubscriberText color={Color.textInput} type='medium'>Admin</SubscriberText>
              </ColSubscriberLeftView>

              <ColSubscriberRightView>
                <SubscriberText color={Color.textInput} type='medium'>{inquiryPostpaid ? inquiryPostpaid.tr_id : '-'}</SubscriberText>
                <SubscriberText color={Color.textInput} type='medium' numberOfLines={1}>{inquiryPostpaid ? inquiryPostpaid.tr_name : '-'}</SubscriberText>
                <SubscriberText color={Color.textInput} type='medium'>{inquiryPostpaid ? FormatMoney.getFormattedMoney(inquiryPostpaid.nominal) : '-'}</SubscriberText>
                <SubscriberText color={Color.textInput} type='medium'>{inquiryPostpaid ? getPeriodText(inquiryPostpaid.period) : '-'}</SubscriberText>
                <SubscriberText color={Color.textInput} type='medium'>{inquiryPostpaid ? FormatMoney.getFormattedMoney(inquiryPostpaid.admin) : '-'}</SubscriberText>
              </ColSubscriberRightView>
            </RowSubscriberView>
          </SusbcriberView>
        }
      </ScrollView>

      <Footer
        detail={FormatMoney.getFormattedMoney(inquiryPostpaid ? inquiryPostpaid.price : 0)}
        buttonLabel='Beli'
        buttonColor={inquiryPostpaid ? Color.primary : Color.disabledButton}
        onPress={() => inquiryPostpaid && onConfirm()}
      />

      <Modal
        visible={modalArea}
        onRequestClose={() => closeModal('modalArea')}
        animationType='fade'
      >
        {renderModalListArea()}
      </Modal>

      <Modalize
        ref={modalConfirmRef}
        overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
        adjustToContentHeight
        handlePosition='inside'
        handleStyle={{width: '30%', height: 4, marginTop: 8, backgroundColor: Color.border}}
      >
        {renderModalConfirm()}
      </Modalize>

      <Loading {...loadingProps} />

      <Popup {...popupProps} />
    </MainView>
  )
}
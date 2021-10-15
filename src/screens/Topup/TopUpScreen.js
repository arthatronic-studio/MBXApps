import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Styled from 'styled-components';
import { TextInputMask } from 'react-native-masked-text';

import { TouchableOpacity } from '@src/components/Button';
import { useLoading } from '@src/components/Modal/Loading';
import { usePopup } from '@src/components/Modal/Popup';
import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Footer from '@src/components/Footer';
import Scaffold from '@src/components/Scaffold';
import FormatMoney from '@src/utils/FormatMoney';
import { shadowStyle } from '@src/styles';

import { topUp } from '@src/state/actions/user/topUp';

const HeaderView = Styled(View)`
  margin: 16px
  flexDirection: row;
`;

const SubView = Styled(View)`
  padding: 0px 16px 8px;
`;

const TextHeader = Styled(Text)`
  fontSize: 16px;
  lineHeight: 18px;
`;

const EyeIconView = Styled(TouchableOpacity)`
  height: 38%;
  justifyContent: center;
  alignItems: flex-end;
  marginRight: 8px;
`;

const InputView = Styled(View)`
  width: 100%;
  height: 45px;
  alignItems: center;
  flexDirection: row;
  paddingHorizontal: 8;
  borderRadius: 4px;
`;

const InputNumberView = Styled(TextInputMask)`
  width: 90%;
  height: 100%;
  alignContent: flex-start;
  fontFamily: OpenSans-Regular;
`;

const TopUpScreen = ({ navigation, route }) => {
  // state
  const [text, setText] = useState('');
  const [selectedAmount, setSelectedAmount] = useState();

  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const {
    fetching,
    error,
    booking,
  } = useSelector(state => state['booking']);

  const dispatch = useDispatch();

  const [loadingProps, showLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();
  const { Color } = useColor();

  const amountTopup = useRef();

  useEffect(() => {
    dispatch({ type: 'BOOKING.CLEAR_BOOKING' });
  }, []);

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

  const submit = () => {
    if (text !== '') {
      if (amountTopup.current.getRawValue() < 10000) {
        showPopup('Minimal topup adalah Rp 10.000', 'warning');
        return;
      }

      dispatch(topUp(amountTopup.current.getRawValue()));
    } else {
      showPopup('Silakan masukan nominal topup terlebih dulu', 'warning');
    }
  }

  const nominalList = [
    { id: 0, amount: 10000 },
    { id: 1, amount: 20000 },
    { id: 2, amount: 50000 },
    { id: 3, amount: 100000 },
    { id: 4, amount: 150000 },
    { id: 5, amount: 200000 },
    { id: 6, amount: 500000 },
    { id: 7, amount: 1000000 },
  ];
  
  return (
    <Scaffold
      headerTitle='Isi Saldo'
      popupProps={popupProps}
      loadingProps={loadingProps}
    >
      <HeaderView>
        <TextHeader>Isi Nominal</TextHeader>
      </HeaderView>
      <SubView>
        <InputView style={{backgroundColor: Color.textInput, ...shadowStyle}}>
          <EyeIconView><TextHeader>Rp</TextHeader></EyeIconView>
          <InputNumberView
            ref={amountTopup}
            name="text"
            returnKeyType="done"
            returnKeyLabel="Done"
            type='money'
            blurOnSubmit={false}
            error={null}
            placeholder='Silakan masukan nominal'
            onChangeText={(val) => {
              setText(val);
              setSelectedAmount();
            }}
            value={text}
            options={{
              precision: 0,
              separator: ',',
              delimiter: '.',
              unit: '',
              suffixUnit: ''
            }}
            onSubmitEditing={() => submit()}
            style={{color: Color.text, backgroundColor: Color.textInput}}
          />
        </InputView>
      </SubView>

      <HeaderView style={{marginBottom: 8}}>
        <TextHeader>Atau Pilih Nominal</TextHeader>
      </HeaderView>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        data={nominalList}
        numColumns={2}
        contentContainerStyle={{paddingHorizontal: 8}}
        keyboardShouldPersistTaps='handled'
        renderItem={({ item }) => {
          const isSelected = selectedAmount && selectedAmount.id === item.id;
          return (
            <View style={{width: '50%', paddingVertical: 8, paddingHorizontal: 8}}>
              <TouchableOpacity
                onPress={() => {
                  setText(item.amount.toString());
                  setSelectedAmount(item);
                }}
                style={[
                  {height: 70, width: '100%', borderRadius: 4, justifyContent: 'center', backgroundColor: Color.textInput},
                  isSelected && {borderColor: Color.secondary, borderWidth: 2},
                  shadowStyle
                ]}
              >
                <Text type='semibold' color={isSelected ? Color.secondary : Color.text}>{FormatMoney.getFormattedMoney(item.amount)}</Text>
              </TouchableOpacity>
            </View>
          )
        }}
      />

      <Footer
        footerType='button'
        buttonLabel='Lanjut Pembayaran'
        buttonColor={Color.primary}
        onPress={() => submit()}
      />
    </Scaffold>
  );
}

export default TopUpScreen;

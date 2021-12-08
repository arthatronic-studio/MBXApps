import React, { useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import Styled from 'styled-components';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import Footer from '@src/components/Footer';
import Popup, { usePopup } from '@src/components/Modal/Popup';
import Loading, { useLoading } from '@src/components/Modal/Loading';
import ToucableOpacity from '@src/components/Button/TouchableDebounce';

import Client from '@src/lib/apollo';
import { queryCheckBookingStatus } from '@src/lib/query/booking';
import { MainView } from '@src/styled';

import {
    imagePaymentSuccess,
} from '@assets/images';

const Container = Styled(View)`
    padding: 16px;
    width: 100%;
    height: 100%;
    justifyContent: center;
    alignItems: center;
`;

export default ({ navigation, route }) => {
    // params
    const isNeedCheckStatusPayment = route.params && route.params.bookingId && typeof route.params.bookingId !== 'undefined';

    // state
    const [checkPaymentSection, setCheckPaymentSection] = useState(isNeedCheckStatusPayment ? true : false);

    // hooks
    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();
    const { Color } = useColor();

    const checkStatusPayment = () => {
        showLoading();

        //30052 sukses// 39155 waiting,
        const variables = {
            bookingId: route.params.bookingId,
        };

        // console.log(variables, 'variables');

        Client.query({
          query: queryCheckBookingStatus,
          variables,
        })
        .then(res => {
        //   console.log(res, 'res');
            
          hideLoading();
          const data = res.data.bookingDetail;

          let label = '';

          if (data && data.bookingStatus && typeof data.bookingStatus.id !== 'undefined') {
            if (data.bookingStatus.id === 4) {
              setCheckPaymentSection(false);
            }

            if (data.bookingStatus.id === 2) {
              label = 'Menunggu Pembayaran';
              showPopup(label, 'info');
            }
          }
        })
        .catch((err) => {
            // console.log(err, 'err');
            
            hideLoading();
            showPopup('Terjadi kesalahan server', 'error');
        })
    }

    if (checkPaymentSection) {
        return (
            <MainView style={{backgroundColor: Color.theme}}>
                <Container>
                    <Text type='semibold' size={18} letterSpacing={0.36} style={{color: Color.gray, marginBottom: 16}}>Pembayaran telah dilakukan, silakan cek status pembayaran!</Text>
                    <ToucableOpacity
                        onPress={() => {
                            checkStatusPayment();
                        }}
                        style={{width: '80%', height: 45, borderRadius: 4, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center'}}>
                        <Text type='medium' color={Color.textInput}>Cek Status Pembayaran</Text>
                    </ToucableOpacity>
                </Container>

                <Popup {...popupProps} />
                <Loading {...loadingProps} />
            </MainView>
        )
    }

    return (
        <MainView style={{backgroundColor: Color.theme}}>
            <ScrollView contentContainerStyle={{height: '100%'}}>
                <Container>
                    <Image source={imagePaymentSuccess} style={{width: 166, height: 166}} resizeMode='contain' />
                    <Text type='semibold' size={24} letterSpacing={0.36} style={{color: Color.gray, marginTop: 30}}>Pembayaran berhasil!</Text>
                    <Footer
                        footerType='button'
                        buttonLabel='Halaman Awal'
                        buttonColor={Color.primary}
                        buttonWidth='50%'
                        buttonBorderTopWidth={0}
                        onPress={() => navigation.popToTop()}
                        />
                </Container>
            </ScrollView>
        </MainView>
    )
};
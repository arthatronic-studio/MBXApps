import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, BackHandler } from 'react-native';
import Styled from 'styled-components';
import Clipboard from "@react-native-community/clipboard";
import Moment from 'moment';
import Accordion from 'react-native-collapsible/Accordion';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import FormatMoney from '@src/utils/FormatMoney';
import Header from '@src/components/Header';
import Footer from '@src/components/Footer';
import Popup, { usePopup } from '@src/components/Modal/Popup';
import Loading, { useLoading } from '@src/components/Modal/Loading';
import PaymentInstructions from '@src/components/LocalData/PaymentInstructions';

import graphClient from '@src/lib/apollo';
import { queryCheckBookingStatus } from '@src/lib/query';
import { getOptionsProduct } from '@src/utils/getOptionsProduct';
import { MainView } from '@src/styled';

const baseMargin = 16;

const Container = Styled(View)`
    padding: 0px 16px 8px;
`;

const BankView = Styled(View)`
    padding: 16px 8px;
    backgroundColor: #E6E9F2;
    borderRadius: 4px;
`;

const MiniBackgroundView = Styled(View)`
    width: 100%;
    height: 80;
    backgroundColor: #FFFFFF;
    position: absolute;
`;

const MainContentView = Styled(View)`
    width: 100%;
    height: 100%;
    flexDirection: column;
    paddingTop: 16px;
`;

const MainInfoContainer = Styled(View)`
    width: 100%;
    minHeight: 1;
    paddingHorizontal: ${baseMargin};
`;

const MainInfoView = Styled(View)`
    width: 100%;
    minHeight: 1;
    alignItems: center;
    backgroundColor: #FFFFFF;
    marginVertical: 20;
    padding: 16px;
    borderRadius: 3;
`;

const TimerView = Styled(View)`
    minWidth: 1;
    minHeight: 1;
    flexDirection: row;
    alignItems: center;
`;

const MiniSubHeaderView = Styled(View)`
    width: 100%;
    minHeight: 1;
    paddingHorizontal: ${baseMargin};
`;

const SubHeaderView = Styled(MiniSubHeaderView)`
    paddingVertical: 14;
    marginBottom: 8;
`;

const GreySubHeaderView = Styled(SubHeaderView)`
    backgroundColor: #FFFFFF;
`;

const RowView = Styled(View)`
    width: 100%;
    flexDirection: row;
    justifyContent: space-between;
`;

const BankRowView = Styled(View)`
    width: 100%;
    flexDirection: row;
    alignItems: center;
`;

const ColView = Styled(View)`
    width: 40%;
    alignItems: flex-start;
`;

const HeaderAccordionView = Styled(View)`
    width: 100%;
    minHeight: 50;
    justifyContent: space-between;
    alignItems: center;
    flexDirection: row;
    paddingVertical: 12;
    paddingHorizontal: ${baseMargin};
    borderBottomWidth: 0.5;
    borderColor: #DDDDDD;
    backgroundColor: #FFFFFF;
`;

const HeaderAccordionLeft = Styled(View)`
    width: 90%;
    minHeight: 1;
    alignItems: flex-start;
    justifyContent: center;
`;

const HeaderAccordionRight = Styled(View)`
    width: 10%;
    minHeight: 1;
    justifyContent: center;
    alignItems: flex-end;
`;

const AccordionContent = Styled(View)`
    width: 100%;
    minHeight: 1;
    paddingVertical: 12;
    paddingHorizontal: ${baseMargin};
    borderTopWidth: 0.5px;
`;

const InstructionLine = Styled(View)`
    width: 100%;
    minHeight: 1;
    flexDirection: row;
    justifyContent: flex-start;
    alignItems: flex-start;
    marginVertical: 2;
`;

const InstructionNumber = Styled(View)`
    minWidth: 1;
    minHeight: 1;
    marginRight: 4;
`;

const InstructionDefinition = Styled(View)`
    flex: 1;
`;

const NormalText = Styled(Text)`
`;

const LeftNormalText = Styled(NormalText)`
    textAlign: left;
`;

const BiggerNormalText = Styled(Text)`
    fontSize: 24px;
    letterSpacing: 0.36;
`;

const TimerSeparatorText = Styled(BiggerNormalText)`
    marginHorizontal: 10;
`;

const TitleText = Styled(Text)`
    textAlign: left;
    letterSpacing: 0.13;
`;

const PriceText = Styled(Text)`
    textAlign: left;
    color: #FF425E;
`;

const IconArrow = Styled(Ionicons)`
    color: #333333;
`;

function getInstructionBanks(classPayment) {
  for (const bank of Object.keys(PaymentInstructions)) {
    if (classPayment === bank) {
      return PaymentInstructions[bank];
    }
  }
  return PaymentInstructions.GENERAL_INSTRUCTION;
}

export default ({ navigation, route }) => {
  // route
  const { payInfo, payment, booking } = route.params;

  // hooks
  const { Color } = useColor();
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();

  // state
  const [instructionBanks] = useState(
    getInstructionBanks(payment.class)
  );
  const [activeSection, setActiveSection] = useState(
    [0].concat(Array(instructionBanks.length - 1).fill(false))
  );
  const [timeLeft, setTimeLeft] = useState(
    Math.max(Moment(booking.expiresAt).diff(Moment(), 'seconds'), 0)
  );

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    const { productType } = getOptionsProduct(booking);

    if (productType !== 'SAMBATAN' && productType !== 'SAMBATAN_O') {
      countdownId = setInterval(() => countdown(), 1000);
    }
    
    checkStatusPayment('initial');

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      if (countdownId) clearInterval(countdownId);
    }
  }, []);

  function checkStatusPayment(init) {
    graphClient.query({
      query: queryCheckBookingStatus,
      variables: {
        bookingId: booking.id,
      }
    })
    .then(res => {
      // console.log(res, 'res cek status');
      const data = res.data.bookingDetail;

      let label = '';

      if (data && data.bookingStatus && typeof data.bookingStatus.id !== 'undefined') {
        if (data.bookingStatus.id === 4) {
          onDone();
          return;
        }

        if (data.bookingStatus.id === 2) {
          label = 'Menunggu Pembayaran';
        }
      }

      if (!init) showPopup(label, 'info');
    })
  }

  function onDone(res) {
    navigation.navigate('PaymentSucceed');
  }

  const handleBackPress = () => {
    navigation.popToTop();
    return true;
  }

  function copyToClipboard(item) {
    Clipboard.setString(item);
    showPopup('Nomor VA berhasil disalin', 'info');
  }

  function countdown() {
    const newTimeLeft = Moment(booking.expiresAt).diff(Moment(), 'seconds');

    if (newTimeLeft > 0) {
      setTimeLeft(newTimeLeft);
    } else {
      clearInterval(countdownId);
      setTimeLeft(0);
      onDone();
    }
  }

  function onChangeActiveAccordion(index, i) {
    let newActiveSection = activeSection;
    newActiveSection[i] = index;
    setActiveSection(newActiveSection);
  }

  function renderCountdown() {
    const newTimeLeft = Moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false }).split(':');

    return (
      <TimerView>
        <BiggerNormalText color={Color.error} type='bold'>{newTimeLeft[0]}</BiggerNormalText><TimerSeparatorText color={Color.error} type='bold'>:</TimerSeparatorText>
        <BiggerNormalText color={Color.error} type='bold'>{newTimeLeft[1]}</BiggerNormalText><TimerSeparatorText color={Color.error} type='bold'>:</TimerSeparatorText>
        <BiggerNormalText color={Color.error} type='bold'>{newTimeLeft[2]}</BiggerNormalText>
      </TimerView>
    );
  }

  function renderInstructions(bank) {
    return bank.desc.map((instruction, i) =>
      <InstructionLine key={i}>
        <InstructionNumber><LeftNormalText>{i + 1}.</LeftNormalText></InstructionNumber>
        <InstructionDefinition><LeftNormalText>{instruction.text}</LeftNormalText></InstructionDefinition>
      </InstructionLine>
    );
  }

  function renderContentAccordion(bank) {
    return (
      <AccordionContent>
        {renderInstructions(bank)}
      </AccordionContent>
    );
  }

  const renderHeaderAccordion = (method, index, isActive) => (
    <HeaderAccordionView>
      <HeaderAccordionLeft><LeftNormalText type='semibold'>{method.name}</LeftNormalText></HeaderAccordionLeft>
      <HeaderAccordionRight><IconArrow name={isActive ? 'ios-arrow-down' : 'ios-arrow-forward'} /></HeaderAccordionRight>
    </HeaderAccordionView>
  )

  function renderAllInstructionsAccordion() {
    return instructionBanks.map((bank, i) =>
      <Accordion
        key={i}
        touchableProps={{ activeOpacity: 1 }}
        sections={[{ name: bank.title }]}
        renderHeader={renderHeaderAccordion}
        renderContent={() => renderContentAccordion(bank)}
        activeSection={activeSection[i]}
        onChange={(index) => onChangeActiveAccordion(index, i)}
      />
    );
  }
    
  return (
    <MainView>
      <Header title='Metode Pembayaran' />
      <ScrollView>
        <MiniBackgroundView />
        <MainContentView>

          {/* <MainInfoContainer>
            <MainInfoView>
              <NormalText size={12}>Selesaikan pembayaran sebelum</NormalText>
              {renderCountdown()}
            </MainInfoView>
          </MainInfoContainer> */}

          <Container>
            <BankView>
              <RowView>
                <ColView>
                  <Image source={{ uri: payment.logo }} style={{width: 102, height: 42}} resizeMode='contain' />
                </ColView>

                <ColView style={{width: '60%', height: 42, justifyContent: 'space-between'}}>
                  <Text size={12} style={{color: '#666666'}}>{payment.name}</Text>
                  <BankRowView>
                    <Text size={16} letterSpacing={0.10} style={{color: '#666666'}}>{payInfo.transferAccountNumber}</Text>
                    <Ionicons name='copy-outline' size={16} color='#666666' style={{marginLeft: 6}} onPress={() => copyToClipboard(payInfo.transferAccountNumber)} />
                  </BankRowView>
                </ColView>
              </RowView>
            </BankView>
          </Container>

          <GreySubHeaderView>
            <RowView>
              <TitleText size={16} type='semibold'>Total</TitleText>
              <PriceText type='bold'>{FormatMoney.getFormattedMoney(payInfo.paymentAmount)}</PriceText>
            </RowView>
          </GreySubHeaderView>

          <SubHeaderView>
            <TitleText type='semibold'>Cara Pembayaran</TitleText>
          </SubHeaderView>
          {renderAllInstructionsAccordion()}
        </MainContentView>
      </ScrollView>

      <Footer
        footerType='twinButton'
        buttonLabel='Kembali'
        buttonColor={Color.theme}
        onPress={() => navigation.pop()}
        twinButtonLabel='Cek Status Pembayaran'
        onPressTwinButton={() => checkStatusPayment()}
      />

      <Loading {...loadingProps} />

      <Popup {...popupProps} />
    </MainView>
  );
};
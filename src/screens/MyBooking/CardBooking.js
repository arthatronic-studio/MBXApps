import React, { useState, useEffect, useRef } from 'react';
import { Image, View } from 'react-native';
import Styled from 'styled-components';
import Moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import { TouchableOpacity } from '@src/components/Button';
import FormatMoney from '@src/utils/FormatMoney';
import CardDuesItem from '@src/screens/MyBooking/CardDuesItem';

import { getOptionsProduct } from '@src/utils/getOptionsProduct';
import { shadowStyle } from '@src/styles';

import {
  iconApp,
} from '@assets/images';

const CardView = Styled(View)`
    width: 100%;
    borderRadius: 4px;
    marginBottom: 16px;
`;

const MainView = Styled(View)`
    width: 100%;
    paddingVertical: 16px;
`;

const BottomLineView = Styled(View)`
    width: 100%;
    minHeight: 1;
    flexDirection: row;
    justifyContent: space-between;
    paddingHorizontal: 16px;
`;

const LeftBottomView = Styled(View)`
    width: 80%;
    alignItems: flex-start;
`;

const RightBottomView = Styled(View)`
    width: 20%;
    alignItems: flex-end;
`;

const LineView = Styled(View)`
    width: 100%;
    minHeight: 1;
    flexDirection: row;
    justifyContent: space-between;
    alignItems: center;
    paddingHorizontal: 16px;
    paddingVertical: 10;
`;

const HeaderView = Styled(LineView)`
    borderBottomWidth: 0.5;
    borderColor: #DDDDDD;
`;

const SubLineView = Styled(View)`
    minWidth: 1;
    minHeight: 1;
    flexDirection: row;
    justifyContent: flex-start;
    alignItems: center;
`;

const ContentView = Styled(View)`
    width: 100%;
    minHeight: 1;
    flexDirection: row;
    justifyContent: flex-start;
    alignItems: center;
`;

const LeftContentView = Styled(View)`
    minWidth: 1;
    minHeight: 1;
`;

const RightContentView = Styled(View)`
    flex: 1;
    flexDirection: row;
    justifyContent: flex-start;
    alignItems: center;
    flexWrap: wrap;
`;

const ThreeDotsView = Styled(TouchableOpacity)`
    height: 55;
    paddingTop: 15;
    flexDirection: row;
    alignItems: flex-start;
    justifyContent: flex-end;
`;

const OneDot = Styled(View)`
    width: 4;
    height: 4;
    borderRadius: 4;
`;

const MiddleDot = Styled(OneDot)`
    marginHorizontal: 2;
`;

const DateTimeView = Styled(View)`
    minWidth: 1;
    minHeight: 1;
    paddingTop: 3;
`;

const NormalText = Styled(Text)`
    fontSize: 12;
    textAlign: left;
`;

const SmallerText = Styled(Text)`
    fontSize: 10;
    textAlign: left;
`;

const DateTimeText = Styled(Text)`
    fontSize: 11;
    textAlign: left;
    color: #A8A699;
`;

const RedText = Styled(NormalText)`
`;

const PriceText = Styled(NormalText)`
    color: #FF425E;
`;

const BlueText = Styled(NormalText)`
`;

const GreenText = Styled(NormalText)`
`;

const Icons = Styled(Ionicons)`
    fontSize: 24;
    marginHorizontal: 4;
`;

const ImageProperty = Styled(Image)`
    width: 18;
    height: 18;
    marginRight: 10;
`;

const SmallerImageProperty = Styled(ImageProperty)`
    width: 15;
    height: 15;
`;

const flight = iconApp;
const tour = iconApp;
const attraction = iconApp;
const busIcon = iconApp;
const bedIcon = iconApp;

export default (props) => {
  const {
    booking,
    status,
    style,
    openModal,
    onExpired,
  } = props;

  let countRef = useRef();

  const [type, setType] = useState(getOptionsProduct(booking).productType);
  const [timeLeft, setTimeLeft] = useState(Math.max(Moment(booking.expiresAt).diff(Moment(), 'seconds'), 0));

  const { Color } = useColor();
  const navigation = useNavigation();

  useEffect(() => {
    if (booking.bookingStatus.id === 1 || booking.bookingStatus.id === 2) {
      setInterval(() => {
        countdown();
      }, 1000);
    };

    return () => clearInterval(countRef.current);
  }, []);

  const countdown = () => {
    const tl = Moment(booking.expiresAt).diff(Moment(), 'seconds');

    if (timeLeft > 0) {
      setTimeLeft(tl);
    }
    else {
      clearInterval(countRef.current);
      setTimeLeft(0);
      onExpired();
    }
  }

  const splitSentence = (sentence) => {
    return sentence.split(' ').map((word, i) =>
      <NormalText type='bold' key={i}>{word} </NormalText>
    );
  }

  const renderDateTime = () => {
    return (
      <DateTimeView>
        <DateTimeText>
          {Moment.parseZone(booking.createdAt).format('DD-MM-YYYY   HH:mm')}
        </DateTimeText>
      </DateTimeView>
    );
  }

  const renderSubContentFlight = (flights) => {
    return flights.map((flg, i) =>
      <View key={i}>
        <LineView>
          <ContentView>
            <LeftContentView><SmallerImageProperty resizeMode='contain' source={flight} /></LeftContentView>
            <RightContentView>
              {splitSentence(flg.departure.journeys[0].origin.cityName)}
              <NormalText type='bold'>({flg.departure.journeys[0].origin.code})</NormalText>
              <Icons name='ios-arrow-round-forward' />
              {splitSentence(flg.departure.journeys[flg.departure.journeys.length - 1].destination.cityName)}
              <NormalText type='bold'>({flg.departure.journeys[flg.departure.journeys.length - 1].destination.code})</NormalText>
            </RightContentView>
          </ContentView>
        </LineView>
        {flg.return && <LineView>
          <ContentView>
            <LeftContentView><SmallerImageProperty resizeMode='contain' source={flight} /></LeftContentView>
            <RightContentView>
              {splitSentence(flg.return.journeys[0].origin.cityName)}
              <NormalText type='bold'>({flg.return.journeys[0].origin.code})</NormalText>
              <Icons name='ios-arrow-round-forward' />
              {splitSentence(flg.return.journeys[flg.return.journeys.length - 1].destination.cityName)}
              <NormalText type='bold'>({flg.return.journeys[flg.return.journeys.length - 1].destination.code})</NormalText>
            </RightContentView>
          </ContentView>
        </LineView>}
      </View>
    );
  }

  const renderSubContentTour = (tours) => {
    return tours.map((tr, i) =>
      <LineView key={i}>
        <ContentView>
          <LeftContentView><SmallerImageProperty resizeMode='contain' source={tour} /></LeftContentView>
          <RightContentView>{splitSentence(tr.tourSnapshot.name)}</RightContentView>
        </ContentView>
      </LineView>
    );
  }

  const renderSubContentAttraction = (attr) => {
    // return attr.map((tr, i) =>
    return(
      <LineView>
        <ContentView>
          <LeftContentView><SmallerImageProperty resizeMode='contain' source={attraction} /></LeftContentView>
          <RightContentView>{splitSentence(attr.attraction_name)}</RightContentView>
        </ContentView>
      </LineView>
    )
    // );
  }

  const renderSubContentHotel = (hotel) => {
    return(
      <LineView>
        <ContentView>
          <LeftContentView><SmallerImageProperty resizeMode='contain' source={bedIcon} /></LeftContentView>
          <RightContentView>{splitSentence(hotel.hotelName)}</RightContentView>
        </ContentView>
      </LineView>
    )
  }

  const renderSubContentBuses = (buses) => {
    let orderSeats = {
      departure: [],
      return: []
    }

    for (var i = 0; i < buses.seats.length; i++) {
      if (buses.seats[i].type === 'TRIP_AWAY') orderSeats.departure.push(buses.seats[i]);
      else orderSeats.return.push(buses.seats[i]);
    }

    return (
      <View>
        <LineView>
          <ContentView>
            <LeftContentView><SmallerImageProperty resizeMode='contain' source={busIcon} /></LeftContentView>
            <RightContentView style={{flexDirection: 'column', alignItems: 'flex-start'}}>
              <NormalText type='bold'>{orderSeats.departure[0].busesName}</NormalText>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <SmallerText type='medium'>{orderSeats.departure[0].departureName}</SmallerText>
                <Icons style={{fontSize: 12}} name='ios-arrow-round-forward' />
                <SmallerText type='medium'>{orderSeats.departure[0].arrivalName}</SmallerText>
              </View>
            </RightContentView>
          </ContentView>
        </LineView>
        {orderSeats.return.length > 0 && <LineView>
          <ContentView>
            <LeftContentView><SmallerImageProperty resizeMode='contain' source={busIcon} /></LeftContentView>
            <RightContentView style={{flexDirection: 'column', alignItems: 'flex-start'}}>
              <NormalText type='bold'>{orderSeats.return[0].busesName}</NormalText>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <SmallerText type='medium'>{orderSeats.return[0].departureName}</SmallerText>
                <Icons style={{fontSize: 12}} name='ios-arrow-round-forward' />
                <SmallerText type='medium'>{orderSeats.return[0].arrivalName}</SmallerText>
              </View>
            </RightContentView>
          </ContentView>
        </LineView>}
      </View>
    )
  }

  const renderThreeDots = (status) => {
    let n;
    switch (status) {
      case 'ACTIVE':
        n = 1; break;
      case 'PAID':
        n = 2; break;
      default:
        n = 3; break;
    }
    return (
      <ThreeDotsView onPress={() => openModal(n, booking)}>
        <OneDot style={{backgroundColor: Color.border}} />
        <MiddleDot style={{backgroundColor: Color.border}} />
        <OneDot style={{backgroundColor: Color.border}} />
      </ThreeDotsView>
    );
  }

  const renderTour = () => {
    let statusText;
    switch (status) {
      case 1 : statusText = <GreenText type='bold' color={Color.info}>MENUNGGU PEMBAYARAN - {Moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false })}</GreenText>; break;
      case 2 : statusText = <BlueText type='bold' color={Color.success}>PEMBAYARAN TOUR BERHASIL</BlueText>; break;
      default: statusText = <RedText type='bold' color={Color.error}>PESANAN KADALUARSA</RedText>; break;
    }
    return (
      <MainView>
        <HeaderView>
          <SubLineView><NormalText type='bold'>{booking.invoiceNumber}</NormalText></SubLineView>
          <SubLineView><PriceText type='bold'>{FormatMoney.getFormattedMoney(booking.finalAmount)}</PriceText></SubLineView>
        </HeaderView>
        {renderSubContentTour(booking.tours)}
        <BottomLineView>
          <LeftBottomView>
            {statusText}
            {renderDateTime()}
          </LeftBottomView>
          {renderThreeDots()}
        </BottomLineView>
      </MainView>
    );
  }

  const renderFlight = () => {
    let statusText;
    switch (status) {
      case 1 : statusText = <GreenText type='bold' color={Color.info}>MENUNGGU PEMBAYARAN - {Moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false })}</GreenText>; break;
      case 2 : statusText = <BlueText type='bold' color={Color.success}>E-TICKET TELAH TERBIT</BlueText>; break;
      default: statusText = <RedText type='bold' color={Color.error}>PESANAN KADALUARSA</RedText>; break;
    }
    return (
      <MainView>
        <HeaderView>
          <SubLineView><NormalText type='bold'>{booking.invoiceNumber}</NormalText></SubLineView>
          <SubLineView><PriceText type='bold'>{FormatMoney.getFormattedMoney(booking.finalAmount)}</PriceText></SubLineView>
        </HeaderView>
        {renderSubContentFlight(booking.flights)}
        <BottomLineView>
          <LeftBottomView>
            {statusText}
            {renderDateTime()}
          </LeftBottomView>
          {renderThreeDots()}
        </BottomLineView>
      </MainView>
    );
  }

  const renderAttraction = () => {
    let statusText;
    switch (status) {
      case 1 : statusText = <GreenText type='bold' color={Color.info}>MENUNGGU PEMBAYARAN - {Moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false })}</GreenText>; break;
      case 2 : statusText = <BlueText type='bold' color={Color.success}>PEMBAYARAN ATRAKSI BERHASIL</BlueText>; break;
      default: statusText = <RedText type='bold' color={Color.error}>PESANAN KADALUARSA</RedText>; break;
    }
    return (
      <MainView>
        <HeaderView>
          <SubLineView><NormalText type='bold'>{booking.invoiceNumber}</NormalText></SubLineView>
          <SubLineView><PriceText type='bold'>{FormatMoney.getFormattedMoney(booking.finalAmount)}</PriceText></SubLineView>
        </HeaderView>
        {renderSubContentAttraction(booking.attractions)}
        <BottomLineView>
          <LeftBottomView>
            {statusText}
            {renderDateTime()}
          </LeftBottomView>
          {renderThreeDots()}
        </BottomLineView>
      </MainView>
    );
  }

  const renderBuses = () => {
    let statusText;
    switch (status) {
      case 1 : statusText = <GreenText type='bold' color={Color.info}>MENUNGGU PEMBAYARAN - {Moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false })}</GreenText>; break;
      case 2 : statusText = <BlueText type='bold' color={Color.success}>PEMBAYARAN TIKET BUS BERHASIL</BlueText>; break;
      default: statusText = <RedText type='bold' color={Color.error}>PESANAN KADALUARSA</RedText>; break;
    }
    return (
      <MainView>
        <HeaderView>
          <SubLineView><NormalText type='bold'>{booking.invoiceNumber}</NormalText></SubLineView>
          <SubLineView><PriceText type='bold'>{FormatMoney.getFormattedMoney(booking.finalAmount)}</PriceText></SubLineView>
        </HeaderView>
        {renderSubContentBuses(booking.buses)}
        <BottomLineView>
          <LeftBottomView>
            {statusText}
            {renderDateTime()}
          </LeftBottomView>
          {renderThreeDots()}
        </BottomLineView>
      </MainView>
    );
  }

  const renderHotel = () => {
    let statusText;
    switch (status) {
      case 1 : statusText = <GreenText type='bold' color={Color.info}>MENUNGGU PEMBAYARAN - {Moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false })}</GreenText>; break;
      case 2 : statusText = <BlueText type='bold' color={Color.success}>PEMBAYARAN HOTEL BERHASIL</BlueText>; break;
      default: statusText = <RedText type='bold' color={Color.error}>PESANAN KADALUARSA</RedText>; break;
    }
    return (
      <MainView>
        <HeaderView>
          <SubLineView><NormalText type='bold'>{booking.invoiceNumber}</NormalText></SubLineView>
          <SubLineView><PriceText type='bold'>{FormatMoney.getFormattedMoney(booking.finalAmount)}</PriceText></SubLineView>
        </HeaderView>
        {renderSubContentHotel(booking.hotels)}
        <BottomLineView>
          <LeftBottomView>
            {statusText}
            {renderDateTime()}
          </LeftBottomView>
          {renderThreeDots()}
        </BottomLineView>
      </MainView>
    )
  }

  const renderDefault = () => {
    let statusText;

    let bookingStatusId = booking.bookingStatus.id;

    if (bookingStatusId === 1 || bookingStatusId === 2) {
      const expireBooking = booking && Moment(booking.expiresAt).diff(Moment(), 'seconds') <= 0;
      if (expireBooking) {
        bookingStatusId = 5;
      }
    }

    switch (bookingStatusId) {
      case 1 :
      case 2 : statusText = <Text size={10} type='semibold' color={Color.info}>Menunggu Pembayaran - {Moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false })}</Text>; break;
      case 4 : statusText = <Text size={10} type='semibold' color={Color.success}>Berhasil</Text>; break;
      default: statusText = <Text size={10} type='semibold' color={Color.error}>Kadaluarsa</Text>; break;
    }
    
    return (
      <MainView>
        <HeaderView>
          <SubLineView>
            <Ionicons style={{fontSize: 22, marginRight: 10}} name='ios-information-circle' />
            <NormalText type='bold'>{getOptionsProduct(booking).productName}</NormalText>
          </SubLineView>
          <SubLineView>
            <BlueText type='bold' color={Color.success}>{FormatMoney.getFormattedMoney(booking.finalAmount)}</BlueText>
          </SubLineView>
        </HeaderView>
        <BottomLineView>
          <LeftBottomView>
            {statusText}
            {renderDateTime()}
          </LeftBottomView>
          {renderThreeDots()}
        </BottomLineView>
      </MainView>
    );
  }

  const renderPrepaid = (labelType) => {
    let statusText;

    let bookingStatusId = booking.bookingStatus.id;

    if (bookingStatusId === 1 || bookingStatusId === 2) {
      const expireBooking = booking && Moment(booking.expiresAt).diff(Moment(), 'seconds') <= 0;
      if (expireBooking) {
        bookingStatusId = 5;
      }
    }

    switch (bookingStatusId) {
      case 1 :
      case 2 : statusText = <Text size={10} type='semibold' color={Color.info}>Menunggu Pembayaran - {Moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false })}</Text>; break;
      case 4 : statusText = <Text size={10} type='semibold' color={Color.success}>Berhasil</Text>; break;
      default: statusText = <Text size={10} type='semibold' color={Color.error}>Kadaluarsa</Text>; break;
    }

    return (
      <MainView>
        <BottomLineView>
          <LeftBottomView>
            <Text size={15} color={Color.border}>{Moment.parseZone(booking.createdAt).format('ddd, DD MMM YYYY - HH:mm')}</Text>
          </LeftBottomView>
          <RightBottomView>
            <TouchableOpacity style={{flexDirection: 'row', height: 20, width: 20, alignItems: 'center', justifyContent: 'flex-end'}} onPress={() => openModal(null, booking)}>
              <OneDot style={{backgroundColor: Color.border}} />
              <MiddleDot style={{backgroundColor: Color.border}} />
              <OneDot style={{backgroundColor: Color.border}} />
            </TouchableOpacity>
          </RightBottomView>
        </BottomLineView>
        <BottomLineView style={{marginTop: 16}}>
          <LeftBottomView style={{width: '45%'}}>
            <Text size={15} type='semibold'>{labelType}</Text>
          </LeftBottomView>
          <RightBottomView style={{width: '55%'}}>
            <Text size={15} type='bold'>{FormatMoney.getFormattedMoney(booking.finalAmount)}</Text>
          </RightBottomView>
        </BottomLineView>
        <BottomLineView style={{marginTop: 4}}>
          <LeftBottomView style={{width: '45%'}}>
            <Text size={10} color={Color.border} align='left'>{booking.invoiceNumber}</Text>
          </LeftBottomView>
          <RightBottomView style={{width: '55%'}}>
            {statusText}
          </RightBottomView>
        </BottomLineView>
      </MainView>
    );
  }

  const renderPostpaid = (labelType) => {
    let statusText;

    let bookingStatusId = booking.bookingStatus.id;

    if (bookingStatusId === 1 || bookingStatusId === 2) {
      const expireBooking = booking && Moment(booking.expiresAt).diff(Moment(), 'seconds') <= 0;
      if (expireBooking) {
        bookingStatusId = 5;
      }
    }

    switch (bookingStatusId) {
      case 1 :
      case 2 : statusText = <Text size={10} type='semibold' color={Color.info}>Menunggu Pembayaran - {Moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false })}</Text>; break;
      case 4 : statusText = <Text size={10} type='semibold' color={Color.success}>Berhasil</Text>; break;
      default: statusText = <Text size={10} type='semibold' color={Color.error}>Kadaluarsa</Text>; break;
    }

    return (
      <MainView>
        <BottomLineView>
          <LeftBottomView>
            <Text size={15} color={Color.border}>{Moment.parseZone(booking.createdAt).format('ddd, DD MMM YYYY - HH:mm')}</Text>
          </LeftBottomView>
          <RightBottomView>
            <TouchableOpacity style={{flexDirection: 'row', height: 20, width: 20, alignItems: 'center', justifyContent: 'flex-end'}} onPress={() => openModal(null, booking)}>
              <OneDot style={{backgroundColor: Color.border}} />
              <MiddleDot style={{backgroundColor: Color.border}} />
              <OneDot style={{backgroundColor: Color.border}} />
            </TouchableOpacity>
          </RightBottomView>
        </BottomLineView>
        <BottomLineView style={{marginTop: 16}}>
          <LeftBottomView style={{width: '45%'}}>
            <Text size={15} type='semibold'>{labelType}</Text>
          </LeftBottomView>
          <RightBottomView style={{width: '55%'}}>
            <Text size={15} type='bold'>{FormatMoney.getFormattedMoney(booking.finalAmount)}</Text>
          </RightBottomView>
        </BottomLineView>
        <BottomLineView style={{marginTop: 4}}>
          <LeftBottomView style={{width: '40%'}}>
            <Text size={10} color={Color.border} align='left'>{booking.invoiceNumber}</Text>
          </LeftBottomView>
          <RightBottomView style={{width: '60%'}}>
            {statusText}
          </RightBottomView>
        </BottomLineView>
      </MainView>
    );
  }

  const renderTopUp = () => {
    let statusText;

    let bookingStatusId = booking.bookingStatus.id;

    if (bookingStatusId === 1 || bookingStatusId === 2) {
      const expireBooking = booking && Moment(booking.expiresAt).diff(Moment(), 'seconds') <= 0;
      if (expireBooking) {
        bookingStatusId = 5;
      }
    }

    switch (bookingStatusId) {
      case 1 :
      case 2 : statusText = <Text size={10} type='semibold' color={Color.info}>Menunggu Pembayaran - {Moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false })}</Text>; break;
      case 4 : statusText = <Text size={10} type='semibold' color={Color.success}>Berhasil</Text>; break;
      default: statusText = <Text size={10} type='semibold' color={Color.error}>Kadaluarsa</Text>; break;
    }

    return (
      <MainView>
        <BottomLineView>
          <LeftBottomView>
            <Text size={15}>{Moment.parseZone(booking.createdAt).format('ddd, DD MMM YYYY - HH:mm')}</Text>
          </LeftBottomView>
          <RightBottomView>
            <TouchableOpacity style={{flexDirection: 'row', height: 20, width: 20, alignItems: 'center', justifyContent: 'flex-end'}} onPress={() => openModal(null, booking)}>
              <OneDot style={{backgroundColor: Color.text}} />
              <MiddleDot style={{backgroundColor: Color.text}} />
              <OneDot style={{backgroundColor: Color.text}} />
            </TouchableOpacity>
          </RightBottomView>
        </BottomLineView>
        <BottomLineView style={{marginTop: 16}}>
          <LeftBottomView style={{width: '45%'}}>
            <Text size={15} type='semibold'>Topup Saldo</Text>
          </LeftBottomView>
          <RightBottomView style={{width: '55%'}}>
            <Text size={15} type='bold'>{FormatMoney.getFormattedMoney(booking.finalAmount)}</Text>
          </RightBottomView>
        </BottomLineView>
        <BottomLineView style={{marginTop: 4}}>
          <LeftBottomView  style={{width: '45%'}}>
            <Text size={10} align='left'>{booking.invoiceNumber}</Text>
          </LeftBottomView>
          <RightBottomView style={{width: '55%'}}>
            {statusText}
          </RightBottomView>
        </BottomLineView>
      </MainView>
    );
  }

  const renderSambatan = () => {
    return (
      <CardDuesItem
        detail={true}
        booking={booking}
        openModal={(selectedBooking) => openModal(selectedBooking)}
        onExpired={() => onExpired()}
        onPress={() => {
          navigation.navigate(getOptionsProduct(booking).navigateScreen,
          { booking });
        }}
        marginBottom={0}
      />
    )
  }

  const renderSwitch = () => {
    switch (type) {
      // case 'flight': return renderFlight();
      // case 'tour': return renderTour();
      // case 'attraction': return renderAttraction();
      // case 'buses': return renderBuses();
      // case 'hotels': return renderHotel();

      case 'SAMBATAN': return renderSambatan();
      case 'SAMBATAN_O' : return renderSambatan();

      case 'TOPUP': return renderTopUp();

      case 'PULSA_HP': return renderPrepaid('Pulsa');
      case 'PAKET_DATA': return renderPrepaid('Paket Data');
      case 'TOKEN_LISTRIK': return renderPrepaid('Token Listrik');

      case 'PULSAPOSTPAID': return renderPostpaid('Pulsa Pascabayar');
      case 'PLNPOSTPAID': return renderPostpaid('PLN Pascabayar');
      case 'PDAMPOSTPAID': return renderPostpaid('PDAM');
      default: return renderDefault();
    }
  }
    
  return ( 
    <CardView style={{ ...style, ...shadowStyle, shadowColor: Color.text, backgroundColor: Color.textInput }}>
      {renderSwitch()}
    </CardView>
  );
}

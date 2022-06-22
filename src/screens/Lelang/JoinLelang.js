import React, { useRef, useState, useEffect } from 'react';
import {View, useWindowDimensions, Image, FlatList } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';

import ImagesPath from 'src/components/ImagesPath';
import { Divider } from 'src/styled';
import {Scaffold, Text, useColor, Header, Row, Col, TouchableOpacity, usePopup, Alert} from '@src/components';
import ModalBid from 'src/components/Modal/ModalBid';
import { FormatMoney } from 'src/utils';
import moment from 'moment';
import { initSocket } from 'src/api-socket/currentSocket';
const currentSocket = initSocket();

const ButtonView = Styled(View)`
  width: 100%;
  padding: 16px;
  flexDirection: column;
  justifyContent: flex-start;
  alignItems: flex-start;
  borderTopLeftRadius: 16;
  borderTopRightRadius: 16;
`;

const EnterButton = Styled(TouchableOpacity)`
  paddingVertical: 16px;
  borderRadius: 120px;
  justifyContent: center;
  alignItems: center;
`;

const JoinLelang = ({navigation, route}) => {
  const { item } = route.params;

  const [listBidding, setListBidding] = useState([]);
  const [userLastBid, setUserLastBid] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [hoursLeft, setHourssLeft] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [weeksLeft, setWeeksLeft] = useState(0);
  const [monthsLeft, setMonthsLeft] = useState(0);
  const [yearsLeft, setYearsLeft] = useState(0);
  // 
  const [isWillCome, setIsWillCome] = useState(false);
  const [isOnGoing, setIsOnGoing] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  
	const modalBidRef = useRef();
  const { width, height } = useWindowDimensions();
  const {Color} = useColor();
  const user = useSelector(state => state['user.auth'].login.user);
  const [popupProps, showPopup] = usePopup();
  

  useEffect(() => {
    const interval = item ?
      setInterval(() => {
        const now = moment();
        const _isWillCome = moment(item.dateStart).isAfter(now);
        const _isOnGoing = moment(item.dateEnd).isAfter(now);
        const _isPassed = moment(item.dateEnd).isBefore(now);
        console.log('////////////////////////');
        console.log('akan datang', _isWillCome);
        console.log('sedang berlangsung', _isOnGoing);
        console.log('telah lewat', _isPassed);
        console.log('////////////////////////');
        setIsWillCome(_isWillCome);
        setIsOnGoing(!_isWillCome && _isOnGoing);
        setIsPassed(_isPassed);
        const issueDate = _isWillCome ? moment(item.dateStart) : moment(item.dateEnd);
        const tl = issueDate.diff(now, 'seconds');
        const minl = issueDate.diff(now, 'minutes');
        const hl = issueDate.diff(now, 'hours');
        const dl = issueDate.diff(now, 'days');
        const wl = issueDate.diff(now, 'weeks');
        const ml = issueDate.diff(now, 'months');
        const yl = issueDate.diff(now, 'years');
        // TODO: bukain buat semua status
        // if (tl > 0 && item.auctionStatus == 'BELUM SELESAI') {
        setTimeLeft(tl > 0 ? tl : 0);
        setMinutesLeft(minl > 0 ? minl : 0);
        setHourssLeft(hl > 0 ? hl : 0);
        setDaysLeft(dl > 0 ? dl : 0);
        setWeeksLeft(wl > 0 ? wl : 0);
        setMonthsLeft(ml > 0 ? ml : 0);
        setYearsLeft(yl > 0 ? yl : 0);
      }, 1000) : null;

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // auction join
    currentSocket.on('auction-join-success', (res) => {
      console.log('res success', res);
      if (res && Array.isArray(res.list)) {
        setListBidding(res.list);
        setUserLastBid(res.userLastBid);
        setHighestBid(res.highestBid);
      }
    });

    currentSocket.on('auction-join-failed', (res) => {
      console.log('res failed', res);
      setListBidding([]);
    });

    const args = {
      userId: user.userId,
      auctionId: item.id,
    };
    console.log('args', args);
    currentSocket.emit('auction-join', args);
  }, []);

  useEffect(() => {
    // auction bid
    currentSocket.on('auction-bid-success', (res) => {
      console.log('res bid success', res);
      setListBidding([res.bid, ...listBidding]);
      setHighestBid(+res.bid.bid);
      if(res.bid.userId == user.userId){
        setUserLastBid(+res.bid.bid);
      }
      // showPopup('Berhasil', 'success');
    });

    currentSocket.on('auction-bid-failed', (res) => {
      console.log('res bid failed', res);
      showPopup(res, 'error');
    });
  }, [listBidding]);

  const onSubmitAuctionBid = (val) => {
    const bidValue = parseInt(val);

    const args = {
      userId: user.userId,
      auctionId: item.id,
      bidValue,
    };

    console.log('args', args);
    currentSocket.emit('auction-bid', args);
  }

  const renderItem = ({item, index}) => 
  <Row style={{justifyContent: 'center', alignItems: 'center',paddingVertical: 15, paddingHorizontal: 16, backgroundColor: Color.theme,width: '100%', height: 70,borderBottomWidth: 1, borderBottomColor: Color.border}}>
    <View
      style={{width: '5%', aspectRatio: 1, alignItems: 'flex-start', justifyContent: 'center'}}
    >
      <Text>{index + 1}</Text>
    </View>

    <View
      style={{width: '10%', aspectRatio: 1}}
    >
      <Image source={item.user.photoProfile ? { uri: item.user.photoProfile } : ImagesPath.avatar1} style={{backgroundColor: Color.secondary, width: '100%', height: '100%'}}/>
    </View>

    <Col style={{paddingHorizontal: 10,}}>
      <Text align='left' style={{fontSize: 8}}>Nama Penawar</Text>
      <Text align='left' style={{fontSize: 14}}>{item.user.firstName + ' ' + item.user.lastName}</Text>
    </Col>

    <Col>
      <Text style={{fontSize: 8, textAlign: 'right'}}>Jumlah Penawaran</Text>
      <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'right'}}>{FormatMoney.getFormattedMoney(item.bid, '')} Poin</Text>
    </Col>
  </Row>

  // console.log(item.startPrice, "start");
  // console.log(highestBid, "high");

  return (
    <Scaffold
      popupProps={popupProps}
      header={
        <Header
          type="bold"
          centerTitle={false}
          customIcon
          title="Lelang"
        />
      }>
      <View style={{width: '100%', height: 180}}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: '25%',
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{uri: Array.isArray(item.product.imageProducts) ? item.product.imageProducts[0] : ''}}
              style={{width: 80, height: 80, borderRadius: 10}}
            />
          </View>
          <View style={{width: '40%', height: 100, paddingVertical: 10}}>
            <Text align='left' numberOfLines={3} style={{fontSize: 14, fontWeight: 'bold'}}>
              {item.product.name}
            </Text>
            <Text
              align='left'
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: Color.gray,
                paddingVertical: 5,
              }}>
              {item.product.categoryFreeText}
            </Text>
          </View>
          <View
            style={{
              width: '35%',
              paddingVertical: 10,
              paddingHorizontal: 10,
              alignItems: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: '#3C58C1',
                width: 75,
                height: 35,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text size={8} color={Color.textInput}>{isWillCome ? 'Dimulai Dalam' : 'Sisa Waktu'}</Text>
              <Text size={12} style={{color: Color.textInput}}>
                {
                  yearsLeft > 0 ? `${yearsLeft} Tahun lagi` :
                  monthsLeft > 0 ? monthsLeft + ' Bulan lagi' :
                  weeksLeft > 0 ? weeksLeft + ' Minggu lagi' :
                  daysLeft > 0 ? daysLeft + ' Hari lagi' :
                  hoursLeft > 0 ? moment.duration(timeLeft, 'seconds').format('HH:mm:ss', { trim: false }) :
                  minutesLeft > 0 ? moment.duration(timeLeft, 'seconds').format('mm:ss', { trim: false }) :
                  timeLeft > 0 ? moment.duration(timeLeft, 'seconds').format('ss', { trim: false }) :
                  isPassed ? 'Waktu habis' : '-'
                }
              </Text>
            </View>
          </View>
        </View>
        {/* Detail */}
        <View
          style={{
            width: '100%',
            height: 70,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '95%',
              height: '90%',
              borderRadius: 10,
              backgroundColor: Color.semiwhite,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <View style={{width: '30%'}}>
              <Text align='left' style={{color: Color.gray, fontSize: 8}}>Penawaranmu</Text>
              <Divider height={2}/>
              <Text align='left' style={{fontWeight: 'bold', fontSize: 11}}>{FormatMoney.getFormattedMoney(userLastBid, '')} Poin</Text>
            </View>
            <View style={{width: '35%'}}>
              <Text align='left' style={{color: Color.gray, fontSize: 8}}>Penawaran Awal</Text>
              <Divider height={2}/>
              <Text align='left' style={{fontSize: 10}}>
                {FormatMoney.getFormattedMoney(item.startPrice, '')} Poin
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          height: 55,
          backgroundColor: Color.primary,
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: Color.textInput,
            width: '30%',
            height: '100%',
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}>
          Penawar
        </Text>
        <View style={{width: '70%'}}></View>
      </View>

      <FlatList
        data={listBidding}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      {isOnGoing && item.bidNominal.length > 0 && <ButtonView>
        <Text size={12}>
          Pasang Tawaran
        </Text>

        <Divider height={10} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {item.bidNominal.map((val, id) => (
               <>
                {id < 2 &&<EnterButton
                  onPress={() => {
                    Alert(
                      'Tawar',
                      `Pasang penawaran untuk harga ${FormatMoney.getFormattedMoney(highestBid != 0 ? highestBid : item.startPrice + val)} ?`,
                      () => onSubmitAuctionBid(highestBid != 0 ? highestBid : item.startPrice + val)
                    );
                  }}
                  style={{
                    flex: 3,
                    marginRight: 6,
                    backgroundColor: Color.grayLight,
                  }}
                >
                  <Text>
                    + {FormatMoney.getFormattedMoney(val)}
                  </Text>
                </EnterButton>}
              </>
          ))}

          {/* <EnterButton
            onPress={() => {
              Alert(
                'Tawar',
                `Pasang penawaran untuk harga ${FormatMoney.getFormattedMoney(highestBid + 10000)} ?`,
                () => onSubmitAuctionBid(highestBid + 10000)
              );
            }}
            style={{
              flex: 3,
              backgroundColor: Color.grayLight,
            }}
          >
            <Text>
              + {FormatMoney.getFormattedMoney(10000)}
            </Text>
          </EnterButton>

          <Divider width={8} /> */}

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: Color.primary,
              aspectRatio: 1,
              borderRadius: 120,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => {
              modalBidRef.current.open();
            }}
          >
            <Ionicons name="chevron-up-outline" color={Color.textInput} size={20} />
          </TouchableOpacity>
        </View>
      </ButtonView>}

      <ModalBid
        ref={modalBidRef}
        startPrice={item.startPrice}
        userLastBid={userLastBid}
        highestBid={highestBid != 0 ? highestBid : item.startPrice}
        amountData={item.bidNominal}
        onPress={(text) => {
          onSubmitAuctionBid(text);
        }}
      />
    </Scaffold>
  );
};

export default JoinLelang;

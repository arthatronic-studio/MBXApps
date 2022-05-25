import React, { useRef, useState, useEffect } from 'react';
import {View, Text,useWindowDimensions, Image, FlatList } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';

import ImagesPath from 'src/components/ImagesPath';
import { Divider } from 'src/styled';
import {Scaffold, useColor, Header, Row, Col, TouchableOpacity, usePopup} from '@src/components';
import ModalBid from 'src/components/Modal/ModalBid';
import { FormatMoney } from 'src/utils';
import Bid from '../Posting/Auction/Bid';
import {currentSocket} from '@src/screens/MainHome/MainHome';

const ButtonView = Styled(View)`
  width: 100%;
  marginHorizontal: 16;
  paddingVertical: 16;
  flexDirection: column;
  justifyContent: flex-start;
  alignItems: flex-start;
  borderTopLeftRadius: 16;
  borderTopRightRadius: 16;
`;

const EnterButton = Styled(TouchableOpacity)`
  width: 140;
  paddingVertical: 13;
  borderRadius: 120px;
  justifyContent: center;
  alignItems: center;
  height:48;
`;

const JoinLelang = ({navigation, route}) => {
	const modalBidRef = useRef();
  const { width, height } = useWindowDimensions();
	const [ listBidding, setListBidding ] = useState([]);
  const {Color} = useColor();
  const user = useSelector(state => state['user.auth'].login.user);
  const [popupProps, showPopup] = usePopup();

  useEffect(() => {
    // auction join
    currentSocket.on('auction-join-success', (res) => {
      console.log('res success', res);
      if (res && Array.isArray(res.list)) {
        setListBidding(res.list);
      }
    });

    currentSocket.on('auction-join-failed', (res) => {
      console.log('res failed', res);
      setListBidding([]);
    });

    const args = {
      userId: user.userId,
      auctionId: route.params.item.id
    };
    console.log('args', args);
    currentSocket.emit('auction-join', args);
  }, []);

  useEffect(() => {
    // auction bid
    currentSocket.on('auction-bid-success', (res) => {
      console.log('res bid success', res);
      let newArr = [...listBidding];
      newArr.push(res.bid);
      setListBidding(newArr);
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
      auctionId: route.params.item.id,
      bidValue,
    };

    console.log('args', args);
    currentSocket.emit('auction-bid', args);
  }

  console.log(route);

  const renderItem = ({item, index}) => 
  <Row style={{justifyContent: 'center', alignItems: 'center',paddingVertical: 15, paddingHorizontal: 20,backgroundColor: Color.theme,width: '100%', height: 70,borderBottomWidth: 1, borderBottomColor: Color.border}}>
    <Text style={{fontSize: 14,width: '10%'}}>{index + 1}</Text>
    <Image source={item.photoFilename ? { uri: item.photoFilename } : ImagesPath.avatar1} style={{backgroundColor: Color.secondary, width: '10%', height: 35}}/>
    <Col style={{paddingHorizontal: 10,}}>
      <Text style={{fontSize: 8}}>Nama Penawar</Text>
      <Text style={{fontSize: 14}}>{item.user.firstName + ' ' + item.user.lastName}</Text>
    </Col>
    <Col>
      <Text style={{fontSize: 8, textAlign: 'right'}}>Jumlah Penawaran</Text>
      <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'right'}}>{item.bid} Poin</Text>
    </Col>
  </Row>

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
              source={{uri: route.params && Array.isArray(route.params.item.product.imageProducts) ? route.params.item.product.imageProducts[0] : ''}}
              style={{width: 80, height: 80, borderRadius: 10}}
            />
          </View>
          <View style={{width: '40%', height: 100, paddingVertical: 10}}>
            <Text numberOfLines={3} style={{fontSize: 14, fontWeight: 'bold', color: Color.text}}>
              {route.params ? route.params.item.product.name : ""}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: Color.gray,
                paddingVertical: 5,
              }}>
              Hijab
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
              <Text style={{fontSize: 5, color: Color.textInput}}>Sisa waktu</Text>
              <Text style={{fontSize: 11, color: Color.textInput}}>12:05</Text>
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
              <Text style={{color: Color.gray, fontSize: 8}}>Penawaranmu</Text>
              <Divider height={2}/>
              <Text style={{color: Color.text, fontWeight: 'bold', fontSize: 11}}>0 Poin</Text>
            </View>
            <View style={{width: '35%'}}>
              <Text style={{color: Color.gray, fontSize: 8}}>Penawaran Awal</Text>
              <Divider height={2}/>
              <Text style={{color: Color.text, fontSize: 10, fontWeight: 'normal'}}>
                50.000 Poin
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
        data={listBidding.reverse()}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View style={{ backgroundColor: Color.theme }}>
					<ButtonView style={{backgroundColor: Color.theme }}>
						<Text size={11} style={{ color: Color.text }}>
							Pasang Tawaran
						</Text>
						<Divider height={10} />
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignItems: 'center'
							}}
						>
							<EnterButton
								style={{
									backgroundColor: Color.grayLight
								}}
							>
								<Text size={14}>
								{FormatMoney.getFormattedMoney(5000)}
							</Text>
							</EnterButton>
							<EnterButton style={{ backgroundColor: Color.grayLight, marginLeft: 10 }}>
								<Text size={14} letterSpacing={0.02} color={Color.textInput}>
									+{FormatMoney.getFormattedMoney(10000)}
								</Text>
							</EnterButton>
							<TouchableOpacity
								style={{
									width: 43,
									height: 43,
									backgroundColor: Color.primary,
									aspectRatio: 1,
									marginLeft: 20,
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
					</ButtonView>
      </View>

      <ModalBid
        ref={modalBidRef}
        startPrice={route.params.item.startPrice}
        onPress={(text) => {
          onSubmitAuctionBid(text);
        }}
      />
    </Scaffold>
  );
};

export default JoinLelang;

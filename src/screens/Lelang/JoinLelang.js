import React, { useRef, useState } from 'react';
import {View, Text,useWindowDimensions, Image, FlatList,Pressable,} from 'react-native';
import ImagesPath from 'src/components/ImagesPath';
import { Divider } from 'src/styled';
import { shadowStyle } from '@src/styles';
import {Scaffold, useColor, Header, Row, Col, TouchableOpacity} from '@src/components';
import ModalBid from 'src/components/Modal/ModalBid';
import Styled from 'styled-components';
import { FormatMoney } from 'src/utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Bid from '../Posting/Auction/Bid';
import {io} from 'socket.io-client';
import {useSelector, useDispatch} from 'react-redux';

const DATA = [
  {
    id: 1,
    avatar: ImagesPath.avatar1,
    namaPenawar: 'Tantri N.',
    jumlahPenawaran: '150.000'
  },
  {
    id: 2,
    avatar: ImagesPath.avatar2,
    namaPenawar: 'Mina M.',
    jumlahPenawaran: '150.000'
  },
  {
    id: 3,
    avatar: ImagesPath.avatar3,
    namaPenawar: 'Galih F.',
    jumlahPenawaran: '150.000'
  },
  {
    id: 4,
    avatar: ImagesPath.avatar1,
    namaPenawar: 'Tantri N.',
    jumlahPenawaran: '150.000'
  },
  {
    id: 5,
    avatar: ImagesPath.avatar2,
    namaPenawar: 'Mina M.',
    jumlahPenawaran: '150.000'
  },
  {
    id: 6,
    avatar: ImagesPath.avatar3,
    namaPenawar: 'Galih F.',
    jumlahPenawaran: '150.000'
  },
  {
    id: 7,
    avatar: ImagesPath.avatar1,
    namaPenawar: 'Tantri N.',
    jumlahPenawaran: '150.000'
  },
  {
    id: 8,
    avatar: ImagesPath.avatar2,
    namaPenawar: 'Mina M.',
    jumlahPenawaran: '150.000'
  },
  {
    id: 9,
    avatar: ImagesPath.avatar3,
    namaPenawar: 'Galih F.',
    jumlahPenawaran: '150.000'
  },
];

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
	const [ selectedAmount, setSelectedAmount ] = useState();
  const {Color} = useColor();
  const user = useSelector(state => state['user.auth'].login.user);

  // useEffect(() => {
  //   fetchPopup();

  //   currentSocket = io(Config.SOCKET_API_URL, {
  //     extraHeaders: {
  //       // Authorization: "Bearer authorization_token_here"
  //       // 'Control-Allow-Credentials': true
  //     },
  //   });

  //   let auctionParam = {userId, auctionId, bidValue}

  //   currentSocket.emit('auth', {id: user ? user.userId : 0});
  //   currentSocket.on('auth', res => {
  //     console.log('res auth', res);
  //   });

  //   currentSocket.emit('chat_notification');
  //   currentSocket.on('chat_notification', res => {
  //     console.log('res chat_notification', res);
  //     if (res && res.status) {
  //       if (chatNotifCount > 0) {
  //         playNotificationSounds();
  //       }

  //       setChatNotifCount(res.data.count);
  //     }
  //   });

  //   const successCallback = (res) => {
  //     console.log('ini response geo');
  //     const ltu = { userId: user.userId, lat: res.coords.latitude, long: res.coords.longitude };
  //     currentSocket.emit('location-tracker-user', ltu );
  //     currentSocket.on('location-tracker-user', res => {
  //       console.log('res location-tracker-user', res);
  //     });
  //   };

  //   const errorCallback = err => {
  //     console.log('ini err', err);
  //   };

  //   const option = {
  //     enableHighAccuracy: true,
  //     timeout: 5000
  //   };

  //   Geolocation.watchPosition(successCallback, errorCallback, option);
  // }, []);
  const renderItem = ({item}) => 
  <Row style={{justifyContent: 'center', alignItems: 'center',paddingVertical: 15, paddingHorizontal: 20,backgroundColor: Color.theme,width: '100%', height: 70,borderBottomWidth: 1, borderBottomColor: Color.border}}>
    <Text style={{fontSize: 14,width: '10%'}}>{item.id}</Text>
    <Image source={item.avatar} style={{backgroundColor: Color.secondary, width: '10%', height: 35}}/>
    <Col style={{paddingHorizontal: 10,}}>
      <Text style={{fontSize: 8}}>Nama Penawar</Text>
      <Text style={{fontSize: 14}}>{item.namaPenawar}</Text>
    </Col>
    <Col>
      <Text style={{fontSize: 8, textAlign: 'right'}}>Jumlah Penawaran</Text>
      <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'right'}}>{item.jumlahPenawaran} Poin</Text>
    </Col>
  </Row>

  const image = route.params.prodImage[1]
  const name = route.params.prodName
  return (
    <Scaffold
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
              source={{uri: route.params.prodImage[0]}}
              style={{width: 80, height: 80, borderRadius: 10}}
            />
          </View>
          <View style={{width: '40%', height: 100, paddingVertical: 10}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: Color.text}}>
              {name? name : ""}
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
        data={DATA}
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
      <ModalBid ref={modalBidRef} />
    </Scaffold>
  );
};

export default JoinLelang;

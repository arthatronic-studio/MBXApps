import React, {useState, useEffect, useRef} from 'react';
import {View, Image, FlatList,ScrollView,useWindowDimensions, Platform, Linking, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Moment from 'moment';
import { useSelector } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import {useIsFocused, useRoute} from '@react-navigation/native';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert, Row, Col} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {TouchableOpacity, Button} from '@src/components/Button';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import Client from '@src/lib/apollo';
import {queryAddLike} from '@src/lib/query';
import { Container, Divider, Padding } from 'src/styled';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import ImagesPath from 'src/components/ImagesPath';
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { getDetailOrderEvent } from 'src/lib/query/event';
import moment from 'moment';

const MyTicket = ({navigation, route}) => {
    const {item} = route.params
    const {width} = useWindowDimensions();
    const isFocused = useIsFocused();
    const {Color} = useColor();
    const [data, setData] = useState(null);
    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();
    console.log(route)

    useEffect(() => {
        getDetail()
      }, []);
    
    const getDetail = () => {
        showLoading();
        let variables = {
        id: item.id,
        };
        console.log(variables);
        Client.query({query: getDetailOrderEvent, variables})
        .then(res => {
            hideLoading()
            if(res.data.eventTicketOrderDetail){
                setData(res.data.eventTicketOrderDetail)
            }
            console.log(res);

        })
        .catch(reject => {
            hideLoading()
            alert(reject.message)
            console.log(reject.message, 'reject');
        });
    };


  if(!data) return <View />

  return (
    <Scaffold
        style={{backgroundColor: Color.border}}
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          type="bold"
          centerTitle={false}
          title="Tiketku"
          actions={<></>}
        />
      }
    >
        <ScrollView>
        <Divider/>
        <View style={{backgroundColor: Color.theme, paddingHorizontal: 10, paddingVertical: 10,width: '92%', alignSelf:'center', flexDirection:'row',borderRadius: 10, elevation: 2}}>
            <View style={{width: 55, height: 55, backgroundColor: Color.secondary, borderRadius: 5}}>
                <Image source={ImagesPath.produklelang3} style={{width:'100%', height: '100%'}}/>
            </View>
            <View style={{width: '70%', paddingHorizontal: 10}}>
                <Text align={'left'} style={{fontWeight: 'bold'}}>{data.event.name}</Text>
                <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
                    <Text style={{fontSize: 10, color: Color.secondary}}>{data.items.length} Tiket</Text>
                    <View style={{width: 3, height: 3, backgroundColor: Color.secondary, borderRadius: 20, marginHorizontal: 5}}/>
                    <Text style={{fontSize: 10, color: Color.secondary}}>{data.items.length} Pax</Text>
                </View>
            </View>
        </View>
        <Divider/>
        <View style={{backgroundColor: Color.theme, width: '92%', alignSelf: 'center', borderRadius: 15}}>
            <Divider/>
            <View style={{paddingHorizontal: 15, flexDirection: 'row'}}>
                <View style={{width: '85%'}}>
                    <Text align={'left'} style={{fontWeight: 'bold'}}>{data.items[0]['title']}. {data.items[0]['name']}</Text>
                    <Text align={'left'} style={{fontSize: 8, color: Color.secondary,marginTop: 2}}>Tiket Masuk Partisipasi</Text>
                    <Divider/>
                </View>
                <View style={{backgroundColor: Color.theme, width: 40, height: 40, borderRadius: 20}}>
                    <Image source={ImagesPath.tribes} style={{width: '100%', height: '100%'}}/>
                </View>
            </View>
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}>
                <View style={{backgroundColor: Color.border, height: 15, width: '5%', borderTopRightRadius: 20}}/>
                <View style={{borderBottomColor: Color.border, borderStyle: 'dashed',borderBottomWidth: 1,height:'100%', width: '90%'}}/>
                <View style={{backgroundColor: Color.border, height: 15, width: '5%',borderTopLeftRadius: 20}}/>
            </View>
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}>
                <View style={{backgroundColor: Color.border, height: 15, width: '5%', borderBottomRightRadius: 20}}/>
                <View style={{borderColor: Color.theme, width: '90%'}}/>
                <View style={{backgroundColor: Color.border, height: 15, width: '5%',borderBottomLeftRadius: 20}}/>
            </View>
            <Divider/>
            <Row style={{alignItems:'center', justifyContent: 'center'}}>
                <View style={{paddingHorizontal: 10,paddingVertical: 10,borderWidth: 1, borderRadius: 8,marginRight: 5,borderColor: Color.border, width: '45%'}}>
                    <Image source={ImagesPath.PurpleClock}/>
                    <Text align={'left'} style={{fontWeight: 'bold', marginTop: 3}}>{data.event.startTime} - {data.event.endTime}</Text>
                </View>
                <View style={{paddingHorizontal: 10,paddingVertical: 10,borderWidth: 1, borderRadius: 8,marginLeft: 5,borderColor: Color.border, width: '45%'}}>
                    <Image source={ImagesPath.BlueCalendar}/>
                    <Text align={'left'} style={{fontWeight: 'bold', marginTop: 3}}>{moment(data.event.date).format('DD MMMM YYYY')}</Text>
                </View>
            </Row>
            <Divider height={10}/>
            <Row style={{width: '92%', paddingVertical: 10,paddingHorizontal: 10,borderRadius: 5,alignSelf: 'center', borderWidth: 1, borderColor: Color.border}}>
                <Image source={ImagesPath.RedPin}/>
                <View style={{width: '85%', marginLeft: 10}}>
                    <Text align={'left'} numberOfLines={3} style={{fontSize: 10, lineHeight: 15, fontWeight: 'bold'}}>Jl Prof Dr Soepomo SH 27 Ged Anakida Lt 3 Suite 303,Tebet Barat, Jakarta Selatan</Text>
                    <Divider height={10}/>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 10, color: Color.primary, marginRight: 5}}>Detail lokasi</Text>
                        <AntDesign name={'arrowright'} size={10} color={Color.primary}/>
                    </View>
                </View>
            </Row>
            <Divider height={10}/>
            <View style={{width: '92%', alignItems: 'center',padding: 20,borderWidth: 1,borderRadius: 8,height: 350, marginBottom: 20,borderColor: Color.border, alignSelf:'center'}}>
                    <QRCode value={data.items[0]['uniqueCode']} size={width / 6} />
                    <Text style={{fontWeight: 'bold', padding: 15}}>{data.items[0]['uniqueCode']}</Text>
            </View>
            <Divider/>
            <Row style={{alignItems: 'center', }}>
                <MaterialCommunityIcons name={'cash-refund'} color={Color.secondary} size={22}/>
                <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 5}}>{data.ticket.refund ? 'Bisa Refund' : 'Tidak Bisa Refund'}</Text>
                <Divider width={8}/>
                <AntDesign name='calendar' size={18} color={Color.secondary}/>
                <Text style={{fontSize: 10, color: Color.secondary, marginHorizontal: 5}}>{data.ticket.reservation ? 'Perlu Reservasi' : 'Tidak Perlu Reservasi'}</Text>
            </Row>
        </View>
        <Divider height={50}/>
        </ScrollView>
    
    </Scaffold>
  )
}

export default MyTicket
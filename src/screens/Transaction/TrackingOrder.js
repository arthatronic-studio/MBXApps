import React, {useState, useEffect, useRef} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Divider, Line} from 'src/styled';
import {connect, useDispatch, useStore} from 'react-redux';
import {TouchableOpacity} from '@src/components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Styled from 'styled-components';
import Text from '@src/components/Text';
import {Header, Loading, useLoading} from 'src/components';
import {ScrollView} from 'react-native-gesture-handler';
import ImagesPath from 'src/components/ImagesPath';
import {mutationCancel, queryDetailOrder} from 'src/lib/query/ecommerce';
import client from 'src/lib/apollo';
import Moment from 'moment';
import {FormatMoney} from 'src/utils';
import {
  HeaderBig,
  useColor,
  Scaffold,
  Row,
  Col,
  Button,
  Submit,
  ModalListAction,
} from '@src/components';
import ColorPropType from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';
import {Modalize} from 'react-native-modalize';

const Content = Styled(View)`
    margin: 16px
    marginBottom: 0px
    padding: 12px
    borderRadius: 8px
`;

const TrackingOrder = ({route, navigation}) => {
  console.log('dataaa', data);
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [loadingProps, showLoading, hideLoading] = useLoading();

  console.log('dataa', data);
  useEffect(() => {
    // getProduct();
  }, []);

  const getProduct = () => {
    let variables = {
      orderId: route.params.item.id,
    };

    client
      .query({query: queryDetailOrder, variables})
      .then(res => {
        console.log(res);
        if (res.data.ecommerceOrderDetail) {
          setData(res.data.ecommerceOrderDetail);
        }

        // hideLoading();
        // navigation.navigate('TopUpScreen');
      })
      .catch(reject => {
        console.log(reject);
      });
  };

  const onPayment = () => {
    dispatch({
      type: 'BOOKING.ADD_BOOKING',
      data: {...data, vestaBiller: true, finalAmount: data.totalPrice},
    });
    navigation.navigate('PaymentScreen', {back: true});
  };

  const {Color} = useColor();
  return (
    <Scaffold
      header={
        <Header
          customIcon
          title="Status Pemesanan"
          type="bold"
          style={{}}
          centerTitle={false}
        />
      }
      style={{backgroundColor: '#E5E5E5'}}>
      <ScrollView>

        <View
          style={{
            backgroundColor: Color.theme,
            borderRadius: 10,
            paddingTop: 15,
          }}>
            { [{CreatedAt: '20-20-2020',PaketStatus: 'System Tracker - Sabtu, 04 April 2022', Desc: 'Pesanan telah dikirim', Desc2: 'Pesanan Anda dalam proses pengiriman oleh kurir.' }].map((keys, i) => (
                <View key={i} >
                        <View style={styles.listRoad}>
                            <View style={{width:'10%'}}>
                                <View style={styles.timeline}>
                                    <View style={styles.rounded}></View>
                                </View>
                            </View>
                            <View style={{width:'90%',paddingBottom:20}}>
                                <Text align='left' style={{color:'#4D4D4D',fontSize:14,paddingBottom:5}}>{keys.PaketStatus}</Text>
                                <Text align='left' style={{color:'#969696',fontSize:12}}>{keys.Desc}</Text>
                                <Text align='left' style={{color:'#969696',fontSize:12}}>{keys.Desc}</Text>
                            </View>
                    </View>
                </View>
            ))}
        </View>
        <Divider height={25} />
      </ScrollView>
    </Scaffold>
  );
};


const styles = StyleSheet.create({
    border:{
        borderWidth:1,
        padding:10,
        borderColor:'#E3E3E3',
        width:'50%',
        justifyContent:'center',
        alignItems:'center'
    },
    listRoad:{
        flexDirection:'row'
    },
    timeline:{
        height:'100%',
        width:2,
        backgroundColor:'#E3E3E3',
        position:'absolute',
        alignSelf:'center',
    },
    rounded:{
        backgroundColor:'#969696',
        borderRadius:8,
        width:16,
        height:16,
        borderWidth:3,
        borderColor:'#E3E3E3',
        justifyContent:'center',
        alignSelf:'center'
    },
})


export default TrackingOrder;

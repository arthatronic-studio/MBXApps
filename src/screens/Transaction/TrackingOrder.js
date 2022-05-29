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
import {queryGetTracking, queryDetailOrder} from 'src/lib/query/ecommerce';
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
} from '@src/components';
import ColorPropType from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';
import {Modalize} from 'react-native-modalize';
import moment from 'moment';

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
  const [list, setList] = useState([]);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const dataTr = [{CreatedAt: '20-20-2020',PaketStatus: 'System Tracker - Sabtu, 04 April 2022', Desc: 'Pesanan telah dikirim', Desc2: 'Pesanan Anda dalam proses pengiriman oleh kurir.' },{CreatedAt: '20-20-2020',PaketStatus: 'System Tracker - Sabtu, 04 April 2022', Desc: 'Pesanan telah dikirim', Desc2: 'Pesanan Anda dalam proses pengiriman oleh kurir.' },{CreatedAt: '20-20-2020',PaketStatus: 'System Tracker - Sabtu, 04 April 2022', Desc: 'Pesanan telah dikirim', Desc2: 'Pesanan Anda dalam proses pengiriman oleh kurir.' },{CreatedAt: '20-20-2020',PaketStatus: 'System Tracker - Sabtu, 04 April 2022', Desc: 'Pesanan telah dikirim', Desc2: 'Pesanan Anda dalam proses pengiriman oleh kurir.' }]

  console.log('dataa', route);
  useEffect(() => {
    getTrack();
  }, []);

  const getTrack = () => {
    let variables = {
      orderId: route.params.item.id,
    };
    console.log(variables);
    client.query({query: queryGetTracking, variables})
      .then(res => {
        console.log(res);
        if (res.data.shipperGetOrderDetails) {
          setList(res.data.shipperGetOrderDetails.trackings);
          // getCancelOrder()
        }

        // hideLoading();
        // navigation.navigate('TopUpScreen');
      })
      .catch(reject => {
        console.log(reject);
      });
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
            <Row justifyContent='space-between' style={{ paddingHorizontal: 28, paddingBottom: 30 }}>
              {[{imgc: ImagesPath.trcOrder1, label: 'Sedang Dikemas'}, {imgc: ImagesPath.trcOrder2, label: 'Barang Dikirim'}, {imgc: ImagesPath.trcOrder3, label: 'Diterima'}, {imgc: ImagesPath.trcOrder4, label: 'Selesai'}].map((val, id) => (
                <View style={{  width: 48 }}>
                    <View key={id} style={{ height: 48, width: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ECEEF9', borderRadius: 24 }}>
                      <Image source={val.imgc} style={{ height: 24, width: 30 }} resizeMode='contain' />
                    </View>
                    <Text size={10} color='#666666' align='center'>{val.label}</Text>
                </View>
              ))}
            </Row>
            <Text type='bold' size={11} align='left' style={{ paddingLeft: 16, marginBottom: 16 }}>Status Pemesanan</Text>
            {list.length != 0 && list.map((keys, i) => (
                <View key={i} >
                      <View style={styles.listRoad}>
                          <View style={{width:'10%'}}>
                              <View style={[styles.timeline,{  backgroundColor: list.length == (i+1) ? '#fff' : '#CCCCCC'}]}>
                                  <View style={[styles.rounded,{backgroundColor: i == 0 ? '#3C58C1' : '#CCCCCC'}]}></View>
                              </View>
                          </View>
                          <View style={{width:'90%',paddingBottom:20}}>
                              <Text align='left' style={{color: i == 0 ? '#3C58C1' : '#6A7479',fontSize:14,paddingBottom:5}} type={i == 0 ? 'bold' : 'regular'}>System Tracker - {moment(keys.created_date).format('dddd, DD MMMM YYYY')}</Text>
                              <Text align='left' style={{color:'#6A7479',fontSize:10}} type='medium'>{keys.shipper_status.name}</Text>
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
        borderColor:'#3C58C1',
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
        position:'absolute',
        alignSelf:'center',
    },
    rounded:{
        borderRadius:8,
        width:16,
        height:16,
        justifyContent:'center',
        alignSelf:'center'
    },
})


export default TrackingOrder;

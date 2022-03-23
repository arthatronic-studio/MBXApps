import React, { useState, useEffect, useRef } from 'react';
import { View,Image } from 'react-native';


import { TouchableOpacity } from '@src/components/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Text from '@src/components/Text';

import Scaffold from '@src/components/Scaffold';
import { Header, Loading, useLoading } from 'src/components';
import { ScrollView } from 'react-native-gesture-handler';
import ImagesPath from 'src/components/ImagesPath';
import { mutationCancel, queryDetailOrder } from 'src/lib/query/ecommerce';
import client from 'src/lib/apollo';
import moment from 'moment';
import { FormatMoney } from 'src/utils';

const TransactionDetail = ({ route, navigation }) => {
    const [data, setData] = useState({});
    const [loadingProps, showLoading, hideLoading] = useLoading();
    console.log(route)
    useEffect( () => {
        getProduct()
    }, []);

    const cancelButton = () => {
        const { item} = route.params
        showLoading();
        let variables = {
            type: 'CANCEL',
            orderId: item.id
        }
        client.mutate({mutation: mutationCancel, variables})
          .then(res => {
            hideLoading()
            console.log(res)
            if (res.data.ecommerceOrderManage) {
                alert('Success cancel order')
                setTimeout(() => {
                    navigation.popToTop()
                }, 1000);
            }
          })
          .catch(reject => {
            hideLoading()
            alert(reject)
            console.log( reject, 'reject');
          });
      };

    const getProduct = () => {
      let variables = {
        orderId: route.params.item.id,
      }
      console.log(variables)
      client.query({query: queryDetailOrder, variables})
        .then(res => {
          console.log(res)
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

    return (
        <Scaffold
        header={<Header customIcon title="Detail Pesanan" type="bold" style={{paddingTop: 16, marginBottom: 10}}   centerTitle={false}  />}
        style={{  backgroundColor:"#E5E5E5",}}
        >
            <ScrollView>
            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 8, marginTop: 25 ,paddingBottom:25,width:"95%",alignSelf:'center'}}>
                <View style={{ alignItems: 'baseline', marginTop: 25, borderBottomWidth: 1, borderColor: "#E5E5E5" }}>
                    <View style={{ marginLeft:9,paddingBottom:15 }}>
                    <Text style={{ fontWeight:"bold" }}>Detail Transaksi</Text>
                    </View>
                </View>
                <View style={{ marginLeft:9 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Text style={{color: 'gray'}}>Status</Text>
                    <Text style={{color: '#F3771D'}}>{data.status}</Text>

                    
                    
                </View>
                <View style={{ marginLeft:9 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Text style={{color: 'gray'}}>No Recipt</Text>
                    <Text >{data.orderNumber}</Text>

                    
                    
                </View>
                <View style={{ marginLeft:9 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Text style={{color: 'gray'}}>Tanggal Transaksi</Text>
                    <Text size={12}>{moment(data.expiredDate).format('dddd, DD MMMM YYYY HH:mm')} WIB</Text>

                    
                    
                </View>
            </View>


            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 8, marginTop: 25 ,paddingBottom:25,width:"95%",alignSelf:'center'}}>
                <View style={{ alignItems: 'baseline', marginTop: 25, borderBottomWidth: 1, borderColor: "#E5E5E5" }}>
                    <View style={{ marginLeft:9,paddingBottom:15 }}>
                    <Text style={{ fontWeight:"bold" }}>Detail Produk</Text>
                    </View>
                        
                </View>
                    
                <View style={{ marginLeft:9 ,alignItems: 'baseline',marginTop:10,display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Image source={ImagesPath.sabyan} />
                    <View style={{ marginLeft: 18, flexDirection: 'column-reverse' }}>
                        <View style={{paddingRight:150 }}>
                            <Text style={{ color: 'gray', fontSize: 12 }}>Stok Barang : 150pcs </Text>
                        </View>
                        <View>
                            <Text style={{ color: 'black', fontSize: 21,fontWeight:'bold' }}>Pashmina Pink Nissa Sabyan</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginLeft:75 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Text style={{color: 'gray',fontSize:12}}>Jumlah Pembelian</Text>
                    <Text style={{color: 'gray',fontSize:12}}>x1</Text>

                    
                    
                </View>
                <View style={{ marginLeft:75 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Text style={{color: 'gray',fontSize:12}}>Harga Barang</Text>
                    <Text style={{color: 'gray',fontSize:12}}>10.000 poin</Text>

                    
                    
                </View>
                <View style={{ marginLeft:75 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Text style={{color: 'gray',fontSize:12}}>Total Pembelian</Text>
                    <Text style={{color: 'black',fontSize:12,fontWeight:'bold'}}>10.000 poin</Text>

                    
                    
                </View>
            </View>

            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 8, marginTop: 25 ,paddingBottom:25,width:"95%",alignSelf:'center'}}>
                <View style={{ alignItems: 'baseline', marginTop: 25, borderBottomWidth: 1, borderColor: "#E5E5E5" }}>
                    <View style={{ marginLeft:9,paddingBottom:15 }}>
                    <Text style={{ fontWeight:"bold" }}>Info Pengiriman</Text>
                    </View>
                </View>
                <View style={{ marginLeft:9 ,alignItems:'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:70}}>
                    <Text style={{color: 'gray'}}>Nama Pembeli</Text>
                    <Text style={{color: '#F3771D'}}>Hendra Helinsky</Text>

                    
                    
                </View>
                <View style={{ marginLeft:9 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:75}}>
                    <Text style={{color: 'gray'}}>No. Resi Pengiriman <Ionicons name="copy-outline" size={16} color="orange" /></Text>
                    <Text >{data.shipperOrderNumber}</Text>

                    
                    
                </View>
                {data.address && <View style={{ marginLeft:9 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:117}}>
                    <Text style={{color: 'gray'}}>Alamat Pengiriman <Ionicons name="copy-outline" size={16} type="entypo"color="orange" /></Text>
                    <Text >{data.address.address}, {data.suburb && data.address.suburb.name}, {data.city && data.address.city.name}, {data.province && data.address.province.name}</Text>
                </View>}
            </View>


            <View style={{ backgroundColor: "#FFFFFF",marginBottom:10, borderRadius: 8, marginTop: 25 ,paddingBottom:25,width:"95%",alignSelf:'center'}}>
                <View style={{ alignItems: 'baseline', marginTop: 25, borderBottomWidth: 1, borderColor: "#E5E5E5" }}>
                    <View style={{ marginLeft:9,paddingBottom:15 }}>
                    <Text style={{ fontWeight:"bold" }}>Rincian Pembayaran</Text>
                    </View>
                </View>
                <View style={{ marginLeft:9 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Text style={{color: 'gray'}}>Metode Pembayaran</Text>
                    <Text style={{color: '#F3771D'}}>Dompet Virtual</Text>

                    
                    
                </View>
                <View style={{ marginLeft:9 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Text style={{color: 'gray'}}>Total Harga (1 Barang)</Text>
                    <Text >{FormatMoney.getFormattedMoney(data.totalProductPrice)}</Text>

                    
                    
                </View>
                <View style={{ marginLeft:9 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Text style={{color: 'gray'}}>Total Ongkir</Text>
                    <Text >{FormatMoney.getFormattedMoney(data.shippingCost)}</Text>

                    
                    
                </View>
                    <View style={{ marginLeft:9 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Text style={{color: 'gray'}}>Biaya Administrasi</Text>
                    <Text >GRATIS</Text>

                    
                    
                </View>
                    <View style={{ marginLeft:9 ,alignItems: 'baseline',marginTop:10,justifyContent:'space-between',display: 'flex',flexDirection:'row',marginRight:10}}>
                    <Text style={{color: 'black',fontWeight:'bold'}}>Total Bayar</Text>
                    <Text style={{color: 'black',fontWeight:'bold'}} >{FormatMoney.getFormattedMoney(data.totalPrice)}</Text>

                    
                    
                </View>
            </View>
            
            </ScrollView>

            <View style={{width: '100%', height: 70, alignItems: 'center', borderRadius: 10,backgroundColor:'white',paddingTop:10 ,flexDirection:'row', justifyContent:"space-around"}}>
            <TouchableOpacity onPress={() => cancelButton()} style={{borderWidth:1,borderColor:"#F3771D",backgroundColor: "white", width: '45%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
                <Text style={{color: "#F3771D"}}>Batalkan Pesanan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => submit()} style={{backgroundColor: "#F3771D", width: '45%', height: 45, borderRadius: 50, justifyContent: 'center'}}>
                <Text style={{color: "white"}}>Chat Pembeli</Text>
            </TouchableOpacity>
            </View>
      <Loading {...loadingProps} />
        </Scaffold>
    )
  
}


export default TransactionDetail;
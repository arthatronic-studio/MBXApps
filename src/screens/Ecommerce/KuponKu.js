import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView, TextInput  ,Text} from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  // TouchableOpacity,
  useLoading,
  Scaffold,
  Row, Col,
  useColor,
  Header
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import { MainView } from 'src/styled';

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
  marginBottom: 2px;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 60px;
  alignItems: flex-start;
  flexDirection: column;
  borderWidth:1;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  fontSize: 14px;
`;
const KuponKu = ({ navigation, route }) => { 
    const {Color}= useColor()
    return (
        <Scaffold
        header={<Header customIcon title="Kuponku" type="bold" style={{paddingTop: 16, marginBottom: 10}}   centerTitle={false}  />}
        >
            <ScrollView >
                <MainView style={{ marginBottom:150 }}>
                    <View style={{alignSelf:'baseline' ,marginLeft:10,marginTop:5}}>
                        <Text>Redeem Kode Promo</Text> 
                       
                    </View>
                    {/* <View style={{ borderWidth: 1, width: "60%" ,borderRadius:10,margin:20, height:40}}>
                            <TextInput placeholder='dsddsds' style={{}} />
                    </View> */}
                   <View style={{ 
                    flexDirection:"row",
                    justifyContent:"space-between" }}
                    >
                  <View style={{alignItems: 'flex-start', marginHorizontal: 10, marginVertical: 5}}>
                    <View style={{width: '100%'}}>
                    <TextInput placeholder='Masukkan Kode Promo' style={{borderWidth: 1, borderColor: Color.border,
                        width: '100%', borderRadius: 5, paddingHorizontal: 40, paddingTop: 20, height: 47,paddingLeft:10}}
                     
                    />
                    <Text style={{fontSize: 8, color: Color.secondary, position: 'absolute', paddingHorizontal: 10, paddingVertical: 5}}>Kode Promo</Text>
                    </View>
                    </View>
                    <View style={{width: '100%', height: 70, borderRadius: 10,backgroundColor:'white',paddingTop:5,paddingLeft:40}}>
                    <TouchableOpacity onPress={() => onPress()} style={{borderColor:"gray",backgroundColor: "#F3771D", width: '30%', height: 45, borderRadius: 50, alignItems:'center',paddingTop:12}}>
                        <Text style={{color: "white"}}>Gunakan</Text>
                    </TouchableOpacity>
                
                    </View>
                    </View>

                    <View style={{ backgroundColor: "#E5E5E5" }}>
                        <View style={{ flexDirection: 'row',paddingLeft:16,justifyContent:'space-between',}}>
                                <View style={{paddingTop:20.5 }}>
                                <Text>Semua KuponKu</Text>
                                </View>
                                <TouchableOpacity onPress={() => onPress()} style={{borderColor:"gray",backgroundColor: "white", width: 86, height: 34, borderRadius: 50, alignItems:'center',paddingTop:10,marginRight:16,marginTop:10,}}>
                                    <Text style={{ color: Color.Text, fontSize: 10 }}>Terbaru  <AntDesign name="down" size={12} color={Color.text} /></Text>
                                    
                                </TouchableOpacity>
                                
                        </View>
                        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 8, marginTop: 25 ,paddingBottom:25,width:"95%",alignSelf:'center'}}>
                            <View style={{ borderBottomWidth: 1,borderColor: "#E5E5E5", }}>
                                <View style={{ alignItems: 'baseline', marginTop: 10,  flexDirection:'row' ,justifyContent:'space-between'}}>    
                                    <View style={{ marginLeft: 10, backgroundColor: '#2C70F7', marginBottom: 20, width: 110, height: 26, alignItems: 'center', borderRadius: 4, paddingTop: 8 }}>
                                    <Text style={{  fontSize:8 ,color:Color.bid}}>Promo Pengguna Baru</Text>
                                    </View>
                                    <View style={{ marginRight:10 }}>
                                        <Text style={{ fontSize:11,fontWeight:'bold' }}>HELLOWRLD22</Text>            
                                    </View> 
                                </View> 
                                <View style={{ marginLeft:10 ,marginBottom:16}}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Cashback 10% Untuk Pengguna Baru</Text>    
                                    <Text style={{ fontSize:10, color:Color.gray }}>Chocolate cake croissant gingerbread oat cake gingerbread jelly-o candy canes gingerbread. </Text>        
                                </View>
                            </View>
                            <View style={{ alignItems: 'baseline', marginTop: 10,  flexDirection:'row' ,justifyContent:'space-between'}}>    
                                <View style={{ marginLeft: 10,position:'absolute',marginTop:10}}>
                                    <Text style={{  fontSize:8 ,color:Color.gray}}>Promo Pengguna Baru</Text>
                                    <Text style={{ fontSize: 10,color:Color.red }}>3 Hari Tersisa</Text>    
                                </View>
                                <View style={{ marginLeft:250,marginRight:10,width: '100%', borderRadius: 10,backgroundColor:'white',paddingTop:5}}>
                                    <TouchableOpacity onPress={() => onPress()} style={{borderColor:"gray",backgroundColor: "#F3771D", width: 115, height: 39, borderRadius: 50, alignItems:'center',paddingTop:10}}>
                                        <Text style={{color: "white"}}>Lihat Detail</Text>
                                    </TouchableOpacity>          
                                </View> 
                            </View> 
                        
                        </View>
                        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 8, marginTop: 25 ,paddingBottom:25,width:"95%",alignSelf:'center'}}>
                            <View style={{ borderBottomWidth: 1,borderColor: "#E5E5E5", }}>
                                <View style={{ alignItems: 'baseline', marginTop: 10,  flexDirection:'row' ,justifyContent:'space-between'}}>    
                                    <View style={{ marginLeft: 10, backgroundColor: '#2C70F7', marginBottom: 20, width: 110, height: 26, alignItems: 'center', borderRadius: 4, paddingTop: 8 }}>
                                    <Text style={{  fontSize:8 ,color:Color.bid}}>Promo OVO</Text>
                                    </View>
                                    <View style={{ marginRight:10 }}>
                                        <Text style={{ fontSize:11,fontWeight:'bold' }}>HELLOWRLD22</Text>            
                                    </View> 
                                </View> 
                                <View style={{ marginLeft:10 ,marginBottom:16}}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Cashback 10% Untuk OVO</Text>    
                                    <Text style={{ fontSize:10, color:Color.gray }}>Chocolate cake croissant gingerbread oat cake gingerbread jelly-o candy canes gingerbread. </Text>        
                                </View>
                            </View>
                            <View style={{ alignItems: 'baseline', marginTop: 10,  flexDirection:'row' ,justifyContent:'space-between'}}>    
                                <View style={{ marginLeft: 10,position:'absolute',marginTop:10}}>
                                    <Text style={{  fontSize:8 ,color:Color.gray}}>Promo OVO</Text>
                                    <Text style={{ fontSize: 10,color:Color.text }}>6 Hari Tersisa</Text>    
                                </View>
                                <View style={{ marginLeft:250,marginRight:10,width: '100%', borderRadius: 10,backgroundColor:'white',paddingTop:5}}>
                                    <TouchableOpacity onPress={() => onPress()} style={{borderColor:"gray",backgroundColor: "#F3771D", width: 115, height: 39, borderRadius: 50, alignItems:'center',paddingTop:10}}>
                                        <Text style={{color: "white"}}>Lihat Detail</Text>
                                    </TouchableOpacity>          
                                </View> 
                            </View> 
                        
                        </View>


                        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 8, marginTop: 25 ,paddingBottom:25,width:"95%",alignSelf:'center'}}>
                            <View style={{ borderBottomWidth: 1,borderColor: "#E5E5E5", }}>
                                <View style={{ alignItems: 'baseline', marginTop: 10,  flexDirection:'row' ,justifyContent:'space-between'}}>    
                                    <View style={{ marginLeft: 10, backgroundColor: '#2C70F7', marginBottom: 20, width: 110, height: 26, alignItems: 'center', borderRadius: 4, paddingTop: 8 }}>
                                    <Text style={{  fontSize:8 ,color:Color.bid}}>Promo Paylater</Text>
                                    </View>
                                    <View style={{ marginRight:10 }}>
                                        <Text style={{ fontSize:11,fontWeight:'bold' }}>HELLOWRLD22</Text>            
                                    </View> 
                                </View> 
                                <View style={{ marginLeft:10 ,marginBottom:16}}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Cashback 10% Untuk Semua Paylater</Text>    
                                    <Text style={{ fontSize:10, color:Color.gray }}>Chocolate cake croissant gingerbread oat cake gingerbread jelly-o candy canes gingerbread. </Text>        
                                </View>
                            </View>
                            <View style={{ alignItems: 'baseline', marginTop: 10,  flexDirection:'row' ,justifyContent:'space-between'}}>    
                                <View style={{ marginLeft: 10,position:'absolute',marginTop:10}}>
                                    <Text style={{  fontSize:8 ,color:Color.gray}}>Promo Pengguna Baru</Text>
                                    <Text style={{ fontSize: 10,color:Color.red }}>3 Hari Tersisa</Text>    
                                </View>
                                <View style={{ marginLeft:250,marginRight:10,width: '100%', borderRadius: 10,backgroundColor:'white',paddingTop:5}}>
                                    <TouchableOpacity onPress={() => onPress()} style={{borderColor:"gray",backgroundColor: "#F3771D", width: 115, height: 39, borderRadius: 50, alignItems:'center',paddingTop:10}}>
                                        <Text style={{color: "white"}}>Lihat Detail</Text>
                                    </TouchableOpacity>          
                                </View> 
                            </View> 
                        
                        </View>


                        
                       
                   </View>
 
                </MainView>
            </ScrollView>
            
        </Scaffold>
    )

}

export default KuponKu;

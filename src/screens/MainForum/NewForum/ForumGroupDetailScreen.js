import React, {useState, useEffect, useRef} from 'react';
import { View,TextInput,Text,Image,FlatList,Animated } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ModalContentOptionsGroupForum from 'src/components/ModalContentOptionsGroupForum';
import {
  Header,
  Scaffold,
  useColor
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import TabForumNewPost from '../TabForumNewPost';
import TabForumMyPost from '../TabForumMyPost';
import Config from 'react-native-config';
import { Container } from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import { ScrollView } from 'react-native-gesture-handler';
import Moment from 'moment';

const { Navigator, Screen } = createMaterialTopTabNavigator();

const ForumDetailScreen = ({ navigation, route }) => {

  
  const params  = route.params.data;

  console.log('ini route ',params);

  const { Color } = useColor();
  const modalOptionsRef = useRef();



 

  const DATAMODERATOR = [
    
    {
      id: '1',
      title: 'Ahmad bahari',
      sub: '19k Thread',
      loc: true,
      image: 'https://i.postimg.cc/tJnwQXn8/image-payment-banner.png',
      
    },
    {
      id: '2',
      title: 'Haris sihabudin',
      sub: '19k Thread',
      loc: true,
      image: 'https://i.postimg.cc/KzMDm4Q7/uxrmp8fzc50w1nw3iqav.jpg',
      
    },
  ];
  const DATA = [
    
    {
      id: '1',
      title: 'Ahmad bahari',
      sub: '19k Thread',
      loc: true,
      image: 'https://i.postimg.cc/2680mCM2/Bola-kita.png',
      
    },
    {
      id: '2',
      title: 'Haris sihabudin',
      sub: '19k Thread',
      loc: true,
      image: 'https://i.postimg.cc/KzMDm4Q7/uxrmp8fzc50w1nw3iqav.jpg',
      
    },
    {
      id: '3',
      title: 'Enceng Sobarna',
      sub: '19k Thread',
      loc: true,
      image: 'https://i.postimg.cc/NfzFkbQM/icon-app.png',
      
    },
    {
      id: '3',
      title: 'Udin Good',
      sub: '19k Thread',
      loc: true,
      image: 'https://i.postimg.cc/GprCFsTt/image-payment-success.png',
      
    },
    {
      id: '4',
      title: 'Jual Cepat Ciamis',
      sub: '19k Thread',
      loc: true,
      image: 'https://i.postimg.cc/tJnwQXn8/image-payment-banner.png',
      
    },
    {
      id: '5',
      title: 'Pemuda Tersesat',
      sub: '19k Thread',
      loc: true,
       image: 'https://reactjs.org/logo-og.png',
      
    },
    {
      id: '6',
      title: 'Juara  Dagang',
      sub: '19k Thread',
      loc: true,
      image: 'https://reactjs.org/logo-og.png',
      
    },
    {
      id: '7',
      title: 'Komunitas Kerupuk',
      sub: '19k Thread',
      loc: true,
      image: 'https://reactjs.org/logo-og.png',
      
    },
    {
      id: '8',
      title: 'Pemuda Pancasila',
      sub: '19k Thread',
      loc: true,
      image: 'https://reactjs.org/logo-og.png',
      
    },
    {
      id: '9',
      title: 'Pemuda lembur',
      sub: '19k Thread',
      loc: true,
      image: 'https://reactjs.org/logo-og.png',
      
    },
     {
      id: '10',
      title: 'Komunitas Pencinta Padi',
      sub: '19k Thread',
      loc: true,
     image: 'https://reactjs.org/logo-og.png',
          },
    
  ];
   
   const renderItem = ({ item }) => (
    <TouchableOpacity onPress={()=> {
    
                
    }}>
    <View style={{flexDirection:'row',marginVertical:8,padding:10,borderRadius:10,justifyContent:'space-between'}}>
    
      <View style={{flexDirection:'row'}}>
      <Image
        source={{uri: item.image}}
        style={{
          borderRadius: 25,
          width: 50,
          height: 50,
          backgroundColor: Color.border,
          borderColor: Color.primary,
          marginHorizontal:5
        }}
      />
      <View style={{marginTop:10,justifyContent:'flex-start'}}>
        <Text type="bold">{item.title}</Text>
        
      </View>
      </View>
      
      
      <Feather onPress={()=>{
       modalOptionsRef.current.open();
      }} name='more-vertical' size={20}  />

    </View>
    </TouchableOpacity>

  );
  const renderItemModerator = ({ item }) => (
    <TouchableOpacity onPress={()=> {
    
                
    }}>
    <View style={{flexDirection:'row',marginVertical:8,padding:10,borderRadius:10,justifyContent:'space-between'}}>
    
      <View style={{flexDirection:'row'}}>
      <Image
        source={{uri: item.image}}
        style={{
          borderRadius: 25,
          width: 25,
          height: 25,
          backgroundColor: Color.border,
          borderColor: Color.primary,
          marginHorizontal:5
        }}
      />
      <View style={{justifyContent:'flex-start'}}>
        <Text style={{color:Color.text}} >{item.title}</Text>
        
      </View>
      </View>
      
      


    </View>
    </TouchableOpacity>

  );

  return (
    <Scaffold
      header={
        <Header
          title={params.name}
         centerTitle={false}
          
        />
      }
    >

     
      <Container paddingVertical={16}>
      
                    <Container
                  
                  width='100%'
                  height='55%'
                  paddingHorizontal={0}
                >
                  <TouchableOpacity
                  >
                    <Image
                      source={{uri: params.imageCover}}
                      style={{
                        width: '100%',
                        height: '100%',
                       
                      }}
                      // resizeMode='stretch'
                    />
                  </TouchableOpacity>
                </Container>

       </Container>

       <Image
                      source={{uri: params.imageCover}}
                      style={{
                        width: '20%',
                        height: '10%',
                        marginTop:-230,
                        marginLeft:10,
                        borderRadius:50,
                       
                      }}
                      // resizeMode='stretch'
                    />
       
      {/* <Container marginTop={0}>
        <SearchBar
          type='select'
          label='Cari postingan'
          onPress={() => {
            navigation.navigate('ForumSearch');
          }}
        />
      </Container>
       */}
       
      
       <ScrollView style={{marginHorizontal:14}}  showsVerticalScrollIndicator={false}>
         
      <View style={{flexDirection:'row'}}>
      <Text style={{fontSize:15,fontWeight:'bold',marginRight:5}}>{params.name}</Text>

      {
        params.status == 'PRIVASI' ?  <Feather onPress={()=>{
       
        }} name='lock' size={20} color={Color.danger} /> :
        <Text></Text>
      }
    

      </View>
       

       {/* <Text style={{color:Color.gray,fontSize:12}}>19k Thread</Text> */}
       <Text style={{color:Color.gray,fontSize:13,fontWeight:'bold'}}>Moderator</Text>
       <FlatList
        data={DATAMODERATOR}
        renderItem={renderItemModerator}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
      />
       <Text style={{color:Color.gray,fontSize:13,fontWeight:'bold'}}>Desckripsi</Text>


      <Text lineHeight={24} align="left">
            &nbsp;&nbsp;&nbsp;&nbsp;
            {params.description}
          </Text>

          <Text style={{color: Color.gray,fontWeight:"bold",marginVertical:5}}>Topic</Text>

          <Text size={15}>{params.topic}</Text>
          <Text style={{color: Color.gray,fontWeight:"bold",marginVertical:5}}>History Forum</Text>
          <View  style={{flexDirection:'row'}}>
          <Text size={15}>Forum dibuat pada</Text>
          <Text style={{fontWeight:"bold"}}>&nbsp; {Moment(parseInt(params.date)).format('Do MMMM YYYY')}</Text>
          </View>
          {params.status == 'PUBLISH'? 
          <View  style={{flexDirection:'row',justifyContent:'space-between'}}>

            
          <Text size={15}>{params.member.length} Anggota Forum</Text>
          <TouchableOpacity onPress={()=>{
            navigation.navigate('ForumGroupPermintaanScreen')
          }}>
          <Text style={{fontWeight:"bold",color:'#F3771D'}}>({params.memberDataReq.length} Permintaan) </Text>
          </TouchableOpacity>
          </View>
          :
          <Text></Text> }
          {params.status !== 'PUBLISH'?
           <FlatList
           data={params.member}
           renderItem={renderItem}
           keyExtractor={item => item.id}
         /> 
         
         : <Text></Text>
        }
         
         {params.status !== 'PUBLISH'?
          <View style={{width: 200, height: 50, marginLeft:80,  borderRadius: 50, alignItems: 'center', justifyContent: 'center',
           
        }}
      >
        <TouchableOpacity
            onPress={() => {navigation.navigate('ForumGroupAllMemberScreen')}}
            style={{alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'}}
           
          >
                   <Text style={{color:'#F3771D',fontWeight:'bold'}}> Lihat Semua Anggota</Text>
          </TouchableOpacity>
      </View>
         
         : <Text></Text>
        }
         

      </ScrollView>
      {/* { renderPopUpNavigation()} */}
     
      <ModalContentOptionsGroupForum
        ref={modalOptionsRef}
       
       
      />
    </Scaffold>
  );
}

export default ForumDetailScreen;
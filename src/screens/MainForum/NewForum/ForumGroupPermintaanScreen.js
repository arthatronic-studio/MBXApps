import React from 'react';
import { View,TextInput,Text,Image,FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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

const { Navigator, Screen } = createMaterialTopTabNavigator();

const ForumGroupPermintaanScreen = ({ navigation, route }) => {
  const { Color } = useColor();
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
      title: 'Komunitas Pencinta',
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
      
      
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <TouchableOpacity style={{backgroundColor:'#F3771D',borderRadius:30,width:80,height:40,marginHorizontal:5}}>
            <Text style={{textAlign:'center',marginTop:10,color:Color.textInput}}>Terima</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'#F3771D',borderRadius:30,width:80,height:40}}>
            <Text style={{textAlign:'center',marginTop:10,color:Color.textInput,marginHorizontal:5}}>Hapus</Text>
          </TouchableOpacity>
        </View>

    </View>
    </TouchableOpacity>

  );
  return (
    <Scaffold
      header={
        <Header
          title='Permintaan Join'
         centerTitle={false}
          
        />
      }
    >

     
   
       
    
       <ScrollView style={{marginHorizontal:0}}  showsVerticalScrollIndicator={false}>
         <View style={{backgroundColor: Color.theme, width: '100%', height: 70, justifyContent: 'center', alignItems: 'center'}}>
                    <TextInput
                        placeholder='Cari . . .'
                        style={{
                            backgroundColor: Color.border,
                            width: '95%',
                            height: 35,
                            borderRadius: 5,
                            fontSize: 12,
                            paddingHorizontal: 12,
                        }}
                    />
                    <AntDesign name={'search1'} size={12} style={{alignSelf: 'flex-end', right: 20,color: Color.secondary,position: 'absolute'}}/>
                </View>
     
          <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      </ScrollView>
       
    
    </Scaffold>
  );
}

export default ForumGroupPermintaanScreen;
import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView,FlatList,Row,SectionList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import { ModalUnlock } from 'src/components';
import {useLoading, usePopup, useColor} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {Container, Divider} from '@src/styled';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {iconWarning, iconHeart, iconShare, iconBookmarks} from '@assets/images/home';
import { useSelector } from 'react-redux';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { queryproductTopicList } from 'src/lib/query';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';

const ForumTopicScreen = ({navigation, route}) => {
  const {item} = route.params;
  const modalOptionsRef = useRef();
  const modalUnlockRef = useRef();
  const user = useSelector(state => state['user.auth'].login.user);
  const [showSection, setShowSection] = useState(true);
  



  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();
  const [search, setSearch] = useState('');
  const {Color} = useColor();
  const [filterData, setFilterData] = useState([]);
  // useEffect(() => {
    //     const timeout = trigger ? setTimeout(() => {
    //         fetchAddLike();
    //     }, 500) : null;

    //     return () => {
    //         clearTimeout(timeout);
    //     }
    // }, [trigger]);

   
 
  const itemPerPage = 100;

  
  const DATA = [
    
    {
      id: '1',
      title: 'Kumpulan Hokage',
      sub: '19k Thread',
      loc: true,
      image: 'https://i.postimg.cc/2680mCM2/Bola-kita.png',
      
    },
    {
      id: '2',
      title: 'Kumpulan Meme',
      sub: '19k Thread',
      loc: true,
      image: 'https://i.postimg.cc/KzMDm4Q7/uxrmp8fzc50w1nw3iqav.jpg',
      
    },
    {
      id: '3',
      title: 'Assosciasi Sunda euy Posting',
      sub: '19k Thread',
      loc: true,
      image: 'https://i.postimg.cc/NfzFkbQM/icon-app.png',
      
    },
    {
      id: '3',
      title: 'Barudak Lembur',
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
    
  ];  const [itemData, setItemData] = useState({
    data:[],
    loading: true,
    page: 0,
    loadNext: false,
  });

  console.log('itemdata', itemData.data);
  useEffect(() => {
    fetchTopicList();
  }, []);
  const fetchTopicList = () => {
    const variables = {
       page: itemData.page + 1,
      limit: itemPerPage,
    };
    console.log('var', variables);

    Client.query({
      query: queryproductTopicList,
      variables,
    })
      .then(res => {
        console.log(res, 'res2');

        const data = res.data.productTopicList;

        let newArr = [];  

        if (data) {
          newArr = itemData.data.concat(data); // compareData(itemData.data.concat(data));
        }

        console.log(data.length, 'dapet length');

        setItemData({
          ...itemData,
          data: newArr,
          loading: false,
          page: data.length > 0 ? itemData.page + 1 : -1,
          loadNext: false,
        });
      })
      .catch(err => {
        console.log(err, 'error');

        setItemData({
          ...itemData,
          loading: false,
          page: -1,
          loadNext: false,
        });
      });
  };
   
   const renderItem = ({ item }) => (
    <TouchableOpacity onPress={()=> {
    
                
    }}>
    <View style={{flexDirection:'row',backgroundColor:Color.grayLight,marginHorizontal:16,marginVertical:8,padding:10,borderRadius:10,justifyContent:'space-between'}}>
    
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
      <View style={{marginTop:5,justifyContent:'flex-start'}}>
        <Text type="bold">{item.title}</Text>
        <Text style={{textAlign: 'left'}}>{item.sub}</Text>
      </View>
      </View>
      
      
      <Feather onPress={()=>{
        modalUnlockRef.current.open();
      }} name='lock' size={20} color={Color.danger} />

    </View>
    </TouchableOpacity>

  );

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
   
      loadingProps={loadingProps}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
       
     
       {/* <FlatList
        data={search !== '' ? filterData : itemData.data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      /> */}
       <SectionList
      sections={itemData.data}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }) =>  <TouchableOpacity onPress={()=> {
        const varData = {
          id: item.id,
          imageCover:item.imageCover,
          name:item.name,
          description:item.description,
          status:item.status,
          date:item.createdAt
        }
        {item.status =="PUBLISH" ?  navigation.navigate('ForumGroupScreen',{data:varData}) : '' }
       
    
                
      }}>
      <View style={{flexDirection:'row',backgroundColor:Color.grayLight,marginHorizontal:16,marginVertical:8,padding:10,borderRadius:10,justifyContent:'space-between'}}>
      
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
        <View style={{marginTop:5,justifyContent:'flex-start'}}>
          <Text type="bold">{item.name}</Text>
          {/* <Text style={{textAlign: 'left'}}>{item.descriptions}</Text> */}
        </View>
        </View>
        
        {
        item.status !== "PUBLISH" ?
         <Feather onPress={()=>{
          modalUnlockRef.current.open();
        }} name='lock' size={20} color={Color.danger} /> : <Text></Text>
      }
       
  
      </View>
      </TouchableOpacity> }
      renderSectionHeader={({ section: { name,imageIcon } }) => (
        <View style={{flexDirection:'row',marginHorizontal:16}}>
               <Image
          source={{uri: imageIcon}}
          style={{
            borderRadius: 25,
            width: 30,
            height: 30,
            backgroundColor: Color.border,
            borderColor: Color.primary,
            marginHorizontal:5
          }}
        />
          <Text style={{textAlign:'left',fontSize:17,fontWeight:'bold'}}>{name}</Text>
        </View>
      )}
    />
 

        
        <Divider />
      </ScrollView>
      <ModalContentOptions
        ref={modalOptionsRef}
        // isOwner={user && user.userId === item.ownerId}
        item={item}
      />
      <ModalUnlock
          onClose={() => setShowSection(!showSection)}
          ref={modalUnlockRef}
          data={[
            // hide options chat
            {
              id: 0,
              name: 'Minta Bergabung',
              color: Color.text,
              onPress: () => {
                navigation.navigate('ForumGroupScreen')
                showLoading('wait', 'Permintaan kamu sedang di tinjau oleh moderator');
                setShowSection(!showSection);
               
              },
            },
            
          ]}
        />
      
    </Scaffold>
  );
};

export default ForumTopicScreen;
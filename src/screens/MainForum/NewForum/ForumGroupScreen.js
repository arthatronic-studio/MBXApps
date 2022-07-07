import React, {useState, useEffect, useRef} from 'react';
import { View,TextInput,Text,Image,Animated } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  Header,
  Scaffold,
  useColor
} from '@src/components';
import {
  iconPencil,
} from '@assets/images/home';
import { TouchableOpacity } from '@src/components/Button';
import TabForumNewPost from '../TabForumNewPost';
import TabForumMyPost from '../TabForumMyPost';
import Config from 'react-native-config';
import { Container } from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import { queryproductGroupList } from 'src/lib/query';
import Client from '@src/lib/apollo';
const { Navigator, Screen } = createMaterialTopTabNavigator();
import { fetchGroupMemberList } from 'src/api/forum/listmemberGroup';
const ForumGroupScreen = ({ navigation, route }) => {
  const { Color } = useColor();
  const params  = route.params.data;
  const itemPerPage = 100;
  const [memberData,setMemberDataAll]= useState([]);
  const [memberDataReq,setMemberDataReq]= useState([]);

  console.log('params',params);
  const [itemData, setItemData] = useState({
    data:[],
    loading: true,
    page: 0,
    loadNext: false,
  });
  // useEffect(() => {
  //   fetchGroupList();
  // }, []);
  useEffect(() => {

    fetchMemberAll();
    fetchMemberReq();
   
  }, []);
  const fetchMemberAll =  async()=>{
    const variables = {
      groupId: params.id,
     status: 1,
   };

   console.log('dani hidayat,',variables);

    const result = await fetchGroupMemberList(variables);
      console.log(result, 'result');
      if (result.status) {
        setTimeout(() => {
          const data = result.data;
  
              let newArr = [];  
      
              if (data) {
                newArr = itemData.data.concat(data); // compareData(itemData.data.concat(data));
              }

              setMemberDataAll(data);
         
        }, 2500);
      }
  }
  const fetchMemberReq =  async()=>{
    const variables = {
      groupId: params.id,
     status: 0,
   };

   console.log('dani hidayat,',variables);

    const result = await fetchGroupMemberList(variables);
      console.log(result, 'result');
      if (result.status) {
        setTimeout(() => {
          const data = result.data;
  
              let newArr = [];  
      
              if (data) {
                newArr = itemData.data.concat(data); // compareData(itemData.data.concat(data));
              }

              setMemberDataReq(data);
         
        }, 2500);
      }
  }
  const fetchGroupList = () => {
    const variables = {
       
      page: itemData.page + 1,
      limit: itemPerPage,
      id:params.id
    };
    console.log('var', variables);

    Client.query({
      query: queryproductGroupList,
      variables,
    })
      .then(res => {
        console.log(res, 'res2');

        const data = res.data.productGroupList;

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
  const renderPopUpNavigation = () => {
    return (
      <Animated.View
        style={[
          {position: 'absolute', bottom: 20, height: 36, width: '100%', alignSelf: 'flex-end', alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 16},
        ]}
      >
        <View style={{width: 50, height: 50, backgroundColor: '#F3771D', borderRadius: 50, alignItems: 'flex-end', justifyContent: 'center',
            shadowColor: "#00000029",
            shadowOffset: { width: 0, height: 2, },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <TouchableOpacity
              onPress={() => {navigation.navigate('ForumBuatScreen',{})}}
              style={{alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'}}
              activeOpacity={0.75}
            >
                    <Image style={{ height: 25, width: 25 }}
source={iconPencil}
                                    />
            </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }
  return (
    <Scaffold header={<Header title={params.name} centerTitle={false} />}>
      <Container paddingVertical={16}>
        <Container width="100%" height="50%" paddingHorizontal={0}>
          <TouchableOpacity>
            <Image
              source={{uri: 'https://i.postimg.cc/Yq0XG2XF/Rectangle-96.png'}}
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
        source={{
          uri: 'https://i.postimg.cc/mr5FQWfb/unsplash-6-Hqv-Y1-E7-NI.png',
        }}
        style={{
          width: '20%',
          height: '10%',
          marginTop: -230,
          marginLeft: 10,
          borderRadius: 50,
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
      <View style={{marginLeft: 16}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>{params.name}</Text>
        
        </View>

        <Text style={{color: Color.gray, fontSize: 14, marginBottom: 12}}>
          19k Thread
        </Text>
        <Text style={{color: Color.gray, fontSize: 13, fontWeight: 'bold'}}>
          Desckripsi
        </Text>

        <Text>{params.description}</Text>

        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#F3771D', marginRight: 5}}>Selengkapnya</Text>
          <TouchableOpacity
            onPress={() => {
              const varData = {
                id: params.id,
                imageCover: params.imageCover,
                name: params.name,
                description: params.description,
                status: params.status,
                date: params.date,
                member : memberData,
                memberDataReq : memberDataReq,
                topic:params.topic
              };
              navigation.navigate('ForumGroupDetailScreen', {data: varData});
            }}>
            <FontAwesome name="angle-down" color="#F3771D" size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <Navigator
        initialRouteName="TabNewPost"
        tabBarOptions={{
          activeTintColor: Color.text,
          inactiveColor: Color.border,
          labelStyle: {fontSize: 12, fontWeight: 'bold'},
          style: {
            backgroundColor: Color.textInput,
          },
          labelStyle: {textTransform: 'none'},
          indicatorStyle: {backgroundColor: Color.primary},
        }}
        screenOptions={{}}>
        <Screen
          name="TabNewPost"
          component={TabForumNewPost}
          options={{tabBarLabel: 'Thread'}}
        />
        <Screen
          name="TabMyPost"
          component={TabForumMyPost}
          options={{tabBarLabel: 'Postinganku'}}
        />
      </Navigator>
      {renderPopUpNavigation()}
    </Scaffold>
  );
}

export default ForumGroupScreen;
import React from 'react';
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

const { Navigator, Screen } = createMaterialTopTabNavigator();

const ForumGroupScreen = ({ navigation, route }) => {
  const { Color } = useColor();

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
    <Scaffold
      header={
        <Header
          title='Group Forum'
         centerTitle={false}
          
        />
      }
    >


      <Container paddingVertical={16}>
      
                    <Container
                  
                  width='100%'
                  height='50%'
                  paddingHorizontal={0}
                >
                  <TouchableOpacity
                  >
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
                      source={{uri: 'https://i.postimg.cc/mr5FQWfb/unsplash-6-Hqv-Y1-E7-NI.png'}}
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
       <View style={{marginLeft:16}}>
       <Text style={{fontSize:15,fontWeight:'bold'}}>Bahas Serba-Serbi Seri A</Text>
       <Text style={{color:Color.gray,fontSize:12}}>19k</Text>
       <Text style={{color:Color.gray,fontSize:13,fontWeight:'bold'}}>Desckripsi</Text>

       <Text>Bahas Serba - Serbi Seri A adalah forum santai buat kau penggemar liga italia.</Text>

       <View style={{flexDirection:'row'}}>
        <Text style={{color:'#F3771D',marginRight:5}} >Selengkapnya</Text>
        <TouchableOpacity
              onPress={() => {

                navigation.navigate('ForumGroupDetailScreen', {});
              }}
            >
               <FontAwesome
                          name="angle-down"
                          color='#F3771D'
                          size={30}
                        />
            </TouchableOpacity>
       </View>
       

       </View>
      <Navigator
        initialRouteName="TabNewPost"
        tabBarOptions={{
          activeTintColor: Color.text,
          inactiveColor: Color.border,
          labelStyle: { fontSize: 12, fontWeight: 'bold' },
          style: {
            backgroundColor: Color.textInput,
          },
          labelStyle: { textTransform: 'none' },
          indicatorStyle: { backgroundColor: Color.primary },
        }}
        screenOptions={{
          
        }}
      >
        <Screen
          name="TabNewPost"
          component={TabForumNewPost}
          options={{ tabBarLabel: 'Beranda' }}
        />
        <Screen
          name="TabMyPost"
          component={TabForumMyPost}
          options={{ tabBarLabel: 'Postingan Saya' }}
        />
      </Navigator>
     { renderPopUpNavigation()}
      
    </Scaffold>
  );
}

export default ForumGroupScreen;
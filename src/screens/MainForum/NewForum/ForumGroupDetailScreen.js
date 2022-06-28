import React from 'react';
import { View,TextInput,Text,Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
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

const ForumDetailScreen = ({ navigation, route }) => {
  const { Color } = useColor();

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
                  height='55%'
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

      <ScrollView>
      <Text lineHeight={24} align="left">
            &nbsp;&nbsp;&nbsp;&nbsp;
            Bahas Serba - Serbi Seri A adalah forum santai buat kau penggemar liga italia seputar bursa tranfer, hasil pertandingan dan berita terupdate. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et amet laoreet dignissim pretium tortor tortor. Proin urna habitant neque placerat lacus, non ut mauris. In lacus augue et gravida id diam commodo. Integer metus, non donec quam facilisis pharetra bibendum mollis. Non consequat integer sit nec aenean lectus. Tortor et platea aliquet rhoncus egestas. Tristique dictum purus euismod posuere non aliquam vulputate sociis. Id arcu amet commodo et, rhoncus, magna. Sed vestibulum, lacus, scelerisque sapien vel orci pretium. Dis integer feugiat dolor faucibus scelerisque. Vel vitae et condimentum vitae nisl sed eget. Tellus lacus, nec a sed eleifend convallis lectus lorem. Mattis orci gravida in nulla. 
          </Text>

          <Text style={{color: Color.gray,fontWeight:"bold",marginVertical:5}}>Topic</Text>

          <Text size={15}>Sepakbola</Text>
          <Text style={{color: Color.gray,fontWeight:"bold",marginVertical:5}}>History Forum</Text>
          <View  style={{flexDirection:'row'}}>
          <Text size={15}>Forum dibuat pada</Text>
          <Text style={{fontWeight:"bold"}}>&nbsp;16 Juni 2022 </Text>
          </View>
      </ScrollView>
       </View>
    
    </Scaffold>
  );
}

export default ForumDetailScreen;
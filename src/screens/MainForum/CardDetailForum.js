
import React from 'react';
import { View, ImageBackground, Dimensions, Image,TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ImagesPath from '../../components/ImagesPath'
import { Header } from '@src/components';
import {Divider} from 'src/styled';
import {useWindowDimensions} from 'react-native';
import { MainView } from '@src/styled';
import {
    Col,
    Scaffold,
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';
import { TabBar, TabView,SceneMap } from 'react-native-tab-view';
import CardForumPage from './CardForumPage';
const BottomSection = Styled(View)`
  width: 100%;
  padding: 16px;
  flexDirection: row;
  alignItems: center;
  borderTopWidth: 0.5px;
`;
const BoxInput = Styled(View)`
  width: 130%;
  backgroundColor: #FFFFFF;
  padding: 4px 16px 4px 16px;
  borderRadius: 32px;
  borderWidth: 0.5px;
  flexDirection: row;
`;

const TextInputNumber = Styled(TextInput)`
  width: 90%;
  alignContent: flex-start;
  fontFamily: Inter-Regular;
  letterSpacing: 0.23;
  height: 40px;
`;
const CircleSend = Styled(TouchableOpacity)`
  width: 20px;
  height: 20px;
  borderRadius: 20px;
  justifyContent: center;
  alignItems: center;
  
  
  
`;
const FirstRoute = () => (
<CardForumPage/>
  );
const SecondRoute = () => (
<View style={ { backgroundColor: '#673ab7' }}  />
);
const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
const CardDetailForum = (navigation,route) => {
    const { params } = route;
    const { width } = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const { Color } = useColor();
    const [routes] = React.useState([
        {key: 'first', title: 'Posting'},
        {key: 'second', title: 'Forum'},
       
      ]);
    
    const renderTabBar = (props) => (
        <TabBar
          {...props}
          activeColor={Color.primary}
          inactiveColor={Color.text}
          scrollEnabled
          labelStyle={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 14,
            textTransform: 'none',
          }}
          indicatorStyle={{
              backgroundColor: Color.primary,
              marginLeft:45
          }}
          style={{
              backgroundColor: Color.theme,
              paddingLeft:45
          }}
        />
    ); 
    
    return (
        <Scaffold
        header={
        <Header> 
            <BottomSection style={{ borderColor: Color.grayLight }}>
              <BoxInput
                style={{
                  backgroundColor: Color.grayLight,
                  borderColor: Color.border,
                  paddingRight:25
                }}>
                <AntDesign name="search1" size={20} color={Color.text} style={{ paddingTop:10 }} /> 
                <TextInputNumber
                  name="text"
                  placeholder=""
                  placeholderTextColor={Color.placeholder}
                  returnKeyType="done"
                  returnKeyLabel="Done"
                  blurOnSubmit={false}
                  onBlur={() => {}}
                  error={null}
                  onChangeText={text => {}}
                  style={{
                    backgroundColor: Color.grayLight,
                    color: Color.text,
                  }}
                            />
                <View style={{ paddingTop:10 }}>
                    <CircleSend
                    style={{ backgroundColor: Color.gray }}
                    onPress={() => {}}>
                    <AntDesign name="closecircleo" size={20} color={Color.text} style={{ borderRadius:20 }} />
                    </CircleSend>
                </View>
              </BoxInput>
            </BottomSection>
         </Header>   
          }
        onPressLeftButton={() => navigation.pop()}
        >
            <View style={{ paddingTop: 10, alignItems: "baseline", paddingLeft:10 }}>
                <Text style={{ fontSize: 15 }} > Gaming</Text>
                <Text style={{ fontSize: 10 }} > 2,5 Ribu setingan stee wewsdwasdawad dsdwas</Text>


            </View>
     
      
        <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{width}}
            renderTabBar={renderTabBar}
        />
     

        {/* <View
          style={{
            width: '80%',
            paddingLeft: 16,
            justifyContent: 'space-between',
        }}>
          

          <Divider height={12} />

          {props.type === 'Posting' ? (
            <View style={{flexDirection: 'row', width: '100%', height: 45}}>
             
            </View>
          ) : (
            <View style={{flexDirection: 'row', width: '100%', height: 33}}>
              
              {props.type !== 'Forum' && <Divider />}
              {props.type !== 'Forum' && (
                <View>
                                    
                </View>
              )}
            </View>
          )}
        </View> */}
          
    </Scaffold>
    
         
    )
    
}

export default CardDetailForum;
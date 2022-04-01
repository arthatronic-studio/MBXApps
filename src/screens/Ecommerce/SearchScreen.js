import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Dimensions, FlatList, SafeAreaView, TextInput, Image, Pressable } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardHistorySearch from './CardHistorySearch';

import ImagesPath from '../../components/ImagesPath'

const { width } = Dimensions.get('window');

import {
  Text,
  // TouchableOpacity,
  Loading, useLoading,
  HeaderBig,
  Submit,
  Header,
  Scaffold,
  useColor
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const ContentView = Styled(View)`
    width: 100%;
    marginTop: 16px;
    paddingHorizontal: 16px;
`;

const MainMenuView = Styled(View)`
    width: 100%;
    borderRadius: 8px;
    marginTop: 12px;
    padding: 20px 0px;
    flexDirection: row;
    flexWrap: wrap;
`;

const BottomSection = Styled(View)`
flexDirection: row;
paddingRight: 34;
alignItems: center;
borderTopWidth: 0.5px;
`;

const BoxInput = Styled(View)`
  marginHorizontal: 16;
  backgroundColor: #FFFFFF;
  paddingVertical: 8px;
  paddingHorizontal: 12px;
  borderRadius: 8px;
  borderWidth: 0.5px;
  flexDirection: row;
`;


const PerUserIcons = Styled(TouchableOpacity)`
    width: 33.33%;
    aspectRatio: 1.3;
    flexDirection: column;
    paddingHorizontal: 8px;
`;

const UserIcon = Styled(View)`
    height: 100%;
    justifyContent: center;
    alignItems: center;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 40px;
  alignItems: flex-start;
  justifyContent: center;
  flexDirection: column;
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  fontSize: 14px;
`;

const TextInputNumber = Styled(TextInput)`
  width: 90%;
  alignContent: flex-start;
  fontFamily: Inter-Regular;
  letterSpacing: 0.23;
  height: 40px;
`;

const CircleSend = Styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  borderRadius: 20px;
  justifyContent: center;
  alignItems: center;
  
`;

const dataHistorySearch = [
  {
    id: 1,
    name: 'Konektor RJ-45',
  },
  {
    id: 2,
    name: 'Hijab Pashmina',
  },
  {
    id: 3,
    name: 'HP Xiaomi',
  },
  {
    id: 4,
    name: 'CD-DVD',
  }
]

const SearchScreen = ({navigation, route}) => {

    const {Color} = useColor()
    const {search, setSearch} = useState('')

  return (
    <Scaffold
        header={
          <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 16}}>
            <AntDesign
              name={'arrowleft'}
              color={Color.text}
              size={24}
              onPress={() => navigation.pop()}
            />
            <BottomSection style={{borderColor: Color.border}}>
                <BoxInput
                  style={{
                  backgroundColor: Color.textInput,
                  borderColor: Color.border,
                  }}
                >
                  <TextInputNumber
                    name="text"
                    placeholder="Cari Topik apa kali ini  . . ."
                    placeholderTextColor={Color.placeholder}
                    returnKeyType="done"
                    returnKeyLabel="Done"
                    blurOnSubmit={false}
                    onBlur={() => {}}
                    error={null}
                    onChangeText={(text) => {setSearch(text)}}
                    style={{
                        backgroundColor: Color.textInput,
                        color: Color.text,
                    }}
                  />
                  <CircleSend
                    onPress={() => {}}>
                    <Ionicons name="search" size={20} color={Color.placeholder} onPress={() => navigation.navigate('SearchResult')} />
                  </CircleSend>
              </BoxInput>
            </BottomSection>
          </View>  
        }
    >
      <MainView>
        <ScrollView>
          <View style={{marginVertical: 24}}>
            <FlatList
              key={'GENERAL'}
              keyExtractor={(item, index) => item.toString() + index}
              data={dataHistorySearch}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{}}
              renderItem={({ item, index }) => {
                return (
                  <CardHistorySearch 
                    componentType={'GENERAL'}
                    item={item}
                    onPress={() => onPress(item)}
                  />
                )
              }}
            />
          </View>
        </ScrollView>
      </MainView>
    </Scaffold>
  )
}

export default SearchScreen
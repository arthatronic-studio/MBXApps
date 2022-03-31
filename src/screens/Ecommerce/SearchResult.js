import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, Dimensions, FlatList, SafeAreaView, TextInput, Image, Pressable, Keyboard } from 'react-native';
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
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Client from 'src/lib/apollo';
import { queryGetProduct } from 'src/lib/query/ecommerce';
import { queryGetListMerchant } from 'src/lib/query/ecommerce';
import CardMerchant from './CardMerchant';
import CardProductSearch from './CardProductSearch';

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

const { Navigator, Screen } = createMaterialTopTabNavigator();

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

const SearchResult = ({navigation, route}) => {

    const {Color} = useColor()
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("")
    const [dataProduk, setDataProduk] = useState(null);
    const [dataMerchant, setDataMerchant] = useState(null);

    useEffect(() => {
        getMerchant();
        getProduct();
    }, []);

    const getProduct = () => {
        let variables = {
            page: page,
            itemPerPage: 10,
            name: search
        }
        Client.query({query: queryGetProduct, variables})
            .then(res => {
                if (res.data.ecommerceProductList) {
                    setDataProduk(res.data.ecommerceProductList);
                }
            })
            .catch(reject => {
                console.log(reject);
            });
    }

    const getMerchant = () => {
        let variables = {
            page: page,
            limit: 10,
            merchantName: search
        }
        Client.query({query: queryGetListMerchant, variables})
            .then(res => {
                if (res.data.ecommerceGetListMerchant) {
                    setDataMerchant(res.data.ecommerceGetListMerchant);
                }
                console.log(res)
            })
            .catch(reject => {
                console.log(reject);
            });
    }

    const FilterProduk = [
        {
            id: 1,
            name: 'Terlaris'
        },
        {
            id: 2,
            name: 'Gratis Ongkir'
        },
        {
            id: 3,
            name: 'Terpopuler'
        }
    ]
    
    const FilterToko = [
        {
            id: 1,
            name: 'Nama Toko'
        },
        {
            id: 2,
            name: 'Popularitas'
        },
    ]
    
    const DataToko = [
        {
            id: 1,
            name: 'Bytme Shop',
            location: 'Jakarta Selatan',
            image: ImagesPath.merchant1,
        },
        {
            id: 2,
            name: 'Observe Shop',
            location: 'Jakarta Selatan',
            image: ImagesPath.merchant2,
        },
        {
            id: 3,
            name: 'Hammerhead Shop',
            location: 'Jakarta Selatan',
            image: ImagesPath.merchant3,
        },
        {
            id: 4,
            name: 'Suslli Shop',
            location: 'Jakarta Selatan',
            image: ImagesPath.merchant4,
        },
        {
            id: 5,
            name: 'Hammerhead Shop',
            location: 'Jakarta Selatan',
            image: ImagesPath.merchant5,
        },
    ]
    
      const renderFilter = ({item}) => (
        <Pressable 
            style={{
                width: 100, 
                paddingVertical: 8, 
                paddingHorizontal: 12, 
                marginRight: 10,
                borderRadius: 120,
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: '#A1A1A1'
            }}
        >
            <Text align='left' size={10} color='#ffffff'>{item.name}</Text>
        </Pressable>
      )
    
    const handleLoadMore = ()  => {
        setPage(page+1);
        getProduct()
    }

      const TabProduk = () => {
        return (
            <>  
                <View style={{padding: 16, flexDirection: 'row', alignItems: 'center'}}>
                    <Pressable 
                        style={{
                            width: 80,
                            borderWidth: 0.8,
                            paddingVertical: 8, 
                            paddingHorizontal: 12, 
                            marginRight: 10,
                            borderRadius: 120,
                            flexDirection: 'row',
                            justifyContent: 'center', 
                            alignItems: 'center',
                        }}
                    >
                        <AntDesign
                            name={'filter'}
                            size={16}
                        />
                        <Text align='left' style={{marginLeft: 8}} size={10}>Filter</Text>
                    </Pressable>
                    <FlatList 
                        data={FilterProduk}
                        renderItem={renderFilter}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <FlatList
                    data={dataProduk}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                          <CardProductSearch
                            item={item}
                          />
                        )
                      }}
                    onEndReached={() => handleLoadMore()}
                />
            </>
        )
      }
    
      const TabToko = () => {
          return (
              <>
                <View style={{padding: 16, flexDirection: 'row', alignItems: 'center'}}>
                    <Pressable 
                        style={{
                            width: 80,
                            borderWidth: 0.8,
                            paddingVertical: 8, 
                            paddingHorizontal: 12, 
                            marginRight: 10,
                            borderRadius: 120,
                            flexDirection: 'row',
                            justifyContent: 'center', 
                            alignItems: 'center',
                        }}
                    >
                        <AntDesign
                            name={'filter'}
                            size={16}
                        />
                        <Text align='left' style={{marginLeft: 8}} size={10}>Filter</Text>
                    </Pressable>
                    <FlatList 
                        data={FilterToko}
                        renderItem={renderFilter}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <FlatList
                  key={'GENERAL'}
                  keyExtractor={(item, index) => item.toString() + index}
                  data={dataMerchant}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{}}
                  renderItem={({ item, index }) => {
                    return (
                      <CardMerchant
                        componentType={'GENERAL'}
                        item={item}
                        onPress={() => onPress(item)}
                      />
                    )
                  }}
                />
              </>
          )
      }

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
                    backgroundColor: '#FFFFFF',
                    borderColor: Color.border,
                    }}
                    >
                    <TextInputNumber
                        name="text"
                        placeholder="Cari Topik apa kali ini  . . ."
                        placeholderTextColor={Color.placeholder}
                        blurOnSubmit={false}
                        onBlur={() => {}}
                        error={null}
                        onChangeText={text => {setSearch(text)}}
                        style={{
                            backgroundColor: '#FFFFFF',
                            color: Color.text,
                        }}
                        onKeyPress={(e) => {
                            if(e.key=="Enter") {
                                getProduct()
                                getMerchant()
                                Keyboard.dismiss()
                            }
                        }}
                    />
                    <CircleSend
                        onPress={() => {
                            getProduct() 
                            getMerchant()
                            Keyboard.dismiss()
                        }}
                    >
                        <Ionicons name="search" size={20} color={Color.placeholder} />
                    </CircleSend>
                </BoxInput>
                </BottomSection>
            </View>  
            }
        >
            <MainView style={{marginTop: 16}}>
                <Navigator
                    initialRouteName="TabProduk"
                    tabBarOptions={{
                        activeTintColor: Color.text,
                        inactiveColor: Color.border,
                        labelStyle: { fontSize: 14, fontWeight: 'bold' },
                        style: {
                            backgroundColor: '#FFFFFF',
                        },
                        labelStyle: { textTransform: 'none' },
                        indicatorStyle: { backgroundColor: Color.primary,}
                    }}
                >
                    <Screen
                    name="TabProduk"
                    component={() => TabProduk()}
                    options={{ tabBarLabel: 'Produk' }}
                    />
                    <Screen
                    name="TabToko"
                    component={() => TabToko()}
                    options={{ tabBarLabel: 'Toko' }}
                    />
                </Navigator>
            </MainView>    
        </Scaffold>
    )
}

export default SearchResult
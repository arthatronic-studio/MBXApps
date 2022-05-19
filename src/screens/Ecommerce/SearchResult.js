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
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Client from 'src/lib/apollo';
import { queryGetProduct } from 'src/lib/query/ecommerce';
import { queryGetListMerchant } from 'src/lib/query/ecommerce';
import CardMerchant from './CardMerchant';
import {
  Text,
  Scaffold,
  useColor
} from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import CardEcomerceProduct from './CardEcomerceProduct';
import { initialItemState } from 'src/utils/constants';

const { Navigator, Screen } = createMaterialTopTabNavigator();

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
];

const FilterToko = [
    {
        id: 1,
        name: 'Nama Toko'
    },
    {
        id: 2,
        name: 'Popularitas'
    },
];

const itemPerPage = 6;

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

const TabProduk = ({ search }) => {
    const {Color} = useColor();

    const [dataProduk, setDataProduk] = useState(initialItemState);
    const [searchProduk, setSearchProduk] = useState(initialItemState);

    useEffect(() => {
        fetchProduct();
    }, []);

    useEffect(() => {
        if (dataProduk.loadNext && dataProduk.page !== -1) {
            fetchProduct();
        }
    }, [dataProduk.loadNext]);

    useEffect(() => {
        if (searchProduk.loadNext && searchProduk.page !== -1) {
            fetchSearchProduct();
        }
    }, [searchProduk.loadNext]);

    useEffect(() => {
        const timeout = search !== '' ?
            setTimeout(() => {
                setSearchProduk({ ...searchProduk, refresh: true });
            }, 1000) : null;

        return () => {
            clearTimeout(timeout);
        }
    }, [search]);

    useEffect(() => {
        if (searchProduk.refresh) {
            fetchSearchProduct();
        }
    }, [searchProduk.refresh]);

    const fetchProduct = () => {
        let variables = {
            page: dataProduk.page + 1,
            itemPerPage,
            name: search
        }
        console.log(variables);
        Client.query({query: queryGetProduct, variables})
        .then(res => {
            console.log(res);

            const data = res.data.ecommerceProductList;
            let newData = [];
            if (Array.isArray(data)) {
                newData = data;
            }
            setDataProduk({
                ...dataProduk,
                data: dataProduk.data.concat(newData),
                page: newData.length === itemPerPage ? dataProduk.page + 1 : -1,
                loading: false,
                loadNext: false,
                refresh: false,
            });
        })
        .catch(reject => {
            console.log(reject);

            setDataProduk({
                ...dataProduk,
                loading: false,
                loadNext: false,
                refresh: false,
            });
        });
    }

    const fetchSearchProduct = () => {
        let variables = {
            page: searchProduk.page + 1,
            itemPerPage,
            name: search
        }

        console.log(variables);

        Client.query({query: queryGetProduct, variables})
        .then(res => {
            console.log(res);

            const data = res.data.ecommerceProductList;
            let newData = [];
            if (Array.isArray(data)) {
                newData = data;
            }

            setSearchProduk({
                ...searchProduk,
                data: searchProduk.refresh ? newData : searchProduk.data.concat(newData),
                page: newData.length === itemPerPage ? searchProduk.page + 1 : -1,
                loading: false,
                loadNext: false,
                refresh: false,
            });
        })
        .catch(reject => {
            console.log(reject);

            setSearchProduk({
                ...searchProduk,
                loading: false,
                loadNext: false,
                refresh: false,
            });
        });
    }

    return (
        <>
            {/* hide filter product */}
            {/* <View style={{padding: 16, flexDirection: 'row', alignItems: 'center'}}>
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
            </View> */}
            <FlatList
                data={search !== '' ? searchProduk.data : dataProduk.data}
                keyExtractor={(item, index) => item.id + index.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 16,
                    paddingHorizontal: 8,
                }}
                renderItem={({ item, index }) => {
                    return (
                        <CardEcomerceProduct
                            item={item}
                            index={index}
                        />
                    )
                }}
                onEndReachedThreshold={0.3}
                onEndReached={() =>
                    search !== '' ?
                    setSearchProduk({ ...searchProduk, loadNext: true }) :
                    setDataProduk({ ...dataProduk, loadNext: true })
                }
            />
        </>
    )
}

const TabToko = ({ search }) => {
    const {Color} = useColor();

    const [dataMerchant, setDataMerchant] = useState(null);

    useEffect(() => {
        getMerchant();
    }, []);

    useEffect(() => {
        const timeout = search !== '' ?
            setTimeout(() => {
                getMerchant()
            }, 1000) : null;

        return () => {
            clearTimeout(timeout);
        }
    }, [search]);

    const getMerchant = () => {
        let variables = {
            page: 1,
            limit: 50,
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

    return (
          <>
            {/* hide filter merchant */}
            {/* <View style={{padding: 16, flexDirection: 'row', alignItems: 'center'}}>
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
            </View> */}
            <FlatList
              key={'GENERAL'}
              keyExtractor={(item, index) => item.toString() + index}
              data={dataMerchant}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                  paddingTop: 16,
              }}
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

const SearchResult = ({navigation, route}) => {
    const {Color} = useColor();
    const [search, setSearch] = useState("");
    
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
                        placeholder="Cari Topik apa kali ini..."
                        placeholderTextColor={Color.placeholder}
                        blurOnSubmit={false}
                        returnKeyType='search'
                        error={null}
                        value={search}
                        onChangeText={text => {setSearch(text)}}
                        style={{
                            backgroundColor: '#FFFFFF',
                            color: Color.text,
                        }}
                        onSubmitEditing={() => {
                            // Keyboard.dismiss();
                        }}
                        onBlur={() => { }}
                    />
                    <CircleSend
                        onPress={() => {
                            // Keyboard.dismiss();
                        }}
                    >
                        <Ionicons name="search" size={20} color={Color.placeholder} />
                    </CircleSend>
                </BoxInput>
                </BottomSection>
            </View>  
            }
        >
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
                    children={() => <TabProduk search={search} />}
                    options={{ tabBarLabel: 'Produk' }}
                />
                <Screen
                    name="TabToko"
                    children={() => <TabToko search={search} />}
                    options={{ tabBarLabel: 'Toko' }}
                />
            </Navigator>
        </Scaffold>
    )
}

export default SearchResult
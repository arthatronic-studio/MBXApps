import React, { useState, useEffect, useRef, Component } from 'react';
import { View, AppRegistry, FlatList, Platform, Image, SafeAreaView, TextInput, TouchableOpacity, Pressable } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNSimpleCrypto from "react-native-simple-crypto";
import Octicons from 'react-native-vector-icons/Octicons'
import Feather from 'react-native-vector-icons/Feather'
import Swiper from 'react-native-swiper'
import {useIsFocused, useRoute} from '@react-navigation/native';

import {
	Text,
	// TouchableOpacity,
	Loading,
	useLoading,
	Scaffold,
	Row,
	Col,
	HeaderBig,
	useColor,
	Header
} from '@src/components';
import ListForum from '@src/screens/MainForum/ListForum';

import { shadowStyle } from '@src/styles';

import {
    queryAddCart, 
    queryDetailProduct, 
    queryGetCart, 
    queryUpdateItemCart, 
    queryWishlistManage, 
    queryListWishlist
} from 'src/lib/query/ecommerce';
import Client from 'src/lib/apollo';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import moment from 'moment';
import { FormatMoney } from 'src/utils';
import { Container, Divider } from 'src/styled';


const Wishlist = ({navigation}) => {
    const user = useSelector((state) => state['user.auth'].login.user);

	const [ loadingProps, showLoading, hideLoading ] = useLoading();
    const [dataWishlist, setDataWishlist] = useState([]);
    const [cart, setCart] = useState(0);
    const isFocused = useIsFocused();
	const { Color } = useColor();

    useEffect(() => {
        getWishlist();
    }, [isFocused])
    
    const getWishlist = () => {
        showLoading()

        let variables = {
            page: 0,
            itemPerPage: 25,
            name: ""
        };

        Client.query({
            query: queryListWishlist,
            variables,
        }).then(res => {
            const data = res.data.ecommerceProductWishlist;
            console.log(data);

            if (Array.isArray(data)) {
                setDataWishlist(data);
            }
            hideLoading();
        }).catch(reject => {
            hideLoading()
            console.log("error")
            console.log(reject)
        })
    }

    const removeFromWishList = (item) => {
        // showLoading()
    
        let variables = {
          productId: item.id
        };

        console.log(`data variables ${variables}`)
    
        Client.mutate({mutation: queryWishlistManage, variables})
          .then(res => {
            showLoading('success', 'Success remove item from wishlist')        
            console.log(`data wishlisttt ${res}`)
            getWishlist()
          }).catch(reject => {
            // showLoading('error', 'Failed remove item from wishlist')
            console.log(reject)
          })
    }

    const getCart = () => {
		// showLoading();
		let variables = {
			page: 1,
			limit: 10
		};
		console.log(variables);
		Client.query({ query: queryGetCart, variables })
			.then((res) => {
				console.log(res);
				if (res.data.ecommerceCartList) {
					setCart(res.data.ecommerceCartList.totalProducts ? res.data.ecommerceCartList.totalProducts : 0);
				}
			})
			.catch((reject) => {
				// hideLoading()
				console.log(reject.message, 'reject');
			});
	};

    const addToCart = (item) => {
        showLoading();
        let variables = {
          productId: item.id,
          quantity: 1,
          checked: false,
          updateType: "ADD"
        };
        console.log(variables);
        Client.mutate({mutation: queryUpdateItemCart, variables})
          .then(res => {
            hideLoading();
            console.log(res);
            getCart()
            if (res.data.ecommerceCartUpdate) {
                showLoading('success', 'Success add item to cart')        
            //   alert('Success add to cart');
              // navigation.navigate('CartScreen')
            }
          })
          .catch(reject => {
            hideLoading();
            alert(reject.message);
            console.log(reject.message, 'reject');
          });
    };

    const renderItem = ({ item }) => (
        <View style={{ width: '100%', paddingHorizontal: 16, marginBottom: 16 }}>
            <View style={{borderRadius: 5, width: '100%', padding: 8, backgroundColor: Color.textInput, ...shadowStyle }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('DetailProduct', { item } )}
                    style={{ flexDirection: 'row' }}
                >
                    <View style={{ width: '20%', aspectRatio: 1 }}>
                        <Image source={{uri: item.imageUrl}} style={{width: '100%', height: '100%', borderRadius: 4}} />
                    </View>
                    <View style={{ width: '80%', paddingHorizontal: 8 }}>
                        <Text align='left' type='bold' numberOfLines={2}>{item.name}</Text>
                        <Container paddingVertical={8}>
                            <Text style={{textAlign: 'left', fontWeight: 'bold'}}>{FormatMoney.getFormattedMoney(item.price)}</Text>
                        </Container>
                        {/* <View style={{flexDirection: 'row', marginVertical: 3}}>
                            <Entypo name={'star'} style={{color: Color.yellow,}}/>
                            <Text style={{fontSize: 10, marginHorizontal: 5}}>{item.rating || 0}</Text> 
                            <View style={{marginHorizontal: 5, marginVertical: 2,backgroundColor: Color.secondary, height: 10, width: 1}}></View>
                            <Text style={{marginHorizontal: 5, fontSize: 10}}>{item.sold || 0}</Text>
                            <Text style={{ fontSize: 10}}>Terjual</Text>
                        </View> */}
                    </View>
                </TouchableOpacity>

                <View style={{flexDirection: 'row', marginTop: 8, alignSelf: 'flex-end'}}>
                    <View style={{ borderRadius: 10, width: '30%', paddingVertical: 8, alignSelf: 'flex-end'}}>
                        <TouchableOpacity 
                            style={{
                                backgroundColor: Color.textInput,
                                borderRadius: 20,
                                borderColor: Color.red,
                                borderWidth: 0.5,
                            }}
                            onPress={() => removeFromWishList(item)}
                        >
                            <Text style={{color: Color.error, fontWeight: 'bold', fontSize: 10, marginVertical: 5}}>Hapus</Text>
                        </TouchableOpacity>
                    </View>
                    <Divider />
                    <View style={{ borderRadius: 10, width: '30%', paddingVertical: 8,}}>
                        <TouchableOpacity 
                            style={{
                                backgroundColor: Color.primary, 
                                borderRadius: 20,
                            }}
                            onPress={() => addToCart(item)}
                        >
                            <Text style={{color: Color.textInput, fontWeight: 'bold', fontSize: 10, marginVertical: 5}}>+ Ke keranjang</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Loading {...loadingProps} />
            </View>
        </View>
    );

    // console.log('dataWishlist', dataWishlist);

  return (
    <Scaffold
        header={<Header customIcon title="Wishlist" type="regular" centerTitle={false} />}
        onPressLeftButton={() => navigation.pop()}
        loadingProps={loadingProps}
    >
        <View>
            <FlatList
                data={dataWishlist}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />
        </View>

        {dataWishlist.length === 0 && (
            <View style={{alignItems: 'center', justifyContent: 'center', marginVertical: 100}}>
                <Image source={ImagesPath.wishlist}/>
                <Text style={{fontSize: 12, color: Color.secondary, width: '60%', paddingVertical: 15, lineHeight: 20}}>Kamu belum memiliki daftar wishlist apapun</Text>
                <View>
                <TouchableOpacity 
                    style={{
                        backgroundColor: Color.primary, 
                        width: 160, 
                        height: 35, 
                        borderRadius: 20,
                        justifyContent: 'center'
                    }}
                    onPress={() => navigation.navigate('MerchScreen')}
                >
                    <Text style={{fontSize: 12, fontWeight: 'bold', color: Color.textInput}}>Belanja Sekarang</Text>
                </TouchableOpacity>
                </View>
            </View>
        )}
    </Scaffold>
  )
}

export default Wishlist
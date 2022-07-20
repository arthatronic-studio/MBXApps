import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Platform, Linking, useWindowDimensions, Pressable, FlatList } from 'react-native';
import ListForumVertical from '@src/screens/MainForum/ListForumVertical';
import Client from '@src/lib/apollo';
import { queryContentUserProduct } from '@src/lib/query';
import Config from 'react-native-config';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Text from '@src/components/Text';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { useLoading, usePopup, useColor, Alert } from '@src/components';
import {
    iconLocation,
    iconCategory,
    iconComment,
    iconLiked,
    iconLike,
    iconStar

} from '@assets/images/home';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
const initialListData = {
    data: [],
    loading: true,
    message: '',
    loadNext: false,
    page: 0,
    refresh: false,
};


const itemPerPage = 10;

const TabForumNewPost = ({ navigation, route }) => {
    const  item  = route.params;
    // state
    const [listNewPost, setListNewPost] = useState(initialListData);
    const { Color } = useColor();
    useEffect(() => {
        fecthData();
    }, []);

    useEffect(() => {
        if (listNewPost.loadNext) {
            fecthData();
        }
    }, [listNewPost.loadNext]);

    const modalOptionsRef = useRef();

    const fecthData = async () => {
        const newListNewPost = await fetchContentUserProduct(Config.PRODUCT_TYPE, "FORUM", "ALL");
        setListNewPost({
            ...listNewPost,
            data: listNewPost.data.concat(newListNewPost),
            loading: false,
            page: newListNewPost.length === itemPerPage ? listNewPost.page + 1 : -1,
            loadNext: false,
            refresh: false,
        });
    }

    const fetchContentUserProduct = async (productType, productCategory, productSubCategory) => {
        const variables = {
            page: listNewPost.page + 1,
            itemPerPage,
        };

        if (productType !== '') {
            variables.productType = productType;
        }

        if (productCategory !== '') {
            variables.productCategory = productCategory;
        }

        if (productSubCategory !== '') {
            variables.productSubCategory = productSubCategory;
        }

        try {
            const result = await Client.query({
                query: queryContentUserProduct,
                variables,
            });

            if (result && result.data && result.data.contentUserProduct && Array.isArray(result.data.contentUserProduct)) {
                return result.data.contentUserProduct;
            }

            return [];
        } catch (error) {
            return [];
        }
    }

    const onSelected = (item) => {
        const uri = item.videoFilename;
        const type = uri.substr(uri.length - 3);

        // if (type === 'pdf') {
        // }
        // else if (type === 'mp3') {
        // }
    }

    const user = useSelector(state => state['user.auth'].login.user);
    console.log(listNewPost, 'listNewPost');
    const { width, height } = useWindowDimensions();

    const DATA = [
        {
            id: 1,
            title: 'Semua Komentar',
            icon: ''

        },
        {
            id: 2,
            title: 'Terpopuler',
            icon: ''
        },
        {
            id: 3,
            title: 'Terbaru ',
            icon: ''
        },
        {
            id: 4,
            title: '1',
            icon: iconStar
        },
        {
            id: 5,
            title: '2',
            icon: iconStar
        },
        {
            id: 6,
            title: '3',
            icon: iconStar
        },
        {
            id: 7,
            title: '4',
            icon: iconStar
        },
        {
            id: 8,
            title: '5',
            icon: iconStar
        },
    ];

    const DATACONTENT = [
        {
            id: 1,
            nama: 'Helena Helinsky',
            icon: iconStar,
            desc: 'Cupcake ipsum dolor sit amet. Pudding jelly-o danish powder halvah I love jujubes jelly-o.'

        },
        {
            id: 2,
            nama: 'Hendra Budi ',
            icon: iconStar,
            desc:'Cupcake ipsum dolor sit amet. Pudding jelly-o danish powder halvah I love jujubes jelly-o.'

        },
       
    ];

    const renderItemContent = ({ item }) => (


        <View style={{
            alignSelf: 'flex-start',
            marginVertical: 16,
            borderWidth:1,
            borderColor:Color.grayLight,
            width: width - 35, height: 120,
            borderRadius: 15,
            marginHorizontal: 16,
            marginRight: 16
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{ flexDirection: 'row', marginHorizontal: 8, marginVertical: 8, justifyContent: 'space-between' }}>
                    <Image
                        source={iconStar}
                        style={{ height: 20, width: 20 }}
                        resizeMode='contain'
                    />
                    <View>
                        <Text type="bold">{item.nama}</Text>
                        <Image
                            source={iconStar}
                            style={{ height: 10, width: 10 }}
                            resizeMode='contain'
                        />
                    </View>

                </View>
                <View style={{ flexDirection: 'row', marginHorizontal: 8, marginVertical: 8, justifyContent: 'space-between' }}>

                    <AntDesign name="like2" size={24} />
                    <Pressable onPress={() => modalOptionsRef.current.open()}>

                        <Feather name="more-vertical" size={20} color={Color.text} />
                    </Pressable>
                </View>
            </View>
            
            <Text style={{marginHorizontal:5}} align="left">{item.desc}</Text>

            <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:5,marginTop:10}}>

                <Text size={12}color={Color.gray}>12 Juli 2022</Text>
                <Text size={12}color={Color.grey}>0 Suka</Text>

            </View>
        </View>
          
           
    );
    const renderItem = ({ item }) => (


        item.icon == '' ?
        
            <TouchableOpacity style={{ borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10, marginHorizontal: 10, borderRadius: 20 }}>
                <Text>{item.title}</Text>
            </TouchableOpacity>
      
            :
         
            <TouchableOpacity style={{ borderWidth: 1, paddingHorizontal: 15, paddingVertical: 10, marginHorizontal: 10, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                
                <Image
                    source={iconStar}
                    style={{ height: 20, width: 20 }}
                    resizeMode='contain'
                />
                <Text>{item.title}</Text>
            
            </TouchableOpacity>
          
           
    );
    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: Color.textInput }}>
            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginHorizontal: 16, marginVertical: 16 }}>
                <Image
                    source={iconStar}
                    style={{ height: 20, width: 20 }}
                    resizeMode='contain'
                />
                <Text type='bold'>4.3</Text>
                <Text type='bold' style={{ marginTop: 5 }} size={10}>/5</Text>
                <Text color={Color.grey} style={{ marginTop: 5, marginHorizontal: 4 }} size={10}>1.209 Ulasan</Text>
            </View>


            <View style={{
                alignSelf: 'flex-start',
                marginVertical: 16,
                backgroundColor: Color.border,
                width: width - 35, height: 120,
                borderRadius: 15,
                marginHorizontal: 16,
                marginRight: 16
            }}>

                <Image
                    source={iconStar}
                    style={{ height: 40, width: 50, marginHorizontal: 20, marginVertical: 10 }}
                    resizeMode='contain'
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                    <Text type='bold'>Berikan Rating{'\n'} untuk tempat ini</Text>

                    <TouchableOpacity onPress={()=> navigation.navigate('CreateReview',{})}>
                    <View style={{ backgroundColor: Color.primaryDark, borderRadius: 10, paddingTop: 15, paddingBottom: 15, paddingHorizontal: 10 }}>
                        <Text align="center" color={Color.textInput} type="bold">Berikan Ulasan</Text>
                    </View>
                    </TouchableOpacity>

                </View>

            </View>

            <FlatList
                data={DATA}
                renderItem={renderItem}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
            />
             <FlatList
                data={DATACONTENT}
                renderItem={renderItemContent}
               
            showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
            />


<ModalContentOptions
        ref={modalOptionsRef}
        // isOwner={user && user.userId === item.ownerId}
        isOwner={user}
        item={item}
      />
        </ScrollView>
        
    );
}

export default TabForumNewPost;
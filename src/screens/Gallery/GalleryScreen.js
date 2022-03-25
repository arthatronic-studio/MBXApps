import React, { useState, useEffect, useRef } from 'react';
import { View, useWindowDimensions, Image } from 'react-native';
import Styled from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
    Button,
    Header,
    Loading, useLoading,
    ModalListAction,
    Popup, usePopup,
    Scaffold,
    Submit,
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { ScrollView } from 'react-native-gesture-handler';
import { Container, Divider, Row } from 'src/styled';
import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
// import HtmlView from 'src/components/HtmlView';

const GalleryScreen = ({ navigation, route }) => {
    const { params } = route;

    const user = useSelector(
        state => state['user.auth'].login.user
    )

    const [item, setItem] = useState(params ? params.item : null);
    const [listing, setListing] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading] = useLoading();
    const { Color } = useColor();
    const { width } = useWindowDimensions();

    const ref = useRef();

    useEffect(() => {
        if (item && item.id) {
            fetchGetListing(item.id);
        } else {
            fetchGetItem();
        }
    }, []);

    const fetchGetItem = () => {
        const variables = {
            productType: Config.PRODUCT_TYPE,
            productCategory: 'GALLERY',
            // productSubCategory: '',
            page: 0,
            itemPerPage: 1,
        };

        Client.query({
            query: queryContentProduct,
            variables,
        })
        .then((res) => {
            console.log('res prd', res);
            const data = res.data.contentProduct;
            if (Array.isArray(data) && data.length > 0) {
                setItem(data[0]);
                fetchGetListing(data[0]['id']);
            }
        })
        .catch((err) => {
            console.log('err prd', err);
            setIsLoading(false);
        })
    }

    const fetchGetListing = (id) => {
        const variables = {
            productType: Config.PRODUCT_TYPE,
            productCategory: 'GALLERY',
            // productSubCategory: ,
            parentProductId: id,
        };

        Client.query({
            query: queryContentProduct,
            variables,
        })
        .then((res) => {
            console.log('res listing', res);
            const data = res.data.contentProduct;
            if (Array.isArray(data)) {
                setListing(data);
            }

            setIsLoading(false);
        })
        .catch((err) => {
            console.log('err listing', err);
            setIsLoading(false);
        })
    }

    return (
        <Scaffold
            header={
                <Header
                    title='Galeri'
                    actions={
                        user && user.isDirector === 1 && <TouchableOpacity
                            onPress={() => {
                                const params = {
                                    title: 'Tambah Galeri',
                                    productType: Config.PRODUCT_TYPE,
                                    productCategory: '',
                                    productSubCategory: 'GALLERY',
                                    parentProductId: item.id,
                                };
                
                                navigation.navigate('CreateThreadMultipleScreen', { ...params });
                            }}
                        >
                            <AntDesign
                                name='plus'
                                size={24}
                                // onPress={() => navigation.navigate('CardDetailForum')}
                            />
                        </TouchableOpacity>
                    }
                />
            }
            fallback={isLoading}
            empty={false}
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
            <ScrollView>
                <Container marginBottom={16}>
                    {item && <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('GalleryDetailScreen', {
                                id: item.id,
                                image: item.image,
                            });
                        }}
                    >
                        <Image
                            source={{uri: item.image}}
                            style={{
                                width: '100%',
                                aspectRatio: 4/3,
                                backgroundColor: Color.border,
                            }}
                        />
                    </TouchableOpacity>}
                </Container>

                <Container paddingHorizontal={8}>
                    <Row width='100%' style={{flexWrap: 'wrap'}}>
                        {listing.map((e, idx) =>
                            <Container key={idx} width='50%' padding={8}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('GalleryDetailScreen', {
                                            id: e.id,
                                            image: e.image,
                                        });
                                    }}
                                >
                                    <Image
                                        source={{uri: e.image}}
                                        style={{
                                            width: '100%',
                                            aspectRatio: 4/3,
                                            // borderTopLeftRadius: 8,
                                            // borderTopRightRadius: 8,
                                            borderRadius: 4,
                                            backgroundColor: Color.primary,
                                        }}
                                    />
                                    
                                    {/* <Container color={Color.primarySoft} paddingVertical={16} style={{borderBottomLeftRadius: 8, borderBottomRightRadius: 8}}>
                                        <Text type='bold'>
                                            {e.productName}
                                        </Text>
                                    </Container> */}
                                </TouchableOpacity>
                            </Container>
                        )}
                    </Row>
                </Container>
            </ScrollView>
        </Scaffold>
    )
}

export default GalleryScreen;
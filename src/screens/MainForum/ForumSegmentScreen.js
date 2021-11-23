
import React, { useState, useEffect } from 'react';
import { View, FlatList, BackHandler, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import Styled from 'styled-components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Header,
  Text,
  // TouchableOpacity,
  Scaffold,
  useColor
} from '@src/components';
import ModalShowPDF from '@src/components/Modal/ModalShowPDF';
import CardForum from '@src/screens/MainForum/CardForum';

import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const ContentView = Styled(View)`
    width: 100%;
    paddingHorizontal: 16px;
    marginBottom: 16px;
`;

const MainMenuView = Styled(View)`
    width: 100%;
    borderRadius: 8px;
    marginTop: 8px;
    flexDirection: row;
    flexWrap: wrap;
    paddingVertical: 8px;
`;

const PerUserIcons = Styled(TouchableOpacity)`
    width: 33.33%;
    aspectRatio: 1.3;
`;

const UserIcon = Styled(View)`
    height: 100%;
    justifyContent: center;
    alignItems: center;
`;

const ForumSegmentScreen = ({ navigation, route }) => {
    const { params } = route;
    const { title, componentType, productType, productCategory, productSubCategory } = params;

    const [itemData, setItemData] = useState({
      data: [],
      loading: true,
      page: 0,
      loadNext: true,
    });
    const [selectedItem, setSelectedItem] = useState();
    const [modalShowPDF, setModalShowPDF] = useState(false);

    const { Color } = useColor();

    useEffect(() => {
      console.log(params, 'params');
      if (params && params.refresh) {
        console.log('hereee');
        
        navigation.setParams({ refresh: false });
        setItemData({
          data: [],
          loading: true,
          page: 0,
          loadNext: false,
        });
        fetchContentProduct();
      }
    }, [params]);

    useEffect(() => {
      if (itemData.page !== -1) {
        fetchContentProduct();
      }
      
      if (params && params.popToTop) {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      }

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    }, [itemData.loadNext])

    const handleBackPress = () => {
      navigation.popToTop();
      return true;
    }

    const onBack = () => {
      if (params && params.popToTop) {
          navigation.popToTop();
      } else {
          navigation.pop();
      }
    }

    const fetchContentProduct = () => {
      const variables = {
        page: itemData.page + 1,
        itemPerPage: 10,
      };

      if (productType) {
        variables.productType = productType;
      }

      if (productCategory) {
        variables.productCategory = productCategory;
      }

      if (productSubCategory) {
        variables.productSubCategory = productSubCategory;
      }

      Client.query({
        query: queryContentProduct,
        variables,
      })
      .then((res) => {
        console.log(res, 'ressss');

        setStateItemData({
          data: itemData.data.concat(res.data.contentProduct),
          loading: false,
          page: res.data.contentProduct.length === 10 ? itemData.page + 1 : -1,
          loadNext: false,
        });
      })
      .catch((err) => {
        console.log(err, 'errrrr');

        setStateItemData({
          loading: false,
          page: -1,
          loadNext: false,
        });
      })
    }

    const setStateItemData = (obj) => {
      setItemData({
        ...itemData,
        ...obj
      });
    }

    const onSelected = (item) => {
        const uri = item.videoFilename;
        const type = uri.substr(uri.length - 3);

        // if (type === 'pdf') {
        // }
        // else if (type === 'mp3') {
        // }
    }

    return (
        <Scaffold
          headerTitle={title}
          onPressLeftButton={() => onBack()}
        >
            <ContentView>
                <MainMenuView style={{...shadowStyle, shadowOpacity: 0.02, backgroundColor: Color.border}}>
                    <PerUserIcons
                      activeOpacity={0.75}
                      onPress={() => navigation.navigate('CreateThreadScreen', { ...params })}
                    >
                        <UserIcon>
                            <View style={{width: 48, height: 48, borderRadius: 24, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center', ...shadowStyle}}>
                                <MaterialIcons name='create' color={Color.theme} size={22} />
                            </View>
                            <View style={{marginTop: 8}}>
                                <Text size={12} type='semibold'>Buat Thread</Text>
                            </View>
                        </UserIcon>
                    </PerUserIcons>
                </MainMenuView>
            </ContentView>
            
            {itemData.loading ?
              <ActivityIndicator size='large' color={Color.primary} style={{marginTop: 24}} />
            : componentType === 'LIST' ?
              <FlatList
                key='LIST'
                keyExtractor={(item, index) => item.toString() + index}
                data={itemData.data}
                renderItem={({ item, index }) =>
                  <CardForum
                    componentType={componentType}
                    item={item}
                    numColumns={2}
                    onPress={() => {
                      onSelected(item);
                      navigation.navigate('DetailForumScreen', { item });
                    }}
                  />
                }
                onEndReached={() => itemData.page !== -1 && setStateItemData({ loadNext: true })}
                onEndReachedThreshold={0.3}
              />
            : componentType === 'GRID' ?
              <FlatList
                key='GRID'
                keyExtractor={(item, index) => item.toString() + index}
                data={itemData.data}
                numColumns={2}
                contentContainerStyle={{paddingHorizontal: 8, paddingTop: 8}}
                renderItem={({ item, index }) =>
                  <CardForum
                    componentType={componentType}
                    item={item}
                    numColumns={2}
                    onPress={() => {
                      onSelected(item);
                      navigation.navigate('DetailForumScreen', { item });
                    }}
                  />
                }
                onEndReached={() => itemData.page !== -1 && setStateItemData({ loadNext: true })}
                onEndReachedThreshold={0.3}
              />
            :
              <FlatList
                key='GENERAL'
                keyExtractor={(item, index) => item.toString() + index}
                data={itemData.data}
                numColumns={2}
                contentContainerStyle={{paddingHorizontal: 8, paddingTop: 8}}
                renderItem={({ item, index }) =>
                  <CardForum
                    componentType={componentType}
                    item={item}
                    numColumns={2}
                    onPress={() => {
                      onSelected(item);
                      navigation.navigate('DetailForumScreen', { item });
                    }}
                  />
                }
                onEndReached={() => itemData.page !== -1 && setStateItemData({ loadNext: true })}
                onEndReachedThreshold={0.3}
              />
            }

            <ModalShowPDF
              visible={modalShowPDF}
              item={selectedItem}
              onClose={() => {
                setModalShowPDF(false);
                setSelectedItem();
              }}
            />
        </Scaffold>
    )
}

export default ForumSegmentScreen;
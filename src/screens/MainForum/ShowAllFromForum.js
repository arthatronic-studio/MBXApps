
import React, { useState, useEffect } from 'react';
import { FlatList, BackHandler, ActivityIndicator, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import {
  Header,
  useColor
} from '@src/components';
import ModalShowPDF from '@src/components/Modal/ModalShowPDF';
import CardForum from '@src/screens/MainForum/CardForum';

import Client from '@src/lib/apollo';
import { queryMaudiProduct } from '@src/lib/query';

const MainView = Styled(SafeAreaView)`
  flex: 1;
`;

const ShowAllFromForum = ({ navigation, route }) => {
    const { title, componentType, productType, productCategory, productSubCategory } = route.params;

    const [itemData, setItemData] = useState({
      data: [],
      loading: true,
      page: 0,
      loadNext: false,
    });
    const [selectedItem, setSelectedItem] = useState();
    const [modalShowPDF, setModalShowPDF] = useState(false);

    const { Color } = useColor();

    useEffect(() => {
      if (itemData.page !== -1) {
        getMaudiProduct();
      }
      
      if (route.params && route.params.popToTop) {
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
      if (route.params && route.params.popToTop) {
          navigation.popToTop();
      } else {
          navigation.pop();
      }
    }

    const getMaudiProduct = () => {
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
        query: queryMaudiProduct,
        variables,
      })
      .then((res) => {
        // console.log(res, 'ressss');

        setStateItemData({
          data: itemData.data.concat(res.data.maudiProduct),
          loading: false,
          page: res.data.maudiProduct.length === 10 ? itemData.page + 1 : -1,
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
        //     setSelectedItem(item);
        //     setModalShowPDF(true);
        // }
        // else if (type === 'mp3') {
        // }
    }

    return (
        <MainView style={{backgroundColor: Color.theme}}>
            <Header
              title={title}
              onPressLeftButton={() => {
                onBack();
              }}
            />
            
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
        </MainView>
    )
}

export default ShowAllFromForum;
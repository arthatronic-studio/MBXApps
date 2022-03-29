import React, { useEffect, useState } from 'react';
import {View, Image, TextInput, FlatList, useWindowDimensions} from 'react-native';
import Styled from 'styled-components';
import {Col, Row, Scaffold, Text} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import {queryContentProduct} from '@src/lib/query';
import {useColor} from '@src/components/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardForumPopular from './CardForumPopular';
import {Container, Divider, MainView} from 'src/styled';
import SearchBar from 'src/components/SearchBar';
import ImagesPath from 'src/components/ImagesPath';
import Config from 'react-native-config';
import client from 'src/lib/apollo';
import ListForumVertical from './ListForumVertical';
import { initialItemState } from 'src/utils/constants';

const DATA = [
  {
    id: 1,
    title: 'Gaming',
  },
  {
    id: 2,
    title: 'Coding',
  },

];

const DATA_POPULER = [
  {
    id: 1,
    title: 'Sabyan',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
  {
    id: 2,
    title: 'Tribesocial',
    subtitle: 'Gaming Hub & 1 lainnya',
  },
];

const ForumSearch = ({navigation, route}) => {
  const {Color} = useColor();
  const {height} = useWindowDimensions();

  const [textSearch, setTextSearch] = useState('');
  const [itemData, setItemData] = useState(initialItemState);

  useEffect(() => {
    const timeout = textSearch !== '' ?
      setTimeout(() => {
        fetchContentProduct();
      }, 500) : null;

    return () => clearTimeout(timeout);
  }, [textSearch]);

  const fetchContentProduct = () => {
    const variables = {
      productType: Config.PRODUCT_TYPE,
      productCategory: 'FORUM',
      productName: textSearch,
      page: 0,
      itemPerPage: 6,
    };

    client.query({
      query: queryContentProduct,
      variables,
    })
    .then((res) => {
      console.log('res search', res);

      let newList = [];

      if (res.data.contentProduct) {
        newList = res.data.contentProduct;
      }

      setItemData({
        ...itemData,
        data: newList,
        loading: false,
      });
    })
    .catch((err) => {
      console.log('err search', err);

      setItemData({
        ...itemData,
        // data: [],
        loading: false,
      });
    });
  }
  
  return (
    <Scaffold
    
    >
      <Divider />

      <SearchBar
        type='input'
        label='Cari postingan'
        value={textSearch}
        onChangeText={(val) => setTextSearch(val)}
      />

      {/* LIST SEARCH */}
      {/* <View style={{height: 170}}>
        <FlatList
          data={DATA}
          keyExtractor={(item, index) => item.toString() + index}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={{
                  borderWidth: 0.5,
                  borderColor: Color.border,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize:11}}>{item.title} </Text>
                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color={Color.primary}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View> */}

      {itemData.data.length > 0 ? <ListForumVertical
        data={itemData.data}
        loading={itemData.loading}
        showHeader={false}
        onPress={(item) => {
          navigation.navigate('DetailForumScreen', { item });
        }}
      />
      :
        <Container align='center' marginTop={height / 3}>
          <Image source={ImagesPath.searchEmpty} />
          <Divider />
          <Text style={{color: Color.gray}}>
              Belum ada hasil pencarian terbaru
            </Text>
        </Container>
      }

      {/* LIST POPULAR */}
      {/* <View style={{marginTop: 16, paddingHorizontal: 16, flex: 1}}>
        <View style={{marginBottom:16}}>
          <Text style={{fontSize:11,fontWeight:'bold'}}>
            Topik Terpopuler
          </Text>
        </View>

        <FlatList
          data={DATA_POPULER}
          keyExtractor={(item, index) => item.toString() + index}
          renderItem={({item}) => {
            return <CardForumPopular item={item} />;
          }}
        />
      </View> */}
    </Scaffold>
  );
};

export default ForumSearch;

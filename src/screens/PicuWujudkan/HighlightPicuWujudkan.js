const defaultProps = {
  title: '',
  showSeeAllText: true,
  refresh: false,
  numColumns: 2,
  type: null,
  style: {},
  contentType: null,
};

import React, {useState, useEffect, useRef} from 'react';
import {Image, View, ScrollView, FlatList} from 'react-native';

import {useColor} from '@src/components';
import PostingHeader from '../../components/Posting/PostingHeader';
import {getAPI} from 'src/api-rest/httpService';
import {useSelector} from 'react-redux';
import {Container, Divider} from 'src/styled';
import {useNavigation} from '@react-navigation/native';
import CardPicuWujudkan from './CardPicuWujudkan';
import imageAssets from 'assets/images';
import {fetchGetArticle} from 'src/api-rest/fetchGetArticle';
import {fetchGetPicuWujudkan} from 'src/api-rest/fetchGetPicuWujudkan';

const HighlightPicuWujudkan = ({
  type,
  title,
  showSeeAllText,
  refresh,
  numColumns,
  style,
  contentType,
  contentName,
  category,
}) => {
  const navigation = useNavigation();

  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    if (refresh) {
      fetchData();
    }
  }, [refresh]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let param = '';
    if (type == 'HIGHLIGHT') {
      param = `?perPage=4&highlight=1&category=picu_wujudkan`;
    } else if (type == 'OTHER') {
      param = `?perPage=10&highlight=1&category=picu_wujudkan&type=${category}`;
    }
    const result = await fetchGetPicuWujudkan(param);
    let newArr = [];
    if (result.status) {
      if (Array.isArray(result.data)) newArr = result.data;
    }

    setItemData(newArr);
  };

  if (itemData.length === 0) return <View />;

  return (
    <View
      style={{
        paddingVertical: 8,
      }}>
      <PostingHeader
        title={title}
        showSeeAllText={showSeeAllText}
        onSeeAllPress={() => {
          contentType == 'all'
            ? navigation.navigate('PicuWujudkanAllScreen', {
                contentName: contentName,
                category: category,
              })
            : navigation.navigate('PicuWujudkanScreen');
        }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            // flexWrap: 'wrap',
            paddingHorizontal: 8,
            ...style,
          }}>
          {itemData.map((item, idx) => {
            return (
              <CardPicuWujudkan
                key={idx}
                index={idx}
                item={item}
                numColumns={numColumns}
                horizontal={true}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* <Container paddingHorizontal={16} paddingTop={11} paddingBottom={11}>
        <Text size={29} align="left" lineHeight={38}>
          Customers as Industrial Age phenomenon will be replaced by{' '}
          <Text size={29} type="semibold">
            Creative Prosumers
          </Text>
          , people who produce many of their own goods and services.{' '}
          <View>
            <Text size={11} type="medium" align="left">
              Philip Kotler
            </Text>
            <Text size={11} type="medium" align="left">
              -1986
            </Text>
          </View>
        </Text>

        <Divider height={11} />

        <Text size={16} type="medium" align="left">
          We believe colaboration make us stronger, join and be part of our
          movement!
        </Text>
      </Container> */}

      {/* <TouchableOpacity
                  style={{width: '50%', marginTop: 24, alignSelf: 'flex-end', paddingVertical: 12, borderWidth: 1, borderColor: Color.text}}
                >
                  <Text>Spark Ideas</Text>
                </TouchableOpacity> */}
    </View>
  );
};

export default HighlightPicuWujudkan;

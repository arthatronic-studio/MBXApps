import React, {useState, useEffect, useRef} from 'react';
import {Image, View, ScrollView, FlatList} from 'react-native';

import {useColor} from '@src/components';
import PostingHeader from '../../components/Posting/PostingHeader';
import {getAPI} from 'src/api-rest/httpService';
import {useSelector} from 'react-redux';
import {Container, Divider} from 'src/styled';
import {useNavigation} from '@react-navigation/native';
import CardArticle from './CardArticle';
import imageAssets from 'assets/images';
import {fetchGetArticle} from 'src/api-rest/fetchGetArticle';
import CardXperience from './CardXperience';

const defaultProps = {
  title: '',
  type: null,
  numColumns: 2,
  showSeeAllText: true,
  style: {},
  id: null,
  categoryId: null,
  refresh: false,
};

const HighlightXperience = ({
  title,
  type,
  numColumns,
  showSeeAllText,
  style,
  id,
  categoryId,
  refresh,
}) => {
  const {Color} = useColor();
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
      param = `?highlight=1&perPage=4`;
    } else if (type == 'OTHER') {
      param = `?other=1&id=${id}&category_id=${categoryId}&perPage=10`;
    }
    const result = await fetchGetArticle(param);
    let newArr = [];
    if (result.status) {
      if (Array.isArray(result.data)) newArr = result.data;
    }

    console.log('newArr', newArr);
    
    setItemData(newArr);
  };

  if (itemData.length === 0) return <View />;

  // console.log(itemData, 'itemData');

  return (
    <View
      style={{
        paddingVertical: 8,
      }}>
      <PostingHeader
        title={title}
        onSeeAllPress={() => {
          navigation.navigate('ArticleScreen');
        }}
        showSeeAllText={showSeeAllText}
      />
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            // flexWrap: 'wrap',
            paddingHorizontal: 8,
            ...style,
          }}>
          {itemData.map((item, idx) => {
            return (
              <CardXperience
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
    </View>
  );
};

HighlightXperience.defaultProps = defaultProps;
export default HighlightXperience;

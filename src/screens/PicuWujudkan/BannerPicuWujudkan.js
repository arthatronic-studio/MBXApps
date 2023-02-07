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
import {
  Image,
  View,
  ScrollView,
  FlatList,
  useWindowDimensions,
} from 'react-native';

import {TouchableOpacity, useColor} from '@src/components';
import PostingHeader from '../../components/Posting/PostingHeader';
import {getAPI} from 'src/api-rest/httpService';
import {useSelector} from 'react-redux';
import {Container, Divider} from 'src/styled';
import {useNavigation} from '@react-navigation/native';
import CardPicuWujudkan from './CardPicuWujudkan';
import imageAssets from 'assets/images';
import {fetchGetArticle} from 'src/api-rest/fetchGetArticle';
import {fetchGetPicuWujudkan} from 'src/api-rest/fetchGetPicuWujudkan';
import {fetchGetBanner} from 'src/api-rest/fetchGetBanner';

const BannerPicuWujudkan = ({
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
  useEffect(() => {
    console.log("bannnn",category)
    fetchBanner();
  }, []);

  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const [imageBanner, setImageBanner] = useState();

  const fetchBanner = async () => {
    let param = `?type=${category}`;

    const result = await fetchGetBanner(param);
    console.log('resss bannerr', result);
    setImageBanner(result.data[0].file);
  };

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

      <TouchableOpacity
        style={{
          padding: 8,
        }}
        onPress={() => {
          contentType == 'all'
            ? navigation.navigate('PicuWujudkanAllScreen', {
                contentName: contentName,
                category: category,
              })
            : navigation.navigate('PicuWujudkanScreen');
        }}>
        <Image
          source={{uri: imageBanner}}
          style={{
            width: '100%',
            height: width * 0.65,
            resizeMode: 'cover',
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BannerPicuWujudkan;

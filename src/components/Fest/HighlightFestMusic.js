import React, {useState, useEffect} from 'react';
import {View, ScrollView, useWindowDimensions, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/core';

import {ScreenEmptyData, useColor, Text} from '@src/components';
import PostingHeader from '../Posting/PostingHeader';
import {Container, Row} from 'src/styled';
import PostingSkeleton from '../Posting/PostingSkeleton';
import {useSelector} from 'react-redux';
import {initialItemState} from 'src/utils/constants';
import {fetchContentProduct, fetchContentUserProduct} from 'src/api/content';
import CardContentProduct from 'src/components/Content/CardContentProduct';
import {getAPI} from 'src/api-rest/httpService';
import {trackPlayerPlay} from 'src/utils/track-player-play';
import {queryContentProduct} from 'src/lib/query';
import client from 'src/lib/apollo';
import imageAssets from 'assets/images';
import { Divider } from 'src/styled';
import Ionicons from 'react-native-vector-icons/Ionicons';

const propTypes = {
  userProfileId: PropTypes.number,
  productCategory: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  category: PropTypes.string,
  nav: PropTypes.string,
  refresh: PropTypes.bool,
  horizontal: PropTypes.bool,
  style: PropTypes.object,
  showHeader: PropTypes.bool,
  showEmpty: PropTypes.bool,
  showSeeAllText: PropTypes.bool,
};

const defaultProps = {
  userProfileId: null,
  productCategory: '',
  name: '',
  title: '',
  category: '',
  nav: '',
  refresh: false,
  horizontal: false,
  style: {},
  showHeader: true,
  showEmpty: false,
  showSeeAllText: true,
};

const HighlightFestMusic = props => {
  const {
    userProfileId,
    productCategory,
    name,
    title,
    category,
    nav,
    refresh,
    horizontal,
    style,
    showHeader,
    showEmpty,
    showSeeAllText,
  } = props;

  const {Color} = useColor();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);

  const [itemData, setItemData] = useState(initialItemState);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (itemData.refresh || refresh) {
      fetchData();
    }
  }, [itemData.refresh, refresh]);

  const fetchData = async () => {
    const variables = {
      page: 1,
      itemPerPage: 50,
      productType: 'TRIBESASIA',
      productCategory: 'NEWEST_MUSIC',
    };

    client
      .query({
        query: queryContentProduct,
        variables,
      })
      .then(res => {
        console.log('res musik terbaru', res);

        let newData = [];
        if (res.data.contentProduct) {
          newData = res.data.contentProduct;
        }
        console.log("hahahah")

        setItemData({
          ...itemData,
          data: newData,
          loading: false,
          loadNext: false,
          message: res.message,
          refresh: false,
        });
      })
      .catch(err => {
        console.log('err musik terbaru', err);

        setItemData({
          ...itemData,
          loading: false,
          loadNext: false,
          message: res.message,
          refresh: false,
        });
      });
    // const result = await getAPI('event');
    // console.log('result event', result);
    // let newData = [];

    // if (result.status) {
    //   newData = result.data;
    // }

    // setItemData({
    //   ...itemData,
    //   data: newData,
    //   loading: false,
    //   loadNext: false,
    //   message: result.message,
    //   refresh: false,
    // });

    // let variables = {
    //     page: 1,
    //     itemPerPage:
    //         userProfileId !== null || productCategory === 'YOUTUBE_VIDEO' ? 1 :
    //         productCategory === 'NEARBY_PLACE' ? 4 :
    //         productCategory === 'POSTING' ? 3 :
    //         2,
    // }
    // if (productCategory) {
    //     variables.productCategory = productCategory;
    // }
    // if (userProfileId !== null) {
    //     variables.userProfileId = userProfileId;
    // }

    // const result = userProfileId !== null ?
    //     await fetchContentUserProduct(variables) :
    //     await fetchContentProduct(variables);

    // setItemData({
    //     ...itemData,
    //     data: result.data,
    //     loading: false,
    //     loadNext: false,
    //     message: result.message,
    //     refresh: false,
    // });
  };

  const renderHeader = () => {
    return (
      <PostingHeader
        title={title}
        onSeeAllPress={() => {
          navigation.navigate(nav, {title, userProfileId});
        }}
        productCategory={productCategory}
        showSeeAllText={showSeeAllText}
      />
    );
  };

  const renderSkeleton = () => {
    return (
      <Container paddingLeft={16} paddingTop={16} paddingRight={32}>
        <Row>
          <PostingSkeleton />
          <PostingSkeleton />
        </Row>
      </Container>
    );
  };

  let extraProps = {numColumns: 1};
  if (horizontal) extraProps = {};
  if (productCategory === 'FEST_LITERATURE') extraProps.numColumns = 2;
  if (productCategory === 'FEST_ARTS') extraProps.numColumns = 2;
  if (productCategory === 'FEST_MUSIC_HORIZONTAL') extraProps.numColumns = 2;

  const cardFestMusicHorizontal = (item, index, numColumns) => {
    return (
      <TouchableOpacity
        key={index}
        style={{
          paddingHorizontal: 8,
          paddingVertical: 8,
          width: (width / numColumns) - 8,
        }}
        onPress={() => {
          trackPlayerPlay(itemData.data, index);
          navigation.navigate('FestMusicPlayer', {item});
        }}>
        <Image
          source={{uri: item.image}}
          style={{
            width: '100%',
            aspectRatio: 1,
            resizeMode: 'cover',
            borderRadius: 8,
          }}
          resizeMethod={'auto'}
        />
        <Divider height={8} />
        <Text
          align="left"
          numberOfLines={1}
          size={14}
          type="medium"
          color={Color.black}>
          Aroma Roket Senja
        </Text>
        <Text align="left" numberOfLines={1} size={10} color={Color.textSoft}>
          Besok Ngoding Band
        </Text>
        <Container flex={1} flexDirection="row" align="center">
          <Ionicons name={'heart'} color={'#ACAAA5'} />
          <Divider width={5} />
          <Text size={10} color={'#ACAAA5'}>
            10.5rb Suka
          </Text>
        </Container>
      </TouchableOpacity>
    );
  };

  const cardFestMusic = (item, index) => {
    console.log(item, "iteem")
    return (
      <TouchableOpacity
        onPress={() => {
          trackPlayerPlay(itemData.data, index);
          navigation.navigate('FestMusicPlayer', {item});
        }}
        style={{
          padding: 10,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          // source={{uri: item.image}}
          source={{ uri: item.image }}
          style={{
            width: '14%',
            aspectRatio: 1,
            borderRadius: 8,
          }}
          resizeMode="cover"
        />

        <Divider width={10} />
        <Container flexDirection="column" flex={1}>
          <Text
            size={14}
            align="left"
            color={Color.text}
            type="medium"
            numberOfLines={1}>
            {item.productName}
          </Text>
          <Text size={10} align="left" numberOfLines={1}>
            Besok Ngoding Band
          </Text>
        </Container>
      </TouchableOpacity>
    );
  };

  const renderItem = () => {
    if (horizontal) {
      return (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 8,
            ...style,
          }}>
          {itemData.data.map((item, index) =>
            cardFestMusicHorizontal(item, index, 2),
          )}
        </View>
      );
    }

    return itemData.data.map((item, index) => (
      <Container key={index} style={{paddingHorizontal: 8, ...style}}>
        {cardFestMusic(item, index)}
      </Container>
    ));
  };

  if (!showEmpty && !itemData.loading && itemData.data.length === 0) {
    return <View />;
  }

  return (
    <View
      style={{
        paddingTop: 8,
        paddingBottom: ['POSTING', 'NEARBY_PLACE'].includes(productCategory)
          ? 16
          : 8,
      }}>
      {showHeader && renderHeader()}

      {itemData.loading ? (
        renderSkeleton()
      ) : itemData.data.length > 0 ? (
        renderItem()
      ) : (
        <View style={{width: '100%', aspectRatio: 16 / 9}}>
          <ScreenEmptyData
            message={`${name} belum tersedia`}
            style={{width: width - 16, aspectRatio: 16 / 9}}
          />
        </View>
      )}
    </View>
  );
};

HighlightFestMusic.propTypes = propTypes;
HighlightFestMusic.defaultProps = defaultProps;
export default HighlightFestMusic;

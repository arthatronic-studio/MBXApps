import React, {useState, useEffect} from 'react';
import {View, ScrollView, useWindowDimensions, FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/core';

import {ScreenEmptyData, useColor} from '@src/components';
import PostingHeader from '../Posting/PostingHeader';
import {Container, Row} from 'src/styled';
import PostingSkeleton from '../Posting/PostingSkeleton';
import {useSelector} from 'react-redux';
import {initialItemState} from 'src/utils/constants';
import CardContentProduct from '@src/components/Content/CardContentProduct';
import {getAPI} from 'src/api-rest/httpService';
import CardContentFest from 'src/components/Fest/CardContentFest';

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
  wrap: PropTypes.bool,
  maxData: PropTypes.number,
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
  wrap: true,
  onPress: () => {},
  maxData: 0,
};

const HighlightFest = props => {
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
    wrap,
    onPress,
    maxData
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
    // const result = await getAPI('event');
    // console.log('result event', result);
    let newData = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}];
    if(maxData != 0) {
      newData = [{id: 1}, {id: 2}];
    }

    // if (result.status) {
    // newData = result.data;
    // }

    setItemData({
      ...itemData,
      data: newData,
      loading: false,
      loadNext: false,
      message: 'ok',
      // message: result.message,
      refresh: false,
    });
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

  let extraProps = {numColumns: 2};
  if (horizontal) extraProps = {};

  const renderCardContent = (item, index, isHorizontal) => (
    <CardContentFest
      key={index}
      productCategory={productCategory}
      category={category}
      item={item}
      horizontal={isHorizontal}
      onPress={onPress}
      {...extraProps}
    />
  );

  const renderItem = () => {
    if (horizontal) {
      if (wrap) {
        return (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingHorizontal: 8,
              ...style,
            }}>
            {itemData.data.map((item, index) =>
              renderCardContent(item, index, false),
            )}
          </View>
        );
      }
      return (
        <ScrollView
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingHorizontal: 8,
              ...style,
            }}>
            {itemData.data.map((item, index) =>
              renderCardContent(item, index, true),
            )}
          </View>
        </ScrollView>
      );
    }

    return itemData.data.map((item, index) => (
      <Container key={index} style={{paddingHorizontal: 8, ...style}}>
        {renderCardContent(item, index, false)}
      </Container>
    ));
  };

  if (!showEmpty && !itemData.loading && itemData.data.length === 0) {
    return <View />;
  }

  return (
    <View
      style={{
        paddingVertical: 8,
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

HighlightFest.propTypes = propTypes;
HighlightFest.defaultProps = defaultProps;
export default HighlightFest;

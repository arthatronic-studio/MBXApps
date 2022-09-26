import React, {useState, useEffect} from 'react';
import {View, FlatList, useWindowDimensions} from 'react-native';
import PropTypes from 'prop-types';

import {ScreenEmptyData} from '@src/components';
import {Container, Divider, Row} from 'src/styled';
import PostingSkeleton from '../Posting/PostingSkeleton';
import {initialItemState} from 'src/utils/constants';
import {fetchContentProduct, fetchContentUserProduct} from 'src/api/content';
import CardContentProduct from '@src/components/Content/CardContentProduct';
import {getAPI} from 'src/api-rest/httpService';
import PostingHeader from '../Posting/PostingHeader';
import CardContentFest from './CardContentFest';

const propTypes = {
  userProfileId: PropTypes.number,
  productCategory: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  horizontal: PropTypes.bool,
  style: PropTypes.object,
  onLoadingEnd: PropTypes.func,
  showSeeAllText: PropTypes.bool,
};

const defaultProps = {
  userProfileId: null,
  productCategory: '',
  name: '',
  horizontal: false,
  style: {},
  onLoadingEnd: () => {},
  ListHeaderComponent: null,
  title: '',
  showSeeAllText: false,
  showHeader: false,
  onPress: () => {}
};

const ListContenFest = ({
  userProfileId,
  productCategory,
  name,
  horizontal,
  style,
  onLoadingEnd,
  ListHeaderComponent,
  showHeader,
  title,
  showSeeAllText,
  onPress,
}) => {
  const {width} = useWindowDimensions();
  const [itemData, setItemData] = useState(initialItemState);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (itemData.loadNext && itemData.page !== -1) {
      fetchData();
    }
  }, [itemData.loadNext]);

  const fetchData = async () => {
    // const result = await getAPI('event');

    // console.log('result', result);
    let newData = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}];

    setItemData({
      ...itemData,
      data: itemData.data.concat(newData),
      // data: [],
      // page: result.status === false ? itemData.page : result.data.length > 0 ? itemData.page + 1 : -1,
      page: -1,
      loading: false,
      loadNext: false,
      message: 'OK',
      // message: result.message,
      refresh: false,
    });

    onLoadingEnd(false);
  };

  const renderHeader = () => {
    return (
      <PostingHeader
        title={title}
        onSeeAllPress={() => {
          // navigation.navigate(nav, { title, userProfileId });
        }}
        productCategory={productCategory}
        showSeeAllText={showSeeAllText}
        style={{paddingHorizontal: 8}}
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
  if (productCategory === 'NEARBY_PLACE') extraProps.numColumns = 2;
  if (horizontal) extraProps = {};

  return (
    <View style={{}}>
      {showHeader && horizontal && renderHeader()}

      {itemData.loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          keyExtractor={(item, index) => item.toString() + index}
          data={itemData.data}
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 16,
            paddingHorizontal: 8,
            ...style,
          }}
          onEndReachedThreshold={0.3}
          onEndReached={() => setItemData({...itemData, loadNext: true})}
          {...extraProps}
          renderItem={({item, index}) => {
            if (index === 0) {
              return (
                <>
                  {showHeader && !horizontal && renderHeader()}

                  <CardContentFest
                    productCategory={productCategory}
                    item={item}
                    horizontal={horizontal}
                    onPress={onPress}
                    {...extraProps}
                  />
                </>
              );
            }

            return (
              <CardContentFest
                productCategory={productCategory}
                item={item}
                horizontal={horizontal}
                onPress={onPress}
                {...extraProps}
              />
            );
          }}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={() => {
            return (
              <>
                {showHeader &&
                  !horizontal &&
                  !itemData.loading &&
                  itemData.data.length === 0 &&
                  renderHeader()}

                <ScreenEmptyData
                  message={`${name} belum tersedia`}
                  style={{width: width - 16}}
                />
              </>
            );
          }}
        />
      )}
    </View>
  );
};

ListContenFest.propTypes = propTypes;
ListContenFest.defaultProps = defaultProps;
export default ListContenFest;

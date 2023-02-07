import React, {useState, useEffect} from 'react';
import {View, FlatList, useWindowDimensions} from 'react-native';
import PropTypes from 'prop-types';

import {ScreenEmptyData} from '@src/components';
import {Container, Divider, Row} from 'src/styled';
import PostingSkeleton from 'src/components/Posting/PostingSkeleton';
import {initialItemState} from 'src/utils/constants';
import {getAPI} from 'src/api-rest/httpService';
import PostingHeader from 'src/components/Posting/PostingHeader';
import {useSelector} from 'react-redux';
// import CardTenantList from 'src/screens/Tenant/CardTenantList';
// import CardArticle from './CardArticle';
import imageAssets from 'assets/images';
import CardPicuWujudkan from './CardPicuWujudkan';
import { fetchGetPicuWujudkan } from 'src/api-rest/fetchGetPicuWujudkan';

const defaultProps = {
  tenantType: 'eat',
  productCategory: '',
  name: '',
  horizontal: false,
  style: {},
  onLoadingEnd: () => {},
  ListHeaderComponent: null,
  title: '',
  category: ''
};

const ListPicuWujudkan = ({
  style,
  onLoadingEnd,
  ListHeaderComponent,
  title,
  category,
  horizontal,
}) => {
  const [itemData, setItemData] = useState({
    data: [],
    loading: true,
    message: '',
    nextUrl: null,
    loadNext: false,
    refresh: false,
  });

  const auth = useSelector(state => state['auth']);

  useEffect(() => {
    fetchData(true);
  }, []);

  useEffect(() => {
    if (itemData.loadNext && itemData.nextUrl != null) {
      fetchData(false);
    }
  }, [itemData.loadNext]);

  const fetchData = async first => {
    const param = itemData.nextUrl
      ? itemData.nextUrl
      : `?highlight=1&category=picu_wujudkan&type=${category}`;
    const result = await fetchGetPicuWujudkan(param);
    const newArr = result.data;

    setItemData({
      ...itemData,
      data: first ? newArr : itemData.data.concat(newArr),
      nextUrl: result.nextUrl ? `?${result.nextUrl.split('?')[1]}` : null,
      loading: false,
      loadNext: false,
      message: result.message,
      refresh: false,
    });

    onLoadingEnd(false);
  };

  const renderHeader = () => {
    return (
      <PostingHeader
        title={title}
        showSeeAllText={false}
        style={{paddingHorizontal: 15, paddingVertical: 8}}
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
  return (
    <View style={{}}>
      {renderHeader()}

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
            ...style,
            paddingHorizontal: 8,
          }}
          onEndReachedThreshold={0.3}
          numColumns={2}
          onEndReached={() => setItemData({...itemData, loadNext: true})}
          renderItem={({item, index}) => {
            return (
              <CardPicuWujudkan
                key={index}
                index={index}
                item={item}
                numColumns={2}
                horizontal={false}
                category={category}
              />
            );
          }}
        //   ListHeaderComponent={
        //     <>
        //       {ListHeaderComponent}

        //       {
        //         !horizontal &&
        //         itemData.data.length > 0 &&
        //         renderHeader()}
        //     </>
        //   }
        />
      )}
    </View>
  );
};

ListPicuWujudkan.defaultProps = defaultProps;
export default ListPicuWujudkan;

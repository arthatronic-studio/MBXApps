import React from 'react';
import {View, FlatList, useWindowDimensions} from 'react-native';
import PropTypes from 'prop-types';

import {ScreenEmptyData, useColor} from '@src/components';
import CardPlace from 'src/components/Posting/CardPlace';
import {useNavigation} from '@react-navigation/core';
import PostingHeader from './PostingHeader';
import {Container, Row} from 'src/styled';
import PostingSkeleton from './PostingSkeleton';
import {GALogEvent} from 'src/utils/analytics';

const propTypes = {
  data: PropTypes.array,
  horizontal: PropTypes.bool,
  style: PropTypes.object,
  onPress: PropTypes.func,
  showHeader: PropTypes.bool,
  loading: PropTypes.bool,
};

const defaultProps = {
  data: [],
  horizontal: false,
  style: {},
  onPress: () => {},
  showHeader: true,
  loading: false,
};

const ListPlace = props => {
  const {data, horizontal, style, onPress, showHeader, loading} = props;

  const {Color} = useColor();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();

  let extraProps = {numColumns: 2};
  if (horizontal) extraProps = {};

  const renderHeader = () => {
    return (
      <PostingHeader
        title="Tempat Favorit"
        onSeeAllPress={() => {
          navigation.navigate('PlaceScreen', {title: 'Tempat Favorit'});
        }}
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
    <View style={{paddingBottom: 8}}>
      {showHeader && renderHeader()}

      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          key="ListPlace"
          keyExtractor={(item, index) => item.toString() + index}
          data={data}
          {...extraProps}
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 16,
            paddingHorizontal: 8,
            ...style,
          }}
          renderItem={({item, index}) => {
            return (
              <CardPlace
                item={item}
                numColumns={2}
                horizontal={horizontal}
                onPress={() => {
                  onPress(item);
                  GALogEvent('Tempat', {
                    id: item.id,
                    product_name: item.productName,
                    user_id: item.ownerId,
                    method: 'view',
                  });
                  console.log('ini item', item);
                }}
              />
            );
          }}
          ListEmptyComponent={() => {
            return (
              <ScreenEmptyData
                message="Tempat belum tersedia"
                style={{width: width - 16}}
              />
            );
          }}
        />
      )}
    </View>
  );
};

ListPlace.propTypes = propTypes;
ListPlace.defaultProps = defaultProps;
export default ListPlace;

import React, { useState, useEffect } from 'react';
import { Image, View, FlatList } from 'react-native';
import Styled from 'styled-components';

import Text from '@src/components/Text';
import CardBooking from '@src/screens/MyBooking/CardBooking';
import { useColor } from '@src/components/Color';

import {
  imageEmpty,
} from '@assets/images';

const ContentView = Styled(View)`
  width: 100%;
  height: ${props => props.height};
  justifyContent: center;
  alignItems: center;
  paddingBottom: ${props => props.paddingBottom};
`;

const ImageProperty = Styled(Image)`
  width: 100px;
  height: 150px;
`;

const defaultProps = {
  onExpired: () => {},
};

const TabScreenPerProduct = (props) => {
  const {
    bookings,
    loading,
    isComponent,
    openModal,
    onExpired,
    onRefresh,
    getMoreResult,
    style,
  } = props;

  const [refreshing, setRefreshing] = useState(false);

  const { Color } = useColor();

  const keyExtractor = (item, index) => `${item.id} - ${index}`;

  const renderAllCards = (booking) => {
    return (
      <CardBooking
        booking={booking}
        openModal={(n, selectedBooking) => openModal(n, selectedBooking)}
        onExpired={() => onExpired()}
      />
    )
  }

  const renderNoOrder = () => {
    if (loading) {
      return <View />
    }

    return (
      <ContentView
        height={isComponent ? '240px' : '80%'}
        paddingBottom={isComponent ? '42px' : '0px'}
        style={{backgroundColor: Color.theme}}
      >
        <ImageProperty resizeMode='contain' source={imageEmpty} />
        <Text type='bold'>Riwayat Pemesanan Anda Kosong</Text>
        <Text color={Color.bordered}>Anda tidak memiliki riwayat pemesanan,</Text>
        <Text color={Color.bordered}>Silahkan melakukan transaksi</Text>
      </ContentView>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ ...style, width: '100%', minHeight: '93%', backgroundColor: Color.theme }}
      keyExtractor={keyExtractor}
      data={bookings}
      onRefresh={onRefresh}
      refreshing={false}
      ListEmptyComponent={() => renderNoOrder()}
      renderItem={({ item }) => renderAllCards(item)}
      onEndReached={getMoreResult}
      onEndReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
    />
  );
}

TabScreenPerProduct.defaultProps = defaultProps;

export default TabScreenPerProduct;
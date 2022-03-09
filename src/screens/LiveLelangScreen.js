import React from 'react';
import {View, Text, Image, FlatList, StatusBar} from 'react-native';

import {Scaffold, useColor, Header} from '@src/components';
import LiveProductList from 'src/components/LiveProductList';

const LiveLelangScreen = () => {
  const {Color} = useColor();
  return (
    <Scaffold
      header={
        <Header
          type="regular"
          centerTitle={false}
          customIcon
          title="Sedang Berlangsung"
        />
      }
    >
      <View style={{width: '100%', height: '100%'}}>
        <LiveProductList />
      </View>
    </Scaffold>
  );
};

export default LiveLelangScreen;

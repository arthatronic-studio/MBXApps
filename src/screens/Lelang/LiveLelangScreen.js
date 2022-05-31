import React from 'react';
import {View, Text, Image, FlatList, StatusBar} from 'react-native';
import {Scaffold, useColor, Header} from '@src/components';
import CardListLelang from 'src/components/Card/CardListLelang';

const LiveLelangScreen = ({route}) => {
  const {Color} = useColor();
  return (
    <Scaffold
      header={
        <Header
          type="bold"
          centerTitle={false}
          customIcon
          title= {route.params.title}
        />
      }
    >
      <CardListLelang
        prodStatus={route.params.prodStatus}
      />
    </Scaffold>
  );
};

export default LiveLelangScreen;

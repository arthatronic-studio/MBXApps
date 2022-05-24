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
      <View style={{width: '100%', height: '100%'}}>
        <CardListLelang prodStatus={route.params.cardStatus}/>
      </View>
    </Scaffold>
  );
};

export default LiveLelangScreen;

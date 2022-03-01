import React, {useState, useEffect, useRef} from 'react';
import {View, Image, FlatList, useWindowDimensions} from 'react-native';

import {Scaffold, useColor, Header, Text} from '@src/components';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import CardListLelang from 'src/components/Card/CardListLelang';
import { Divider } from 'src/styled';
import Banner from 'src/components/Banner';
import { queryGetAuction } from 'src/lib/query/auction';
import client from 'src/lib/apollo';

const Lelang = ({ navigation, route }) => {
  const {Color} = useColor();

  const { height, width } = useWindowDimensions();


  const renderHeader = () => {
    return (
      <>
        <Banner data={[0, 0]} showHeader={false} />

        <View
          style={{
            width: '100%',
            paddingHorizontal: 16
          }}
        >
          <Text
            type='bold'
            align='left'
            size={16}
          >
            Pelelangan
          </Text>

          <Divider />

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}
          >
            <View
              style={{
                width: '60%',
              }}
            >
              <Text
                align='left'
                size={16}
              >
                Sedang Berlangsung
              </Text>
            </View>
            <View
              style={{
                width: '40%',
                justifyContent: 'center',
              }}>
              <TouchableOpacity onPress={() => navigation.navigate('LiveLelangScreen')}>
                <Text
                  color={Color.info}
                  align='right'
                >
                  Lihat Semua
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    )
  }
  
  return (
    <Scaffold
      header={
        <Header
          type="regular"
          centerTitle={false}
          customIcon
          title="Lelang"
        />
      }
      onPressLeftButton={() => navigation.pop()}
    >
      <CardListLelang
        ListHeaderComponent={() => renderHeader()}
      />
    </Scaffold>
  );
};

export default Lelang;

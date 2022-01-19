import React from 'react';
import {View, Image, FlatList, StatusBar} from 'react-native';

import Banner from 'src/components/Banner';
import {Scaffold, useColor, Header, Text} from '@src/components';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import CardListLelang from 'src/components/Card/CardListLelang';
import { Divider } from 'src/styled';

const Lelang = ({ navigation, route }) => {
  const {Color} = useColor();

  const renderHeader = () => {
    return (
      <>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: 16,
          }}
        >
          <Banner />
        </View>

        <Divider height={24} />

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

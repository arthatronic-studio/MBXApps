import React from 'react';
import { View, FlatList } from 'react-native';

import { useLoading, usePopup, useColor, Header } from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import { Divider } from '@src/styled';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Report = ({ navigation, route }) => {
  const { item } = route.params;

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();
  const { Color } = useColor();

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Pelecehan',
      sub: 'Memalukan penghinaan terhadap seseorang atau individu'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Spam',
      sub: 'Melakukan penjualan barang ilegal, penipuan, dll'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Rasisme',
      sub: 'Melakukan penghinaan terhadap kerpercayaan sebuah individu atau kelompok'
    },
    {
      id: '58694a0f-3da1-4701f-bd96-145571e29d72',
      title: 'Lainnya',
      sub: '',
    },
  ];

  const renderItem = ({ item: itemDetail }) => (
    <View style={{ flexDirection: 'row', marginBottom: 16, alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ForumReportDetail', {
            item,
            title: itemDetail.title,
            sub: itemDetail.sub,
          });
        }}
        style={{
          paddingRight: 12,
        }}
      >
        <View
          style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={{ height: 14, width: 14, borderRadius: 7, backgroundColor: Color.textInput }} />
        </View>
      </TouchableOpacity>

      <View>
        <Text align='left' type="bold">{itemDetail.title}</Text>
        {itemDetail.sub !== '' && <>
          <Divider height={4} />
          <Text align='left' size={10}>{itemDetail.sub}</Text>
        </>}
      </View>
    </View>
  );

  return (
    <Scaffold
      fallback={false}
      empty={false}
      header={
        <Header
          title='Report'
          centerTitle={false}
        />
      }
      popupProps={popupProps}
      loadingProps={loadingProps}
    >
      <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 }}>
        <Text type="bold" align='left'>Pilih alasan report</Text>
      </View>

      <FlatList
        keyExtractor={(itemDetail, index) => itemDetail.id + index.toString()}
        data={DATA}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
      />
    </Scaffold>
  );
};

export default Report;
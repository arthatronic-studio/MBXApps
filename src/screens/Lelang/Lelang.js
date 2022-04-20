import React, {useState, useEffect, useRef} from 'react';
import {View, Image, FlatList, useWindowDimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Scaffold, useColor, Header, Text,  Row,
  Col,} from '@src/components';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import CardListLelang from 'src/components/Card/CardListLelang';
import Banner from 'src/components/Banner';
import { queryGetAuction } from 'src/lib/query/auction';
import client from 'src/lib/apollo';
import { Divider } from 'src/styled';


const Lelang = ({ navigation, route }) => {
  const {Color} = useColor();

  const { height, width } = useWindowDimensions();
  
  return (
    <Scaffold
      header={
        <Header
        type="bold"
        centerTitle={false}
        title="Lelang"
        actions={
          <View style={{flexDirection: 'row'}}>
            <MaterialIcons onPress={()=> navigation.navigate('Wishlist')} name={'favorite-outline'} size={20} style={{marginHorizontal: 5, color: Color.secondary}}/>
            <MaterialCommunityIcons onPress={()=> navigation.navigate('CartScreen')} name={'shopping-outline'} size={20} style={{marginHorizontal: 5, color: Color.secondary}}/>
            <MaterialCommunityIcons onPress={()=> navigation.navigate('AuctionHistory')} name={'history'} size={20} style={{marginHorizontal: 5, color: Color.secondary}}/>
          </View>
        }
        customIcon
        />
      }
      onPressLeftButton={() => navigation.pop()}
    >
      <Divider/>
      <Banner data={[0, 0]} showHeader={false} />
      <Divider/>
      <Row style={{width: '100%', paddingHorizontal: 15}}>
        <Col style={{width: '50%',}}>
          <Text align='left' type='bold'>Pelelangan</Text>
          <Text align='left' type='bold'>Sedang Berlangsung</Text>
        </Col>
        <Text onPress={()=> navigation.navigate('LiveLelangScreen')} style={{width: '50%',marginVertical: 10, textAlign: 'right', color: Color.primary}}>Lihat Semua</Text>
      </Row>
      <Divider height={10}/>
      <CardListLelang/>
    </Scaffold>
  );
};

export default Lelang;

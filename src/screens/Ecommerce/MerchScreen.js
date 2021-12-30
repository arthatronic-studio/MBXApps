import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Platform, SafeAreaView, Image} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  Loading,
  useLoading,
  Scaffold,
  Row,
  Col,
  HeaderBig,
  useColor,
  Header,
} from '@src/components';
import {TouchableOpacity} from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';

import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {queryContentProduct} from '@src/lib/query';
import Filter from 'src/components/Filter';
import Category from 'src/components/Category';
import ImagesPath from 'src/components/ImagesPath';
import CardListProduk from 'src/components/Card/CardListProduct';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

let filter = [
  {id: 1, name: 'Category'},
  {id: 2, name: 'Rating'},
];

const MerchScreen = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const {Color} = useColor();

  const onSelect = item => {
    setSelectedItem(item);
  };
  return (
    <Scaffold
      header={
        <Header
          type="regular"
          color={Color.white}
          backgroundColor="blackContent"
          centerTitle={false}
          searchbar
          cartIcon
          favoriteIcon
          notifIcon
        />
      }
      color="black"
      onPressLeftButton={() => navigation.pop()}>
      <View style={{flexDirection: 'row', marginTop: 12}}>
        <Filter value={selectedItem} data={filter} onSelect={onSelect} />
        <Category />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: 40,
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}>
        <Text>Terbaru</Text>
        <View style={{width: '72%'}}></View>
        <View style={{flexDirection: 'row'}}>
          <View style={{paddingHorizontal: 3}}>
            <TouchableOpacity>
              <Image
                source={ImagesPath.icDashboard}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </View>
          <View style={{paddingHorizontal: 3}}>
            <TouchableOpacity>
              <Image
                source={ImagesPath.icList}
                style={{width: 22, height: 22}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <CardListProduk />
      </View>
    </Scaffold>
  );
};

export default MerchScreen;

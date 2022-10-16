import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, useWindowDimensions } from 'react-native'
import { useSelector } from 'react-redux';
import Config from 'react-native-config';
import { useColor, Header, Col } from '@src/components';
import Scaffold from '@src/components/Scaffold';
import Text from '@src/components/Text';
import { Divider, Row, Container } from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import ListContentProduct from 'src/components/Content/ListContentProduct';
import { useIsFocused } from '@react-navigation/native';
import ImagesPath from 'src/components/ImagesPath';
import Banner from 'src/components/Banner';
import Client from 'src/lib/apollo';
import { queryBannerList } from '@src/lib/query/banner';
import ListContentProductV2 from 'src/components/Content/ListContentProductV2';
import { useCurrentUser } from 'src/hooks/useCanGenerateContent';

//Fonts
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcons from 'react-native-vector-icons/Ionicons'
import SearchBar from 'src/components/SearchBar';
import ListContenEvent from 'src/components/Event/ListContenEvent';
import imageAssets from 'assets/images';
import ListFeaturedEvent from 'src/components/Event/ListFeaturedEvent';

const EventScreen = ({ navigation, route }) => {
  const { params } = route;
  const { title, userProfileId } = params;
  const isMainScreen = params && params.routeIndex;

  const user = useSelector(state => state['user.auth'].login.user);
  const { Color } = useColor();
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();

  console.log('params', params);

  return (
    <Scaffold
      header={
        <Header
          title={params && params.title ? params.title : 'EVENT'}
          centerTitle={false}
          actions={
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
              {/* <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('SavedEvent')}>
                <MaterialCommunityIcons
                  name="bookmark-multiple-outline"
                  color={Color.text}
                  size={18}
                />
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => navigation.navigate('EventHistory')}
              >
                <View style={{borderBottomWidth: 1, borderColor: Color.primary}}>
                  <Text size={17} type='medium'>My Order</Text>
                </View>
                {/* <Image
                    source={imageAssets.receipt}
                    style={{
                      height: 24,
                      width: 24,
                      resizeMode: 'contain',
                    }}
                /> */}

                {/* <View
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -1,
                    width: 8,
                    aspectRatio: 1,
                    borderRadius: 4,
                    backgroundColor: Color.error,
                  }}
                /> */}
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() =>
                  navigation.navigate('OnBoardEvent', {
                    title,
                    productType: Config.PRODUCT_TYPE,
                    productCategory: '',
                    productSubCategory: 'EVENT',
                  })
                }
              >
                <MaterialIcons
                  name="add"
                  color={Color.text}
                  size={22}
                />
              </TouchableOpacity> */}
            </View>
          }
        />
      }
    >
      <SearchBar
        type='select'
        onPress={() => navigation.navigate('SearchEvent')}
      />

      <Divider />

      <ListContenEvent
        productCategory='EVENT'
        name='Event'
        title='● ALL EVENT'
        // nav='EventScreen'
        // refresh={refreshing || isFocused}
        showHeader
        // showSeeAllText={false}
        style={{
          paddingBottom: height / 5,
        }}
        ListHeaderComponent={
          <>
            {/* <ListFeaturedEvent
              horizontal
              productCategory='EVENT'
              name='Event'
              title='Featured Event'
              showHeader
              style={{
                paddingHorizontal: 0,
              }}
            /> */}
            <ListContenEvent
              productCategory='EVENT'
              name='Event'
              title='● SECURE YOUR TICKET NOW'
              productType='highlight'
              showHeader
              horizontal
              showSeeAllText={false}
              style={{paddingHorizontal: 0}}
              headerLabelstyle={{paddingHorizontal: 8}}
            />

            <Divider />
          </>
        }
      />
    </Scaffold>
  );
};

export default EventScreen;
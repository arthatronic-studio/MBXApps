import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Image, TextInput, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import { useSelector } from 'react-redux';
import Config from 'react-native-config';
import { useColor, Header, Col } from '@src/components';
import Scaffold from '@src/components/Scaffold';
import { Divider, Row, Container } from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import ListContentProduct from 'src/components/Content/ListContentProduct';
import { useIsFocused } from '@react-navigation/native';
import ImagesPath from 'src/components/ImagesPath';
import Banner from 'src/components/Banner';
import Client from 'src/lib/apollo';
import { queryBannerList } from '@src/lib/query/banner';
import ListContentProductV2 from 'src/components/Content/ListContentProductV2';

//Fonts
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcons from 'react-native-vector-icons/Ionicons'
import SearchBar from 'src/components/SearchBar';
import ListContenEvent from 'src/components/Event/ListContenEvent';

const EventScreen = ({ navigation, route }) => {
  const { title, userProfileId } = route.params;
  const isMainScreen = route.params && route.params.routeIndex;

  const user = useSelector(state => state['user.auth'].login.user);
  const { Color } = useColor();
  const isFocused = useIsFocused();

  let canGeneratedContent = accessClient.UserGeneratedContent === 'ALL_USER';
  if (accessClient.UserGeneratedContent === 'ONLY_ADMIN' && user && user.isDirector === 1) canGeneratedContent = true;
  else if (accessClient.UserGeneratedContent === 'ONLY_MEMBER' && user && user.organizationId) canGeneratedContent = true;
  const { width, height } = useWindowDimensions();


  const [loadingBanner, setLoadingBanner] = useState(true);
  const [listBanner, setListBanner] = useState([]);

  const RenderHeader = () => {
    return (
      <>
        <View
          style={{
            position: 'absolute',
            backgroundColor: Color.primarySoft,
            width: '100%',
            height: height * 0.2,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        />
        <Divider />
        <Row>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ width: '12%', alignItems: 'center' }}>
            <AntDesign name={'arrowleft'} size={20} />
          </TouchableOpacity>
          <View style={{ width: '58%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Event</Text>
          </View>
          <View style={{ width: '30%', alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={{ marginRight: 10 }}
              onPress={() => navigation.navigate('SavedEvent')}>
              <MaterialCommunityIcons
                name="bookmark-multiple-outline"
                color={Color.text}
                size={18}
              />
              {/* <View style={{bottom: 15,backgroundColor: Color.error, width: 6, height: 6, borderRadius: 30, position: 'absolute', alignSelf: 'flex-end'}}/> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('History')}>
              <MaterialCommunityIcons
                name="history"
                color={Color.text}
                size={22}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('OnBoardEvent', {
                  title,
                  productType: Config.PRODUCT_TYPE,
                  productCategory: '',
                  productSubCategory: 'EVENT',
                })
              }
              style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: Color.primary, width: 40, height: 25, }}>
              <MaterialIcons
                name="add"
                color={Color.theme}
                size={16}
              />
            </TouchableOpacity>
          </View>
        </Row>
        <Divider height={25} />
      </>
    )
  }

  const SearchEvent = () => {
    return (
      <Pressable
        onPress={() => navigation.navigate('SearchEvent')}
        style={{
          paddingVertical: 8,
        }}
      >
        <TextInput
          editable={false}
          placeholder='Cari event . . .'
          placeholderTextColor={Color.placeholder}
          style={{
            paddingHorizontal: 10,
            fontSize: 12,
            backgroundColor: Color.theme,
            marginHorizontal: 15,
            height: 40,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Color.border
          }}
        />
        <IonIcons
          name='search'
          color={Color.border}
          size={18}
          onPress={() => navigation.navigate('')}
          style={{ position: 'absolute', alignSelf: 'flex-end', right: 25, top: 10 }}
        />
      </Pressable>
    )
  }

  const ListOption = () => {
    return (
      <>

        <Row style={{ paddingHorizontal: 20, justifyContent: 'center', backgroundColor: Color.theme, height: 100, marginHorizontal: 15, borderRadius: 8, elevation: 3 }}>
          <Pressable style={{ width: '25%', height: 60 }}
            onPress={() => navigation.navigate('EventOfficial')}>
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 3 }}>
              <Image source={ImagesPath.CircleWavyCheck} />
            </View>
            <Text style={{ lineHeight: 15, fontSize: 10, color: Color.secondary, width: '50%', textAlign: 'center', alignSelf: 'center' }}>Event{'\n'}Official</Text>
          </Pressable>
          <Pressable style={{ width: '25%', height: 60 }}
            onPress={() => navigation.navigate('CommunityEvent')}>
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 3 }}>
              <Image source={ImagesPath.UsersThree} />
            </View>
            <Text style={{ lineHeight: 15, fontSize: 10, color: Color.secondary, width: '80%', textAlign: 'center', alignSelf: 'center' }}>Event{'\n'}Komunitas</Text>
          </Pressable>
          <Pressable style={{ width: '25%', height: 60 }}
            onPress={() => navigation.navigate('MyEvent')}>
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 3 }}>
              <Image source={ImagesPath.Confetti} />
            </View>
            <Text style={{ lineHeight: 15, fontSize: 10, color: Color.secondary, width: '50%', textAlign: 'center', alignSelf: 'center' }}>Eventku</Text>
          </Pressable>
          <Pressable style={{ width: '25%', height: 60 }}
            onPress={() => navigation.navigate('DocumentasiEvent')}>
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 3 }}>
              <Image source={ImagesPath.ImageEvent} />
            </View>
            <Text style={{ lineHeight: 15, fontSize: 10, color: Color.secondary, width: '100%', textAlign: 'center', alignSelf: 'center' }}>Dokumentasi{'\n'}Event</Text>
          </Pressable>
        </Row>
      </>
    )
  }

  useEffect(
    () => {
      fetchBannerList();
    },
    []
  );

  const fetchBannerList = () => {
    const variables = {
      categoryId: 1,
    };

    Client.query({
      query: queryBannerList,
      variables,
    })
      .then(res => {
        console.log('res banner list', res);
        setListBanner(res.data.bannerList);
        setLoadingBanner(false);
      })
      .catch(err => {
        console.log(err, 'err banner list');
        setLoadingBanner(false);
      });
  };

  return (
    <Scaffold
      // header={
      //   <RenderHeader/>
      // }
      header={
        <Header
          title='Event'
          centerTitle={false}
          actions={
            <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row' }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('SavedEvent')}>
                <MaterialCommunityIcons
                  name="bookmark-multiple-outline"
                  color={Color.text}
                  size={18}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('History')}>
                <MaterialCommunityIcons
                  name="history"
                  color={Color.text}
                  size={22}
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
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
              </TouchableOpacity>
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
        title='Semua Event'
        // nav='EventScreen'
        // refresh={refreshing || isFocused}
        showHeader
        // showSeeAllText={false}
        style={{
          paddingBottom: height / 5,
        }}
        ListHeaderComponent={
          <>
            <ListContenEvent
              horizontal
              productCategory='EVENT'
              name='Event'
              title='Featured Event'
              showHeader
              style={{
                paddingHorizontal: 0,
              }}
            />

            {/* //     <ListOption />
            //     <Container paddingBottom={16}>
            //       <Banner
            //         data={listBanner}
            //         showHeader={false}
            //         loading={loadingBanner}
            //       />
            //     </Container> */}
          </>
        }
      />
    </Scaffold>
  );
};

const styles = StyleSheet.create({

})

export default EventScreen;
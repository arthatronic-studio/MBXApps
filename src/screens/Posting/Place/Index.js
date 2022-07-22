import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  useWindowDimensions,
  Animated,
  RefreshControl,
  Platform,
  FlatList,
  Linking,
  Pressable,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import BannerPlace from 'src/components/BannerPlace';
import Client from '@src/lib/apollo';
import {useColor, Header, Text} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import SearchBar from 'src/components/SearchBarPlace';
import ListContentProductV2 from 'src/components/Content/ListContentProductV2';
import ListContentProduct from 'src/components/Content/ListContentProduct';
import {accessClient} from 'src/utils/access_client';
import {queryBannerList} from '@src/lib/query/banner';
import {useIsFocused} from '@react-navigation/native';
import {Divider, Circle, Container, Line, Row} from '@src/styled';
import {
  iconBengkel,
  iconToko,
  iconKafe,
  iconResto,
  iconLainnya,
  iconAddPlace,
  iconStar,
} from 'assets/images/place';
import {TouchableOpacity} from 'react-native-gesture-handler';

const PlaceScreen = ({navigation, route}) => {
  const {title, userProfileId} = route.params;
  const isMainScreen = route.params && route.params.routeIndex;
  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [listBanner, setListBanner] = useState([]);
  const [listCategory, setListCategory] = useState([
    {
      id: 1,
      icon: iconBengkel,
    },
    {
      id: 2,
      icon: iconToko,
    },
    {
      id: 3,
      icon: iconKafe,
    },
    {
      id: 4,
      icon: iconResto,
    },
    {
      id: 5,
      icon: iconLainnya,
    }
  ])
  const [loadingBanner, setLoadingBanner] = useState(true);
  let canGeneratedContent = accessClient.UserGeneratedContent === 'ALL_USER';

  if (
    accessClient.UserGeneratedContent === 'ONLY_ADMIN' &&
    user &&
    user.isDirector === 1
  ) {
    canGeneratedContent = true;
  } else if (
    accessClient.UserGeneratedContent === 'ONLY_MEMBER' &&
    user &&
    user.organizationId
  ) {
    canGeneratedContent = true;
  }

  useEffect(() => {
    if (isFocused) {
      fetchBannerList();
    }
  }, [isFocused]);

  //get banner place
  const fetchBannerList = () => {
    const variables = {
      categoryId: 7,
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
      header={
        <Header
          title={title}
          centerTitle={false}
          showLeftButton={!isMainScreen}
          iconLeftButton={'arrow-left'}
          actions={
            <Row justify="center" align="center">
              <Ionicons
                onPress={() => navigation.navigate('Saved')}
                name={'md-bookmarks-outline'}
                size={18}
                style={{marginHorizontal: 12}}
              />
            </Row>
          }
        />
      }
      floatingActionButton={
        canGeneratedContent && (
          <Pressable
            onPress={() => !loadingMyRooms && modalListActionRef.current.open()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Color.primary,
              width: 60,
              height: 60,
              borderRadius: 30,
            }}>
            <Image
              source={iconAddPlace}
              style={{height: 35, width: 35}}
              resizeMode="contain"
            />
          </Pressable>
        )
      }>

      {isFocused && (
        <ScrollView>
          <Container paddingVertical={16}>
            <SearchBar
              type="select"
              style={{
                borderColor: Color.border,
                borderWidth: 1,
                borderRadius: 8,
                marginHorizontal: 16
              }}
              label="Cari Tempat apa hari ini...."
              onPress={() => {
                navigation.navigate('SearchArticle', {
                  productCategory: 'ARTIKEL',
                  name: 'Artikel',
                  title: 'Postingan Artikel',
                });
              }}
            />
            
            <Divider height={18}/>
            
            <View style={{ paddingHorizontal: 16 }}>
              <Text align="left" type="bold" size={17}>
                Rekomendasi Kami
              </Text>
            </View>

            <Divider height={8}/>
            
            <BannerPlace
              showHeader={false}
              data={listBanner}
              loading={loadingBanner}
            />

            <Divider height={18}/>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              {listCategory.map((item, index) => (
                <TouchableOpacity key={index}>
                  <Image
                    source={item.icon}
                    style={{height: 50, width: 50}}
                    resizeMode="contain"
                  />
              </TouchableOpacity>
              ))}
            </View>
            
            <Divider height={18}/>

            <View style={{paddingHorizontal: 16}}>
              <Text align="left" type="bold" size={17}>
                Tempat Terdekat
              </Text>
            </View>

            <Divider height={16}/>

            <ListContentProduct
              userProfileId={userProfileId}
              productCategory="NEARBY_PLACE"
              name="Tempat"
            />
            
          </Container>
        </ScrollView>

      )}
    </Scaffold>
  );
};

export default PlaceScreen;

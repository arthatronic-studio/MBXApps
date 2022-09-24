import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Image, TextInput, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'
import { useSelector } from 'react-redux';
import Config from 'react-native-config';
import { useColor, Header, Col } from '@src/components';
import Scaffold from '@src/components/Scaffold';
import { Divider, Row, Container, Column } from 'src/styled';
import Text from '@src/components/Text';
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
import ListContentEat from 'src/components/Eat/ListContentEat';
import ListFeaturedEat from 'src/components/Eat/ListFeaturedEat';

const EatScreen = ({ navigation, route }) => {
  const { title, userProfileId } = route.params;
  const isMainScreen = route.params && route.params.routeIndex;

  const auth = useSelector(state => state['auth']);
  const { Color } = useColor();
  const isFocused = useIsFocused();

  let canGeneratedContent = true;
  const { width, height } = useWindowDimensions();

  const [loadingBanner, setLoadingBanner] = useState(true);
  const [listBanner, setListBanner] = useState([]);

  const isCheckin = auth && auth.user && auth.user.isCheckin;

  useEffect(() => {
    fetchBannerList();
  }, []);

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
      header={
        <Header
          title='Eats'
          centerTitle={false}
          actions={
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EatHistory');
                }}
              >
                <Image
                  source={imageAssets.receipt}
                  style={{
                    height: 24,
                    width: 24,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>

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
            </View>
          }
        />
      }
    >
      {isCheckin &&
        <Container padding={16} paddingTop={8}>
          <Container padding={14} radius={16} borderWidth={0.5} borderColor={Color.textSoft}>
            <Row justify='space-between'>
              <Row>
                <Container paddingRight={16}>
                  <Image
                    source={imageAssets.building}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: Color.textSoft,
                    }}
                  />
                </Container>

                <Column>
                  <Text size={10} color={Color.placeholder} letterSpacing={0.4}>Lokasi saat ini</Text>
                  <Divider height={2} />
                  <Text size={12} type='medium' letterSpacing={0.5}>{auth.user && auth.user.activityInfo && auth.user.activityInfo.location ? auth.user.activityInfo.location.name : ''}</Text>
                </Column>
              </Row>
            </Row>
          </Container>
        </Container>
      }

      <SearchBar
        type='select'
        label='Cari tempat apa hari ini'
        onPress={() => navigation.navigate('SearchEvent')}
      />

      <Divider />

      <ListContentEat
        productCategory='EAT'
        name='Eat'
        title='Semua Tempat'
        // nav='EatScreen'
        // refresh={refreshing || isFocused}
        showHeader
        // showSeeAllText={false}
        style={{
          paddingBottom: height / 5,
        }}
        ListHeaderComponent={
          <>
            <ListFeaturedEat
              horizontal
              productCategory='EAT'
              name='Eat'
              title='Rekomendasi Kami'
              showHeader
              style={{
                paddingHorizontal: 0,
              }}
            />
          </>
        }
      />
    </Scaffold>
  );
};

const styles = StyleSheet.create({

})

export default EatScreen;
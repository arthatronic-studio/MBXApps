import React, {useEffect, useState} from 'react';
import {useColor, Text, Header, Row, useLoading, Col} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Divider, Container} from 'src/styled';
import {
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import imageAssets from 'assets/images';
import {useIsFocused} from '@react-navigation/native';
import Banner from 'src/components/Banner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {shadowStyle} from 'src/styles';

const GroupScreen = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const {width, height} = useWindowDimensions();
  const [loading, setLoading] = useState(false);

  const data = [
    {
      id: 1,
      image: imageAssets.mBlocSpace,
      name: 'M bloc Space',
      location: 'Jakarta Selatan',
      group: 'Bloc',
    },
    {
      id: 2,
      image: imageAssets.fabriekBloc,
      name: 'Fabriek Bloc',
      location: 'Padang',
      group: 'Bloc',
    },
    {
      id: 3,
      image: imageAssets.jnmBloc,
      name: 'JNM Bloc',
      location: 'Yogyakarta',
      group: 'Bloc',
    },
    {
      id: 4,
      image: imageAssets.posBlocJakarta,
      name: 'Pos BLoc Jakarta',
      location: 'Jakarta Pusat',
      group: 'Bloc',
    },
    {
      id: 5,
      image: imageAssets.posBlocMedan,
      name: 'Pos Bloc Medan',
      location: 'Medan',
      group: 'Bloc',
    },
    {
      id: 6,
      image: imageAssets.mBlocMarketJakarta,
      name: 'M Bloc Market',
      location: 'Jakarta Selatan',
      group: 'Market',
    },
    {
      id: 7,
      image: imageAssets.mBlocMarketJambi,
      name: 'M Bloc Market Jambi',
      location: 'Jambi',
      group: 'Market',
    },
    {
      id: 8,
      image: imageAssets.mBlocMarketPadang,
      name: 'M Bloc Market Padang',
      location: 'Padang',
      group: 'Market',
    },
    {
      id: 9,
      image: imageAssets.cangguBakehouse,
      name: 'Canggu Bakehouse',
      location: 'Sarinah, Pos Bloc Jakarta, Fabriek Bloc',
      group: 'RRK',
    },
    {
      id: 10,
      image: imageAssets.blocBar,
      name: 'Bloc Bar',
      location: 'M Bloc Space',
      group: 'RRK',
    },
    {
      id: 11,
      image: imageAssets.coldheart,
      name: 'Coldheart',
      location: 'JNM Bloc',
      group: 'RRK',
    },
    {
      id: 12,
      image: imageAssets.twalenSpirit,
      name: 'Twalen Spirit',
      location: 'Jakarta, Bali',
      group: 'RRK',
    },
    {
      id: 13,
      image: imageAssets.twalenWarong,
      name: 'Twalen Warong',
      location: 'M Bloc Space',
      group: 'RRK',
    },
    {
      id: 14,
      image: imageAssets.foya,
      name: 'Foya',
      location: 'M Bloc Space',
      group: 'RRK',
    },
  ];

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header centerTitle={false} title="Group" iconLeftButton="arrow-left" />
      }>
      <ScrollView>
        {loading ? (
          <Container
            style={{
              width: '100%',
              aspectRatio: 21 / 9,
              marginBottom: 16,
              marginRight: 16,
              backgroundColor: Color.textInput,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color={Color.primary} />
            <Divider />
            <Text>Memuat</Text>
          </Container>
        ) : (
          <Container>
            <Container>
              <Banner
                imageUrl={false}
                showHeader={false}
                data={[{id: 1, image: imageAssets.groupBanner}]}
                // loading={loadingBanner}
              />
            </Container>
            <Divider />
            <Container paddingHorizontal={16}>
              {data.map((item, index) => {
                return (
                  <Container marginVertical={8} radius={8} key={index} style={{ backgroundColor: Color.theme, ...shadowStyle }}>
                    <Image
                      style={{
                        width: '100%',
                        height: (width - 32) * 0.55,
                        resizeMode: 'cover',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                      source={item.image}
                    />
                    <Container
                      // borderWidth={1}
                      // style={{ ...shadowStyle }}
                      flex={1}
                      flexDirection="row"
                      paddingHorizontal={10}
                      paddingVertical={16}
                      borderBottomLeftRadius={8}
                      borderBottomRightRadius={8}>
                      <Container flex={1} flexDirection="column">
                        <Text align="left" size={16} type="medium">
                          {item.name}
                        </Text>
                        <Container flexDirection="row" align="center">
                          <Ionicons
                            name="ios-location-outline"
                            size={10}
                            color={Color.black}
                          />
                          <Divider width={8} />
                          <Text align="left" size={10} color={Color.black}>
                            {item.location}
                          </Text>
                        </Container>
                      </Container>
                    </Container>
                  </Container>
                );
              })}
            </Container>
            <Divider />
          </Container>
        )}
      </ScrollView>
    </Scaffold>
  );
};

export default GroupScreen;

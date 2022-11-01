import React, {useEffect, useState, useRef} from 'react';
import {useColor, Text, Header, Row, useLoading, Col} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Divider, Container, Line} from 'src/styled';
import {
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  FlatList,
  Linking,
  View,
} from 'react-native';
import imageAssets from 'assets/images';
import {useIsFocused} from '@react-navigation/native';
import Banner from 'src/components/Banner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {shadowStyle} from 'src/styles';
import {Modalize} from 'react-native-modalize';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Callout,
  Geojson,
} from 'react-native-maps';
import {IndonesiaMapJson} from 'src/utils/constants';
import {fetchGetGroups} from 'src/api-rest/fetchGetGroups';

const GroupScreen = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const modalRef = useRef();
  const mapRef = useRef();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const {width, height} = useWindowDimensions();
  const [loading, setLoading] = useState(false);

  const [categoryIndex, setCategoryIndex] = useState(0);
  const category = ['Semua', 'bloc group', 'm bloc Market', 'RRK'];
  const [selected, setSelected] = useState({});

  const [itemData, setItemData] = useState({
    data: [],
    loading: true,
    message: '',
    nextUrl: null,
    loadNext: false,
    refresh: false,
  });

  useEffect(() => {
    fetchData(true);
  }, []);

  useEffect(() => {
    if (itemData.loadNext && itemData.nextUrl != null) {
      fetchData(false);
    }
  }, [itemData.loadNext]);

  const fetchData = async first => {
    const param = itemData.nextUrl && !first ? itemData.nextUrl : `?perPage=10`;
    const result = await fetchGetGroups(param);

    console.log(result, 'sult');

    let newArr = [];

    if (result.status) {
      if (Array.isArray(result.data)) newArr = result.data;
    }

    setItemData({
      ...itemData,
      data: first ? newArr : itemData.data.concat(newArr),
      nextUrl: result.nextUrl ? `?${result.nextUrl.split('?')[1]}` : null,
      loading: false,
      loadNext: false,
      message: result.message,
      refresh: false,
    });

    onLoadingEnd(false);
  };

  console.log(itemData, 'dataaaaa');

  const data = [
    {
      id: 1,
      image: imageAssets.mBlocSpace,
      name: 'm bloc space',
      location: 'Jakarta Selatan',
      group: 'bloc group',
      link: 'https://instagram.com/mblocspace?igshid=YmMyMTA2M2Y=',
      latitude: '-6.2415137',
      longitude: '106.7965838',
    },
    {
      id: 2,
      image: imageAssets.fabriekBloc,
      name: 'fabriek bloc',
      location: 'Padang',
      group: 'bloc group',
      link: 'https://instagram.com/fabriekbloc?igshid=YmMyMTA2M2Y=',
      latitude: '-0.8798399',
      longitude: '100.3466491',
    },
    {
      id: 3,
      image: imageAssets.jnmBloc,
      name: 'JNM bloc',
      location: 'Yogyakarta',
      group: 'bloc group',
      link: 'https://instagram.com/jnmbloc?igshid=YmMyMTA2M2Y=',
      latitude: '-7.8004498',
      longitude: '110.3446039',
    },
    {
      id: 4,
      image: imageAssets.posBlocJakarta,
      name: 'pos bLoc Jakarta',
      location: 'Jakarta Pusat',
      group: 'bloc group',
      link: 'https://instagram.com/posblocjkt?igshid=YmMyMTA2M2Y=',
      latitude: '-6.1668677',
      longitude: '106.8249',
    },
    {
      id: 5,
      image: imageAssets.posBlocMedan,
      name: 'pos bloc Medan',
      location: 'Medan',
      group: 'bloc group',
      link: 'https://instagram.com/posblocmedan?igshid=YmMyMTA2M2Y=',
      latitude: '3.5917195',
      longitude: '98.668592',
    },
    {
      id: 6,
      image: imageAssets.mBlocMarketJakarta,
      name: 'm bloc market',
      location: 'Jakarta Selatan',
      group: 'm bloc Market',
      link: 'https://instagram.com/mblocmarket?igshid=YmMyMTA2M2Y=',
      latitude: '-6.2416679',
      longitude: '106.7902125',
    },
    {
      id: 7,
      image: imageAssets.mBlocMarketJambi,
      name: 'm bloc market Jambi',
      location: 'Jambi',
      group: 'm bloc Market',
      link: 'https://instagram.com/mblocmarket?igshid=YmMyMTA2M2Y=',
      latitude: '-1.6222292',
      longitude: '103.5214663',
    },
    {
      id: 8,
      image: imageAssets.mBlocMarketPadang,
      name: 'm bloc market Padang',
      location: 'Padang',
      group: 'm bloc Market',
      link: 'https://instagram.com/mblocmarketpadang?igshid=YmMyMTA2M2Y=',
    },
    {
      id: 9,
      image: imageAssets.cangguBakehouse,
      name: 'Canggu Bakehouse',
      location: 'Sarinah, Pos bloc Jakarta, Fabriek bloc',
      group: 'RRK',
      link: 'https://instagram.com/canggubakehouse.id?igshid=YmMyMTA2M2Y=',
    },
    {
      id: 10,
      image: imageAssets.blocBar,
      name: 'bloc Bar',
      location: 'M Bloc Space',
      group: 'RRK',
      link: 'https://instagram.com/bloc.bar?igshid=YmMyMTA2M2Y=',
    },
    {
      id: 11,
      image: imageAssets.coldheart,
      name: 'Coldheart',
      location: 'JNM bloc',
      group: 'RRK',
      link: 'https://instagram.com/coldheartbec?igshid=YmMyMTA2M2Y=',
    },
    {
      id: 12,
      image: imageAssets.twalenSpirit,
      name: 'Twalen Spirit',
      location: 'Jakarta, Bali',
      group: 'RRK',
      link: 'https://www.instagram.com/twalenspirit',
    },
    {
      id: 13,
      image: imageAssets.twalenWarong,
      name: 'Twalen Warong',
      location: 'm bloc Space',
      group: 'RRK',
      link: 'https://instagram.com/twalenwarong?igshid=NDc0ODY0MjQ=',
    },
    {
      id: 14,
      image: imageAssets.foya,
      name: 'Foya',
      location: 'm bloc Space',
      group: 'RRK',
      link: 'https://instagram.com/foya.jkt?igshid=NDc0ODY0MjQ=',
    },
  ];

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header centerTitle={false} title="Group" iconLeftButton="arrow-left" />
      }>
      {/* <ScrollView> */}
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
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={itemData.data}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            let orderNumber = (index + 1).toString();
            if (orderNumber.length <= 1) orderNumber = '0' + orderNumber;
            return (
              <Container flex={1} flexDirection="row" paddingHorizontal={16}>
                <Container flex={1}>
                  {index == 0 && (
                    <Text size={9} type="semibold" align="left">
                      {'● ECOSYSTEM'.toUpperCase()}
                    </Text>
                  )}
                </Container>
                <Container flex={3}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelected(item);
                      modalRef.current.open();
                    }}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      paddingEnd: 16,
                      borderColor: Color.primary,
                    }}>
                    <Container
                      style={{
                        flex: 1,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                      <Text size={11} type="medium" color={Color.primary}>
                        {orderNumber}
                      </Text>
                    </Container>
                    <Container
                      style={{
                        flex: 7,
                        alignItems: 'flex-start',
                        paddingRight: 8,
                      }}>
                      <Text
                        size={18}
                        type="medium"
                        align="left"
                        numberOfLines={2}>
                        {item.name}
                      </Text>
                    </Container>
                    <Container style={{justifyContent: 'center'}}>
                      <Text
                        size={11}
                        type="medium"
                        color={Color.primary}
                        underline>
                        View
                      </Text>
                      <Container
                        style={{
                          borderBottomWidth: 1,
                          borderColor: Color.primary,
                        }}
                      />
                    </Container>
                  </TouchableOpacity>
                </Container>
              </Container>
            );
          }}
          keyExtractor={(item, index) => item.id + index.toString()}
          onEndReachedThreshold={0.3}
          onEndReached={() => setItemData({...itemData, loadNext: true})}
          ItemSeparatorComponent={() => (
            <Container flexDirection="row" paddingHorizontal={16}>
              <Container flex={1} />
              <Container
                marginVertical={10}
                flex={3}
                borderWidth={0.25}
                color={'#141414'}
              />
            </Container>
          )}
          ListHeaderComponent={
            <Container>
              <MapView
                ref={mapRef}
                onMapReady={() => mapRef.current.fitToElements(true)}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{height: width * 0.49, width: width}}
                zoomEnabled
                region={{
                  latitude: parseFloat('-2.3923927'),
                  longitude: parseFloat('116.2305105'),
                  latitudeDelta: 20,
                  longitudeDelta: 20,
                }}
                customMapStyle={[
                  {elementType: 'geometry', stylers: [{color: '#D9D9D9'}]},
                ]}>
                <Geojson
                  geojson={IndonesiaMapJson}
                  strokeColor="#EEEEEE"
                  fillColor="#EEEEEE"
                  strokeWidth={2}
                />

                {itemData.data.map((item, index) => {
                  if (typeof item.axis === 'number' && typeof item.yaxis === 'number') {
                    return (
                      <Marker
                        key={index}
                        coordinate={{
                          latitude: parseFloat(item.axis),
                          longitude: parseFloat(item.yaxis),
                        }}>
                        <Container
                          backgroundColor="#FCD100"
                          height={12}
                          width={12}
                          borderRadius={6}
                          borderWidth={1}
                          borderColor="#141414"
                        />
                        <Callout>
                          <View style={{width: 75}}>
                            <Text>{item.name}</Text>
                          </View>
                        </Callout>
                      </Marker>
                    );
                  }
                  
                  return <View />
                })}
              </MapView>
              <Divider height={32} />
              <Container
                flex={1}
                flexDirection="row"
                paddingBottom={10}
                paddingHorizontal={16}>
                <Container flex={1} />
                <Container flex={3} borderWidth={0.25} color={'#141414'} />
              </Container>
            </Container>
          }
          ListFooterComponent={
            <Container
              paddingTop={10}
              flexDirection="row"
              paddingHorizontal={16}>
              <Container flex={1} />
              <Container flex={3} borderWidth={0.25} color={'#141414'} />
            </Container>
          }
        />
      )}
      <Modalize
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
        }}
        ref={modalRef}
        // withHandle={false}
        handleStyle={{
          marginTop: 18,
          backgroundColor: '#E2E1DF',
          width: '50%',
        }}
        adjustToContentHeight
        disableScrollIfPossible={false}
        childrenStyle={{
          backgroundColor: Color.theme,
          alignItems: 'flex-start',
          paddingBottom: 16,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          paddingTop: 24,
          width: width - 32,
        }}
        modalStyle={{
          backgroundColor: Color.theme,
          paddingHorizontal: 16,
        }}
        onClose={() => {
          setSelected({});
        }}>
        <Container>
          {Array.isArray(selected?.galleries_all) &&  selected?.galleries_all[0]?.image && 
            <Image
              style={{
                width: width - 32,
                height: (width - 32) * 0.55,
                resizeMode: 'cover',
                // borderRadius: 8,
              }}
              source={{ uri: selected?.galleries_all[0]?.image}}
            />
          }
          <Divider height={10} />
          <Text size={16} type="medium" color={Color.black} align="left">
            {selected.name}
          </Text>
          <Divider height={4} />
          <Text size={10} color={Color.textSoft} align="left">
            {/* {selected.name} {'\u2022'} Restoran {'\u2022'} {selected.group} */}
            {selected.name} {'\u2022'} {selected.group}
          </Text>
          <Divider height={10} />
          <Container flex={1}>
            {/* <Text align="left" color={Color.black}>
              Cupcake ipsum dolor sit amet marshmallow ice cream muffin
              liquorice. Wafer candy jujubes lollipop cake apple pie oat cake
              chocolate bar pudding. Powder dragée cheesecake danish apple pie
              sweet jujubes macaroon toffee.
            </Text>
            <Divider />
            <Text align="left" color={Color.black}>
              Toffee sweet donut lemon drops cheesecake cotton candy bonbon
              gummies. Pie sweet wafer candy canes sugar plum. Candy canes
              marshmallow biscuit sweet donut.
            </Text>
            <Divider height={10} /> */}

            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`${selected.link}`);
              }}
              style={{
                flex: 1,
                borderWidth: 1,
                padding: 10,
                // borderRadius: 8,
                borderColor: '#ACAAA5',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={imageAssets.instagram} />
              <Divider width={14} />
              <Text size={14} color={Color.primaryDark} type="medium">
                Instagram
              </Text>
            </TouchableOpacity>
          </Container>
        </Container>
      </Modalize>
    </Scaffold>
  );
};

export default GroupScreen;

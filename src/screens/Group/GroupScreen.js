import React, {useEffect, useState, useRef} from 'react';
import {
  useColor,
  Text,
  Header,
  Row,
  useLoading,
  Col,
  ScreenEmptyData,
} from '@src/components';
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
import {useSelector} from 'react-redux';

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
  const auth = useSelector(state => state['auth']);

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

  const [itemDataCollaborator, setItemDataCollaborator] = useState({
    data: [],
    loading: true,
    message: '',
    nextUrl: null,
    loadNext: false,
    refresh: false,
  });

  useEffect(() => {
    fetchData(true);
    fetchDataCollaborator(true);
  }, []);

  useEffect(() => {
    if (itemData.loadNext && itemData.nextUrl != null) {
      fetchData(false);
    }
  }, [itemData.loadNext]);

  useEffect(() => {
    if (itemDataCollaborator.loadNext && itemDataCollaborator.nextUrl != null) {
      fetchDataCollaborator(false);
    }
  }, [itemDataCollaborator.loadNext]);

  const fetchData = async first => {
    const param = itemData.nextUrl && !first ? itemData.nextUrl : `?perPage=20`;
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
  };

  const fetchDataCollaborator = async first => {
    const param =
      itemDataCollaborator.nextUrl && !first
        ? itemDataCollaborator.nextUrl
        : `?perPage=20&category=x_collaborator`;
    const result = await fetchGetGroups(param);

    console.log(result, 'sult', param);

    let newArr = [];

    if (result.status) {
      if (Array.isArray(result.data)) newArr = result.data;
    }

    setItemDataCollaborator({
      ...itemDataCollaborator,
      data: first ? newArr : itemDataCollaborator.data.concat(newArr),
      nextUrl: result.nextUrl ? `?${result.nextUrl.split('?')[1]}` : null,
      loading: false,
      loadNext: false,
      message: result.message,
      refresh: false,
    });
  };

  console.log(itemData, 'dataaaaa');
  console.log(itemDataCollaborator, 'dataaaaa');

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
          contentContainerStyle={{
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            let orderNumber = (index + 1).toString();
            if (orderNumber.length <= 1) orderNumber = '0' + orderNumber;
            return (
              <Container flex={1} flexDirection="row" paddingHorizontal={16}>
                <Container flex={2}>
                  {(index == 0 ||
                    item.category != itemData.data[index - 1].category) && (
                    <Text size={10} type="semibold" align="left">
                      ● {item.category}
                    </Text>
                  )}
                </Container>
                <Container flex={4.5}>
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
              <Container flex={2} />
              <Container
                marginVertical={10}
                flex={4.5}
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
                  if (item.axis && item.yaxis) {
                    return (
                      <Marker
                        key={index}
                        coordinate={{
                          latitude: parseFloat(item.yaxis),
                          longitude: parseFloat(item.axis),
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

                  return <View />;
                })}
              </MapView>
              <Divider height={32} />
              <Container
                flex={1}
                flexDirection="row"
                paddingBottom={10}
                paddingHorizontal={16}>
                <Container flex={2} />
                <Container flex={4.5} borderWidth={0.25} color={'#141414'} />
              </Container>
            </Container>
          }
          ListFooterComponent={
            <Container>
              <Container
                paddingTop={10}
                flexDirection="row"
                paddingHorizontal={16}>
                <Container flex={2} />
                <Container flex={4.5} borderWidth={0.25} color={'#141414'} />
              </Container>
              <Divider height={32} />
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={itemDataCollaborator.data}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  let orderNumber = (index + 1).toString();
                  if (orderNumber.length <= 1) orderNumber = '0' + orderNumber;
                  return (
                    <Container
                      flex={1}
                      flexDirection="row"
                      paddingHorizontal={16}>
                      <Container flex={2}>
                        {index == 0 && (
                          <Text size={10} type="semibold" align="left">
                            <Image
                              style={{
                                height: 16,
                                width: 16,
                              }}
                              source={{
                                uri: auth?.user?.activityInfo['x-colaborator']
                                  ?.icon,
                              }}
                            />{' '}
                            Collaborator
                          </Text>
                        )}
                      </Container>
                      <Container flex={4.5}>
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
                onEndReached={() =>
                  setItemDataCollaborator({
                    ...itemDataCollaborator,
                    loadNext: true,
                  })
                }
                ListHeaderComponent={
                  <Container
                    flex={1}
                    flexDirection="row"
                    paddingBottom={10}
                    paddingHorizontal={16}>
                    {itemDataCollaborator.data.length > 0 ? (
                      <>
                        <Container flex={2} />
                        <Container
                          flex={4.5}
                          borderWidth={0.25}
                          color={'#141414'}
                        />
                      </>
                    ) : (
                      <Text size={10} type="semibold" align="left">
                        <Image
                          style={{
                            height: 16,
                            width: 16,
                          }}
                          source={{
                            uri: auth?.user?.activityInfo['x-colaborator']
                              ?.icon,
                          }}
                        />{' '}
                        Collaborator
                      </Text>
                    )}
                  </Container>
                }
                ListFooterComponent={
                  <Container
                    paddingTop={10}
                    flex={1}
                    flexDirection="row"
                    paddingHorizontal={16}>
                    <Container flex={2} />
                    {itemDataCollaborator.data.length > 0 && (
                      <Container
                        flex={4.5}
                        borderWidth={0.25}
                        color={'#141414'}
                      />
                    )}
                  </Container>
                }
                ItemSeparatorComponent={() => (
                  <Container flexDirection="row" paddingHorizontal={16}>
                    <Container flex={2} />
                    <Container
                      marginVertical={10}
                      flex={4.5}
                      borderWidth={0.25}
                      color={'#141414'}
                    />
                  </Container>
                )}
                ListEmptyComponent={() => {
                  return (
                    <>
                      <ScreenEmptyData
                        message={`group belum tersedia`}
                        style={{width: width - 16}}
                      />
                    </>
                  );
                }}
              />
            </Container>
          }
        />
      )}
      <Modalize
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
        }}
        ref={modalRef}
        withHandle={false}
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
          // borderTopLeftRadius: 12,
          // borderTopRightRadius: 12,
          paddingTop: 24,
          width: width - 32,
        }}
        modalStyle={{
          backgroundColor: Color.theme,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingHorizontal: 16,
        }}
        onClose={() => {
          setSelected({});
        }}>
        <Container>
          <Container flex={1} align="flex-end">
            <TouchableOpacity
              onPress={() => modalRef.current.close()}
              style={{
                width: 24,
                height: 24,
              }}>
              <Image
                source={imageAssets.iconApp}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              />
            </TouchableOpacity>
          </Container>
          <Divider height={16} />
          {Array.isArray(selected?.images) && selected?.images[0] && (
            <Image
              style={{
                width: width - 32,
                height: (width - 32) * 0.55,
                resizeMode: 'cover',
                borderWidth: 1,
                borderColor: Color.black,
              }}
              source={{uri: selected?.images[0]}}
            />
          )}
          <Divider height={10} />
          <Text
            size={18}
            lineHeight={21.6}
            type="medium"
            color="#121212"
            align="left">
            {selected.name}
          </Text>
          <Divider height={4} />
          <Text size={12} lineHeight={12} color={Color.gray} align="left">
            {selected.name} {'\u2022'} {selected.category}
          </Text>
          <Divider height={10} />
          <Container flex={1}>
            {selected.description && selected.description != '' && (
              <>
                <Text
                  align="left"
                  color={Color.black}
                  size={14}
                  lineHeight={22.4}>
                  {selected.description}
                </Text>
                <Divider height={10} />
              </>
            )}

            {selected.ig && selected.ig != '' && (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`${selected.ig}`);
                }}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  padding: 10,
                  // borderRadius: 8,
                  borderColor: Color.primarySoft,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={imageAssets.instagram} />
                <Divider width={14} />
                <Text size={14} color={Color.primarySoft} type="medium">
                  Instagram
                </Text>
              </TouchableOpacity>
            )}
          </Container>
        </Container>
      </Modalize>
    </Scaffold>
  );
};

export default GroupScreen;

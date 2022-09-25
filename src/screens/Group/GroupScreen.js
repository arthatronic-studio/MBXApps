import React, {useEffect, useState, useRef} from 'react';
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
  FlatList,
  Linking,
} from 'react-native';
import imageAssets from 'assets/images';
import {useIsFocused} from '@react-navigation/native';
import Banner from 'src/components/Banner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {shadowStyle} from 'src/styles';
import {Modalize} from 'react-native-modalize';

const GroupScreen = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const modalRef = useRef();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const {width, height} = useWindowDimensions();
  const [loading, setLoading] = useState(false);

  const [categoryIndex, setCategoryIndex] = useState(0);
  const category = ['Semua', 'bloc group', 'm bloc Market', 'RRK'];
  const [selected, setSelected] = useState({});

  const data = [
    {
      id: 1,
      image: imageAssets.mBlocSpace,
      name: 'm bloc Space',
      location: 'Jakarta Selatan',
      group: 'bloc group',
      link: "https://instagram.com/mblocspace?igshid=YmMyMTA2M2Y="
    },
    {
      id: 2,
      image: imageAssets.fabriekBloc,
      name: 'Fabriek bloc',
      location: 'Padang',
      group: 'bloc group',
      link: 'https://instagram.com/fabriekbloc?igshid=YmMyMTA2M2Y=',
    },
    {
      id: 3,
      image: imageAssets.jnmBloc,
      name: 'JNM bloc',
      location: 'Yogyakarta',
      group: 'bloc group',
      link: 'https://instagram.com/jnmbloc?igshid=YmMyMTA2M2Y=',
    },
    {
      id: 4,
      image: imageAssets.posBlocJakarta,
      name: 'Pos bLoc Jakarta',
      location: 'Jakarta Pusat',
      group: 'bloc group',
      link: 'https://instagram.com/posblocjkt?igshid=YmMyMTA2M2Y=',
    },
    {
      id: 5,
      image: imageAssets.posBlocMedan,
      name: 'Pos bloc Medan',
      location: 'Medan',
      group: 'bloc group',
      link: 'https://instagram.com/posblocmedan?igshid=YmMyMTA2M2Y=',
    },
    {
      id: 6,
      image: imageAssets.mBlocMarketJakarta,
      name: 'M bloc Market',
      location: 'Jakarta Selatan',
      group: 'm bloc Market',
      link: 'https://instagram.com/mblocmarket?igshid=YmMyMTA2M2Y=',
    },
    {
      id: 7,
      image: imageAssets.mBlocMarketJambi,
      name: 'M bloc Market Jambi',
      location: 'Jambi',
      group: 'm bloc Market',
      link: 'https://instagram.com/mblocmarket?igshid=YmMyMTA2M2Y=',
    },
    {
      id: 8,
      image: imageAssets.mBlocMarketPadang,
      name: 'M bloc Market Padang',
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
            <FlatList
              keyExtractor={(item, index) => item.toString() + index}
              data={category}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                alignItems: 'center',
              }}
              ItemSeparatorComponent={() => <Divider width={10} />}
              renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => setCategoryIndex(index)}>
                  <Container
                    style={{
                      padding: 12,
                      borderWidth: 1,
                      borderRadius: 120,
                      borderColor: Color.textSoft,
                      backgroundColor:
                        index === categoryIndex ? Color.primary : 'transparent',
                    }}>
                    <Text size={12} type="medium" color={Color.text}>
                      {item}
                    </Text>
                  </Container>
                </TouchableOpacity>
              )}
            />
            <Divider />
            <Container paddingHorizontal={16}>
              {data.map((item, index) => {
                if (categoryIndex > 0) {
                  if (item.group !== category[categoryIndex]) {
                    return <></>;
                  }
                }
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelected(item);
                      modalRef.current.open();
                    }
                    }
                    key={index}
                    style={{
                      backgroundColor: Color.theme,
                      ...shadowStyle,
                      marginVertical: 8,
                      borderRadius: 8,
                    }}>
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
                      flex={1}
                      flexDirection="row"
                      paddingHorizontal={10}
                      paddingVertical={16}>
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
                  </TouchableOpacity>
                );
              })}
            </Container>
            <Divider />
          </Container>
        )}
      </ScrollView>
      <Modalize
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
        }}
        ref={modalRef}
        // withHandle={false}
        handleStyle={{ 
          marginTop: 18,
          backgroundColor: "#E2E1DF",
          width: "50%"
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
          <Image
            style={{
              width: width - 32,
              height: (width - 32) * 0.55,
              resizeMode: 'cover',
              borderRadius: 8,
            }}
            source={selected.image}
          />
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
            <Text align="left" color={Color.black}>
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
            <Divider height={10} />

            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`${selected.link}`);
              }}
              style={{
                flex: 1,
                borderWidth: 1,
                padding: 10,
                borderRadius: 8,
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

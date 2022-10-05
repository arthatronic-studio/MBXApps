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
  Platform,
} from 'react-native';
import ImagesPath from 'src/components/ImagesPath';
import imageAssets from 'assets/images';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getAPI, postAPI} from 'src/api-rest/httpService';
import {Modalize} from 'react-native-modalize';
import HighlightFest from 'src/components/Fest/HighlightFest';
import CardFestVenues from 'src/components/Fest/CardFestVenues';
import {fetchFestMenu} from 'src/api-rest/fest/fetchFestMenu';

const FestScreenV2 = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState({});
  const modalRef = useRef();
  const {width} = useWindowDimensions();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const result = await fetchFestMenu();
    if (result.status) {
      setMenu(result.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  return (
    <Scaffold
      loadingProps={loadingProps}
      translucent={Platform.OS === 'ios'}
      useSafeArea={Platform.OS === 'android'}
      statusBarColor="#00925F"
      header={
        <Header
          backgroundColor={'#00925F'}
          centerTitle={false}
          color={Color.theme}
          iconLeftButton="arrow-left"
          actions={
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AboutFestV2');
              }}>
              <AntDesign name="questioncircleo" size={16} color={Color.theme} />
            </TouchableOpacity>
          }
        />
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
            <Container
              backgroundColor={'#00925F'}
              flex={1}
              paddingTop={32}
              paddingBottom={16}
              align="center">
              <Image source={imageAssets.festIcon2} resizeMode="contain" />
            </Container>

            <Divider height={10} />

            <Container
              paddingHorizontal={16}
              flex={1}
              flexDirection="row"
              justify="space-between">
              {menu.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{width: width * 0.28, height: width * 0.28 * 1.28}}
                    onPress={() =>
                      navigation.navigate(item.name, {item: item})
                    }>
                    <Image
                      source={{uri: item.file}}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </Container>

            <Divider />

            <HighlightFest
              productCategory="LINEUP"
              nav="ShowAllLineup"
              name="Todays Line-up"
              title="Todays Line-up"
              wrap={false}
              horizontal={true}
              onPress={value => {
                setSelected(value);
                modalRef.current.open();
              }}
            />

            <HighlightFest
              productCategory="EVENT"
              nav="FestEventScreen"
              name="Event Berlansung"
              title="Event Berlansung"
              maxData={2}
              onPress={() => navigation.navigate('FestMusicScreen')}
            />

            <HighlightFest
              productCategory="VENUES"
              nav="VenuesScreen"
              name="Venues"
              title="Venues"
              maxData={2}
            />

            <Container paddingHorizontal={16}>
              <Image
                style={{width: '100%'}}
                source={imageAssets.bannerMfest2}
                resizeMode="contain"
              />
            </Container>

            <HighlightFest
              productCategory="AREA"
              nav="ShowAllArea"
              name="Experience Area"
              title="Experience Area"
              horizontal={true}
            />
          </Container>
        )}
      </ScrollView>

      <Modalize
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
        }}
        ref={modalRef}
        withHandle={false}
        adjustToContentHeight
        disableScrollIfPossible={false}
        childrenStyle={{
          backgroundColor: Color.theme,
          alignItems: 'flex-start',
          paddingVertical: 16,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
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
              height: width - 32,
              resizeMode: 'cover',
              borderRadius: 8,
            }}
            source={{uri: selected.file}}
          />
          <Divider height={10} />
          <Text size={22} color={Color.black} lineHeight={27} align="left">
            {selected.name}
          </Text>
          <Divider height={10} />
          <Container flex={1} flexDirection="row" align="center">
            <Image
              source={imageAssets.calendar}
              style={{width: 16, height: 16}}
            />
            <Divider width={8} />
            <Text size={10} lineHeight={12} color={Color.black}>
              {selected.date ? selected.date : '-'}
            </Text>
            <Divider width={10} />
            <Image source={imageAssets.clock} style={{width: 16, height: 16}} />
            <Divider width={8} />
            <Text size={10} lineHeight={12} color={Color.black}>
              {selected.time}
            </Text>
            <Divider width={10} />
            <Image
              source={imageAssets.location}
              style={{width: 16, height: 16}}
            />
            <Divider width={8} />
            <Text size={10} lineHeight={12} color={Color.black}>
              Live House
            </Text>
          </Container>
          <Divider height={10} />
          <TouchableOpacity
            onPress={() => {
              modalRef.current.close();
            }}
            style={{
              flex: 1,
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              borderColor: '#ACAAA5',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text size={14} color={Color.primaryDark} type="medium">
              Tutup
            </Text>
          </TouchableOpacity>
        </Container>
      </Modalize>
    </Scaffold>
  );
};

export default FestScreenV2;

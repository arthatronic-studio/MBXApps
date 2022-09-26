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
  FlatList,
  useWindowDimensions,
} from 'react-native';
import ImagesPath from 'src/components/ImagesPath';
import imageAssets from 'assets/images';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import WidgetFestMenuStatic from './WidgetFestMenuStatic';
import HighlightFestMusic from 'src/components/Fest/HighlightFestMusic';
import HighlightFestArts from 'src/components/Fest/HighlightFestArts';
import HighlightFestLiterature from 'src/components/Fest/HighlightFestLiterature';
import {getAPI, postAPI} from 'src/api-rest/httpService';
import CardFestLineup from 'src/components/Fest/CardFestLineup';
import {Modalize} from 'react-native-modalize';
import HighlightFest from 'src/components/Fest/HighlightFest';

const FestScreenV2 = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState({});
  const modalRef = useRef();
  const {width} = useWindowDimensions();

  const [menu, setMenu] = useState([
    {
      id: 1,
      nav: 'ArtsScreen',
      param: {},
      image: imageAssets.festMusicMenu,
      show: true,
    },
    {
      id: 2,
      nav: 'MusicScreen',
      param: {},
      image: imageAssets.festArtsMenu,
      show: true,
    },
    {
      id: 3,
      nav: 'LiteratureScreen',
      param: {},
      image: imageAssets.festLiteratureMenu,
      show: true,
    },
  ]);
  const [selectedCompany, setSelectedCompany] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    // const result = await postAPI('festival/home');
    // console.log('result festival', result);
    const body = {
      menu_id: 1,
    };
    const result = await postAPI('festival/find', body);
    console.log('result festival find', result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header
          backgroundColor={'#00925F'}
          centerTitle={false}
          color={Color.theme}
          iconLeftButton="arrow-left"
          actions={
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AboutFest');
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
                    onPress={() => navigation.navigate(item.nav)}>
                    <Image source={item.image} />
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
              onPress={(value) => {
                setSelected(value);
                modalRef.current.open()
              }}
            />

            <Container paddingHorizontal={16}>
              <Image
                style={{width: '100%'}}
                source={imageAssets.bannerMfest}
                resizeMode="contain"
              />
            </Container>
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
            source={selected.image}
          />
          <Divider height={10} />
          <Text size={22} color={Color.black} lineHeight={27} align="left">
            DJ Raggil Suliza
          </Text>
          <Divider height={10} />
          <Container flex={1} flexDirection="row" align="center">
            <Image
              source={imageAssets.calendar}
              style={{width: 16, height: 16}}
            />
            <Divider width={8} />
            <Text size={10} lineHeight={12} color={Color.black}>
              25 Sep 2022
            </Text>
            <Divider width={10} />
            <Image source={imageAssets.clock} style={{width: 16, height: 16}} />
            <Divider width={8} />
            <Text size={10} lineHeight={12} color={Color.black}>
              14:00 - 14:45
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

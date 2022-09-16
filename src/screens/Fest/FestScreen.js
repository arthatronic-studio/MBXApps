import React, {useEffect, useState} from 'react';
import {useColor, Text, Header, Row, useLoading, Col} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Divider, Container} from 'src/styled';
import {TouchableOpacity, Image, ActivityIndicator} from 'react-native';
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

const FestScreen = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);

  const [company, setCompany] = useState([]);
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
          backgroundColor={Color.black}
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
              backgroundColor={Color.black}
              height={160}
              flex={1}
              flexDirection="column"
              justify="flex-end"
              align="center"
              paddingBottom={68}>
              <Image source={ImagesPath.FestIcon} resizeMode="contain" />
            </Container>
            <Container style={{bottom: 50, flex: 1}}>
              <WidgetFestMenuStatic />
            </Container>
            <HighlightFestMusic
              productCategory="FEST_MUSIC"
              name="Musik"
              title="Musik Terbaru"
              nav="EventScreen"
              refresh={refreshing || isFocused}
              showSeeAllText={true}
            />
            <Container paddingHorizontal={16}>
              <Image
                style={{width: '100%'}}
                source={imageAssets.bannerMfest}
                resizeMode="contain"
              />
            </Container>
            <HighlightFestLiterature
              productCategory="FEST_LITERATURE"
              name="Literatur"
              title="Literatur Terbaru"
              nav="EventScreen"
              horizontal
              refresh={refreshing || isFocused}
              showSeeAllText={true}
            />
            <HighlightFestArts
              productCategory="FEST_ARTS"
              name="Seni & Desain"
              title="Seni & Desain Terbaru"
              nav="EventScreen"
              horizontal
              refresh={refreshing || isFocused}
              showSeeAllText={true}
            />
          </Container>
        )}
      </ScrollView>
    </Scaffold>
  );
};

export default FestScreen;

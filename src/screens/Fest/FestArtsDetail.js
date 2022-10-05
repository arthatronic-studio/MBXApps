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
  ImageBackground,
  Platform,
  UIManager,
} from 'react-native';
import ImagesPath from 'src/components/ImagesPath';
import imageAssets from 'assets/images';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getAPI, postAPI} from 'src/api-rest/httpService';
import {Modalize} from 'react-native-modalize';
import HighlightFest from 'src/components/Fest/HighlightFest';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardSchedule from 'src/components/Fest/CardSchedule';
import {fetchFestDetail} from 'src/api-rest/fest/fetchFestDetail';
import {fetchFestGalleries} from 'src/api-rest/fest/fetchFestGalleries';
import {fetchFestEventSchedule} from 'src/api-rest/fest/fetchFestEventSchedule';

const FestArtsDetail = ({navigation, route}) => {
  const {item} = route.params;
  console.log(item, 'eeem');
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState({});
  const modalRef = useRef();
  const {width} = useWindowDimensions();
  const [data, setData] = useState({});
  const [gallery, setGallery] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    const body = {
      event_id: item.event_id,
    };
    const result = await fetchFestGalleries(body);
    if (result.status) {
      const data = result.data;
      setGallery(data);
    }
  };

  const fetchSchedule = async () => {
    const body = {
      event_id: item.event_id,
    };
    const result = await fetchFestEventSchedule(body);
    if (result.status) {
      setSchedule(result.data);
    }
  };

  const fetchItem = async () => {
    const body = {
      event_id: item.event_id,
    };
    const result = await fetchFestDetail(body);
    if (result.status) {
      setData(result.data);
    }
  };

  const fetchData = async () => {
    await fetchItem();
    await fetchGallery();
    await fetchSchedule();
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(schedule, 'lery');

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={<Header centerTitle={false} iconLeftButton="arrow-left" />}>
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
            <Container width={width} height={width}>
              <Image
                source={{uri: data.file}}
                resizeMode="cover"
                style={{width: '100%', height: '100%'}}
              />
            </Container>
            <Container paddingTop={16}>
              <Container paddingHorizontal={16}>
                <Text
                  size={16}
                  lineHeight={20}
                  type="medium"
                  color={Color.black}
                  align="left">
                  {data.nama}
                </Text>
                <Divider height={8} />
                <Text size={10} lineHeight={12} color={'#3A3936'} align="left">
                  {/* {data.time} {'\u2022'} {item.location} */}
                  {data.time}
                </Text>
                <Divider height={16} />
                <Text
                  size={14}
                  lineHeight={22}
                  color={Color.black}
                  align="left">
                  {data.description}
                </Text>
              </Container>
              <Divider height={16} />
              {gallery.length > 0 && (
                <Container
                  flex={1}
                  flexDirection="row"
                  // justify="space-between"
                  paddingHorizontal={16}>
                  {gallery.map((gal, index) => {
                    if (index > 2) return <></>;
                    if (index < 2 || gallery.length <= 3) {
                      return (
                        <Image
                          key={index}
                          source={{uri: gal.image}}
                          style={{width: '32%', aspectRatio: 1, marginRight: '2%'}}
                        />
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('FestGallery', {
                              item: data,
                            })
                          }
                          style={{width: '32%'}}>
                          <ImageBackground
                            key={index}
                            source={{uri: gal.image}}
                            imageStyle={{
                              width: '100%',
                              aspectRatio: 1,
                              opacity: 0.4,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            }}>
                            <Text size={36} lineHeight={45} color={Color.white}>
                              +{gallery.length - 2}
                            </Text>
                          </ImageBackground>
                        </TouchableOpacity>
                      );
                    }
                  })}
                </Container>
              )}
              <Divider height={16} />
              {schedule.length > 0 && schedule.map((item, index) => {
                return (
                  <Container key={index} style={{paddingHorizontal: 16,}}>
                    <CardSchedule item={item} index={index}/>
                  </Container>
                )
              })}
              <Divider height={16} />
            </Container>
          </Container>
        )}
      </ScrollView>
    </Scaffold>
  );
};

export default FestArtsDetail;

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

const FestLiteratureDetail = ({navigation, route}) => {
  const {item} = route.params;
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState({});
  const modalRef = useRef();
  const {width} = useWindowDimensions();

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
                source={item.imageBanner}
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
                  {item.title}
                </Text>
                <Divider height={8} />
                <Text size={10} lineHeight={12} color={'#3A3936'} align="left">
                  {item.date} {'\u2022'} {item.location}
                </Text>
                <Divider height={16} />
                <Text size={14} lineHeight={22} color={Color.black} align="left">
                  {item.desc}
                </Text>
              </Container>
              <Divider height={16} />
              <Container flex={1} flexDirection="row" justify="space-between" paddingHorizontal={16}>
                {item.gallery.map((data, index) => {
                  if (index > 2) return <></>;
                  if (index < 2 || item.gallery.length <= 3) {
                    return (
                      <Image
                        key={index}
                        source={data}
                        style={{width: '32%', aspectRatio: 1}}
                      />
                    );
                  } else {
                    return (
                      <TouchableOpacity
                        onPress={() => navigation.navigate('FestGallery', {item: item.gallery})}
                        style={{ width: '32%'}}
                      >
                        <ImageBackground
                          key={index}
                          source={data}
                          imageStyle={{width: '100%', aspectRatio: 1, opacity: 0.4}}
                          style={{width: '100%', height: '100%', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
                            <Text size={36} lineHeight={45} color={Color.white}>
                              +{item.gallery.length - 2}
                            </Text>
                        </ImageBackground>
                      </TouchableOpacity>
                    );
                  }
                })}
              </Container>
              <Divider height={16}/>
              <HighlightFest
                productCategory='CardSchedule'
                nav="ShowAllSchedule"
                name="Jadwal"
                title="Jadwal"
                initialData={item.schedule}
                style={{ paddingHorizontal: 16 }}
              />
              <Divider height={16}/>
            </Container>
          </Container>
        )}
      </ScrollView>
    </Scaffold>
  );
};

export default FestLiteratureDetail;

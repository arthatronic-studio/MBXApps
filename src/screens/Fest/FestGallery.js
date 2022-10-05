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
  View,
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
import {fetchFestGalleries} from 'src/api-rest/fest/fetchFestGalleries';

const FestGallery = ({navigation, route}) => {
  const {item} = route.params;
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const modalRef = useRef();
  const {width} = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState([]);

  const fetchData = async () => {
    const body = {
      event_id: item.event_id,
    };
    const result = await fetchFestGalleries(body);
    if (result.status) {
      const data = result.data;
      setGallery(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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
          <Container
            flexDirection="row"
            flexWrap="wrap"
            marginHorizontal={16}>
            {gallery.map((data, index) => {
              return (
                <View
                  style={{
                    width: '32%',
                    marginVertical: 5,
                    marginRight: (index + 1) % 3 == 0 ? '0%' : '2%',
                  }}>
                  <Image
                    key={index}
                    source={{uri: data.image}}
                    style={{width: '100%', aspectRatio: 1}}
                  />
                </View>
              );
            })}
          </Container>
        )}
      </ScrollView>
    </Scaffold>
  );
};

export default FestGallery;

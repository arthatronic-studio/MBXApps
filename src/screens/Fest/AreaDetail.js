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

const AreaDetail = ({navigation, route}) => {
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
    // fetchData();
  }, []);

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header
          centerTitle={false}
          iconLeftButton="arrow-left"
          // title={item.name}
          title={'mbloc market'}
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
            <Container width={width} height={width / 1.7}>
              <Image
                source={imageAssets.mBlocMarketPadang}
                resizeMode="cover"
                style={{width: '100%', height: '100%'}}
              />
            </Container>

            <Container padding={16} align="flex-start">
              <Container
                paddingHorizontal={11}
                paddingVertical={7}
                backgroundColor={Color.text}>
                <Text
                  align="left"
                  size={14}
                  lineHeight={18}
                  color={Color.primary}
                  type="bold">
                  Snacking station
                </Text>
              </Container>
              <Divider height={10} />
              <Text align="left" size={14} lineHeight={22}>
                Sebagai toko kelontong jenama lokal, M Bloc Market akan menjadi
                “mini market” dalam festival ini yang menyediakan minuman dan
                kudapan siap angkut untuk para pengunjung. Selain itu, M Bloc
                Market juga akan menjadi tempat beristirahat teman-teman
                pengunjung ditengah hingar-binger M Bloc Fest.
              </Text>
            </Container>
          </Container>
        )}
      </ScrollView>
    </Scaffold>
  );
};

export default AreaDetail;

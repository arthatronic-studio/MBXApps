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
import HtmlView from 'src/components/HtmlView';

const VenuesDetail = ({navigation, route}) => {
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

  console.log(item, 'item');

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header
          centerTitle={false}
          iconLeftButton="arrow-left"
          title={item.name}
          actions={
            <Container
              backgroundColor={item.entrance == 2 ? '#E6CFA3' : '#FCD100'}
              borderWidth={1}
              borderColor={item.entrance == 2 ? '#644B1B' : '#1D1D1B'}
              padding={8}
              borderRadius={8}>
              <Text
                color={item.entrance == 2 ? '#644B1B' : '#1D1D1B'}
                size={10}
                lineHeight={12}
                type="medium">
                {item.entrance === 1 ? 'Gratis' : 'Tiket'}
              </Text>
            </Container>
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
            <Container width={width} height={width / 1.7}>
              <Image
                source={item.image}
                resizeMode="cover"
                style={{width: '100%', height: '100%'}}
              />
            </Container>

            <Container padding={16} align="flex-start">
              <HtmlView html={item.description} />
            </Container>
            {/* <Container padding={16} align="flex-start">
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
                  Get Loud!
                </Text>
              </Container>
              <Divider height={10} />
              <Text align="left" size={14} lineHeight={22}>
                Lagu rock sudah menjadi ciri khas dari area Bloc Bar. Setiap
                minggunya, area yang terkesan sebagai dunia underground dari M
                Bloc Space selalu hidup dengan lagu-lagu keras dan kencang. Mari
                kita terus hidupkan suasana ini saat M Bloc Festival dengan
                mengundang jajaran musisi aliran musik cadas lokal untuk tampil
                di “Underground Stage”!
              </Text>
              <Divider height={16} />
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
                  Beer Station
                </Text>
              </Container>
              <Divider height={10} />
              <Text align="left" size={14} lineHeight={22}>
                Sebagai sebuah bar, pastinya akan asik jika ada sesi free flow
                beer sembari menikmati hiburan yang sedang disediakan. Tentunya
                yang dapat mengakses free flow beer ini hanyalah orang-orang
                tertentu yang membayar tiket khusus.
              </Text>
              <Divider height={16} />
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
                  Underground Disco
                </Text>
              </Container>
              <Divider height={10} />
              <Text align="left" size={14} lineHeight={22}>
                Yang dulunya dikenal sebagai “Gang Disko”, Bloc Bar sekarang
                menjadi tempat yang cocok untuk para DJ bisa mengekspresikan
                karyanya, antara DJ tecno, maupun DJ RnB. Dalam program ini,
                kita kerahkan semua DJ asik terpilih untuk menghidupkan
                “Underground Stage” dan mengajak para pendatang untuk berdansa
                ria didepan panggung.
              </Text>
            </Container> */}
          </Container>
        )}
      </ScrollView>
    </Scaffold>
  );
};

export default VenuesDetail;

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

const AboutFest = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);

  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState({});
  const [loading, setLoading] = useState(false);

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
            <Image
              source={imageAssets.aboutFest1}
              style={{width: '100%', resizeMode: 'cover'}}
            />
            <Divider height={16} />
            <Container paddingHorizontal={16}>
              <Text size={14} type="medium" align="left" color={Color.black}>
                Apa itu MBLOC FEST?
              </Text>
              <Text size={11} align="left" color={Color.textSoft}>
                M Bloc Fest adalah festival industri kreatif tahunan untuk
                musik, seni, literasi, dan desain yang diadakan pada minggu
                terakhir September hingga pertengahan Oktober setiap tahunnya di
                beberapa venue yang ada di dalam kawasan M Bloc Space, Jakarta
                Selatan. Festival yang diadakan untuk merayakan hari jadi M Bloc
                Space ini diselenggarakan oleh M Bloc Entertainment yang
                merupakan anak usaha dari M Bloc Group (PT Radar Ruang Riang).
              </Text>
              <Divider height={8} />
              <Text size={11} align="left" color={Color.textSoft}>
                Beberapa venue yang menjadi lokasi acara M Bloc Fest adalah M
                Bloc Live House, Foya, Bloc Bar (musik), hingga Creative Hall
                (literasi dan desain).
              </Text>
              <Divider height={16} />
              <Text size={14} type="medium" align="left" color={Color.black}>
                Ada apa aja sih di MBLOC FEST?
              </Text>
              <Divider height={8} />
              <Text size={14} align="left" color={Color.black}>
                1. Festival Literatur
              </Text>
              <Divider height={8} />
              <Image
                source={imageAssets.aboutFest2}
                style={{width: '100%', resizeMode: 'cover'}}
              />
              <Divider height={8} />
              <Text size={11} align="left" color={Color.textSoft}>
              Seni adalah sebuah ledakan merupakan ungkapan asli dari seniman abstrak terkenal Jepang Taro Okamoto. Ungkapan tersebut diucapkan oleh Deidara Akatsuki (tokoh dari novel manga terkenal asal jepang “Naruto).
              </Text>
            </Container>
          </Container>
        )}
      </ScrollView>
    </Scaffold>
  );
};

export default AboutFest;

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
import HighlightFest from 'src/components/Fest/HighlightFest';

const AboutFestV2 = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);

  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState({});
  const [loading, setLoading] = useState(false);

  const unorderList = (item, index) => {
    return (
      <Row flexDirection="row" align="center" key={index}>
        <Text>{'\u2022'}</Text>
        <Divider width={10} />
        <Text style={{flex: 1}} size={14} lineHeight={22} color={Color.black} align="left">
          {item}
        </Text>
      </Row>
    );
  };

  const tata = [
    'Penonton wajib membawa KTP',
    'E-voucher yang diterima adalah tanggung jawab penonton, Harap menjaga & tidak menyebarluaskan Unique Code / Barcode yang terterad di E-Voucher',
    'E-Voucher ditukarkan menjadi Tyvex pada hari H sebelum memasuki area pertunkukan',
  ];

  const informasi = [
    {
      id: 1,
      title: 'MRT',
      point: ['Naik MRT turun di stasiun Blok M BCA'],
    },
    {
      id: 2,
      title: 'Transjakarta',
      point: ['Naik Transjakarta turun di halte Blok M dan KJA / Asean'],
    },
    {
      id: 3,
      title: 'Komuter Line (KRL)',
      point: [
        'KRL turun di stasiun sudirman, lalu turun disambung dengan MRT ke Blok M BCA',
      ],
    },
  ];

  const parkir = [
    'Jl. Palatehan',
    'Taman Bulungan',
    'Jl. Bulungan',
    'Jl. Sultan Hasanudin Dalam',
    'Jl. Melawai',
    'Blok M Plaza',
    'Blok M Square',
  ]

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header
          centerTitle={false}
          iconLeftButton="arrow-left"
          title="Tentang"
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
            <Divider height={16} />
            <Container paddingHorizontal={16}>
              <Image
                source={imageAssets.aboutFest3}
                style={{width: '100%', resizeMode: 'cover', borderRadius: 8}}
              />
            </Container>
            <Divider height={10} />
            <Container paddingHorizontal={16}>
              <Text
                size={16}
                type="medium"
                lineHeight={20}
                align="left"
                color={Color.black}>
                Apa sih M BLOC FEST 2022 itu?
              </Text>
              <Divider height={10} />
              <Text size={14} lineHeight={22} align="left" color={'#3A3936'}>
                M Bloc Fest adalah festival industri kreatif tahunan untuk
                musik, seni, literasi, dan desain yang diadakan pada minggu
                terakhir September hingga pertengahan Oktober setiap tahunnya di
                beberapa venue yang ada di dalam kawasan M Bloc Space, Jakarta
                Selatan. Festival yang diadakan untuk merayakan hari jadi M Bloc
                Space ini diselenggarakan oleh M Bloc Entertainment yang
                merupakan anak usaha dari M Bloc Group (PT Radar Ruang Riang).
                {'\n\n'}Beberapa venue yang menjadi lokasi acara M Bloc Fest
                adalah M Bloc Live House, Foya, Bloc Bar (musik), hingga
                Creative Hall (literasi dan desain).
              </Text>
              <Divider height={24} />
            </Container>
            <Container paddingHorizontal={16}>
              <Text
                size={16}
                type="medium"
                lineHeight={20}
                align="left"
                color={Color.black}>
                Kegiatan apa aja yang akan di gelar di M BLOC FEST 2022?
              </Text>
            </Container>
            <HighlightFest
              productCategory="ABOUT"
              nav="FestMusicScreen"
              name="Musik"
              title="Musik"
              maxData={2}
              horizontal={true}
              onPress={() => navigation.navigate('FestMusicScreen')}
            />
            <HighlightFest
              productCategory="ABOUT"
              nav="FestArtsScreen"
              name="Literatur"
              title="Literatur"
              maxData={2}
              horizontal={true}
              onPress={() => navigation.navigate('FestArtsScreen')}
            />
            <HighlightFest
              productCategory="ABOUT"
              nav="FestLiteratureScreen"
              name="Arts & Design"
              title="Arts & Design"
              maxData={2}
              horizontal={true}
              onPress={() => navigation.navigate('FestLiteratureScreen')}
            />
            <Divider height={16} />
            <Container paddingHorizontal={16}>
              <Text
                size={16}
                type="medium"
                lineHeight={20}
                align="left"
                color={Color.black}>
                Informasi Penting Sebelum Datang
              </Text>
              <Divider height={16} />
              <Text size={16} align="left" lineHeight={20} color={Color.black}>
                Tata Cara penukaran Tiket
              </Text>
              <Divider height={16} />
              {tata.map((item, index) => unorderList(item, index))}
              <Divider height={16} />
              <Container
                padding={10}
                color={Color.borderLight}
                borderRadius={8}>
                <Text
                  size={12}
                  lineHeight={15}
                  color={Color.black}
                  align="left">
                  Apakah tersedia tiket OTS (On The Spot)?
                </Text>
                <Text
                  size={14}
                  lineHeight={18}
                  type="medium"
                  color={Color.black}
                  align="left">
                  Iya, Setiap hari tersedia tiket OTS!
                </Text>
              </Container>
              <Divider height={16} />
              <Text size={16} align="left" lineHeight={20} color={Color.black}>
                Informasi Kendaraan Umum
              </Text>
              <Divider height={16} />
              {informasi.map((item, index) => {
                return (
                  <Row flexDirection="row" align="center" key={index}>
                    <Text size={14} lineHeight={22} color={Color.black} align="left">{index+1}.</Text>
                    <Divider width={10} />
                    <Container flex={1}>
                      <Text size={14} lineHeight={22} color={Color.black} align="left">{item.title}</Text>
                      {item.point.map((item, index) =>
                        unorderList(item, index),
                      )}
                    </Container>
                  </Row>
                );
              })}
              <Divider height={16} />
              <Text size={16} align="left" lineHeight={20} color={Color.black}>
                Kantong Parkir Terdekat
              </Text>
              <Divider height={16} />
              {parkir.map((item, index) => unorderList(item, index))}
              <Divider height={16} />
            </Container>
          </Container>
        )}
      </ScrollView>
    </Scaffold>
  );
};

export default AboutFestV2;

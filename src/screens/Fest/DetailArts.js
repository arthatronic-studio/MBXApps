import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useColor, Header, Col, Text} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {Divider, Row, Container} from 'src/styled';
import {accessClient} from 'src/utils/access_client';
import {useIsFocused} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagesPath from 'src/components/ImagesPath';
import FormInput from 'src/components/FormInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//Fonts
import SearchBar from 'src/components/SearchBar';
import HighlightFestMusic from 'src/components/Fest/HighlightFestMusic';

const DetailArts = ({navigation, route}) => {
  const {item} = route.params;
  console.log(item, 'iteem');

  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  let canGeneratedContent = accessClient.UserGeneratedContent === 'ALL_USER';
  if (
    accessClient.UserGeneratedContent === 'ONLY_ADMIN' &&
    user &&
    user.isDirector === 1
  )
    canGeneratedContent = true;
  else if (
    accessClient.UserGeneratedContent === 'ONLY_MEMBER' &&
    user &&
    user.organizationId
  )
    canGeneratedContent = true;
  const {width, height} = useWindowDimensions();

  const [comment, setComment] = useState([
    {
      id: 1,
      title: 'Jinan Aulia',
      date: '1 menit lalu',
      isi: 'Keren banget, brooo~~~',
    },
    {
      id: 2,
      title: 'Yunus Suhadi',
      date: '10 menit lalu',
      isi: 'What a nice art 😍😍😍',
    },
    {
      id: 3,
      title: 'Jibo Yumaera',
      date: '1 jam lalu',
      isi: 'Seni adalah sebuah ledakan merupakan ungkapan asli dari seniman abstrak terkenal Jepang Taro Okamoto. Ungkapan tersebut diucapkan oleh Deidara Akatsuki (tokoh dari novel manga terkenal asal jepang “Naruto).',
    },
  ]);

  const cardComment = (item, index) => {
    return (
      <Container
        key={index}
        flex={1}
        flexDirection="row"
        justify="flex-start"
        paddingVertical={10}>
        <Image
          source={ImagesPath.avatar2}
          style={{height: 32, aspectRatio: 1, borderRadius: 16}}
        />
        <Divider width={10} />
        <Container flex={1} flexDirection="column">
          <Text align="left" type="medium" color={Color.black} size={14}>
            {item.title}
          </Text>
          <Text align="left" size={10} color="#ACAAA5">
            {item.date}
          </Text>
          <Divider height={8} />
          <Text align="left" size={14} color={Color.black}>
            {item.isi}
          </Text>
        </Container>
      </Container>
    );
  };

  console.log('item', item);

  return (
    <Scaffold
      header={
        <Header
          backgroundColor={Color.black}
          centerTitle={false}
          color={Color.theme}
          iconLeftButton="arrow-left"
          actions={
            <Row justify="center" align="center">
              <Octicons name="share-android" color={Color.theme} size={18} />
              <Divider width={20} />
              <Feather size={18} name={'more-horizontal'} color={Color.theme} />
            </Row>
          }
        />
      }>
      <ScrollView>
        <Image
          source={typeof item.image === 'string' ? {uri: item.image} : item.image}
          style={{
            width: width,
            height: width*0.8,
            resizeMode: 'cover',
          }}
        />
        <Divider height={16} />
        <Container
          flex={1}
          flexDirection="row"
          align="center"
          paddingHorizontal={16}
          justify="space-between">
          <Container flexDirection="column" flex={1}>
            <Text
              align="left"
              size={16}
              color={Color.black}
              type="medium"
              numberOfLines={2}>
              {item.name}
            </Text>
            <Text
              align="left"
              size={12}
              color={Color.primaryDark}
              numberOfLines={1}>
              Ilustrasi Digital
            </Text>
          </Container>
          <Container flexDirection="row" flex={1} justify="flex-end">
            <Container
              padding={10}
              borderWidth={1}
              borderColor="#E2E1DF"
              borderRadius={50}>
              <FontAwesome name={'heart-o'} size={24} color={Color.black} />
            </Container>
            <Divider width={10} />
            <Container
              padding={10}
              borderWidth={1}
              borderColor="#E2E1DF"
              borderRadius={50}>
              <Octicons name="share-android" color={Color.black} size={24} />
            </Container>
          </Container>
        </Container>
        <Divider height={16} />
        <Container
          flex={1}
          flexDirection="row"
          align="center"
          paddingHorizontal={16}>
          <Container flexDirection="row" align="center">
            <Ionicons name={'heart-outline'} color={'#ACAAA5'} />
            <Divider width={4} />
            <Text size={10} color={'#ACAAA5'}>
              2.2rb
            </Text>
          </Container>
          <Divider width={10} />
          <Container flexDirection="row" align="center">
            <MaterialCommunityIcons
              name="comment-text-outline"
              color={'#ACAAA5'}
              size={14}
            />
            <Divider width={4} />
            <Text size={10} color={'#ACAAA5'}>
              246
            </Text>
          </Container>
        </Container>
        <Divider height={16} />
        <Container
          marginHorizontal={16}
          padding={10}
          backgroundColor="#FFFCEB"
          flexDirection="column"
          align="center">
          <FontAwesome
            name={'quote-left'}
            size={24}
            color={'rgba(41, 45, 50, 0.2)'}
          />
          <Divider height={16} />
          <Text size={17} color={Color.text} align="center">
            Seni adalah ledakan
          </Text>
        </Container>
        <Divider height={16} />
        <Container paddingHorizontal={16}>
          <Text color={Color.text} size={14} type="medium" align="left">
            Deskripsi
          </Text>
          <Divider height={10} />
          <Text size={14} align="left" color={Color.textSoft}>
          Seni adalah sebuah ledakan merupakan ungkapan asli dari seniman abstrak terkenal Jepang Taro Okamoto. Ungkapan tersebut diucapkan oleh Deidara Akatsuki (tokoh dari novel manga terkenal asal jepang “Naruto).
          </Text>
          <Divider height={10} />
          <Text size={14} align="left" color={Color.textSoft}>
            Chupa chups candy canes shortbread croissant sweet roll powder.
            Chocolate tiramisu marzipan carrot cake marzipan liquorice topping
            sweet. Icing chocolate bar candy bonbon sweet.
          </Text>
          <Divider height={10} />
          <Text size={14} align="left" color={Color.textSoft}>
            Chocolate bar sweet cotton candy brownie wafer. Macaroon candy ice
            cream wafer pastry. Dragée topping dragée chupa chups bonbon biscuit
            toffee marzipan. Chocolate cake chocolate cotton candy bear claw
            sweet.
          </Text>
        </Container>
        <Divider height={16} />
        <Container paddingHorizontal={16}>
          <Text size={14} align="left" type="medium" color={Color.text}>
            Kreator
          </Text>
          <Divider height={8} />
          <Container
            padding={10}
            color={Color.borderLight}
            radius={8}
            flex={1}
            flexDirection="row"
            justify="space-between"
            align="center">
            <Container flexDirection="row" align="center" flex={1}>
              <Image
                source={ImagesPath.avatar1}
                style={{height: 48, aspectRatio: 1, borderRadius: 24}}
              />
              <Divider width={10} />
              <Container flexDirection="column" flex={1}>
                <Text
                  align="left"
                  size={14}
                  type="medium"
                  color={Color.text}
                  numberOfLines={2}>
                  Melvin Hernandes
                </Text>
                <Text align="left" size={10} color={Color.textSoft}>
                  32 Karya
                </Text>
              </Container>
            </Container>
          </Container>
        </Container>
        <Divider height={16} />
        <Container paddingHorizontal={16}>
          <Text size={14} align="left" type="medium" color={Color.textSoft}>
            Komentar
          </Text>
          <Divider height={10} />
          <FormInput
            placeholder="Tuliskan komentar..."
            borderColor="#ACAAA5"
            suffixIcon={
              <TouchableOpacity>
                <Ionicons
                  name={'ios-send'}
                  color={Color.primaryDark}
                  size={24}
                />
              </TouchableOpacity>
            }
          />
          {comment.map((item, index) => cardComment(item, index))}
          <Divider height={5} />
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text size={12} type="medium" color={Color.primaryDark}>
              Lihat Semua Komentar
            </Text>
            <Divider width={8} />
            <MaterialIcons
              name={'keyboard-arrow-down'}
              size={22}
              color={Color.primaryDark}
            />
          </TouchableOpacity>
        </Container>
        <Divider height={16}/>
        <HighlightFestMusic
          productCategory="FEST_ARTS"
          name="Karya lain dari Adang Susanyo"
          title="Karya lain dari Adang Susanyo"
          nav="EventScreen"
          horizontal
          // refresh={refreshing || isFocused}
          showSeeAllText={false}
        />
        <HighlightFestMusic
          productCategory="FEST_ARTS"
          name="Karya serupa"
          title="Karya serupa"
          nav="EventScreen"
          horizontal
          // refresh={refreshing || isFocused}
          showSeeAllText={false}
        />
      </ScrollView>
    </Scaffold>
  );
};

export default DetailArts;

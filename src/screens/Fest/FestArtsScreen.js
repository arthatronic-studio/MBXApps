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
import CardFestArtsV2 from 'src/components/Fest/CardFestArtsV2';
import ListContenFest from 'src/components/Fest/ListContenFest';

const FestArtsScreen = ({navigation, route}) => {
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
          centerTitle={false}
          title="Art & Design"
          iconLeftButton="arrow-left"
        />
      }>
        <Container
          marginBottom={48}
        >
          <ListContenFest
            productCategory="ARTS"
            // name={title}
            
          />
        </Container>
    </Scaffold>
  );
};

export default FestArtsScreen;

import React, {useEffect, useState, useRef} from 'react';
import {useColor, Text, Header, Row, useLoading, Col} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Divider, Container} from 'src/styled';
import {
  useWindowDimensions,
} from 'react-native';
import ImagesPath from 'src/components/ImagesPath';
import imageAssets from 'assets/images';
import {useIsFocused} from '@react-navigation/native';
import {getAPI, postAPI} from 'src/api-rest/httpService';
import ListContenFest from 'src/components/Fest/ListContenFest';

const FestLiteratureScreen = ({navigation, route}) => {
  const {item} = route.params;
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const modalRef = useRef();
  const {width} = useWindowDimensions();


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
          title="Literatur"
          iconLeftButton="arrow-left"
        />
      }>
        <Container
          marginBottom={48}
        >
          <ListContenFest
            id={item.id}
            productCategory="LITERATUR"
            // name={title}
          />
        </Container>
    </Scaffold>
  );
};

export default FestLiteratureScreen;

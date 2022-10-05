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

const FestArtsScreen = ({navigation, route}) => {
  const {item} = route.params;
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const modalRef = useRef();
  const {width} = useWindowDimensions();

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
            id={item.id}
            productCategory="ARTS"
            // name={title}
            
          />
        </Container>
    </Scaffold>
  );
};

export default FestArtsScreen;

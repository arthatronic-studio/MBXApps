import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useColor, Text, Header} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ListContentProductV2 from 'src/components/Content/ListContentProductV2';
import ListContenFest from 'src/components/Fest/ListContenFest';
import {Modalize} from 'react-native-modalize';
import {Container, Divider} from 'src/styled';
import imageAssets from 'assets/images';

const ShowAllArea = ({navigation, route}) => {
  const {title} = route.params;
  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const modalRef = useRef();
  const [selected, setSelected] = useState(false);
  const {width} = useWindowDimensions();

  return (
    <Scaffold
      header={
        <Header centerTitle={false} title={title} iconLeftButton="arrow-left" />
      }>
      <Container marginBottom={48}>
        <ListContenFest
          productCategory="AREA"
          name={title}
        />
      </Container>
    </Scaffold>
  );
};

export default ShowAllArea;

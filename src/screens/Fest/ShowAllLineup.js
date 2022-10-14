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

const ShowAllLineup = ({navigation, route}) => {
  const {title} = route.params;
  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const modalRef = useRef();
  const [selected, setSelected] = useState({});
  const {width} = useWindowDimensions();

  return (
    <Scaffold
      header={
        <Header centerTitle={false} title={title} iconLeftButton="arrow-left" />
      }>
      <Container marginBottom={48}>
        <ListContenFest
          productCategory="LINEUP"
          name={title}
          onPress={value => {
            setSelected(value);
            modalRef.current.open();
          }}
        />
      </Container>
      <Modalize
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
        }}
        ref={modalRef}
        withHandle={false}
        adjustToContentHeight
        disableScrollIfPossible={false}
        childrenStyle={{
          backgroundColor: Color.theme,
          alignItems: 'flex-start',
          paddingVertical: 16,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          width: width - 32,
        }}
        modalStyle={{
          backgroundColor: Color.theme,
          paddingHorizontal: 16,
        }}
        onClose={() => {
          setSelected({});
        }}>
        <Container>
          <Image
            style={{
              width: width - 32,
              height: width - 32,
              resizeMode: 'cover',
              borderRadius: 8,
            }}
            source={{uri: selected.file}}
          />
          <Divider height={10} />
          <Text size={22} color={Color.black} lineHeight={27} align="left">
            {selected.name}
          </Text>
          <Divider height={10} />
          <Container flex={1} flexDirection="row" align="center">
            <Image
              source={imageAssets.calendar}
              style={{width: 16, height: 16}}
            />
            <Divider width={8} />
            <Text size={10} lineHeight={12} color={Color.black}>
              {selected.date ? selected.date : '-'}
            </Text>
            <Divider width={10} />
            <Image source={imageAssets.clock} style={{width: 16, height: 16}} />
            <Divider width={8} />
            <Text size={10} lineHeight={12} color={Color.black}>
              {selected.time}
            </Text>
            <Divider width={10} />
            <Image
              source={imageAssets.location}
              style={{width: 16, height: 16}}
            />
            <Divider width={8} />
            <Text size={10} lineHeight={12} color={Color.black}>
              {selected.location_name}
            </Text>
          </Container>
          <Divider height={10} />
          <TouchableOpacity
            onPress={() => {
              modalRef.current.close();
            }}
            style={{
              flex: 1,
              borderWidth: 1,
              padding: 10,
              borderRadius: 8,
              borderColor: '#ACAAA5',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text size={14} color={Color.primaryDark} type="medium">
              Tutup
            </Text>
          </TouchableOpacity>
        </Container>
      </Modalize>
    </Scaffold>
  );
};

export default ShowAllLineup;

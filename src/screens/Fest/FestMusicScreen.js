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
import { fetchFestFind } from 'src/api-rest/fest/fetchFestFind';

const FestMusicScreen = ({navigation, route}) => {
  const {item} = route.params;
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState({});
  const modalRef = useRef();
  const {width, height} = useWindowDimensions();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  

  const fetchData = async () => {
    const body = {
      id: item.id
    }
    const result = await fetchFestFind(body);
    if (result.status) {
      setData(result.data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header centerTitle={false} title="Musik" iconLeftButton="arrow-left" />
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
            <Container width={width} height={height*0.11}>
              <Image
                source={{ uri: data.file }}
                resizeMode="cover"
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
              />
            </Container>

            <Divider height={16} />

            <Container paddingHorizontal={16}>
              <Text align="left" size={14} lineHeight={22} color={Color.black} numberOfLines={3}>
                {data.description}
              </Text>
              <Divider height={10}/>
              <TouchableOpacity
                onPress={() => navigation.navigate('FestMusicDetail', {item: data})}
                style={{ 
                  flexDirection: 'row',
                  alignItems: 'center'
                 }}
              >
                <Text size={12} lineHeight={16} type="medium" color={Color.primaryDark}>Selengkapnya</Text>
                <Divider width={10}/>
                <Ionicons name="arrow-forward" size={16} color={Color.primaryDark} />
              </TouchableOpacity>
            </Container>

            <HighlightFest
              productCategory="LINEUP"
              nav="MusicScheduleScreen"
              name="Todays Line-up"
              title="Todays Line-up"
              eventId={data.event_id}
              // wrap={false}
              horizontal={true}
              onPress={value => {
                setSelected(value);
                modalRef.current.open();
              }}
            />

          </Container>
        )}
      </ScrollView>

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
              Live House
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

export default FestMusicScreen;

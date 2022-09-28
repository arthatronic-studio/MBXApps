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
  FlatList,
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

const MusicScheduleScreen = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState({});
  const modalRef = useRef();
  const {width} = useWindowDimensions();
  const [date, setDate] = useState([
    {
      id: 1,
      name: 'Semua jadwal',
    },
    {
      id: 2,
      name: 'Hari ini',
      title: '25 September 2022',
    },
    {
      id: 3,
      name: '26 Sep',
      title: '26 September 2022',
    },
    {
      id: 4,
      name: '27 Sep',
      title: '27 September 2022',
    },
    {
      id: 5,
      name: '28 Sep',
      title: '28 September 2022',
    },
    {
      id: 6,
      name: '29 Sep',
      title: '29 September 2022',
    },
    {
      id: 7,
      name: '30 Sep',
      title: '30 September 2022',
    },
  ]);
  const [dateIndex, setDateIndex] = useState(0);

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
          iconLeftButton="arrow-left"
          title="Jadwal"
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
            <Container
              flex={1}
              flexDirection="row"
              borderWidth={1}
              marginHorizontal={16}
              padding={10}
              borderRadius={8}
              align="center">
              <Image
                source={imageAssets.musicWeek}
                resizeMode="cover"
                style={{width: '16%', aspectRatio: 1}}
              />
              <Divider width={16} />
              <Container flex={1} flexDirection="column" align="flex-start">
                <Text
                  size={16}
                  lineHeight={20}
                  type="medium"
                  color={Color.black}>
                  m bloc Music Week
                </Text>
                <Divider height={4} />
                <Text size={10} lineHeight={12} color={'#3A3936'}>
                  25 Sep - 02 Okt 2022 {'\u2022'} Live House
                </Text>
              </Container>
            </Container>

            <Divider height={16} />

            <FlatList
              keyExtractor={(item, index) => item.toString() + index}
              data={date}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                alignItems: 'center',
              }}
              ItemSeparatorComponent={() => <Divider width={10} />}
              renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => setDateIndex(index)}>
                  <Container
                    style={{
                      padding: 8,
                      borderWidth: 1,
                      borderRadius: 8,
                      borderColor: '#3A3936',
                      backgroundColor:
                        index === dateIndex ? '#121212' : 'transparent',
                    }}>
                    <Text
                      size={12}
                      type="medium"
                      color={index === dateIndex ? Color.white : Color.text}
                      lineHeight={16}>
                      {item.name}
                    </Text>
                  </Container>
                </TouchableOpacity>
              )}
            />

            {dateIndex === 0 ? (
              date.map((item, index) => {
                if (index === 0) return <></>;
                return (
                  <HighlightFest
                    key={index}
                    productCategory="LINEUP"
                    showSeeAllText={false}
                    name={item.title}
                    title={item.title}
                    horizontal={true}
                    maxData={2}
                    onPress={value => {
                      setSelected(value);
                      modalRef.current.open();
                    }}
                  />
                );
              })
            ) : (
              <HighlightFest
                productCategory="LINEUP"
                showSeeAllText={false}
                name={date[dateIndex].title}
                title={date[dateIndex].title}
                horizontal={true}
                onPress={value => {
                  setSelected(value);
                  modalRef.current.open();
                }}
              />
            )}
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
            source={selected.image}
          />
          <Divider height={10} />
          <Text size={22} color={Color.black} lineHeight={27} align="left">
            DJ Raggil Suliza
          </Text>
          <Divider height={10} />
          <Container flex={1} flexDirection="row" align="center">
            <Image
              source={imageAssets.calendar}
              style={{width: 16, height: 16}}
            />
            <Divider width={8} />
            <Text size={10} lineHeight={12} color={Color.black}>
              25 Sep 2022
            </Text>
            <Divider width={10} />
            <Image source={imageAssets.clock} style={{width: 16, height: 16}} />
            <Divider width={8} />
            <Text size={10} lineHeight={12} color={Color.black}>
              14:00 - 14:45
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

export default MusicScheduleScreen;

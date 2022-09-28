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
  Linking,
} from 'react-native';
import imageAssets from 'assets/images';
import {useIsFocused} from '@react-navigation/native';
import Banner from 'src/components/Banner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {shadowStyle} from 'src/styles';
import {Modalize} from 'react-native-modalize';
import CardFestVenues from 'src/components/Fest/CardFestVenues';

const VenuesScreen = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const modalRef = useRef();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const {width, height} = useWindowDimensions();
  const [loading, setLoading] = useState(false);

  const [categoryIndex, setCategoryIndex] = useState(0);
  const category = ['Semua', 'Gratis', 'Tiket'];
  const [selected, setSelected] = useState({});

  const data = [
    {
      id: 1,
      image: imageAssets.blocBar,
      name: 'bloc Bar',
      group: 'Tiket',
    },
    {
      id: 2,
      image: imageAssets.twalenWarong,
      name: 'Twalen Warong',
      group: 'Gratis',
    },
    {
      id: 3,
      image: imageAssets.foya,
      name: 'Foya',
      group: 'Gratis',
    },
  ];

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header centerTitle={false} title="Venues" iconLeftButton="arrow-left" />
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
            <FlatList
              keyExtractor={(item, index) => item.toString() + index}
              data={category}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                alignItems: 'center',
              }}
              ItemSeparatorComponent={() => <Divider width={10} />}
              renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => setCategoryIndex(index)}>
                  <Container
                    style={{
                      padding: 8,
                      borderWidth: 1,
                      borderRadius: 8,
                      borderColor: Color.textSoft,
                      backgroundColor:
                        index === categoryIndex ? '#121212' : 'transparent',
                    }}>
                    <Text size={12} type="medium" lineHeight={16} color={index === categoryIndex ? "#FEFEFE" : Color.text}>
                      {item}
                    </Text>
                  </Container>
                </TouchableOpacity>
              )}
            />
            <Divider />
            <Container paddingHorizontal={16}>
              {data.map((item, index) => {
                if (categoryIndex > 0) {
                  if (item.group !== category[categoryIndex]) {
                    return <></>;
                  }
                }
                return (
                  <CardFestVenues item={item}/>
                );
              })}
            </Container>
            <Divider />
          </Container>
        )}
      </ScrollView>
    </Scaffold>
  );
};

export default VenuesScreen;

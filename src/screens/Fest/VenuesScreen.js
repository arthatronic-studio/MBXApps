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
import {fetchFestLocation} from 'src/api-rest/fest/fetchFestLocation';
import itemUpdate from 'src/state/reducers/item-update';

const VenuesScreen = ({navigation, route}) => {
  const {Color} = useColor();
  const isFocused = useIsFocused();
  const modalRef = useRef();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const {width, height} = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [itemData, setItemData] = useState({
    data: [],
    loading: true,
    message: '',
    nextUrl: null,
    loadNext: false,
    refresh: false,
  });

  const [categoryIndex, setCategoryIndex] = useState(0);
  const category = ['All', 'Free', 'Ticketing'];

  const fetchData = async first => {
    let params = itemData.nextUrl
      ? itemData.nextUrl
      : '?type=venues&perPage=10';
    if (category[categoryIndex] === 'Ticketing') {
      params = params + '&category=1';
    }
    if (category[categoryIndex] === 'Free') {
      params = params + '&category=0';
    }
    const result = await fetchFestLocation(params);
    if (result.status) {
      console.log(result, 'resss');
      setItemData({
        ...itemData,
        data: first ? result.data : itemData.data.concat(result.data),
        nextUrl: result.nextUrl ? `?${result.nextUrl.split('?')[1]}` : null,
        loading: false,
        loadNext: false,
        message: result.message,
        refresh: false,
      });
    }
  };

  console.log(itemData, 'dataaa');

  useEffect(() => {
    if (isFocused) {
      fetchData(true);
    }
  }, [categoryIndex, isFocused]);

  useEffect(() => {
    if (itemData.loadNext && itemData.nextUrl != null) {
      fetchData(false);
    }
  }, [itemData.loadNext]);

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header
          centerTitle={false}
          title="Venues"
          iconLeftButton="arrow-left"
        />
      }>
      <FlatList
        keyExtractor={(item, index) => item.toString() + index}
        data={itemData.data}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
        onEndReachedThreshold={0.3}
        onEndReached={() => setItemData({...itemData, loadNext: true})}
        renderItem={({item, index}) => {
          return <CardFestVenues item={item} />;
        }}
        ListHeaderComponent={
          <FlatList
            keyExtractor={(item, index) => item.toString() + index}
            data={category}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 8,
              alignItems: 'center',
            }}
            ItemSeparatorComponent={() => <Divider width={10} />}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => setCategoryIndex(index)}>
                <Container
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    // borderRadius: 8,
                    borderColor: Color.textSoft,
                    backgroundColor:
                      index === categoryIndex ? '#121212' : 'transparent',
                  }}>
                  <Text
                    size={12}
                    type="medium"
                    lineHeight={16}
                    color={index === categoryIndex ? '#FEFEFE' : Color.text}>
                    {item}
                  </Text>
                </Container>
              </TouchableOpacity>
            )}
          />
        }
      />
    </Scaffold>
  );
};

export default VenuesScreen;

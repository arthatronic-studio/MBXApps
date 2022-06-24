import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput as TextInputs,
  Image,
  FlatList,
} from 'react-native';
import Styled from 'styled-components';
import {useSelector} from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Text,
  // TouchableOpacity,
  Loading,
  useLoading,
  Scaffold,
  useColor,
  Header,
} from '@src/components';

import Filter from 'src/components/Filter';
import ImagesPath from 'src/components/ImagesPath';
import Category from 'src/components/Category';
import CardReview from './CardReview';
import { queryEcommerceProductUlasan } from 'src/lib/query/ecommerce/queryEcommerceProductUlasan';
import client from 'src/lib/apollo';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const Content = Styled(View)`
    margin: 16px
    padding: 12px
    borderRadius: 8px
`;
let filter = [
  {id: 1, name: 'Category'},
  {id: 2, name: 'Rating'},
];

const DATA = [
  {
    id: 1,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink Nissa Sabyan',
    category: 'Fashion',
    rating: 5,
    buyer:'Hendra Helinsky'
   
  },
  {
    id: 2,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink Nissa Sabyan',
    category: 'Fashion',
    rating: 5,
    buyer:'Hendra Helinsky'
  },
  {
    id: 3,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink Nissa Sabyan',
    category: 'Fashion',
    rating: 5,
    buyer:'Hendra Helinsky'
  },
  {
    id: 4,
    image: ImagesPath.productImage,
    title: 'Pashmina Pink Nissa Sabyan',
    category: 'Fashion',
    rating: 5,
    buyer:'Hendra Helinsky'
  },
];
const Review = ({navigation, route}) => {
  // selector
  const user = useSelector(state => state['user.auth'].login.user);
  const loading = useSelector(state => state['user.auth'].loading);
  const [listReview, setListReview] = useState([]);

  const [loadingProps, showLoading, hideLoading] = useLoading();
  const {Color} = useColor();
  const onSelect = item => {
    setSelectedItem(item);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    fetchEcommerceProductUlasan()
  }, []);

  const fetchEcommerceProductUlasan = () => {
    const variables = {
      page: 1,
      itemPerPage: 20,
      type: 'PRODUCT'
    };

    console.log('variables', variables);
    client.query({
      query: queryEcommerceProductUlasan,
      variables
    })
    .then((res) => {
      console.log('res ecom prd ulasan', res);

      const data = res.data.ecommerceProductUlasan;
      if (Array.isArray(data)) {
        setListReview(data);
      }
    })
    .catch((err) => {
      console.log('err ecom prd ulasan', err);
    });
  }

  return (
    <Scaffold
      header={
        <Header customIcon title="Ulasan" type="regular" centerTitle={false} />
      }
      onPressLeftButton={() => navigation.pop()}>
      <MainView style={{backgroundColor: Color.semiwhite}}>
        {/* <View style={{marginTop: 12, flexDirection: 'row'}}>
          <Filter
            title={'Terbaru'}
            value={selectedItem}
            data={filter}
            onSelect={onSelect}
          />

          <View style={{flex: 1}}>
            <Category type={'review'} />
          </View>
        </View> */}
        <View style={{ paddingVertical: 10,flex:1}}>
          <FlatList
            data={listReview}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={({item}) => {
              return <CardReview data={item} />;
            }}
          />
        </View>

        {/* <Loading {...loadingProps} /> */}
      </MainView>
    </Scaffold>
  );
};

export default Review;

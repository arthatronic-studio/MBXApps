import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, useWindowDimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Scaffold, useColor, Header, Text,  Row,
  Col,} from '@src/components';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import Banner from 'src/components/Banner';
import client from 'src/lib/apollo';
import { Divider } from 'src/styled';
import { queryBannerList } from 'src/lib/query/banner';
import HighlightLelang from 'src/components/Card/HighlightLelang';

const Lelang = ({ navigation, route }) => {
  const {Color} = useColor();
  const { height, width } = useWindowDimensions();

  const [ loadingBanner, setLoadingBanner ] = useState(true);
	const [ listBanner, setListBanner ] = useState([]);

	useEffect(
		() => {
			fetchBannerList();
		},
		[ ]
	);

	const fetchBannerList = () => {
		const variables = {
		  categoryId: 7,
		};
	
		client.query({
		  query: queryBannerList,
		  variables,
		})
		  .then(res => {
        console.log('res banner list', res);
        setListBanner(res.data.bannerList);
        setLoadingBanner(false);
		  })
		  .catch(err => {
        console.log(err, 'err banner list');
        setLoadingBanner(false);
		  });
	};
  
  return (
    <Scaffold
      header={
        <Header
          type="bold"
          centerTitle={false}
          title="Lelang"
          actions={
            <View style={{flexDirection: 'row'}}>
              <MaterialIcons onPress={()=> navigation.navigate('Wishlist')} name={'favorite-outline'} size={20} style={{marginHorizontal: 5, color: Color.secondary}}/>
              <MaterialCommunityIcons onPress={()=> navigation.navigate('CartScreen', { routeName: "Auction" })} name={'shopping-outline'} size={20} style={{marginHorizontal: 5, color: Color.secondary}}/>
              <MaterialCommunityIcons onPress={()=> navigation.navigate('AuctionHistory')} name={'history'} size={20} style={{marginHorizontal: 5, color: Color.secondary}}/>
            </View>
          }
          customIcon
        />
      }
      onPressLeftButton={() => navigation.pop()}
    >

      <ScrollView>
        <Divider />

        <Banner
          data={listBanner}
          showHeader={false}
          loading={loadingBanner}
        />
        
        <Divider />

        <HighlightLelang
          title={`Sedang Berlangsung`}
          nav='LiveLelangScreen'
          prodStatus='ONGOING'
        />

        <HighlightLelang
          title={`Akan Datang`}
          nav='LiveLelangScreen'
          prodStatus='WILLCOME'
        />
      </ScrollView>
    </Scaffold>
  );
};

export default Lelang;

import React, {useState, useEffect, useRef} from 'react';
import {View, Image, FlatList, ScrollView,useWindowDimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Scaffold, useColor, Header, Text,  Row,
  Col,} from '@src/components';
import TouchableOpacity from 'src/components/Button/TouchableDebounce';
import CardListLelang from 'src/components/Card/CardListLelang';
import Banner from 'src/components/Banner';
import { queryGetAuction } from 'src/lib/query/auction';
import client from 'src/lib/apollo';
import { Divider } from 'src/styled';
import { statusBarHeight } from 'src/utils/constants';
import { queryBannerList } from 'src/lib/query/banner';

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

  const renderHeader = () => {
    return (
      <>
        <Divider/>
        <Banner data={listBanner} showHeader={false} loading={loadingBanner} />
        <Divider/>
        <Row style={{width: '100%', paddingHorizontal: 15}}>
          <Col style={{width: '50%',}}>
            <Text align='left' type='bold'>Pelelangan</Text>
            <Text align='left' type='bold'>Sedang Berlangsung</Text>
          </Col>
          <Text onPress={()=> navigation.navigate('LiveLelangScreen', {title: 'Sedang Berlangsung', cardStatus: 'ONGOING'})} style={{width: '50%',marginVertical: 10, textAlign: 'right', color: Color.primary}}>Lihat Semua</Text>
        </Row>
        <Divider height={10}/>
      </>
    )
  }
  
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
        <CardListLelang prodStatus={'ONGOING'}
          ListHeaderComponent={renderHeader}
        />
        <Row style={{width: '100%', paddingHorizontal: 15, marginVertical: 15}}>
          <Col style={{width: '50%',}}>
            <Text align='left' type='bold'>Pelelangan</Text>
            <Text align='left' type='bold'>Yang akan datang</Text>
          </Col>
          <Text onPress={()=> navigation.navigate('LiveLelangScreen', {title: 'Yang Akan Datang', cardStatus: 'WILLCOME'})} style={{width: '50%',marginVertical: 10, textAlign: 'right', color: Color.primary}}>Lihat Semua</Text>
        </Row>
        <CardListLelang prodStatus={'WILLCOME'}/>
        <View style={{paddingBottom: statusBarHeight + 60}}/>
      </ScrollView>
    </Scaffold>
  );
};

export default Lelang;

import React, {useEffect, useState} from 'react';
import {View, TextInput, Text, ScrollView} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';
import Banner from 'src/components/Banner';
import { useColor  } from '@src/components';
import Scaffold from '@src/components/Scaffold';
import { queryBannerList } from 'src/lib/query/banner';
import { Row, Divider } from 'src/styled';
import { accessClient } from 'src/utils/access_client';
import ListContentProduct from 'src/components/Content/ListContentProduct';
import AntDesign from 'react-native-vector-icons/AntDesign'
import IonIcons from 'react-native-vector-icons/Ionicons'
import client from 'src/lib/apollo';

const NewsScreen = ({navigation, route}) => {


  useEffect(() => {
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


  const ArticleHeader = () => {
    return (
      <View style={{alignItems: 'center',backgroundColor: Color.primarySoft, width: '100%', height: 60, flexDirection: 'row'}}>
          <AntDesign onPress={() => navigation.goBack()} name={'arrowleft'} size={20} style={{marginHorizontal: 12}}/>
          <View style={{width: '70%', height: '80%' ,justifyContent: 'center'}}>
            <TextInput placeholder='Cari berita hari ini . . .' style={{width: '100%',height: '80%',backgroundColor: Color.theme, fontSize: 12, borderRadius: 6, paddingHorizontal: 10}}></TextInput>
            <AntDesign size={14} name={'search1'} style={{position: 'absolute', color: Color.secondary, alignSelf: 'flex-end', right: 10}}/>
          </View>
          <IonIcons onPress={()=> navigation.navigate('Saved')} name={'md-bookmarks-outline'} size={18} style={{marginHorizontal: 12}}/>
          <IonIcons 
            onPress={() => navigation.navigate('CreateThreadScreen', {
                    title,
                    productType: Config.PRODUCT_TYPE,
                    productCategory: '',
                    productSubCategory: 'POSTING',
                  })} name={'add'} size={24}/>
      </View>
    )
  }

  const { title, userProfileId } = route.params;

  const user = useSelector(state => state['user.auth'].login.user);
  const {Color} = useColor();
  const [ loadingBanner, setLoadingBanner ] = useState(true);
  const [ listBanner, setListBanner ] = useState([]);

  let canGeneratedContent = accessClient.UserGeneratedContent === 'ALL_USER';
  if (accessClient.UserGeneratedContent === 'ONLY_ADMIN' && user && user.isDirector === 1) canGeneratedContent = true;
  else if (accessClient.UserGeneratedContent === 'ONLY_MEMBER' && user && user.organizationId) canGeneratedContent = true;

  return (
    <Scaffold
      header={
        // <Header
        // style={{backgroundColor: Color.primarySoft}}
        //   actions={
        //     canGeneratedContent &&
        //     <Row justify='center' align='center'>
        //       {/* <Ionicons
        //         name='search'
        //         color={Color.primary}
        //         size={22}
        //         onPress={() => navigation.navigate('MainSearch')}
        //       />
        //       <Divider /> */}
        //       <MaterialIcons
        //         name='add'
        //         color={Color.primary}
        //         size={26}
        //         onPress={() =>
        //           navigation.navigate('CreateThreadScreen', {
        //             title,
        //             productType: Config.PRODUCT_TYPE,
        //             productCategory: '',
        //             productSubCategory: 'POSTING',
        //           })
        //         }
        //       />
        //     </Row>
        //   }
        // />
        <ArticleHeader/>
      }
    >
        <ScrollView>
          <Divider/>
          <Banner
            data={listBanner}
            showHeader={false}
            loading={loadingBanner}
          />
        <Row style={{marginTop: 10}}>
          <Text style={{fontWeight:'bold', marginHorizontal: 15, width: '68%'}}>Artikel Terbaru</Text>
          <Text style={{fontSize: 11, color: Color.info, fontWeight: 'bold'}}>Lihat Semua</Text>
          <AntDesign name={"arrowright"} style={{color: Color.info, marginHorizontal: 5}}/>
        </Row>
        <ListContentProduct
          userProfileId={userProfileId}
          productCategory='POSTING'
          name='Artikel'
        />
        </ScrollView>
    </Scaffold>
  );
};

export default NewsScreen;
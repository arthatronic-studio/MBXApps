import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView,Pressable,FlatList,ImageBackground} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';
import { queryContentProduct,queyGetDokumentasiEnventDetail } from '@src/lib/query';
import {useLoading, usePopup, useColor} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {Container, Divider} from '@src/styled';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {iconWarning, iconHeart, iconShare, iconBookmarks} from '@assets/images/home';
import { useSelector } from 'react-redux';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import Header from '@src/components/Header';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';

const DocumentasiDetails = ({navigation, route}) => {
  const idEvent = route.params.id;
  const Cimage  = route.params.cImage;
  const Cvideo  = route.params.cVideo;

  console.log('ini image',Cvideo);


  const [itemData, setItemData] = useState([]);
  const modalOptionsRef = useRef();

  const user = useSelector(state => state['user.auth'].login.user);

  // const [state, changeState] = useState({
  //   im_like: item.im_like,
  // });

  // const setState = (obj) => changeState({ ...state, ...obj });

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();

  const {Color} = useColor();
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    }, {
        id: '586d94a0f-3da1-471f-bd96-145571e29d72',
        title: 'For Item',
      },
  ];


  // useEffect(() => {
    //     const timeout = trigger ? setTimeout(() => {
    //         fetchAddLike();
    //     }, 500) : null;

    //     return () => {
    //         clearTimeout(timeout);
    //     }
    // }, [trigger]);

    useEffect( () => {
      // submit()
      fetchDocumentasiEventDetail();
  }, []);

    const fetchDocumentasiEventDetail = () => {
      const variables = {
        id: idEvent,
       
      };
  
      Client.query({
        query: queyGetDokumentasiEnventDetail,
        variables
      
      })
      .then((res) => {




        const data = res.data.eventDocumentationDetail;
       
  
        if (data) {
          setItemData(data);
        }
      })
      .catch((err) => {
        console.log('err YOUTUBE_VIDEO', err);
      });
    }


  const image = { uri: "https://reactjs.org/logo-og.png" };
  const renderItem = ({ item }) => (
   
    <View style={{
        flex: 1,
        width: '48%', 
        minHeight: 225,
        padding: 10, 
        
      }}>
        
         <Pressable  onPress={() => {
                                        navigation.navigate('GalleryDetailSliderScreenEvent', {
                                            data: itemData.eventDocumentations,
                                            selectedIndex: idx,
                                        });
                                    }}>
    <ImageBackground source={{uri: item.media}} resizeMode="cover"  imageStyle={{ borderRadius: 6}} style={{
flex: 1,
justifyContent: "flex-end",
borderRadius: 4,
minHeight: 205,
marginBottom: 0, 
padding: 10,
borderRadius: 0, 
backgroundColor: 'grey'
}}> 
 
    </ImageBackground>
    </Pressable>
  </View>

  );

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      // iconRightButton={<Feather name='more-vertical' size={20} color={Color.text} />}
      // onPressRightButton={() => {
      //   modalOptionsRef.current.open();
      // }}
      loadingProps={loadingProps}
      header={<Header customIcon title="Detail" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={{padding: 16}}>
                    <Text size={24} type='bold' align='left' lineHeight={32}>
                        {item.productName}
                    </Text>
                </View> */}
        {/* <View style={{paddingHorizontal: 16}}>
                    <View style={{paddingVertical: 4, width: 100, borderWidth: 0.5, borderRadius: 8, borderColor: Color.primary}}>
                        <Text size={10} color={Color.primary}>
                            {item.productCategory}
                        </Text>
                    </View>
                </View> */}

        {/* <Divider /> */}

        <View
          style={{
            width: '100%',
            aspectRatio: 4/3,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('GalleryDetailScreen', {
                id: itemData.id,
                image: itemData.images[0],
              });
            }}
          >
            <Image
             source={{uri: itemData.latestMedia !== null ? itemData.latestMedia : itemData.images[0]}}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: Color.border
                // position: 'absolute',
              }}
            />
          </TouchableOpacity>
            
          {/* <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: Color.reverseOverflow,
              position: 'absolute',
            }} /> */}

          {/* <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}>
              <Text
                style={{fontWeight: 'bold', color: Color.text}}
                align="left"
                size={19}>
                {item.productName}
              </Text>
              <Text style={{color: Color.text}} align="left" size={11}>
                Ditulis oleh {item.fullname}
              </Text>
            </View>
          </View> */}
        </View>

        <View
            style={{
              width: '100%',
              // height: '100%',
              paddingTop: 16,
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}>
              <Text
                type='bold'
                align="left"
                size={19}>
               {itemData.name}
              </Text>
              <Divider height={4} />
              <Text align="left" size={11}>
              
                {itemData.category} • {Moment(itemData.date).format('DD MMM YYYY')}
              </Text>
             
            </View>
          </View>
          
          {/* {item.like > 0 &&
            <Container paddingHorizontal={16}>
              <WidgetUserLikes id={item.id} title='Disukai' />
            </Container>
          } */}

        {/* <View style={{padding: 16}}>
          <Text lineHeight={24} align="left">
            &nbsp;&nbsp;&nbsp;&nbsp;
            {item.productDescription}
          </Text>
        </View> */}

         <View style={{flexDirection: 'row',marginHorizontal:15,marginTop:-15}}>
          

        <View style={{alignItems: 'center'}}>
            <TouchableOpacity
               
                style={{height: 40, width: 70, flexDirection: 'row', borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
            >
                <Ionicons name='image-outline' color={Color.text} size={20} style={{marginRight:5}} />
           <Text>{Cimage} </Text>
           <Text>Foto </Text>
            </TouchableOpacity>
            
        </View>
        <View style={{alignItems: 'center'}}>
            <TouchableOpacity
               
                style={{height: 40, width: 70, flexDirection: 'row', borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
            >
                <Ionicons name='play-outline' color={Color.text} size={20}  />
           <Text style={{marginRight:5}}>{Cvideo}</Text>
           <Text>Video </Text>
            </TouchableOpacity>
            
        </View>

        
        </View> 
        <View style={{alignItems:'flex-start',marginHorizontal:16}}>
        <Pressable style={{marginRight: 8,alignItems: 'center', justifContent: 'center',borderWidth: 1, borderColor: Color.secondary, paddingVertical: 7, borderRadius: 20,paddingHorizontal: 17}}>
            <Text style={{fontSize: 10, color: Color.secondary}}>Semua</Text>
          </Pressable>
        </View>
        <View style={{flex: 1,}}>
                        <FlatList
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            data={itemData.eventDocumentations}
                            numColumns={2}
                            renderItem={({ item, index }) => {
                              return (
                                
                             
                                <View style={{
                                  flex: 1,
                                  width: '48%', 
                                  minHeight: 225,
                                  padding: 10, 
                                  
                                }}>
                                  
                                   <Pressable  onPress={() => {
                                                                  navigation.navigate('GalleryDetailSliderScreenEvent', {
                                                                      data: itemData.eventDocumentations,
                                                                      selectedIndex: index,
                                                                  });
                                                              }}>
                              <ImageBackground source={{uri: item.media}} resizeMode="cover"  imageStyle={{ borderRadius: 6}} style={{
                          flex: 1,
                          justifyContent: "flex-end",
                          borderRadius: 4,
                          minHeight: 205,
                          marginBottom: 0, 
                          padding: 10,
                          borderRadius: 0, 
                          backgroundColor: 'grey'
                          }}> 
                           
                              </ImageBackground>
                              </Pressable>
                            </View>
                              );
                
                            }
                            }
                           
                        />
                </View>
      </ScrollView>
      {/* <ModalContentOptions
        ref={modalOptionsRef}
        // isOwner={user && user.userId === item.ownerId}
        // item={item}
      /> */}
    </Scaffold>
  );
};

export default DocumentasiDetails;
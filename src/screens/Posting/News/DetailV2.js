import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView, Pressable, FlatList, TouchableOpacity, ActivityIndicator, useWindowDimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Banner from 'src/components/Banner';
import {queryBannerList} from '@src/lib/query/banner';
import { useIsFocused } from '@react-navigation/native';
import {
  useLoading,
  usePopup,
  useColor,
  Header,
  Row,
  Col,
} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {Container, Divider} from '@src/styled';
import {
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {
  iconWarning,
  iconHeart,
  iconShare,
  iconBookmarks,
} from '@assets/images/home';
import {useSelector} from 'react-redux';
import Client from '@src/lib/apollo';
import {queryAddLike, queryComment, queryProductManageV2} from '@src/lib/query';
import WidgetUserLikes from 'src/components/Posting/WidgetUserLikes';
import ModalContentOptions from 'src/components/ModalContentOptions';
import ImagesPath from 'src/components/ImagesPath';
import {analyticMethods, GALogEvent} from 'src/utils/analytics';

// Fonts
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchLikeComment } from 'src/api/likeComment';
import { fetchProductSave } from 'src/api/productSave';
import { fetchContentProduct } from 'src/api/contentV2';
import { fetchContentShare } from 'src/api/contentShare';
import Share from 'react-native-share';
import Modal from 'react-native-modal';


const NewsDetailV2 = ({navigation, route}) => {
  const [refreshComment, setRefreshComment] = useState(false);
  const {code} = route.params;
  console.log(code, "codeee");
  const modalOptionsRef = useRef();
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [listBanner, setListBanner] = useState([]);
  const isFocused = useIsFocused();
  const [isModalVisible, setModalVisible] = useState(false);
  const user = useSelector(state => state['user.auth'].login.user);
  const [item, setItem] = useState(null);
  // const [bookmark, setBookmark] = useState(item.im_save);
  const [state, changeState] = useState({});
  const [listComment, setListComment] = useState([]);
  const setState = obj => changeState({...state, ...obj});
  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  const {Color} = useColor();
  const {width} = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    const timeout = trigger ? setTimeout(() => {
        fetchAddLike();
    }, 500) : null;

    return () => {
        clearTimeout(timeout);
    }
}, [trigger]);

  const fetchData = async() => {
    const variables = {
      productCategory: 'ARTIKEL',
      productCode: code,
    }
    const result = await fetchContentProduct(variables);
    console.log(result.data[0]);
    setItem(result.data[0]);
    changeState({
      im_like: result.data[0].im_like,
      like: result.data[0].like,
      bookmark: result.data[0].im_save
    })
    scrollRef.current?.scrollTo({
      y: 0,
      // animated: true,
    });
  }

  console.log(item, "items");

  useEffect(() => {
    fetchData();

  }, [isFocused]);

  useEffect(() => {
    if(item){
      fetchCommentList();
      fetchBannerList();
    }
  }, [isFocused, item]);

  useEffect(() => {
    if (refreshComment && item && item.comment > 0) {
      fetchCommentList();
      setRefreshComment(false);
    }
  }, [refreshComment]);

  const fetchBannerList = () => {
    const variables = {
      categoryId: 1,
    };

    Client.query({
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

  const fetchAddLike = () => {
    // showLoading();
    Client.query({
      query: queryAddLike,
      variables: {
        productId: item.id,
      },
    })
      .then(res => {
        console.log(res, 'res add like');
        if (res.data.contentAddLike.id) {
          if (res.data.contentAddLike.status === 1) {
            setTrigger(false);
          } else {
            setTrigger(false);
          }
        }
      })
      .catch(err => {
        console.log(err, 'err add like');
        // hideLoading();
      });
  };

  const onSubmitLike = () => {
    console.log("siniii");
    if(state.im_like){
      setState({
        im_like: false,
        like: state.like - 1,
      });
    }else{
      setState({
        im_like: true,
        like: state.like + 1,
      });
    }
    setTrigger(true);
  }

  const fetchCommentList = () => {
    Client.query({
      query: queryComment,
      variables: {
        page: 0,
        itemPerPage: 2,
        productId: item.id,
      },
    })
      .then(res => {
        console.log(res, 'res list comm');
        setListComment(res.data.contentComment);
      })
      .catch(err => {
        console.log(err, 'err list comm');
      });
  };

  const onDelete = () => {
    const variables = {
      products: [
        {
          code: item.code,
          name: item.productName,
          method: 'DELETE', // UPDATE | DELETE
        },
      ],
    };

    console.log(variables);

    Client.mutate({
      mutation: queryProductManageV2,
      variables,
    })
      .then(res => {
        console.log(res, '=== Berhsail ===');
        const data = res.data.contentProductManageV2;

        if (Array.isArray(data) && data.length > 0 && data[0]['id']) {
          showLoading('success', 'Artikel berhasil dihapus!');

          setTimeout(() => {
            navigation.navigate('NewsScreenV2', {title: 'Artikel'});
          }, 2500);
        } else {
          showLoading('error', 'Artikel gagal dihapus!');
        }
      })
      .catch(err => {
        console.log(err, 'errrrr');
        showLoading('error', 'Gagal membuat thread, Harap ulangi kembali');
      });
  }

  const onShare = (value) => {
    const shareOptions = {
      message: value
    }
    Share.open(shareOptions);
    fetchContentShare({code: code});
    // Share.open(shareOptions)
    //   .then((res) => {
    //     console.log(res, "res");
    //     if(res.success) fetchContentShare({code: code});
    //   })
    //   .catch((err) => {
    //   err && console.log(err, "err share");
    // });
  }

  function Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const renderComment = (itemComment, index) => {
    var time = moment(+itemComment.commentDate).fromNow();

    if (time.includes('hari')) {
      time = moment(+itemComment.commentDate).format('DD/MM HH:mm');
    }
    return (
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: itemComment.image}}
          style={{width: 32, aspectRatio: 1, borderRadius: 16}}
        />
        <Divider width={8} />
        <View style={{flexDirection: 'column'}}>
          <View
            style={{
              flexDirection: 'column',
              paddingHorizontal: 10,
              paddingVertical: 6,
              backgroundColor: '#F2F2F2',
              maxWidth: '95%',
              minWidth: '92%',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Entypo
                name={'shield'}
                color={Color.secondary}
                style={{marginRight: 5}}
              />
              <Text size={14} color="#000000" type="bold">
                {itemComment.fullname}
              </Text>
            </View>
            <Divider height={10} />
            <Text size={11} align="left" fontWeight={500} numberOfLines={2}>
              {itemComment.comment}
            </Text>
          </View>

          <Divider height={8} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              maxWidth: '95%',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text color={Color.gray} size={8}>
                {time}
              </Text>
              <Divider width={16} />
              <TouchableOpacity onPress={async() => {
                const res = await fetchLikeComment({commentId: itemComment.id});
                if(res.status == true){
                  setRefreshComment(true);
                }
              }}>
              <Text type={itemComment.im_like ? 'bold' : ''} color={itemComment.im_like ? Color.red : Color.gray} size={8}>
                Suka
              </Text>
              </TouchableOpacity>
              <Divider width={16} />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CommentReplyScreen', {
                    item,
                    parentComment: {...itemComment, index},
                    onRefresh: () => {
                      setRefreshComment(true);
                    },
                  })
                }>
                <Text color={Color.gray} size={8}>
                  Balas
                </Text>
              </TouchableOpacity>
            </View>
            <Text color={Color.gray} size={8}>
              {itemComment.likeCount} Suka
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderskeleton = () => {
    return (
      <View
        style={{
          width: width,
          aspectRatio: 16/9,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Color.textInput,
          }}
        >
          <ActivityIndicator size="large" color={Color.primary} />
          <Divider />
          <Text>Memuat</Text>
        </View>
      </View>
    );
  };

  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      header={
        <Header
          title=""
          actions={
            <View
              style={{
                flexDirection: 'row',
                marginTop: 6,
                width: '50%',
                alignItems: 'center',
                height: '80%',
              }}>
              <TouchableOpacity
                style={{marginRight: 15}}
                onPress={async() => {
                  const res = await fetchProductSave({productId: item.id});
                  if(res.status == true){
                    setState({
                      bookmark: !state.bookmark
                    });
                  }
                }}>
                {state.bookmark == true ? (
                  <FontAwesome name={'bookmark'} size={24} />
                ) : (
                  <FontAwesome name={'bookmark-o'} size={24} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  modalOptionsRef.current.open();
                }}>
                <Entypo name={'dots-three-vertical'} size={20} />
              </TouchableOpacity>
            </View>
          }
        />
      }
      loadingProps={loadingProps}>
      {!item ? (
        renderskeleton()
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
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
                aspectRatio: 4 / 3,
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('GalleryDetailScreen', {
                    id: item.id,
                    image: item.image,
                  });
                }}>
                <Image
                  source={{uri: item.image}}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: Color.border,
                    // position: 'absolute',
                  }}
                />
                {item.imageSource != null && item.imageSource != "" &&
                <Text
                  style={{
                    position: 'absolute',
                    color: Color.border,
                    fontSize: 8,
                    bottom: 10,
                    left: 15,
                  }}>
                  Sumber Gambar : {item.imageSource}
                </Text>}
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
                  paddingHorizontal: 15,
                  paddingBottom: 16,
                }}>
                <Text type="bold" align="left" size={18} style={{width: '80%'}}>
                  {item.productName}
                </Text>
                <Divider height={6} />
                <Text align="left" size={10} color={Color.secondary}>
                  {moment(parseInt(item.created_date)).format('DD MMM YYYY')} |{' '}
                  {Capitalize(item.productSubCategory.toLowerCase())} | Ditulis oleh{' '}
                  {item.fullname}
                </Text>
              </View>
            </View>

            {item.like > 0 && (
              <Container paddingHorizontal={16}>
                <WidgetUserLikes id={item.id} title="Disukai" refresh={trigger === false} />
              </Container>
            )}

            <Divider />
            <Row style={{paddingHorizontal: 15, alignItems: 'center'}}>
              <MaterialCommunityIcons
                style={{marginRight: 5}}
                name={'comment-processing'}
                color={Color.secondary}
                size={12}
              />
              <Text style={{fontSize: 10, marginRight: 12}}>{listComment.length} Komentar</Text>
              <Entypo
                name={'share'}
                style={{marginRight: 5}}
                color={Color.secondary}
              />
              <Text style={{fontSize: 10, marginRight: 12}}>{item.shareCount}x dibagikan</Text>
              <AntDesign
                name={'eye'}
                style={{marginRight: 5}}
                size={18}
                color={Color.secondary}
              />
              <Text style={{fontSize: 10, marginRight: 12}}>{item.view} Melihat</Text>
            </Row>

            <View style={{padding: 16}}>
              <Text lineHeight={24} align="justify">
                &nbsp;&nbsp;&nbsp;&nbsp;
                {item.productDescription}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 'bold',
                textAlign: 'left',
                paddingHorizontal: 15,
              }}>
              Tags
            </Text>
            {item.tag.length != 0 && (
              <View
                style={{
                  padding: 16,
                  paddingTop: 8,
                  paddingBottom: 14,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  width: '100%',
                  flexDirection: 'row',
                }}>
                {item.tag.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      backgroundColor: Color.text,
                      borderRadius: 120,
                      marginRight: 10,
                      marginBottom: 10,
                    }}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('ShowAllNews', {title: item, tag: [item] })}
                      >
                        <Text size={11} type="bold" color={Color.textInput}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <Row
              style={{
                paddingVertical: 10,
                width: '93%',
                height: 65,
                borderRadius: 5,
                alignSelf: 'center',
                justifyContent: 'space-around',
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  onSubmitLike();
                  GALogEvent('Artikel', {
                    id: item.id,
                    product_name: item.productName,
                    user_id: user.userId,
                    method: analyticMethods.like,
                  });
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 100,
                }}>
                {state.im_like ? (
                  <View
                    style={{
                      width: 45,
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 45,
                      backgroundColor: Color.red,
                      borderRadius: 25,
                    }}>
                    <MaterialIcons
                      name={'favorite'}
                      size={25}
                      color={Color.theme}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 45,
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 45,
                      backgroundColor: Color.theme,
                      elevation: 1,
                      borderRadius: 25,
                    }}>
                    <MaterialIcons
                      name={'favorite-border'}
                      size={25}
                      color={Color.text}
                    />
                  </View>
                )}
                {/* <Text style={{fontSize: 18, marginHorizontal: 5}}>
                  {state.like}
                </Text> */}
                <Text
                  style={{fontSize: 14, marginHorizontal: 5, marginVertical: 10}}>
                  Suka
                </Text>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => navigation.navigate('CommentListScreen', {item})}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 100,
                }}>
                <View
                  style={{
                    width: 45,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 45,
                    backgroundColor: Color.theme,
                    elevation: 1,
                    borderRadius: 25,
                  }}>
                  <MaterialCommunityIcons
                    name={'comment-processing-outline'}
                    size={25}
                    color={Color.text}
                  />
                </View>
                {/* <Text style={{fontSize: 14, marginHorizontal: 5,marginVertical: 10}}>
                  {item.commentCount}
                </Text> */}
                <Text
                  style={{fontSize: 14, marginHorizontal: 5, marginVertical: 10}}>
                  Komentar
                </Text>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => onShare(item.share_link)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 100,
                }}>
                <View
                  style={{
                    width: 45,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 45,
                    backgroundColor: Color.theme,
                    elevation: 1,
                    borderRadius: 25,
                  }}>
                  <AntDesign name={'sharealt'} size={25} color={Color.text} />
                </View>
                <Text
                  style={{fontSize: 14, marginHorizontal: 5, marginVertical: 10}}>
                  Bagikan
                </Text>
              </TouchableWithoutFeedback>

              {/* <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 100
                }}>
                <IonIcons name={'eye-outline'} size={18} />
                <Text style={{fontSize: 18, marginHorizontal: 5}}>{item.view}</Text>
              </View> */}
            </Row>
            <Divider height={30} />
            <View
              style={{
                backgroundColor: Color.border,
                width: '90%',
                height: 1,
                marginVertical: 15,
                alignSelf: 'center',
              }}
            />

            <Banner data={listBanner} loading={loadingBanner} showHeader={false} />
            <Divider />

            {listComment.length > 0 && (
              <View style={{paddingHorizontal: 16}}>
                <Text size={10} color="#000000" align="left" type="bold">
                  Komentar
                </Text>
                <Divider height={16} />
                {listComment.map((comment, index) => {
                  return (
                    <View
                      // onPress={() =>
                      //   navigation.navigate('CommentListScreen', {item})
                      // }
                      key={index}>
                      {renderComment(comment, index)}
                    </View>
                  );
                })}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('CommentListScreen', {item});
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderColor: Color.primary,
                    borderWidth: 1,
                    width: '100%',
                    borderRadius: 30,
                    height: 50,
                    marginVertical: 15,
                  }}>
                  <Text style={{color: Color.primary}}>Lihat Semua Komentar</Text>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                backgroundColor: Color.border,
                width: '90%',
                height: 1,
                marginVertical: 15,
                alignSelf: 'center',
              }}
            />
            {/* <View
              style={{
                backgroundColor: Color.border,
                width: '96%',
                height: 1,
                marginVertical: 15,
                alignSelf: 'center',
              }}
            /> */}

            {/* artikel terkait */}
            {/* <Text
              style={{
                fontSize: 11,
                marginHorizontal: 15,
                fontWeight: 'bold',
                textAlign: 'left',
              }}>
              Artikel Terkait
            </Text>
            <Divider height={10} />
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            /> */}

            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              {/* Ini buat ngelike */}
              {/* <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={() => {
                        fetchAddLike();
                        GALogEvent('Artikel', {
                          id: item.id,
                          product_name: item.productName,
                          user_id: user.userId,
                          method: analyticMethods.like,
                        });
                    }}
                    style={{height: 70, width: 70, flexDirection: 'row', borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
                >
                    <Ionicons name='heart-outline' color={state.im_like ? Color.primary : Color.text} size={30} />
                    {item.like > 0 && <Text color={state.im_like ? Color.primary : Color.text}>{item.like} </Text>}
                </TouchableOpacity>
                <Text
                    size={12}
                    color={state.im_like ? Color.primary : Color.text}
                >
                    {state.im_like ? 'Disukai' : 'Suka'}
                </Text>
            </View> */}

              {/* Ini buat komentar */}
              {/* <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('CommentListScreen', { item });
                    }}
                    style={{height: 70, width: 70, flexDirection: 'row', borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
                >
                    <Ionicons name='chatbubble-ellipses-outline' color={Color.text} size={30} />
                    {item.comment > 0 && <Text>{item.comment} </Text>}
                </TouchableOpacity>
                <Text size={12}>Komentar</Text>
            </View> */}

              {/* <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                    backgroundColor: Color.textInput,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image source={iconShare} />
                </TouchableOpacity>
                <Text size={12}>Share</Text>
              </View> */}

              {/* <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                    backgroundColor: Color.textInput,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image source={iconWarning} />
                </TouchableOpacity>
                <Text size={12}>Lapor</Text>
              </View> */}
            </View>
            <Divider />
          </ScrollView>

          <Modal isVisible={isModalVisible}>
            <View
              style={{
                backgroundColor: Color.textInput,
                borderRadius: 20,
                paddingVertical: 16,
                paddingHorizontal: 24,
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 14, width: '70%'}}>
                Apakah kamu yakin ingin menghapus ini?
              </Text>
              <Divider height={16}/>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%'}}>
                <TouchableOpacity
                  onPress={() => {
                    console.log("sinii");
                    setModalVisible(false);
                  }}
                  style={{paddingVertical: 14, paddingHorizontal: 32, backgroundColor: '#9CA3A5', borderRadius: 120}}>
                  <Text size={14} color={Color.theme}>
                    Batal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!isModalVisible);
                    onDelete();
                  }}
                  style={{paddingVertical: 13, paddingHorizontal: 31, borderRadius: 120, borderColor: Color.danger, borderWidth: 1}}>
                  <Text size={14} color={Color.danger}>
                    Hapus
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <ModalContentOptions
            showpin={false}
            ref={modalOptionsRef}
            isOwner={user && user.userId === item.ownerId}
            item={item}
            editScreen={'EditNews'}
            onDelete={() => setModalVisible(!isModalVisible)}
            onShare={() => onShare(item.share_link)}
          />
        </>
      )}
    </Scaffold>
  );
};

export default NewsDetailV2;

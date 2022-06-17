import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView, Pressable, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

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
  TouchableOpacity,
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
import {queryAddLike, queryComment} from '@src/lib/query';
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

const NewsDetail = ({navigation, route}) => {
  const [bookmark, setBookmark] = useState(false);
  const {item} = route.params;
  const modalOptionsRef = useRef();

  console.log(item, 'item');

  const user = useSelector(state => state['user.auth'].login.user);

  const [state, changeState] = useState({
    im_like: item.im_like,
    like: item.like,
  });

  const [listComment, setListComment] = useState([]);

  const setState = obj => changeState({...state, ...obj});

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading] = useLoading();

  const {Color} = useColor();

  useEffect(() => {
    fetchCommentList();
    // const timeout = trigger ? setTimeout(() => {
    //     fetchAddLike();
    // }, 500) : null;

    // return () => {
    //     clearTimeout(timeout);
    // }
  }, []);

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
            // showLoading('success', 'Berhasil disukai');
            setState({
              im_like: true,
              like: state.like + 1,
            });
          } else {
            // showLoading('info', 'Batal disukai');
            setState({
              im_like: false,
              like: state.like - 1,
            });
          }
        }
      })
      .catch(err => {
        console.log(err, 'err add like');
        // hideLoading();
      });
  };

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

  console.log('user', item);

  const renderItem = ({item}) => (
    <View
      style={{
        borderRadius: 10,
        paddingVertical: 10,
        width: 170,
        backgroundColor: Color.theme,
        elevation: 5,
        marginHorizontal: 10,
        marginVertical: 10,
      }}>
      <Image
        source={item.image}
        style={{alignSelf: 'center', width: 150, height: 150, borderRadius: 10}}
      />
      <Text
        style={{
          fontWeight: 'bold',
          marginHorizontal: 10,
          marginVertical: 10,
          textAlign: 'left',
        }}>
        {item.title}
      </Text>
      <Text
        style={{
          fontSize: 10,
          lineHeight: 15,
          textAlign: 'justify',
          marginHorizontal: 10,
        }}>
        {item.isi}
      </Text>
      <Divider />
      <Text
        style={{
          fontSize: 10,
          color: Color.secondary,
          marginHorizontal: 10,
          textAlign: 'left',
        }}>
        {item.tanggal}
      </Text>
    </View>
  );

  const renderComment = (item) => {
    var time = moment(+item.commentDate).fromNow()

    if(time.includes("hari")){
      time = moment(+item.commentDate).format("DD/MM HH:mm");
    }
    return (
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: item.image}}
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
              minWidth: '75%',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Entypo
                name={'shield'}
                color={Color.secondary}
                style={{marginRight: 5}}
              />
              <Text size={14} color="#000000" type="bold">
                {item.fullname}
              </Text>
            </View>
            <Divider height={10} />
            <Text size={11} align="left" fontWeight={500} numberOfLines={2}>
              {item.comment}
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
              <Text color={Color.gray} size={8}>
                Suka
              </Text>
              <Divider width={16} />
              <Text color={Color.gray} size={8}>
                Balas
              </Text>
            </View>
            <Text color={Color.gray} size={8}>
              12 Suka hardcode
            </Text>
          </View>
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
                onPress={() => setBookmark(!bookmark)}>
                {bookmark == true ? (
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
      <ScrollView showsVerticalScrollIndicator={false}>
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
              {item.productSubCategory} | Ditulis oleh {item.fullname}
            </Text>
          </View>
        </View>

        {item.like > 0 && (
          <Container paddingHorizontal={16}>
            <WidgetUserLikes id={item.id} title="Disukai" />
          </Container>
        )}

        <View style={{padding: 16}}>
          <Text lineHeight={24} align="justify">
            &nbsp;&nbsp;&nbsp;&nbsp;
            {item.productDescription}
          </Text>
        </View>

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
                <Text size={11} type="bold" color={Color.textInput}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Row
          style={{
            paddingVertical: 20,
            width: '93%',
            height: 65,
            backgroundColor: Color.border,
            borderRadius: 5,
            alignSelf: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              fetchAddLike();
              GALogEvent('Artikel', {
                id: item.id,
                product_name: item.productName,
                user_id: user.userId,
                method: analyticMethods.like,
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {state.im_like ? (
              <MaterialIcons name={'favorite'} size={18} color={'red'} />
            ) : (
              <MaterialIcons name={'favorite-border'} size={18} />
            )}
            <Text style={{fontSize: 18, marginHorizontal: 5}}>
              {state.like}
            </Text>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('CommentListScreen', {item})}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialCommunityIcons
              name={'comment-processing-outline'}
              size={16}
            />
            <Text style={{fontSize: 18, marginHorizontal: 5}}>
              {item.commentCount}
            </Text>
          </TouchableWithoutFeedback>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IonIcons name={'eye-outline'} size={18} />
            <Text style={{fontSize: 18, marginHorizontal: 5}}>{item.view}</Text>
          </View>
        </Row>

        <View
          style={{
            backgroundColor: Color.border,
            width: '96%',
            height: 1,
            marginVertical: 15,
            alignSelf: 'center',
          }}
        />

        {listComment.length > 0 && (
          <View style={{paddingHorizontal: 16}}>
            <Text size={10} color="#000000" align="left" type="bold">
              Komentar
            </Text>
            <Divider height={16}/>
            {listComment.map((comment, index) => {
              return (
                <TouchableOpacity onPress={() => navigation.navigate('CommentListScreen', {item})} key={index}>
                  {renderComment(comment)}
                </TouchableOpacity>
              )
            })}
          </View>
        )}

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
            width: '95%',
            borderRadius: 30,
            height: 50,
            marginVertical: 15,
          }}>
          <Text style={{color: Color.primary}}>Lihat Semua Komentar</Text>
        </TouchableOpacity>

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

      <ModalContentOptions
        ref={modalOptionsRef}
        isOwner={user && user.userId === item.ownerId}
        item={item}
        editScreen={'EditNews'}
      />
    </Scaffold>
  );
};

export default NewsDetail;

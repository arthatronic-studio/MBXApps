import React, {useState, useEffect, useRef} from 'react';
import {View, FlatList, TextInput, Image, ActivityIndicator, useWindowDimensions} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import Moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {
  ModalListAction,
  Scaffold,
  Text,
  useColor,
  useLoading,
  usePopup,
} from '@src/components';

import Client from '@src/lib/apollo';
import {queryComment, queryDelComment, queryAddComment, queryContentCommentPinManage} from '@src/lib/query';
import { shadowStyle } from '@src/styles';
import { Alert } from '@src/components';
import {analyticMethods, GALogEvent} from 'src/utils/analytics';
import { Container, Divider, Row } from 'src/styled';
import { isIphoneNotch, listContentCategory } from 'src/utils/constants';
import CardComment from 'src/components/Card/CardComment';

const itemPerPage = 10;
const initSelectedComment = {
  id: 0,
  index: -1,
}

const CommentListScreen = ({ navigation, route }) => {
  const {item} = route.params;

  const [dataComment, setDataComment] = useState({
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
  });
  const [refreshComment, setRefreshComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState(initSelectedComment);
  const [isOwnerComment, setIsOwnerComment] = useState(false);
  const [isPinnedComment, setIsPinnedComment] = useState(false);
  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');
  const [textComment, setTextComment] = useState('');

  const modalListActionRef = useRef();

  const {Color} = useColor();
  const [loadingProps, showLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();
  const user = useSelector(state => state['user.auth'].login.user);
  const {height} = useWindowDimensions();
  
  const isOwnerProduct = user && !user.guest && user.userId === item.ownerId;

  useEffect(() => {
    if (item && item.comment > 0) {
      fetchCommentList('initial');
    } else {
      setDataComment({
        ...dataComment,
        loading: false,
        page: -1,
        loadNext: false,
      });
    }
  }, [item]);

  useEffect(() => {
    if (dataComment.page !== -1 && item) {
      fetchCommentList();
    }
  }, [dataComment.loadNext]);

  useEffect(() => {
    if (refreshComment && item && item.comment > 0) {
      fetchCommentList('initial');
      setRefreshComment(false);
    }
  }, [refreshComment]);

  const fetchCommentList = initial => {
    Client.query({
      query: queryComment,
      variables: {
        page: dataComment.page + 1,
        itemPerPage: itemPerPage,
        productId: item.id,
      },
    })
      .then(res => {
        console.log(res, 'res list comm');

        if (initial) {
          setDataComment({
            data: res.data.contentComment,
            loading: false,
            page: res.data.contentComment.length === itemPerPage ? 1 : -1,
            loadNext: false,
          });
        } else {
          setDataComment({
            data: dataComment.data.concat(res.data.contentComment),
            loading: false,
            page:
              res.data.contentComment.length === itemPerPage ? dataComment.page + 1 : -1,
            loadNext: false,
          });
        }
      })
      .catch(err => {
        console.log(err, 'err list comm');
        setDataComment({
          ...dataComment,
          loading: false,
          page: -1,
          loadNext: false,
        });
      });
  };

  const fetchDelComment = () => {
    // showLoading();

    if (selectedComment.id === 0) {
      return;
    }

    const variables = {
      id: selectedComment.id,
      productId: item.id,
    };

    console.log('vari', variables);
    
    Client.query({
      query: queryDelComment,
      variables,
    })
    .then((res) => {
      console.log('res del comment', res);

      const data = res.data.contentDelComment;

      // showLoading(data.success ? 'success' : 'error', data.message);

      setSelectedComment(initSelectedComment);

      let newData = [...dataComment.data];
      
      if (data.success) {
        // setRefreshComment(true);
        newData.splice(selectedComment.index, 1);
      }

      setDataComment({
        ...dataComment,
        data: newData,
      });
    })
    .catch((err) => {
        console.log(err, 'err del comment');
        // showLoading('error', 'Gagal menghapus');
    })
  }

  const fetchCommentPinManage = () => {
    if (!selectedComment) return;

    const variables = {
      commentId: selectedComment.id,
    };

    console.log('variables', variables);

    Client.query({
      query: queryContentCommentPinManage,
      variables,
    })
    .then((res) => {
      console.log('res pin manage', res);

      const data = res.data.contentCommentPinManage;

      if (data && data.success) {
        showPopup(data.message, 'success');
        setRefreshComment(true);
      } else {
        showPopup('Gagal menyematkan komentar', 'error');
      }
    })
    .catch((err) => {
      console.log('err pin manage', err);
      showPopup('Terjadi kesalahan jaringan', 'error');
    });
  }

  const onSubmitComment = () => {
    if (textComment === '') {
      alert('Isi komentar tidak boleh kosong');
      return;
    }

    const variables = {
      productId: item.id,
      comment: textComment,
      image: thumbImage,
    };

    console.log(variables, 'variables');
    
    Client.query({
        query: queryAddComment,
        variables,
      })
      .then((res) => {
        console.log(res, 'res add comm');
        
        if (res.data.contentAddComment.id) {
          const arrNew = [res.data.contentAddComment].concat(dataComment.data);
        
          setTextComment('');
          setDataComment({ ...dataComment, data: arrNew });
          setThumbImage('');
          onSuccessComment(res.data.contentAddComment.productId);
        } else {
          showLoading('error', 'Gagal mengirimkan komentar');
        }
      })
      .catch((err) => {
          console.log(err, 'err add comm');
          showLoading('error', 'Gagal mengirimkan komentar');
      })
  }

  const onSubmitReply = (text) => {
    if (!selectedComment) return;

    if (text === '') {
      alert('Isi komentar tidak boleh kosong');
      return;
    }

    const variables = {
      productId: item.id,
      parentCommentId: selectedComment.id,
      comment: text,
    };

    console.log(variables, 'variables');

    Client.query({
      query: queryAddComment,
      variables,
    })
    .then((res) => {
      console.log(res, 'res add comm');
      
      if (res.data.contentAddComment.id) {
        // const arrNew = [res.data.contentAddComment].concat(dataComment.data);
      
        // setTextComment('');
        // setDataComment({ ...dataComment, data: arrNew });
        onSuccessComment(res.data.contentAddComment.productId);
      } else {
        showLoading('error', 'Gagal mengirimkan komentar');
      }
    })
    .catch((err) => {
        console.log(err, 'err add comm');
        showLoading('error', 'Gagal mengirimkan komentar');
    })
  }

  const onSuccessComment = (id) => {
    setRefreshComment(true);
    const getObj = listContentCategory.filter((e => e.code === item.productCategory))[0];

    GALogEvent(getObj ? getObj.name : 'Uncategorized', {
      id: item.id,
      product_name: item.productName,
      user_id: user.userId,
      method: analyticMethods.comment,
    });
  }

  const ListFooterComponent = () => {
    if (!dataComment.loading && dataComment.page !== -1) {
      return (
        <>
          {dataComment.loadNext ?
            <Container padding={16}>
              <ActivityIndicator color={Color.primary} />
            </Container>
          :
            <TouchableOpacity
              onPress={() => setDataComment({ ...dataComment, loadNext: true })}
            >
              <Container padding={16}>
                <Text size={12}>Lihat lebih banyak</Text>
              </Container>
            </TouchableOpacity>}
        </>
      )
    }

    return <View />;
  }

  const renderContent = () => {
    const title = 
      item.comment && item.comment > 0
        ? `Komentar ${item.comment}`
        : 'Belum Ada Komentar';
    
    return (
      <View style={{backgroundColor: Color.theme}}>
          <View style={{paddingHorizontal: 16}}>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12}}>
              <Text size={12}>{title}</Text>
            </View>

            <View style={{width: '100%', borderRadius: 4, backgroundColor: Color.textInput, ...shadowStyle, flexDirection:'row', justifyContent: 'space-between'}}>
                <TextInput
                  placeholder='Tulis Komentar..'
                  placeholderTextColor={Color.border}
                  value={textComment}
                  multiline
                  onChangeText={(e) => setTextComment(e)}
                  style={{
                    width:'80%',
                    fontSize: 12,
                    fontFamily: 'Inter-Regular',
                    color: Color.text,
                    paddingVertical: 8,
                    paddingLeft: 8,
                    paddingRight: 40,
                    minHeight: 45
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    const options = {
                      mediaType: 'photo',
                      maxWidth: 640,
                      maxHeight: 640,
                      quality: 1,
                      includeBase64: true,
                    }

                    launchImageLibrary(options, (callback) => {
                      setThumbImage(callback.base64);
                      setMimeImage(callback.type);
                    })
                  }}
                >
                  <View style={{width: 40, height: 40, alignItems:'center', justifyContent:'center'}}>
                    <Entypo name="camera" size={20} />
                  </View>
                </TouchableOpacity> 
                   
                <TouchableOpacity
                  onPress={() => {
                    onSubmitComment();
                  }}
                  style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}
                >
                  <View style={{width: 28, height: 28, borderRadius: 14, backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center'}}>
                    <Ionicons name='arrow-forward' color={Color.theme} size={18} />
                  </View>
                </TouchableOpacity>
            </View>
            
            {thumbImage !== '' && 
              <View style={{width: '100%', borderRadius: 4, backgroundColor: Color.textInput, ...shadowStyle, justifyContent: 'center', alignItems: 'center', paddingVertical: 16}}>
                <View
                  style={{width: '100%', aspectRatio: 16/9}}
                >
                  <Image
                    style={{height: '100%', width: '100%', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                    source={{ uri: `data:${mimeImage};base64,${thumbImage}` }}
                    resizeMode='contain'
                  />

                  <View style={{position: 'absolute', right: 16, top: -16}}>
                    <TouchableOpacity
                      onPress={()=> {
                        setThumbImage('');
                      }}
                    >
                      <Entypo name='circle-with-cross' size={30} color={Color.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }
            
          </View>

          {dataComment.loading ?
            <ActivityIndicator size='large' color={Color.secondary} style={{marginTop: 16}} />
          :
            <FlatList
              keyExtractor={(item, index) => item.toString() + index}
              data={dataComment.data}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={{
                paddingTop: 16,
                paddingBottom: isIphoneNotch() ? height / 3.5 : height / 2.5,
              }}
              ListFooterComponent={() => ListFooterComponent()}
              renderItem={({ item : itemComment, index }) => {
                const _isOwnerComment = user && !user.guest && user.userId === itemComment.userId;

                return (
                  <CardComment
                    item={itemComment}
                    productOwnerId={item.ownerId}
                    canReply
                    showOptions={_isOwnerComment || isOwnerProduct}
                    onPressDots={() => {
                      modalListActionRef.current.open();
                      setSelectedComment({ ...itemComment, index });
                      setIsOwnerComment(_isOwnerComment);
                      setIsPinnedComment(itemComment.isPinned);
                    }}
                    onPressReply={() => {
                      setSelectedComment({ ...itemComment, index });
                      navigation.navigate('CommentReplyScreen', {
                        ...route.params,
                        parentComment: { ...itemComment, index },
                        onRefresh: () => {
                          setRefreshComment(true);
                        }
                      });
                    }}
                  />
                );
              }}
          />}
        </View>
    )
  }

  const resetTempState = () => {
    setIsOwnerComment(false);
    setIsPinnedComment(false);
  }

  let dataListAction = [];
  
  if (isOwnerComment) {
    dataListAction.push({
      id: 1,
      name: 'Hapus',
      color: Color.red,
      onPress: () => {
        Alert('Hapus', 'Apakah Anda yakin menghapus komentar?', () => fetchDelComment());
        modalListActionRef.current.close();
        resetTempState();
      },
    });
  }

  if (isOwnerProduct) {
    dataListAction.push({
      id: 2,
      name: `${isPinnedComment ? 'Unpin' : 'Pin'} Komentar`,
      color: Color.text,
      onPress: () => {
        fetchCommentPinManage();
        modalListActionRef.current.close();
        resetTempState();
      },
    });
  }

  return (
    <Scaffold
      headerTitle="Komentar"
      empty={!item}
      loadingProps={loadingProps}
      popupProps={popupProps}
    >
      <View
        style={{
          width: '100%',
          height: 70,
          marginVertical: 16,
          paddingHorizontal: 16,
          flexDirection: 'row',
        }}>
        <View style={{width: '20%', height: '100%'}}>
          <Image
            source={{uri: item.image}}
            style={{
              height: 70,
              width: 70,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            }}
          />
        </View>
        <View
          style={{
            width: '80%',
            height: '100%',
            paddingHorizontal: 8,
            justifyContent: 'center',
            alignItems: 'flex-start',
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            backgroundColor: Color.textInput,
          }}>
          <Text type="semibold" numberOfLines={1}>
            {item ? item.productName : ''}
          </Text>
          <Text size={12} align="left" numberOfLines={2}>
            {item ? item.productDescription : ''}
          </Text>
        </View>
        {/* <View style={{width: '10%', height: '100%', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 8, borderBottomRightRadius: 8, backgroundColor: Color.textInput}}>
          <Fontisto name='angle-right' size={20} color={Color.text} style={{opacity: 0.6}} />
        </View> */}
      </View>

      {renderContent()}

      <ModalListAction
        ref={modalListActionRef}
        data={dataListAction}
        onClose={() => {
          resetTempState()
        }}
      />
    </Scaffold>
  );
};

export default CommentListScreen;

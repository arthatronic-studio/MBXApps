import React, { useRef, forwardRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Image,
  Platform,
  FlatList,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import { Header, ModalListAction, Scaffold, Text, useColor, useLoading, usePopup } from '@src/components';
import FormInput from '@src/components/FormInput';
import { Container, Divider, Row } from 'src/styled';
import CardComment from '@src/components/Card/CardComment';
import { useSelector } from 'react-redux';
import client from 'src/lib/apollo';
import { queryAddComment, queryContentCommentPinManage, queryDelComment } from 'src/lib/query';
import { Alert } from 'src/components/Alert';
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';
import { shadowStyle } from 'src/styles';
import { imageContentItem } from 'assets/images/content-item';

const itemPerPage = 10;
const initSelectedComment = {
  id: 0,
  index: -1,
};

const CommentReplyScreen = ({ navigation, route }) => {
  const [textReply, setTextReply] = useState('');
  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');
  const [modalImagePicker, setModalImagePicker] = useState(false);
  const [selectedComment, setSelectedComment] = useState(initSelectedComment);
  const [isOwnerComment, setIsOwnerComment] = useState(false);
  const [isPinnedComment, setIsPinnedComment] = useState(false);

  const modalListActionRef = useRef();

  const { Color } = useColor();
  const [loadingProps, showLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();
  const { width } = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);
  const isOwnerProduct = user && !user.guest && user.userId === route.params.item.ownerId;

  const onSubmitReply = () => {
    if (!selectedComment) return;

    if (textReply === '') {
      alert('Isi komentar tidak boleh kosong');
      return;
    }

    const variables = {
      productId: route.params.item.id,
      parentCommentId: route.params.parentComment.id,
      comment: textReply,
      image: thumbImage,
    };

    console.log(variables, 'variables');

    client.query({
      query: queryAddComment,
      variables,
    })
      .then((res) => {
        console.log(res, 'res add comm');

        if (res.data.contentAddComment.id) {
          // onSuccessComment(res.data.contentAddComment.productId);

          let newParentComment = route.params.parentComment;
          newParentComment.replies.push(res.data.contentAddComment);
          navigation.setParams({ parentComment: newParentComment });

          setTextReply('');
          setThumbImage('');
          route.params.onRefresh();
        } else {
          showLoading('error', 'Gagal mengirimkan komentar');
        }
      })
      .catch((err) => {
        console.log(err, 'err add comm');
        showLoading('error', 'Gagal mengirimkan komentar');
      })
  }

  const fetchDelComment = () => {
    // showLoading();

    if (selectedComment.id === 0) {
      return;
    }

    const variables = {
      id: selectedComment.id,
      productId: route.params.item.id,
    };

    console.log('vari', variables);

    client.query({
      query: queryDelComment,
      variables,
    })
      .then((res) => {
        console.log('res del comment', res);

        const data = res.data.contentDelComment;

        // showLoading(data.success ? 'success' : 'error', data.message);

        setSelectedComment(initSelectedComment);

        let newParentComment = route.params.parentComment;

        if (data.success) {
          route.params.onRefresh();
          newParentComment.replies.splice(selectedComment.index, 1);
        }

        navigation.setParams({ parentComment: newParentComment });
      })
      .catch((err) => {
        console.log(err, 'err del comment');
        // showLoading('error', 'Gagal menghapus');
      })
  }

  // const fetchCommentPinManage = () => {
  //   if (!selectedComment) return;

  //   const variables = {
  //     commentId: selectedComment.id,
  //   };

  //   console.log('variables', variables);

  //   client.query({
  //     query: queryContentCommentPinManage,
  //     variables,
  //   })
  //   .then((res) => {
  //     console.log('res pin manage', res);

  //     const data = res.data.contentCommentPinManage;

  //     if (data && data.success) {
  //       showPopup(data.message, 'success');
  //       setRefreshComment(true);
  //     } else {
  //       showPopup('Gagal menyematkan komentar', 'error');
  //     }
  //   })
  //   .catch((err) => {
  //     console.log('err pin manage', err);
  //     showPopup('Terjadi kesalahan jaringan', 'error');
  //   });
  // }

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

  // if (isOwnerProduct) {
  //   dataListAction.push({
  //     id: 2,
  //     name: `${isPinnedComment ? 'Unpin' : 'Pin'} Komentar`,
  //     color: Color.text,
  //     onPress: () => {
  //       fetchCommentPinManage();
  //       modalListActionRef.current.close();
  //       resetTempState();
  //     },
  //   });
  // }

  return (
    <Scaffold
      loadingProps={loadingProps}
      popupProps={popupProps}
      header={
        <Header
          title='Balas'
          centerTitle={false}
        // actions={
        //   <TouchableOpacity
        //     style={{ backgroundColor: Color.primary, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16 }}
        //     onPress={() => {
        //       onSubmitReply();
        //     }}
        //   >
        //     <Text color={Color.textButtonInline} type='medium'>Balas</Text>
        //   </TouchableOpacity>
        // }
        />
      }
    >
      {route.params.parentComment &&
        <>
          <Container>
            <CardComment
              item={route.params.parentComment}
              productOwnerId={route.params.item.ownerId}
              canReply={false}
              showOptions={false}
            />
          </Container>

          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', borderColor: Color.border, borderWidth: 0.5, borderColor: Color.border, alignItems: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => setModalImagePicker(true)}
                style={{ paddingRight: 8 }}
              >
                <Image
                  source={imageContentItem.camera}
                  style={{
                    height: 32,
                    width: 32,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>

              <View style={{ flex: 1, borderRadius: 8, backgroundColor: Color.border }}>
                <TextInput
                  placeholder='Tulis balasan kamu'
                  placeholderTextColor={Color.text}
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter-Regular',
                    color: Color.text,
                    backgroundColor: Color.border,
                    includeFontPadding: false,
                    marginTop: Platform.OS === 'android' ? 0 : 6,
                    marginBottom: Platform.OS === 'android' ? 0 : 10,
                    paddingHorizontal: 8,
                    maxHeight: 120,
                  }}
                  value={textReply}
                  multiline
                  onChangeText={(e) => setTextReply(e)}
                />
              </View>

              <View style={{ paddingLeft: 8 }}>
                <TouchableOpacity
                  onPress={() => {
                    onSubmitReply();
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Color.primary,
                  }}
                >
                  <Ionicons name='arrow-forward' color={Color.theme} size={18} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {thumbImage !== '' &&
            <View style={{ width: '100%', borderRadius: 4, backgroundColor: Color.textInput, ...shadowStyle, justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }}>
              <View
                style={{ width: '100%', aspectRatio: 16 / 9 }}
              >
                <Image
                  style={{ height: '100%', width: '100%', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}
                  source={{ uri: `data:${mimeImage};base64,${thumbImage}` }}
                  resizeMode='contain'
                />

                <View style={{ position: 'absolute', right: 16, top: -16 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setThumbImage('');
                    }}
                  >
                    <Entypo name='circle-with-cross' size={30} color={Color.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }

          <FlatList
            keyExtractor={(item, index) => item.id + index.toString()}
            data={Array.isArray(route.params.parentComment.replies) ? route.params.parentComment.replies : []}
            renderItem={({ item: itemReply, index }) => {
              const _isOwnerComment = user && !user.guest && user.userId === itemReply.userId;

              return (
                <CardComment
                  item={itemReply}
                  canReply={false}
                  productOwnerId={route.params.item.ownerId}
                  showOptions={_isOwnerComment || isOwnerProduct}
                  onPressDots={() => {
                    modalListActionRef.current.open();
                    setSelectedComment({ ...itemReply, index });
                    setIsOwnerComment(_isOwnerComment);
                    setIsPinnedComment(itemReply.isPinned);
                  }}
                />
              )
            }}
          />
        </>
      }

      <ModalListAction
        ref={modalListActionRef}
        data={dataListAction}
        onClose={() => {
          resetTempState()
        }}
      />

      <ModalImagePicker
        visible={modalImagePicker}
        withPreview
        onClose={() => {
          setModalImagePicker(false);
        }}
        onSelected={(callback) => {
          if (callback.base64) {
            setThumbImage(callback.base64);
            setMimeImage(callback.type);
          }

          setModalImagePicker(false);
        }}
      />
    </Scaffold>
  );
};

export default CommentReplyScreen;

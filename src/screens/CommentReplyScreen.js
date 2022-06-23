import React, {useRef, forwardRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Image,
  Platform,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {ModalListAction, Scaffold, Text, useColor, useLoading, usePopup} from '@src/components';
import FormInput from '@src/components/FormInput';
import { Container, Divider, Row } from 'src/styled';
import CardComment from '@src/components/Card/CardComment';
import { useSelector } from 'react-redux';
import client from 'src/lib/apollo';
import { queryAddComment, queryContentCommentPinManage, queryDelComment } from 'src/lib/query';
import { Alert } from 'src/components/Alert';

const itemPerPage = 10;
const initSelectedComment = {
  id: 0,
  index: -1,
}

const CommentReplyScreen = ({ navigation, route }) => {
  const [textReply, setTextReply] = useState('');
  const [selectedComment, setSelectedComment] = useState(initSelectedComment);
  const [isOwnerComment, setIsOwnerComment] = useState(false);
  const [isPinnedComment, setIsPinnedComment] = useState(false);
  const modalListActionRef = useRef();
  
  const {Color} = useColor();
  const [loadingProps, showLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();
  const {width} = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);
  const isOwnerProduct = user && !user.guest && user.userId === route.params.item.ownerId;

  const onSubmitReply = (text) => {
    if (!selectedComment) return;

    if (text === '') {
      alert('Isi komentar tidak boleh kosong');
      return;
    }

    const variables = {
      productId: route.params.item.id,
      parentCommentId: route.params.parentComment.id,
      comment: text,
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
        route.params.onRefresh();
      } else {
        showLoading('error', 'Gagal mengirimkan komentar else');
      }
    })
    .catch((err) => {
        console.log(err, 'err add comm');
        showLoading('error', 'Gagal mengirimkan komentar catch');
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

            <FlatList
              keyExtractor={(item, index) => item.id + index.toString()}
              data={Array.isArray(route.params.parentComment.replies) ? route.params.parentComment.replies : []}
              renderItem={({ item: itemReply, index }) => {
                const _isOwnerComment = user && !user.guest && user.userId === itemReply.userId;

                return (
                  <Container paddingLeft={32}>
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
                  </Container>
                )
              }}
            />
          </>
        }

        <View style={{paddingTop: 8, paddingHorizontal: 16}}>
          <FormInput
            placeholder='Masukan balasan komentar'
            multiline
            value={textReply}
            onChangeText={(val) => setTextReply(val)}
            suffixIcon={
              <TouchableOpacity
                onPress={() => {
                  onSubmitReply(textReply);
                }}
                style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}
              >
                <View style={{width: 28, height: 28, borderRadius: 14, backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center'}}>
                  <Ionicons name='arrow-forward' color={Color.theme} size={18} />
                </View>
              </TouchableOpacity>
            }
          />
        </View>

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

export default CommentReplyScreen;

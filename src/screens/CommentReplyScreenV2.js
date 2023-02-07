import React, {useRef, forwardRef, useState, useEffect} from 'react';
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

import {
  Header,
  ModalListAction,
  Scaffold,
  Text,
  useColor,
  useLoading,
  usePopup,
} from '@src/components';
import FormInput from '@src/components/FormInput';
import {Container, Divider, Row, Line} from 'src/styled';
import {useSelector} from 'react-redux';
import client from 'src/lib/apollo';
import {
  queryAddComment,
  queryContentCommentPinManage,
  queryDelComment,
} from 'src/lib/query';
import {Alert} from 'src/components/Alert';
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';
import {shadowStyle} from 'src/styles';
import {imageContentItem} from 'assets/images/content-item';
import PhotoProfile from 'src/components/PhotoProfile';
import moment from 'moment/moment';
import {fetchComment} from 'src/api-rest/fetchComment';
import {fetchGetComment} from 'src/api-rest/fetchGetComment';
import {useIsFocused} from '@react-navigation/native';
import CardCommentV2 from 'src/components/Card/CardCommentV2';
import {fetchDeleteComment} from 'src/api-rest/fetchDeleteComment';

const itemPerPage = 10;
const initSelectedComment = {
  id: 0,
  index: -1,
};

const initialListData = {
  data: [],
  loading: true,
  message: '',
  loadNext: false,
  page: 0,
  refresh: false,
  nextUrl: null,
};

const CommentReplyScreenV2 = ({navigation, route}) => {
  const {itemComment, type} = route.params;
  const isFocused = useIsFocused();
  const [textReply, setTextReply] = useState('');
  const [thumbImage, setThumbImage] = useState('');
  const [mimeImage, setMimeImage] = useState('image/jpeg');
  const [modalImagePicker, setModalImagePicker] = useState(false);
  const [selectedComment, setSelectedComment] = useState(initSelectedComment);
  const [isOwnerComment, setIsOwnerComment] = useState(false);
  const [isPinnedComment, setIsPinnedComment] = useState(false);

  const modalListActionRef = useRef();

  const {Color} = useColor();
  const [loadingProps, showLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();
  const {width} = useWindowDimensions();
  const auth = useSelector(state => state['auth']);

  const [listComment, setListComment] = useState(initialListData);

  useEffect(() => {
    if (isFocused) {
      fetchData(true);
    }
  }, [isFocused]);

  useEffect(() => {
    if (listComment.loadNext) {
      fetchData(false);
    }
  }, [listComment.loadNext]);

  const fetchData = async first => {
    let parameter = listComment.nextUrl
      ? listComment.nextUrl
      : `?perPage=10&parent_id=${itemComment.id}&category=evoria&type=${
          type + '_comment'
        }&recipient_user_apps_id=${itemComment.user.id}`;
    const res = await fetchGetComment(parameter);
    setListComment({
      ...listComment,
      data: first ? res.data : listComment.data.concat(res.data),
      nextUrl: res.nextUrl ? `?${res.nextUrl.split('?')[1]}` : null,
      loading: false,
      loadNext: false,
      refresh: false,
    });
  };

  const onComment = async () => {
    const body = {
      type: type + '_comment',
      category: 'evoria',
      parent_id: itemComment.id,
      message: textReply,
      recipient_user_apps_id: itemComment.user.id,
    };
    setTextReply('');
    const res = await fetchComment(body);
    if (res.success) {
      const newComment = res.data;
      setListComment({
        ...listComment,
        data: [newComment].concat(listComment.data),
      });
    }
  };

  const onDelete = async () => {
    const body = {
      id: selectedComment.id,
    };
    const res = await fetchDeleteComment(body);
    if (res.success) {
      const dataTemp = listComment.data;
      const newList = dataTemp.filter(item => item.id != selectedComment.id);
      setListComment({
        ...listComment,
        data: newList,
      });
      setSelectedComment({});
    }
  };

  // const onSubmitReply = () => {
  //   if (!selectedComment) return;

  //   if (textReply === '') {
  //     alert('Isi komentar tidak boleh kosong');
  //     return;
  //   }

  //   const variables = {
  //     productId: route.params.item.id,
  //     parentCommentId: route.params.parentComment.id,
  //     comment: textReply,
  //     image: thumbImage,
  //   };

  //   console.log(variables, 'variables');

  //   client
  //     .query({
  //       query: queryAddComment,
  //       variables,
  //     })
  //     .then(res => {
  //       console.log(res, 'res add comm');

  //       if (res.data.contentAddComment.id) {
  //         // onSuccessComment(res.data.contentAddComment.productId);

  //         let newParentComment = route.params.parentComment;
  //         newParentComment.replies.push(res.data.contentAddComment);
  //         navigation.setParams({parentComment: newParentComment});

  //         setTextReply('');
  //         setThumbImage('');
  //         route.params.onRefresh();
  //       } else {
  //         showLoading('error', 'Gagal mengirimkan komentar');
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err, 'err add comm');
  //       showLoading('error', 'Gagal mengirimkan komentar');
  //     });
  // };

  // const fetchDelComment = () => {
  //   // showLoading();

  //   if (selectedComment.id === 0) {
  //     return;
  //   }

  //   const variables = {
  //     id: selectedComment.id,
  //     productId: route.params.item.id,
  //   };

  //   console.log('vari', variables);

  //   client
  //     .query({
  //       query: queryDelComment,
  //       variables,
  //     })
  //     .then(res => {
  //       console.log('res del comment', res);

  //       const data = res.data.contentDelComment;

  //       // showLoading(data.success ? 'success' : 'error', data.message);

  //       setSelectedComment(initSelectedComment);

  //       let newParentComment = route.params.parentComment;

  //       if (data.success) {
  //         route.params.onRefresh();
  //         newParentComment.replies.splice(selectedComment.index, 1);
  //       }

  //       navigation.setParams({parentComment: newParentComment});
  //     })
  //     .catch(err => {
  //       console.log(err, 'err del comment');
  //       // showLoading('error', 'Gagal menghapus');
  //     });
  // };

  // const resetTempState = () => {
  //   setIsOwnerComment(false);
  //   setIsPinnedComment(false);
  // };

  // let dataListAction = [];

  // if (isOwnerComment) {
  //   dataListAction.push({
  //     id: 1,
  //     name: 'Hapus',
  //     color: Color.red,
  //     onPress: () => {
  //       Alert('Hapus', 'Apakah Anda yakin menghapus komentar?', () =>
  //         fetchDelComment(),
  //       );
  //       modalListActionRef.current.close();
  //       resetTempState();
  //     },
  //   });
  // }

  return (
    <Scaffold
      style={{backgroundColor: '#191919'}}
      loadingProps={loadingProps}
      popupProps={popupProps}
      header={
        <Header
          showIconLeftButton={true}
          customIcon={true}
          color={Color.text}
          style={{backgroundColor: Color.theme}}
        />
      }>
      <Container paddingHorizontal={16} paddingTop={16}>
        <Container flexDirection="row">
          <PhotoProfile
            url={itemComment?.user?.foto}
            name={itemComment?.user?.name}
            size={32}
            textSize={14}
          />
          <Container
            flex={1}
            flexDirection="column"
            marginLeft={6}
            align="flex-start">
            <Text size={14} lineHeight={16} type="medium" color={Color.text}>
              {itemComment?.user?.name}
            </Text>
            <Divider height={8} />
            <Text size={12} lineHeight={14} color={Color.text}>
              {itemComment.message}
            </Text>
            <Divider height={8} />
            <Container flexDirection="row" justifyContent="space-between">
              <Container flexDirection="row" flex={1}>
                <TouchableOpacity>
                  <Text size={12} lineHeight={14} color={Color.text}>
                    {itemComment.like_comment_count} Suka
                  </Text>
                </TouchableOpacity>
              </Container>
              <Text size={12} lineHeight={14} color={'#919C92'}>
                {moment(itemComment.created_at).fromNow()}
              </Text>
            </Container>
          </Container>
        </Container>

        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              width: '100%',
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <TextInput
                placeholder="Tulis balasan kamu"
                placeholderTextColor={Color.text}
                style={{
                  fontSize: 12,
                  fontFamily: 'Inter-Regular',
                  color: Color.text,
                  includeFontPadding: false,
                  marginTop: Platform.OS === 'android' ? 0 : 6,
                  marginBottom: Platform.OS === 'android' ? 0 : 10,
                  paddingHorizontal: 8,
                  maxHeight: 120,
                }}
                value={textReply}
                multiline
                onChangeText={e => setTextReply(e)}
              />
            </View>

            <View style={{paddingLeft: 8}}>
              <TouchableOpacity
                onPress={() => {
                  onComment();
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Color.primary,
                }}>
                <Ionicons name="arrow-forward" color={Color.theme} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <FlatList
          keyExtractor={(item, index) => item.id + index.toString()}
          data={listComment.data}
          ListFooterComponent={() => <Divider height={16} />}
          ItemSeparatorComponent={() => (
            <>
              <Divider height={16} />
              <Line
                height={1}
                width={width - 32}
                color={'rgba(237, 237, 237, 0.2)'}
              />
              <Divider height={16} />
            </>
          )}
          renderItem={({item: itemReply, index}) => {
            return (
              <CardCommentV2
                type={type}
                style={{padding: 0}}
                itemComment={itemReply}
                onPressDots={item => {
                  setSelectedComment(item);
                  modalListActionRef.current.open();
                }}
              />
            );
          }}
        />
      </Container>

      <ModalListAction
        ref={modalListActionRef}
        data={[
          {
            id: 0,
            name: 'Hapus',
            color: '#FF4343',
            onPress: () => {
              onDelete();
              modalListActionRef.current.close();
            },
          },
        ]}
      />
    </Scaffold>
  );
};

export default CommentReplyScreenV2;

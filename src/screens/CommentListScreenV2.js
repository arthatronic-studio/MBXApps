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
  KeyboardAvoidingView,
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
import PhotoProfile from 'src/components/PhotoProfile';
import moment from 'moment/moment';
import {fetchComment} from 'src/api-rest/fetchComment';
import {fetchGetComment} from 'src/api-rest/fetchGetComment';
import {useIsFocused} from '@react-navigation/native';
import CardCommentV2 from 'src/components/Card/CardCommentV2';
import {fetchDeleteComment} from 'src/api-rest/fetchDeleteComment';
import {imageBg} from 'assets/images/bg';

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

const CommentListScreenV2 = ({navigation, route}) => {
  const {item, type} = route.params;
  const isFocused = useIsFocused();
  const [comment, setComment] = useState('');
  const [selectedComment, setSelectedComment] = useState(initSelectedComment);

  const modalListActionRef = useRef();

  const {Color} = useColor();
  const [loadingProps, showLoading] = useLoading();
  const [popupProps, showPopup] = usePopup();
  const {width, height} = useWindowDimensions();
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
      : `?perPage=10&parent_id=${item.id}&category=blocx&type=${type}`;
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
      type: type,
      category: 'evoria',
      parent_id: item.id,
      message: comment,
    };
    setComment('');
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

  return (
    <Scaffold
      style={{backgroundColor: '#191919'}}
      loadingProps={loadingProps}
      popupProps={popupProps}
      header={
        <Header
          title="Komentar"
          centerTitle={false}
          showIconLeftButton={true}
          customIcon={true}
          color={Color.text}
          style={{backgroundColor: Color.theme}}
          actions={
            <View
              style={{
                width: 75,
                height: 24,
              }}>
              {/* <Image
                source={imageBg.evoria}
                style={{width: '100%', height: '100%'}}
              /> */}
            </View>
          }
        />
      }>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <FlatList
          keyExtractor={(item, index) => item.id + index.toString()}
          data={listComment.data}
          contentContainerStyle={{
            paddingTop: 32,
            paddingHorizontal: 16,
          }}
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
          renderItem={({item: itemComment, index}) => {
            return (
              <CardCommentV2
                type={type}
                style={{padding: 0}}
                itemComment={itemComment}
                onPress={() =>
                  navigation.navigate('CommentReplyScreenV2', {
                    itemComment: itemComment,
                    type: 'article',
                  })
                }
                onPressDots={item => {
                  setSelectedComment(item);
                  modalListActionRef.current.open();
                }}
              />
            );
          }}
        />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 16,
            justifyContent: 'space-between',
            backgroundColor: Color.secondary,
          }}>
          <View
            style={{
              flex: 0.9,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <PhotoProfile
              url={auth?.user?.foto}
              name={auth?.user?.name}
              size={24}
              textSize={10}
            />

            <View style={{flex: 1}}>
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
                value={comment}
                multiline
                onChangeText={e => setComment(e)}
              />
            </View>
          </View>

          <View style={{flex: 0.1, alignItems: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => {
                onComment();
              }}>
              <Ionicons name="md-send" color={Color.text} size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

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

export default CommentListScreenV2;

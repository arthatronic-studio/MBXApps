import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ActivityIndicator, useWindowDimensions} from 'react-native';
import Styled from 'styled-components';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {
  Header,
  ModalListAction,
  Scaffold,
  Text,
  useColor,
} from '@src/components';
import CardListComment from '@src/components/Card/CardListComment';

import Client from '@src/lib/apollo';
import {queryComment, queryDelComment} from '@src/lib/query';
import { Alert } from '@src/components';
import {analyticMethods, GALogEvent} from 'src/utils/analytics';
import { useSelector } from 'react-redux';
import { listMenuHome } from '@src/screens/MainHome/staticMenuHome';
import { Container, Divider } from 'src/styled';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { isIphoneNotch } from 'src/utils/constants';

const itemPerPage = 10;
const initSelectedComment = {
  id: 0,
  index: -1,
}

const CommentListScreen = ({navigation, route}) => {
  const {item} = route.params;

  const [dataComment, setDataComment] = useState({
    data: [],
    loading: true,
    page: 0,
    loadNext: false,
  });
  const [refreshComment, setRefreshComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState(initSelectedComment);

  const modalListActionRef = useRef();

  const {Color} = useColor();
  const user = useSelector(state => state['user.auth'].login.user);
  const {height} = useWindowDimensions();

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

  // const canManageComment = user && !user.guest && user.userId === item.userId;

  return (
    <Scaffold headerTitle="Komentar" empty={!item}>
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

      <CardListComment
        data={dataComment.data}
        item={item}
        title={
          item.comment && item.comment > 0
            ? `Komentar ${item.comment}`
            : 'Belum Ada Komentar'
        }
        loading={dataComment.loading}
        showAll={item.comment > 3 ? true : false}
        onSuccessComment={id => {
          setRefreshComment(true);
          const getObj = listMenuHome.filter((e => e.code === item.productCategory))[0];

          GALogEvent(getObj ? getObj.name : 'Uncategorized', {
            id: item.id,
            product_name: item.productName,
            user_id: user.userId,
            method: analyticMethods.comment,
          });

          // onSuccessComment(id)
        }}
        onPressShowAll={() => {
          // onPressShowAll(true);
        }}
        onPressDots={(item, index) => {
          modalListActionRef.current.open();
          setSelectedComment({
            ...selectedComment,
            id: item.id,
            index,
          });
        }}
        // onEndReached={() => setDataComment({ ...dataComment, loadNext: true })}
        ListFooterComponent={() => {
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

          return <View />
        }}
      />

      <ModalListAction
        ref={modalListActionRef}
        data={[
          {
            id: 0,
            name: 'Hapus',
            color: Color.red,
            onPress: () => {
              Alert('Hapus', 'Apakah Anda yakin menghapus konten?', () => fetchDelComment());
              modalListActionRef.current.close();
            },
          },
        ]}
      />
    </Scaffold>
  );
};

export default CommentListScreen;

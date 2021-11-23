import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Alert, SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {
    Header,
    ModalListAction,
    Text,
    useColor
} from '@src/components';
import CardListComment from '@src/components/Card/CardListComment';

import Client from '@src/lib/apollo';
import { queryComment } from '@src/lib/query';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const CommentListScreen = ({ navigation, route }) => {
    const { item } = route.params;

    const [dataComment, setDataComment] = useState({
        data: [],
        loading: true,
        page: 0,
        loadNext: false,
    });
    const [refreshComment, setRefreshComment] = useState(false);

    const modalListActionRef = useRef();

    const { Color } = useColor();

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

    const fetchCommentList = (initial) => {
        Client.query({
            query: queryComment,
            variables: {
              page: dataComment.page + 1,
              itemPerPage: 10,
              productId: item.id
            }
          })
          .then((res) => {
            console.log(res, 'res list comm');
            
            if (initial) {
                setDataComment({
                    data: res.data.contentComment,
                    loading: false,
                    page: res.data.contentComment.length === 10 ? 1 : -1,
                    loadNext: false,
                });
            } else {
                setDataComment({
                    data: dataComment.data.concat(res.data.contentComment),
                    loading: false,
                    page: res.data.contentComment.length === 10 ? dataComment.page + 1 : -1,
                    loadNext: false,
                });
            }
          })
          .catch((err) => {
            console.log(err, 'err list comm');
            setDataComment({
                ...dataComment,
                loading: false,
                page: -1,
                loadNext: false,
            });
          })
    }

    // const canManageComment = user && !user.guest && user.userId === item.userId;

    if (!item) {
        return (
            <MainView style={{backgroundColor: Color.theme}}>
                <Header title='' />
            </MainView>
        )
    }

    return (
        <MainView style={{backgroundColor: Color.theme}}>
            <Header title='Komentar' />

            <View style={{width: '100%', height: 70, marginVertical: 16, paddingHorizontal: 16, flexDirection: 'row'}}>
                <View style={{width: '20%', height: '100%'}}>
                    <Image source={{uri: item.image}} style={{height: 70, width: 70, borderTopLeftRadius: 8, borderBottomLeftRadius: 8}} />
                </View>
                <View style={{width: '80%', height: '100%', paddingHorizontal: 8, justifyContent: 'center', alignItems: 'flex-start', borderTopRightRadius: 8, borderBottomRightRadius: 8, backgroundColor: Color.textInput}}>
                    <Text type='semibold' numberOfLines={1}>{item ? item.productName : ''}</Text>
                    <Text size={12} align='left' numberOfLines={2}>{item ? item.productDescription : ''}</Text>
                </View>
                {/* <View style={{width: '10%', height: '100%', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 8, borderBottomRightRadius: 8, backgroundColor: Color.textInput}}>
                    <Fontisto name='angle-right' size={20} color={Color.text} style={{opacity: 0.6}} />
                </View> */}
            </View>

            <CardListComment
              data={dataComment.data}
              item={item}
              title={item.comment && item.comment > 0 ? `Komentar ${item.comment}` : 'Belum Ada Komentar'}
              loading={dataComment.loading}
              showAll={item.comment > 3 ? true : false}
              onSuccessComment={(id) => {
                setRefreshComment(true);
                // onSuccessComment(id)
              }}
              onPressShowAll={() => {
                // onPressShowAll(true);
              }}
              onPressDots={() => {
                modalListActionRef.current.open();
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
                            Alert('Hapus', 'Apakah Anda yakin menghapus konten?', () => {});
                            modalListActionRef.current.close();
                        },
                    }
                ]}
            />
        </MainView>
    )
}

export default CommentListScreen;
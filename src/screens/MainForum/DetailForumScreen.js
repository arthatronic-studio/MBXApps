import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TextInput, Dimensions, SafeAreaView, FlatList } from 'react-native';
import Styled from 'styled-components';
import Moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';

import {
    Alert,
    Text,
    useLoading,
    ModalListAction,
    TouchableOpacity,
    Scaffold,
    useColor
} from '@src/components';

import Client from '@src/lib/apollo';
import { queryContentProduct, queryComment, queryAddComment, queryDelComment } from '@src/lib/query';

import {
    imageBlank,
} from '@assets/images';
import CardForumVertical from './CardForumVertical';
import { Container, Divider } from 'src/styled';
import ModalContentOptions from 'src/components/ModalContentOptions';

const windowWidth = Dimensions.get('window').width;

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const DetailForumScreen = ({ route, navigation }) => {
    const { params } = route;

    // state
    const [item, setItem] = useState(params.item);
    const [selectedCommentId, setSelectedCommentId] = useState(-1);
    const [textComment, setTextComment] = useState('');
    const [dataComment, setDataComment] = useState({
        data: [],
        loading: true,
        page: 0,
        loadNext: false,
    });
    const [refreshComment, setRefreshComment] = useState(false);

    // ref
    const modalListActionRef = useRef();
    const modalOptionsRef = useRef();

    // hooks
    const [loadingProps, showLoading] = useLoading();
    const { Color } = useColor();

    // selector
    const user = useSelector(
        state => state['user.auth'].login.user
    );

    useEffect(() => {
        fetchContentProduct();
    }, []);

    useEffect(() => {
        if (refreshComment) {
            fetchContentProduct();

            if (item && item.comment > 0) {
                fetchCommentList('initial');
                setRefreshComment(false);
            }
        }
    }, [refreshComment]);

    // useEffect(() => {
    //     if (item && item.comment > 0) {
    //         fetchCommentList('initial');
    //     } else {
    //         setDataComment({
    //             ...dataComment,
    //             loading: false,
    //             page: -1,
    //             loadNext: false,
    //         });
    //     }
    // }, [item]);

    useEffect(() => {
        if (dataComment.page !== -1 && item) {
            fetchCommentList();
        }
    }, [dataComment.loadNext]);

    const fetchContentProduct = () => {
        Client.query({
            query: queryContentProduct,
            variables: {
                productCode: params.item.code
            }
        })
            .then((res) => {
                console.log(res, 'res detail');

                if (res.data.contentProduct.length > 0) {
                    setItem(res.data.contentProduct[0]);
                }
            })
            .catch((err) => {
                console.log(err, 'err detail');
            });
    }

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

    const submitComment = () => {
        if (textComment === '') {
            alert('Isi komentar tidak boleh kosong');
            return;
        }

        const variables = {
            productId: item.id,
            comment: textComment,
        };

        console.log(variables, 'variables');

        Client.query({
            query: queryAddComment,
            variables
        })
            .then((res) => {
                console.log(res, 'res add comm');

                if (res.data.contentAddComment.id) {
                    const arrNew = [res.data.contentAddComment].concat([]);

                    setTextComment('');
                    setRefreshComment(true);
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
        showLoading();

        const variables = {
            id: selectedCommentId,
            productId: item.id,
        };

        Client.query({
            query: queryDelComment,
            variables,
        })
            .then((res) => {
                const data = res.data.contentDelComment;

                showLoading(data.success ? 'success' : 'error', data.message);

                if (data.success) {
                    setRefreshComment(true);
                }
            })
            .catch((err) => {
                console.log(err, 'err add like');
                showLoading('error', 'Gagal menghapus');
            })
    }

    const managedDate = (origin) => {
        const date = Moment(origin);
        const now = new Moment();
        const diff = now.diff(Moment(date), 'days');

        let title = '';

        if (diff === 0) {
            title = 'Hari ini - ' + date.format('HH:mm');
        } else if (diff === 1) {
            title = 'Kemarin - ' + date.format('HH:mm');
        } else {
            title = date.format('dddd, DD/MM/YYYY - HH:mm');;
        }
        
        return title;
    }

    const renderHeader = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <CardForumVertical
                    item={item}
                    onPressDot={() => modalOptionsRef.current.open()}
                    showAllText
                    showVideo
                />

                <View style={{ width: '100%', paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, paddingTop: 16 }}>
                    <Text type='bold'>{item.comment} Tanggapan</Text>
                </View>
            </View>
        )
    }

    const renderItem = (item, index) => {
        const canManageComment = user && !user.guest && user.userId === item.userId;

        return (
            <View style={[
                { width: '100%', flexDirection: 'row', marginBottom: 2, paddingVertical: 8, paddingRight: 16 },
                index === 0 && { marginTop: 4 }
            ]}>
                <View style={{ width: '16%', alignItems: 'center', paddingTop: 4, paddingRight: 8, paddingLeft: 16 }}>
                    <Image source={{ uri: item.image }} style={{ width: '100%', aspectRatio: 1, borderRadius: 50, backgroundColor: Color.primary }} />
                </View>
                <View style={{ width: '84%' }}>
                    <View style={{flexDirection: 'row', padding: 8, borderRadius: 8, backgroundColor: Color.border}}>
                        <View style={{flex: 1}}>
                            <Text size={12} align='left' style={{ opacity: 0.75 }}>{item.fullname}</Text>
                            <Divider height={8} />
                            <Text size={12} align='left' type='medium'>{item.comment}</Text>
                        </View>
                        {canManageComment && <TouchableOpacity
                            onPress={() => {
                                modalListActionRef.current.open();
                                setSelectedCommentId(item.id);
                            }}
                            style={{ height: 30, alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Entypo name='dots-three-vertical' />
                        </TouchableOpacity>}
                    </View>

                    <Container paddingTop={8}>
                        <Text size={10} align='left' style={{ opacity: 0.75 }}>{managedDate(parseInt(item.commentDate))}</Text>
                    </Container>
                </View>
            </View>
        )
    }

    return (
        <Scaffold
            headerTitle='Detail'
            fallback={!item || dataComment.loading}
            loadingProps={loadingProps}
        >
            <FlatList
                keyExtractor={(item, index) => item.toString() + index}
                data={dataComment.data}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
                ListHeaderComponent={() => renderHeader()}
                renderItem={({ item, index }) => renderItem(item, index)}
                onEndReached={() => dataComment.page !== -1 && setDataComment({ ...dataComment, loadNext: true })}
                onEndReachedThreshold={0.3}
            />

            <View style={{ width: '100%', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 0.5, borderColor: Color.border }}>
                <View style={{ width: '100%', borderRadius: 4, borderColor: Color.border, borderWidth: 0.5, justifyContent: 'center' }}>
                    <TextInput
                        placeholder='Tulis Tanggapan'
                        placeholderTextColor={Color.text}
                        style={{ fontSize: 12, fontFamily: 'Inter-Regular', color: Color.text, marginTop: 8, marginBottom: 16, paddingLeft: 16, paddingRight: 40 }}
                        value={textComment}
                        multiline
                        onChangeText={(e) => setTextComment(e)}
                    />

                    <TouchableOpacity
                        onPress={() => {
                            submitComment();
                        }}
                        style={{ width: 40, height: 40, position: 'absolute', bottom: -2, right: 4, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name='arrow-forward' color={Color.theme} size={18} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

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
                    }
                ]}
            />

            <ModalContentOptions
                ref={modalOptionsRef}
                isOwner={user && user.userId === item.ownerId}
                item={item}
            />
        </Scaffold>
    )
}

export default DetailForumScreen;
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TextInput, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';

import {
    Alert,
    Text,
    useLoading,
    ModalListAction,
    TouchableOpacity,
    Scaffold,
    useColor,
    ScreenEmptyData,
    usePopup
} from '@src/components';
import Client from '@src/lib/apollo';
import { queryContentProduct, queryComment, queryAddComment, queryDelComment } from '@src/lib/query';
import CardForumVertical from './CardForumVertical';
import { Container, Divider, Row } from 'src/styled';
import ModalContentOptions from 'src/components/ModalContentOptions';
import { imageContentItem } from 'assets/images/content-item';
import CardComment from 'src/components/Card/CardComment';
import ModalImagePicker from 'src/components/Modal/ModalImagePicker';
import { shadowStyle } from 'src/styles';
import { fetchLikeComment } from 'src/api/likeComment';
import { initialItemState } from 'src/utils/constants';

const initSelectedComment = {
    id: 0,
    index: -1,
};

const DetailForumScreen = ({ route, navigation }) => {
    const { params } = route;

    // state
    const [item, setItem] = useState(params.item);
    const [selectedComment, setSelectedComment] = useState(initSelectedComment);
    const [isOwnerComment, setIsOwnerComment] = useState(false);
    const [isPinnedComment, setIsPinnedComment] = useState(false);
    const [textComment, setTextComment] = useState('');
    const [dataComment, setDataComment] = useState(initialItemState);

    const [thumbImage, setThumbImage] = useState('');
    const [mimeImage, setMimeImage] = useState('image/jpeg');
    const [modalImagePicker, setModalImagePicker] = useState(false);

    // ref
    const modalListActionRef = useRef();
    const modalOptionsRef = useRef();

    // hooks
    const [loadingProps, showLoading] = useLoading();
    const [popupProps, showPopup] = usePopup();
    const { Color } = useColor();
    const dispatch = useDispatch();

    // selector
    const user = useSelector(
        state => state['user.auth'].login.user
    );

    useEffect(() => {
        fetchContentProduct();
        fetchCommentList();
    }, []);

    useEffect(() => {
        if (dataComment.refresh) {
            fetchContentProduct();
            fetchCommentList();
        }
    }, [dataComment.refresh]);

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

                    const data = {
                        name: 'PRODUCT_FORUM',
                        item: res.data.contentProduct[0],
                    };
                    dispatch({ type: 'ITEM_UPDATE.ADD', data });
                }
            })
            .catch((err) => {
                console.log(err, 'err detail');
            });
    }

    const fetchCommentList = () => {
        Client.query({
            query: queryComment,
            variables: {
                page: dataComment.refresh ? 1 : dataComment.page + 1,
                itemPerPage: 10,
                productId: item.id
            }
        })
            .then((res) => {
                console.log(res, 'res list comm');

                setDataComment({
                    ...dataComment,
                    data: dataComment.refresh ? res.data.contentComment : dataComment.data.concat(res.data.contentComment),
                    page: res.data.contentComment.length === 10 ? dataComment.page + 1 : -1,
                    loading: false,
                    loadNext: false,
                    refresh: false,
                });
            })
            .catch((err) => {
                console.log(err, 'err list comm');
                setDataComment({
                    ...dataComment,
                    page: -1,
                    loading: false,
                    loadNext: false,
                    refresh: false,
                });
            })
    }

    const onSubmitComment = () => {
        if (textComment === '') {
            showPopup('Isi komentar tidak boleh kosong', 'warning');
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
            variables
        })
            .then((res) => {
                console.log(res, 'res add comm');

                if (res.data.contentAddComment.id) {
                    setTextComment('');                    
                    setThumbImage('');
                    
                    // let newArr = [res.data.contentAddComment].concat(dataComment.data);
                    // setDataComment({ ...dataComment, data: newArr });
                    setDataComment({ ...dataComment, refresh: true });
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
            id: selectedComment.id,
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
                    // let newArr = [ ...dataComment.data];
                    // newArr.splice(selectedComment.index, 1);
                    // setDataComment({ ...dataComment, data: newArr });
                    setDataComment({ ...dataComment, refresh: true });
                }
            })
            .catch((err) => {
                console.log(err, 'err add like');
                showLoading('error', 'Gagal menghapus');
            })
    }

    const renderHeader = () => {
        return (
            <>
                <View style={{ alignItems: 'center' }}>
                    <CardForumVertical
                        item={item}
                        onPressDot={() => modalOptionsRef.current.open()}
                        showAllText
                        showVideo
                    />

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
                                    placeholder='Tulis pendapat kamu'
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
                                    value={textComment}
                                    multiline
                                    onChangeText={(e) => setTextComment(e)}
                                />
                            </View>

                            <View style={{ paddingLeft: 8 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        onSubmitComment();
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
                </View>

                <Container paddingHorizontal={16} paddingTop={16} paddingBottom={10}>
                    <Text align='left'>Komentar Orang Lain</Text>
                </Container>
            </>
        )
    }

    const isOwnerProduct = user && !user.guest && user.userId === item.ownerId;

    const renderItem = (itemComment, index) => {
        const canManageComment = user && !user.guest && user.userId === itemComment.userId;
        const _isOwnerComment = user && !user.guest && user.userId === itemComment.userId;

        return (
            <CardComment
                item={itemComment}
                productOwnerId={item.ownerId}
                canReply
                // showOptions={_isOwnerComment || isOwnerProduct}
                showOptions={_isOwnerComment}
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
                            setDataComment({ ...dataComment, refresh: true });
                        }
                    });
                }}
                onRefresh={() => {
                    setDataComment({ ...dataComment, refresh: true });
                }}
                onPressLike={async () => {
                    setSelectedComment({ ...itemComment, index });
                    const res = await fetchLikeComment({commentId: itemComment.id});
                    if(res.status == true) {
                        setDataComment({ ...dataComment, refresh: true });
                    }
                }}
            />
        );
    }

    return (
        <Scaffold
            headerTitle='Detail'
            fallback={!item || dataComment.loading}
            loadingProps={loadingProps}
            popupProps={popupProps}
        >
            <FlatList
                keyExtractor={(item, index) => item.toString() + index}
                data={dataComment.data.length > 0 ? dataComment.data : [{ init: true }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
                renderItem={({ item, index }) => {
                    if (index === 0) {
                        if (item.init) {
                            return (
                                <>
                                    {renderHeader()}
                                    {!dataComment.loading && dataComment.data.length === 0 &&
                                        <View style={{width: '100%', aspectRatio: 16/9}}>
                                            <ScreenEmptyData
                                                message='Komentar belum tersedia'
                                            />
                                        </View>
                                    }
                                </>
                            )
                        }

                        return (
                            <>
                                {renderHeader()}
                                {renderItem(item, index)}
                            </>
                        )
                    }

                    return (
                        renderItem(item, index)
                    )
                }}
                onEndReached={() => dataComment.page !== -1 && setDataComment({ ...dataComment, loadNext: true })}
                onEndReachedThreshold={0.3}
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
                    }
                ]}
            />

            <ModalContentOptions
                ref={modalOptionsRef}
                isOwner={user && user.userId === item.ownerId}
                item={item}
                moduleType="FORUM"
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
    )
}

export default DetailForumScreen;
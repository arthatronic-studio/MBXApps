import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, useWindowDimensions, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';

import { useColor } from '@src/components';
import Text from '@src/components/Text';
import { TouchableOpacity } from '@src/components/Button';
import Client from '@src/lib/apollo';
import { queryLike } from '@src/lib/query';
import ImagesPath from 'src/components/ImagesPath';
import { Divider, Row } from 'src/styled';
import { useSelector } from 'react-redux';

const itemPerPage = 50;

const avatarDefault = 'https://storage.googleapis.com/sabyan-prod-music-box/images/avatar/avatar-default.png';

const WidgetUserLikes = ({ id, title }) => {
    const { Color } = useColor();
    const { width } = useWindowDimensions();

    const user = useSelector(state => state['user.auth'].login.user);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [itemData, setItemData] = useState({
        data: [],
        loading: true,
        page: 0,
        loadNext: false,
        refresh: false,
    });
    const [previewData, setPreviewData] = useState([]);

    useEffect(() => {
        fetchListLike();
    }, []);

    useEffect(() => {
        if (itemData.loadNext && itemData.page !== -1) {
            fetchListLike();
        }
    }, [itemData.loadNext]);

    const fetchListLike = () => {
        Client.query({
          query: queryLike,
          variables: {
            productId: id,
            page: itemData.page + 1,
            itemPerPage,
          }
        })
        .then((res) => {
          console.log(res, 'ressss like');

          const data = res.data.contentLike;

          if (Array.isArray(data)) {
            if (itemData.page === 0) {
                let newPreviewData = [];
                const lengthData = data.length > 5 ? 5 : data.length;
                
                for (let index = 0; index < lengthData; index++) {
                    const e = data[index];
                    newPreviewData.push(e);
                }
                
                setPreviewData(newPreviewData);
              }
          }

          setItemData({
            ...itemData,
            data: itemData.data.concat(res.data.contentLike),
            loading: false,
            page: res.data.contentLike.length === itemPerPage ? itemData.page + 1 : -1,
            loadNext: false,
          });
        })
        .catch((err) => {
          console.log(err, 'errrrr like');
          
          setItemData({
            ...itemData,
            loading: false,
            page: -1,
            loadNext: false,
          });
        })
    }

    console.log('previewData', previewData);

    return (
        <>
            <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
                style={{
                    height: 36,
                    flexDirection: 'row',
                }}
            >
                {previewData.map((item, idx) => {
                    return (
                        <View
                            key={idx}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                zIndex: previewData.length - idx,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: Color.textInput,
                                position: 'absolute',
                                left: 18 * idx,
                            }}
                        >
                            <Image
                                // source={
                                //     item.image ? { uri: item.image } :
                                //     idx === 0 ? ImagesPath.avatar1 :
                                //     idx === 1 ? ImagesPath.avatar2 :
                                //     idx === 2 ? ImagesPath.avatar3 :
                                //     idx === 3 ? ImagesPath.avatar4 :
                                //     idx === 4 ? ImagesPath.avatar5 :
                                //     ImagesPath.avatar1
                                // }
                                source={{uri: item.image ? item.image : avatarDefault}}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 18,
                                    borderWidth: 1,
                                    borderColor: Color.textInput,
                                    backgroundColor: Color.border,
                                }}
                            />
                        </View>
                    )
                })}
            </TouchableOpacity>

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
                animationIn="slideInDown"
                animationOut="slideOutDown"
            >
                <SafeAreaView>
                    <View style={{backgroundColor: Color.semiwhite, padding: 16, borderRadius: 8}}>
                        <Row justify='space-between'>
                            <Text align='left' size={12} type='bold'>{title}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsModalVisible(false)
                                }}
                                style={{
                                    alignSelf: 'flex-end',
                                    backgroundColor: Color.error,
                                    borderRadius: 50,
                                    marginBottom: 12,
                                }}>
                                <Image
                                    source={ImagesPath.icClose}
                                    style={{ width: 16, height: 16 }}
                                />
                            </TouchableOpacity>
                        </Row>

                        <FlatList
                            keyExtractor={(item, index) => item.toString() + index.toString()}
                            data={itemData.data}
                            numColumns={1}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{paddingTop: 16}}
                            onEndReachedThreshold={0.3}
                            onEndReached={() => setItemData({ ...itemData, loadNext: true })}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        style={{
                                            width: width - 16,
                                            marginBottom: 16,
                                        }}
                                    >
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Image
                                                source={{uri: item.image ? item.image : avatarDefault}}
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: 18,
                                                    marginRight: 16,
                                                    backgroundColor: Color.placeholder,
                                                }}
                                            />
                                            <Text align= 'left' size={14}>{item.fullname}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                            ListEmptyComponent={() => {
                                return (
                                    <ScreenEmptyData
                                        message='Loker belum tersedia'
                                        style={{width: width - 16}}
                                    />
                                )
                            }}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    );
};

export default WidgetUserLikes;
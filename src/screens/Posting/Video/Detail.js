import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, useWindowDimensions, Platform } from 'react-native';
import {
    Scaffold,
    Text,
    usePopup,
    useLoading,
    useColor,
    TouchableOpacity,
} from '@src/components';
import Client from '@src/lib/apollo';
import Video from 'react-native-video';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ImagesPath from 'src/components/ImagesPath';
import { VideoPlayerAndroid } from 'src/components/VideoPlayerAndroid';
import WebView from 'react-native-webview';
import FormInput from 'src/components/FormInput';
import { Divider } from 'src/styled';
import VideoPlayerIos from 'src/components/VideoPlayerIos';
import moment from 'moment';
import { queryAddLike } from 'src/lib/query';
import { fetchContentProductDetail } from 'src/api/content';

const Detail = ({ navigation, route }) => {
    const { item } = route.params;

    const { height, width } = useWindowDimensions();
    const { Color } = useColor();

    const [itemDetail, setItemDetail] = useState(item);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async() => {
        const result = await fetchContentProductDetail(item.code);
        console.log('result', result);
        if (result.status && result.data) {
            setItemDetail({ ...itemDetail, ...result.data });
        }
    }

    const fetchContentAddLike = () => {
        Client.query({
          query: queryAddLike,
          variables: {
            productId: item.id
          }
        })
        .then((res) => {
          // console.log(res, 'res add like');

          if (res.data.contentAddLike) {
            fetchContentProductDetail();

            if (res.data.contentAddLike.status === 1) {
                setItemDetail({ ...itemDetail, like: itemDetail.like += 1 });
            } else {
                setItemDetail({ ...itemDetail, like: itemDetail.like -= 1 });
            }
          }
        })
        .catch((err) => {
            console.log(err, 'err add like');
        })
    }

    return (
        <Scaffold

        >
            {Platform.OS === 'ios' ?
                <VideoPlayerIos
                    item={item}
                />
                :
                // <VideoPlayerAndroid
                //     item={{
                //         videoFilename: 'https://storage.googleapis.com/sabyan-prod-music-box/videos/ipul_inul/001_low_sabar.mp4',
                //     }}
                //     autoplay={false}
                // />
                <View
                    style={{
                        width,
                        aspectRatio: 16 / 9,
                    }}
                >
                    <WebView
                        source={{ uri: item.videoFilename }}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        allowsFullscreenVideo
                        injectedJavaScript={`document.getElementsByTagName("video")[0].controlsList="nodownload";`}
                    />
                </View>
            }

            <Divider height={8} />

            <ScrollView>
                <View style={{ marginHorizontal: 16, paddingTop: 8 }}>
                    <Text align='left' size={18}>
                        {item.productName}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginHorizontal: 16 }}>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
                        <Image
                            source={ImagesPath.eye}
                            size={16}
                            color={Color.gray}
                            style={{ marginRight: 6 }}
                        />
                        <Text align='left' size={12}>{item.view}</Text>
                    </View> */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
                        <Image
                            source={ImagesPath.heart}
                            size={16}
                            color={Color.gray}
                            style={{ marginRight: 6 }}
                        />
                        <Text align='left' size={12}>{itemDetail.like}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
                        <MaterialIcons
                            name='comment'
                            size={16}
                            color={Color.gray}
                            style={{marginRight: 6}}
                        />
                        <Text align='left' size={12}>{item.comment}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
                        <Image
                            source={ImagesPath.calendar}
                            size={16}
                            color={Color.gray}
                            style={{ marginRight: 6 }}
                        />
                        <Text align='left' size={12}>{moment(parseInt(item.created_date)).fromNow()}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginHorizontal: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => fetchContentAddLike()}
                            style={{ flexDirection: 'column', alignItems: 'center', marginRight: 16 }}
                        >
                            <Image
                                source={ImagesPath.fullHeart}
                                size={24}
                                style={{
                                    tintColor: itemDetail.im_like ? Color.error : Color.gray,
                                }}
                            />
                            <Text align='left' size={12}>Suka</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('CommentListScreen', { item })}
                            style={{ flexDirection: 'column', alignItems: 'center', marginRight: 16 }}
                        >
                            <MaterialIcons
                                name='comment'
                                size={24}
                                color={Color.gray}
                            />
                            <Text align='left' size={12}>Komentar</Text>
                        </TouchableOpacity>
                        
                        {/* <TouchableOpacity
                            style={{ flexDirection: 'column', alignItems: 'center' }}
                        >
                            <Image
                                source={ImagesPath.share}
                                size={24}
                                color={Color.gray}
                            />
                            <Text align='left' size={12}>Bagikan</Text>
                        </TouchableOpacity> */}
                    </View>
                    {/* <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Image
                            source={ImagesPath.bookmark}
                            size={24}
                            color={Color.gray}
                        />
                        <Text align='left' size={12}>Simpan</Text>
                    </View> */}
                </View>

                <View style={{ marginTop: 24, marginHorizontal: 16 }}>
                    <Text align='left' type='bold'>Deskripsi</Text>
                    <View style={{ marginTop: 8 }}>
                        <Text align='left'>
                            {item.productDescription}
                        </Text>
                    </View>
                </View>

                {/* <View style={{ marginTop: 24, marginHorizontal: 16 }}>
                    <Text align='left' type='bold'>Komentar</Text>
                    <View style={{ marginTop: 16 }}>
                        <FormInput
                            label='Komentar'
                            placeholder='Tulis Komentar'
                        />
                    </View>
                </View>

                <View style={{ marginTop: 8, marginHorizontal: 16 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                        <View style={{ borderRadius: 20, marginRight: 10 }}>
                            <Image
                                source={ImagesPath.avatar1}
                                size={40}
                            />
                        </View>
                        <View style={{ width: '85%' }}>
                            <Text align='left' size={14} color={Color.text}>Adang Susyano</Text>
                            <Text align='left' size={12} color={Color.gray}>2 Jam yang lalu</Text>
                            <Text align='left' size={12} color={Color.text} style={{ marginTop: 8 }}>Cupcake ipsum dolor sit amet donut. Toffee pie icing jelly beans biscuit bear claw. Icing jelly beans jelly-o ice cream topping marshmallow powder carrot cake.</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                        <View style={{ borderRadius: 20, marginRight: 10 }}>
                            <Image
                                source={ImagesPath.avatar2}
                                size={40}
                            />
                        </View>
                        <View style={{ width: '85%' }}>
                            <Text align='left' size={14} color={Color.text}>Hermansyah</Text>
                            <Text align='left' size={12} color={Color.gray}>2 Jam yang lalu</Text>
                            <Text align='left' size={12} color={Color.text} style={{ marginTop: 8 }}>Cupcake ipsum dolor sit amet donut. Toffee pie icing jelly beans biscuit bear claw. Icing jelly beans jelly-o ice cream topping marshmallow powder carrot cake.</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                        <View style={{ borderRadius: 20, marginRight: 10 }}>
                            <Image
                                source={ImagesPath.avatar3}
                                size={40}
                            />
                        </View>
                        <View style={{ width: '85%' }}>
                            <Text align='left' size={14} color={Color.text}>Anna Christine</Text>
                            <Text align='left' size={12} color={Color.gray}>2 Jam yang lalu</Text>
                            <Text align='left' size={12} color={Color.text} style={{ marginTop: 8 }}>Cupcake ipsum dolor sit amet donut. Toffee pie icing jelly beans biscuit bear claw. Icing jelly beans jelly-o ice cream topping marshmallow powder carrot cake.</Text>
                        </View>
                    </View>
                </View> */}
            </ScrollView>
        </Scaffold>
    )
}

export default Detail;
import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, useWindowDimensions, Platform } from 'react-native';
import {
    Scaffold,
    Text,
    usePopup,
    useLoading,
    useColor,
} from '@src/components';
import Client from '@src/lib/apollo';
import Video from 'react-native-video';

import ImagesPath from 'src/components/ImagesPath';
import { VideoPlayerAndroid } from 'src/components/VideoPlayerAndroid';
import WebView from 'react-native-webview';
import FormInput from 'src/components/FormInput';
import { Divider } from 'src/styled';

const Detail = () => {
    const { height } = useWindowDimensions();
    const { Color } = useColor();

    return (
        <Scaffold

        >
            {Platform.OS === 'ios' ?
                <Video
                    source={{ uri: "https://firebasestorage.googleapis.com/v0/b/tribes-social.appspot.com/o/videoplayback.mp4?alt=media&token=658dc8f3-d360-4fe1-9a89-8822f3c88035" }}
                    style={{
                        width: '100%',
                        aspectRatio: 3 / 2
                    }}
                    controls
                    fullscreen={false}
                    paused={false}
                    resizeMode='cover'
                />
                :
                // <VideoPlayerAndroid
                //     item={{
                //         videoFilename: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
                //     }}
                //     autoplay={false}
                // />
                <WebView
                    source={{ uri: "https://firebasestorage.googleapis.com/v0/b/tribes-social.appspot.com/o/videoplayback.mp4?alt=media&token=658dc8f3-d360-4fe1-9a89-8822f3c88035" }}
                    style={{
                        width: '100%',
                        aspectRatio: 3 / 2,
                    }}
                    allowsFullscreenVideo
                    injectedJavaScript={`document.getElementsByTagName("video")[0].controlsList="nodownload";`}
                />
            }

            <Divider height={8} />

            <ScrollView>
                <View style={{ marginHorizontal: 16, paddingTop: 8 }}>
                    <Text align='left' size={18}>
                        Naskah sang kuasa
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginHorizontal: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
                        <Image
                            source={ImagesPath.eye}
                            size={16}
                            color={Color.gray}
                            style={{ marginRight: 6 }}
                        />
                        <Text align='left' size={12}>654K.5K</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
                        <Image
                            source={ImagesPath.heart}
                            size={16}
                            color={Color.gray}
                            style={{ marginRight: 6 }}
                        />
                        <Text align='left' size={12}>65.9K</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
                        <Image
                            source={ImagesPath.calendar}
                            size={16}
                            color={Color.gray}
                            style={{ marginRight: 6 }}
                        />
                        <Text align='left' size={12}>8 Bulan yang lalu</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginHorizontal: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 16 }}>
                            <Image
                                source={ImagesPath.fullHeart}
                                size={24}
                                color={Color.gray}
                            />
                            <Text align='left' size={12}>Suka</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Image
                                source={ImagesPath.share}
                                size={24}
                                color={Color.gray}
                            />
                            <Text align='left' size={12}>Bagikan</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Image
                            source={ImagesPath.bookmark}
                            size={24}
                            color={Color.gray}
                        />
                        <Text align='left' size={12}>Simpan</Text>
                    </View>
                </View>

                <View style={{ marginTop: 24, marginHorizontal: 16 }}>
                    <Text align='left' size={14} color={Color.primary}>Deskripsi</Text>
                    <View style={{ marginTop: 16 }}>
                        <Text align='left' size={14}>
                            Cupcake ipsum dolor sit amet tart. Cookie carrot cake bear claw jujubes muffin. Cotton candy sweet candy chocolate muffin bonbon. Tart donut apple pie cupcake tart tart. Jelly-o chocolate cake ice cream shortbread biscuit chupa chups dessert. Macaroon cotton candy lollipop marshmallow dragée toffee shortbread macaroon dessert.
                        </Text>
                        <Text align='left' size={14} style={{ marginTop: 6 }}>
                            Bear claw gummi bears pie apple pie tiramisu soufflé bonbon. Tiramisu tart candy croissant jujubes marshmallow lemon drops. Ice cream muffin pastry halvah chocolate bar bear claw. Tart icing pudding jelly-o fruitcake fruitcake. Tiramisu sweet pastry caramels sugar plum sweet gingerbread. Macaroon powder gummies tootsie roll muffin. Cookie danish candy jelly beans biscuit. Soufflé cake pudding fruitcake macaroon jelly beans.
                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: 32, marginHorizontal: 16 }}>
                    <Text align='left' size={14} color={Color.primary}>Komentar</Text>
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
                </View>
            </ScrollView>
        </Scaffold>
    )
}

export default Detail;
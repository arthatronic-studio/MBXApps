import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, SafeAreaView, TouchableOpacity, Image, Keyboard, BackHandler, useWindowDimensions, Platform } from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from 'react-native-image-picker';
import {
    Header,
    Text,
    Popup, usePopup,
    Loading, useLoading,
    Submit,
    useColor
} from '@src/components';

import { queryJoinCommunity } from 'src/lib/query';
import ModalSelectChapter from 'src/components/Modal/ModalSelectChapter'
import validate from '@src/lib/validate';
import Client from '@src/lib/apollo';

import Video from 'react-native-video';

import ImagesPath from 'src/components/ImagesPath';
import { VideoPlayerAndroid } from 'src/components/VideoPlayerAndroid';
import WebView from 'react-native-webview';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const LabelInput = Styled(View)`
  width: 100%;
  justifyContent: flex-start;
  alignItems: flex-start;
`;

const EmailRoundedView = Styled(View)`
  width: 100%;
  height: 40px;
  alignItems: center;
  justifyContent: space-between;
  flexDirection: row;
  border-radius: 8px
`;

const CustomTextInput = Styled(TextInput)`
  width: 100%;
  height: 100%;
  fontFamily: Inter-Regular;
  backgroundColor: transparent;
  fontSize: 14px;
`;

const CustomTouch = Styled(TouchableOpacity)`
    backgroundColor: transparent;
`;

const Detail = () => {
    const { height } = useWindowDimensions();
    const { Color } = useColor();
    
    return (
        <MainView style={{backgroundColor: Color.theme}}>
                <Header
                    title=""
                />
                <ScrollView>
                        {Platform.OS === 'ios' ?
                            <Video
                                source={{uri: "https://firebasestorage.googleapis.com/v0/b/tribes-social.appspot.com/o/videoplayback.mp4?alt=media&token=658dc8f3-d360-4fe1-9a89-8822f3c88035"}}
                                style={{
                                    width: '100%',
                                    aspectRatio: 3/2
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
                                source={{uri: "https://firebasestorage.googleapis.com/v0/b/tribes-social.appspot.com/o/videoplayback.mp4?alt=media&token=658dc8f3-d360-4fe1-9a89-8822f3c88035"}}
                                style={{
                                    width: '100%',
                                    aspectRatio: 3/2,
                                }}
                                allowsFullscreenVideo
                                injectedJavaScript={`document.getElementsByTagName("video")[0].controlsList="nodownload";`}
                            />
                        }

                        <View style={{marginHorizontal: 16, paddingTop: 16}}>
                            <Text align='left' size={18}>
                                Big Buck Bunny
                            </Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8, marginHorizontal: 16}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 18}}>
                                <Image 
                                    source={ImagesPath.eye}
                                    size={16}
                                    color={Color.gray}
                                    style={{marginRight: 6}}
                                />
                                <Text align='left' size={12}>249.5M</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 18}}>
                                <Image 
                                    source={ImagesPath.heart}
                                    size={16}
                                    color={Color.gray}
                                    style={{marginRight: 6}}
                                />
                                <Text align='left' size={12}>10.9K</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 18}}>
                                <Image 
                                    source={ImagesPath.calendar}
                                    size={16}
                                    color={Color.gray}
                                    style={{marginRight: 6}}
                                />
                                <Text align='left' size={12}>6 Bulan yang lalu</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginHorizontal: 16}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{flexDirection: 'column', alignItems: 'center', marginRight: 16}}>
                                    <Image 
                                        source={ImagesPath.fullHeart} 
                                        size={24}
                                        color={Color.gray}
                                    />
                                    <Text align='left' size={12}>Suka</Text>
                                </View>
                                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                    <Image 
                                        source={ImagesPath.share} 
                                        size={24}
                                        color={Color.gray}
                                    />
                                    <Text align='left' size={12}>Bagikan</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                <Image 
                                    source={ImagesPath.bookmark} 
                                    size={24}
                                    color={Color.gray}
                                />
                                <Text align='left' size={12}>Simpan</Text>
                            </View>
                        </View>

                        <View style={{marginTop: 24, marginHorizontal: 16}}>
                            <Text align='left' size={14} color={Color.primary}>Deskripsi</Text>
                            <View style={{marginTop: 16}}>
                                <Text align= 'left' size={14}>
                                    Cupcake ipsum dolor sit amet tart. Cookie carrot cake bear claw jujubes muffin. Cotton candy sweet candy chocolate muffin bonbon. Tart donut apple pie cupcake tart tart. Jelly-o chocolate cake ice cream shortbread biscuit chupa chups dessert. Macaroon cotton candy lollipop marshmallow dragée toffee shortbread macaroon dessert.
                                </Text>
                                <Text align= 'left' size={14} style={{marginTop: 6}}>
                                    Bear claw gummi bears pie apple pie tiramisu soufflé bonbon. Tiramisu tart candy croissant jujubes marshmallow lemon drops. Ice cream muffin pastry halvah chocolate bar bear claw. Tart icing pudding jelly-o fruitcake fruitcake. Tiramisu sweet pastry caramels sugar plum sweet gingerbread. Macaroon powder gummies tootsie roll muffin. Cookie danish candy jelly beans biscuit. Soufflé cake pudding fruitcake macaroon jelly beans.
                                </Text>
                            </View>
                        </View>

                        <View style={{marginTop: 32, marginHorizontal: 16}}>
                            <Text align='left' size={14} color={Color.primary}>Komentar</Text>
                            <View style={{marginTop: 16}}>
                                <LabelInput>
                                    <Text size={10} letterSpacing={0.08} color={Color.gray} style={{marginBottom: 4}}>Komentar</Text>
                                </LabelInput>
                                <EmailRoundedView style={{borderWidth: 1, borderColor: Color.text}}>
                                    <CustomTextInput 
                                        placeholder='Tulis Komentar...'
                                        keyboardType='default'
                                        placeholderTextColor={Color.gray}
                                        underlineColorAndroid='transparent'
                                        autoCorrect={false}
                                        style={{color: Color.text}}
                                    />
                                </EmailRoundedView>
                            </View>
                        </View>

                        <View style={{marginTop: 34, marginHorizontal: 16}}>
                            <View style={{flexDirection: 'row', marginBottom: 16}}>
                                <View style={{borderRadius: 20, marginRight: 10}}>
                                    <Image 
                                        source={ImagesPath.avatar1}
                                        size={40}
                                    />
                                </View>
                                <View style={{width: '85%'}}>
                                    <Text align='left' size={14} color={Color.text}>Adang Susyano</Text>
                                    <Text align='left' size={12} color={Color.gray}>2 Jam yang lalu</Text>
                                    <Text align='left' size={12} color={Color.text} style={{marginTop: 8}}>Cupcake ipsum dolor sit amet donut. Toffee pie icing jelly beans biscuit bear claw. Icing jelly beans jelly-o ice cream topping marshmallow powder carrot cake.</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: 16}}>
                                <View style={{borderRadius: 20, marginRight: 10}}>
                                    <Image 
                                        source={ImagesPath.avatar2}
                                        size={40}
                                    />
                                </View>
                                <View style={{width: '85%'}}>
                                    <Text align='left' size={14} color={Color.text}>Hermansyah</Text>
                                    <Text align='left' size={12} color={Color.gray}>2 Jam yang lalu</Text>
                                    <Text align='left' size={12} color={Color.text} style={{marginTop: 8}}>Cupcake ipsum dolor sit amet donut. Toffee pie icing jelly beans biscuit bear claw. Icing jelly beans jelly-o ice cream topping marshmallow powder carrot cake.</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', marginBottom: 16}}>
                                <View style={{borderRadius: 20, marginRight: 10}}>
                                    <Image 
                                        source={ImagesPath.avatar3}
                                        size={40}
                                    />
                                </View>
                                <View style={{width: '85%'}}>
                                    <Text align='left' size={14} color={Color.text}>Anna Christine</Text>
                                    <Text align='left' size={12} color={Color.gray}>2 Jam yang lalu</Text>
                                    <Text align='left' size={12} color={Color.text} style={{marginTop: 8}}>Cupcake ipsum dolor sit amet donut. Toffee pie icing jelly beans biscuit bear claw. Icing jelly beans jelly-o ice cream topping marshmallow powder carrot cake.</Text>
                                </View>
                            </View>
                        </View>
                </ScrollView>
        </MainView>
    )
}

export default Detail
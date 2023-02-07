import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  ScrollView,
  Platform,
  useWindowDimensions,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useColor, Text, ModalListAction} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {Row, Divider, Container, Line} from 'src/styled';
import HighlightArticle from './HighlightArticle';
import imageAssets from 'assets/images';
import {useIsFocused} from '@react-navigation/native';
import WebView from 'react-native-webview';
import HtmlView from 'src/components/HtmlView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fetchLike} from 'src/api-rest/fetchLike';
import CardCommentV2 from 'src/components/Card/CardCommentV2';
import {fetchGetArticle} from 'src/api-rest/fetchGetArticle';
import {fetchGetComment} from 'src/api-rest/fetchGetComment';
import {fetchDeleteComment} from 'src/api-rest/fetchDeleteComment';
import YoutubePlayer from 'react-native-youtube-iframe';
import { NewVideoPlayerAndroid } from 'src/components/NewVideoPlayerAndroid';
import VideoPlayerIos from 'src/components/VideoPlayerIos';

const initialListData = {
  data: [],
  loading: true,
  message: '',
  loadNext: false,
  page: 0,
  refresh: false,
  nextUrl: null,
};

const RenderContent = ({url, type}) => {
  console.log(url, type, 'apanih');
  const {width, height} = useWindowDimensions();
  const [error, setError] = useState(false);
  const youtubeRef = useRef();
  const webviewRef = useRef();
  const {Color} = useColor();
  const [beforePlay, setBeforePlay] = useState(true);
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback(state => {
    console.log('state', state);
    if (state === 'playing') {
      setBeforePlay(false);
      setPlaying(true);
    } else if (state === 'ended') {
      setBeforePlay(true);
      setPlaying(false);
    } else if (state === 'paused') {
      setPlaying(false);
    }
  }, []);

  if (type == 'youtube') {
    return (
      <View
        style={{
          width: width - 32,
          aspectRatio: 16 / 9,
        }}>
        <YoutubePlayer
          ref={youtubeRef}
          width={'100%'}
          height={'100%'}
          play={playing}
          videoId={url}
          onChangeState={onStateChange}
          borderRadius={true}
          webViewStyle={{opacity: 0.99}}
        />
      </View>
    );
  }
  if (type == 'webview') {
    if (error) {
      return (
        <Container paddingVertical={8}>
          <Text size={14} lineHeight={14} color={Color.text}>
            Karya tidak ditemukan
          </Text>
        </Container>
      );
    } else {
      return (
        <View
          style={{
            width: width - 32,
            aspectRatio: 1,
          }}>
          <WebView
            ref={webviewRef}
            source={{uri: url}}
            allowsFullscreenVideo
            injectedJavaScript={`document.getElementsByTagName("video")[0].controlsList="nodownload";`}
            // allowsBackForwardNavigationGestures
            style={{opacity: 0.99}}
            onError={err => {
              setError(true);
            }}
          />
        </View>
      );
    }
  }
  if (type == 'video') {
    if (Platform.OS === 'ios')
      return (
        <View
          style={{
            width: width - 32,
            aspectRatio: 16 / 9,
          }}>
          <VideoPlayerIos
            item={{
              videoFileName: url,
            }}
          />
        </View>
      );
    else {
      return (
        <View
          style={{
            width: width - 32,
            aspectRatio: 16 / 9,
          }}>
          <NewVideoPlayerAndroid
            item={{
              videoFileName: url,
            }}
            hideOnError
            autoplay={true}
          />
        </View>
      );
    }
  }
  return (
    <Container paddingVertical={8}>
      <Text size={14} lineHeight={14} color={Color.text}>
        Video tidak ditemukan
      </Text>
    </Container>
  );
};

const DetailArticleScreen = ({navigation, route}) => {
  const {item} = route.params;
  const {Color} = useColor();
  const {height, width} = useWindowDimensions();
  const scrollRef = useRef();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [itemDetail, setItemDetail] = useState(item);
  const [likes, setLike] = useState(item?.liked_count ? item?.liked_count : 0);
  const [is_liked, setIsLike] = useState(
    item?.is_liked ? item?.is_liked : false,
  );
  const [listComment, setListComment] = useState(initialListData);

  const [selectedComment, setSelectedComment] = useState({});
  const modalListActionCommentRef = useRef();

  const fetchData = async () => {
    const param = `?article_id=${item.id}&category=blocx&type=article`;
    const res = await fetchGetArticle(param);
    console.log("sini nih", res);
    if (res.success) {
      setItemDetail(res?.data[0]);
      setIsLike(res?.data[0].is_liked);
      setLike(res?.data[0].liked_count);
    }
    setLoading(false);
  };

  const fetchDataComment = async first => {
    let parameter = listComment.nextUrl
      ? listComment.nextUrl
      : `?perPage=5&parent_id=${itemDetail.id}&category=blocx&type=article`;
    const res = await fetchGetComment(parameter);
    console.log(res, 'res nih')
    if(res.success){
      setListComment({
        ...listComment,
        data: first ? res.data : listComment.data.concat(res.data),
        nextUrl: res.nextUrl ? `?${res.nextUrl.split('?')[1]}` : null,
        loading: false,
        loadNext: false,
        refresh: false,
      });
    }
  };

  const onSubmitLike = async () => {
    const body = {
      type: 'article',
      category: 'blocx',
      parent_id: itemDetail.id,
    };
    const res = await fetchLike(body);
    if (res.success) {
      setLike(!is_liked ? likes + 1 : likes - 1);
      setIsLike(!is_liked);
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
      setTrigger(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
      fetchDataComment(true);
    }
  }, [isFocused]);

  const cardImage = (image, caption) => {
    return (
      <Container align="center">
        <Image
          source={{uri: image}}
          style={{
            width: '100%',
            height: width - 32,
            resizeMode: 'cover',
          }}
        />
        <Divider height={8} />
        {caption && (
          <>
            <Container width="80%">
              <Text size={9} lineHeight={15} color={'#AEAEAE'} type="medium">
                {caption}
              </Text>
            </Container>
            <Divider height={8} />
          </>
        )}
        <Container align="center" flex={1} flexDirection="row">
          <Image
            source={imageAssets.iconApp}
            style={{
              height: 8,
              width: 8,
              resizeMode: 'contain',
            }}
          />
          <Divider width={8} />
          <Image
            source={imageAssets.iconApp}
            style={{
              height: 8,
              width: 8,
              resizeMode: 'contain',
            }}
          />
          <Divider width={8} />
          <Image
            source={imageAssets.iconApp}
            style={{
              height: 8,
              width: 8,
              resizeMode: 'contain',
            }}
          />
        </Container>
      </Container>
    );
  };

  return (
    <Scaffold
      translucent={Platform.OS === 'ios' ? true : false}
      useSafeArea={Platform.OS === 'ios' ? false : true}>
      <ScrollView ref={scrollRef}>
        {/* <View
          style={{
            width: '100%',
            height: width * 1.21,
            paddingHorizontal: 16,
          }}>
          <Image
            source={{uri: item.images[0]}}
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          />
        </View> */}
        {/* <Divider height={18} /> */}
        {loading ? (
          <Container
            style={{
              width: '100%',
              height: 200,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 75,
            }}>
            <ActivityIndicator size="large" color={Color.secondary} />
            <Divider />
          </Container>
        ) : (
          <Container>
            <Container flex={1} flexDirection="column" paddingHorizontal={16}>
              {/* <Container
              flex={1}
              marginRight={4}
              flexDirection="row"
              align="flex-start">
              <Text size={12} type="medium" lineHeight={14.4}>
                ●
              </Text>
              <Divider width={4} />
              <Container flex={1}>
                <Text
                  align="left"
                  size={10}
                  lineHeight={14.4}
                  type="semibold"
                  color={Color.black}>
                  ARTICLE
                </Text>
                <Text align="left" size={10} lineHeight={12} type="medium">
                  {item.publisher} {item.created_at}
                </Text>
              </Container>
            </Container> */}
              {/* <Container flex={4} marginLeft={4}> */}
              {/* title */}
              <Text size={24} lineHeight={28.8} type="semibold" align="left">
                {itemDetail.title}
              </Text>

              <Divider height={16} />

              {/* subtitle */}
              <Text size={12} lineHeight={16} type="semibold" align="left">
                {itemDetail.subtitle}
              </Text>

              <Divider height={16} />

              {/* desc */}
              <FlatList
                keyExtractor={(item, index) => item.id + index.toString()}
                data={itemDetail.detail}
                keyboardShouldPersistTaps="handled"
                pagingEnabled
                horizontal
                renderItem={({item, index}) => {
                  if (item?.url != null) {
                    return <RenderContent url={item.url} type={item.url_type} />;
                  }
                  if (item?.images?.length > 0) {
                    return (
                      <Container width={width - 32}>
                        {cardImage(item.images[0], item.caption)}
                        <Divider height={16} />
                      </Container>
                    );
                  }
                }}
              />

              <HtmlView
                html={itemDetail.descriptions}
                style={{paddingTop: 8, color: Color.text}}
              />
              {/* {item.detail.map((detail, index) => {
                return (
                  <View key={index}>
                    <Text
                      align="left"
                      size={12}
                      lineHeight={18}
                      color={Color.black}
                      type="medium">
                      {detail.description}
                    </Text>

                    <Divider height={16} />

                    {detail?.images.length > 0 && (
                      <>
                        {cardImage(detail.images[0], detail.caption)}
                        <Divider height={16} />
                      </>
                    )}
                  </View>
                );
              })} */}

              {/* <Divider height={16} /> */}

              {/* <Container flex={1} flexDirection="row" justify="center">
                <Image
                  source={imageAssets.iconApp}
                  style={{
                    height: 8,
                    width: 8,
                    resizeMode: 'contain',
                  }}
                />
                <Divider width={8} />
                <Image
                  source={imageAssets.iconApp}
                  style={{
                    height: 8,
                    width: 8,
                    resizeMode: 'contain',
                  }}
                />
                <Divider width={8} />
                <Image
                  source={imageAssets.iconApp}
                  style={{
                    height: 8,
                    width: 8,
                    resizeMode: 'contain',
                  }}
                />
              </Container> */}
              {/* </Container> */}
            </Container>
            <Divider height={8} />
            <View
              style={{
                backgroundColor: Color.grayLight,
                marginHorizontal: 16,
                marginBottom: 24,
                paddingVertical: 24,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                onPress={() => onSubmitLike(item)}
                style={{
                  height: '100%',
                  flexDirection: 'row',
                  borderColor: Color.border,
                }}>
                <Ionicons
                  size={26}
                  name={is_liked ? 'heart' : 'heart-outline'}
                  color={is_liked ? '#FF4343' : Color.text}
                />
                <Text style={{marginLeft: 6}} size={22}>
                  {likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('CommentListScreenV2', {
                    item: item,
                    type: 'article',
                  });
                }}
                style={{
                  height: '100%',
                  flexDirection: 'row',
                  borderColor: Color.border,
                }}>
                <MaterialIcons size={26} name={'chat'} color={Color.text} />
                <Text style={{marginLeft: 6}} size={22}>
                  {itemDetail.comment_count}
                </Text>
              </TouchableOpacity>
              <Container
                style={{
                  height: '100%',
                  flexDirection: 'row',
                  borderColor: Color.border,
                }}>
                <MaterialIcons size={26} name={'share'} color={Color.text} />
              </Container>
            </View>

            <FlatList
              style={{paddingHorizontal: 16}}
              keyExtractor={(item, index) => item.toString() + index}
              data={listComment.data}
              showsVerticalScrollIndicator={false}
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
              ListHeaderComponent={() => {
                if (listComment.data.length > 0) {
                  return (
                    <Container marginBottom={8}>
                      <Text style={{textAlign: 'left'}} size={14}>
                        Komentar
                      </Text>
                    </Container>
                  );
                } else {
                  return null;
                }
              }}
              ListFooterComponent={() => {
                if (listComment.data.length > 0) {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('CommentListScreenV2', {
                          item: item,
                          type: 'article',
                        })
                      }
                      style={{
                        marginBottom: 10,
                        paddingVertical: 16,
                        marginTop: 24,
                        borderColor: Color.text,
                        borderWidth: 1,
                      }}>
                      <Text
                        size={16}
                        lineHeight={18}
                        type="bold"
                        color={Color.text}>
                        Lihat Semua
                      </Text>
                    </TouchableOpacity>
                  );
                } else {
                  return null;
                }
              }}
              renderItem={({item: itemComment, index}) => {
                return (
                  <CardCommentV2
                    type="article"
                    itemComment={itemComment}
                    onPress={() =>
                      navigation.navigate('CommentReplyScreenV2', {
                        itemComment: itemComment,
                        type: 'article',
                      })
                    }
                    onPressDots={item => {
                      setSelectedComment(item);
                      modalListActionCommentRef.current.open();
                    }}
                  />
                );
              }}
            />
          </Container>
        )}
      </ScrollView>

      <ModalListAction
        ref={modalListActionCommentRef}
        data={[
          {
            id: 0,
            name: 'Hapus',
            color: '#FF4343',
            onPress: () => {
              onDelete();
              modalListActionCommentRef.current.close();
            },
          },
        ]}
      />
    </Scaffold>
  );
};

export default DetailArticleScreen;

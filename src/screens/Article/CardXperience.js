import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Image,
  useWindowDimensions,
  FlatList,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {Text, TouchableOpacity, useColor, Button} from '@src/components';
import YoutubePlayer from 'react-native-youtube-iframe';
import WebView from 'react-native-webview';

import {FormatMoney} from 'src/utils';
import imageAssets from 'assets/images';
import {Divider, Container} from 'src/styled';
import {fetchLike} from 'src/api-rest/fetchLike';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchGetComment } from 'src/api-rest/fetchGetComment';

const RenderContent = ({url, type, image}) => {
  console.log(url, type, 'apanih', image);
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const [error, setError] = useState(false);
  const youtubeRef = useRef();
  const webviewRef = useRef();
  const {Color} = useColor();
  const [beforePlay, setBeforePlay] = useState(true);
  const [playing, setPlaying] = useState(false);
  const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

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
            aspectRatio: 3 / 4,
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
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('GalleryDetailScreen', {
            image: image,
            type: 'video',
            video: url,
          });
        }}
        style={{
          width: width - 32,
          aspectRatio: 3 / 4,
        }}>
        <Image
          source={{uri: image}}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
        />
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AntDesign name="playcircleo" size={64} color={Color.black} />
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <Container paddingVertical={8}>
      <Text size={14} lineHeight={14} color={Color.text}>
        Video tidak ditemukan
      </Text>
    </Container>
  );
};

const defaultProps = {
  productCategory: '',
  onPress: () => {},
  numColumns: 1,
  horizontal: false,
  style: {},
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

const CardXperience = ({item, onPress, numColumns, horizontal}) => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const [likes, setLike] = useState(item?.liked_count ? item?.liked_count : 0);
  const [is_liked, setIsLike] = useState(
    item?.is_liked ? item?.is_liked : false,
  );
  const [listComment, setListComment] = useState(initialListData);

  const cardImage = (image, caption) => {
    return (
      <Container>
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
            <Container>
              <Text
                align="left"
                size={12}
                lineHeight={15}
                color={'#AEAEAE'}
                type="medium">
                {caption}
              </Text>
            </Container>
            {/* <Divider height={8} /> */}
          </>
        )}
        {/* <Container align="center" flex={1} flexDirection="row">
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
      </Container>
    );
  };

  const fetchDataComment = async first => {
    let parameter = listComment.nextUrl
      ? listComment.nextUrl
      : `?perPage=2&parent_id=${itemDetail.id}&category=blocx&type=article`;
    const res = await fetchGetComment(parameter);
    console.log(res, 'res nih comment', parameter);
    if (res.success) {
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
      parent_id: item.id,
    };
    const res = await fetchLike(body);
    if (res.success) {
      setLike(!is_liked ? likes + 1 : likes - 1);
      setIsLike(!is_liked);
    }
  };

  // console.log(item, "item");

  return (
    <View
      // onPress={() => {
      //   navigation.navigate('DetailArticleScreen', {item: item});
      // }}
      style={{
        // width: width * 0.65,
        // width: width / numColumns - (horizontal ? width * 0.35 : 24),
        marginHorizontal: 8,
        marginTop: 12,
      }}>
      <FlatList
        keyExtractor={(item, index) => item.id + index.toString()}
        data={item.detail}
        keyboardShouldPersistTaps="handled"
        pagingEnabled
        horizontal
        renderItem={({item, index}) => {
          if (item?.url != null) {
            return (
              <Container justify="center">
                <RenderContent
                  url={item.url}
                  type={item.url_type}
                  image={item?.images.length > 0 ? item.images[0] : null}
                />
              </Container>
            );
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
      <View
        style={{
          width: '100%',
          backgroundColor: Color.theme,
        }}>
        {/* desc */}
        {/* <Divider height={8} /> */}

        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => onSubmitLike(item)}
            style={{
              flexDirection: 'row',
              borderColor: Color.border,
              alignItems: 'center',
            }}>
            <Ionicons
              size={14}
              name={is_liked ? 'heart' : 'heart-outline'}
              color={is_liked ? '#FF4343' : Color.text}
            />
            <Text style={{marginLeft: 6}} size={14}>
              {likes}
            </Text>
          </TouchableOpacity>
          <Divider width={8} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CommentListScreenV2', {
                item: item,
                type: 'article',
                category: 'blocx',
              });
            }}
            style={{
              flexDirection: 'row',
              borderColor: Color.border,
              alignItems: 'center',
            }}>
            <MaterialIcons size={14} name={'chat'} color={Color.text} />
            <Text style={{marginLeft: 6}} size={14}>
              {item.comment_count}
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Text align="left" size={18} type="medium" lineHeight={20.4}>
          {item.title}
        </Text> */}
        {/* <Divider height={8} />
        <Text align="left" size={10} lineHeight={12} type="semibold">
          Article
        </Text> */}
        <Text align="left" size={10} lineHeight={12} type="medium">
          {item.created_at}
        </Text>
        <Text align="left" size={10} lineHeight={12} type="medium">
          by {item.publisher}
        </Text>
        {listComment.data.map((item, index) => {
          return (
            <View key={index}>
              <CardCommentV2
                type="article"
                category="blocx"
                itemComment={item}
                onPress={() =>
                  navigation.navigate('CommentReplyScreenV2', {
                    itemComment: item,
                    type: 'article',
                    category: 'blocx',
                  })
                }
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

CardXperience.defaultProps = defaultProps;
export default CardXperience;

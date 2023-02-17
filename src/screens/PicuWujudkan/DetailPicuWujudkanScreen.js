import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  ScrollView,
  Platform,
  useWindowDimensions,
  Image,
  FlatList,
} from 'react-native';
import {
  useColor,
  Text,
  TouchableOpacity,
  ModalListAction,
} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import {Row, Divider, Container, Line} from 'src/styled';
import HighlightPicuWujudkan from './HighlightPicuWujudkan';
import imageAssets from 'assets/images';
import {useIsFocused} from '@react-navigation/native';
import HtmlView from 'src/components/HtmlView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fetchLike} from 'src/api-rest/fetchLike';
import {fetchGetComment} from 'src/api-rest/fetchGetComment';
import {fetchDeleteComment} from 'src/api-rest/fetchDeleteComment';
import CardCommentV2 from 'src/components/Card/CardCommentV2';
import {fetchGetArticle} from 'src/api-rest/fetchGetArticle';
import YoutubePlayer from 'react-native-youtube-iframe';

const initialListData = {
  data: [],
  loading: true,
  message: '',
  loadNext: false,
  page: 0,
  refresh: false,
  nextUrl: null,
};

const DetailPicuWujudkanScreen = ({navigation, route}) => {
  const {item, category} = route.params;
  // const [itemDetail, setItemDetail] = useState(item);
  const {Color} = useColor();
  const {height, width} = useWindowDimensions();
  const scrollRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComment, setSelectedComment] = useState({});
  const [trigger, setTrigger] = useState(false);

  const modalListActionRef = useRef();
  const isFocused = useIsFocused();

  const [likes, setLike] = useState(item?.liked_count ? item?.liked_count : 0);
  const [is_liked, setIsLike] = useState(
    item?.is_liked ? item?.is_liked : false,
  );
  const [listComment, setListComment] = useState(initialListData);

  const youtubeRef = useRef();

  const [playing, setPlaying] = useState(false);

  const [beforePlay, setBeforePlay] = useState(true);

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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    if (isFocused) {
      // fetchDetailArticle()
      console.log('callled');
      fetchDataComment(true);
    }
  }, [isFocused]);

  useEffect(() => {
    if (listComment.loadNext) {
      fetchDataComment(false);
    }
  }, [listComment.loadNext]);

  useEffect(() => {
    onRefresh();
    scrollRef.current?.scrollTo({
      y: 0,
      // animated: true,
    });
  }, [item]);

  const onSubmitLike = async () => {
    const body = {
      type: category,
      category: 'picu_wujudkan',
      parent_id: item.id,
    };
    const res = await fetchLike(body);
    if (res.success) {
      setLike(!is_liked ? likes + 1 : likes - 1);
      setIsLike(!is_liked);
    }
  };

  // const fetchDetailArticle = async () =>{
  //   let parameter = `?id=${item.id}&category=picu_wujudkan&type=${category}`;
  //   const res = await fetchGetArticle(parameter)
  //   console.log("deeeeee",res)
  // }

  const fetchDataComment = async first => {
    let parameter = listComment.nextUrl
      ? listComment.nextUrl
      : `?perPage=5&parent_id=${item.id}&category=picu_wujudkan&type=${category}`;
    const res = await fetchGetComment(parameter);
    setListComment({
      ...listComment,
      data: first ? res.data : listComment.data.concat(res.data),
      nextUrl: res.nextUrl ? `?${res.nextUrl.split('?')[1]}` : null,
      loading: false,
      loadNext: false,
      refresh: false,
    });
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

  const cardImage = (image, caption) => {
    return (
      <Container align="center">
        <Image
          source={{uri: image}}
          style={{
            width: '100%',
            aspectRatio: 16 / 9,
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
        <View
          style={{
            width: '100%',
            aspectRatio: 16 / 9,
            // height: width * 1.21,
            paddingHorizontal: 16,
          }}>
          <Image
            source={
              item.images[0] ? {uri: item.images[0]} : imageAssets.imageBlank
            }
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          />
        </View>
        <Divider height={18} />
        <Container flex={1} flexDirection="row" paddingHorizontal={16}>
          <Container
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
                ARTIKEL
              </Text>
              <Text align="left" size={10} lineHeight={12} type="medium">
                {item.publisher} {item.created_at}
              </Text>
            </Container>
          </Container>
          <Container flex={4} marginLeft={4}>
            {/* title */}
            <Text size={24} lineHeight={28.8} type="semibold" align="left">
              {item.title}
            </Text>

            <Divider height={16} />

            {/* subtitle */}
            <Text size={12} lineHeight={16} type="semibold" align="left">
              {item.subtitle}
            </Text>

            <Divider height={16} />

            {/* desc */}
            {item.detail.map((detail, index) => {
              return (
                <View key={index}>
                  {/* <Text
                    align="left"
                    size={12}
                    lineHeight={18}
                    color={Color.black}
                    type="medium">
                    {detail.description}
                  </Text> */}

                  <HtmlView
                    html={detail.description}
                    style={{paddingTop: 8, color: Color.text}}
                  />

                  <Divider height={16} />

                  {detail?.images.length > 0 && (
                    <>
                      {cardImage(detail.images[0], detail.caption)}
                      <Divider height={16} />
                    </>
                  )}

                  {detail.url !== null && detail.url_type == 'youtube' && (
                    <View
                      style={{
                        // width: width - 32,
                        aspectRatio: 16 / 9,
                      }}>
                      <YoutubePlayer
                        ref={youtubeRef}
                        width={'100%'}
                        height={'100%'}
                        play={playing}
                        videoId={detail.url}
                        onChangeState={onStateChange}
                        borderRadius={true}
                        webViewStyle={{opacity: 0.99}}
                      />
                      <Divider height={16} />
                    </View>
                  )}
                </View>
              );
            })}

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
          </Container>
        </Container>
        <Divider height={8} />
        <View
          style={{
            // backgroundColor: '#2B2B2B',
            marginBottom: 24,
            paddingVertical: 24,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
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
                type: category,
              });
            }}
            style={{
              height: '100%',
              flexDirection: 'row',
              borderColor: Color.border,
            }}>
            <MaterialIcons size={26} name={'chat'} color={Color.text} />
            <Text style={{marginLeft: 6}} size={22}>
              {item.comment_count}
            </Text>
          </TouchableOpacity>
          <Container
            style={{
              height: '100%',
              flexDirection: 'row',
              borderColor: Color.border,
            }}>
            <MaterialIcons size={26} name={'share'} color={Color.text} />
            <Text style={{marginLeft: 6}} size={22}>
              {item.views_count}
            </Text>
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
          ListHeaderComponent={() => (
            <Container marginBottom={8}>
              <Text style={{textAlign: 'left'}} size={14}>
                Komentar
              </Text>
            </Container>
          )}
          ListFooterComponent={() => (
            <TouchableOpacity
              onPress={() =>
                // console.log("apacoba",category)
                navigation.navigate('CommentListScreenV2', {
                  item: item,
                  type: category,
                })
              }
              style={{
                marginBottom: 10,
                paddingVertical: 16,
                marginTop: 24,
                borderColor: Color.text,
                borderWidth: 1,
              }}>
              <Text size={16} lineHeight={18} type="bold" color={Color.text}>
                Lihat Semua
              </Text>
            </TouchableOpacity>
          )}
          renderItem={({item: itemComment, index}) => {
            return (
              <CardCommentV2
                type={category}
                itemComment={itemComment}
                onPress={() =>
                  navigation.navigate('CommentReplyScreenV2', {
                    itemComment: itemComment,
                    type: category,
                  })
                }
                onPressDots={item => {
                  setSelectedComment(item);
                  modalListActionRef.current.open();
                }}
              />
            );
          }}
        />

        <ModalListAction
          ref={modalListActionRef}
          data={[
            {
              id: 0,
              name: 'Hapus',
              color: '#FF4343',
              onPress: () => {
                onDelete();
                modalListActionRef.current.close();
              },
            },
          ]}
        />

        <HighlightPicuWujudkan
          title="● ARTIKEL LAINNYA"
          numColumns={1}
          type="OTHER"
          id={item.id}
          categoryId={item.category_id}
          showSeeAllText={false}
          refresh={refreshing}
        />
      </ScrollView>
    </Scaffold>
  );
};

export default DetailPicuWujudkanScreen;

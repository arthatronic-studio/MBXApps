import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions, } from 'react-native';
import Moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagesPath from '../../components/ImagesPath';
import { imageContentItem } from 'assets/images/content-item';
import {
  Text,
  TouchableOpacity,
  useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';
import { queryAddLike } from 'src/lib/query';
import client from 'src/lib/apollo';
import { Divider, Line, Padding, Row } from 'src/styled';
import VideoPlayerIos from 'src/components/VideoPlayerIos';
import { VideoPlayerAndroid } from 'src/components/VideoPlayerAndroid';
import HtmlView from 'src/components/HtmlView';
import { fetchContentProductViewManage } from 'src/api/content';
import { onShare } from 'src/utils/share';

const defaultProps = {
  onPress: () => { },
  numColumns: 1,
  style: {},
  showAllText: false,
  showVideo: false,
};

const CardForumVertical = ({ item, numColumns, onPress, onPressDot, showAllText, showVideo, style }) => {
  const [like, setLike] = useState(item.like);
  const [im_like, setImLike] = useState(item.im_like);
  const [view, setView] = useState(item.view);
  const [trigger, setTrigger] = useState(false);
  const [withImage, setWithImage] = useState(item.image !== '' && true);

  const { Color } = useColor();
  const { width } = useWindowDimensions();
  const user = useSelector(state => state['user.auth'].login.user);

  useEffect(() => {
    setLike(item.like);
    setImLike(item.im_like);
    setView(item.view);
  }, [item]);

  useEffect(() => {
    const timeout = trigger ? setTimeout(() => {
      fetchAddLike();
    }, 500) : null;

    return () => {
      clearTimeout(timeout);
    }
  }, [trigger]);

  const fetchAddLike = () => {
    console.log('trigger emergency');

    client.query({
      query: queryAddLike,
      variables: {
        productId: item.id
      }
    })
      .then((res) => {
        console.log(res, 'res add like');
        setTrigger(false);
      })
      .catch((err) => {
        console.log(err, 'err add like');
        setTrigger(false);
      });
  }

  const onPressCard = async(item) => {
    onPress(item);

    const result = await fetchContentProductViewManage(item.id);
    console.log('result', result);
    if (result.status) {
      setView(view + 1);
    }
  }

  const onSubmitLike = () => {
    setLike(!im_like ? like + 1 : like - 1);
    setImLike(!im_like);
    setTrigger(true);
  }

  const renderVideoPlayer = (videoFilename) => {
    if (Platform.OS === 'ios') {
      return (
        <VideoPlayerIos
          autoplay={false}
          item={{
            videoFilename
          }}
        />
      )
    }

    return (
      <VideoPlayerAndroid
        item={{
          videoFilename
        }}
        hideOnError
        autoplay={false}
      />
    )
  }

  const extraPropsText = showAllText ? {} : { numberOfLines: 3 };
  const now = Moment();
  const createdDate = parseInt(item.created_date, 10);
  const isToday = Moment(createdDate).isSame(now, 'day');
  let dateLabel = Moment(createdDate).format('DD MMM YYYY, HH:mm');
  if (isToday) {
    dateLabel = `${Moment(createdDate).fromNow()}, ${Moment(createdDate).format('HH:mm')}`;
  }
  const iconSize = 18;

  const isEmptyVideo = item.videoFilename !== '';

  return (
    <TouchableOpacity
      onPress={() => onPressCard(item)}
      style={{
        width: width - 32,
        marginTop: 16,
        borderRadius: 8,
        backgroundColor: Color.textInput,
        ...style,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
          <View style={{ flex: 1, aspectRatio: 1, justifyContent: 'center' }}>
            <Image
              source={{ uri: item.avatar }}
              style={{
                width: '100%',
                aspectRatio: 1,
                borderRadius: 50,
                backgroundColor: Color.primary,
              }}
            />
          </View>

          <View style={{ flex: 8 }}>
            <Padding horizontal={10}>
              <Row>
                <Text type="bold" align="left" numberOfLines={2}>
                  {item.fullname}
                </Text>
                {/* hide admin post */}
                {/* <Image
                                    source={ImagesPath.ranking}
                                    style={{
                                        width: 14,
                                        height: 14,
                                        marginLeft: 4,
                                    }}
                                /> */}
              </Row>

              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                <Text size={8} align="left">
                  {dateLabel}
                </Text>
              </View>
            </Padding>
          </View>

          {typeof onPressDot === 'function' && (
            <TouchableOpacity
              onPress={() => onPressDot()}
              style={{
                flex: 1,
                aspectRatio: 1,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <MaterialCommunityIcons
                name="dots-vertical"
                color={Color.text}
                size={18}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text align="left" type="bold" numberOfLines={2}>
          {item.productName}
        </Text>

        {item.im_save && <Image
          source={imageContentItem.pin}
          style={{
            width: iconSize,
            height: iconSize,
            resizeMode: 'contain',
          }}
        />}
      </View>

      {withImage && <View
        style={{
          width: '100%',
          aspectRatio: 16 / 9,
          marginBottom: 8,
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 8,
            backgroundColor: Color.border,
          }}
          onError={(err) => {
            console.log('err image', err);
            if (err) {
              setWithImage(false);
            }
          }}
        />
      </View>}

      <Text align="left" size={12} type="medium" {...extraPropsText}>
        {item.productDescription}
      </Text>

      {showAllText && <HtmlView
        html={item.fullDescription}
        fontSize={12}
        style={{
          paddingTop: 8,
        }}
      />}

      <Divider />

      {isEmptyVideo && showVideo && renderVideoPlayer(item.videoFilename)}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 16,
        }}>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => onSubmitLike()}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              source={im_like ? imageContentItem.heart_active : imageContentItem.heart_nonactive}
              style={{
                width: iconSize,
                height: iconSize,
                resizeMode: 'contain',
              }}
            />
            <Text
              size={14}
              align="left"
              color={Color.gray}
              style={{ marginLeft: 10 }}>
              {like}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              source={imageContentItem.comment}
              style={{
                width: iconSize,
                height: iconSize,
                resizeMode: 'contain',
              }}
            />
            <Text
              size={14}
              align="left"
              color={Color.gray}
              style={{ marginLeft: 10 }}>
              {item.comment}
            </Text>
          </View>

          <TouchableOpacity
            disabled
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              source={imageContentItem.view}
              style={{
                width: iconSize,
                height: iconSize,
                resizeMode: 'contain',
              }}
            />
            <Text
              size={14}
              align="left"
              color={Color.gray}
              style={{ marginLeft: 10 }}>
              {view}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              onShare(item.share_link, item.code);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              source={imageContentItem.share}
              style={{
                width: iconSize + 2,
                height: iconSize + 2,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Line color={Color.border} width={width} />
    </TouchableOpacity>
  );
}

CardForumVertical.defaultProps = defaultProps;
export default CardForumVertical;
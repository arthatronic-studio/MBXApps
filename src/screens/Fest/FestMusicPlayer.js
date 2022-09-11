import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  useProgress,
  useTrackPlayerEvents,
  Event,
  State,
} from 'react-native-track-player';
import Moment from 'moment';

import { useColor } from '@src/components/Color';
import Text from '@src/components/Text';
// import MusicPlaylist from '../Modal/MusicPlaylist';
import { useLoading } from '@src/components/Modal/Loading';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Client from '@src/lib/apollo';
import { queryAddLike, queryContentProduct } from '@src/lib/query';
import { Scaffold } from 'src/components';
import { Divider } from 'src/styled';
import { shadowStyle } from 'src/styles';

// const playIcon = require('../../../assets/images/control/play.png');
// const pauseIcon = require('../../../assets/images/control/pause.png');
// const forwardIcon = require('../../../assets/images/control/forward.png');

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackTrackChanged,
];

export const FestMusicPlayer = ({ navigation, route }) => {
  // hooks
  const { Color } = useColor();
  const { position, duration } = useProgress();
  const [loadingProps, showLoading] = useLoading();
  const { width, height } = useWindowDimensions();

  // state
  const [playerState, setPlayerState] = useState();
  const [currentPlaying, setCurrentPlaying] = useState();
  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  //
  const isPlaying = playerState === State.Playing;
  let [item, setItem] = useState();
  const [thisTrack, setThisTrack] = useState();
  
  useEffect(() => {
    const timeout = thisTrack ?
      setTimeout(() => {
        fetchData();
      }, 1000) : null;

    return () => clearTimeout(timeout);
  }, [thisTrack]);

  const fetchData = async() => {
    const result = await fetchContentProduct();
    if (result) setItem(result);
  }
  
  const fetchContentProduct = async () => {
    const variables = {
      productCode: thisTrack.id
    };

    const result = await Client.query({
      query: queryContentProduct,
      variables,
    });

    if (
      result &&
      result.data &&
      result.data.contentProduct &&
      Array.isArray(result.data.contentProduct)
    ) {
      return result.data.contentProduct[0];
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (!isSeeking && position && duration) {
      setSliderValue(position / duration);
    }
  }, [position, duration]);

  useEffect(() => {
    getCurrentPlaying();
  }, []);

  useTrackPlayerEvents(events, (event) => {
    getCurrentPlaying();
  });

  const getCurrentPlaying = async() => {
    const newCurrent = await TrackPlayer.getCurrentTrack();
    if (newCurrent != null) {
      setThisTrack(await TrackPlayer.getTrack(newCurrent));
    }
    const newQueue = await TrackPlayer.getQueue();
    const state = await TrackPlayer.getState();

    // console.log('=======', newQueue, newCurrent);
    setPlayerState(state);
    
    if (newCurrent != null && newQueue.length > 0) {
      const newCurrentPlaying = newQueue[newCurrent];
      // console.log('======= newCurrentPlaying =======', newCurrentPlaying);
      setCurrentPlaying(newCurrentPlaying);
    }
  }

  console.log(playerState, "jaja");
  console.log(currentPlaying, "hahaha")

  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async value => {
    await TrackPlayer.seekTo(value * duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  const fetchContentAddLike = (id) => {
    showLoading();

    Client.query({
      query: queryAddLike,
      variables: {
        productId: id
      }
    })
    .then((res) => {
      console.log(res, 'res add like');
      if (res.data.contentAddLike.id) {
        // onSuccessLike(id);

        if (res.data.contentAddLike.status === 1) {
          showLoading('success', 'Disukai');
          item.like += 1;
          item.im_like = true;
        } else {
          showLoading('info', 'Batal menyukai');
          item.like -= 1;
          item.im_like = false;
        }
      } else {
        showLoading('error', 'Gagal menyukai');
      }
    })
    .catch((err) => {
        console.log(err, 'err add like');
        showLoading('error', 'Gagal menyukai');
    })
  }

  const getDurationString = (key, value) => {
    const ss = Moment.duration({ [key]: value }).seconds();
    const mm = Moment.duration({ [key]: value }).minutes();
    const HH = Moment.duration({ [key]: value }).hours();

    let seconds = ss;
    let minutes = mm;
    let hours = HH;
    
    if (ss < 10) {
      seconds = '0' + ss;
    }

    if (mm < 10) {
      minutes = '0' + mm;
    }

    if (HH < 10) {
      hours = '0' + HH;
    }

    // ntar validasi total biar flexible nyesuain duration
    return minutes + ':' + seconds;
  }
  
  const renderContent = () => {
    return (
        <View style={{flex: 1, paddingVertical: 16, justifyContent: 'space-between'}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text size={18}>{currentPlaying ? currentPlaying.title : ''}</Text>
                <Divider height={2} />
                <Text size={12}>{currentPlaying ? currentPlaying.artist : ''}</Text>
            </View>

            <View style={{flex: 1, paddingHorizontal: 28, justifyContent: 'center'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text size={12}>
                    {getDurationString('seconds', position, 'ss')}
                    </Text>
                    <Text size={12}>
                    {getDurationString('seconds', duration)}
                    </Text>
                </View>
                <Slider
                    style={{width: width - 56, height: 40}}
                    minimumValue={0}
                    maximumValue={1}
                    value={sliderValue}
                    onSlidingStart={slidingStarted}
                    onSlidingComplete={slidingCompleted}
                    minimumTrackTintColor={Color.secondary}
                    maximumTrackTintColor={Color.placeholder}
                    thumbTintColor={Color.primary}
                    thumbStyle={{height: 14, width: 14, borderRadius: 7}}
                    trackStyle={{height: 4}}
                />
            </View>

            <View style={{flex: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 28}}>
                {/* <MaterialIcons
                onPress={() => {
                    
                }}
                name='shuffle'
                size={18}
                color={Color.secondary}
                /> */}

                <View />

                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons
                        onPress={() => {
                            TrackPlayer.skipToPrevious();
                        }}
                        name='md-play-skip-back-sharp'
                        size={22}
                        color={Color.text}
                    />
                    <View style={{height: '50%', aspectRatio: 1, borderRadius: 50, backgroundColor: Color.primary, justifyContent: 'center', alignItems: 'center', marginHorizontal: 32}}>
                        <Ionicons
                            onPress={async() => {
                              isPlaying ? await TrackPlayer.pause() : await TrackPlayer.play();
                            }}
                            name={isPlaying ? 'pause' : 'play'}
                            color={Color.text}
                            size={28}
                        />
                    </View>
                    <Ionicons
                        onPress={() => {
                            TrackPlayer.skipToNext();
                        }}
                        name='md-play-skip-forward-sharp'
                        size={22}
                        color={Color.text}
                    />
                </View>

                <View />

                {/* <MaterialIcons
                    onPress={() => {
                        
                    }}
                    name='repeat'
                    size={18}
                    color={Color.text}
                /> */}
            </View>

            <View style={{flex: 0.8, paddingHorizontal: 16}}>
                {item && <View style={{width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: Color.theme, borderRadius: 16, ...shadowStyle}}>
                    <TouchableOpacity
                      onPress={() => fetchContentAddLike(item.id)}
                      style={{flexDirection: 'row', alignItems: 'center'}}
                    >
                      {item && item.im_like ?
                          <Ionicons name='heart' color={item && item.im_like ? Color.error : Color.text} size={22} />
                        :
                          <SimpleLineIcons name='heart' color={item && item.im_like ? Color.error : Color.text} size={20} />
                      }
                        <Text color={item && item.im_like ? Color.secondary : Color.text}> {item && item.like ? item.like : 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigation.navigate('CommentListScreen', { item })}
                      style={{flexDirection: 'row', alignItems: 'center'}}
                    >
                        <MaterialIcons name='comment' size={20} color={Color.primary} />
                        <Text> {item && item.comment ? item.comment : 0}</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                      onPress={async() => {
                        // const options = {
                        //     message: '',
                        //     title: item.productName,
                        //     url: item.share_link,
                        // };
                        // const shareResponse = await Share.open(options);
                        // console.log(shareResponse, 'shareResponse');
                      }}
                    >
                      <MaterialIcons
                        name='share'
                        size={18}
                        color={Color.text}
                        style={{marginBottom: 4}}
                      />
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity onPress={() => setShowPlaylist(true)}>
                      <MaterialIcons name='playlist-play' size={30} color={Color.text} style={{marginBottom: 4}} />
                    </TouchableOpacity> */}
                </View>}
            </View>
      </View>
    )
  };

  return (
    <Scaffold
      loadingProps={loadingProps}
    >
      <View style={{flex: 0.2}} />

      <View style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
          <Image
              source={{uri: currentPlaying ? currentPlaying.artwork : ''}}
              style={{
                height: '100%',
                aspectRatio: 1,
                borderRadius: 16,
                backgroundColor: Color.border,
              }}
          />
      </View>

      <View style={{flex: 1}}>
          {/* {showPlaylist ?
              <MusicPlaylist
                  onPressLeftButton={() => setShowPlaylist(false)}
              />
          :
              renderContent()
          } */}
          {renderContent()}
      </View>
    </Scaffold>
  );
};

export default FestMusicPlayer;
import React, { useRef, forwardRef, useState, useEffect } from 'react';
import { Animated, Dimensions, View, Keyboard, Image, Platform } from 'react-native';
import { Modalize } from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Slider from 'react-native-slider';
import TrackPlayer, {
  useProgress,
  useTrackPlayerEvents,
  Event,
  State
} from 'react-native-track-player';
import { useSelector, useDispatch } from 'react-redux';
import Moment from 'moment';
// import Orientation from 'react-native-orientation-locker';
// import Share from 'react-native-share';

import { useColor } from '@src/components/Color';
import Text from '@src/components/Text';
// import MusicPlaylist from './MusicPlaylist';
import Loading, { useLoading } from '@src/components/Modal/Loading';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';

// import { useCombinedRefs } from '@src/utils/useCombinedRefs';
import { navigationRef } from 'App';

import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 85;

const playIcon = require('@assets/images/video_control/play.png');
const pauseIcon = require('@assets/images/video_control/pause.png');
const forwardIcon = require('@assets/images/video_control/forward.png');

const defaultProps = {
};

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackTrackChanged,
];

const FloatingMusicPlayer = forwardRef((props, ref) => {
  // ref
  // const modalizeRef = useRef(null);
  const animated = useRef(new Animated.Value(0)).current;
  // const combinedRef = useCombinedRefs(ref, modalizeRef);
  const { Color } = useColor();

  // hooks
  const { position, duration } = useProgress();
  const [loadingProps, showLoading] = useLoading();

  // state
  const [handle, setHandle] = useState(false);
  const [playerState, setPlayerState] = useState();
  const [playbackChanged, setPlaybackChanged] = useState(0);
  const [currentPlaying, setCurrentPlaying] = useState();
  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [orientation, setOrientation] = useState('');
  const [keyboardShow, setKeyboardShow] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // dispatch
  const dispatch = useDispatch();

  // selector
  const playNowData = useSelector(state => state.playNow.data);

  // unstate
  const isPlaying = playerState === State.Playing;
  let item = null;

  if (currentPlaying && playNowData.length > 0) {
    item = playNowData.filter((e) => e.id == currentPlaying.id)[0];
  }
  
  // useEffect(() => {
  //   Orientation.addOrientationListener(handleOrientation);
  //   Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
  //   Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

  //   return () => {
  //     Orientation.removeOrientationListener(handleOrientation);
  //     Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
  //     Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
  //   };
  // }, []);

  function handleOrientation(orientation) {
    if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
        setOrientation('landscape');
    } else {
        setOrientation('portrait');
    }
  }

  const handleKeyboardShow = () => {
    setKeyboardShow(true);
  }

  const handleKeyboardHide = () => {
    setKeyboardShow(false);
  }
  
  useEffect(() => {
    const getCurrentPlaying = async() => {
      const newCurrent = await TrackPlayer.getCurrentTrack();
      const newQueue = await TrackPlayer.getQueue();
      const state = await TrackPlayer.getState();

      // console.log('======= state =======', state);
      setPlayerState(state);
      
      if (newCurrent && newQueue.length > 0) {
        const newCurrentPlaying = newQueue.filter((e) => e.id === newCurrent)[0];

        // console.log('======= count =======');
        setCurrentPlaying(newCurrentPlaying);
      }
    }

    getCurrentPlaying();
  }, [playerState, playbackChanged]);

  useEffect(() => {
    if (!isSeeking && position && duration) {
      setSliderValue(position / duration);
    }
  }, [position, duration]);

  useTrackPlayerEvents(events, (event) => {
    // console.log(events, event, 'useTrackPlayerEvents');
    
    if (event.type === Event.PlaybackError) {
      console.log('An error occurred while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      // console.log(event, 'useTrackPlayerEvents');
      setPlayerState(event.state);
    }
    if (event.type === Event.PlaybackTrackChanged) {
      setPlaybackChanged(Math.floor(Math.random() * 1000) + 1);
    }
  });

  const handlePosition = position => {
    if (position === 'initial') {
      setShowPlaylist(false);
    }
    
    setHandle(position === 'top');
  };

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
      // console.log(res, 'res add like');
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
  
  const renderContent = () => (
    <>  
      {/* ==================== +++++++++++ ==================== */}
      {/* ==================== mini player ==================== */}
      {/* ==================== +++++++++++ ==================== */}
      <Animated.View style={{width: '100%', height: height / 2, alignItems: handle ? 'center' : 'flex-start'}}>
        <TouchableOpacity
          disabled
          onPress={() => {
            
          }}
        >
          <Animated.Image
            style={{
                height: 54,
                width: 54,
                marginLeft: handle ? 0 : 8,
                marginTop: handle ? 0 : 8,
                borderRadius: 2,
                transform: [
                  {
                    translateY: animated.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, (height - width) / 2]
                    })
                  },
                  {
                    scale: animated.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 2, 5]
                    })
                  },
                ],
            }}
            source={{uri: currentPlaying ? currentPlaying.artwork : ''}}
          />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View
        style={{
          position: 'absolute',
          left: HEADER_HEIGHT - 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: HEADER_HEIGHT - 15,
          width: width - 65,
          opacity: animated.interpolate({
            inputRange: [0, 0.75],
            outputRange: [1, 0],
          }),
          transform: [
            {
              scale: animated.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            },
          ]
        }}
      >
        <TouchableOpacity
          style={{flex: 8, alignItems: 'flex-start'}}
          disabled
          onPress={() => {
            
          }}
        >
          <Text align='left' numberOfLines={2} color={Color.text}>{currentPlaying ? currentPlaying.title : ''}</Text>
          <Text size={12} color={Color.border}>{currentPlaying ? currentPlaying.artist : ''}</Text>
        </TouchableOpacity>

        <View style={{flex: 4, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginRight: 12}}>
          <TouchableOpacity
            onPress={() => {
              isPlaying ? TrackPlayer.pause() : TrackPlayer.play();
            }}
            activeOpacity={0.75}
          >
            <Image source={isPlaying ? pauseIcon : playIcon} style={{height: 28, width: 28}} resizeMode='contain' />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
              TrackPlayer.skipToNext();
              if (!isPlaying) TrackPlayer.play();
            }}
            activeOpacity={0.75}
            style={{marginLeft: 10}}
          >
            <Image source={forwardIcon} style={{height: 14, width: 14}} resizeMode='contain' />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              TrackPlayer.stop();
              dispatch({ type: 'PLAYNOW.RESET_DATA' });
            }}
            activeOpacity={0.75}
            style={{marginLeft: 10}}
          >
            <Ionicons name='close-outline' size={32} color={Color.border} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ==================== +++++++++++ ==================== */}
      {/* ==================== show player ==================== */}
      {/* ==================== +++++++++++ ==================== */}
      <View style={{height: height / 3.2, justifyContent: 'space-between'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text size={18} color={Color.text}>{currentPlaying ? currentPlaying.title : ''}</Text>
            <Text size={12} color={Color.border}>{currentPlaying ? currentPlaying.artist : ''}</Text>
        </View>
        <View style={{paddingHorizontal: 28, justifyContent: 'center'}}>
            <Slider
                style={{width: width - 56, height: 40}}
                minimumValue={0}
                maximumValue={1}
                value={sliderValue}
                onSlidingStart={slidingStarted}
                onSlidingComplete={slidingCompleted}
                minimumTrackTintColor={Color.secondary}
                maximumTrackTintColor={Color.border}
                thumbTintColor={Color.text}
                thumbStyle={{height: 14, width: 14, borderRadius: 7}}
                trackStyle={{height: 4}}
            />
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text size={12} color={Color.text}>
                  {getDurationString('seconds', position, 'ss')}
                </Text>
                <Text size={12} color={Color.text}>
                  {getDurationString('seconds', duration)}
                </Text>
            </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 28}}>
            {/* <MaterialIcons
              onPress={() => {
                onShuffle();
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
                  size={18}
                  color={Color.text}
                />
                <View style={{height: 36, width: 36, backgroundColor: Color.text, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginHorizontal: 16}}>
                    <Ionicons
                      onPress={() => {
                        isPlaying ? TrackPlayer.pause() : TrackPlayer.play();
                      }}
                      name={isPlaying ? 'pause' : 'play'}
                      color={Color.theme}
                      size={18}
                    />
                </View>
                <Ionicons
                    onPress={() => {
                      TrackPlayer.skipToNext();
                    }}
                    name='md-play-skip-forward-sharp'
                    size={18}
                    color={Color.text}
                />
            </View>

            <View />

            {/* <MaterialIcons
              onPress={() => onRepeat()}
              name='repeat'
              size={18}
              color={Color.text}
            /> */}
        </View>

        <View style={{paddingHorizontal: 26, marginTop: 16}}>
          <View style={{width: '100%', height: 60, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: Color.primary, borderRadius: 12}}>
            <TouchableOpacity onPress={() => fetchContentAddLike(item.id)} style={{flexDirection: 'row'}}>
              <SimpleLineIcons name='emotsmile' color={item && item.im_like ? Color.secondary : Color.text} size={20} />
              <Text color={item && item.im_like ? Color.secondary : Color.text}> {item && item.like ? item.like : 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigationRef.current.navigate('CommentListScreen', { item })} style={{flexDirection: 'row'}}>
              <MaterialIcons name='comment' size={20} color={Color.text} />
              <Text color={Color.text}> {item && item.comment ? item.comment : 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={async() => {
              // const options = {
              //     message: '',
              //     title: item.productName,
              //     url: item.share_link,
              // };
              // const shareResponse = await Share.open(options);
            }}>
              <MaterialIcons
                name='share'
                size={18}
                color={Color.text}
                style={{marginBottom: 4}}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowPlaylist(true)}>
              <MaterialIcons name='playlist-play' size={30} color={Color.text} style={{marginBottom: 4}} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );

  if (orientation === 'landscape' || keyboardShow) return <View />;

  return (
    <>
      <View style={{height: HEADER_HEIGHT}} />
      <Modalize
        ref={ref}
        alwaysOpen={HEADER_HEIGHT}
        panGestureAnimatedValue={animated}
        snapPoint={HEADER_HEIGHT}
        withHandle={handle}
        handlePosition="inside"
        onPositionChange={handlePosition}
        handleStyle={{top: 12, width: '30%', height: handle ? 4 : 0, backgroundColor: Color.border}}
        childrenStyle={{backgroundColor: Color.theme}}
        modalStyle={{backgroundColor: Color.theme, top: Platform.OS === 'android' ? 0 : handle ? HEADER_HEIGHT + 5 : 0}}
      >
        {/* {showPlaylist ?
          <MusicPlaylist
            onPressLeftButton={() => setShowPlaylist(false)}
          />
        :
          renderContent()
        } */}
        {renderContent()}
      </Modalize>

      <Loading {...loadingProps} />
    </>
  );
});

FloatingMusicPlayer.defaultProps = defaultProps;
export default FloatingMusicPlayer;
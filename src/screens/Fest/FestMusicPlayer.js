import React, {useState, useEffect} from 'react';
import {View, Image, useWindowDimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  useProgress,
  useTrackPlayerEvents,
  Event,
  State,
  RepeatMode,
} from 'react-native-track-player';
import Moment from 'moment';

import {useColor} from '@src/components/Color';
import Text from '@src/components/Text';
// import MusicPlaylist from '../Modal/MusicPlaylist';
import {useLoading} from '@src/components/Modal/Loading';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Client from '@src/lib/apollo';
import {queryAddLike, queryContentProduct} from '@src/lib/query';
import {Header, Scaffold} from 'src/components';
import {Divider} from 'src/styled';
import {shadowStyle} from 'src/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

// const playIcon = require('../../../assets/images/control/play.png');
// const pauseIcon = require('../../../assets/images/control/pause.png');
// const forwardIcon = require('../../../assets/images/control/forward.png');

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackTrackChanged,
];

export const FestMusicPlayer = ({navigation, route}) => {
  // hooks
  const {Color} = useColor();
  const {position, duration} = useProgress();
  const [loadingProps, showLoading] = useLoading();
  const {width, height} = useWindowDimensions();

  // state
  const [playerState, setPlayerState] = useState();
  const [currentPlaying, setCurrentPlaying] = useState();
  const [repeatMode, setRepeatMode] = useState('off');
  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  //
  const isPlaying = playerState === State.Playing;
  let [item, setItem] = useState();
  const [thisTrack, setThisTrack] = useState();

  useEffect(() => {
    const timeout = thisTrack
      ? setTimeout(() => {
          fetchData();
        }, 1000)
      : null;

    return () => clearTimeout(timeout);
  }, [thisTrack]);

  const fetchData = async () => {
    const result = await fetchContentProduct();
    if (result) setItem(result);
  };

  const fetchContentProduct = async () => {
    const variables = {
      productCode: thisTrack.id,
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

  useTrackPlayerEvents(events, event => {
    getCurrentPlaying();
  });

  const getCurrentPlaying = async () => {
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
  };

  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async value => {
    await TrackPlayer.seekTo(value * duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  const changeRepeatMode = () => {
    if (repeatMode === 'off'){
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode('track');
    }else{
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');
    }
  }

  const fetchContentAddLike = id => {
    showLoading();

    Client.query({
      query: queryAddLike,
      variables: {
        productId: id,
      },
    })
      .then(res => {
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
      .catch(err => {
        console.log(err, 'err add like');
        showLoading('error', 'Gagal menyukai');
      });
  };

  const getDurationString = (key, value) => {
    const ss = Moment.duration({[key]: value}).seconds();
    const mm = Moment.duration({[key]: value}).minutes();
    const HH = Moment.duration({[key]: value}).hours();

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
  };

  const renderContent = () => {
    return (
      <View
        style={{flex: 1, paddingVertical: 16, justifyContent: 'space-between'}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: 16,
            alignItems: 'center',
          }}>
          <Ionicons
            name="md-heart-outline"
            color={item && item.im_like ? Color.error : Color.text}
            size={24}
          />
          <Divider width={10} />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text size={16} type="medium" color={Color.black}>
              {currentPlaying ? currentPlaying.title : ''}
            </Text>
            <Divider height={2} />
            {/* <Text size={12}>{currentPlaying ? currentPlaying.artist : ''}</Text> */}
            <Text size={12} color={Color.textSoft}>
              {'besok ngoding band'}
            </Text>
          </View>
          <Divider width={10} />
          <SimpleLineIcons name="minus" size={24} />
        </View>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}>
            <Text size={12}>
              {getDurationString('seconds', position, 'ss')}
            </Text>
            <Text size={12}>- {getDurationString('seconds', duration - position)}</Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={1}
            value={sliderValue}
            onSlidingStart={slidingStarted}
            onSlidingComplete={slidingCompleted}
            minimumTrackTintColor={Color.primary}
            maximumTrackTintColor="#DDDDDD"
            thumbTintColor={Color.primary}
            thumbStyle={{height: 14, width: 14, borderRadius: 7}}
            trackStyle={{height: 4}}
            style={{width: width}}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}>
          <Ionicons
            onPress={() => {}}
            name="shuffle-outline"
            size={24}
            color={Color.black}
          />
          <Ionicons
            onPress={() => {
              changeRepeatMode();
            }}
            name="repeat-outline"
            size={24}
            color={repeatMode === 'off' ? Color.black : Color.primary}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 16,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderColor: '#E2E1DF',
            borderRadius: 16,
          }}>
          <Feather
            onPress={() => {
              TrackPlayer.skipToPrevious();
            }}
            name="skip-back"
            size={24}
            color={Color.text}
          />
          <MaterialIcons
            onPress={() => {
              TrackPlayer.seekTo(position - 5);
            }}
            name="replay-5"
            size={24}
            color={Color.text}
          />
          <Ionicons
            onPress={async () => {
              isPlaying ? await TrackPlayer.pause() : await TrackPlayer.play();
            }}
            name={isPlaying ? 'pause-circle-sharp' : 'play-circle-sharp'}
            color={Color.text}
            size={40}
          />
          <MaterialIcons
            onPress={() => {
              TrackPlayer.seekTo(position + 5);
            }}
            name="forward-5"
            size={24}
            color={Color.text}
          />
          <Feather
            onPress={() => {
              TrackPlayer.skipToNext();
            }}
            name="skip-forward"
            size={24}
            color={Color.text}
          />
        </View>
      </View>
    );
  };

  return (
    <Scaffold
      loadingProps={loadingProps}
      header={
        <Header
          title="Sedang Putar"
          actions={
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AboutFest');
              }}>
              <AntDesign
                name="exclamationcircleo"
                size={20}
                color={Color.text}
              />
            </TouchableOpacity>
          }
        />
      }>
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

      <View style={{flex: 1}}>{renderContent()}</View>
    </Scaffold>
  );
};

export default FestMusicPlayer;

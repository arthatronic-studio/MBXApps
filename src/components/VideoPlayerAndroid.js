import React, { useState, useEffect } from 'react';
import { View, StatusBar, BackHandler, ImageBackground, ActivityIndicator, useWindowDimensions } from 'react-native';
import Video from 'react-native-video';
// import Orientation from 'react-native-orientation-locker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { PlayerControls } from './PlayerControls';
import { PlayerProgress } from './PlayerProgress';
import { useColor } from '@src/components/Color';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Header from '@src/components/Header';
import { navigationRef } from 'App';

const FullscreenClose = 'fullscreen-exit';
const FullscreenOpen = 'fullscreen';

const defaultProps = {
    autoplay: true,
    isMinimize: false,
    colorController: '#DDDDDD',
    onChangeOrientation: () => {},
    onPressRightButton: () => {},
};

export const VideoPlayerAndroid = ({ autoplay, isMinimize, hideOnError, colorController, item, onPressLeftButton, onPressRightButton, onChangeOrientation }) => {
  const { height, width } = useWindowDimensions();
  const { Color } = useColor();
  
  const initialSize = {
    height: width * (9 / 16),
    width,
  };

  const videoRef = React.createRef();

  const [state, setState] = useState({
    fullscreen: false,
    loading: false,
    play: autoplay,
    currentTime: 0,
    duration: 0,
    showControls: true,
    orientation: '',
    error: false,
    ...initialSize,
  });

  useEffect(() => {
    setState(s => ({
      ...s,
      fullscreen: false,
    }));
  }, [isMinimize])

  useEffect(() => {
    setState(s => ({
      ...s,
      fullscreen: false,
      play: autoplay,
    }));

    // Orientation.lockToPortrait();
  }, [item]);

  // useEffect(() => {
  //   Orientation.addOrientationListener(handleOrientation);
  //   BackHandler.addEventListener('hardwareBackPress', handleBackPress);

  //   return () => {
  //     Orientation.removeOrientationListener(handleOrientation);
  //     BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  //   };
  // }, [state.fullscreen, state.orientation]);

  const handleBackPress = () => {
    if (state.fullscreen) {
      // Orientation.lockToPortrait();
      onChangeOrientation(false, 'portrait');

      if (state.orientation === 'portrait') {
        if (onPressLeftButton) {
          onPressLeftButton();
        } else {
          navigationRef.current.goBack();
        }
      }
    }
    else if (onPressLeftButton) {
      onPressLeftButton();
      onChangeOrientation(false, 'portrait');
    }
    else {
      navigationRef.current.goBack();
      onChangeOrientation(false, 'portrait');
    }

    return true;
  }

  const onLoadStart = () => {
    setState({ ...state, loading: true });
  }

  const onLoadEnd = (data) => {
    setState(s => ({
      ...s,
      loading: false,
      duration: data.duration,
      currentTime: data.currentTime,
      orientation: data.naturalSize.orientation,
    }));
  }

  const handleOrientation = (orientation) => {
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setState(s => ({...s, fullscreen: true})), StatusBar.setHidden(true))
      : orientation === 'PORTRAIT' && state.orientation === 'portrait' ?
        (setState(s => ({...s, fullscreen: true})))
      : (setState(s => ({...s, fullscreen: false})),
        StatusBar.setHidden(false));
  }

  const handleFullscreen = () => {
    if (state.fullscreen) {
      // Orientation.lockToPortrait();
      onChangeOrientation(false, 'portrait');
    }
    else if (!state.fullscreen && state.orientation === 'landscape') {
      // Orientation.lockToLandscapeLeft();
      onChangeOrientation(true, 'landscape');
    }
    else if (!state.fullscreen && state.orientation === 'portrait') {
      setState(s => ({...s, fullscreen: true}));
      onChangeOrientation(true, 'portrait');
    } else {
      // Orientation.lockToPortrait();
      setState(s => ({...s, fullscreen: false}));
      onChangeOrientation(false, 'portrait');
    }
  }

  const handlePlayPause = () => {
    // If playing, pause and show controls immediately.
    if (state.play) {
      setState({...state, play: false, showControls: true});
      return;
    }

    setState({...state, play: true});
    setTimeout(() => setState(s => ({...s, showControls: false})), 2000);
  }

  const skipBackward = (n) => {
    const time = Math.ceil(state.currentTime - n);
    
    if (videoRef.current) {
      videoRef.current.seek(time);
      setState({...state, currentTime: time});
    }
  }

  const skipForward = (n) => {
    const time = Math.ceil(state.currentTime + n);

    if (videoRef.current) {
      videoRef.current.seek(time);
      setState({...state, currentTime: time});
    }
  }

  const onSeek = (data) => {
    console.log(videoRef.current, 'onseek');
    
    videoRef.current.seek(data.seekTime);
    setState({...state, currentTime: data.seekTime});
  }

  const onProgress = (data) => {
    setState(s => ({
      ...s,
      currentTime: data.currentTime,
      loading: false,
    }));
  }

  const onEnd = () => {
    setState({...state, play: false});
    videoRef.current.seek(0);
  }

  const onError = () => {
    setState({...state, error: true, loading: false});
  }

  const showControls = () => {
    state.showControls
      ? setState({...state, showControls: false})
      : setState({...state, showControls: true});
  }

  if (hideOnError && state.error) {
    return <View />
  }

  return (
    <>
      <ImageBackground source={{ uri: state.currentTime === 0 ? item.image : '' }} style={{width: '100%', aspectRatio: 3/2}}>
        <TouchableOpacity onPress={showControls}>
          <Video
            ref={videoRef}
            source={{ uri: item.videoFilename }}
            style={
              isMinimize ? { ...initialSize } :
              state.fullscreen && state.orientation === 'landscape' ? { height, width } :
              state.fullscreen && state.orientation === 'portrait' ? { width, height: width } :
              { ...initialSize }
            }
            controls={false}
            resizeMode='contain'
            onLoadStart={onLoadStart}
            onLoad={onLoadEnd}
            onProgress={onProgress}
            onEnd={onEnd}
            onError={onError}
            paused={!state.play}
          />
          {state.showControls && (
            <View style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              justifyContent: 'center'
            }}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity style={{padding: 8}} onPress={handleBackPress}>
                  {/* <MaterialIcons
                    name={'close'}
                    color={colorController}
                    size={isMinimize ? 40 : 26}
                  /> */}
                </TouchableOpacity>

                <TouchableOpacity style={{padding: 8}} onPress={isMinimize ? () => onPressRightButton() : handleFullscreen}>
                  <MaterialIcons
                    name={state.fullscreen ? FullscreenClose : FullscreenOpen}
                    color={colorController}
                    size={isMinimize ? 40 : 26}
                  />
                </TouchableOpacity>
              </View>

              <PlayerControls
                onPlay={handlePlayPause}
                onPause={handlePlayPause}
                playing={state.play}
                showPreviousAndNext={false}
                showSkip={true}
                skipBackwards={skipBackward}
                skipForwards={skipForward}
              />
              <PlayerProgress
                currentTime={state.currentTime}
                duration={state.duration > 0 ? state.duration : 0}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />
            </View>
          )}
        </TouchableOpacity>

        {state.loading && <View style={{position: 'absolute', backgroundColor: Color.theme, justifyContent: 'center', alignItems: 'center', ...initialSize}}>
          <ActivityIndicator color={Color.primary} size='large' />
        </View>}
      </ImageBackground>

      {/* {state.loading && <Header
        color={Color.primary}
        iconLeftButton={isMinimize ? 'close' : 'arrow-back'}
        onPressLeftButton={() => handleBackPress()}
        style={{position: 'absolute', top: -12, left: -16, backgroundColor: 'transparent'}}
      />} */}
    </>
  );
};

VideoPlayerAndroid.defaultProps = defaultProps;
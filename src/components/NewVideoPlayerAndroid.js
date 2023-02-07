import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  useWindowDimensions,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Video from 'react-native-video';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useColor, Text} from '@src/components';

import Slider from '@react-native-community/slider';
import {Container, Divider} from 'src/styled';

const defaultProps = {
  item: {},
};

export const NewVideoPlayerAndroid = ({
  item,
}) => {
  const {height, width} = useWindowDimensions();
  const {Color} = useColor();
  const videoRef = React.createRef();
  const [state, setState] = useState({
    loading: true,
    currentTime: 0,
    duration: 0,
    paused: false,
  });
  const [trigger, setTrigger] = useState(false);
  const [overlay, setOverlay] = useState(true);

  console.log(item, 'haha');

  const loadStart = () => {
    console.log('haha1');
    setState({...state, loading: true});
  };

  const load = ({duration}) => {
    console.log('haha2');  
    setState(s => ({
      ...s,
      loading: false,
      duration: duration,
      currentTime: 0,
      paused: true,
    }));    
  };

  const onEnd = () => {
    setState({...state, paused: true});
    videoRef.current.seek(0);
  }

  const progress = async ({currentTime}) => {    
    console.log('haha3');
    setState(s => ({
      ...s,
      currentTime: currentTime,
    }));
  };

  const backward = () => {
    const time = Math.ceil(state.currentTime - 5);
    if (videoRef.current) {
      videoRef.current.seek(time);
      setState({...state, currentTime: time});
      setTrigger(!trigger);
    }
  };

  const forward = () => {
    const time = Math.ceil(state.currentTime + 5);
    if (videoRef.current) {
      videoRef.current.seek(time);
      setState({...state, currentTime: time});
      setTrigger(!trigger);
    }
  };

  const getTime = time => {
    const digit = n => (n < 10 ? `0${n}` : `${n}`);
    const sec = digit(Math.floor(time % 60));
    const min = digit(Math.floor((time / 60) % 60));
    const hr = digit(Math.floor((time / 3600) % 60));
    if (hr === '00') {
      return min + ':' + sec;
    } else {
      return hr + ':' + min + ':' + sec;
    }
  };

  const onSlide = slide => {
    if (state.paused) {
      videoRef.current.seek(slide * state.duration);
      setState({...state, currentTime: slide * state.duration});
      setTrigger(!trigger);
    }
  };

  let lastTap = null;
  const handleDoubleTap = (doubleTapCallback, singleTapCallback) => {
    const now = Date.now();
    if (lastTap && now - lastTap < 500) {
      doubleTapCallback();
    } else {
      lastTap = now;
      singleTapCallback();
    }
  };

  const seekLeft = () => {
    handleDoubleTap(
      () => {
        const time = Math.ceil(state.currentTime - 5);
        videoRef.current.seek(time);
        setState({...state, currentTime: time});
      },
      () => {
        setOverlay(true);
        setTrigger(!trigger);
      },
    );
  };
  const seekRight = () => {
    handleDoubleTap(
      () => {
        const time = Math.ceil(state.currentTime + 5);
        videoRef.current.seek(time);
        setState({...state, currentTime: time});
      },
      () => {
        setOverlay(true);
        setTrigger(!trigger);
      },
    );
  };

  const pause = () => {
    setState(s => ({
      ...s,
      paused: !s.paused,
    }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOverlay(!overlay);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [trigger]);

  useEffect(() => {
    setState(s => ({
      ...s,
      paused: true,
      currentTime: 0,
    }));
  }, [item]);

  return (
    <Container>
      <Container
        backgroundColor={Color.black}
        width={width}
        height={width * 0.5}>
        {item.videoFileName ? (
          <>
            <Video
              paused={state.paused}
              ref={videoRef}
              onLoadStart={loadStart}
              source={{
                uri: item.videoFileName,
              }}
              resizeMode="cover"
              onLoad={load}
              onEnd={onEnd}
              onProgress={progress}
              style={{width: width, height: width * 0.5}}
            />
            {state.loading === true ? (
              <ImageBackground
                style={{
                  ...StyleSheet.absoluteFillObject,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                source={{uri: item.image}}>
                <ActivityIndicator color={Color.primary} size="large" />
              </ImageBackground>
            ) : (
              <Container
                style={{
                  ...StyleSheet.absoluteFillObject,
                }}>
                {overlay ? (
                  <Container
                    flex={1}
                    flexDirection="row"
                    backgroundColor={'#0006'}>
                    <Container flex={1} align="center" justify="center">
                    <TouchableOpacity
                      onPress={() => {
                        backward();
                      }}>
                      <FontAwesome5
                        name="step-backward"
                        color={Color.textButtonInline}
                        size={18}
                      />
                    </TouchableOpacity>
                  </Container>
                    <Container flex={1} align="center" justify="center">
                      <TouchableOpacity
                        onPress={() => {
                          pause();
                        }}>
                        <FontAwesome5
                          name={state.paused ? 'play' : 'pause'}
                          color={Color.textButtonInline}
                          size={18}
                        />
                      </TouchableOpacity>
                    </Container>
                    <Container flex={1} align="center" justify="center">
                    <TouchableOpacity
                      onPress={() => {
                        forward();
                      }}>
                      <FontAwesome5
                        name="step-forward"
                        color={Color.textButtonInline}
                        size={18}
                      />
                    </TouchableOpacity>
                  </Container>
                    <Container
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 5,
                      }}>
                      <Slider
                        // disabled
                        maximumTrackTintColor={Color.textButtonInline}
                        minimumTrackTintColor={Color.textButtonInline}
                        thumbTintColor={Color.textButtonInline}
                        value={state.currentTime / state.duration}
                        // disabled
                        onValueChange={value => {
                          onSlide(value);
                        }}
                        onSlidingStart={() =>
                          setState({...state, paused: !state.paused})
                        }
                        onSlidingComplete={() =>
                          setState({...state, paused: !state.paused})
                        }
                      />
                      <Container
                        width={width}
                        flexDirection="row"
                        justify="space-between"
                        paddingHorizontal={16}>
                        <Container flex={1} flexDirection="row" align="center">
                          <Text color={Color.textButtonInline} size={8}>
                            {getTime(state.currentTime)}
                          </Text>
                        </Container>
                        <Container flexDirection="row" align="center">
                          <Text color={Color.textButtonInline} size={8}>
                            {getTime(state.duration)}
                          </Text>
                          <Divider width={4} />
                          <TouchableOpacity>
                            <FontAwesome5
                              name="expand"
                              color={Color.textButtonInline}
                              size={8}
                            />
                          </TouchableOpacity>
                        </Container>
                      </Container>
                    </Container>
                  </Container>
                ) : (
                  <Container flex={1} flexDirection="row">
                    <TouchableNativeFeedback onPress={() => seekLeft()}>
                      <Container flex={1} />
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => seekRight()}>
                      <Container flex={1} />
                    </TouchableNativeFeedback>
                  </Container>
                )}
              </Container>
            )}
          </>
        ) : (
          <></>
        )}
      </Container>
    </Container>
  );
};

NewVideoPlayerAndroid.defaultProps = defaultProps;

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { useColor } from '@src/components/Color';
import Text from '@src/components/Text';
// import MultiTapOverlay from '../Button/MultiTapOverlay';

const playIcon = require('@assets/images/video_control/play.png');
const pauseIcon = require('@assets/images/video_control/pause.png');
const forwardIcon = require('@assets/images/video_control/forward.png');
const backwardIcon = require('@assets/images/video_control/backward.png');

const VideoSkipBack = 'fastbackward';
const VideoPrevious = 'stepbackward';
const VideoNext = 'stepforward';
const VideoSkipForward = 'fastforward';

const sizeControls = 16;

export const defaultProps = {
  playing: false,
  showPreviousAndNext: false,
  showSkip: false,
  previousDisabled: false,
  nextDisabled: false,
  onPlay: () => {},
  onPause: () => {},
  skipForwards: () => {},
  skipBackwards: () => {},
  onNext: () => {},
  onPrevious: () => {},
  colorController: '#DDDDDD'
}

export const PlayerControls = ({
  playing,
  showPreviousAndNext,
  showSkip,
  previousDisabled,
  nextDisabled,
  onPlay,
  onPause,
  skipForwards,
  skipBackwards,
  onNext,
  onPrevious,

  colorController,
}) => {
  const [countSkip, setCountSkip] = useState(0);

  const {Color} = useColor();

  useEffect(() => {
    if (countSkip !== 0) {
      if (countSkip > 0) {
        skipForwards(countSkip);
      } else if (countSkip < 0) {
        skipBackwards(Math.abs(countSkip));
      }
    }

    const counter = countSkip !== 0 ?
      setTimeout(() => {
        setCountSkip(0);
      }, 1000) : null;

    return () => {
      if (counter) {
        clearTimeout(counter);
      }
    }
  }, [countSkip]);
  
  return (
    <View style={{
      paddingHorizontal: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      flex: 3,
    }}>
      {/* {showSkip && (
        <TouchableOpacity style={styles.touchable} onPress={skipBackwards}>
          <AntDesign name={VideoSkipBack} color={colorController} size={sizeControls} />
        </TouchableOpacity>
      )} */}

      <View style={{position: 'absolute', left: 0, height: '100%', aspectRatio: 1}}>
        {/* <MultiTapOverlay
          onMultiTaps={(count) => {
            setCountSkip(0 - (count * 10));
          }}>
          <View style={{height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            {countSkip < 0 && <Text size={12} color={Color.textInput}>{countSkip} Detik</Text>}
          </View>
        </MultiTapOverlay> */}
      </View>

      {countSkip === 0 && <>

      <View />

      {(true || showPreviousAndNext) && (
        <TouchableOpacity
          style={[styles.touchable, previousDisabled && {opacity: 0.3}]}
          onPress={onPrevious}
          disabled={true || previousDisabled}>
          <Image source={backwardIcon} style={{width: 16, height: 16, opacity: 0.3}} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.touchable}
        onPress={playing ? onPause : onPlay}>
        <Image source={playing ? pauseIcon : playIcon} style={{width: 56, height: 56}} />
      </TouchableOpacity>

      {(true || showPreviousAndNext) && (
        <TouchableOpacity
          style={[styles.touchable, nextDisabled && {opacity: 0.3}]}
          onPress={onNext}
          disabled={true || nextDisabled}>
          <Image source={forwardIcon} style={{width: 16, height: 16, opacity: 0.3}} />
        </TouchableOpacity>
      )}

      <View />

      </>}

      <View style={{position: 'absolute', right: 0, height: '100%', aspectRatio: 1}}>
        {/* <MultiTapOverlay onMultiTaps={(count) => setCountSkip(count * 10)}>
          <View style={{height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            {countSkip > 0 && <Text size={12} color={Color.textInput}>{countSkip} Detik</Text>}
          </View>
        </MultiTapOverlay> */}
      </View>

      {/* {showSkip && (
        <TouchableOpacity style={styles.touchable} onPress={skipForwards} color={colorController}>
          <AntDesign name={VideoSkipForward} color={colorController} size={sizeControls} />
        </TouchableOpacity>
      )} */}
    </View>
  )
};

const styles = StyleSheet.create({
  touchable: {
    padding: 5,
  },
});

PlayerControls.defaultProps = defaultProps;
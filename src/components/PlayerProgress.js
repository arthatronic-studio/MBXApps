import React from 'react';
import Slider from '@react-native-community/slider';
import { View } from 'react-native';

import Text from '@src/components/Text';
import { useColor } from '@src/components/Color';
import { getMinutesFromSeconds } from '@src/utils/getMinutesFromSeconds';

const defaultProps = {
  currentTime: 0,
  duration: 0,
  onSlideCapture: () => {},
  onSlideStart: () => {},
  onSlideComplete: () => {},
}

export const PlayerProgress = ({
  currentTime,
  duration,
  onSlideCapture,
  onSlideStart,
  onSlideComplete,
}) => {
  const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration);

  const handleOnSlide = (time) => {
    onSlideCapture({seekTime: time});
  };

  const {Color} = useColor();

  return (
    <View style={{flex: 1, paddingBottom: 8}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16}}>
        <Text size={12} color={Color.textInput} style={{}}>{position}</Text>
        <Text size={12} color={Color.textInput} style={{}}>{fullDuration}</Text>
      </View>
      <Slider
        value={currentTime}
        minimumValue={0}
        maximumValue={duration}
        step={1}
        onValueChange={handleOnSlide}
        onSlidingStart={onSlideStart}
        onSlidingComplete={onSlideComplete}
        minimumTrackTintColor={Color.primary}
        maximumTrackTintColor={Color.semiwhite}
        thumbTintColor={Color.primary}
        thumbStyle={{height: 12, width: 12, borderRadius: 6}}
        trackStyle={{height: 2}}
      />
    </View>
  );
};

PlayerProgress.defaultProps = defaultProps;
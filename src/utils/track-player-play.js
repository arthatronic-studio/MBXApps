import TrackPlayer from 'react-native-track-player';

export const trackPlayerPlay = async (data, index) => {
  const result = await Promise.all(
    data.map((play) => {
      return {
        id: play.code,
        url: play.videoFilename,
        // type: 'default',
        title: play.productName,
        // album: play.productDescription,
        artist: play.productDescription,
        artwork: play.image,
      }
    })
  );

  const currentTrack = await TrackPlayer.getCurrentTrack();
  const thisTrack = currentTrack != null ? await TrackPlayer.getTrack(currentTrack) : null;

  const isExist = result.filter((e) => thisTrack !== null && e.id === thisTrack.id)[0];

  if (isExist && currentTrack === index) {
    console.log('exist yes');
  }
  else if (isExist) {
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  }
  else {
    await TrackPlayer.reset();
    await TrackPlayer.add(result);
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  }

  // await TrackPlayer.updateOptions({
  //   stopWithApp: true,
  //   capabilities: [
  //     TrackPlayer.CAPABILITY_PLAY,
  //     TrackPlayer.CAPABILITY_PAUSE,
  //     TrackPlayer.CAPABILITY_STOP,
  //     TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
  //     TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
  //     // TrackPlayer.CAPABILITY_JUMP_FORWARD,
  //     // TrackPlayer.CAPABILITY_JUMP_BACKWARD,
  //   ],
  // });

  return true;
};
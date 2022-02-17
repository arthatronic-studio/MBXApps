import TrackPlayer from 'react-native-track-player';

import { store } from '@src/state/redux';
import ImagesPath from 'src/components/ImagesPath';

export const trackPlayerPlay = async (data, selected) => {
    // const playNow = store.getState()['playNow'];
    
    // const result = await Promise.all(
    //   data.map((play) => {
    //     return {
    //       id: play.id.toString(),
    //       url: play.videoFilename,
    //       type: 'default',
    //       title: play.productName,
    //       album: play.productDescription,
    //       artist: play.productDescription,
    //       artwork: play.image,
    //     }
    //   })
    // );

    // if (playNow.productCategory !== selected.productCategory || playNow.data.length === 0) {
      await TrackPlayer.reset();
    //   await store.dispatch({ type: 'PLAYNOW.SET_DATA', data: data }); //result changes
    //   await store.dispatch({ type: 'PLAYNOW.SET_PRODUCT_CATEGORY', data: selected.productCategory });
    // }

    // const currentTrack = await TrackPlayer.getCurrentTrack();

    // if (currentTrack) {
    //   await TrackPlayer.skip(selected.id.toString());
    //   await TrackPlayer.play();
    // } else {
      const result = {
        id: 'trackId',
        url: require('@assets/musicplayback.mp3'),
        title: 'Deen Assalam',
        artist: 'Sabyan Gambus',
        artwork: ImagesPath.sabyanMusic,
      }
      await TrackPlayer.add(result);
      // await TrackPlayer.skip(selected.id.toString());
      await TrackPlayer.play();
    // }

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
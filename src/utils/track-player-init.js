import TrackPlayer, { Capability } from 'react-native-track-player';

export const trackPlayerInit = async () => {
    await TrackPlayer.setupPlayer({
      
    });

    // await TrackPlayer.add([
    //   {
    //     id: '1',
    //     url: "http://13.251.34.165:7070/assets/music/Sheila on 7 - Film Favorit [Official Music Video].mp3",
    //     type: 'default',
    //     title: 'Film Favorite',
    //     album: 's07',
    //     artist: 'Single',
    //     artwork: 'https://picsum.photos/100',
    //   },
    //   {
    //     id: '2',
    //     url: "https://audio-previews.elements.envatousercontent.com/files/103682271/preview.mp3",
    //     type: 'default',
    //     title: 'My Title',
    //     album: 'My Album',
    //     artist: 'Rohan Bhatia',
    //     artwork: 'https://picsum.photos/100',
    //   }
    // ]);

    await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
          // Capability.JumpBackward,
          // Capability.JumpForward,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
        // playIcon: require('./play-icon.png'),
        // pauseIcon: require('./pause-icon.png'),
        // stopIcon: require('./stop-icon.png'),
        // previousIcon: require('./previous-icon.png'),
        // nextIcon: require('./next-icon.png'),
        // icon: require('./notification-icon.png')
    });

    return true;
};
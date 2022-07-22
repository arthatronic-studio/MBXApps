const config = {
  screens: {
    NotificationScreen: {
      path: "notification",
    },
    Chat: 'chat',
    NewsDetailV2: {
      path: "artikel/:code",
      parse: {
        code: (code) => `${code}`,
      }
    }
  },
};

const linking = {
  prefixes: ['tribes://'],
  config,
};

export default linking;
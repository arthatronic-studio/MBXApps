const config = {
  screens: {
    NotificationScreen: {
      path: "notification",
    },
    Chat: 'chat',
    NewsDetail: {
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
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
    },
    DetailPicuWujudkanScreen: {
      path: "picuwujudkan/:id",
      parse: {
        id: (id) => `${id}`,
      }
    }
  },
};

const linking = {
  prefixes: ['blocx://'],
  config,
};

export default linking;
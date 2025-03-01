declare namespace CozeWebSDK {
  class WebChatClient {
    constructor(config: {
      config: {
        bot_id: string;
      };
      componentProps: {
        title: string;
      };
      auth: {
        type: string;
        token: string;
        onRefreshToken: () => string;
      };
    });
  }
}
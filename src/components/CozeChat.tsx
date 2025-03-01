import React, { useEffect } from 'react';

declare global {
  interface Window {
    CozeWebSDK: any;
  }
}

interface CozeChatProps {
  projectId: string;
}

const CozeChat: React.FC<CozeChatProps> = ({ projectId }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.3/libs/oversea/index.js";
    script.async = true;
    script.onload = () => {
      new window.CozeWebSDK.WebChatClient({
        config: {
          bot_id: '7476748955385430021',
          conversation_id: `project-${projectId}`,
        },
        componentProps: {
          title: 'Bidzy Assistant',
        },
        auth: {
          type: 'token',
          token: 'pat_HpLsFWsuO9sDgakxO1xiM4ziXEpkVHzTtw5QvLBlg8bjxHDGWiNNCmvDZsQKYxse',
          onRefreshToken: function() {
            return 'pat_HpLsFWsuO9sDgakxO1xiM4ziXEpkVHzTtw5QvLBlg8bjxHDGWiNNCmvDZsQKYxse';
          }
        }
      });
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [projectId]);

  return null;
};

export default CozeChat;
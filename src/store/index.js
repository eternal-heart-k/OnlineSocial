import { createStore } from 'vuex'
import ModuleUser from './user';
import ModuleFollow from './follow';
import ModuleProfile from './profile';
import ModulePost from './post';
import ModuleComment from './comment';
import { ElMessage } from 'element-plus';
import ModuleMessage from './message';

export default createStore({
  state: {
    urlPre: "https://localhost:7030", // "https://kanghui29.cn" "https://localhost:7030"
    address: "localhost:7030",
    unAuthorize: "身份认证已过期，请重新登录",
    nowImagePreview: null,
    addFollowPageType: 0, // 0热门页；1个人空间页
    socket: null,
  },
  getters: {
  },
  mutations: {
    setNowImagePreview(state, data) {
      state.nowImagePreview = data;
    },
    clearNowImagePreview(state) {
      state.nowImagePreview = null;
    },
    updateAddFollowPageType(state, data) {
      state.addFollowPageType = data;
    },
    setNewWebSocket(state) {
      state.socket = new WebSocket(`wss://${state.address}/api/websocket/wss`, ["client", state.user.accessToken]);
    },
  },
  actions: {
    beforeAction(context, data) {
      if (!context.rootState.user.isLogin) {
        ElMessage.error("暂未登录，请先登录");
        return;
      }
      data.func();
    },
    setWebSocket(context) {
      context.commit("setNewWebSocket");
      context.rootState.socket.onmessage = function(data) {
        let message = JSON.parse(data.data);
        if (message.ReceiveUserId == context.rootState.user.userId) { // 是给自己的
          if (context.rootState.message.getMessageUIdSet.has(message.UId)) {
            return ;
          }
          context.commit("addGetMessageUIdSet", message.UId);
          if (message.Type == 2 || message.Type == "Chat") { // 聊天
            console.log("chat");
            if (message.SendUserId == context.rootState.message.currentChatUserId) { // 刚好是当前聊天对象发的
              console.log("currentchatuser");
              // 聊天框加入消息
              context.commit("addChatMessageList", {
                SendUserId: message.SendUserId,
                ReceiveUserId: message.ReceiveUserId,
                HasRead: false,
                Content: message.Content,
                CreationTime: message.CreationTime
              });
              // 未读消息++
              context.commit("addNotReadCountFromChatUserList", {
                UserId: message.SendUserId,
                CreationTime: message.CreationTime,
                Content: message.Content
              });
            } else {
              console.log("other");
              context.commit("addNewMessageButNotCurrentChatUser", {
                UserId: message.SendUserId,
                UserName: message.SendUserName,
                AvatarUrl: message.SendUserAvatarUrl,
                HasRead: false,
                Content: message.Content,
                CreationTime: message.CreationTime
              });
            }
          }
        }
      };
    }
  },
  modules: {
    user: ModuleUser,
    follow: ModuleFollow,
    profile: ModuleProfile,
    post: ModulePost,
    comment: ModuleComment,
    message: ModuleMessage,
  }
})

import { createStore } from 'vuex'
import ModuleUser from './user';
import ModuleFollow from './follow';
import ModuleProfile from './profile';
import ModulePost from './post';
import ModuleComment from './comment';
import { ElMessage } from 'element-plus';
import ModuleMessage from './message';
import ModuleFeedback from './feedback';

export default createStore({
  state: {
    urlPre: "https://localhost:7030", // "https://kanghui29.cn" "https://localhost:7030"
    address: "localhost:7030",
    unAuthorize: "身份认证已过期，请重新登录",
    nowImagePreview: null,
    addFollowPageType: 0, // 0热门页；1个人空间页
    socket: null,
    nowMessage: null,
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
    updateSocketMessage(state, data) {
      state.nowMessage = data;
    }
  },
  actions: {
    beforeAction(context, data) {
      if (!context.rootState.user.isLogin) {
        ElMessage.error("暂未登录，请先登录");
        return;
      }
      data.func();
    },
    resendSocketMessage(context) {
      context.dispatch("setWebSocket", {
        success() {
          setTimeout(() => {
            context.state.socket.send(JSON.stringify(context.state.nowMessage));
          }, 300);
        }
      });
    },
    setWebSocket(context, data) {
      context.commit("setNewWebSocket");
      context.rootState.socket.onclose = function () {
        context.dispatch("resendSocketMessage");
      };
      context.rootState.socket.onmessage = function(data) {
        let message = JSON.parse(data.data);
        if (message.ReceiveUserId == context.rootState.user.userId) { // 是给自己的
          if (context.rootState.message.getMessageUIdSet.has(message.UId)) {
            return ;
          }
          context.commit("addGetMessageUIdSet", message.UId);
          if (message.Type == 2 || message.Type == "Chat") { // 聊天
            if (message.SendUserId == context.rootState.message.currentChatUserId) { // 刚好是当前聊天对象发的
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
          } else if (message.Type == 0 || message.Type == "LikePost" || message.Type == 1 || message.Type == "LikeComment") { // 点赞帖子/点赞评论
            context.commit("addNewMessageNotify", {
              Index: 1,
              Message: {
                ...message,
                HasRead: false
              }
            });
          } else if (message.Type == 3 || message.Type == "CommentPost" || message.Type == 4 || message.Type == "CommentComment") { // 评论帖子/评论评论
            context.commit("addNewMessageNotify", {
              Index: 0,
              Message: {
                ...message,
                HasRead: false
              }
            });
          } else if (message.Type == 5 || message.Type == "Other") { // 其他通知
            context.commit("addNewMessageNotify", {
              Index: 2,
              Message: {
                ...message,
                HasRead: false
              }
            });
          }
        }
      };
      data.success();
    }
  },
  modules: {
    user: ModuleUser,
    follow: ModuleFollow,
    profile: ModuleProfile,
    post: ModulePost,
    comment: ModuleComment,
    message: ModuleMessage,
    feedback: ModuleFeedback,
  }
})

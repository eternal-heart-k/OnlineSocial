import $ from 'jquery';
import { ElMessage } from 'element-plus';

const ModuleMessage = {
    state: {
        selectType: 0,
        chatUserList: [],
        chatMessageList: [],
        currentChatUserId: "",
        currentChatUserName: "",
        currentChatUserAvatarUrl: "",
        messageUIdSet: new Set(),
        getMessageUIdSet: new Set(),
    },
    getters: {
    },
    mutations: {
        updateMessageSelectType(state, status) {
            state.selectType = status;
        },
        refreshChatUserList(state, data) {
            state.chatUserList = data;
        },
        addChatUserList(state, data) {
            state.chatUserList = data.concat(state.chatUserList);
        },
        addNewMessageButNotCurrentChatUser(state, data) {
            let index = state.chatUserList.findIndex(x => x.UserId == data.UserId);
            let newData = {
                UserId: data.UserId,
                UserName: data.UserName,
                AvatarUrl: data.AvatarUrl,
                NotReadCount: 1,
                Content: data.Content,
                CreationTime: data.CreationTime
            }
            if (index != -1) {
                newData.NotReadCount = state.chatUserList[index].NotReadCount + 1;
                state.chatUserList.splice(index, 1);
            }
            state.chatUserList.unshift(newData);            
        },
        addNotReadCountFromChatUserList(state, data) {
            let index = state.chatUserList.findIndex(x => x.UserId == data.UserId);
            if (index == -1) return;
            let newUserChat = {
                UserId: data.UserId,
                UserName: state.chatUserList[index].UserName,
                AvatarUrl: state.chatUserList[index].AvatarUrl,
                NotReadCount: state.chatUserList[index].NotReadCount + 1,
                CreationTime: data.CreationTime,
                Content: data.Content
            };
            state.chatUserList.splice(index, 1);
            state.chatUserList.unshift(newUserChat);
        },
        clearChatUserNotReadCount(state, userId) {
            for (let i = 0; i < state.chatUserList.length; i ++ ) {
                if (state.chatUserList[i].UserId == userId) {
                    state.chatUserList[i].NotReadCount = 0;
                    break;
                }
            }
        },
        sendMessageUpdateChatUserContent(state, data) {
            for (let i = 0; i < state.chatUserList.length; i ++ ) {
                if (state.chatUserList[i].UserId == data.UserId) {
                    state.chatUserList[i].Content = data.Content;
                    state.chatUserList[i].CreationTime = data.CreationTime;
                    break;
                }
            }
        },
        updateCurrentChatUserInfo(state, data) {
            state.currentChatUserId = data.UserId;
            state.currentChatUserName = data.UserName;
            state.currentChatUserAvatarUrl = data.AvatarUrl;
        },
        refreshChatMessageList(state, data) {
            state.chatMessageList = data;
        },
        addChatMessageList(state, data) {
            state.chatMessageList.push(data);
        },
        addMessageUIdSet(state, data) {
            state.messageUIdSet.add(data);
        },
        addGetMessageUIdSet(state, data) {
            state.getMessageUIdSet.add(data);
        },
    },
    actions: {
        getChatUserList(context, data) {
            if (!context.rootState.user.isLogin) {
                ElMessage.error("暂未登录，请先登录");
                return;
            }
            $.ajax({
                url: context.rootState.urlPre + "/api/chatlog/all/last?receiveUserId=" + context.rootState.user.userId,
                type: "get",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
                success(resp) {
                    if (resp.IsSuccess) {
                        data.success(resp.Result);
                    } else {
                        data.error(resp.Message);
                    }
                }
            });
        },
        getChatMessageListByUserId(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/chatlog/list",
                type: "post",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
                data: JSON.stringify(data.param),
                contentType: "application/json",
                success(resp) {
                    if (resp.IsSuccess) {
                        data.success(resp.Result);
                    } else {
                        data.error(resp.Message);
                    }
                }
            });
        },
        updateUserChatReadStatus(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/chatlog/read/status",
                type: "put",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
                data: JSON.stringify(data.param),
                contentType: "application/json",
                success(resp) {
                    if (resp.IsSuccess) {
                        data.success();
                    } else {
                        data.error(resp.Message);
                    }
                }
            });
        },
    },
    modules: {
    }
};

export default ModuleMessage;

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
            if (!context.rootState.user.isLogin) {
                ElMessage.error("暂未登录，请先登录");
                return;
            }
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
    },
    modules: {
    }
};

export default ModuleMessage;

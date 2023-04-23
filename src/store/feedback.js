import $ from 'jquery';

const ModuleFeedback = {
    state: {
        feedbackDialogVisible: false,

        feedbackMessageNotifyList: [],
        feedbackMessageNotifyTotalCount: 0,
        feedbackMessageNotifyPageIndex: 1,
        feedbackMessageNotifyNotReadCount: 0,
    },
    getters: {
    },
    mutations: {
        updateFeedbackDialogVisibleStatus(state, status) {
            state.feedbackDialogVisible = status;
        },

        refreshFeedbackList(state, data) {
            state.feedbackMessageNotifyList = data.Items;
            state.feedbackMessageNotifyPageIndex = 2;
            if (data.SelectType == null) {
                state.feedbackMessageNotifyTotalCount = data.TotalCount;
            } else {
                state.feedbackMessageNotifyNotReadCount = data.TotalCount;
            }
        },
        addFeedbackList(state, data) {
            state.feedbackMessageNotifyList = state.feedbackMessageNotifyList.concat(data.Items);
            state.feedbackMessageNotifyPageIndex ++ ;
        },
        setFeedbackNotReadCount(state, data) {
            state.feedbackMessageNotifyNotReadCount = data;
        },
        updateFeedbackReadStatus(state, index) {
            state.feedbackMessageNotifyList[index].HasRead = true;
            state.feedbackMessageNotifyNotReadCount -- ;
        },
    },
    actions: {
        addFeedback(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/feedback",
                type: "post",
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
        getFeedbackList(context, data) {
            $.ajax({
                url: context.rootState.urlPre + '/api/feedback/list',
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
        getFeedbackNotReadCount(context, data) {
            $.ajax({
                url: context.rootState.urlPre + '/api/feedback/not/read/count?userid=' + context.rootState.user.userId,
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
        updateFeedbackHasRead(context, data) {
            $.ajax({
                url: context.rootState.urlPre + '/api/feedback/status?id=' + data.Id,
                type: "put",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
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

export default ModuleFeedback;

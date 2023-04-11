import $ from 'jquery';

const ModuleFollow = {
    state: {
        followCount: 0,
        followedCount: 0,
    },
    getters: {
    },
    mutations: {
        updateFollowCount(state, count) {
            state.followCount = count;
        },
        updateFollowedCount(state, count) {
            state.followedCount = count;
        },
    },
    actions: {
        getFollowCount(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/follow/count?userId=" + context.rootState.user.userId,
                type: "get",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
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
        getFollowedCount(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/follow/fans?userId=" + context.rootState.user.userId,
                type: "get",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
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

export default ModuleFollow;

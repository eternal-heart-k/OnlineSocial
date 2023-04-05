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
        getFollowCount(context) {
            console.log(context, context.rootState.user.AccessToken);
            $.ajax({
                url: context.rootState.urlPre + "/api/follow/count?userId=" + context.rootState.user.userId,
                type: "get",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
                contentType: "application/json",
                success(resp) {
                    if (resp.IsSuccess) {
                        context.commit("updateFollowCount", resp.Result);
                    } else {
                        alert(resp.Message);
                    }
                }
            });
        },
        getFollowedCount(context) {
            $.ajax({
                url: context.rootState.urlPre + "/api/follow/fans?userId=" + context.rootState.user.userId,
                type: "get",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
                contentType: "application/json",
                success(resp) {
                    if (resp.IsSuccess) {
                        context.commit("updateFollowedCount", resp.Result);
                    } else {
                        alert(resp.Message);
                    }
                }
            });
        },
    },
    modules: {
    }
};

export default ModuleFollow;

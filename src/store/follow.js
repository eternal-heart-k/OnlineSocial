import $ from 'jquery';

const ModuleFollow = {
    state: {
        followCount: 0,
        followedCount: 0,
        followGroupVisible: false,
        followGroupList: [],

        changeFollowGroupVisible: false,
        lastFollowGroupIndex: 0,
        selectFollowId: 0,
        selectFollowIndex: 0,
        selectValue: [],

        deleteFollowGroupVisible: false,
        addFollowShowGroupVisible: false,
        addFollowUserId: "",
    },
    getters: {
    },
    mutations: {
        updateFollowCount(state, count) {
            state.followCount = count;
        },
        updateFollowCountWithCancel(state) {
            state.followCount -- ;
        },
        updateFollowCountWithFollow(state) {
            state.followCount ++ ;
        },
        updateFollowedCount(state, count) {
            state.followedCount = count;
        },
        updateFollowGroupVisible(state, status) {
            state.followGroupVisible = status;
        },
        refreshFollowGroupList(state, data) {
            state.followGroupList = data;
        },
        updateFollowInfoVisible(state, data) {
            state.followGroupList[data.Index].FollowInfoVisible = data.status;
        },
        updateChangeFollowGroupVisible(state, status) {
            state.changeFollowGroupVisible = status;
        },
        updateLastFollowGroupIndex(state, lastFollowGroupIndex) {
            state.lastFollowGroupIndex = lastFollowGroupIndex;
        },
        refreshSelectValue(state, data) {
            state.lastFollowGroupIndex = data.FollowGroupIndex;
            state.selectFollowId = data.FollowId;
            state.selectFollowIndex = data.FollowIndex;
            state.selectValue = state.followGroupList.slice();
            console.log(state.selectValue, data.FollowGroupIndex);
            state.selectValue.splice(data.FollowGroupIndex, 1);
        },
        updateDeleteFollowGroupVisible(state, status) {
            state.deleteFollowGroupVisible = status;
        },
        updateAddFollowShowGroupVisible(state, data) {
            state.addFollowShowGroupVisible = data.Status;
            state.addFollowUserId = data.UserId;
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
        followUser(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/follow",
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
        getFollowGroupList(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/follow/all?userId=" + context.rootState.user.userId,
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
        addFollowGroup(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/follow/group",
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
        moveNewFollowGroup(context, data) {
            $.ajax({
                url: context.rootState.urlPre + `/api/follow/move?followId=${context.state.selectFollowId}&followGroupId=${data.FollowGroupId}`,
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
        deleteFollowGroup(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/follow/group?id=" + data.GroupId,
                type: "delete",
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
        cancelFollow(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/follow?id=" + data.Id,
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
        cancelFollowByUserId(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/follow/userid",
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

export default ModuleFollow;

import $ from 'jquery';

const ModulePost = {
    state: {
        postEditShow: false,
        hotPostList: [],
        followPostList: [],
        myPostList: [],
        hotPageIndex: 1,
        followPageIndex: 1,
        myPageIndex: 1,
        myTotalCount: 0,
    },
    getters: {
    },
    mutations: {
        updatePostEditShow(state, status) {
            state.postEditShow = status;
        },
        refreshHotPostList(state, data) {
            state.hotPageIndex = 1;
            state.hotPostList = data;
        },
        addHotPostList(state, data) {
            state.hotPageIndex ++ ;
            state.hotPostList.push(data);
        },
        refreshFollowPostList(state, data) {
            state.followPageIndex = 1;
            state.followPostList = data;
        },
        addFollowPostList(state, data) {
            state.followPageIndex ++ ;
            state.followPostList.push(data);
        },
        refreshMyPostList(state, data) {
            state.myTotalCount = data.TotalCount;
            state.myPageIndex = 1;
            state.myPostList = data.Items;
        },
        addMyPostList(state, data) {
            state.myPageIndex ++ ;
            state.myPostList.push(data);
        },
        deleteMyPostFromList(state, id) {
            state.myPostList = state.myPostList.filter((item) => {
                return item.Id != id;
            });
        },
        updateMyPostLikeStatus(state, id) {
            for (let item of state.myPostList) {
                if (item.Id == id) {
                    if (item.IsLiked) {
                        item.LikeCount -- ;
                    } else {
                        item.LikeCount ++ ;
                    }
                    item.IsLiked = !item.IsLiked;
                }
            }
        }
    },
    actions: {
        updatePostEditShow(context, data) {
            context.commit("updatePostEditShow", data.Status);
        },
        uploadFileList(context, data) {
            const formData = new FormData();
            for (let item of data.param) {
                formData.append('formFiles', item);
            }
            $.ajax({
                url: context.rootState.urlPre + "/api/tool/upload/image/list",
                type: "post",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
                data: formData,
                processData: false,
                contentType: false,
                success(resp) {
                    if (resp.IsSuccess) {
                        data.success(resp.Result);
                    } else {
                        alert(resp.Message);
                    }
                }
            });
        },
        postAPost(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/post",
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
        getPostList(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/post/page",
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
        deleteMyPost(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/post?id=" + data.Id,
                type: "delete",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
                contentType: "application/json",
                success(resp) {
                    if (resp.IsSuccess) {
                        context.commit("deleteMyPostFromList", data.Id);
                        data.success();
                    } else {
                        data.error(resp.Message);
                    }
                }
            });
        },
        like(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/post/like",
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
        cancelLike(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/post/like",
                type: "delete",
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

export default ModulePost;

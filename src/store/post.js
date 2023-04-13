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
            state.hotPageIndex = 2;
            state.hotPostList = data;
        },
        addHotPostList(state, data) {
            state.hotPageIndex ++ ;
            state.hotPostList = state.hotPostList.concat(data);
        },
        refreshFollowPostList(state, data) {
            state.followPageIndex = 2;
            state.followPostList = data;
        },
        addFollowPostList(state, data) {
            state.followPageIndex ++ ;
            state.followPostList = state.followPostList.concat(data);
        },
        addMyPostList(state, data) {
            state.myTotalCount = data.TotalCount;
            state.myPageIndex ++ ;
            state.myPostList = state.myPostList.concat(data.Items);
        },
        deleteMyPostFromList(state, index) {
            state.myPostList.splice(index, 1);
        },
        updateMyPostLikeStatus(state, data) {
            if (data.Status) {
                state.myPostList[data.PostIndex].LikeCount -- ;
            } else {
                state.myPostList[data.PostIndex].LikeCount ++ ;
            }
            state.myPostList[data.PostIndex].IsLiked = !data.Status;
        },
        updateMyPostCommentLikeStatus(state, data) {
            if (data.Status) {
                state.myPostList[data.PostIndex].PostCommentList[data.PostCommentIndex].LikeCount -- ;
            } else {
                state.myPostList[data.PostIndex].PostCommentList[data.PostCommentIndex].LikeCount ++ ;
            }
            state.myPostList[data.PostIndex].PostCommentList[data.PostCommentIndex].IsLiked = !data.Status;
        },
        updateMyPostCommentOrderType(state, data) {
            state.myPostList[data.PostIndex].CommentOrderType = data.OrderType;
        },
        refreshMyPostComment(state, data) {
            state.myPostList[data.PostIndex].PostCommentPageIndex = 2;
            state.myPostList[data.PostIndex].PostCommentList = data.Items;
            state.myPostList[data.PostIndex].CommentCount = data.TotalCount;
        },
        addMyPostComment(state, data) {
            state.myPostList[data.PostIndex].PostCommentPageIndex ++ ;
            state.myPostList[data.PostIndex].CommentCount = data.TotalCount;
            state.myPostList[data.PostIndex].PostCommentList = state.myPostList[data.PostIndex].PostCommentList.concat(data.Items);
        },
        updateMyPostCommentNoMore(state, data) {
            state.myPostList[data.PostIndex].NoMore = data.Status;
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

import $ from 'jquery';

const ModulePost = {
    state: {
        postEditShow: false,

        hotRangeType: 0,
        hotPostList: [],
        hotPageIndex: 1,
        hotUserList: [],
        hotUserTotalCount: 0,
        followHotUserListIndex: 0,

        followPostList: [],
        followPageIndex: 1,

        myPostList: [],
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
        updateHotPostLikeStatus(state, data) {
            if (data.Status) {
                state.hotPostList[data.PostIndex].LikeCount -- ;
            } else {
                state.hotPostList[data.PostIndex].LikeCount ++ ;
            }
            state.hotPostList[data.PostIndex].IsLiked = !data.Status;
        },
        deleteHotPostFromList(state, index) {
            state.hotPostList.splice(index, 1);
        },
        updateHotPostCommentLikeStatus(state, data) {
            if (data.Status) {
                state.hotPostList[data.PostIndex].PostCommentList[data.PostCommentIndex].LikeCount -- ;
            } else {
                state.hotPostList[data.PostIndex].PostCommentList[data.PostCommentIndex].LikeCount ++ ;
            }
            state.hotPostList[data.PostIndex].PostCommentList[data.PostCommentIndex].IsLiked = !data.Status;
        },
        deleteHotPostComment(state, data) {
            state.hotPostList[data.PostIndex].CommentCount -- ;
            state.hotPostList[data.PostIndex].PostCommentList.splice(data.PostCommentIndex, 1);
        },
        updateHotPostCommentOrderType(state, data) {
            state.hotPostList[data.PostIndex].CommentOrderType = data.OrderType;
            state.hotPostList[data.PostIndex].PostCommentList = [];
        },
        updateHotPostCommentLoading(state, data) {
            state.hotPostList[data.PostIndex].PostCommentLoading = data.Status;
        },
        updateHotPostCommentNoMore(state, data) {
            state.hotPostList[data.PostIndex].NoMore = data.Status;
        },
        refreshHotPostComment(state, data) {
            state.hotPostList[data.PostIndex].PostCommentPageIndex = 2;
            state.hotPostList[data.PostIndex].PostCommentList = data.Items;
            state.hotPostList[data.PostIndex].CommentCount = data.TotalCount;
        },
        addHotPostComment(state, data) {
            state.hotPostList[data.PostIndex].PostCommentPageIndex ++ ;
            state.hotPostList[data.PostIndex].PostCommentList = state.hotPostList[data.PostIndex].PostCommentList.concat(data.Items);
        },
        updateHotRangeType(state, status) {
            state.hotRangeType = status;
            state.hotPostList = [];
            state.hotPageIndex = 1;
        },
        updateHotUserList(state, data) {
            state.hotUserList = data.Items;
        },
        refreshHotUserList(state, data) {
            state.hotUserTotalCount = data.TotalCount;
            state.hotUserList = data.Items;
        },
        updateHotUserFollowStatus(state) {
            state.hotUserList[state.followHotUserListIndex].IsFollowed = true;
        },
        updateFollowHotUserListIndex(state, index) {
            state.followHotUserListIndex = index;
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
            state.myPostList[data.PostIndex].PostCommentList = [];
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
        },
        updateMyPostCommentLoading(state, data) {
            state.myPostList[data.PostIndex].PostCommentLoading = data.Status;
        },
        updateMyPostCommentReplyCount(state, data) {
            state.myPostList[data.PostIndex].PostCommentList[data.PostCommentIndex].ReplyCount ++ ;
        },
        deleteMyPostComment(state, data) {
            state.myPostList[data.PostIndex].CommentCount -- ;
            state.myPostList[data.PostIndex].PostCommentList.splice(data.PostCommentIndex, 1);
        },
        deleteMyPostCommentByCommentId(state, commentId) {
            let flag = false;
            for (let i = 0; i < state.myPostList.length; i ++ ) {
                if (flag) break;
                for (let j = 0; j < state.myPostList[i].PostCommentList.length; j ++ ) {
                    if (state.myPostList[i].PostCommentList[j].Id == commentId) {
                        state.myPostList[i].PostCommentList.splice(j, 1);
                        state.myPostList[i].CommentCount -- ;
                        flag = true;
                        break;
                    }
                }
            }
        },
        updateMyPostCommentReplyCountByRootCommentId(state, rootCommentId) {
            let flag = false;
            for (let i = 0; i < state.myPostList.length; i ++ ) {
                if (flag) break;
                for (let j = 0; j < state.myPostList[i].PostCommentList.length; j ++ ) {
                    if (state.myPostList[i].PostCommentList[j].Id == rootCommentId) {
                        state.myPostList[i].PostCommentList[j].ReplyCount ++ ;
                        flag = true;
                        break;
                    }
                }
            }
        },
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
        getHotUserList(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/user/hot/page",
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

export default ModulePost;

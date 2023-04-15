import $ from 'jquery';

const ModuleComment = {
    state: {
        postCommentCommentVisible: false,
        subCommentVisible: false,
        subCommentList: [],
        subCommentIndex: 1,
        orderType: 0,
        subCommentCommentVisible: false,
    },
    getters: {
    },
    mutations: {
        updatePostCommentCommentVisible(state, status) {
            state.postCommentCommentVisible = status;
        },
        updateSubCommentVisible(state, status) {
            state.subCommentVisible = status;
        },
        refreshSubCommentList(state, data) {
            state.subCommentList = data;
            state.subCommentIndex = 2;
        },
        AddSubCommentList(state, data) {
            state.subCommentList = state.subCommentList.concat(data);
            state.subCommentIndex ++ ;
        },
        updateSubCommentOrderType(state, status) {
            state.orderType = status;
            state.subCommentList = [];
        },
        updateSubCommentHoverStatus(state, data) {
            state.subCommentList[data.Index].IsHover = data.Status;
        },
        updateSubCommentLikeStatus(state, data) {
            if (data.Status) {
                state.subCommentList[data.Index].LikeCount -- ;
            } else {
                state.subCommentList[data.Index].LikeCount ++ ;
            }
            state.subCommentList[data.Index].IsLiked = !data.Status;
        },
        deleteRootComment(state) {
            state.subCommentVisible = false;
            state.subCommentList = [];
            state.subCommentIndex = 1;
            state.orderType = 0;
        },
        deleteSubComment(state, index) {
            state.subCommentList.splice(index, 1);
        },
        updateSubCommentCommentVisible(state, status) {
            state.subCommentCommentVisible = status;
        },
    },
    actions: {
        commentPost(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/post/comment",
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
        uploadSingleImage(context, data) {
            const formData = new FormData();
            formData.append('formFile', data.File);
            $.ajax({
                url: context.rootState.urlPre + "/api/tool/upload/image",
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
                        data.error(resp.Message);
                    }
                }
            });
        },
        getPostCommentByPostId(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/post/comment/page",
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
        commentComment(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/post/comment",
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
        getSubCommentByCommentId(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/post/sub/comment/page",
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
        deleteComment(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/post/comment?id=" + data.Id,
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
        }
    },
    modules: {
    }
};

export default ModuleComment;

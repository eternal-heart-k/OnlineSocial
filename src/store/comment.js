import $ from 'jquery';

const ModuleComment = {
    state: {
    },
    getters: {
    },
    mutations: {
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
        }
    },
    modules: {
    }
};

export default ModuleComment;

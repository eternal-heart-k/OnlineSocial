import $ from 'jquery';

const ModulePost = {
    state: {
        postEditShow: false,
    },
    getters: {
    },
    mutations: {
        updatePostEditShow(state, status) {
            state.postEditShow = status;
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
        }
    },
    modules: {
    }
};

export default ModulePost;

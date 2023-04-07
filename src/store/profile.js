import $ from 'jquery';

const ModuleProfile = {
    state: {
        updatePasswordFormStatus: false,
        updateUserInfoFormStatus: false,
    },
    getters: {
    },
    mutations: {
        updateUpdatePasswordFormShow(state, status) {
            state.updatePasswordFormStatus = status;
        },
        updateUpdateUserInfoFormShow(state, status) {
            state.updateUserInfoFormStatus = status;
        },
    },
    actions: {
        updateUpdatePasswordFormShow(context, data) {
            context.commit("updateUpdatePasswordFormShow", data.Status);
        },
        updateUpdateUserInfoFormShow(context, data) {
            context.commit("updateUpdateUserInfoFormShow", data.Status);
        },
        updatePassword(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/user/password",
                type: "put",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
                data: JSON.stringify(data.param),
                contentType: "application/json",
                success(resp) {
                    if (resp.IsSuccess) {
                        context.commit("updateUpdatePasswordFormShow", false);
                        alert("修改成功");
                        data.success();
                    } else {
                        alert(resp.Message);
                    }
                }
            });
        },
        updateUserInfo(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/user/base/info",
                type: "put",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
                data: JSON.stringify(data.param),
                contentType: "application/json",
                success(resp) {
                    if (resp.IsSuccess) {
                        context.commit("updateUpdateUserInfoFormShow", false);
                        alert("修改成功");
                        data.success();
                    } else {
                        alert(resp.Message);
                    }
                }
            });
        },
        updateAvatar(context, data) {
            const formData = new FormData();
            formData.append('formFile', data);
            $.ajax({
                url: context.rootState.urlPre + "/api/user/avatar?userId=" + context.rootState.user.userId,
                type: "put",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
                data: formData,
                processData: false,
                contentType: false,
                success(resp) {
                    if (resp.IsSuccess) {
                        alert("修改成功");
                        context.rootState.user.avatarUrl = resp.Result;
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

export default ModuleProfile;

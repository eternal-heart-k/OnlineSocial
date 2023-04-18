import $ from 'jquery';
import { ElMessage } from 'element-plus';

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
            if (!context.rootState.user.isLogin) {
                ElMessage.error("暂未登录，请先登录");
                return;
            }
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
                        data.success();
                    } else {
                        data.error(resp.Message);
                    }
                }
            });
        },
        updateUserInfo(context, data) {
            if (!context.rootState.user.isLogin) {
                ElMessage.error("暂未登录，请先登录");
                return;
            }
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
                        ElMessage({
                            type: 'success',
                            message: "修改成功",
                        });
                        data.success();
                    } else {
                        ElMessage.error(resp.Message);
                    }
                }
            });
        },
        updateAvatar(context, data) {
            if (!context.rootState.user.isLogin) {
                ElMessage.error("暂未登录，请先登录");
                return;
            }
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
                        ElMessage({
                            type: 'success',
                            message: "修改成功",
                        });
                        context.rootState.user.avatarUrl = resp.Result;
                    } else {
                        ElMessage.error(resp.Message);
                    }
                }
            });
        },
    },
    modules: {
    }
};

export default ModuleProfile;

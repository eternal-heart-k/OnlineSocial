import $ from 'jquery';
import jwt_decode from 'jwt-decode';
import { ElMessage } from 'element-plus';

const ModuleUser = {
    state: {
        userId: "",
        userName: "",
        avatarUrl: "",
        personalSignature: "",
        gender: "",
        birthday: "",
        accessToken: "",
        refreshToken: "",
        isLogin: false,
        isAdmin: false,

        fansListVisible: false,
        fansList: [],
        fansListPageIndex: 1,

        loginPageVisible: false,
    },
    getters: {
    },
    mutations: {
        updateUserId(state) {
            let userId = jwt_decode(localStorage.getItem("access_token")).id;
            state.userId = userId;
        },
        updateUser(state, user) {
            state.userId = user.UserId;
            state.userName = user.UserName;
            state.avatarUrl = user.AvatarUrl;
            state.personalSignature = user.PersonalSignature;
            state.gender = user.Gender == 1 ? "男" : "女";
            state.birthday = user.Birthday;
            state.isLogin = user.IsLogin;
            state.isAdmin = user.Type === 0;
        },
        updateToken(state, token) {
            state.accessToken = token.AccessToken;
            state.refreshToken = token.RefreshToken;
            localStorage.setItem("access_token", token.AccessToken);
            localStorage.setItem("refresh_token", token.RefreshToken);
        },
        refreshFansList(state, data) {
            state.fansList = data;
            state.fansListPageIndex = 2;
        },
        addFansList(state, data) {
            state.fansList = state.fansList.concat(data);
            state.fansListPageIndex ++ ;
        },
        updateFansListVisible(state, status) {
            state.fansListVisible = status;
        },
        updateFansUserFollowStatusByIndex(state, data) {
            state.fansList[data.Index].IsFollowed = data.Status;
        },
        updateFansUserFollowStatusByUserId(state, data) {
            for (let item of state.fansList) {
                if (item.UserId == data.UserId) {
                    item.IsFollowed = data.Status;
                    break;
                }
            }
        },
        updateLoginPageVisible(state, status) {
            state.loginPageVisible = status;
        },
    },
    actions: {
        getUserInfoByUserId(context, data) {
            let claims = jwt_decode(context.rootState.user.accessToken);
            $.ajax({
                url: context.rootState.urlPre + "/api/user/userid?userId=" + claims.id,
                type: "get",
                headers: {
                    'Authorization': "Bearer " + context.rootState.user.accessToken,
                },
                async: data.async == null ? true : false,
                success(resp) {
                    if (resp.IsSuccess) {
                        context.commit("updateUser", {
                            ...resp.Result,
                            UserId: claims.id,
                            IsLogin: true,
                        });
                        data.success();
                    } else {
                        data.error(resp.Message);
                    }
                },
                error(resp) {
                    if (resp.status == '401') {
                        ElMessage.error(context.rootState.unAuthorize);
                    }
                }
            });
        },
        refreshAccessToken(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/jwt/refresh",
                type: "post",
                data: JSON.stringify({
                    AccessToken: data.AccessToken, 
                    RefreshToken: data.RefreshToken
                }),
                async: data.First ? false : true,
                contentType: "application/json",
                success(resp) {
                    if (resp.IsSuccess) {
                        context.commit("updateToken", resp.Result);
                    } else {
                        ElMessage.error(resp.Message);
                    }
                }
            });
        },
        refreshAccessTokenInterval(context, data) {
            if (data.First) {
                context.dispatch("refreshAccessToken", data);
            }
            setInterval(() => context.dispatch("refreshAccessToken", {
                AccessToken: context.state.accessToken,
                RefreshToken: context.state.refreshToken
            }), 4.5 * 60 * 1000);
        },
        loginWithPassword(context, data) {
            $.ajax ({
                url: context.rootState.urlPre + "/api/user/login/phonenumber",
                type: "post",
                data: JSON.stringify(data.param),
                contentType: "application/json",
                success(resp) {
                    if (resp.IsSuccess) {
                        localStorage.setItem("access_token", resp.Result.AccessToken);
                        localStorage.setItem("refresh_token", resp.Result.RefreshToken);
                        context.commit("updateToken", resp.Result);
                        
                        // 获取用户信息
                        context.dispatch("getUserInfoByUserId", data);
                        // 刷新accessToken
                        context.dispatch("refreshAccessTokenInterval", {First: false});
                    } else {
                        data.error(resp.Message);
                    }
                },
                error() {
                    data.error("");
                }
            });
        },
        getLoginWithQQUrl(context, data) {
            $.ajax ({
                url: context.rootState.urlPre + "/api/qq/auth",
                type: "get",
                contentType: "application/json",
                success(resp) {
                    if (resp.IsSuccess) {
                        window.location.href = resp.Result;
                    } else {
                        data.error(resp.Message);
                    }
                }
            });
        },
        loginWithQQ(context, data) {
            // 存储token
            context.commit("updateToken", data);
            // 获取用户信息
            context.dispatch("getUserInfoByUserId", {
                success() {
                    data.success();
                    // 刷新accessToken
                    context.dispatch("refreshAccessTokenInterval", {First: false});
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        },
        getFansList(context, data) {
            if (!context.rootState.user.isLogin) {
                ElMessage.error("暂未登录，请先登录");
                return;
            }
            $.ajax({
                url: context.rootState.urlPre + "/api/user/fans/page",
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
        sendVerificationCode(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/verificationcode/send",
                type: "post",
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
        loginWithVerificationCode(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/user/login/verificationcode",
                type: "post",
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
        registerWithVerificationCode(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/user/register/phonenumber",
                type: "post",
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
        forgetPasswordWithVerificationCode(context, data) {
            $.ajax({
                url: context.rootState.urlPre + "/api/user/password/forget",
                type: "put",
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

export default ModuleUser;

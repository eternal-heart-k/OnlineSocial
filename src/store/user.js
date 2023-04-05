import $ from 'jquery';
import jwt_decode from 'jwt-decode';

const ModuleUser = {
    state: {
        userId: "",
        userName: "",
        avatarUrl: "",
        accessToken: "",
        refreshToken: "",
        isLogin: false,
    },
    getters: {
    },
    mutations: {
        updateUser(state, user) {
            state.userId = user.UserId;
            state.userName = user.UserName;
            state.avatarUrl = user.AvatarUrl;
            state.isLogin = user.IsLogin;
        },
        updateToken(state, token) {
            state.accessToken = token.AccessToken;
            state.refreshToken = token.RefreshToken;
            localStorage.setItem("access_token", token.AccessToken);
            localStorage.setItem("refresh_token", token.RefreshToken);
        },
        logOut(state) {
            state.userId = "";
            state.userName = "";
            state.avatarUrl = "";
            state.accessToken = "";
            state.refreshToken = "";
            state.isLogin = false;
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }
    },
    actions: {
        getUserInfoByUserId(context, data) {
            let claims = jwt_decode(data.AccessToken);
            $.ajax({
                url: context.rootState.urlPre + "/api/user/userid?userId=" + claims.id,
                type: "get",
                headers: {
                    'Authorization': "Bearer " + data.AccessToken,
                },
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
                        alert(context.rootState.unAuthorize);
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
                        alert(resp.Message);
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
                url: context.rootState.urlPre + "/api/user/login",
                type: "post",
                data: JSON.stringify(data.param),
                contentType: "application/json",
                success(resp) {
                    if (resp.IsSuccess) {
                        localStorage.setItem("access_token", resp.Result.AccessToken);
                        localStorage.setItem("refresh_token", resp.Result.RefreshToken);
                        context.commit("updateToken", resp.Result);
                        
                        // 获取用户信息
                        context.dispatch("getUserInfoByUserId", {
                            ...data,
                            AccessToken: context.state.accessToken
                        });
                        // 刷新accessToken
                        context.dispatch("refreshAccessTokenInterval", {First: false});
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

export default ModuleUser;

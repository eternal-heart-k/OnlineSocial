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
        },
        updateAccessToken(state, accessToken) {
            state.accessToken = accessToken;
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
            let claims = jwt_decode(context.state.accessToken);
            $.ajax({
                url: data.urlPre + "/api/user/userid?userId=" + claims.id,
                type: "get",
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
                }
            });
        },
        refreshAccessToken(context, data) {
            context.commit("updateToken", {
                AccessToken: localStorage.getItem("access_token"),
                RefreshToken: localStorage.getItem("refresh_token"),
            });
            setInterval(() => {
                $.ajax({
                    url: data.urlPre + "/api/jwt/refresh",
                    type: "post",
                    data: JSON.stringify({
                        AccessToken: context.state.AccessToken, 
                        RefreshToken: context.state.RefreshToken
                    }),
                    contentType: "application/json",
                    success(resp) {
                        if (resp.IsSuccess) {
                            localStorage.setItem("access_token", resp.Result.AccessToken);
                            context.commit("updateAccessToken", resp.Result.AccessToken);
                        } else {
                            alert(resp.Message);
                        }
                    }
                });
            }, 4.5* 60 * 1000);
        },
        loginWithPassword(context, data) {
            $.ajax ({
                url: data.urlPre + "/api/user/login",
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
                        context.dispatch("refreshAccessToken", data.urlPre);
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

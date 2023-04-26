<template>
    <div>
        <div class="my-info-main">
            <el-row>
                <el-col :span="8" class="my-info-main-left my-image">
                    <el-upload 
                        :disabled="!isLogin"
                        :show-file-list="false"
                        :http-request="updateAvatar"
                    >
                        <el-avatar class="my-avatar" shape="square" :size="100" :fit="fit" :src="avatarUrl"/>
                    </el-upload>
                </el-col>
                <el-col :span="16" class="user-info-main-right">
                    <el-row class="username">{{ userName }}</el-row>
                    <el-row class="follow-info">
                        <a class="follow-count btn hover-orign" @click="followUserInfoShow">
                            关注&nbsp; {{ followCount }}
                        </a>
                        <a class="followed-count btn hover-orign" @click="followedUserInfoShow">
                            粉丝&nbsp; {{ followedCount }}
                        </a>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <div class="my-info-other">
            <el-row class="gender">性别：{{ gender }}</el-row>
            <el-row class="birthday">生日：{{ birthday }}</el-row>
            <el-row class="signature">
                <p :span="18" v-html="personalSignature"></p>
            </el-row>
        </div>
        <div class="my-info-btn">
            <el-row>
                <el-button class="modify-btn" type="success" @click="updateUserInfoFormShow">修改个人信息</el-button>
            </el-row>
            <el-row>
                <el-button class="modify-btn" type="success" @click="updatePasswordFormShow">修改密码</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';

export default {
    name: "MyProfile",
    setup() {
        const store = useStore();
        const fit = "cover";
        let isLogin = computed({
            get() {
                return store.state.user.isLogin;
            },
            set() {}
        });
        let avatarUrl = computed({
            get() {
                return store.state.user.avatarUrl;
            },
            set() {}
        });
        let userName = computed({
            get() {
                return store.state.user.userName;
            },
            set() {}
        });
        let followCount = computed({
            get() {
                return store.state.follow.followCount;
            },
            set() {}
        });
        let followedCount = computed({
            get() {
                return store.state.follow.followedCount;
            },
            set() {}
        });
        let personalSignature = computed({
            get() {
                if (store.state.user.personalSignature == null || store.state.user.personalSignature == "") {
                    return "个性签名：" + "暂无个性签名";
                }
                return "个性签名：" + store.state.user.personalSignature.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
            },
            set() {}
        });
        let gender = computed({
            get() {
                return store.state.user.gender;
            },
            set() {}
        });
        let birthday = computed({
            get() {
                return store.state.user.birthday.split("T")[0];
            },
            set() {}
        });
        const followUserInfoShow = () => {
            store.dispatch("getFollowGroupList", {
                success(result) {
                    store.commit("refreshFollowGroupList", result);
                    store.commit("updateFollowGroupVisible", true);
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        };
        const followedUserInfoShow = () => {
            store.dispatch("getFansList", {
                param: {
                    PageIndex: 1,
                    MyUserId: store.state.user.userId
                },
                success(result) {
                    store.commit("refreshFansList", result.Items);
                    store.commit("updateFansListVisible", true);
                },
                error(message) {
                    ElMessage.error(message);
                }
            });
        };
        const updateUserInfoFormShow = () => {
            if (!isLogin.value) {
                ElMessage.error("暂未登录，请先登录");
                return;
            }
            store.dispatch("updateUpdateUserInfoFormShow", {
                Status: true
            });            
        };
        const updatePasswordFormShow = () => {
            if (!isLogin.value) {
                ElMessage.error("暂未登录，请先登录");
                return;
            }
            store.dispatch("updateUpdatePasswordFormShow", {
                Status: true
            });
        };
        const updateAvatar = (ops) => {
            store.dispatch("beforeAction", {
                func() {
                    store.dispatch("updateAvatar", ops.file);
                }
            });
        };
        return {
            fit,
            avatarUrl,
            userName,
            followCount,
            followedCount,
            personalSignature,
            gender,
            birthday,
            isLogin,
            followUserInfoShow,
            followedUserInfoShow,
            updateUserInfoFormShow,
            updatePasswordFormShow,
            updateAvatar,
        }
    }
}
</script>

<style>
.hover-orign:hover{
    color: #eb7350;
}
</style>

<style scoped>
.my-avatar {
    cursor: pointer;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 1px rgba(0,0,0,0.3);
}
.username {
    margin: 15px 10px 10px;
    color: #333333;
    font-size: 20px;
}
.follow-info {
    margin: 20px 10px 10px;
    font-size: 17px;
    color: gray;
}
.follow-count {
    margin-right: 20px;
}
.my-info-other {
    margin-top: 20px;
}
.my-info-other .el-row {
    margin: 10px;
}
.my-info-btn {
    margin-top: 20px;
}
.modify-btn {
    background-color: #EFF9F2;
    margin-top: 10px;
    color: #2DB55D;
    width: 100%;
}
</style>
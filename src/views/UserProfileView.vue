<template>
    <div class="user-profile-module">
        <el-row>
            <el-col :span="2"></el-col>
            <el-col :span="6">
                <el-card shadow="always" class="user-profile-left"> 
                    <MyProfile />
                </el-card>
            </el-col>
            <el-col :span="10" class="user-profile-right">
                <MyPostInfos />
            </el-col>
            <el-col :span="6"></el-col>
        </el-row>
    </div>
    <UpdateUserInfoForm />
    <UpdatePasswordForm />
</template>

<script>
import MyProfile from '@/components/MyProfile.vue';
import MyPostInfos from '@/components/MyPostInfos.vue';
import UpdatePasswordForm from '@/components/UpdatePasswordForm.vue';
import UpdateUserInfoForm from '@/components/UpdateUserInfoForm.vue';
import { useStore } from 'vuex';

export default {
    name: "UserProfileView",
    components: {
        MyProfile,
        MyPostInfos,
        UpdatePasswordForm,
        UpdateUserInfoForm,
    },
    beforeCreate() {
        const store = useStore();
        if (!store.state.user.isLogin) return;
        store.dispatch("getUserInfoByUserId", {
            success() {
                store.dispatch("getFollowCount", {
                    success(result) {
                        store.commit("updateFollowCount", result);
                        store.dispatch("getFollowedCount", {
                            success(result) {
                                store.commit("updateFollowedCount", result);
                            },
                            error(message) {
                                alert(message);
                            }
                        });
                    },
                    error(message) {
                        alert(message);
                    }
                });
            },
            error(message) {
                alert(message);
            }
        });
    },
}
</script>

<style scoped>
.user-profile-module {
    margin-top: 7px;
    width: 100%;
}
.user-profile-left {
    position: fixed;
    width: 25%;
    top: 80px;
}
.user-profile-right {
    position: relative;
    margin-top: 35px;
}
</style>
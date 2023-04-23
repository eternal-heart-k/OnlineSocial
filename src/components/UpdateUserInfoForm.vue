<template>
    <el-dialog 
    :center="true" 
    title="修改个人信息" 
    v-model="dialogVisible" 
    width="30%" 
    :before-close="cancel"
    @open="beforeOpen">
        <el-form label-width="20%" @submit.prevent>
            <el-form-item label="昵称">
                <el-input v-model="userName" type="text" @keyup.enter.prevent></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="gender">
                    <el-radio :label="1" size="large" border>男</el-radio>
                    <el-radio :label="0" size="large" border>女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="生日">
                <el-input v-model="birthday" type="date"></el-input>
            </el-form-item>
            <el-form-item label="个性签名">
                <el-input v-model="personalSignature" type="textarea" :maxlength="100" show-word-limit :autosize="{minRows:4}" resize="none"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submitForm">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        let dialogVisible = computed({
            get() {
                return store.state.profile.updateUserInfoFormStatus;
            },
            set() {
            }
        });
        let userName = ref(store.state.user.userName);
        let gender = ref(store.state.user.gender == "男" ? 1 : 0);
        let birthday = ref(store.state.user.birthday.split("T")[0]);
        let personalSignature = ref(store.state.user.personalSignature);
        let userId = store.state.user.userId;
        const restoreInputValue = () => {
            userName.value = store.state.user.userName;
            gender.value = store.state.user.gender == "男" ? 1 : 0;
            birthday.value = store.state.user.birthday.split("T")[0];
            personalSignature.value = store.state.user.personalSignature;
        };
        const cancel = () => {
            store.dispatch("updateUpdateUserInfoFormShow", {
                Status: false
            });
            setTimeout(restoreInputValue, 200);
        };
        const submitForm = () => {
            let param = {
                UserId: userId,
                UserName: userName.value,
                Gender: gender.value,
                Birthday: birthday.value,
                PersonalSignature: personalSignature.value,
            };
            store.dispatch("updateUserInfo", {
                param: param,
                success() {
                    store.commit("updateUser", {
                        ...param,
                        AvatarUrl: store.state.user.avatarUrl,
                        IsLogin: true,
                    });
                }
            });
        };
        const beforeOpen = () => {
            userName.value = store.state.user.userName;
            gender.value = store.state.user.gender == "男" ? 1 : 0;
            birthday.value = store.state.user.birthday.split("T")[0];
            personalSignature.value = store.state.user.personalSignature;
            userId = store.state.user.userId;
        };
        return {
            dialogVisible,
            userName,
            gender,
            birthday,
            personalSignature,
            cancel,
            submitForm,
            beforeOpen,
        }
    },
};
</script>
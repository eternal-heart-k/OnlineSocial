<template>
  <el-dialog :center="true" title="修改密码" v-model="dialogVisible" width="30%" :before-close="cancel">
    <el-form label-width="20%">
      <el-form-item label="原密码">
        <el-input v-model="oldPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="newPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码">
        <el-input v-model="newPasswordConfirm" type="password"></el-input>
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
import md5 from 'js-md5';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const store = useStore();
    let dialogVisible = computed({
      get() {
        return store.state.profile.updatePasswordFormStatus;
      },
      set() {
        
      }
    });
    let oldPassword = ref('');
    let newPassword = ref('');
    let newPasswordConfirm = ref('');
    const userId = store.state.user.userId;
    const clearInputValue = () => {
        oldPassword.value = "";
        newPassword.value = "";
        newPasswordConfirm.value = "";
    };
    const cancel = () => {
        store.dispatch("updateUpdatePasswordFormShow", {
            Status: false
        });
        clearInputValue();
    };
    const submitForm = () => {
        let param = {
            UserId: userId,
            LastPassword: oldPassword.value == "" ? "" : md5(oldPassword.value),
            NewPassword: newPassword.value == "" ? "" : md5(newPassword.value),
            NewPasswordAgain: newPasswordConfirm.value == "" ? "" : md5(newPasswordConfirm.value),
        };
        store.dispatch("updatePassword", {
            param: param,
            success() {
              clearInputValue();
              ElMessage({
                type: 'success',
                message: "修改成功",
              });
            },
            error(message) {
              ElMessage.error(message);
            }
        });
    }
    return {
        dialogVisible,
        oldPassword,
        newPassword,
        newPasswordConfirm,
        cancel,
        submitForm,
    }
  },
};
</script>
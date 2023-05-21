<template>
    <form class="forget_password_form" @submit.prevent>
        <div class="forget_password_body">
            <div class="inputBox forget_password_phone_number">
                <input v-model="forget_password_phone_number_value" type="text" required="required">
                <span>手机号</span>
            </div>
            <div class="inputBox forget_password_new_password">
                <input v-model="forget_password_new_password_value" type="password" required="required">
                <span>新密码</span>
            </div>
            <div class="forget_password_verification_code_module">
                <div class="inputBox forget_password_verification_code">
                    <input v-model="forget_password_verification_code_value" type="text" required="required">
                    <span>验证码</span>
                </div>
                <div class="inputBox forget_password_get_verification_code">
                    <input type="button" v-model="get_verification_code_text" class="btn forget_password_get_verification_code_btn" @click="getVerificationCode">
                </div>
            </div>
            <div class="errormsg forget_password_errormsg">{{forget_password_error_message_text}}</div>
        </div>
        <div class="forget_password_footer">
            <button class="btn forget_password_confirm_btn" @click="forgetPasswordConfirm">确认</button>
            <a class="btn btn_link return_login_btn" @click="returnLogin">登录</a>
        </div>
    </form>
</template>

<script>
import $ from 'jquery';
import { ref } from 'vue';
import { getCurrentInstance } from 'vue';
import md5 from 'js-md5';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';

export default {
    name: "ForgetPasswordForm",
    data() {
        return {
            get_verification_code_text: "获取验证码",
        }
    },
    setup() {
        const store = useStore();
        let forget_password_error_message_text = ref("");
        let forget_password_phone_number_value = ref('');
        let forget_password_new_password_value = ref('');
        let forget_password_verification_code_value = ref('');
        const datab = getCurrentInstance();
        const sendVerificationCodeForgetPassword = () => {
            ElMessage.success("已发送验证码");
            let tm = 60;
            $('.forget_password_get_verification_code_btn').attr("disabled", true);
            $('.forget_password_get_verification_code_btn').css("color", "grey");
            datab.data.get_verification_code_text = "60s后重试";
            let countDown = setInterval(() => {
                if (tm <= 0) {
                    datab.data.get_verification_code_text = "获取验证码";
                    $('.forget_password_get_verification_code_btn').css("color", "white");
                    $('.forget_password_get_verification_code_btn').attr("disabled", false);
                    clearInterval(countDown);
                } else {
                    tm -- ;
                    datab.data.get_verification_code_text = tm + "s后重试";
                }
            }, 1000);
        };
        const getVerificationCode = () => {
            forget_password_error_message_text.value = "";
            if (forget_password_phone_number_value.value == null || forget_password_phone_number_value.value == "") {
                forget_password_error_message_text.value = "手机号不能为空";
                return ;
            }
            sendVerificationCodeForgetPassword();
            store.dispatch("sendVerificationCode", {
                param: {
                    KeyWord: forget_password_phone_number_value.value,
                    CommunicationType: 1,
                    BusinessType: 4
                },
                success() {
                },
                error(message) {
                    forget_password_error_message_text.value = message;
                }
            });
        };
        const returnLogin = () => {
            forget_password_error_message_text.value = "";
            forget_password_phone_number_value.value = "";
            forget_password_new_password_value.value = "";
            forget_password_verification_code_value.value = "";
            $('.forget_password_form').hide();
            $('.login_form').show();
        };
        const forgetPasswordConfirm = () => {
            store.dispatch("forgetPasswordWithVerificationCode", {
                param: {
                    PhoneNumber: forget_password_phone_number_value.value,
                    NewPassword: forget_password_new_password_value.value == "" ? "" : md5(forget_password_new_password_value.value),
                    VerificationCode: forget_password_verification_code_value.value
                },
                success() {
                    ElMessage.success("修改密码成功");
                    returnLogin();
                },
                error(message) {
                    forget_password_error_message_text.value = message;
                }
            });
        };
        return {
            getVerificationCode,
            forgetPasswordConfirm,
            returnLogin,
            forget_password_error_message_text,
            forget_password_phone_number_value,
            forget_password_new_password_value,
            forget_password_verification_code_value,
        }
    }
}

</script>

<style scoped>
.forget_password_form
{
    padding: 10px;
}
.forget_password_body
{
    padding: 0px 10px 10px 10px;
}
.forget_password_phone_number
{
    margin-top: 10px;
}
.forget_password_new_password
{
    margin-top: 20px;   
}
.forget_password_verification_code_module
{
    position: relative;
    width: 100%;
    margin-top: 20px;
    display: inline-block;
}
.forget_password_verification_code
{
    width: 50%;
    float: left;
}
.forget_password_verification_code input:valid ~ span, 
.forget_password_verification_code input:focus ~ span 
{
    border-radius: 2px;
    background: #00dfc4;
    color: #1d2b3a;
}
.forget_password_get_verification_code
{
    width: 40%;
    float: right;
}
.forget_password_footer
{
    padding: 0px 10px 10px 10px;
}
.forget_password_confirm_btn
{
    width: 100%;
    height: 35px;
    border-radius: 5px;
    background-color: #66afe9;
}
.return_login_btn
{
    float: right;
}
</style>
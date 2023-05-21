<template>
    <form class="register_form" @submit.prevent>
        <div class="register_body">
            <div class="inputBox register_phone_number">
                <input v-model="register_phone_number_value" type="text" required="required">
                <span>手机号</span>
            </div>
            <div class="inputBox register_password">
                <input v-model="register_password_value" type="password" required="required">
                <span>密码</span>
            </div>
            <div class="inputBox register_password_confirm">
                <input v-model="register_password_confirm_value" type="password" required="required">
                <span>确认密码</span>
            </div>
            <div class="register_verification_code_module">
                <div class="inputBox register_verification_code">
                    <input v-model="register_verification_code_value" type="text" required="required">
                    <span>验证码</span>
                </div>
                <div class="inputBox register_get_verification_code">
                    <input type="button" v-model="get_verification_code_text" class="btn register_get_verification_code_btn" @click="getVerificationCode">
                </div>
            </div>
            <div class="errormsg register_errormsg">{{ register_error_message_text }}</div>
        </div>
        <div class="register_footer">
            <button class="btn register_confirm_btn" @click="registerConfirm">注册</button>
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
    name: "RegisterForm",
    data() {
        return {
            get_verification_code_text: "获取验证码",
        }
    },
    setup() {
        const store = useStore();
        let register_error_message_text = ref("");
        let register_phone_number_value = ref('');
        let register_password_value = ref('');
        let register_password_confirm_value = ref('');
        let register_verification_code_value = ref('');
        const datab = getCurrentInstance();
        const sendVerificationCodeRegister = () => {
            ElMessage.success("已发送验证码");
            let tm = 60;
            $('.register_get_verification_code_btn').attr("disabled", true);
            $('.register_get_verification_code_btn').css("color", "grey");
            datab.data.get_verification_code_text = "60s后重试";
            let countDown = setInterval(() => {
                if (tm <= 0) {
                    datab.data.get_verification_code_text = "获取验证码";
                    $('.register_get_verification_code_btn').css("color", "white");
                    $('.register_get_verification_code_btn').attr("disabled", false);
                    clearInterval(countDown);
                } else {
                    tm -- ;
                    datab.data.get_verification_code_text = tm + "s后重试";
                }
            }, 1000);
        };
        const getVerificationCode = () => {
            register_error_message_text.value = "";
            if (register_phone_number_value.value == null || register_phone_number_value.value == "") {
                register_error_message_text.value = "手机号不能为空";
                return ;
            }
            sendVerificationCodeRegister();
            store.dispatch("sendVerificationCode", {
                param: {
                    KeyWord: register_phone_number_value.value,
                    CommunicationType: 1,
                    BusinessType: 2
                },
                success() {
                },
                error(message) {
                    register_error_message_text.value = message;
                }
            });
        };
        const returnLogin = () => {
            register_error_message_text.value = "";
            register_phone_number_value.value = "";
            register_password_value.value = "";
            register_password_confirm_value.value = "";
            register_verification_code_value.value = "";
            $('.register_form').hide();
            $('.login_form').show();
        };
        const registerConfirm = () => {
            register_error_message_text.value = "";
            store.dispatch("registerWithVerificationCode", {
                param: {
                    PhoneNumber: register_phone_number_value.value,
                    Password: register_password_value.value == "" ? "" : md5(register_password_value.value),
                    PasswordConfirm: register_password_confirm_value.value == "" ? "" : md5(register_password_confirm_value.value),
                    VerificationCode: register_verification_code_value.value
                },
                success() {
                    ElMessage.success("注册成功");
                    returnLogin();
                },
                error(message) {
                    register_error_message_text.value = message;
                }
            });
        };
        return {
            getVerificationCode,
            registerConfirm,
            returnLogin,
            register_error_message_text,
            register_phone_number_value,
            register_password_value,
            register_password_confirm_value,
            register_verification_code_value,
        }
    }
}
</script>

<style scoped>
.register_form
{
    padding: 0px 10px 10px 10px;
}
.register_body
{
    padding: 0px 10px 10px 10px;
}
.register_phone_number
{
    margin-top: 10;
}
.register_password
{
    margin-top: 20px;
}
.register_password_confirm
{
    margin-top: 20px;
}
.register_verification_code_module
{
    width: 100%;
    margin-top: 20px;
    display: inline-block;
}
.register_verification_code input:valid ~ span, 
.register_verification_code input:focus ~ span 
{
    border-radius: 2px;
    background: #00dfc4;
    color: #1d2b3a;
}
.register_verification_code
{
    width: 50%;
    float: left;
}
.register_get_verification_code
{
    width: 40%;
    float: right;
}
.register_footer
{
    padding: 0px 10px 10px 10px;
}
.register_confirm_btn
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
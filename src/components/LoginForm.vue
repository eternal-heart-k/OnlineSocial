<template>
    <form class="login_form" @submit.prevent novalidate>
        <div class="login_select">
            <a href="javascript:void(0)" class="login_select_type account_type" @click="accountType">密码登录</a>
            <a href="javascript:void(0)" class="login_select_type verification_code_type" @click="verificationCodeType">验证码登录</a>
        </div>
        <div class="login_body">
            <div class="inputBox login_phone_number">
                <input v-model="login_phone_number" type="text" required="required">
                <span>手机号</span>
            </div>
            <div class="inputBox login_password">
                <input v-model="login_password" type="password" required="required">
                <span>密码</span>
            </div>
            <div class="login_verification_code_module">
                <div class="inputBox login_verification_code">
                    <input v-model="login_verification_code" type="text" required="required">
                    <span>验证码</span>
                </div>
                <div class="inputBox login_get_verification_code">
                    <input type="button" :value="get_verification_code_text" class="btn login_get_verification_code_btn" @click="getVerificationCode">
                </div>
            </div>
            <div class="errormsg login_errormsg">{{ error_message }}</div>
        </div>
        <div class="login_footer">
            <button class="btn login_confirm_btn" @click="login">{{ login_text }}</button>
            <div class="forgetpassword_register">
                <div class="btn btn_link forget_password">
                    <a class="forget_password_btn" @click="forgetPassword">忘记密码</a>
                </div>
                <div class="btn btn_link register">
                    <a class="register_btn" @click="register">注册</a>
                </div>
            </div>
            <div class="login_quickly">
                <div>
                    <img class="btn login_qq_image" src="../assets/qq.jpg" alt="QQ图标" @click="loginWithQQ">
                </div>
                <div class="login_quickly_title">
                    <a class="btn_link">&nbsp;&nbsp;快速登录</a>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import $ from 'jquery';
import { ref } from 'vue';
import { useStore } from 'vuex';
import router from '@/router/index';

export default {
    name: "LoginForm",
    methods: { 
        changeAccountType() {
            $('.login_password>input')[0].setAttribute("required", "required");
            $('.login_verification_code>input').removeAttr("required");
            $('.login_verification_code_module').hide();
            $('.login_password').show();
            $('.verification_code_type').css("border-bottom", "none");
            $('.account_type').css("border-bottom", "3px solid #66afe9");
        },
    },
    mounted() {
        this.changeAccountType();
    },
    setup() {
        const store = useStore();
        let login_user_type = ref(1);
        let login_phone_number = ref('');
        let login_password = ref('');
        let login_verification_code = ref('');
        let get_verification_code_text = ref('获取验证码');
        let login_text = ref('登录');
        let error_message = ref('');
        const accountType = () => {
            login_user_type.value = 1;
            $('.login_password>input')[0].setAttribute("required", "required");
            $('.login_verification_code>input').removeAttr("required");
            $('.login_verification_code_module').hide();
            $('.login_password').show();
            $('.verification_code_type').css("border-bottom", "none");
            $('.account_type').css("border-bottom", "3px solid #66afe9");
            login_phone_number.value = "";
            login_password.value = "";
            login_verification_code.value = "";
        };
        const verificationCodeType = () => {
            login_user_type.value = 3;
            $('.login_verification_code>input')[0].setAttribute("required", "required");
            $('.login_password>input').removeAttr("required");
            $('.login_password').hide();
            $('.login_verification_code_module').show();
            $('.account_type').css("border-bottom", "none");
            $('.verification_code_type').css("border-bottom", "3px solid #66afe9");
            login_phone_number.value = "";
            login_password.value = "";
            login_verification_code.value = "";
        };
        const getVerificationCode = () => {
            let tm = 60;
            $('.login_get_verification_code_btn').attr("disabled", true);
            $('.login_get_verification_code_btn').css("color", "grey");
            get_verification_code_text.value = "60s后重试";
            let countDown = setInterval(() => {
                if (tm <= 0) {
                    get_verification_code_text.value = "获取验证码";
                    $('.login_get_verification_code_btn').attr("disabled", false);
                    $('.login_get_verification_code_btn').css("color", "white");
                    clearInterval(countDown);
                } else {
                    tm -- ;
                    get_verification_code_text.value = tm + "s后重试";
                }
            }, 1000);
        };
        const forgetPassword = () => {
            $('.login_form').hide();
            $('.forget_password_form').show();
            login_phone_number.value = "";
            login_password.value = "";
            login_verification_code.value = "";
        };
        const register = () => {
            $('.login_form').hide();
            $(".register_form").show();
            login_phone_number.value = "";
            login_password.value = "";
            login_verification_code.value = "";
        };
        const login = () => {
            error_message.value = "";
            login_text.value = "登录中...";
            if (login_user_type.value == 1) {
                loginWithPassword();
            } else if (login_user_type.value == 3) {
                loginWithVerificationCode();
            }
        };
        const loginWithPassword = () => {
            if (login_phone_number.value == "") {
                $(".login_phone_number input").focus();
            } else if (login_password.value == "") {
                $(".login_password input").focus();
            }
            store.dispatch("loginWithPassword", {
                param: {
                    PhoneNumber: login_phone_number.value,
                    Password: login_password.value,
                    Type: login_user_type.value
                },
                success() {
                    error_message.value = "";
                    login_text.value = "登录";
                    router.push({name: "home"});
                },
                error(message) {
                    error_message.value = message;
                    login_text.value = "登录";
                },
            });
        };
        const loginWithQQ = () => {
            error_message.value = "";
            login_user_type.value = 2;

            alert("正在加速开发中...");
            login_text.value = "登录";
            return;

            //alert("QQ快速登录");a
        };
        const loginWithVerificationCode = () => {
            alert("正在加速开发中...");
            login_text.value = "登录";
            return;

            // if (login_phone_number.value == "") {
            //     $(".login_phone_number input").focus();
            // } else if (login_verification_code.value == "") {
            //     $(".login_verification_code input").focus();
            // }
            // alert("验证码登录");
        };
        return {
            accountType,
            verificationCodeType,
            getVerificationCode,
            forgetPassword,
            register,
            login,
            loginWithPassword,
            loginWithQQ,
            loginWithVerificationCode,
            login_user_type,
            login_phone_number,
            login_password,
            login_verification_code,
            get_verification_code_text,
            error_message,
            login_text,
        }
    }
}
</script>

<style scoped>
.login_form
{
    padding: 10px;
}
.login_select
{
    padding: 0 10px 0 10px;
    display: flex;
    justify-content: space-around;
}
.login_select_type
{
    width: 50%;
    color: lightblue;
    text-align: center;
    text-decoration: none;
}
.account_type
{
    border-bottom: 3px solid #66afe9;
}
.login_body
{
    padding: 10px;
}
.login_footer
{
    padding: 0px 10px 10px 10px;
}
.login_confirm_btn
{
    width: 100%;
    height: 35px;
    border-radius: 5px;
    background-color: #66afe9;
}
.forgetpassword_register
{
    margin-top: 5px;
    display: inline-block;
    width: 100%;
}
.forget_password
{
    float: left;
}
.register
{
    float: right;
}
.login_qq_image
{
    width: 30px;
    height: 25px;
    vertical-align: middle;
}
.login_phone_number
{
    margin-top: 10px;
}
.login_password
{
    margin-top: 20px;
    margin-bottom: 4px;
}
.login_verification_code_module
{
    position: relative;
    width: 100%;
    margin-top: 20px;
    display: inline-block;
}
.login_verification_code
{
    width: 50%;
    float: left;
}
.login_password input:valid ~ span, 
.login_password input:focus ~ span 
{
    border-radius: 2px;
    background: #00dfc4;
    color: #1d2b3a;
}
.login_verification_code input:valid ~ span, 
.login_verification_code input:focus ~ span 
{
    border-radius: 2px;
    background: #00dfc4;
    color: #1d2b3a;
}
.login_get_verification_code
{
    width: 40%;
    float: right;
}
.login_get_verification_code_btn
{
    width: 100%;
}
.login_quickly
{
    text-align: center;
}
.login_quickly_title
{
    margin-top: 5px;
}
.login_quickly_title a
{
    font-size: 13px;
}
</style>

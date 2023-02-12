<template>
    <form class="login_form" @submit.prevent>
        <div class="login_select">
            <a href="javascript:void(0)" class="login_select_type account_type" @click="accountType">密码登录</a>
            <a href="javascript:void(0)" class="login_select_type verification_code_type" @click="verificationCodeType">验证码登录</a>
        </div>
        <div class="login_body">
            <div class="inputBox login_phone_number">
                <input v-model="login_phone_number_value" type="text" required="required">
                <span>手机号</span>
            </div>
            <div class="inputBox login_password">
                <input v-model="login_password_value" type="password" required="required">
                <span>密码</span>
            </div>
            <div class="login_verification_code_module">
                <div class="inputBox login_verification_code">
                    <input v-model="login_verification_code_value" type="text" required="required">
                    <span>验证码</span>
                </div>
                <div class="inputBox login_get_verification_code">
                    <input type="button" v-model="get_verification_code_text" class="btn login_get_verification_code_btn" @click="getVerificationCode">
                </div>
            </div>
            <div class="errormsg login_errormsg">账号或密码错误</div>
        </div>
        <div class="login_footer">
            <button class="btn login_confirm_btn" @click="login">登录</button>
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
                    <img class="btn login_qq_image" src="../assets/qq.jpg" alt="QQ图标" @click="qqLogin">
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
import router from '@/router/index';
import { getCurrentInstance } from 'vue';

export default {
    name: "LoginForm",
    data() {
        return {
            get_verification_code_text: "获取验证码",
        }
    },
    setup() {
        const datab = getCurrentInstance();
        let login_phone_number_value = ref('');
        let login_password_value = ref('');
        let login_verification_code_value = ref('');
        const accountType = () => {
            $('.login_password>input')[0].setAttribute("required", "required");
            $('.login_verification_code>input').removeAttr("required");
            $('.login_verification_code_module').hide();
            $('.login_password').show();
            $('.verification_code_type').css("border-bottom", "none");
            $('.account_type').css("border-bottom", "3px solid #66afe9");
            login_phone_number_value.value = "";
            login_password_value.value = "";
            login_verification_code_value.value = "";
        };
        const verificationCodeType = () => {
            $('.login_verification_code>input')[0].setAttribute("required", "required");
            $('.login_password>input').removeAttr("required");
            $('.login_password').hide();
            $('.login_verification_code_module').show();
            $('.account_type').css("border-bottom", "none");
            $('.verification_code_type').css("border-bottom", "3px solid #66afe9");
            login_phone_number_value.value = "";
            login_password_value.value = "";
            login_verification_code_value.value = "";
        };
        const login = () => {
            console.log(login_phone_number_value.value, login_password_value.value, login_verification_code_value.value);
            //router.push({name: 'home'});
        };
        const getVerificationCode = () => {
            let tm = 60;
            $('.login_get_verification_code_btn').attr("disabled", true);
            $('.login_get_verification_code_btn').css("color", "grey");
            datab.data.get_verification_code_text = "60s后重试";
            let countDown = setInterval(() => {
                if (tm <= 0) {
                    datab.data.get_verification_code_text = "获取验证码";
                    $('.login_get_verification_code_btn').attr("disabled", false);
                    $('.login_get_verification_code_btn').css("color", "white");
                    clearInterval(countDown);
                } else {
                    tm -- ;
                    datab.data.get_verification_code_text = tm + "s后重试";
                }
            }, 1000);
        };
        const forgetPassword = () => {
            $('.login_form').hide();
            $('.forget_password_form').show();
            login_phone_number_value.value = "";
            login_password_value.value = "";
            login_verification_code_value.value = "";
        };
        const register = () => {
            $('.login_form').hide();
            $(".register_form").show();
            login_phone_number_value.value = "";
            login_password_value.value = "";
            login_verification_code_value.value = "";
        };
        const qqLogin = () => {
            router.push({name: 'home'});
        };
        return {
            accountType,
            verificationCodeType,
            login,
            getVerificationCode,
            forgetPassword,
            register,
            qqLogin,
            login_phone_number_value,
            login_password_value,
            login_verification_code_value,
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

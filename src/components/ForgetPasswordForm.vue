<template>
    <form class="forget_password_form">
        <div class="forget_password_body">
            <div class="inputBox forget_password_phone_number">
                <input type="text" required="required">
                <span>手机号</span>
            </div>
            <div class="inputBox forget_password_new_password">
                <input type="password" required="required">
                <span>新密码</span>
            </div>
            <div class="forget_password_verification_code_module">
                <div class="inputBox forget_password_verification_code">
                    <input type="text" required="required">
                    <span>验证码</span>
                </div>
                <div class="inputBox forget_password_get_verification_code">
                    <input type="button" v-model="get_verification_code_text" class="btn forget_password_get_verification_code_btn" @click="getVerificationCode()">
                </div>
            </div>
            <div class="errormsg forget_password_errormsg">账号或密码错误</div>
        </div>
        <div class="forget_password_footer">
            <button class="btn forget_password_confirm_btn" @click="forgetPasswordConfirm()">确认</button>
            <a class="btn btn_link return_login_btn" @click="returnLogin()">登录</a>
        </div>
    </form>
</template>

<script>
import $ from 'jquery';
import { getCurrentInstance } from 'vue';

export default {
    name: "ForgetPasswordForm",
    data() {
        return {
            get_verification_code_text: "获取验证码",
        }
    },
    setup() {
        const datab = getCurrentInstance();
        const getVerificationCode = () => {
            let tm = 60;
            $('.forget_password_get_verification_code_btn').attr("disabled", true);
            datab.data.get_verification_code_text = "60s后重试";
            let countDown = setInterval(() => {
                if (tm <= 0) {
                    datab.data.get_verification_code_text = "获取验证码";
                    $('.forget_password_get_verification_code_btn').attr("disabled", false);
                    clearInterval(countDown);
                } else {
                    tm -- ;
                    datab.data.get_verification_code_text = tm + "s后重试";
                }
            }, 1000);
        };
        const forgetPasswordConfirm = () => {
            $('.forget_password_form').hide();
            $('.login_form').show();
        };
        const returnLogin = () => {
            $('.forget_password_form').hide();
            $('.login_form').show();
        }
        return {
            getVerificationCode,
            forgetPasswordConfirm,
            returnLogin,
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
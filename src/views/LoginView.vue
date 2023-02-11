<template>
    <div class="login_module">
        <div class="login_content">
            <div class="login_head">
                <button class="btn login_close">X</button>
                <span class="login_title">Online Social</span>
            </div>
            <LoginForm />
            <ForgetPasswordForm />
            <RegisterForm />
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import LoginForm from '@/components/LoginForm.vue'
import ForgetPasswordForm from '@/components/ForgetPasswordForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';

export default {
    name: "LoginView",
    components: {
        LoginForm,
        ForgetPasswordForm,
        RegisterForm,
    },
    setup() {
        const hideSth = () => {
            $('.login_verification_code_module').hide();
            $('.forget_password_form').hide();
            $('.register_form').hide();
        };
        return {
            hideSth,
        }
    },
    mounted() {
        this.hideSth();
    }
}
</script>

<style>
* 
{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}
.inputBox 
{
    position: relative;
    width: 100%;
}
.inputBox input 
{
    padding: 10px 10px;
    border: none;
    outline: none;
    border-radius: 5px;
    width: 100%;
    background: #1d2b3a;
    border: 1px solid rgba(255,255,255,0.25);
    color: #fff;
    font-size: 1em;
    transition: 0.5s;
}
.inputBox span 
{
    position: absolute;
    left: 0;
    padding: 10px 10px;
    pointer-events: none;
    font-size: 1em;
    transition: 0.5s;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
}
.inputBox input:valid ~ span, 
.inputBox input:focus ~ span 
{
    color: #00dfc4;
    font-size: 0.65em;
    transform: translateX(10px) translateY(-7px);
    padding: 0 5px;
    background: #1d2b3a;
    border-left: 1px solid #00dfc4;
    border-right: 1px solid #00dfc4;
    letter-spacing: 0.2em;
}
.inputBox input:valid, 
.inputBox input:focus 
{
    border: 1px solid #00dfc4;
}

.btn_link
{
    padding: 5px 10px 0 0;
    color: #95a5a6;
    background-color: transparent;
    border-color: transparent;
    user-select: none;
}
.btn
{
    cursor: pointer;
    transition: 0.3s all;
}
.btn:active {
    transform: scale(0.9);
}
.errormsg
{
    color: red;
    font-size: 12px;
    height: 12px;
}
</style>

<style scoped>
.login_module
{
    background: #1d2b3a;
    position: absolute;
    top: 50%;
    left: 20%;
    transform: translate(-50%,-50%);
    width: 25%;
    height: 50%;
    box-shadow: 0 15px 25px rgba(0,0,0,.5);
    border-radius: 10px;
    margin: 10px;
    /*z-index: 2;*/
}
.login_content
{
    width: 100%;
    height: 100%;
}
.login_head
{
    padding: 10px;
    text-align: center;
}
.login_close
{
    float: right;
}
.login_title
{
    display: inline-block;
    font-family: 'Satisfy', cursive;
    font-size: 30px;
    
    color:cornflowerblue;
}
</style>
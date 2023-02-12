<template>
  <h1>Home Page</h1>
  <button @click="login">登录</button>
  <LoginView />
</template>

<script>
import LoginView from '@/views/LoginView.vue';
import $ from 'jquery';

export default {
  name: 'HomeView',
  mounted() {
    $('.login_module').hide();
    console.log("hide");
  },
  setup() {
    const login = () => {
      $('.login_module').show();
    };
    return {
      login,
    }
  },
  components: {
    LoginView
  }
}
</script>

<style scoped>
</style>
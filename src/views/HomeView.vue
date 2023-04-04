<template>
  <LoginView ref="loginView" />
  <el-container>
    <el-header class="header">
      <HomeHeader ref="homeHeader" />
    </el-header>
    <el-main>
      <HomeMain />
    </el-main>
  </el-container>
</template>

<script>
import HomeHeader from '@/components/HomeHeader.vue';
import HomeMain from '@/components/HomeMain.vue';
import LoginView from './LoginView.vue';
import { useStore } from 'vuex';

export default {
  name: 'HomeView',
  mounted() {
    this.$refs.loginView.closeLoginModule();
    const store = useStore();
    let accessToken = localStorage.getItem("access_token");
    let refreshToken = localStorage.getItem("refresh_token");
    let urlPre = store.state.urlPre;
    if (refreshToken != undefined && refreshToken != "" && accessToken != undefined && accessToken != "") {
      store.dispatch("refreshAccessToken", urlPre);
      store.dispatch("getUserInfoByUserId", {
        urlPre,
        success() {
          console.log(store.state.user);
        },
        error(message) {
          alert(message);
        }
      });
    }
  },
  components: {
    HomeHeader,
    HomeMain,
    LoginView,
  }
}
</script>

<style scoped>
.header {
  box-shadow: 0px 4px 8px rgba(0,0,0,.1);
}
</style>
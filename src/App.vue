<template>
  <div class="web-module">
    <el-header class="header">
      <HomeHeaderView />
    </el-header>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
import HomeHeaderView from './views/HomeHeaderView.vue';
import { useStore } from 'vuex';
import router from '@/router/index';

export default {
  name: "App",
  components: {
    HomeHeaderView,
  },
  mounted() {
    const store = useStore();
    let accessToken = localStorage.getItem("access_token");
    let refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken != undefined && refreshToken != "" && accessToken != undefined && accessToken != "") {
      store.dispatch("refreshAccessToken", {
        First: true,
        AccessToken: accessToken,
        RefreshToken: refreshToken
      });
      store.dispatch("getUserInfoByUserId", {
        success() {
          router.push({name: "home"});
        },
        error(message) {
          alert(message);
        }
      });
    }
  }
}
</script>

<style scoped>
.web-module {
  background-color: #F7F8FA;
}
.header {
  box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
  background-color: #FFFFFF;
}
</style>
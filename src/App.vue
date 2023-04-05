<template>
  <el-header class="header">
    <HomeHeaderView />
  </el-header>
  <router-view :key="$route.fullPath" />
</template>

<script>
import HomeHeaderView from './views/HomeHeaderView.vue';
import { useStore } from 'vuex';

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
        AccessToken: store.state.user.accessToken,
        success() {
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
.header {
  box-shadow: 0px 4px 8px rgba(0,0,0,.1);
}
</style>
<template>
  <div class="web-module">
    <el-header class="header">
      <HomeHeaderView />
    </el-header>
    <router-view :key="$route.fullPath" />
  </div>
  <PostEdit />
</template>

<script>
import HomeHeaderView from './views/HomeHeaderView.vue';
import { useStore } from 'vuex';
import router from '@/router/index';
import PostEdit from './components/post/PostEdit.vue';

export default {
  name: "App",
  components: {
    HomeHeaderView,
    PostEdit,
  },
  mounted() {
    const store = useStore();

    let geturl = window.location.href;
    let indexL = geturl.indexOf("?access_token=");
    let indexR = geturl.indexOf("&refresh_token=");
    if (indexL != -1 && indexR != -1) {
      let getqyinfo = geturl.split('?')[1];
      let getqys = new URLSearchParams('?' + getqyinfo);
      let accessTokenOfUrl = getqys.get("access_token");
      let refreshTokenOfUrl = getqys.get("refresh_token");
      store.dispatch("loginWithQQ", {
        AccessToken: accessTokenOfUrl,
        RefreshToken: refreshTokenOfUrl,
        success() {
          router.push({name: "home", path: "/onlinesocial"});
        },
      });
      return;
    }

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
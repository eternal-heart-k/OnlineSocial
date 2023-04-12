<template>
  <div class="web-module">
    <div class="navbar">
      <el-header class="header">
        <HomeHeaderView />
      </el-header>
    </div>
    <div class="web-main">
      <router-view :key="$route.fullPath" />
    </div>
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
.navbar {
  display: flex;
  width: 100%;
}
.header {
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  width: 100%;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
  background-color: #FFFFFF;
}
.web-main {
  display: flex;
  margin-top: 80px;
}
</style>
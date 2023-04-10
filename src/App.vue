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
    if (geturl.indexOf("?") != -1) {
      let getqyinfo = geturl.split('?')[1];
      if (getqyinfo.indexOf("&") != 1) {
        let getqys = getqyinfo.split('&');
        if (getqys.length >= 2) {
          if (getqys[0].split('=')[0] == "access_token" && getqys[1].split('=')[0] == "refresh_token") {
            let accessTokenOfUrl =  getqys[0].split('=')[1];
            let refreshTokenOfUrl = getqys[1].split('=')[1];
            if (accessTokenOfUrl != undefined && accessTokenOfUrl != "" && refreshTokenOfUrl != undefined && refreshTokenOfUrl != "") {
              store.dispatch("loginWithQQ", {
                AccessToken: accessTokenOfUrl,
                RefreshToken: refreshTokenOfUrl,
                success() {
                  router.push({name: "home", path: "/onlinesocial"});
                },
              });
              return;
            }
          }
        } 
      }
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
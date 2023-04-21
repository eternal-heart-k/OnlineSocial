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
  <ImagePreview />
  <AddFollowShowGroup />
</template>

<script>
import HomeHeaderView from './views/HomeHeaderView.vue';
import { useStore } from 'vuex';
import router from '@/router/index';
import PostEdit from './components/post/PostEdit.vue';
import ImagePreview from './components/ImagePreview';
import AddFollowShowGroup from './components/follow/AddFollowShowGroup.vue';

export default {
  name: "App",
  components: {
    HomeHeaderView,
    PostEdit,
    ImagePreview,
    AddFollowShowGroup,
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
          store.dispatch("setWebSocket");
          setInterval(() => {
            store.dispatch("setWebSocket");
          }, 50 * 1000);
        },
      });
      return;
    }

    let accessToken = localStorage.getItem("access_token");
    let refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken != undefined && refreshToken != "" && accessToken != undefined && accessToken != "") {
      store.commit("updateUserId");
      store.dispatch("refreshAccessTokenInterval", {
        First: true,
        AccessToken: accessToken,
        RefreshToken: refreshToken
      });
      store.dispatch("getUserInfoByUserId", {
        async: false,
        success() {
          store.dispatch("setWebSocket");
          setInterval(() => {
            store.dispatch("setWebSocket");
          }, 50 * 1000);
        },
        error(message) {
          alert(message);
        }
      });
    }
  },
}
</script>


<style>
.btn {
    cursor: pointer;
    transition: 0.3s all;
}
.btn:active {
    transform: scale(0.9);
}
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>

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
  margin-top: 40px;
}
</style>
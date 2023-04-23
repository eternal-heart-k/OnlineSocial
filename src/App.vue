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
  <FeedbackShow />
</template>

<script>
import HomeHeaderView from './views/HomeHeaderView.vue';
import { useStore } from 'vuex';
import router from '@/router/index';
import PostEdit from './components/post/PostEdit.vue';
import ImagePreview from './components/ImagePreview';
import AddFollowShowGroup from './components/follow/AddFollowShowGroup.vue';
import { ElMessage } from 'element-plus';
import FeedbackShow from './components/FeedbackShow.vue';

export default {
  name: "App",
  components: {
    HomeHeaderView,
    PostEdit,
    ImagePreview,
    AddFollowShowGroup,
    FeedbackShow,
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
          store.dispatch("setWebSocket", {
            success() {
            }
          });
          setInterval(() => {
            store.dispatch("setWebSocket", {
              success() {
              }
            });
          }, 50 * 1000);
          store.dispatch("refreshMessagePage");
          if (store.state.user.isAdmin) { // 是管理员，其他消息是收到的反馈列表
            store.dispatch("getFeedbackNotReadCount", {
              success(result) {
                store.commit("setFeedbackNotReadCount", result);
              },
              error(message) {
                ElMessage.error(message);
              }
            });
            store.dispatch("getFeedbackList", {
              param: {
                PageIndex: 1,
                PageSize: 20,
                IsForAdmin: true
              },
              success(result) {
                result["SelectType"] = null;
                store.commit("refreshFeedbackList", result);
              },
              error(message) {
                ElMessage.error(message);
              }
            });
          }
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
          store.dispatch("setWebSocket", {
            success() {
            }
          });
          setInterval(() => {
            store.dispatch("setWebSocket", {
              success() {
              }
            });
          }, 50 * 1000);
          store.dispatch("refreshMessagePage");
          if (store.state.user.isAdmin) { // 是管理员，其他消息是收到的反馈列表
            store.dispatch("getFeedbackNotReadCount", {
              success(result) {
                store.commit("setFeedbackNotReadCount", result);
              },
              error(message) {
                ElMessage.error(message);
              }
            });
            store.dispatch("getFeedbackList", {
              param: {
                PageIndex: 1,
                PageSize: 20,
                IsForAdmin: true
              },
              success(result) {
                result["SelectType"] = null;
                store.commit("refreshFeedbackList", result);
              },
              error(message) {
                ElMessage.error(message);
              }
            });
          }
        },
        error(message) {
          ElMessage.error(message);
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
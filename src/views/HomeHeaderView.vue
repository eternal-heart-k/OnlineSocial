<template>
  <el-row class="all-in">
    <el-col :span="6">
      <div class="center left">
        <el-input clearable class="serch-input" placeholder="搜索动态或用户" v-model="searchContent" @keyup.enter="search" :prefix-icon="Search"/>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="center">
        <div class="box center">
          <el-link class="no-select btn" type="primary" :underline="false" target="_blank" :style="{ 'font-size': '17px' }" @click="toHome">首页</el-link>
        </div>
        <div class="box center">
          <router-link :to="{name: 'hot' }">
            <el-link class="no-select btn" type="primary" :underline="false" target="_blank" :style="{ 'font-size': '17px' }" @click="goToHotPage(false)">热门</el-link>
          </router-link>
        </div>
        <div class="box center">
          <router-link :to="{name: 'myFollow' }">
            <el-link class="no-select btn" type="primary" :underline="false" target="_blank" :style="{ 'font-size': '17px' }" @click="goToHotPage(true)">关注</el-link>
          </router-link>
        </div>
        <div class="box center">
          <router-link :to="{name: 'message' }">
            <el-badge :is-dot="hasNotReadMessage">
              <el-icon class="btn" :size="27" color="black" @click="goToMessagePage"><Message /></el-icon>
            </el-badge>
          </router-link>
        </div>
        <div class="box center">
          <router-link :to="{name: 'userProfile' }">
            <el-avatar class="btn" :size="35" :src="avatarUrl" />
          </router-link>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="center">
        <div class="box center">
          <el-icon class="btn" :size="25" @click="ShowEditPost"><Edit /></el-icon>
        </div>
        <div class="box center">
          <el-icon class="btn" :size="25" @click="ShowEditFeedback"><Promotion /></el-icon>
        </div>
        <div v-if="isLogin" class="box center">
          <el-link class="no-select btn" type="primary" :underline="false" target="_blank" @click="LogOut" :style="{ 'font-size': '17px' }">登出</el-link>
        </div>
        <div v-if="!isLogin" class="box center">
          <router-link :to="{name: 'login' }">
            <el-link class="no-select btn" type="primary" :underline="false" target="_blank" :style="{ 'font-size': '17px' }" @click="loginShow">登录</el-link>
          </router-link>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { Message, Edit, Promotion } from "@element-plus/icons";
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { ElMessageBox, ElMessage } from 'element-plus';
import $ from 'jquery';
import { Search } from '@element-plus/icons-vue';
import router from '../router';

export default {
  name: "HomeHeaderView",
  components: {
    Message,
    Edit,
    Promotion, 
  },
  setup() {
    const store = useStore();
    let searchContent = ref("");
    let avatarUrl = computed(() => store.state.user.avatarUrl);
    let isLogin = computed(() => store.state.user.isLogin);
    const search = () => {
      if (!store.state.user.isLogin) {
        ElMessage.error("暂未登录，请先登录");
        return;
      }
      if (searchContent.value == "") {
        return;
      }
      router.push({name: "hot"});
      store.commit("updateSearchContent", searchContent.value);
      store.commit("clearHotPostList");
      store.commit("updateHotPostLoading", true);
      store.dispatch("getPostList", {
        param: {
          MyUserId: store.state.user.userId,
          PageIndex: 1,
          PostOrderType: 0,
          CommentOrderType: 0,
          RangeType: store.state.post.hotRangeType,
          IsRead: true,
          Content: searchContent.value
        },
        success(result) {
          store.commit("updateHotPostLoading", false);
          if (result.Items.length == 0) {
            store.commit("updateHotPostNoMore", true);
          } else {
            store.commit("refreshHotPostList", result.Items);
          }
        },
        error(message) {
          store.commit("updateHotPostLoading", false);
          ElMessage.error(message);
        }
      });
      store.dispatch("getSearchUserList", {
        param: {
          PageIndex: 1,
          PageSize: 5,
          MyUserId: store.state.user.userId,
          Content: searchContent.value
        },
        success(result) {
          store.commit("refreshHotUserList", result);
        },
        error(message) {
          ElMessage.error(message);
        }
      });
    };
    const ShowEditPost = () => {
      if (!store.state.user.isLogin) {
          ElMessage.error("暂未登录，请先登录");
          return;
      }
      store.dispatch("updatePostEditShow", {
        Status: true
      });
    };
    const ShowEditFeedback = () => {
      if (!store.state.user.isLogin) {
        ElMessage.error("暂未登录，请先登录");
          return;
      }
      store.commit("updateFeedbackDialogVisibleStatus", true);
    };
    const LogOut = () => {
      ElMessageBox.confirm('确认退出么？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customStyle: {
            width: '300px'
        }
      }).then(() => {
        // 点击确定按钮后执行的操作
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        location.reload();
        $(".login_module").hide();
      }).catch(() => {
        // 点击取消按钮后执行的操作
      });
    };
    const loginShow = () => {
      store.commit("updateLoginPageVisible", true);
    };
    const goToHotPage = (isFollowedUserPost) => {
      if (!store.state.user.isLogin) {
        ElMessage.error("暂未登录，请先登录");
        return;
      }
      store.commit("updateSearchContent", "");
      store.commit("updateHotPostLoading", true);
      store.commit("updateHotPostNoMore", false);
      store.commit("clearHotPostList");
      store.dispatch("getPostList", {
        param: {
          MyUserId: store.state.user.userId,
          PageIndex: 1,
          PostOrderType: 0,
          CommentOrderType: 0,
          RangeType: store.state.post.hotRangeType,
          IsRead: true,
          IsFollowedUserPost: isFollowedUserPost
        },
        success(result) {
          if (result.Items.length == 0) {
            store.commit("updateHotPostNoMore", true);
          }
          store.commit("updateHotPostLoading", false);
          store.commit("refreshHotPostList", result.Items);
        },
        error(message) {
          store.commit("updateHotPostLoading", false);
          ElMessage.error(message);
        }
      });
      store.dispatch("getHotUserList", {
        param: {
          PageIndex: 1,
          PageSize: 5,
          MyUserId: store.state.user.userId
        },
        success(result) {
          store.commit("refreshHotUserList", result);
        },
        error(message) {
          ElMessage.error(message);
        }
      });
    };
    const goToMessagePage = () => {
      store.dispatch("refreshMessagePage");
    };
    let hasNotReadMessage = computed({
      get() {
        for (let i = 0; i < 2; i ++ ) {
          if (store.state.message.messageNotifyNotReadCount[i] > 0) {
            return true;
          }
        }
        if (store.state.user.isAdmin && store.state.feedback.feedbackMessageNotifyNotReadCount > 0) {
          return true;
        } else if (!store.state.user.isAdmin && store.state.message.messageNotifyNotReadCount[2] > 0) {
          return true;
        }
        for (let item of store.state.message.chatUserList) {
          if (item.NotReadCount > 0) {
            return true;
          }
        }
        return false;
      },
      set() {
      }
    });
    const toHome = () => {
      location.href = "/onlinesocial/";
    };
    return {
      search,
      ShowEditPost,
      ShowEditFeedback,
      LogOut,
      loginShow,
      goToHotPage,
      goToMessagePage,
      toHome,
      searchContent,
      avatarUrl,
      isLogin,
      hasNotReadMessage,
      Search,
    }
  },
}
</script>

<style scoped>
.all-in {
  width: 100%;
  height: 100%;
}
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.serch-input {
  width: 70%;
}
.box {
  width: 15%;
  height: 100%;
}
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
a{
  text-decoration: none;
}
</style>
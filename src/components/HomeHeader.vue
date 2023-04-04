<template>
  <el-row class="all-in">
    <el-col :span="6">
      <div class="center left">
        <el-input class="serch-input" placeholder="搜索动态或用户" v-model="searchContent" @keyup.enter="Search" />
      </div>
    </el-col>
    <el-col :span="12">
      <div class="center">
        <div class="box center">
          <el-link type="primary" :underline="false" target="_blank" @click="ShowHotPost">热门</el-link>
        </div>
        <div class="box center">
          <el-link type="primary" :underline="false" target="_blank" @click="ShowFollowPost">关注</el-link>
        </div>
        <div class="box center">
          <el-icon class="btn" :size="25" @click="ShowMessage"><Message /></el-icon>
        </div>
        <div class="box center">
          <el-avatar class="btn" :size="35" :src="avatarUrl" @click="ShowMyselfProfile"/>
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
          <el-link type="primary" :underline="false" target="_blank" @click="LogOut">登出</el-link>
        </div>
        <div v-if="!isLogin" class="box center">
          <el-link type="primary" :underline="false" target="_blank" @click="LogIn">登录</el-link>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { Message, Edit, Promotion } from "@element-plus/icons";
import $ from 'jquery';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "HomeHeader",
  setup() {
    const store = useStore();
    let searchContent = ref('');
    let avatarUrl = computed(() => store.state.user.avatarUrl);
    let isLogin = computed(() => store.state.user.isLogin);
    const Search = () => {
      if (searchContent.value == "") {
        return;
      }
      alert(searchContent.value);
    };
    const ShowHotPost = () => {
      alert("热门动态");
    };
    const ShowFollowPost = () => {
      alert("关注人动态");
    };
    const ShowMessage = () => {
      alert("消息来了");
    };
    const ShowMyselfProfile = () => {
      alert("个人空间");
    };
    const ShowEditPost = () => {
      alert("编辑动态");
    };
    const ShowEditFeedback = () => {
      alert("用户反馈");
    };
    const LogOut = () => {
      store.commit("logOut");
    };
    const LogIn = () => {
      $('.login_module').show();
    }
    return {
      Search,
      ShowHotPost,
      ShowFollowPost,
      ShowMessage,
      ShowMyselfProfile,
      ShowEditPost,
      ShowEditFeedback,
      LogOut,
      LogIn,
      searchContent,
      avatarUrl,
      isLogin,
    }
  },
  components: {
    Message,
    Edit,
    Promotion,
  }
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
</style>
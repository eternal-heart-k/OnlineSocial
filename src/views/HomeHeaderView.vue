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
          <router-link :to="{name: 'home' }">
            <el-link class="no-select" type="primary" :underline="false" target="_blank">首页</el-link>
          </router-link>
        </div>
        <div class="box center">
          <router-link :to="{name: 'hot' }">
            <el-link class="no-select" type="primary" :underline="false" target="_blank">热门</el-link>
          </router-link>
        </div>
        <div class="box center">
          <router-link :to="{name: 'myFollow' }">
            <el-link class="no-select" type="primary" :underline="false" target="_blank">关注</el-link>
          </router-link>
        </div>
        <div class="box center">
          <el-icon class="btn" :size="25" @click="messageShow"><Message /></el-icon>
        </div>
        <div class="box center">
          <router-link :to="{name: 'userProfile' }">
            <el-avatar class="btn" :size="35" :src="avatarUrl"/>
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
          <el-link class="no-select" type="primary" :underline="false" target="_blank" @click="LogOut">登出</el-link>
        </div>
        <div v-if="!isLogin" class="box center">
          <router-link :to="{name: 'login' }">
            <el-link class="no-select" type="primary" :underline="false" target="_blank">登录</el-link>
          </router-link>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { Message, Edit, Promotion } from "@element-plus/icons";
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from "vue-router";
import { ElMessageBox } from 'element-plus';

export default {
  name: "HomeHeaderView",
  setup() {
    const store = useStore();
    const router = useRouter();
    let searchContent = ref('');
    let avatarUrl = computed(() => store.state.user.avatarUrl);
    let isLogin = computed(() => store.state.user.isLogin);
    const Search = () => {
      if (searchContent.value == "") {
        return;
      }
      alert(searchContent.value);
    };
    const messageShow = () => {
      router.push({name: 'message'});
    };
    const ShowEditPost = () => {
      alert("编辑动态");
    };
    const ShowEditFeedback = () => {
      alert("用户反馈");
    };
    const LogOut = () => {
      ElMessageBox.confirm('确认退出么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customStyle: {
            width: '300px'
        }
      }).then(() => {
        // 点击确定按钮后执行的操作
        store.commit("logOut");
      }).catch(() => {
        // 点击取消按钮后执行的操作
      });
    };
    return {
      Search,
      messageShow,
      ShowEditPost,
      ShowEditFeedback,
      LogOut,
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
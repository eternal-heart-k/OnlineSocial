<template>
  <el-container>
    <el-main>
      <HomeMainView />
    </el-main>
  </el-container>
</template>

<script>
import HomeMainView from './HomeMainView.vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';

export default {
  name: 'HomeView',
  components: {
    HomeMainView,
  },
  beforeCreate() {
    const store = useStore();
    if (!store.state.user.isLogin) return;
    store.dispatch("getUserInfoByUserId", {
        success() {
          store.dispatch("getHotUserList", {
            param: {
              PageIndex: 1,
              MyUserId: store.state.user.userId,
              PageSize: 5
            },
            success(result) {
                store.commit("refreshHotUserList", result);
            },
            error(message) {
                ElMessage.error(message);
            }
          });
        },
        error(message) {
          ElMessage.error(message);
        }
    });
  },
}
</script>

<style scoped>

</style>
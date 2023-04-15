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
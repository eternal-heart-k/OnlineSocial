<template>
  <el-container>
    <el-main>
      <HomeMainView />
    </el-main>
  </el-container>
</template>

<script>
import HomeMainView from './HomeMainView.vue';

export default {
  name: 'HomeView',
  mounted() {
    
  },
  components: {
    HomeMainView,
  }
}
</script>

<style scoped>

</style>
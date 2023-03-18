<template>
  <el-container>
    <el-header class="header">
      <HomeHeader />
    </el-header>
    <el-main>
      <HotMain />
    </el-main>
  </el-container>
</template>

<script>
import HomeHeader from '@/components/HomeHeader.vue';
import HotMain from '@/components/HotMain.vue';

export default {
  name: 'HomeView',
  mounted() {
    
  },
  setup() {
    
  },
  components: {
    HomeHeader,
    HotMain,
  }
}
</script>

<style scoped>
.header {
  box-shadow: 0px 4px 8px rgba(0,0,0,.1);
}
</style>
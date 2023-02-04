<template>
  <img id="qq_login_img" src="../assets/logo.png" alt="qq" @click="qq_login($event)">
</template>

<script>
import { useStore } from 'vuex';
import router from '@/router';

export default {
  name: 'QQLogin',
  setup() {
    const store = useStore();
    const qq_login = (event) => {  
      // 这里可以访问 DOM 原生事件
      if (event) {
        event.preventDefault();
      }
      console.log(event);
      store.dispatch("login", {
          success(resp) {
            router.push({name: 'home'});
            console.log(resp);
          },
          error() {
            console.log("失败了")
          },
      });
    };
    return {
      qq_login,
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#qq_login_img {
  cursor: pointer;
  display: block;
  margin: auto;
  margin-top: 15%;
}
</style>

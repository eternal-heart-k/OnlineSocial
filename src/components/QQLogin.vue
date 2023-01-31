<template>
  <img id="qq_login_img" src="../assets/logo.png" alt="qq" @click="qq_login($event)">
</template>

<script>

export default {
  name: 'QQLogin',
  methods: {
    qq_login(event) {
      // 这里可以访问 DOM 原生事件
      if (event) {
        event.preventDefault();
      }
      console.log(event);
      this.$router.push({name: 'home'});
    }
}
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
